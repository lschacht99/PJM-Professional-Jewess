(()=>{'use strict';
const menu=document.querySelector('#navLinks'),toggle=document.querySelector('#menuToggle');
toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu?.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}});
const chips=[...document.querySelectorAll('[data-filter]')];
chips.forEach(chip=>chip.addEventListener('click',()=>{const category=chip.dataset.filter;chips.forEach(c=>{c.classList.toggle('active',c===chip);c.setAttribute('aria-pressed',String(c===chip))});document.querySelectorAll('[data-type]').forEach(card=>{card.hidden=category!=='all' && card.dataset.type!==category})}));
const roleButtons=[...document.querySelectorAll('[data-role]')];
function setRole(role){roleButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.role===role)));document.querySelectorAll('[data-visible]').forEach(el=>{const accepted=el.dataset.visible.split(',').map(x=>x.trim());el.hidden=!accepted.includes(role)});const roleInput=document.querySelector('[name=participation_role]');if(roleInput)roleInput.value=role}
roleButtons.forEach(b=>b.addEventListener('click',()=>setRole(b.dataset.role)));
if(roleButtons.length){const param=new URLSearchParams(window.location.search).get('role');setRole(roleButtons.some(b=>b.dataset.role===param)?param:'seek')}
// An opportunity card can preselect a field on the private preview form.
const qp=new URLSearchParams(window.location.search),topic=qp.get('interest');
if(topic&&document.querySelector('#jfield')){
  document.querySelector('#jfield').value=topic.slice(0,140);
  const box=document.querySelector('#formTopic'),lab=document.querySelector('#formTopicLabel');
  if(box&&lab){lab.textContent=topic.slice(0,140);box.hidden=false}
}
if(chips.length){
 const category=qp.get('category');
 if(category){const btn=chips.find(c=>c.dataset.filter===category);btn?.click()}
 const updateCount=()=>{const el=document.querySelector('#filterCount');if(el){const count=document.querySelectorAll('[data-type]:not([hidden])').length;el.textContent=count+' '+(count===1?'format':'formats')+' displayed'}};
 chips.forEach(chip=>chip.addEventListener('click',updateCount));updateCount();
}

})();


/* Version 5: local-only exploration and form preview. No remote requests. */
(()=>{'use strict';
const fieldButtonMap={
'Architecture & built environment':'Architecture & built environment',
'Engineering & technology':'Engineering & technology',
'Medicine & science':'Medicine & science',
'Business & entrepreneurship':'Business & entrepreneurship',
'Law & policy':'Law & policy',
'Creative & media':'Creative & media'
};
const interestTool=document.querySelector('[data-interest-tool]');
if(interestTool){const chips=[...interestTool.querySelectorAll('[data-field]')],next=interestTool.querySelector('.v5-explorer-next');
const selected=()=>chips.filter(x=>x.getAttribute('aria-pressed')==='true').map(x=>x.dataset.field);
chips.forEach(chip=>chip.addEventListener('click',()=>{chip.setAttribute('aria-pressed',String(chip.getAttribute('aria-pressed')!=='true'));const fields=selected();next.href='join.html?role=seek'+(fields.length?'&fields='+encodeURIComponent(fields.join('|')):'');const text=next.querySelector('[data-interest-continue]');if(text)text.textContent=fields.length?`Continue with ${fields.length} interest${fields.length===1?'':'s'}`:'Continue with my interests'}));}
const search=document.querySelector('[data-op-search]'),typeButtons=[...document.querySelectorAll('[data-op-type]')],cards=[...document.querySelectorAll('[data-program]')];
if(cards.length){let type='all';const update=()=>{let visible=0;const term=(search?.value||'').trim().toLowerCase();cards.forEach(card=>{const matchesType=type==='all'||card.dataset.kind===type;const matchesSearch=!term||(card.dataset.tags+' '+card.innerText).toLowerCase().includes(term);card.hidden=!(matchesType&&matchesSearch);if(!card.hidden)visible++});const count=document.querySelector('#v5Count');if(count)count.textContent=`${visible} possible experience${visible===1?'':'s'} shown · concepts and requests, not confirmed openings`;const empty=document.querySelector('#v5Empty');if(empty)empty.hidden=visible!==0};typeButtons.forEach(btn=>btn.addEventListener('click',()=>{type=btn.dataset.opType;typeButtons.forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});update()}));search?.addEventListener('input',update);update()}
const qs=new URLSearchParams(location.search);
const formChecks=[...document.querySelectorAll('[name="field_interest"]')];
if(formChecks.length){const multiple=(qs.get('fields')||'').split('|').filter(Boolean);const single=qs.get('interest');
for(const f of multiple){const input=formChecks.find(x=>x.value===f);if(input)input.checked=true;else{const other=document.querySelector('#jfield');if(other)other.value=[other.value,f].filter(Boolean).join(', ')}}
if(single){let mapped=Object.keys(fieldButtonMap).find(k=>single.toLowerCase().includes(k.toLowerCase()));if(!mapped){const term=single.toLowerCase();if(term.includes('architecture'))mapped='Architecture & built environment';else if(term.includes('engineer'))mapped='Engineering & technology';else if(term.includes('medical')||term.includes('medicine'))mapped='Medicine & science';else if(term.includes('business')||term.includes('entrepreneur'))mapped='Business & entrepreneurship';else if(term.includes('law'))mapped='Law & policy'}const matched=formChecks.find(x=>x.value===mapped);if(matched)matched.checked=true;else document.querySelector('#jfield').value=single.slice(0,140)}
const hint=document.querySelector('#formTopic');if(hint&&(single||multiple.length)){hint.hidden=false;const label=document.querySelector('#formTopicLabel');if(label)label.textContent=[...multiple,...(single&&!multiple.includes(single)?[single]:[])].join(', ')} }
const contribution=qs.get('contribution');if(contribution){const options=[...document.querySelectorAll('#inquiry [name="contribution_type"]')];let found;if(/visit/i.test(contribution))found=options.find(x=>/visit/i.test(x.value));if(/conversation/i.test(contribution))found=options.find(x=>/conversation/i.test(x.value));if(/project/i.test(contribution))found=options.find(x=>/project/i.test(x.value));if(found)found.checked=true}

})();


