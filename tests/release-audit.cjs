// Zero-dependency public-page integrity and release-metadata checks.
const fs=require('node:fs'), assert=require('node:assert/strict');
const base='https://lschacht99.github.io/PJM-Professional-Jewess/';
const pages=['index.html','opportunities.html','partners.html','about.html','join.html','contact.html','resources.html','privacy.html','understanding-jewish-life.html'];
const legacy=['challenge-product.html','experience-architecture.html','applied.html','404.html'];
const read=p=>fs.readFileSync(p,'utf8');
const ids={};
for(const p of [...pages,...legacy])ids[p]=new Set([...read(p).matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]));
let links=0;
for(const p of pages){
 const s=read(p);
 assert.match(s,/<meta name="robots" content="noindex,follow">/,'staging noindex missing '+p);
 assert.match(s,/<meta property="og:image"/,'share image missing '+p);
 assert.match(s,/<meta name="twitter:card"/,'twitter share card missing '+p);
 const canon=p==='index.html'?base:base+p;
 assert.ok(s.includes('rel="canonical" href="'+canon+'"'),'canonical wrong '+p);
 const idArray=[...s.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
 assert.equal(new Set(idArray).size,idArray.length,'duplicate IDs in '+p);
 for(const match of s.matchAll(/\bhref=["']([^"']+)["']/g)){
  const href=match[1].replace(/&amp;/g,'&');
  if(/^(?:https?:|mailto:|tel:|javascript:)/.test(href))continue;
  const [dest,fragment]=href.split('#');
  const file=(dest||p).split('?')[0]||p;
  if(file.endsWith('.html')&& !fs.existsSync(file))throw Error('missing page '+file+' linked from '+p);
  if(fragment&&ids[file])assert.ok(ids[file].has(decodeURIComponent(fragment)),'missing #'+fragment+' on '+file+' (from '+p+')');
  links++;
 }
}
assert.ok(!read('join.html').includes('class="join-form"'),'deprecated participant form still present');
assert.ok(read('opportunities.html').includes('id="jm-library-expand"'),'catalog expand button missing');
for(const p of legacy)assert.match(read(p),/noindex/,'legacy page must remain unindexed');
const sitemap=read('sitemap.xml');
assert.ok(!sitemap.includes('/applied.html'),'legacy pages in main sitemap');
assert.ok(read('robots.txt').includes('Sitemap:'),'sitemap reference missing');
console.log('PASS: '+pages.length+' core pages; '+links+' internal links, staging metadata, canonical tags, no duplicate IDs, catalog and form routes.');
