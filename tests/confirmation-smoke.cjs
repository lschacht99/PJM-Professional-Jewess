const fs=require('node:fs');
const assert=require('node:assert/strict');
const sql=fs.readFileSync('ops/sql/pj-confirmation-outbox.sql','utf8');
const edge=fs.readFileSync('supabase/functions/jm-confirmation/index.ts','utf8');
for(const table of ['pj_interest_shortlists','pj_applications','pj_inquiries']){
 assert.match(sql,new RegExp('create trigger pj_'+table.replace(/^pj_/,'')+'_mail_confirmation','i'),'trigger missing for '+table);
}
for(const role of ['anon','authenticated']){
 assert.match(sql,new RegExp('revoke all on public\\.pj_mail_jobs from public, anon, authenticated','i'),'anonymous access not revoked');
}
assert.match(sql,/enable row level security/);
assert.match(sql,/default false/,'new sender must default OFF');
assert.match(sql,/waiting_for_setup/);
assert.match(sql,/return NEW;/,'must not block normal form processing');
assert.match(sql,/exception when others/,'webhook failure must not fail signup');
assert.match(sql,/created_at>now\(\)-interval '10 minutes'/);
assert.match(sql,/pj_retry_confirmation/);
assert.ok(!/service.role.key\s*=\s*["']/.test(edge),'never hardcode privileged key');
assert.ok(!/re_[A-Za-z0-9]{20,}/.test(edge),'never commit Resend API key');
assert.match(edge,/JM_RESEND_API_KEY/);
assert.match(edge,/JM_FROM_EMAIL/);
assert.match(edge,/JM_TEAM_NOTIFY_EMAIL/);
assert.match(edge,/x-jm-hook-token/);
assert.match(edge,/safeEqual\(/);
assert.match(edge,/whereStatus\?:string/);
assert.match(edge,/status:"sending"/);
assert.match(edge,/status:"sent"/);
assert.match(edge,/status:"failed"/);
assert.match(edge,/Idempotency-Key/);
assert.match(edge,/escapeHtml\(name\)/);
assert.match(edge,/privacy\.html/);
assert.match(edge,/contact\.html/);
for(const kind of ['participant','professional','volunteer','workplace','contact','collaboration']){
 assert.match(edge,new RegExp('(?:^|\\n) '+kind+':\\{'),'email template missing for '+kind);
}
assert.match(edge,/not a confirmed place in a program/);
assert.match(edge,/not committed to hosting or mentoring/);
assert.match(edge,/No particular company, visit or date/);
const bridge=fs.readFileSync('google-apps-script/JewishMutualConfirmation.gs','utf8');
new Function(bridge); // Google Apps Script uses the V8 JavaScript runtime.
assert.match(bridge,/thejewishmutual@gmail\.com/);
assert.match(bridge,/MailApp\.sendEmail/);
assert.match(bridge,/JM_BRIDGE_SECRET/);
assert.match(bridge,/JM_OWNER_EMAIL/);
assert.match(bridge,/Session\.getEffectiveUser/);
assert.match(bridge,/jmSecureEqual_/);
assert.match(bridge,/MailApp\.getRemainingDailyQuota/);
assert.match(bridge,/LockService\.getScriptLock/);
assert.match(bridge,/setProperty\(marker/);
assert.ok(!/JM_BRIDGE_SECRET\s*=\s*['"][a-f0-9]{64}['"]/.test(bridge),'do not publish a fixed secret');
assert.match(edge,/JM_GMAIL_SCRIPT_URL/);
assert.match(edge,/async function sendGmail/);
assert.match(edge,/sendMessage\(/);
assert.match(edge,/settings\.webhook_token/);
assert.ok(edge.includes('!GMAIL_SCRIPT_URL &&'),'Gmail route must bypass Resend credential guard');
assert.match(sql,/timeout_milliseconds:=30000/);
console.log('PASS: secured Gmail or Resend dispatch, six templates and private email outbox.');
