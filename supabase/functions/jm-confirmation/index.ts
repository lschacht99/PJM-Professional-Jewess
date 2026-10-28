// The Jewish Mutual confirmation dispatcher.
// Called only by a database trigger with a private, database-generated token.
// No sender credentials or applicant data are ever placed in browser JavaScript.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const RESEND_KEY = Deno.env.get("JM_RESEND_API_KEY") || "";
const FROM = Deno.env.get("JM_FROM_EMAIL") || "";
const REPLY_TO = Deno.env.get("JM_REPLY_TO_EMAIL") || "";
const TEAM_EMAIL = Deno.env.get("JM_TEAM_NOTIFY_EMAIL") || "";
const HOME = "https://lschacht99.github.io/PJM-Professional-Jewess/";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const sqlHeaders = () => ({
  apikey: SERVICE_KEY,
  Authorization: "Bearer " + SERVICE_KEY,
  "Content-Type": "application/json",
});
const answer = (status: number, result: string) =>
  new Response(JSON.stringify({ result }), {
    status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
const escapeHtml = (input: unknown): string =>
  String(input ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c);
const firstName = (value: unknown) => {
  const s = String(value || "").trim().slice(0, 75);
  return s && !/[<>]/.test(s) ? s : "there";
};
const safeEqual = (a: string, b: string) => {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
};
const titles: Record<string,string> = {
  "engineering-conversation": "Meet a Mechanical Engineer",
  "healthcare-conversation": "Interview a Nurse About Hospital Work",
  "business-conversation": "Interview a Founder About Their First Year",
  "law-conversation": "Interview a Lawyer About Daily Work",
  "team-challenge-lab": "Design a Foldable Sukkah",
  "graduate-conversation": "Ask a Graduate About Their First Job",
  "inside-an-engineers-day": "Meet a Mechanical Engineer",
  "career-interview": "Ask a Professional About Their Career",
  "data-detective": "Investigate Data with an Analyst",
  "impossible-sukkah": "Design a Foldable Sukkah with an Engineer",
  "design-for-everyone": "Design a More Accessible Everyday Product",
  "fix-the-failure": "Investigate a Product Failure with an Engineer",
  "break-the-bridge": "Build and Test a Model Bridge",
  "business-idea": "Test a Startup Idea with an Entrepreneur",
  "marketing-challenge": "Create a Marketing Campaign with a Marketer",
  "save-the-budget": "Solve a Business Budget Crisis",
  "technology-conversation": "Interview a Product Manager About App Design",
  "cybersecurity-crisis": "Respond to a Cybersecurity Incident",
  "trust-the-algorithm": "Audit an AI Model for Bias",
  "build-an-app": "Redesign an App with a UX Designer",
  "inside-care-team": "Improve a Patient Handoff with a Nurse",
  "you-be-the-lawyer": "Prepare a Legal Case with a Lawyer",
  "design-a-space": "Design a Flexible Room with an Architect",
  "ux-redesign": "Redesign a Confusing Website with a UX Designer",
  "design-conversation": "Interview a Designer About Their Work",
  "education-conversation": "Interview a Teacher About Classroom Life",
  "teach-it-better": "Practice Teaching a Short Lesson",
  "sunday-workroom": "Online Workroom: Study and Career Goals",
  "choose-your-major": "Plan Your Major with a Recent Graduate",
  "team-lab": "Project Management: Rescue an Event",
  "community-redesign": "Design a Small Space with an Architect",
  "product-sprint": "Interview a UX Designer About Apps",
  "fix-failure": "Mechanical Engineering: From CAD to Production",
  "care-team": "Healthcare: Fix a Patient Handoff",
  "health-research": "Interview a Nurse About Hospital Work",
  "idea-business": "Test a Startup Idea with an Entrepreneur",
  "budget-rescue": "Interview a Founder About Business Decisions",
  "be-lawyer": "Prepare a Legal Case with a Lawyer",
  "negotiation": "Interview a Lawyer About Daily Work",
  "college-decoded": "Plan College with a Recent Graduate",
  "internship": "Ask a Graduate About Their First Job",
};
function itemLabel(id: string): string {
  if (titles[id]) return titles[id];
  return id.slice(0,80).replace(/[^a-z0-9-]/gi,"").replace(/-/g," ").replace(/\b\w/g,(c)=>c.toUpperCase());
}
type Job = {
 id: string; kind: string; recipient_email: string; recipient_name: string;
 selected_idea_ids: string[]; attempts: number;
};
const definitions: Record<string,{subject:string;lead:string;note:string;action:string}> = {
 participant:{
  subject:"We received your career interests | The Jewish Mutual",
  lead:"We've received your interests in exploring different careers.",
  note:"We're developing our first career conversations and practical experiences. We'll contact you if a relevant opportunity takes shape.",
  action:"This is an acknowledgment of interest, not a confirmed place in a program.",
 },
 professional:{
  subject:"Thanks for offering your expertise | The Jewish Mutual",
  lead:"Thank you for offering to share your professional experience.",
  note:"We'll review your interests and reach out if there's a suitable way to collaborate. Any topic, format or time commitment will be agreed with you first.",
  action:"You are not committed to hosting or mentoring by submitting the form.",
 },
 volunteer:{
  subject:"We received your volunteer interest | The Jewish Mutual",
  lead:"Thank you for offering to help build The Jewish Mutual.",
  note:"We'll review the ways you can contribute and get in touch if there's a suitable opportunity.",
  action:"Submitting your interest does not commit you to an activity.",
 },
 workplace:{
  subject:"We received your career-visit request | The Jewish Mutual",
  lead:"We've received your interest in seeing a workplace up close.",
  note:"We'll use requests like yours to guide our outreach to professionals and organizations.",
  action:"No particular company, visit or date is currently confirmed by this request.",
 },
 contact:{
  subject:"We received your message | The Jewish Mutual",
  lead:"Your message has been received.",
  note:"Our team will review your inquiry. If a response is needed, we'll follow up by email.",
  action:"This email confirms receipt; it is not a response to your question.",
 },
 collaboration:{
  subject:"We received your inquiry | The Jewish Mutual",
  lead:"Thank you for getting in touch with The Jewish Mutual.",
  note:"We'll review what you shared and get back to you if there's a suitable next step.",
  action:"No project or commitment has been confirmed yet.",
 },
};
function template(job: Job){
 const variant=definitions[job.kind] || definitions.collaboration;
 const name=firstName(job.recipient_name);
 const selected=(Array.isArray(job.selected_idea_ids)?job.selected_idea_ids:[])
  .filter((id)=>typeof id==="string").slice(0,12).map(itemLabel);
 const items=selected.length ? selected.map((s)=>"<li style=\"padding:3px 0\">"+escapeHtml(s)+"</li>").join("") : "";
 const selectedSection=items ? '<div style="margin:22px 0;border:1px solid #dce5dd;border-radius:10px;padding:14px 19px;background:#fafaf6"><p style="margin:0 0 7px;font-weight:700;color:#1d478b">Your selected ideas</p><ul style="margin:0;padding-left:22px">'+items+"</ul></div>" : "";
 const html='<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f5f2ed;font-family:Arial,Helvetica,sans-serif;color:#2c4559"><div style="display:none;max-height:0;overflow:hidden">'+escapeHtml(variant.lead)+'</div><table role="presentation" style="border-collapse:collapse;width:100%;padding:24px 10px" cellpadding="0" cellspacing="0"><tr><td align="center"><table role="presentation" style="width:100%;max-width:560px;background:#ffffff;border-collapse:collapse;border:1px solid #e5e9e2" cellpadding="0" cellspacing="0"><tr><td style="padding:25px 30px 19px;border-bottom:3px solid #1d478b"><a href="'+HOME+'" style="text-decoration:none;color:#1d478b;font-size:22px;font-weight:750;letter-spacing:-.4px">the Jewish Mutual</a></td></tr><tr><td style="padding:27px 30px 30px"><p style="margin:0 0 13px;font-size:15px">Hi '+escapeHtml(name)+',</p><h1 style="font-family:Georgia,serif;font-size:27px;line-height:1.2;font-weight:normal;color:#1d478b;margin:0 0 18px">'+escapeHtml(variant.lead)+'</h1><p style="font-size:15px;line-height:1.65;margin:0 0 16px">'+escapeHtml(variant.note)+'</p>'+selectedSection+'<p style="font-size:13px;line-height:1.65;color:#5d7080;margin:14px 0 20px">'+escapeHtml(variant.action)+'</p><p style="font-size:14px;line-height:1.6;margin:0">Questions? <a href="'+HOME+'contact.html" style="color:#1d478b">Contact us</a>.</p></td></tr><tr><td style="background:#f3f5f1;padding:15px 30px;font-size:11px;line-height:1.6;color:#647581">The Jewish Mutual · Career exploration through real experiences<br><a style="color:#516781" href="'+HOME+'privacy.html">Privacy notice</a></td></tr></table></td></tr></table></body></html>';
 const text=["Hi "+name+",","",variant.lead,"",variant.note,
 ...(selected.length?["","Your selected ideas:",...selected.map((s)=>"• "+s)]:[]),
 "",variant.action,"","Questions? "+HOME+"contact.html","The Jewish Mutual · "+HOME].join("\n");
 return {subject:variant.subject,html,text};
}
async function db(path: string, init: RequestInit={}): Promise<unknown> {
 const r=await fetch(SUPABASE_URL+"/rest/v1/"+path,{
  ...init,headers:{...sqlHeaders(),...(init.headers || {})},
 });
 if (!r.ok) throw new Error("Database operation failed ("+r.status+")");
 const responseText=await r.text();
 return responseText ? JSON.parse(responseText) : null;
}
async function patchJob(id:string, changes:Record<string,unknown>, whereStatus?:string): Promise<Job[]> {
 const params="pj_mail_jobs?id=eq."+id+(whereStatus?"&status=eq."+whereStatus:"")+"&select=id,kind,recipient_email,recipient_name,selected_idea_ids,attempts";
 return await db(params,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(changes)}) as Job[];
}
async function sendResend(payload:Record<string,unknown>, idempotency:string) {
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),12000);
 try{
  const resp=await fetch("https://api.resend.com/emails",{
   method:"POST",signal:controller.signal,
   headers:{"Authorization":"Bearer "+RESEND_KEY,"Content-Type":"application/json","Idempotency-Key":idempotency},
   body:JSON.stringify(payload)
  });
  if(!resp.ok)throw new Error("Mail provider rejected request ("+resp.status+")");
  const body=await resp.json();
  if(!body?.id)throw new Error("Mail provider returned no message ID");
  return String(body.id);
 }finally{clearTimeout(timer)}
}
Deno.serve(async (req:Request)=>{
 if(req.method!=="POST")return answer(405,"method_not_allowed");
 if(!SUPABASE_URL||!SERVICE_KEY)return answer(503,"backend_not_configured");
 const provided=req.headers.get("x-jm-hook-token")||"";
 if(!/^[a-f0-9]{64}$/i.test(provided))return answer(401,"unauthorized");
 let settings;
 try{
  const values=await db("pj_mail_settings?id=eq.1&select=webhook_token,enabled");
  settings=Array.isArray(values)?values[0]:null;
 }catch{return answer(503,"configuration_unavailable")}
 if(!settings||!safeEqual(provided,settings.webhook_token))return answer(401,"unauthorized");
 if(!settings.enabled)return answer(503,"mail_not_enabled");
 if(!RESEND_KEY||!FROM||!EMAIL.test(FROM.replace(/^.*</,"").replace(/>$/,"")))
  return answer(503,"sender_not_configured");
 let id="";
 try{
  const raw=await req.text();
  if(raw.length>1500)return answer(413,"request_too_large");
  id=JSON.parse(raw).job_id;
 }catch{return answer(400,"invalid_json")}
 if(typeof id!=="string"||!UUID.test(id))return answer(400,"invalid_job_id");
 let claimed:Job[]=[];
 try{
  // Atomic claim: duplicate webhook requests cannot dispatch the same job twice.
  claimed=await patchJob(id,{status:"sending",claimed_at:new Date().toISOString()}, "queued");
 }catch{return answer(503,"unable_to_claim")}
 const job=claimed[0];
 if(!job)return answer(200,"already_processed");
 if(!EMAIL.test(job.recipient_email)||job.recipient_email.length>254){
  await patchJob(id,{status:"failed",last_error:"Invalid recipient address"});
  return answer(422,"invalid_recipient");
 }
 const email=template(job);
 try{
  const messageId=await sendResend({
   from:FROM,to:[job.recipient_email],
   ...(REPLY_TO&&EMAIL.test(REPLY_TO)?{reply_to:REPLY_TO}:{}),
   subject:email.subject,html:email.html,text:email.text
  },"jm-user-"+job.id);
  await patchJob(id,{status:"sent",sent_at:new Date().toISOString(),
    provider_message_id:messageId,last_error:null});
  // Optional separate staff notification. Never repeat or forward the applicant's free text.
  if(TEAM_EMAIL&&EMAIL.test(TEAM_EMAIL)){
   try{
    await sendResend({from:FROM,to:[TEAM_EMAIL],
     subject:"New "+job.kind+" inquiry · The Jewish Mutual",
     html:"<p>A new "+escapeHtml(job.kind)+" form was received.</p><p>Name: "+escapeHtml(job.recipient_name)+"<br>Email: "+escapeHtml(job.recipient_email)+"</p><p>Review the private Supabase intake tables for details.</p>",
     text:"New "+job.kind+" inquiry\n"+job.recipient_name+"\n"+job.recipient_email+"\nReview the private Supabase intake tables."
    },"jm-staff-"+job.id);
   }catch{ /* User confirmation has already succeeded; admin notifications are optional. */ }
  }
  return answer(200,"sent");
 }catch(err){
  const message=err instanceof Error?err.message:"Unknown mail failure";
  try{await patchJob(id,{status:"failed",last_error:message.slice(0,220)});}catch{}
  return answer(502,"delivery_failed");
 }
});
