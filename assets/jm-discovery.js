/* Discovery explorer: browsing and saved ideas happen locally; email is submitted only with consent. */
(()=>{'use strict';
const catalog={
 cross:{label:'TEAM CHALLENGES',ideas:[
 {id:'shabbos-anywhere',name:'Shabbos, Anywhere',hook:'A new city, a Friday deadline, and no phone to rely on during Shabbos. What would you design?',detail:"A Jewish woman is visiting an unfamiliar city for Shabbos. She needs clear walking directions, trustworthy kosher meal information, accessible plans and a way to find her hosts. Build a workable solution using engineering, product design, technology before Shabbos, community research and budgeting."},
 {id:'team-lab',name:'The Team Challenge Lab',hook:'Could your team tackle one problem from five completely different professions?',detail:'Take different roles—engineering, healthcare, research, data, business and visual design. Compare tradeoffs and pitch a solution using a realistic fictional brief.'}
 ]},
 tech:{label:'TECHNOLOGY & DATA',ideas:[
 {id:'data-detective',name:'The Data Detective',hook:'A city has a problem. What story is hidden in its data?',detail:'Investigate a fictional transport or community dataset, spot patterns, and turn them into a persuasive recommendation.'},
 {id:'product-sprint',name:'Design a Better App',hook:'Find one everyday frustration and design a feature that actually helps.',detail:'Interview a user, sketch a product screen, test assumptions and learn how software engineering, design and product work connect.'}
 ]},
 engineering:{label:'ENGINEERING',ideas:[
 {id:'fix-failure',name:'Fix the Failure',hook:'A prototype keeps breaking. Can you work out why?',detail:'Investigate possible causes, compare designs, sketch an improvement and choose an experiment to test it.'},
 {id:'design-everyone',name:'Design for Everyone',hook:'Could a small redesign make a product easier for more people to use?',detail:'Explore a real accessibility challenge, prototype a simple change, and revise it based on feedback.'}
 ]},
 health:{label:'HEALTH & SCIENCE',ideas:[
 {id:'care-team',name:'Inside the Care Team',hook:'What would you fix about someone’s experience of getting care?',detail:'Examine a fictional patient journey through the perspectives of nursing, medicine, research, operations and design.'},
 {id:'health-research',name:'The Health Research Brief',hook:'Can you separate strong evidence from a convincing-looking headline?',detail:'Compare sample research findings and design a clear, responsible health communication for a community audience.'}
 ]},
 business:{label:'BUSINESS & ENTREPRENEURSHIP',ideas:[
 {id:'idea-business',name:'From Idea to Business',hook:'You have a promising idea. Would anyone actually use it?',detail:'Identify customers, map their needs, estimate costs and pitch a version simple enough to test.'},
 {id:'budget-rescue',name:'Save the Budget',hook:'The event is worthwhile. The budget isn’t. Can you make it work?',detail:'Use sample costs, user needs and tradeoffs to find a sustainable plan and explain your decisions.'}
 ]},
 law:{label:'LAW & COMMUNICATION',ideas:[
 {id:'be-lawyer',name:'You Be the Lawyer',hook:'Two sides of one case. Which argument holds up?',detail:'Analyze a fictional dispute, evaluate evidence, make an argument and practice addressing difficult questions.'},
 {id:'negotiation',name:'The Negotiation Table',hook:'What if a good deal means everyone has to give something up?',detail:'Represent a stakeholder in a mock negotiation and find the best workable agreement.'}
 ]},
 college:{label:'COLLEGE & CAREERS',ideas:[
 {id:'college-decoded',name:'College, Decoded',hook:'Majors, internships, Jewish life—what should you actually ask?',detail:'Work through real college decisions, investigate options, and learn from students and recent graduates.'},
 {id:'internship',name:'Your First Internship',hook:'Find a role worth applying for and make your first move.',detail:'Compare opportunities, write an outreach message and practice the kinds of questions professionals really ask.'}
 ]}};
const all=new Map(Object.values(catalog).flatMap(group=>group.ideas.map(idea=>[idea.id,idea])));
const KEY='jm:interests:v2', MAX=12;
const load=()=>{try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(id=>all.has(id)).slice(0,MAX):[]}catch{return []}};
const saved=new Set(load());const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify([...saved]))}catch{}};
const root=document.querySelector('[data-jd-home]');if(!root)return;
const tabs=[...root.querySelectorAll('[data-jd-tab]')],grid=root.querySelector('#jd-ideas'),categoryName=root.querySelector('#jd-category-name');
const bar=document.querySelector('#jd-shortlist-bar'),counter=document.querySelector('#jd-shortlist-count'),review=document.querySelector('#jd-review'),sheet=document.querySelector('#jd-sheet'),selection=document.querySelector('#jd-selection'),form=document.querySelector('#jd-mail-form'),state=document.querySelector('#jd-mail-state'),send=form.querySelector('[type=submit]'),close=sheet.querySelector('.jd-sheet-close');
let current='cross',mode='saved',oneId=null,priorFocus=null;
const el=(tag,klass,content)=>{const node=document.createElement(tag);if(klass)node.className=klass;if(content!==undefined)node.textContent=content;return node};
function updateBar(){const n=saved.size;bar.hidden=n===0;counter.textContent=n+' saved '+(n===1?'idea':'ideas');review.textContent='Review →';root.querySelectorAll('.jd-save').forEach(button=>{const on=saved.has(button.dataset.id);button.setAttribute('aria-pressed',String(on));button.textContent=on?'Saved ✓':'Save this idea +'})}
function toggle(id){if(saved.has(id))saved.delete(id);else if(saved.size<MAX)saved.add(id);else{openSheet('saved');state.textContent='You can keep up to '+MAX+' ideas. Remove one to save another.';return}persist();updateBar();if(sheet.open&&mode==='saved')renderSelection()}
function card(item,i){
 const article=el('article','jd-idea');article.append(el('p','jd-idea-kicker','IDEA '+String(i+1).padStart(2,'0')),el('h3','',item.name),el('p','jd-idea-description',item.hook));
 const details=el('details','');const summary=el('summary','','See what you would do'),body=el('p','',item.detail);details.append(summary,body);article.append(details);
 const actions=el('div','jd-idea-actions'),save=el('button','jd-save'),interest=el('button','jd-interest-now',"I'm interested →");
 save.type='button';save.dataset.id=item.id;save.setAttribute('aria-label','Save '+item.name);
 save.addEventListener('click',()=>toggle(item.id));
 interest.type='button';interest.addEventListener('click',()=>openSheet('single',item.id));
 actions.append(save,interest);article.append(actions);return article
}
function setTab(id,focus=false){if(!catalog[id])return;current=id;tabs.forEach(tab=>{const selected=tab.dataset.jdTab===id;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus()});categoryName.textContent=catalog[id].label;grid.replaceChildren(...catalog[id].ideas.map(card));updateBar()}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>setTab(tab.dataset.jdTab));tab.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setTab(tabs[n].dataset.jdTab,true);tabs[n].scrollIntoView({block:'nearest',inline:'nearest'})})});
const ids=()=>mode==='single'?[oneId]:[...saved];
function renderSelection(){selection.replaceChildren();const list=ids().filter(id=>all.has(id));if(!list.length){selection.append(el('p','jd-sheet-explainer','Your shortlist is empty. Explore a field and save something that catches your attention.'));send.disabled=true;return}send.disabled=false;for(const id of list){const row=el('div','jd-selected-item'),label=el('span','',all.get(id).name);row.append(label);if(mode==='saved'){const remove=el('button','','Remove');remove.type='button';remove.addEventListener('click',()=>toggle(id));row.append(remove)}selection.append(row)}}
function openSheet(nextMode='saved',id=null){mode=nextMode;oneId=id;priorFocus=document.activeElement;sheet.querySelector('#jd-sheet-title').textContent=mode==='single'?'Hear about this idea':'Your saved ideas';sheet.querySelector('#jd-sheet-copy').textContent=mode==='single'?'Interested in this one? Leave an email and we can contact you as it develops.':"Save what catches your attention. Your choices stay in this browser until you decide to email them.";form.reset();state.textContent='';state.dataset.error='false';send.textContent='Keep me posted';renderSelection();if(!sheet.open)sheet.showModal();close.focus({preventScroll:true})}
function closeSheet(){sheet.close();priorFocus?.focus?.({preventScroll:true})}
root.querySelectorAll('[data-jd-open]').forEach(btn=>btn.addEventListener('click',()=>openSheet(btn.dataset.jdOpen==='shabbos'?'single':'saved',btn.dataset.jdOpen==='shabbos'?'shabbos-anywhere':null)));
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
 if(!email||!form.querySelector('[name=consent]').checked)return;
 if(form.querySelector('[name=website]').value)return;
 state.textContent='Saving your interest…';state.dataset.error='false';send.disabled=true;send.textContent='Saving…';
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),18000);
 try{const res=await fetch(API,{method:'POST',credentials:'omit',mode:'cors',signal:ctrl.signal,headers:{apikey:PUBLISHABLE,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({email,idea_ids:formIds,consent:true,source:'jm-home-discovery'})});if(!res.ok)throw new Error('Unable to save interest');state.textContent='Thanks. We have your interest and will be in touch when there is something relevant.';send.textContent='Interest recorded';form.querySelector('[name=email]').disabled=true;form.querySelector('[name=consent]').disabled=true;}
 catch(error){state.dataset.error='true';state.textContent=error.name==='AbortError'?'We could not confirm whether it was saved. Please check before trying again.':'Something went wrong. Please try again.';send.disabled=false;send.textContent='Try again'}
 finally{clearTimeout(timer)}
});
setTab(current);updateBar();
document.documentElement.dataset.jdReady='true';
})();