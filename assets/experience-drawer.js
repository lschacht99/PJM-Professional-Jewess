/* Shared progressive enhancement for experience, workplace, volunteer and expert requests. */
(()=>{'use strict';
const api='https://vvveenntewwtyhnmimal.supabase.co/rest/v1/';
const key='sb_publishable_-ydn9Mgc5B0Sqw4Qh6zfdg_46FQy87z'; // Publishable, not a secret role key.
const featured=[
 ['nyc-challenge-lab','NYC Challenge Lab','NYC · In person · Women-centered','Design a solution with a team. Explore engineering, healthcare, business, technology and design through different project roles.','New York City'],
 ['college-decoded','College, Decoded','Online · Women-centered','A practical discussion with students and graduates about majors, internships, college decisions and Jewish life.','Online'],
 ['inside-tech','Inside Tech: Beyond the Code','Online · Women-centered','Try short activities from software, data and UX to discover what different technology careers involve.','Online'],
 ['sunday-workroom','The Sunday Workroom','NYC · In person · Women-centered','Bring a project, application or assignment, get something done and meet other Jewish young adults.','New York City'],
 ['engineering-challenge','The Engineering Design Challenge','In person or online · Small group','Research a problem, create and test a prototype, and learn how engineers make practical decisions.','Format to be decided']
];
const library=[
 ['design-for-everyone','Engineering','Design for Everyone','Redesign an everyday object for people with different mobility or dexterity needs.','Hands-on challenge'],
 ['fix-the-failure','Engineering','Fix the Failure','Investigate a fictional product failure and recommend a safer, more reliable redesign.','Engineering simulation'],
 ['break-the-bridge','Engineering','Break the Bridge','Build and test a model bridge under constraints, then improve your design.','Engineering challenge'],
 ['engineering-design','Engineering','The Engineering Design Challenge','Solve a practical design problem through sketches, prototypes and testing.','Hands-on challenge'],
 ['business-idea','Business','From Idea to Business','Find a customer, design a product, estimate costs and pitch a business concept.','Entrepreneurship challenge'],
 ['marketing-challenge','Business','The Marketing Challenge','Respond to a fictional client brief with a campaign and a short pitch.','Creative challenge'],
 ['save-the-budget','Business','Save the Budget','Act as the finance team of a struggling business and recommend a plan.','Finance simulation'],
 ['real-estate-deal','Business','The Real Estate Deal','Evaluate a fictional property with costs, trade-offs and a recommendation.','Business simulation'],
 ['software-sprint','Technology','The Software Design Sprint','Interview users, sketch a feature and build a small working prototype.','Software challenge'],
 ['data-detective','Technology','The Data Detective','Explore an imperfect dataset and defend a recommendation using evidence.','Data challenge'],
 ['cybersecurity-crisis','Technology','The Cybersecurity Crisis Room','Respond to a fictional security incident and prioritize an action plan.','Cybersecurity simulation'],
 ['trust-the-algorithm','Technology','Can You Trust the Algorithm?','Experiment with a classification model and investigate biased or missing data.','AI & data challenge'],
 ['build-an-app','Technology','Build an App Without Coding','Design and test a simple clickable app concept with potential users.','UX & product challenge'],
 ['inside-care-team','Healthcare','Inside the Care Team','Work through a fictional patient journey and compare healthcare roles.','Career simulation'],
 ['stop-the-outbreak','Healthcare','Stop the Outbreak','Analyze a fictional public-health scenario and choose an evidence-based response.','Science & health challenge'],
 ['you-be-the-lawyer','Law','You Be the Lawyer','Read a fictional case, develop an argument and practice presenting it.','Legal simulation'],
 ['negotiation-table','Law','The Negotiation Table','Negotiate a fictional business agreement and explain the trade-offs.','Negotiation challenge'],
 ['design-a-space','Design','Design a Space','Create an architectural layout under budget, accessibility and space constraints.','Architecture challenge'],
 ['ux-redesign','Design','The UX Redesign','Study user frustrations and redesign a confusing digital experience.','Design challenge'],
 ['newsroom-challenge','Design','The Newsroom Challenge','Check sources and assemble a responsible short news report.','Media simulation'],
 ['psychologist','Education','Think Like a Psychologist','Plan an ethical nonclinical study of decision-making and evaluate example results.','Research challenge'],
 ['teach-it-better','Education','Teach It Better','Design and improve a short lesson with feedback from peers.','Education challenge'],
 ['choose-your-major','College','Choose Your Major','Compare academic paths and create a sample course and career plan.','College workshop'],
 ['college-life','College','Design Your College Life','Plan a semester around classes, work, money, Shabbos and commitments.','College workshop']
];
const industryList=['Engineering & manufacturing','Software, AI & data','Healthcare & science','Law & public policy','Architecture & design','Finance & business','Media & marketing','Education & nonprofit work'];
const volunteerList=['Help organize an event','Facilitate a team or workshop','Design learning activities','Outreach and recruit participants','Create graphics and promotion','Help with technology or data','Research opportunities','Host or support in-person events'];
const professionalList=['Answer a few questions','Join a short team consultation','Review a project or proposal','Join a panel or final presentation','Host an office or workplace visit','Offer ongoing mentoring'];
const txt=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;n.textContent=value;return n};
function card(item,featuredCard){
 const id=item[0],title=item[1],meta=featuredCard?item[2]:item[2]+' · '+item[4],desc=featuredCard?item[3]:item[3];
 const el=document.createElement('article');el.className='jm-experience-card';el.append(txt('div','jm-experience-meta',meta),txt('h3','',title),txt('p','',desc));
 const foot=document.createElement('div');foot.className='jm-card-footer';
 if(featuredCard)foot.append(txt('span','jm-card-location',item[4]));
 const a=document.createElement('a');a.className='jm-card-action';a.href='join.html?role=seek&interest='+encodeURIComponent(title);a.dataset.jmDrawer='experience';a.dataset.jmExperience=id;a.textContent='Join interest list';a.setAttribute('aria-haspopup','dialog');foot.append(a);el.append(foot);return el;
}
document.querySelectorAll('[data-jm-featured]').forEach(root=>featured.forEach(item=>root.append(card(item,true))));
const libraryRoot=document.querySelector('[data-jm-library]');
const filter=document.querySelector('[data-jm-library-filter]');
if(libraryRoot){
 const render=()=>{
  const category=filter?filter.value:'All';
  libraryRoot.replaceChildren();
  const filtered=library.filter(item=>category==='All'||item[1]===category);
  filtered.forEach(item=>libraryRoot.append(card(item,false)));
 };
 filter?.addEventListener('change',render);render();
}
if(typeof HTMLDialogElement==='undefined'||typeof HTMLDialogElement.prototype.showModal!=='function')return;
const dialog=document.createElement('dialog');dialog.className='jm-drawer';dialog.setAttribute('aria-labelledby','jm-drawer-title');
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
dialog.addEventListener('close',()=>document.body.classList.remove('jm-drawer-open'));
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
 form.reset();status.textContent='';status.dataset.error='false';submit.disabled=false;submit.textContent=activeType==='volunteer'?'Offer to volunteer':activeType==='professional'?'Share how I can help':activeType==='workplace'?'Request a career visit':'Join interest list';
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
 e.preventDefault();show(a.dataset.jmDrawer,a.dataset.jmExperience||a.dataset.jmTitle||'');
});
const limited=(s,n)=>String(s||'').trim().slice(0,n);
async function post(table,data){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),20000);
 try{
  const result=await fetch(api+table,{method:'POST',mode:'cors',credentials:'omit',signal:ctrl.signal,headers:{apikey:key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(data)});
  if(!result.ok)throw Error('Request failed ('+result.status+')');
 }finally{clearTimeout(timer)}
}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 if(form.elements.namedItem('website')?.value)return;
 const first=limited(form.elements.first.value,100),last=limited(form.elements.last.value,100),email=limited(form.elements.email.value,254);
 if(!first||!last||!email)return;
 const region=limited(form.elements.region.value,150),availability=limited(form.elements.availability.value,80),notes=limited(form.elements.notes.value,650);
 const select=form.elements.namedItem('area'),area=select?limited(select.value,120):'';
 const checked=[...form.querySelectorAll('input[name=areas]:checked')].map(x=>x.value);
 const wantsVolunteer=!!form.querySelector('input[name=also_volunteer]:checked');
 submit.disabled=true;submit.textContent='Saving…';status.textContent='Saving your interest…';status.dataset.error='false';
 try{
  if(activeType==='volunteer'||activeType==='professional'){
   const subject=activeType==='volunteer'?'Volunteer interest':'Professional contribution';
   const message=limited('['+subject+'] Activities: '+checked.join(', ')+'. Location: '+region+'. Availability: '+availability+'. Notes: '+notes,1950);
   await post('pj_inquiries',{full_name:limited(first+' '+last,150),email,message,source:activeType==='volunteer'?'jewish-mutual-volunteer-2026':'jewish-mutual-expert-2026'});
  }else{
   const interestChoices=activeId==='career-interests'?[...document.querySelectorAll('[data-jm-field][aria-pressed="true"]')].map(el=>el.dataset.jmField).join(', '):'';
   const detail=activeType==='workplace'?'[Workplace visit request] Fields: '+checked.join(', '):'[Experience request] ID: '+activeId+'. Title: '+activeTitle+'. Selected fields: '+interestChoices+'. Perspective: '+area;
   const needed=limited(detail+'. Availability: '+availability+'. Notes: '+notes,1450);
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
