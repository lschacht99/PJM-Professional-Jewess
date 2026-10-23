/* Discovery explorer: browsing and saved ideas happen locally; email is submitted only with consent. */
(()=>{'use strict';
const catalog={
 cross:{label:'TEAM CHALLENGES',ideas:[
 {id:'team-lab',name:'The 90-Minute Rescue',hook:'The community event is falling apart. You have 90 minutes, a team, and a very inconvenient budget.',detail:'Split into design, engineering, research and business roles. Diagnose a fictional event crisis, build one practical solution, then present a rescue plan everyone can defend.'},
 {id:'community-redesign',name:'The Tiny-Space Takeover',hook:'One little room. Three wildly different uses. Make every square foot earn its keep.',detail:'Rearrange a fictional small community space for learning, social gatherings and accessible use. Sketch a to-scale floor plan, prototype movable furniture, and pitch the tradeoffs.'}
 ]},
 tech:{label:'TECHNOLOGY & DATA',ideas:[
 {id:'data-detective',name:'The Spreadsheet Is Lying',hook:'The graph looks great. Unfortunately, the numbers have other plans.',detail:'Take apart a messy fictional attendance dataset, find the missing information and rebuild the chart to tell an honest story. Finish with one decision backed by evidence.'},
 {id:'product-sprint',name:'The App Everyone Hates',hook:'Users abandon the app in seven seconds. You are the emergency redesign team.',detail:'Read sample user complaints, sketch a better first screen, test it with a partner and give the product team a three-minute pitch.'}
 ]},
 engineering:{label:'ENGINEERING & MAKING',ideas:[
 {id:'impossible-sukkah',name:'The Impossible Sukkah',hook:'A tiny courtyard. Almost no storage. Could your fold-up sukkah survive the fan test?',detail:'Sketch a foldable frame, prototype a joint with cardboard or simple household materials, test a scale model against wind, and estimate materials and cost. Discuss sukkah requirements with a knowledgeable advisor before any real-world build.'},
 {id:'fix-failure',name:'Prototype Down!',hook:'It worked perfectly—until it snapped. Welcome to engineering.',detail:'Investigate a fictional failed mechanism, identify two plausible causes, redesign its weakest point and run a small physical test to compare fixes.'}
 ]},
 health:{label:'HEALTH & SCIENCE',ideas:[
 {id:'care-team',name:'The Missing Handoff',hook:'Five healthcare professionals. One patient. An important detail that nobody passed along.',detail:'Trace a fictional care journey, find where communication failed, and design a clearer handoff between healthcare roles. Present your fix in a simulated team huddle.'},
 {id:'health-research',name:'Headline vs. Evidence',hook:'A health claim is going viral. The research is less enthusiastic.',detail:'Compare a sensational headline with sample research summaries, spot what the studies can and cannot prove, and produce a short evidence-based explainer.'}
 ]},
 business:{label:'BUSINESS & ENTREPRENEURSHIP',ideas:[
 {id:'idea-business',name:'Will Anyone Buy It?',hook:'Your brilliant product has met its first skeptical customer. Now what?',detail:'Interview a pretend customer, decide what to build first, estimate the price and pitch a tiny real-world-style pilot.'},
 {id:'budget-rescue',name:'Budget vs. Reality',hook:'The dream event is $2,000 over budget. Which brilliant idea survives?',detail:'Work from a fictional event spreadsheet, renegotiate expenses, defend what stays, and present a version people would actually pay for.'}
 ]},
 law:{label:'LAW & COMMUNICATION',ideas:[
 {id:'be-lawyer',name:'Objection!',hook:'One bizarre case. Two convincing arguments. You get three minutes to make yours.',detail:'Read a fictional case file, sift useful evidence from red herrings, build your argument and deliver a mini closing statement.'},
 {id:'negotiation',name:'The Dealbreaker',hook:'Three teams want the same contract. None will accept the first offer.',detail:'Represent a different stakeholder in a mock negotiation. Trade deadlines, cost and control to reach a deal—or explain why walking away wins.'}
 ]},
 college:{label:'COLLEGE & CAREERS',ideas:[
 {id:'college-decoded',name:'Major Plot Twist',hook:'Two majors, one internship, tuition to consider—and Shabbos is not negotiable.',detail:'Build a sample semester and career path for a fictional student, compare options, and craft the questions you would want to ask a real graduate.'},
 {id:'internship',name:'The Internship Audition',hook:'“Tell me about yourself.” You have 45 seconds. Go.',detail:'Pick an internship brief, craft a short introduction, practice a realistic interview question and revise your pitch based on peer feedback.'}
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
function updateBar(){const n=saved.size;bar.hidden=n===0;counter.textContent=n+' saved '+(n===1?'idea':'ideas');review.textContent='Review →';root.querySelectorAll('.jd-save').forEach(button=>{const on=saved.has(button.dataset.id);button.setAttribute('aria-pressed',String(on));button.textContent=on?'Saved ✓':'Add to shortlist +'})}
function toggle(id){if(saved.has(id))saved.delete(id);else if(saved.size<MAX)saved.add(id);else{openSheet('saved');state.textContent='You can keep up to '+MAX+' ideas. Remove one to save another.';return}persist();updateBar();if(sheet.open&&mode==='saved')renderSelection()}
function card(item,i){
 const article=el('article','jd-idea');article.append(el('p','jd-idea-kicker','CHALLENGE '+String(i+1).padStart(2,'0')),el('h3','',item.name),el('p','jd-idea-description',item.hook));
 const details=el('details','');const summary=el('summary','','See your mission'),body=el('p','',item.detail);details.append(summary,body);article.append(details);
 const actions=el('div','jd-idea-actions'),save=el('button','jd-save'),interest=el('button','jd-interest-now',"I'd try this →");
 save.type='button';save.dataset.id=item.id;save.setAttribute('aria-label','Save '+item.name);
 save.addEventListener('click',()=>toggle(item.id));
 interest.type='button';interest.addEventListener('click',()=>openSheet('single',item.id));
 actions.append(save,interest);article.append(actions);return article
}
function setTab(id,focus=false){if(!catalog[id])return;current=id;tabs.forEach(tab=>{const selected=tab.dataset.jdTab===id;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus()});categoryName.textContent=catalog[id].label;grid.replaceChildren(...catalog[id].ideas.map(card));updateBar()}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>setTab(tab.dataset.jdTab));tab.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setTab(tabs[n].dataset.jdTab,true);tabs[n].scrollIntoView({block:'nearest',inline:'nearest'})})});
const ids=()=>mode==='single'?[oneId]:[...saved];
function renderSelection(){selection.replaceChildren();const list=ids().filter(id=>all.has(id));if(!list.length){selection.append(el('p','jd-sheet-explainer','Your shortlist is empty. Explore a field and save something that catches your attention.'));send.disabled=true;return}send.disabled=false;for(const id of list){const row=el('div','jd-selected-item'),label=el('span','',all.get(id).name);row.append(label);if(mode==='saved'){const remove=el('button','','Remove');remove.type='button';remove.addEventListener('click',()=>toggle(id));row.append(remove)}selection.append(row)}}
function openSheet(nextMode='saved',id=null){mode=nextMode;oneId=id;priorFocus=document.activeElement;sheet.querySelector('#jd-sheet-title').textContent=mode==='single'?'Hear about this idea':'Your saved ideas';sheet.querySelector('#jd-sheet-copy').textContent=mode==='single'?'Interested in this one? Leave an email and we can contact you as it develops.':"Save what catches your attention. Your choices stay in this browser until you decide to email them.";form.reset();form.querySelector('[name=email]').disabled=false;form.querySelector('[name=consent]').disabled=false;state.textContent='';state.dataset.error='false';send.textContent='Keep me posted';renderSelection();if(!sheet.open)sheet.showModal();close.focus({preventScroll:true})}
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