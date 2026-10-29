// The Jewish Mutual — protected intake endpoint.
// All real inserts are performed server-side, with a private Supabase key.
// Only pj_* intake tables are eligible: Hamsa Nomads is never touched.
const URL=Deno.env.get("SUPABASE_URL")||"";
const SECRET=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const CF_SITE=Deno.env.get("JM_TURNSTILE_SITE_KEY")||"";
const CF_SECRET=Deno.env.get("JM_TURNSTILE_SECRET_KEY")||"";
const ORIGIN="https://lschacht99.github.io";
const EMAIL=/^[^\s@<>]{1,80}@[^\s@<>]{1,160}\.[^\s@<>]{2,}$/;
const SOURCES=/^(jm-home-discovery|jewish-mutual-[a-z0-9-]{1,85})$/;
const VALID_TABLES=["pj_interest_shortlists","pj_applications","pj_inquiries"] as const;
type Table=typeof VALID_TABLES[number];
const res=(status:number,data:Record<string,unknown>)=>new Response(JSON.stringify(data),{
 status,headers:{"Content-Type":"application/json","Cache-Control":"no-store",
 "Access-Control-Allow-Origin":ORIGIN,"Vary":"Origin"}
});
const bad=(status:number,code:string)=>res(status,{error:code});
const text=(x:unknown,max:number)=>typeof x==="string"?x.trim().slice(0,max):"";
const list=(x:unknown,max:number)=>Array.isArray(x)?
  [...new Set(x.filter(v=>typeof v==="string").map(v=>v.trim()).filter(Boolean))].slice(0,max)
    .map(v=>v.slice(0,120)): [];
function validated(table:Table,raw:Record<string,unknown>){
 if(raw.website)return null; // Honeypot, never let it reach the database.
 const email=text(raw.email,254).toLowerCase();
 if(!EMAIL.test(email))return null;
 if(table==="pj_interest_shortlists"){
   const full_name=text(raw.full_name,150);
   const idea_ids=list(raw.idea_ids,12);
   if(raw.consent!==true||!full_name||!idea_ids.length||raw.source!=="jm-home-discovery")return null;
   return {email,full_name,idea_ids,location:text(raw.location,150)||null,
     stage:text(raw.stage,60)||null,consent:true,source:"jm-home-discovery"};
 }
 if(table==="pj_inquiries"){
   const full_name=text(raw.full_name,150),message=text(raw.message,1950);
   if(!full_name||message.length<5||!SOURCES.test(text(raw.source,100)))return null;
   return {email,full_name,message,source:text(raw.source,100)};
 }
 const first_name=text(raw.first_name,100),last_name=text(raw.last_name,100);
 if(!first_name||!last_name||raw.privacy_ack!==true)return null;
 const role=text(raw.role,20);
 if(!["mentee","mentor","both"].includes(role))return null;
 const source=text(raw.source,100);
 if(!SOURCES.test(source))return null;
 return {
   email,first_name,last_name,role,source,privacy_ack:true,
   community:text(raw.community,190)||null,field:text(raw.field,195)||null,
   stage:text(raw.stage,95)||null,
   goals:text(raw.goals,2900)||null,
   help_needed:text(raw.help_needed,1450)||null,
   help_offered:text(raw.help_offered,1450)||null,
   preferred_contact:"email",
   mentor_capacity:text(raw.mentor_capacity,120)||null,
   experience_ids:list(raw.experience_ids,12)
 };
}
const headers=()=>({"apikey":SECRET,"Authorization":"Bearer "+SECRET,"Content-Type":"application/json"});
async function db(path:string,body:Record<string,unknown>){
 const r=await fetch(URL+"/rest/v1/"+path,{
   method:"POST",headers:{...headers(),Prefer:"return=minimal"},body:JSON.stringify(body)
 });
 if(!r.ok)throw new Error("database_"+r.status);
 return r;
}
async function digest(s:string){
 const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(SECRET+":"+s));
 return Array.from(new Uint8Array(buf),v=>v.toString(16).padStart(2,"0")).join("");
}
async function validateCaptcha(token:string,remoteip:string){
 if(!CF_SECRET||!CF_SITE)return false;
 if(!token||token.length>2048)return false;
 const control=new AbortController(),timer=setTimeout(()=>control.abort(),8000);
 try{
   const data=new FormData();
   data.set("secret",CF_SECRET);data.set("response",token);
   if(remoteip)data.set("remoteip",remoteip);
   const r=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",
     {method:"POST",body:data,signal:control.signal});
   if(!r.ok)return false;
   const v=await r.json();
   // Hostname and action checks prevent accepting tokens from unrelated widgets.
   return v?.success===true &&
     v.hostname==="lschacht99.github.io" && v.action==="jm_intake";
 }finally{clearTimeout(timer)}
}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS"){
   const origin=req.headers.get("Origin");
   if(origin!==ORIGIN)return bad(403,"origin_not_allowed");
   return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":ORIGIN,
    "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type, apikey, authorization",
    "Access-Control-Max-Age":"3600","Vary":"Origin"}});
 }
 if(req.method==="GET"){
   return res(200,{captcha_required:Boolean(CF_SITE&&CF_SECRET),
     site_key:CF_SITE&&CF_SECRET?CF_SITE:null});
 }
 if(req.method!=="POST")return bad(405,"method_not_allowed");
 if(req.headers.get("Origin")!==ORIGIN)return bad(403,"origin_not_allowed");
 if(!URL||!SECRET)return bad(503,"service_unavailable");
 if(Boolean(CF_SITE)!==Boolean(CF_SECRET))return bad(503,"captcha_setup_incomplete");
 if(!req.headers.get("Content-Type")?.startsWith("application/json"))return bad(415,"json_required");
 let request:Record<string,unknown>;
 try{
   const raw=await req.text();
   if(raw.length>16000)return bad(413,"request_too_large");
   request=JSON.parse(raw);
   if(!request||Array.isArray(request)||typeof request!=="object")return bad(400,"invalid_request");
 }catch{return bad(400,"invalid_json")}
 const table=request.table;
 if(typeof table!=="string"||!VALID_TABLES.includes(table as Table))return bad(400,"invalid_form");
 const payload=validated(table as Table,request.data as Record<string,unknown>||{});
 if(!payload)return bad(422,"invalid_fields");
 // These IP headers are provided by edge ingress. Treat as best-effort abuse signals,
 // not identity or proof of user authenticity. Never store raw addresses.
 const ip=(req.headers.get("cf-connecting-ip")||
   req.headers.get("x-real-ip")||
   (req.headers.get("x-forwarded-for")||"").split(",")[0]).trim().slice(0,90);
 if(CF_SITE&&CF_SECRET){
   let good=false;
   try{good=await validateCaptcha(text(request.turnstile_token,2048),ip)}
   catch{return bad(503,"verification_unavailable")}
   if(!good)return bad(403,"verification_failed");
 }
 try{
   const ipHash=ip?await digest("ip:"+ip):null;
   const emailHash=await digest("email:"+payload.email);
   const quota=await fetch(URL+"/rest/v1/rpc/pj_claim_intake_quota",{
     method:"POST",headers:headers(),
     body:JSON.stringify({p_ip_hash:ipHash,p_email_hash:emailHash})
   });
   if(!quota.ok)throw new Error("quota_failed");
   if(await quota.json()!==true)return bad(429,"too_many_requests");
   await db(table,payload);
   return res(200,{ok:true});
 }catch(err){
   console.error("JM intake failure",err instanceof Error?err.message:"unknown");
   return bad(503,"submission_unavailable");
 }
});
