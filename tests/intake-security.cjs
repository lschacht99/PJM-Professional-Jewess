const assert=require('node:assert/strict');
const fs=require('node:fs');
const root=p=>fs.readFileSync(p,'utf8');
const secure=root('assets/jm-secure-submit.js');
const edge=root('supabase/functions/jm-intake/index.ts');
const setup=root('ops/sql/pj-intake-rate-limits.sql');
const cutover=root('ops/sql/pj-disable-public-inserts.sql');
for(const f of ['assets/experience-drawer.js','assets/jm-discovery.js','assets/site.js']){
 const s=root(f);
 assert.match(s,/JMSecureSubmit\.submit/,'secure submit missing '+f);
 assert.doesNotMatch(s,/fetch\((?:api|API)\+table/,'direct insert remains '+f);
 assert.doesNotMatch(s,/fetch\(API,\{method:'POST'/,'direct insert remains '+f);
}
for(const file of ['index.html','about.html','opportunities.html','partners.html','join.html','contact.html','privacy.html','resources.html','understanding-jewish-life.html','challenge-product.html','applied.html','experience-architecture.html']){
 const html=root(file);
 assert.match(html,/src="assets\/jm-secure-submit\.js"/,'gateway client missing '+file);
 const sec=html.indexOf('src="assets/jm-secure-submit.js"');
 const legacy=html.search(/src="assets\/(?:jm-discovery|site|experience-drawer)\.js"/);
 assert.ok(sec<legacy,'script load order wrong '+file);
}
assert.match(edge,/pj_claim_intake_quota/,'rate limiter not required');
assert.match(edge,/challenges\.cloudflare\.com\/turnstile\/v0\/siteverify/);
assert.match(edge,/v\.hostname==="lschacht99\.github\.io"/);
assert.match(edge,/v\.action==="jm_intake"/);
assert.match(edge,/JM_TURNSTILE_SECRET_KEY/);
assert.match(edge,/JM_TURNSTILE_SITE_KEY/);
assert.match(edge,/service_unavailable/);
assert.match(edge,/invalid_form/);
assert.match(edge,/too_many_requests/);
assert.match(secure,/turnstile\.render/);
assert.match(secure,/turnstile\.reset/);
assert.match(secure,/captcha_required/);
assert.match(setup,/security definer/);
assert.match(setup,/revoke all on function public\.pj_claim_intake_quota/);
assert.match(cutover,/revoke insert \(%I\)/);
assert.match(cutover,/drop policy if exists pj_public_application_submission/);
assert.match(cutover,/drop policy if exists pj_interest_shortlists_public_insert/);
assert.match(cutover,/drop policy if exists pj_public_inquiry_submission/);
new Function(secure);
for(const p of ['assets/experience-drawer.js','assets/site.js','assets/jm-discovery.js'])new Function(root(p));
console.log('PASS: Three form families use secure gateway; rate limit, Turnstile and cutover guards present.');
