/* Discovery explorer: browsing and saved ideas happen locally; email is submitted only with consent. */
(()=>{'use strict';
const catalog={
 "conversations": {
  "label": "CAREER CONVERSATIONS",
  "ideas": [
   {
    "id": "inside-an-engineers-day",
    "name": "Meet a Mechanical Engineer",
    "format": "Professional Q&A",
    "hook": "What does an engineer actually do between the first sketch and the finished product?",
    "pro": "Ask a working engineer about projects, mistakes, team decisions, and a typical workday.",
    "detail": "Come with questions; trace a product from design brief to testing through an engineer's perspective. Discuss what they studied, what surprised them, and how they work with other specialists.",
    "takeaway": "A sharper picture of engineering work—and questions worth asking before choosing the field."
   },
   {
    "id": "career-interview",
    "name": "Ask a Professional About Their Career",
    "format": "Professional interview",
    "hook": "The job title sounds interesting. What's the reality nobody mentions?",
    "pro": "Interview a professional about career turns, daily responsibilities, and what they wish they'd known.",
    "detail": "Start with your assumptions, prepare five good questions, and use a guided conversation to compare expectations with lived professional experience—including balancing a career with Jewish life where relevant.",
    "takeaway": "An honest career snapshot and your next three questions to explore."
   }
  ]
 },
 "cross": {
  "label": "TEAM EXPERIENCES",
  "ideas": [
   {
    "id": "team-lab",
    "name": "Project Management: Rescue an Event",
    "format": "Team project + professional feedback",
    "hook": "A community event is going off course. Make the case for your rescue plan.",
    "pro": "Present your proposed solution to a working project manager or organizer and ask how they'd prioritize.",
    "detail": "Split into research, project management, design and budget roles. Triage a fictional event crisis, plan a workable solution, and prepare a short brief a project manager could actually use.",
    "takeaway": "A real-world style project brief and insight into how teams make tradeoffs."
   },
   {
    "id": "community-redesign",
    "name": "Design a Small Space with an Architect",
    "format": "Design brief + professional Q&A",
    "hook": "One small room needs three different layouts. Can you make the space work?",
    "pro": "Ask an architect or designer how they balance safety, usability, budget and client feedback.",
    "detail": "Sketch a scaled layout for a community space, check accessibility and create a model or movable furniture plan. Explain your design choices to a professional reviewer.",
    "takeaway": "A space-planning concept and better questions about architecture/design careers."
   }
  ]
 },
 "tech": {
  "label": "TECHNOLOGY & DATA",
  "ideas": [
   {
    "id": "data-detective",
    "name": "Investigate Data with an Analyst",
    "format": "Data challenge + analyst discussion",
    "hook": "The graph looks excellent. Unfortunately, the numbers have other plans.",
    "pro": "Ask a data analyst how they catch flawed assumptions and explain findings to clients.",
    "detail": "Audit a fictional community dataset, find what was excluded, rebuild a trustworthy chart, and prepare one decision backed by evidence. Discuss your approach with a practitioner.",
    "takeaway": "A concise data story and a realistic view of analytical work."
   },
   {
    "id": "product-sprint",
    "name": "Interview a UX Designer About Apps",
    "format": "Product professional interview",
    "hook": "Who decides what an app should do—and what gets cut?",
    "pro": "Interview a product manager or UX designer about user research, priorities and their career path.",
    "detail": "Review a short sample product brief and bring questions to a guided conversation about how technology teams collaborate. Compare how design, software and business roles approach the same user problem.",
    "takeaway": "A clearer comparison of product, software and design careers."
   }
  ]
 },
 "engineering": {
  "label": "ENGINEERING & MAKING",
  "ideas": [
   {
    "id": "impossible-sukkah",
    "name": "Design a Foldable Sukkah with an Engineer",
    "format": "Prototype + engineer review",
    "hook": "A tiny courtyard. Almost no storage. Can you design a fold-up sukkah?",
    "pro": "Ask an engineer how they'd test stability, mechanisms and tradeoffs in a real prototype.",
    "detail": "Sketch a compact frame, prototype a moving joint and fan-test a scale model. Share your reasoning with an engineer and learn how engineers evaluate failure, materials and usability. Any real sukkah would need appropriate safety and halachic review.",
    "takeaway": "A physical model, design decisions and an engineer's perspective on the process."
   },
   {
    "id": "fix-failure",
    "name": "Mechanical Engineering: From CAD to Production",
    "format": "Engineer career conversation",
    "hook": "CAD is one part of the job. What happens when a design leaves the screen?",
    "pro": "Ask a mechanical engineer about testing, teamwork, manufacturing and their route into the field.",
    "detail": "Use a fictional product problem as a conversation starter, then interview an engineer about how their team resolves it, what tools they use and what an ordinary workday looks like.",
    "takeaway": "First-hand context for engineering roles and the skills to explore next."
   }
  ]
 },
 "health": {
  "label": "HEALTH & SCIENCE",
  "ideas": [
   {
    "id": "care-team",
    "name": "Healthcare: Fix a Patient Handoff",
    "format": "Care-team simulation + professional Q&A",
    "hook": "One patient, five healthcare roles and a handoff that didn't go to plan.",
    "pro": "Ask a healthcare professional how their real team communicates and handles uncertainty.",
    "detail": "Map a fictional patient journey, find an information gap and propose a safer handoff. Use a practitioner conversation to explore where nursing, medicine, research and operations responsibilities differ.",
    "takeaway": "A process improvement and a better sense of the different jobs in healthcare."
   },
   {
    "id": "health-research",
    "name": "Interview a Nurse About Hospital Work",
    "format": "Healthcare professional interview",
    "hook": "What does a hospital shift actually look like, beyond television?",
    "pro": "Ask a nurse or allied-health professional about decisions, training, teamwork and daily routines.",
    "detail": "Prepare questions about patient contact, the pace of a typical day, ethical tradeoffs and career pathways. Use an interview to compare assumptions with first-hand experience.",
    "takeaway": "A realistic picture of a healthcare role and what to investigate further."
   }
  ]
 },
 "business": {
  "label": "BUSINESS & ENTREPRENEURSHIP",
  "ideas": [
   {
    "id": "idea-business",
    "name": "Test a Startup Idea with an Entrepreneur",
    "format": "Business challenge + founder feedback",
    "hook": "You love your product idea. What would an actual customer think?",
    "pro": "Ask an entrepreneur how they test demand, set prices and decide what not to build.",
    "detail": "Make a simple customer profile, estimate costs and design a small market test. Compare your plan with a founder's experience getting a product off the ground.",
    "takeaway": "A lean launch outline and a clearer understanding of entrepreneurship."
   },
   {
    "id": "budget-rescue",
    "name": "Interview a Founder About Business Decisions",
    "format": "Founder or finance professional Q&A",
    "hook": "Which tradeoffs keep a good idea alive when money gets tight?",
    "pro": "Interview a business owner or finance professional about real budgeting and difficult decisions.",
    "detail": "Walk through a sample operating budget and prepare questions about revenue, risk, priorities and the day-to-day responsibility of running a business.",
    "takeaway": "An informed view of business and finance work, not just a spreadsheet exercise."
   }
  ]
 },
 "law": {
  "label": "LAW & POLICY",
  "ideas": [
   {
    "id": "be-lawyer",
    "name": "Prepare a Legal Case with a Lawyer",
    "format": "Legal case + lawyer discussion",
    "hook": "One strange case. Two good arguments. What would you tell your client?",
    "pro": "Ask a practicing lawyer how they'd research, advise and prepare the case.",
    "detail": "Read a fictional case file, choose relevant facts and give a short argument. Use a professional discussion to learn what lawyers do before and after they enter a courtroom.",
    "takeaway": "A legal argument and a more realistic picture of legal practice."
   },
   {
    "id": "negotiation",
    "name": "Interview a Lawyer About Daily Work",
    "format": "Lawyer career interview",
    "hook": "Most legal work never gets a dramatic courtroom scene. So what fills the day?",
    "pro": "Interview a lawyer about contracts, client meetings, research and career paths.",
    "detail": "Bring questions about different legal specialties, the first years of practice, work routines and the challenges clients never see. Work through one simple example of advice a client might need.",
    "takeaway": "A clearer map of legal careers and which questions to ask next."
   }
  ]
 },
 "college": {
  "label": "COLLEGE & CAREERS",
  "ideas": [
   {
    "id": "college-decoded",
    "name": "Plan College with a Recent Graduate",
    "format": "Planning lab + graduate Q&A",
    "hook": "Two majors, one internship and some very real tradeoffs.",
    "pro": "Ask a recent graduate how they chose classes, internships and professional direction.",
    "detail": "Build a sample semester around study, costs, Jewish commitments and goals. Compare your choices with a graduate's first-hand experience.",
    "takeaway": "A more informed set of choices and a practical question list."
   },
   {
    "id": "internship",
    "name": "Ask a Graduate About Their First Job",
    "format": "Early-career professional interview",
    "hook": "What did your first job teach you that school didn't?",
    "pro": "Interview an early-career professional about applying, interviewing, adjusting and asking for help.",
    "detail": "Write five questions, practice a short introduction and explore what entry-level work, office expectations and a supportive first manager actually look like.",
    "takeaway": "A realistic picture of the first year at work and a stronger next step."
   }
  ]
 }
};
const all=new Map(Object.values(catalog).flatMap(group=>group.ideas.map(idea=>[idea.id,idea])));
const KEY='jm:interests:v2', LABEL_KEY='jm:interest-labels:v2', MAX=12;
const readLabels=()=>{try{const value=JSON.parse(localStorage.getItem(LABEL_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return {}}};
const sharedLabels=readLabels();
for(const [id,name] of Object.entries(sharedLabels)){if(!all.has(id)&&/^[a-z0-9-]{2,80}$/.test(id)&&typeof name==='string')all.set(id,{id,name:name.slice(0,120)})}
const load=()=>{try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(id=>all.has(id)).slice(0,MAX):[]}catch{return []}};
const saved=new Set(load());
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify([...saved]));const names={...sharedLabels};for(const [id,item] of all)names[id]=item.name;localStorage.setItem(LABEL_KEY,JSON.stringify(names))}catch{}};
persist();
const root=document.querySelector('[data-jd-home]');if(!root)return;
const tabs=[...root.querySelectorAll('[data-jd-tab]')],grid=root.querySelector('#jd-ideas'),categoryName=root.querySelector('#jd-category-name');
const bar=document.querySelector('#jd-shortlist-bar'),counter=document.querySelector('#jd-shortlist-count'),review=document.querySelector('#jd-review'),sheet=document.querySelector('#jd-sheet'),selection=document.querySelector('#jd-selection'),form=document.querySelector('#jd-mail-form'),state=document.querySelector('#jd-mail-state'),send=form.querySelector('[type=submit]'),close=sheet.querySelector('.jd-sheet-close');
let current='conversations',mode='saved',oneId=null,priorFocus=null;
const el=(tag,klass,content)=>{const node=document.createElement(tag);if(klass)node.className=klass;if(content!==undefined)node.textContent=content;return node};
function updateBar(){const n=saved.size;bar.hidden=n===0;counter.textContent=n+' saved '+(n===1?'idea':'ideas');review.textContent='Review interests';root.querySelectorAll('.jd-save').forEach(button=>{const on=saved.has(button.dataset.id);button.setAttribute('aria-pressed',String(on));button.textContent=on?'Saved ✓':'Add to shortlist +'})}
function toggle(id){if(saved.has(id))saved.delete(id);else if(saved.size<MAX)saved.add(id);else{openSheet('saved');state.textContent='You can keep up to '+MAX+' ideas. Remove one to save another.';return}persist();updateBar();if(sheet.open&&mode==='saved')renderSelection()}
function card(item,i){
 const article=el('article','jd-idea');
 article.append(el('p','jd-idea-kicker',item.format),el('h3','',item.name),el('p','jd-idea-description',item.hook));
 const pro=el('p','jd-idea-pro');pro.append(el('strong','','With a professional: '),document.createTextNode(item.pro));article.append(pro);
 const details=el('details','');const summary=el('summary','','What the experience involves'),body=el('p','',item.detail);
 const takeaway=el('p','jd-idea-outcome');takeaway.append(el('strong','','You take away: '),document.createTextNode(item.takeaway));
 details.append(summary,body,takeaway);article.append(details);
 const actions=el('div','jd-idea-actions'),save=el('button','jd-save'),interest=el('button','jd-interest-now',"I'm interested");
 save.type='button';save.dataset.id=item.id;save.setAttribute('aria-label','Save '+item.name);
 save.addEventListener('click',()=>toggle(item.id));
 interest.type='button';interest.addEventListener('click',()=>openSheet('single',item.id));
 actions.append(save,interest);article.append(actions);return article
}
function setTab(id,focus=false){if(!catalog[id])return;current=id;tabs.forEach(tab=>{const selected=tab.dataset.jdTab===id;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus()});categoryName.textContent=catalog[id].label;grid.replaceChildren(...catalog[id].ideas.map(card));updateBar()}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>setTab(tab.dataset.jdTab));tab.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setTab(tabs[n].dataset.jdTab,true);tabs[n].scrollIntoView({block:'nearest',inline:'nearest'})})});
// Let both homepage examples lead to the matching explorer tab, not to a signup form.
root.querySelectorAll('[data-jd-category]').forEach(link=>{
 link.addEventListener('click',()=>{
   const category=link.dataset.jdCategory;
   if(catalog[category])setTab(category);
 });
});
const ids=()=>mode==='single'?[oneId]:[...saved];
function renderSelection(){selection.replaceChildren();const list=ids().filter(id=>all.has(id));if(!list.length){selection.append(el('p','jd-sheet-explainer','Your shortlist is empty. Explore a field and save something that catches your attention.'));send.disabled=true;return}send.disabled=false;for(const id of list){const row=el('div','jd-selected-item'),label=el('span','',all.get(id).name);row.append(label);if(mode==='saved'){const remove=el('button','','Remove');remove.type='button';remove.addEventListener('click',()=>toggle(id));row.append(remove)}selection.append(row)}}
function openSheet(nextMode='saved',id=null){mode=nextMode;oneId=id;priorFocus=document.activeElement;sheet.querySelector('#jd-sheet-title').textContent=mode==='single'?'Hear about this idea':'Your saved ideas';sheet.querySelector('#jd-sheet-copy').textContent=mode==='single'?'Interested in this one? Tell us who you are and where you are based.':"Review your interests first. Nothing is sent until you choose to submit this form.";form.reset();form.querySelectorAll('input,select').forEach(control=>control.disabled=false);state.textContent='';state.dataset.error='false';send.textContent='Keep me posted';renderSelection();if(!sheet.open)sheet.showModal();close.focus({preventScroll:true})}
function closeSheet(){sheet.close();priorFocus?.focus?.({preventScroll:true})}
root.querySelectorAll('[data-jd-open]').forEach(btn=>btn.addEventListener('click',()=>openSheet(btn.dataset.jdOpen==='sukkah'?'single':'saved',btn.dataset.jdOpen==='sukkah'?'impossible-sukkah':null)));
review.addEventListener('click',()=>openSheet('saved'));close.addEventListener('click',closeSheet);
sheet.addEventListener('click',event=>{if(event.target===sheet)closeSheet()});
sheet.addEventListener('close',()=>{priorFocus?.focus?.({preventScroll:true})});
const API='https://vvveenntewwtyhnmimal.supabase.co/rest/v1/pj_interest_shortlists';
const PUBLISHABLE='sb_publishable_-ydn9Mgc5B0Sqw4Qh6zfdg_46FQy87z';
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const formIds=ids().filter(id=>all.has(id));
 if(!formIds.length){state.textContent='Please choose at least one idea.';state.dataset.error='true';return}
 const email=form.querySelector('[name=email]').value.trim().slice(0,254);
 const full_name=form.querySelector('[name=full_name]').value.trim().slice(0,150);
 const location=form.querySelector('[name=location]').value.trim().slice(0,150);
 const stage=form.querySelector('[name=stage]').value.trim().slice(0,60)||null;
 if(!email||!full_name||!location||!form.querySelector('[name=consent]').checked)return;
 if(form.querySelector('[name=website]').value)return;
 state.textContent='Saving your interest…';state.dataset.error='false';send.disabled=true;send.textContent='Saving…';
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),18000);
 try{const res=await fetch(API,{method:'POST',credentials:'omit',mode:'cors',signal:ctrl.signal,headers:{apikey:PUBLISHABLE,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({full_name,location,stage,email,idea_ids:formIds,consent:true,source:'jm-home-discovery'})});if(!res.ok)throw new Error('Unable to save interest');state.textContent='Thanks. We have your interest and will be in touch when there is something relevant.';send.textContent='Interest recorded';form.querySelectorAll('input,select').forEach(control=>control.disabled=true);}
 catch(error){state.dataset.error='true';state.textContent=error.name==='AbortError'?'We could not confirm whether it was saved. Please check before trying again.':'Something went wrong. Please try again.';send.disabled=false;send.textContent='Try again'}
 finally{clearTimeout(timer)}
});
setTab(current);updateBar();
document.documentElement.dataset.jdReady='true';
})();