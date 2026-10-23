const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const errors=[];
 const observe=(page,label)=>{
   page.on('pageerror',e=>errors.push(label+': '+e.message));
   page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().includes('fonts.googleapis'))errors.push(label+': '+msg.text())});
 };
 try {
   const mobile=await browser.newPage({viewport:{width:375,height:667},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   observe(mobile,'mobile');
   const posts=[];
   await mobile.route('https://vvveenntewwtyhnmimal.supabase.co/rest/v1/**',async route=>{
     posts.push({url:route.request().url(),payload:JSON.parse(route.request().postData()||'{}')});
     await route.fulfill({status:201,body:'',headers:{'access-control-allow-origin':'*'}});
   });
   await mobile.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
   await mobile.waitForFunction(()=>document.documentElement.dataset.jmDrawerReady==='true');
   assert.equal(await mobile.locator('.jm-home-choice').count(),2,'exactly two prominent audience paths');
   assert.equal(await mobile.locator('[data-jm-featured]').count(),0,'no prospective events on homepage');
   assert.equal(await mobile.locator('.jm-home-fields-grid .jm-home-field').count(),8,'compact field links');
   assert.match(await mobile.locator('h1').innerText(),/Find out what a career is/i);
   assert.ok((await mobile.locator('.jm-home-choice').nth(1).boundingBox()).y+
             (await mobile.locator('.jm-home-choice').nth(1).boundingBox()).height<=667,
             'both audience choices visible on initial 375px phone viewport');
   assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'mobile no horizontal overflow');
   assert.equal(await mobile.locator('.jm-home-choice').first().getAttribute('href'),'opportunities.html#library');
   assert.equal(await mobile.locator('.jm-home-choice').last().getAttribute('href'),'partners.html');
   assert.ok(!(await mobile.locator('main').innerText()).toLowerCase().includes('women-centered'),'no repeated women-centered labels');
   await mobile.locator('[data-jm-drawer="experience"]').first().click();
   assert.equal(await mobile.locator('.jm-drawer[open]').count(),1,'mobile interest drawer opens');
   assert.equal(new URL(mobile.url()).pathname,'/index.html','no full-page signup navigation');
   assert.match(await mobile.locator('#jm-drawer-title').innerText(),/career exploration/i);
   await mobile.locator('#jm-first').fill('Smoke');
   await mobile.locator('#jm-last').fill('Test');
   await mobile.locator('#jm-email').fill('smoke@example.invalid');
   await mobile.locator('#jm-format').selectOption({label:'Online'});
   await mobile.locator('input[name=consent]').check();
   await mobile.locator('#jm-drawer-form [type=submit]').click();
   await mobile.waitForFunction(()=>document.querySelector('.jm-drawer-state')?.textContent?.includes('Your interest was saved'));
   assert.equal(posts.length,1,'mocked interest request');
   assert.equal(posts[0].payload.role,'mentee');
   assert.ok(posts[0].payload.help_needed.includes('career-interests'));
   assert.ok(posts[0].payload.help_needed.includes('Online'));
   await mobile.keyboard.press('Escape');
   assert.equal(await mobile.locator('.jm-drawer[open]').count(),0,'escape closes drawer');
   await mobile.goto('http://127.0.0.1:8765/opportunities.html?field=Technology#library',{waitUntil:'domcontentloaded'});
   await mobile.waitForSelector('[data-jm-library] .jm-experience-card');
   assert.equal(await mobile.locator('#jm-library-filter').inputValue(),'Technology','deep-link category selected');
   assert.equal(await mobile.locator('[data-jm-library] .jm-experience-card').count(),5,'tech filtered to five ideas');
   assert.equal(await mobile.locator('#featured').count(),0,'no upcoming-events section');
   await mobile.selectOption('#jm-library-filter',{label:'All'});
   assert.equal(await mobile.locator('[data-jm-library] .jm-experience-card').count(),26,'whole idea library');
   await mobile.locator('[data-jm-library] [data-jm-drawer="experience"]').first().click();
   assert.equal(await mobile.locator('.jm-drawer[open]').count(),1,'idea requests open a drawer');
   await mobile.locator('.jm-drawer-close').click();
   await mobile.goto('http://127.0.0.1:8765/partners.html',{waitUntil:'domcontentloaded'});
   await mobile.locator('[data-jm-drawer="volunteer"]').first().click();
   assert.equal(await mobile.locator('.jm-drawer[open]').count(),1,'volunteer drawer opens');
   await mobile.locator('#jm-first').fill('Volunteer');
   await mobile.locator('#jm-last').fill('Test');
   await mobile.locator('#jm-email').fill('volunteer@example.invalid');
   await mobile.locator('input[name=areas]').first().check();
   await mobile.locator('input[name=consent]').check();
   await mobile.locator('#jm-drawer-form [type=submit]').click();
   await mobile.waitForFunction(()=>document.querySelector('.jm-drawer-state')?.textContent?.includes('volunteer interest was saved'));
   assert.equal(posts.length,2,'volunteer submission intercepted');
   assert.ok(posts[1].url.endsWith('pj_inquiries'),'volunteer uses inquiry table');
   await mobile.locator('.jm-drawer-close').click();
   const desktop=await browser.newPage({viewport:{width:1280,height:900}});
   observe(desktop,'desktop');
   await desktop.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
   assert.equal(await desktop.locator('.jm-home-choice').count(),2,'desktop two paths');
   assert.ok(await desktop.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'desktop no overflow');
   await desktop.goto('http://127.0.0.1:8765/partners.html',{waitUntil:'domcontentloaded'});
   await desktop.locator('[data-jm-drawer="professional"]').first().click();
   const bounds=await desktop.locator('.jm-drawer').boundingBox();
   assert.ok(bounds&&bounds.x>650&&bounds.width<=535,'desktop professional drawer on right');
   await desktop.keyboard.press('Escape');
   assert.equal(await desktop.locator('.jm-drawer[open]').count(),0);
   assert.deepEqual(errors,[],'no client-side exceptions');
   console.log('PASS: two above-fold mobile CTAs, no homepage events, filtered idea catalog, volunteer/professional drawers, mocked writes, no overflow.');
 } finally {await browser.close()}
})().catch(err=>{console.error('FAILED',err);process.exit(1)});
