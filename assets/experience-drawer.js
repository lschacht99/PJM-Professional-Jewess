/* Shared progressive enhancement for experience, workplace, volunteer and expert requests. */
(()=>{'use strict';
const api='https://vvveenntewwtyhnmimal.supabase.co/rest/v1/';
const key='sb_publishable_-ydn9Mgc5B0Sqw4Qh6zfdg_46FQy87z'; // Publishable, not a secret role key.
const featured=[
 ['nyc-challenge-lab','Team Challenge Lab','Online-first idea','Join a multidisciplinary team to investigate a problem and develop a practical solution.','Online first'],
 ['college-decoded','College, Decoded','Online idea','Explore college decisions, internships and Jewish life with students and graduates.','Online first'],
 ['inside-tech','Inside Tech: Beyond the Code','Online idea','Explore software, data and design through beginner-friendly activities.','Online first'],
 ['sunday-workroom','The Sunday Workroom','Online-first idea','Work alongside other Jewish young adults on projects, applications or assignments.','Online first'],
 ['engineering-challenge','The Engineering Design Challenge','Online-first idea','Research a problem, create and test a prototype, and learn how engineers approach design.','Online first']
];
const library=[
 ["design-for-everyone","Engineering","Design a More Accessible Everyday Product","Try using an everyday object with one hand. Then redesign the annoying part.","Accessibility lab","Sketch two solutions, build a quick cardboard mockup, and test one with another person.","Ask a product designer or rehabilitation engineer how they learn from users and test accessibility.","project"],
 ["fix-the-failure","Engineering","Investigate a Product Failure with an Engineer","A beloved gadget fails spectacularly. You get the incident report.","Failure investigation","Study sample photos and forces, explain the weak spot, and propose a part you could test.","Ask a mechanical or reliability engineer how they trace failures and defend a redesign.","project"],
 ["break-the-bridge","Engineering","Build and Test a Model Bridge","Build it light. Make it strong. Then see what the weights say.","Build-and-test lab","Design a paper bridge under a material budget, load it until failure, then revise the structure.","Ask a structural engineer how they test loads, investigate failures and balance safety with cost.","project"],
 ["engineering-conversation","Engineering","Meet a Mechanical Engineer","What does an engineer actually do between the sketch and the finished product?","Career conversation","Interview a working engineer about testing, manufacturing, teamwork, mistakes and the route they took into the profession.","Ask about a typical project, what happens when a prototype fails and which parts of the job they enjoy most.","conversation"],
 ["team-challenge-lab","Engineering","Design a Foldable Sukkah","A tiny courtyard. Almost no storage. Build a sukkah that folds and stays standing.","Engineering + enterprise","Sketch a folding frame, fan-test a scale model, and compare costs; consult an expert on sukkah requirements.","Ask an engineer how they'd prototype a folding mechanism, test its stability and plan for safe assembly.","project"],
 ["business-idea","Business","Test a Startup Idea with an Entrepreneur","You love your idea. Your first customer is less convinced.","Startup experiment","Interview a fictional buyer, choose a test price, and pitch a tiny viable launch.","Ask a founder what evidence would convince them that people will actually buy it.","project"],
 ["marketing-challenge","Business","Create a Marketing Campaign with a Marketer","One product. Three audiences. A budget of almost nothing.","Marketing brief","Pick an audience, write three campaign headlines, and defend your launch choice.","Ask a marketing professional how they choose a target audience and measure results.","project"],
 ["save-the-budget","Business","Solve a Business Budget Crisis","The dream event is $2,000 over budget. Something has to give.","Finance rescue","Rebuild a sample event budget, negotiate tradeoffs, and present a plan that adds up.","Ask a finance professional how they weigh budgets against what matters to customers.","project"],
 ["business-conversation","Business","Interview a Founder About Their First Year","Everyone loves a success story. What did the first year really look like?","Career conversation","Bring questions to an entrepreneur about risk, customers, cash flow and the choices behind a growing business.","Ask about daily responsibilities, early mistakes and how they knew their idea was worth pursuing.","conversation"],
 ["technology-conversation","Technology","Interview a Product Manager About App Design","Who decides what the product should do—and what gets left out?","Career conversation","Interview a product manager or software professional about user research, team roles, deadlines and how ideas become features.","Ask how engineers, designers and business partners resolve disagreements.","conversation"],
 ["data-detective","Technology","Investigate Data with an Analyst","The chart looks impressive. Its data is hiding a detail.","Data investigation","Audit sample attendance figures, find missing context, and rebuild an honest chart.","Ask a data analyst how they catch misleading charts and explain findings to decision-makers.","project"],
 ["cybersecurity-crisis","Technology","Respond to a Cybersecurity Incident","A suspicious office email. One click. Now what?","Cyber incident room","Sort fictional alerts, prioritize containment, and write a short incident briefing.","Ask a security analyst what their first steps look like during a real incident.","project"],
 ["trust-the-algorithm","Technology","Audit an AI Model for Bias","The model says 94% accuracy. One group keeps getting the wrong answer.","AI audit","Compare sample error rates and recommend what must change before deployment.","Ask a data scientist how they evaluate bias and decide whether a model is ready.","project"],
 ["build-an-app","Technology","Redesign an App with a UX Designer","Users quit after seven seconds. Give them a reason to stay.","UX rescue","Turn fictional complaints into a clearer flow and test a clickable mockup.","Ask a product designer how they observe users and decide which changes to make.","project"],
 ["inside-care-team","Healthcare","Improve a Patient Handoff with a Nurse","Five people cared for a patient. A key detail vanished between them.","Care-team simulation","Map a fictional patient journey and design a safer handoff between professional roles.","Ask a nurse or healthcare professional how actual teams coordinate and prevent missed information.","project"],
 ["healthcare-conversation","Healthcare","Interview a Nurse About Hospital Work","A hospital shift looks different from a television episode. Ask someone who does it.","Career conversation","Talk through the daily responsibilities, training and teamwork of a nurse or allied-health professional.","Ask about real decisions, the pace of the work and what surprised them after qualifying.","conversation"],
 ["you-be-the-lawyer","Law","Prepare a Legal Case with a Lawyer","One strange case. Two sides. Three minutes to persuade the room.","Mock case","Sort a fictional case file, build an argument, and deliver a short closing statement.","Ask a practicing lawyer how they'd prepare advice and manage evidence for a real client.","project"],
 ["law-conversation","Law","Interview a Lawyer About Daily Work","What does a lawyer do when nobody is saying 'Objection!'?","Career conversation","Interview a practicing lawyer about clients, research, contracts, specializations and the early years in the profession.","Ask how they prepare advice, communicate with clients and navigate competing priorities.","conversation"],
 ["design-a-space","Design","Design a Flexible Room with an Architect","A tiny room must work for three completely different uses.","Architecture puzzle","Draw a scaled layout, test accessible routes, and propose movable furniture.","Ask an architect how they balance a client's goals, accessibility, budgets and technical limits.","project"],
 ["ux-redesign","Design","Redesign a Confusing Website with a UX Designer","Visitors arrive, look around, and leave. Fix the first impression.","Web UX sprint","Audit a confusing screen, rearrange the priorities, and test your redesign.","Ask a UX professional which user signals matter most and how they test an early redesign.","project"],
 ["design-conversation","Design","Interview a Designer About Their Work","A designer's job isn't just making something beautiful. Who decides what works?","Career conversation","Interview a UX, graphic or architectural designer about briefs, critique, client feedback and portfolio decisions.","Ask how much time they spend researching, revising and defending design choices.","conversation"],
 ["education-conversation","Education","Interview a Teacher About Classroom Life","There is the lesson plan. Then there is the classroom.","Career conversation","Interview a teacher or educational professional about daily preparation, working with learners and how teaching careers develop.","Ask about classroom surprises, difficult decisions and the skills outside teaching itself.","conversation"],
 ["teach-it-better","Education","Practice Teaching a Short Lesson","Explain a hard concept to a beginner. Go.","Teaching lab","Design a three-minute lesson, try it on a peer, and improve it from feedback.","Ask a teacher what changes when a great lesson plan meets real learners.","project"],
 ["sunday-workroom","College","Online Workroom: Study and Career Goals","Bring the assignment you have been avoiding. Leave with actual progress.","Online coworking","Join a focused work sprint, set a goal, and report what got done.","Ask an early-career professional which planning habits matter most when deadlines pile up.","project"],
 ["choose-your-major","College","Plan Your Major with a Recent Graduate","Two majors. One internship. Shabbos is not negotiable.","College decision lab","Compare courses, costs, and internships and build a realistic semester plan.","Ask a recent graduate what actually shaped their major, internship and first-job decisions.","project"],
 ["graduate-conversation","College","Ask a Graduate About Their First Job","What did your first job teach you that college didn't?","Career conversation","Interview a recent graduate about their job search, interviews, first manager, workplace culture and adjustments.","Ask which choices paid off and what they'd tell a student making the same decision.","conversation"]
];
const industryList=['Engineering & manufacturing','Software, AI & data','Healthcare & science','Law & public policy','Architecture & design','Finance & business','Media & marketing','Education & nonprofit work'];
const volunteerList=['Help organize an event','Facilitate a team or workshop','Design learning activities','Outreach and recruit participants','Create graphics and promotion','Help with technology or data','Research opportunities','Host or support in-person events'];
const professionalList=['Answer a few questions','Join a short team consultation','Review a project or proposal','Join a panel or final presentation','Host an office or workplace visit','Offer ongoing mentoring'];
const txt=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;n.textContent=value;return n};

const savedKey='jm:interests:v2', labelKey='jm:interest-labels:v2', MAX_INTERESTS=12;
const catalogNames=new Map([...featured.map(x=>[x[0],x[1]]),...library.map(x=>[x[0],x[2]])]);
const readStore=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
const savedLabels=readStore(labelKey,{});
const savedIds=readStore(savedKey,[]);
const selected=new Set(Array.isArray(savedIds)?savedIds.filter(x=>typeof x==='string').slice(0,MAX_INTERESTS):[]);
function nameFor(id){return catalogNames.get(id)||savedLabels[id]||id.replace(/-/g,' ')}
function persistInterests(){
 const labels={...savedLabels};
 for(const [id,title]of catalogNames)labels[id]=title;
 try{localStorage.setItem(savedKey,JSON.stringify([...selected]));localStorage.setItem(labelKey,JSON.stringify(labels))}catch{}
}
function changeInterest(id,enabled=true){
 if(!id)return;
 if(enabled){if(!selected.has(id)&&selected.size>=MAX_INTERESTS)return false;selected.add(id)}
 else selected.delete(id);
 persistInterests();updateInterestUI();return true;
}
let toolbar=null,summaryCount=null;
function updateInterestUI(){
 document.querySelectorAll('[data-jm-save]').forEach(button=>{
  const on=selected.has(button.dataset.jmSave);button.setAttribute('aria-pressed',String(on));
  button.textContent=on?'Selected ✓':'Add to my list +';
 });
 if(toolbar){toolbar.hidden=selected.size===0;summaryCount.textContent=selected.size+' selected '+(selected.size===1?'experience':'experiences')}
 if(dialog?.hasAttribute('open')&&activeType==='experience')renderSelectedExperiences();
}

function card(item,featuredCard){
 const id=item[0],title=featuredCard?item[1]:item[2],meta=featuredCard?item[2]:item[4],desc=item[3];
 const el=document.createElement('article');el.className='jm-experience-card';
 const tag=featuredCard?meta:(item[7]==='conversation'?'CAREER CONVERSATION':'HANDS-ON CAREER EXPERIENCE');
 el.append(txt('div','jm-experience-meta',tag),txt('h3','',title),txt('p','',desc));
 if(!featuredCard&&item[5]){
  const pro=txt('p','jm-card-pro-preview',item[6]);
  pro.prepend(txt('strong','','Professional connection: '));el.append(pro);
  const detail=document.createElement('details');detail.className='jm-card-brief';
  detail.append(txt('summary','','What you would do'),txt('p','',item[5]));
  el.append(detail);
 }
 const foot=document.createElement('div');foot.className='jm-card-footer';
 if(featuredCard)foot.append(txt('span','jm-card-location',item[4]));
 if(!featuredCard){const save=document.createElement('button');save.type='button';save.className='jm-card-save';save.dataset.jmSave=id;save.setAttribute('aria-pressed',String(selected.has(id)));save.textContent=selected.has(id)?'Selected ✓':'Add to my list +';save.addEventListener('click',()=>{if(!changeInterest(id,!selected.has(id)))alert('You can choose up to '+MAX_INTERESTS+' experiences.')});foot.append(save)}
 const a=document.createElement('a');a.className='jm-card-action';a.href='join.html?role=seek&interest='+encodeURIComponent(title);a.dataset.jmDrawer='experience';a.dataset.jmExperience=id;a.textContent=featuredCard?'Register interest':"I'd try this";a.setAttribute('aria-haspopup','dialog');foot.append(a);el.append(foot);return el;
}
document.querySelectorAll('[data-jm-featured]').forEach(root=>featured.forEach(item=>root.append(card(item,true))));
const libraryRoot=document.querySelector('[data-jm-library]');
const filter=document.querySelector('[data-jm-library-filter]');
const formatFilter=document.querySelector('[data-jm-format-filter]');
if(filter){
 const requestedField=new URLSearchParams(window.location.search).get('field');
 if(requestedField&&[...filter.options].some(option=>option.value===requestedField))filter.value=requestedField;
}
if(libraryRoot){
 const render=()=>{
  const category=filter?filter.value:'All';
  libraryRoot.replaceChildren();
  const format=formatFilter?formatFilter.value:'All';
  const filtered=library.filter(item=>(category==='All'||item[1]===category)&&(format==='All'||item[7]===format));
  filtered.sort((a,b)=>(a[7]==='conversation'?0:1)-(b[7]==='conversation'?0:1));
  filtered.forEach(item=>libraryRoot.append(card(item,false)));
 };
 filter?.addEventListener('change',render);formatFilter?.addEventListener('change',render);render();
 const bar=document.createElement('div');bar.className='jm-shortlist-bar';bar.hidden=true;
 const inner=document.createElement('div');inner.className='jm-shortlist-inner';
 summaryCount=txt('strong','','0 selected experiences');
 const review=document.createElement('button');review.type='button';review.textContent='Review my interests';
 review.addEventListener('click',()=>{lastTrigger=review;show('experience','')});
 inner.append(summaryCount,review);bar.append(inner);document.body.append(bar);toolbar=bar;
}
// Keep the in-page form usable even when a browser or preview tool lacks native dialog support.
const nativeDialog=typeof HTMLDialogElement!=='undefined'&&typeof HTMLDialogElement.prototype.showModal==='function';
const dialog=document.createElement(nativeDialog?'dialog':'div');dialog.className='jm-drawer';dialog.setAttribute('aria-labelledby','jm-drawer-title');
let shade=null,lastTrigger=null;
if(!nativeDialog){
 dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.hidden=true;
 shade=document.createElement('div');shade.className='jm-drawer-shade';shade.hidden=true;
 document.body.append(shade);
 dialog.showModal=()=>{dialog.hidden=false;dialog.setAttribute('open','');shade.hidden=false;};
 dialog.close=()=>{dialog.hidden=true;dialog.removeAttribute('open');shade.hidden=true;dialog.dispatchEvent(new Event('close'));};
 shade.addEventListener('click',()=>dialog.close());
 document.addEventListener('keydown',event=>{
  if(!dialog.hasAttribute('open'))return;
  if(event.key==='Escape'){event.preventDefault();dialog.close();return;}
  if(event.key==='Tab'){
   const els=[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(el=>el.getClientRects().length);
   if(!els.length)return;
   if(event.shiftKey&&document.activeElement===els[0]){event.preventDefault();els[els.length-1].focus();}
   else if(!event.shiftKey&&document.activeElement===els[els.length-1]){event.preventDefault();els[0].focus();}
  }
 });
}
dialog.innerHTML=[
'<div class="jm-drawer-shell"><header class="jm-drawer-header"><div>',
'<p class="eyebrow" id="jm-drawer-eyebrow">THE JEWISH MUTUAL</p><h2 id="jm-drawer-title">Express your interest</h2>',
'</div><button class="jm-drawer-close" type="button" aria-label="Close form">×</button></header>',
'<div class="jm-drawer-content"><p class="jm-drawer-copy" id="jm-drawer-copy"></p>',
'<div id="jm-experience-selection" class="jm-selected-wrap" hidden><div class="jm-selected-head"><strong>Your selected experiences</strong><button type="button" id="jm-keep-browsing">Choose more</button></div><div id="jm-selected-items"></div></div>',
'<form id="jm-drawer-form" novalidate>',
'<div class="jm-drawer-pair"><div class="jm-drawer-field"><label for="jm-first">First name *</label><input id="jm-first" name="first" autocomplete="given-name" maxlength="100" required></div>',
'<div class="jm-drawer-field"><label for="jm-last">Last name *</label><input id="jm-last" name="last" autocomplete="family-name" maxlength="100" required></div></div>',
'<div class="jm-drawer-field"><label for="jm-email">Email *</label><input id="jm-email" type="email" name="email" autocomplete="email" maxlength="254" required></div>',
'<div class="jm-drawer-field"><label for="jm-region">City or region (optional)</label><input id="jm-region" name="region" autocomplete="address-level2" maxlength="150" placeholder="e.g., Brooklyn, NY"></div>',
'<div class="jm-drawer-field" id="jm-area-wrap"></div>',
'<div class="jm-drawer-field"><label for="jm-format">Preferred format (optional)</label><select id="jm-format" name="format"><option value="">Choose if you know</option><option>In person</option><option>Online</option><option>Either format</option></select></div>',
'<div class="jm-drawer-field"><label for="jm-availability">When are you usually available? (optional)</label>',
'<select id="jm-availability" name="availability"><option value="">Choose if you know</option><option>Weekend afternoons</option><option>Weekday evenings</option><option>Weekdays</option><option>Online only</option><option>Flexible / not sure yet</option></select></div>',
'<div class="jm-drawer-field"><label for="jm-notes">Anything else? (optional)</label><textarea id="jm-notes" name="notes" rows="3" maxlength="650" placeholder="Questions, ideas, or how you could help"></textarea></div>',
'<label class="jm-drawer-consent"><input type="checkbox" name="consent" value="yes" required><span>I agree to the <a href="privacy.html" target="_blank" rel="noopener">privacy notice</a> and to being contacted about my request. </span></label>',
'<div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>',
'<button class="button button-primary" type="submit">Send my interest</button><p class="jm-drawer-state" role="status" aria-live="polite"></p>',
'</form></div></div>'
].join('');
document.body.append(dialog);
const form=dialog.querySelector('#jm-drawer-form'),submit=form.querySelector('[type=submit]'),status=form.querySelector('.jm-drawer-state'),areaWrap=form.querySelector('#jm-area-wrap');
dialog.querySelector('.jm-drawer-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{document.body.classList.remove('jm-drawer-open');lastTrigger?.focus({preventScroll:true});});
let activeType='experience',activeId='',activeTitle='';
updateInterestUI();
function selectField(label,options){
 areaWrap.replaceChildren();
 const select=document.createElement('select');select.name='area';select.id='jm-area';
 select.append(new Option('Choose if you know',''));
 options.forEach(option=>select.append(new Option(option,option)));
 const lab=txt('label','',label);lab.htmlFor='jm-area';areaWrap.append(lab,select);
}
function checkboxField(label,options,groupName='areas',append=false){
 if(!append)areaWrap.replaceChildren();
 const fieldset=document.createElement('fieldset');fieldset.className='jm-choice-group';
 const legend=txt('legend','',label);fieldset.append(legend);
 const row=document.createElement('div');row.className='jm-drawer-choices';
 options.forEach(option=>{const lab=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.name=groupName;check.value=option;lab.append(check,document.createTextNode(option));row.append(lab)});
 fieldset.append(row);areaWrap.append(fieldset);
}
const selectionWrap=dialog.querySelector('#jm-experience-selection'),selectionList=dialog.querySelector('#jm-selected-items');
function renderSelectedExperiences(){
 selectionList.replaceChildren();
 if(!selected.size)selectionList.append(txt('p','jm-empty-selection','No experiences selected yet. Choose one or more from the library.'));
 else for(const id of selected){
  const row=document.createElement('div');row.className='jm-selected-item';
  row.append(txt('span','',nameFor(id)));
  const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+nameFor(id));
  remove.addEventListener('click',()=>changeInterest(id,false));row.append(remove);selectionList.append(row);
 }
 if(activeType==='experience')dialog.querySelector('#jm-drawer-title').textContent=selected.size===1?nameFor([...selected][0]):'Your career experiences';
}
dialog.querySelector('#jm-keep-browsing').addEventListener('click',()=>{
 dialog.close();if(libraryRoot){libraryRoot.scrollIntoView({block:'start',behavior:'smooth'})}
});

function show(type,id){
 activeType=['experience','workplace','volunteer','professional'].includes(type)?type:'experience';
 activeId=id||'';const found=featured.find(x=>x[0]===activeId)||library.find(x=>x[0]===activeId);
 activeTitle=found?(found.length>5?found[2]:found[1]):(id||'Career exploration');
 if(activeId==='career-interests')activeTitle='Career exploration';
 const titles={experience:activeTitle,workplace:'Explore a workplace',volunteer:'Help bring this to life',professional:'Share your experience'};
 const copies={
 experience:'Your selections are saved here. Review them, then send one interest form for everything you chose.',
 workplace:'Request the fields you would like to see up close. We will use requests to guide future outreach to workplaces and professionals.',
 volunteer:'Students, recent graduates and community members can help with events, activities, outreach, research and organizing. You can volunteer and participate in experiences.',
 professional:'Offer a small amount of time or a longer commitment. We can work around your availability and interests.'
 };
 dialog.querySelector('#jm-drawer-title').textContent=titles[activeType];
 selectionWrap.hidden=activeType!=='experience';
 dialog.querySelector('#jm-drawer-copy').textContent=copies[activeType];
 dialog.querySelector('#jm-drawer-eyebrow').textContent=activeType==='experience'?'EXPERIENCE INTEREST':activeType==='workplace'?'CAREER VISITS':activeType==='volunteer'?'VOLUNTEER WITH US':'FOR PROFESSIONALS';
 form.reset();status.textContent='';status.dataset.error='false';submit.disabled=false;submit.textContent=activeType==='volunteer'?'Offer to volunteer':activeType==='professional'?'Share how I can help':activeType==='workplace'?'Request a career visit':'Register interest';
 if(activeType==='experience')checkboxField('Additional career interests (optional)',['Engineering','Technology & data','Healthcare & science','Business','Architecture & design','Law & policy','College / career navigation'],'fields');
 if(activeType==='workplace')checkboxField('Fields you would like to explore',industryList);
 if(activeType==='volunteer')checkboxField('How would you like to help?',volunteerList);
 if(activeType==='professional'){checkboxField('Your professional fields (select all that apply)',industryList,'expertise');checkboxField('How could you contribute? (select all that apply)',professionalList,'areas',true)}
 if(activeType==='experience'){
  const lab=document.createElement('label');lab.className='jm-drawer-consent';lab.id='jm-also-volunteer';
  const check=document.createElement('input');check.type='checkbox';check.name='also_volunteer';check.value='yes';
  lab.append(check,document.createTextNode("I'd also be interested in helping as a volunteer."));areaWrap.append(lab);
 }
 if(activeType==='experience')renderSelectedExperiences();
  dialog.showModal();document.body.classList.add('jm-drawer-open');dialog.querySelector('.jm-drawer-close').focus({preventScroll:true});
}
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-jm-drawer]');if(!a)return;
 e.preventDefault();lastTrigger=a;
 const type=a.dataset.jmDrawer,id=a.dataset.jmExperience||a.dataset.jmTitle||'';
 if(type==='experience'&&id&&id!=='career-interests'&&!changeInterest(id,true)){alert('You can choose up to '+MAX_INTERESTS+' experiences.');return}
 show(type,id);
});
const limited=(s,n)=>String(s||'').trim().slice(0,n);
async function post(table,data){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),20000);
 try{
  const result=await fetch(api+table,{method:'POST',mode:'cors',credentials:'omit',signal:ctrl.signal,headers:{apikey:key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(data)});
  if(!result.ok)throw Error('Request failed ('+result.status+')');
 }finally{clearTimeout(timer)}
}
document.documentElement.dataset.jmDrawerReady='true';
form.addEventListener('submit',async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 if(form.elements.namedItem('website')?.value)return;
 const first=limited(form.elements.namedItem('first').value,100),last=limited(form.elements.namedItem('last').value,100),email=limited(form.elements.namedItem('email').value,254);
 if(!first||!last||!email)return;
 const region=limited(form.elements.namedItem('region').value,150),availability=limited(form.elements.namedItem('availability').value,80),format=limited(form.elements.namedItem('format').value,30),notes=limited(form.elements.namedItem('notes').value,650);
 const checked=[...form.querySelectorAll('input[name=areas]:checked')].map(x=>x.value);
 const expertise=[...form.querySelectorAll('input[name=expertise]:checked')].map(x=>x.value);
 const fields=[...form.querySelectorAll('input[name=fields]:checked')].map(x=>x.value);
 const wantsVolunteer=!!form.querySelector('input[name=also_volunteer]:checked');
 if(activeType==='experience'&&selected.size===0){status.dataset.error='true';status.textContent='Please choose at least one experience.';return}
 if(['workplace','volunteer','professional'].includes(activeType)&&checked.length===0){status.dataset.error='true';status.textContent='Please select at least one field or way you could help.';areaWrap.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
 submit.disabled=true;submit.textContent='Saving…';status.textContent='Saving your interest…';status.dataset.error='false';
 try{
  if(activeType==='volunteer'||activeType==='professional'){
   const subject=activeType==='volunteer'?'Volunteer interest':'Professional contribution';
   const message=limited('['+subject+'] Fields: '+expertise.join(', ')+'. Activities: '+checked.join(', ')+'. Location: '+region+'. Preferred format: '+format+'. Availability: '+availability+'. Notes: '+notes,1950);
   await post('pj_inquiries',{full_name:limited(first+' '+last,150),email,message,source:activeType==='volunteer'?'jewish-mutual-volunteer-2026':'jewish-mutual-expert-2026'});
  }else{
   const interestChoices=activeId==='career-interests'?[...document.querySelectorAll('[data-jm-field][aria-pressed="true"]')].map(el=>el.dataset.jmField).join(', '):'';
   const selectedDetail=[...selected].map(id=>id+' ('+nameFor(id)+')').join('; ');
   const detail=activeType==='workplace'?'[Workplace visit request] Fields: '+checked.join(', '):'[Experience request] Selected: '+selectedDetail+'. Additional fields: '+fields.join(', ')+'. Previously chosen fields: '+interestChoices;
   const needed=limited(detail+'. Preferred format: '+format+'. Availability: '+availability+'. Notes: '+notes,1450);
   await post('pj_applications',{
    role:'mentee',first_name:first,last_name:last,email,community:region||null,
    field:limited(activeType==='workplace'?checked.join(', '):fields.join(', ')||[...selected].map(id=>nameFor(id)).join(', '),195)||null,
    help_needed:needed,help_offered:wantsVolunteer?'Interested in helping as a volunteer alongside participation.':null,
    goals:limited('Interest type: '+activeType+'. '+needed,2900),
    preferred_contact:'email',privacy_ack:true,
    source:activeType==='workplace'?'jewish-mutual-workplace-2026':'jewish-mutual-interest-2026'
   });
  }
  form.reset();status.textContent=activeType==='volunteer'?'Thank you. Your volunteer interest was saved.':activeType==='professional'?'Thank you. We received your offer to help.': 'Your interest was saved. We will share details if this experience or request moves forward.';
  submit.textContent='Submitted';
 }catch(error){
  console.error('Could not save interest',error);
  status.dataset.error='true';
  status.textContent=error.name==='AbortError'?"We couldn't confirm whether your interest was received. Please don't resubmit immediately.":'We could not save your interest right now. Please try again.';
  submit.disabled=false;submit.textContent='Try again';
 }
});
})();
