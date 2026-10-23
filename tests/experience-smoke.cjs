const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const problems=[];
 async function inspect(page,name){
  page.on('pageerror',error=>problems.push(name+': '+error.message));
  page.on('console',msg=>{if(msg.type()==='error')problems.push(name+' console: '+msg.text())});
 }
 try {
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await inspect(page,'mobile homepage');
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.jm-experience-card');
  assert.equal(await page.locator('[data-jm-featured] .jm-experience-card').count(),5,'featured cards');
  assert.equal(await page.locator('html').getAttribute('data-jm-drawer-ready'),'true','drawer initialized');
  const link=page.locator('[data-jm-featured] [data-jm-drawer]').first();
  await link.click();
  assert.equal(await page.locator('.jm-drawer[open]').count(),1,'mobile drawer opens');
  assert.equal(new URL(page.url()).pathname,'/index.html','drawer does not navigate');
  assert.match(await page.locator('#jm-drawer-title').innerText(),/NYC Challenge Lab/);
  assert.equal(await page.locator('#jm-format').count(),1,'format captured');
  await page.locator('.jm-drawer-close').click();
  assert.equal(await page.locator('.jm-drawer[open]').count(),0,'mobile drawer closes');
  await page.locator('[data-jm-drawer="volunteer"]').first().click();
  assert.equal(await page.locator('.jm-drawer[open]').count(),1,'volunteer drawer opens');
  assert.match(await page.locator('#jm-drawer-title').innerText(),/help bring this to life/i);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.jm-drawer[open]').count(),0,'Escape closes');
  await page.goto('http://127.0.0.1:8765/opportunities.html',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('[data-jm-library] .jm-experience-card');
  assert.equal(await page.locator('[data-jm-library] .jm-experience-card').count(),24,'full library count');
  await page.selectOption('#jm-library-filter',{label:'Technology'});
  assert.ok(await page.locator('[data-jm-library] .jm-experience-card').count()>=4,'technology filter');
  await page.locator('[data-jm-library] [data-jm-drawer]').first().click();
  assert.equal(await page.locator('.jm-drawer[open]').count(),1,'library drawer opens');
  await page.locator('.jm-drawer-close').click();
  const desktop=await browser.newPage({viewport:{width:1280,height:900}});
  await inspect(desktop,'desktop');
  await desktop.goto('http://127.0.0.1:8765/partners.html',{waitUntil:'domcontentloaded'});
  await desktop.locator('[data-jm-drawer="professional"]').first().click();
  assert.equal(await desktop.locator('.jm-drawer[open]').count(),1,'desktop professional drawer');
  const frame=await desktop.locator('.jm-drawer').boundingBox();
  assert.ok(frame&&frame.width<=535&&frame.x>600,'desktop right drawer geometry');
  await desktop.keyboard.press('Escape');
  assert.equal(await desktop.locator('.jm-drawer[open]').count(),0,'desktop Escape closes');
  assert.deepEqual(problems.filter(s=>!s.includes('fonts.googleapis')),[],'no browser errors');
  console.log('PASS: mobile/desktop drawers, filters, volunteer, field preference and keyboard.');
 } finally {await browser.close()}
})().catch(e=>{console.error('FAILED',e);process.exit(1)});
