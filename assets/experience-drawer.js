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
 ["design-for-everyone","Engineering","One Hand, No Problem","Try using an everyday object with one hand. Then redesign the annoying part.","Accessibility lab","Sketch two solutions, build a quick cardboard mockup, and test one with another person."],
 ["fix-the-failure","Engineering","The Product That Snapped","A beloved gadget fails spectacularly. You get the incident report.","Failure investigation","Study sample photos and forces, explain the weak spot, and propose a part you could test."],
 ["break-the-bridge","Engineering","Bridge vs. Gravity","Build it light. Make it strong. Then see what the weights say.","Build-and-test lab","Design a paper bridge under a material budget, load it until failure, then revise the structure."],
 ["engineering-design","Engineering","The Great Gadget Hack","Take one frustrating everyday object and invent a better version.","Design sprint","Prototype a mechanism with household materials and explain how you would test durability."],
 ["team-challenge-lab","Business","The Impossible Sukkah","A tiny courtyard. Almost no storage. Build a sukkah that folds and stays standing.","Engineering + enterprise","Sketch a folding frame, fan-test a scale model, and compare costs; consult an expert on sukkah requirements."],
 ["business-idea","Business","Will Anyone Buy It?","You love your idea. Your first customer is less convinced.","Startup experiment","Interview a fictional buyer, choose a test price, and pitch a tiny viable launch."],
 ["marketing-challenge","Business","The Campaign That Has to Work","One product. Three audiences. A budget of almost nothing.","Marketing brief","Pick an audience, write three campaign headlines, and defend your launch choice."],
 ["save-the-budget","Business","Budget vs. Reality","The dream event is $2,000 over budget. Something has to give.","Finance rescue","Rebuild a sample event budget, negotiate tradeoffs, and present a plan that adds up."],
 ["real-estate-deal","Business","The Apartment Deal Detective","The listing looks perfect. Then you open the expense sheet.","Real-estate case","Compare fictional rent, taxes, maintenance, and repairs; recommend buy, rent, or pass."],
 ["software-sprint","Technology","The 48-Hour Product Sprint","An idea lands Friday. The prototype is due Monday.","Product sprint","Choose one user problem, write a tiny feature brief, and mock up the opening screen."],
 ["data-detective","Technology","The Spreadsheet Is Lying","The chart looks impressive. Its data is hiding a detail.","Data investigation","Audit sample attendance figures, find missing context, and rebuild an honest chart."],
 ["cybersecurity-crisis","Technology","Someone Clicked the Link","A suspicious office email. One click. Now what?","Cyber incident room","Sort fictional alerts, prioritize containment, and write a short incident briefing."],
 ["trust-the-algorithm","Technology","AI on Trial","The model says 94% accuracy. One group keeps getting the wrong answer.","AI audit","Compare sample error rates and recommend what must change before deployment."],
 ["build-an-app","Technology","The App Everyone Hates","Users quit after seven seconds. Give them a reason to stay.","UX rescue","Turn fictional complaints into a clearer flow and test a clickable mockup."],
 ["inside-care-team","Healthcare","The Missing Handoff","Five people cared for a patient. A key detail vanished between them.","Care-team simulation","Map a fictional patient journey and design a safer handoff between professional roles."],
 ["stop-the-outbreak","Healthcare","Patient Zero?","The fictional outbreak map is growing. Which clue matters first?","Public-health puzzle","Interpret sample case counts, pick a response, and explain the uncertainty."],
 ["you-be-the-lawyer","Law","Objection!","One strange case. Two sides. Three minutes to persuade the room.","Mock case","Sort a fictional case file, build an argument, and deliver a short closing statement."],
 ["negotiation-table","Law","The Dealbreaker","Three teams need a deal. None will accept the first offer.","Negotiation room","Represent a stakeholder and trade concessions to negotiate—or walk away."],
 ["design-a-space","Design","300 Square Feet","A tiny room must work for three completely different uses.","Architecture puzzle","Draw a scaled layout, test accessible routes, and propose movable furniture."],
 ["ux-redesign","Design","The Seven-Second Website","Visitors arrive, look around, and leave. Fix the first impression.","Web UX sprint","Audit a confusing screen, rearrange the priorities, and test your redesign."],
 ["newsroom-challenge","Design","Rumor Has It","A headline is spreading. Is it true—or just very shareable?","Media fact-check","Trace a fictional claim, check the evidence, and write a careful 100-word news update."],
 ["psychologist","Education","What Would You Click?","Two buttons. One strange choice. Design an experiment to explain it.","Psychology experiment","Write an ethical mini-study, identify confounding factors, and interpret sample responses."],
 ["teach-it-better","Education","Teach It in Three Minutes","Explain a hard concept to a beginner. Go.","Teaching lab","Design a three-minute lesson, try it on a peer, and improve it from feedback."],
 ["sunday-workroom","College","The Workroom","Bring the assignment you have been avoiding. Leave with actual progress.","Online coworking","Join a focused work sprint, set a goal, and report what got done."],
 ["choose-your-major","College","Major Plot Twist","Two majors. One internship. Shabbos is not negotiable.","College decision lab","Compare courses, costs, and internships and build a realistic semester plan."],
 ["college-life","College","The Impossible Semester","Classes, work, holidays, friends. Somehow it all has to fit.","Schedule challenge","Stress-test a fictional student calendar and decide what to prioritize."]
];
const industryList=['Engineering & manufacturing','Software, AI & data','Healthcare & science','Law & public policy','Architecture & design','Finance & business','Media & marketing','Education & nonprofit work'];
const volunteerList=['Help organize an event','Facilitate a team or workshop','Design learning activities','Outreach and recruit participants','Create graphics and promotion','Help with technology or data','Research opportunities','Host or support in-person events'];
const professionalList=['Answer a few questions','Join a short team consultation','Review a project or proposal','Join a panel or final presentation','Host an office or workplace visit','Offer ongoing mentoring'];
const txt=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;n.textContent=value;return n};
function card(item,featuredCard){
 const id=item[0],title=item[1],meta=featuredCard?item[2]:item[2]+' · '+item[4],desc=featuredCard?item[3]:item[3];
 const el=document.createElement('article');el.className='jm-experience-card';el.append(txt('div','jm-experience-meta',meta),txt('h3','',title),txt('p','',desc));if(!featuredCard&&item[5]){const detail=document.createElement('details');detail.className='jm-card-brief';detail.append(txt('summary','','See your mission'),txt('p','',item[5]));el.append(detail);}
 const foot=document.createElement('div');foot.className='jm-card-footer';
 if(featuredCard)foot.append(txt('span','jm-card-location',item[4]));
 const a=document.createElement('a');a.className='jm-card-action';a.href='join.html?role=seek&interest='+encodeURIComponent(title);a.dataset.jmDrawer='experience';a.dataset.jmExperience=id;a.textContent=featuredCard?'Register interest':"I'd try this";a.setAttribute('aria-haspopup','dialog');foot.append(a);el.append(foot);return el;
}
document.querySelectorAll('[data-jm-featured]').forEach(root=>featured.forEach(item=>root.append(card(item,true))));
const libraryRoot=document.querySelector('[data-jm-library]');
const filter=document.querySelector('[data-jm-library-filter]');
if(filter){
 const requestedField=new URLSearchParams(window.location.search).get('field');
 if(requestedField&&[...filter.options].some(option=>option.value===requestedField))filter.value=requestedField;
}
if(libraryRoot){
 const render=()=>{
  const category=filter?filter.value:'All';
  libraryRoot.replaceChildren();
  const filtered=library.filter(item=>category==='All'||item[1]===category);
  filtered.forEach(item=>libraryRoot.append(card(item,false)));
 };
 filter?.addEventListener('change',render);render();
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
function selectField(label,options){
 areaWrap.replaceChildren();
 const select=document.createElement('select');select.name='area';select.id='jm-area';
 select.append(new Option('Choose if you know',''));
 options.forEach(option=>select.append(new Option(option,option)));
 const lab=txt('label','',label);lab.htmlFor='jm-area';areaWrap.append(lab,select);
}
function checkboxField(label,options){
 areaWrap.replaceChildren();
 const fieldset=document.createElement('fieldset');fieldset.style.cssText='border:0;padding:0;margin:0';
 const legend=txt('legend','',label);legend.style.cssText='font-size:12px;font-weight:700;color:#1D478B;margin-bottom:9px';fieldset.append(legend);
 const row=document.createElement('div');row.className='jm-drawer-choices';
 options.forEach(option=>{const lab=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.name='areas';check.value=option;lab.append(check,document.createTextNode(option));row.append(lab)});
 fieldset.append(row);areaWrap.append(fieldset);
}
function show(type,id){
 activeType=['experience','workplace','volunteer','professional'].includes(type)?type:'experience';
 activeId=id||'';const found=featured.find(x=>x[0]===activeId)||library.find(x=>x[0]===activeId);
 activeTitle=found?found[1]:(id||'Career exploration');
 if(activeId==='career-interests')activeTitle='Career exploration';
 const titles={experience:activeTitle,workplace:'Explore a workplace',volunteer:'Help bring this to life',professional:'Share your experience'};
 const copies={
 experience:"Tell us you'd like to take part. We're gathering interest to help choose what to organize first. There is no date or booking commitment at this stage.",
 workplace:'Request the fields you would like to see up close. We will use requests to guide future outreach to workplaces and professionals.',
 volunteer:'Students, recent graduates and community members can help with events, activities, outreach, research and organizing. You can volunteer and participate in experiences.',
 professional:'Offer a small amount of time or a longer commitment. We can work around your availability and interests.'
 };
 dialog.querySelector('#jm-drawer-title').textContent=titles[activeType];
 dialog.querySelector('#jm-drawer-copy').textContent=copies[activeType];
 dialog.querySelector('#jm-drawer-eyebrow').textContent=activeType==='experience'?'EXPERIENCE INTEREST':activeType==='workplace'?'CAREER VISITS':activeType==='volunteer'?'VOLUNTEER WITH US':'FOR PROFESSIONALS';
 form.reset();status.textContent='';status.dataset.error='false';submit.disabled=false;submit.textContent=activeType==='volunteer'?'Offer to volunteer':activeType==='professional'?'Share how I can help':activeType==='workplace'?'Request a career visit':'Register interest';
 if(activeType==='experience')selectField('Which career perspective interests you? (optional)',['Engineering','Software & data','Healthcare & science','Business & entrepreneurship','Design & marketing','Law & policy','College / career navigation','Exploring several fields']);
 if(activeType==='workplace')checkboxField('Fields you would like to explore',industryList);
 if(activeType==='volunteer')checkboxField('How would you like to help?',volunteerList);
 if(activeType==='professional')checkboxField('How could you contribute?',professionalList);
 if(activeType==='experience'){
  const lab=document.createElement('label');lab.className='jm-drawer-consent';lab.id='jm-also-volunteer';
  const check=document.createElement('input');check.type='checkbox';check.name='also_volunteer';check.value='yes';
  lab.append(check,document.createTextNode("I'd also be interested in helping as a volunteer."));areaWrap.append(lab);
 }
 dialog.showModal();document.body.classList.add('jm-drawer-open');dialog.querySelector('.jm-drawer-close').focus({preventScroll:true});
}
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-jm-drawer]');if(!a)return;
 e.preventDefault();lastTrigger=a;show(a.dataset.jmDrawer,a.dataset.jmExperience||a.dataset.jmTitle||'');
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
 const select=form.elements.namedItem('area'),area=select?limited(select.value,120):'';
 const checked=[...form.querySelectorAll('input[name=areas]:checked')].map(x=>x.value);
 const wantsVolunteer=!!form.querySelector('input[name=also_volunteer]:checked');
 if(['workplace','volunteer','professional'].includes(activeType)&&checked.length===0){status.dataset.error='true';status.textContent='Please select at least one field or way you could help.';areaWrap.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
 submit.disabled=true;submit.textContent='Saving…';status.textContent='Saving your interest…';status.dataset.error='false';
 try{
  if(activeType==='volunteer'||activeType==='professional'){
   const subject=activeType==='volunteer'?'Volunteer interest':'Professional contribution';
   const message=limited('['+subject+'] Activities: '+checked.join(', ')+'. Location: '+region+'. Preferred format: '+format+'. Availability: '+availability+'. Notes: '+notes,1950);
   await post('pj_inquiries',{full_name:limited(first+' '+last,150),email,message,source:activeType==='volunteer'?'jewish-mutual-volunteer-2026':'jewish-mutual-expert-2026'});
  }else{
   const interestChoices=activeId==='career-interests'?[...document.querySelectorAll('[data-jm-field][aria-pressed="true"]')].map(el=>el.dataset.jmField).join(', '):'';
   const detail=activeType==='workplace'?'[Workplace visit request] Fields: '+checked.join(', '):'[Experience request] ID: '+activeId+'. Title: '+activeTitle+'. Selected fields: '+interestChoices+'. Perspective: '+area;
   const needed=limited(detail+'. Preferred format: '+format+'. Availability: '+availability+'. Notes: '+notes,1450);
   await post('pj_applications',{
    role:'mentee',first_name:first,last_name:last,email,community:region||null,
    field:limited(activeType==='workplace'?checked.join(', '):area||activeTitle,195)||null,
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
