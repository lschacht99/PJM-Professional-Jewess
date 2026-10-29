/* The Jewish Mutual safe form writer. No public direct database writes. */
(()=>{'use strict';
const ENDPOINT='https://vvveenntewwtyhnmimal.supabase.co/functions/v1/jm-intake';
let configPromise=null,scriptPromise=null;
const formState=new WeakMap();
function config(){
 if(!configPromise){
  configPromise=fetch(ENDPOINT,{method:'GET',mode:'cors',credentials:'omit'})
   .then(async r=>{if(!r.ok)throw new Error('Verification is temporarily unavailable.');
     const data=await r.json();if(typeof data.captcha_required!=='boolean')throw Error('Invalid gateway configuration.');
     return data});
  configPromise.catch(()=>{configPromise=null});
 }
 return configPromise;
}
function loadTurnstile(){
 if(window.turnstile)return Promise.resolve(window.turnstile);
 if(!scriptPromise){
  scriptPromise=new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
   script.async=true;script.defer=true;
   script.onerror=()=>reject(Error('Verification could not load. Please try another browser or network.'));
   script.onload=()=>{
    if(!window.turnstile){reject(Error('Verification did not initialize.'));return;}
    resolve(window.turnstile);
   };
   document.head.appendChild(script);
  });
  scriptPromise.catch(()=>{scriptPromise=null});
 }
 return scriptPromise;
}
async function tokenFor(form,sitekey){
 const turnstile=await loadTurnstile();
 if(!form||!form.isConnected)throw Error('Application form unavailable. Please refresh.');
 let info=formState.get(form);
 if(!info){
  const slot=document.createElement('div');slot.className='jm-verification-widget';
  slot.setAttribute('aria-label','Human verification');
  const submit=form.querySelector('[type=submit]');
  (submit?.parentNode||form).insertBefore(slot,submit||null);
  info={slot,widget:null};formState.set(form,info);
 }
 const state=info;
 return new Promise((resolve,reject)=>{
  let completed=false;
  const done=(error,value)=>{
   if(completed)return;completed=true;clearTimeout(timeout);
   error?reject(Error(error)):resolve(value);
  };
  const timeout=setTimeout(()=>done('Verification timed out. Please try again.'),120000);
  const options={
   sitekey,action:'jm_intake',theme:'auto',
   callback:token=>done(null,token),
   'error-callback':()=>done('Verification failed to load. Please refresh.'),
   'expired-callback':()=>done('Verification expired. Please submit again.')
  };
  try{
   if(state.widget===null)state.widget=turnstile.render(state.slot,options);
   else turnstile.reset(state.widget);
  }catch{done('Unable to start verification. Please refresh.')}
 });
}
async function submit(table,data,form){
 const cfg=await config();
 if(cfg.captcha_required&&!cfg.site_key)throw Error('Human verification is not configured.');
 const turnstile_token=cfg.captcha_required?await tokenFor(form,cfg.site_key):null;
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),30000);
 try{
  const r=await fetch(ENDPOINT,{method:'POST',mode:'cors',credentials:'omit',
    signal:ctrl.signal,headers:{'Content-Type':'application/json'},
    body:JSON.stringify({table,data,turnstile_token})
  });
  if(!r.ok){
   if(r.status===429)throw Error('Too many requests from this email or network. Please try again later.');
   if(r.status===403)throw Error('We could not verify this request. Please try again.');
   if(r.status===422)throw Error('Please check the application details and try again.');
   throw Error('Your form could not be saved. Please try again.');
  }
  return await r.json();
 }finally{clearTimeout(timer)}
}
window.JMSecureSubmit={submit};
})();