/* Secure insert-only submissions to the existing protected pilot tables. */
(()=>{'use strict';
const API='https://vvveenntewwtyhnmimal.supabase.co/rest/v1/';
const KEY='sb_publishable_-ydn9Mgc5B0Sqw4Qh6zfdg_46FQy87z';
const limit=(v,n=500)=>String(v||'').trim().slice(0,n);
const val=(f,n)=>limit(f.elements.namedItem(n)?.value||'',1800);
const selected=(f,n)=>[...f.querySelectorAll(`input[name="${n}"]:checked`)].map(x=>x.value);
const post=async(table,data)=>{const r=await fetch(API+table,{method:'POST',mode:'cors',credentials:'omit',headers:{'apikey':KEY,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(data)}); if(!r.ok)throw Error('Could not save: '+r.status)};
for(const form of document.querySelectorAll('form[data-preview]')){
form.removeAttribute('data-preview');
const status=form.querySelector('.form-state'),button=form.querySelector('[type="submit"]');
form.addEventListener('submit',async(e)=>{e.preventDefault();if(!form.reportValidity())return;
if(val(form,'website'))return;
const consent=form.elements.namedItem('privacy_ack');if(!consent?.checked){if(status)status.textContent='Please review the privacy notice and confirm your agreement.';return}
button.disabled=true;const label=button.innerHTML;button.textContent='Sending…';
if(status){status.textContent='Saving your message…';status.classList.add('visible')}
try{
if(form.hasAttribute('data-contact-form')){
const name=limit(form.querySelector('#cname')?.value,150),email=limit(form.querySelector('#cemail')?.value,254),subject=limit(form.querySelector('#csubject')?.value,120),message=limit(form.querySelector('#cmessage')?.value,1400);
await post('pj_inquiries',{full_name:name,email,message:limit('[Website contact: '+subject+'] '+message,1950),source:'jewish-mutual-contact-2026'});
}else if(form.closest('#inquiry')){
const first=limit(form.querySelector('#pname')?.value,150),org=limit(form.querySelector('#porg')?.value,180),email=limit(form.querySelector('#pemail')?.value,254);
const role=limit(form.querySelector('#prole')?.value,120),loc=limit(form.querySelector('#ploc')?.value,120),detail=limit(form.querySelector('#pmessage')?.value,750);
const types=selected(form,'contribution_type'),settings=selected(form,'meeting_format');
await post('pj_inquiries',{full_name:first,email,message:limit(`[Partnership inquiry] Organization: ${org}. Role: ${role}. Location: ${loc}. Contribution interests: ${types.join(', ')}. Meeting options: ${settings.join(', ')}. Details: ${detail}`,1950),source:'jewish-mutual-partner-2026'});
}else{
const first=val(form,'jfirst'),last=val(form,'jlast'),email=val(form,'jemail'),role=val(form,'participation_role');
const city=val(form,'jcity'),fields=selected(form,'field_interest'),other=val(form,'jfield'),goals=val(form,'jgoal'),suggestion=val(form,'jsuggest');
const want=selected(form,'experience_type'),offerTypes=selected(form,'contribution_type');
const expert=val(form,'jexpert'),organization=val(form,'jorganization'),offer=val(form,'joffer');
const format=val(form,'jformat'),stage=val(form,'jstage'),contact=val(form,'jcontact');
if(role==='suggest'){
await post('pj_inquiries',{full_name:limit(first+' '+last,145),email:limit(email,254),message:limit(`[Experience idea] City: ${city}. Suggestion: ${suggestion}`,1950),source:'jewish-mutual-idea-2026'});
}else{
const receiving=role==='seek'||role==='both',giving=role==='offer'||role==='both';
const needed=receiving?limit(`Fields: ${[...fields,other].filter(Boolean).join(', ')}. Experiences: ${want.join(', ')}. Preferred location/format: ${format}. Goal: ${goals}`,1450):null;
const offered=giving?limit(`Organization: ${organization}. Professional role: ${expert}. Contributions: ${offerTypes.join(', ')}. Offer: ${offer}`,1450):null;
await post('pj_applications',{role:role==='both'?'both':receiving?'mentee':'mentor',first_name:limit(first,100),last_name:limit(last,100),email:limit(email,254),community:limit(city,190)||null,field:limit([fields[0],other,expert].filter(Boolean).join(' / '),195)||null,stage:limit(stage,95)||null,preferred_contact:'email',phone:null,whatsapp:null,help_needed:needed,help_offered:offered,mentor_capacity:giving?'As availability permits':null,goals:limit(`Path: ${role}. ${needed||''} ${offered||''} Contact preference: ${contact}.`,2900),privacy_ack:true,source:'jewish-mutual-site-2026'});
}}
form.reset();if(status)status.textContent='Thank you—your information has been saved. We’ll be in touch if there’s a relevant next step.';
}catch(err){console.error('Submission failed',err);if(status)status.textContent='We couldn’t save this just now. Please try again.';}
finally{button.disabled=false;button.innerHTML=label;if(status){status.classList.add('visible');status.setAttribute('tabindex','-1');status.focus()}}
});
}
})();

/* Shared interest-selection experience; carries multiple choices to the short form. */
(()=>{'use strict';
const explorer=document.querySelector('[data-jm-explorer]');
if(explorer){const chips=[...explorer.querySelectorAll('[data-jm-field]')],link=explorer.querySelector('.jm-explorer-next'),state=explorer.querySelector('.jm-explorer-state');function update(){const fields=chips.filter(el=>el.getAttribute('aria-pressed')==='true').map(el=>el.dataset.jmField);link.href='join.html?role=seek'+(fields.length?'&fields='+encodeURIComponent(fields.join('|')):'');state.textContent=fields.length?fields.length+' '+(fields.length===1?'interest selected':'interests selected')+'. You can change these on the next page.':'You can select more than one.';link.firstChild.textContent=fields.length?'Continue with '+fields.length+' '+(fields.length===1?'interest':'interests')+' ':'Continue with my interests '}
chips.forEach(el=>el.addEventListener('click',()=>{el.setAttribute('aria-pressed',String(el.getAttribute('aria-pressed')!=='true'));update()}));update()}
const field=document.querySelector('#jfield');
if(field){const params=new URLSearchParams(location.search),single=params.get('interest'),multi=(params.get('fields')||'').split('|').filter(Boolean);const chosen=multi.length?multi:single?[single]:[];if(chosen.length){field.value=chosen.join(', ').slice(0,140);const holder=document.querySelector('#formTopic'),label=document.querySelector('#formTopicLabel');if(holder&&label){holder.hidden=false;label.textContent=chosen.join(', ')}}}
})();