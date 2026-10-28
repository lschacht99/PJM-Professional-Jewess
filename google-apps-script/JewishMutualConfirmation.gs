/**
 * The Jewish Mutual — Gmail confirmation sender.
 * Deploy this script while signed in as thejewishmutual@gmail.com.
 * Never place the authentication token in this source file or on the website.
 *
 * Script Property: JM_BRIDGE_SECRET = the existing 64-character
 * pj_mail_settings.webhook_token (obtain privately from Supabase SQL Editor).
 *
 * Deploy > New deployment > Web app
 * Execute as: Me | Who has access: Anyone
 * The web app is accessible but cannot send without the private token.
 */

const JM_OWNER_EMAIL = 'thejewishmutual@gmail.com';
const JM_ID_PATTERN = /^jm-(?:user|staff)-[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const JM_EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function jmResponse_(status, code) {
  return ContentService.createTextOutput(JSON.stringify({ok:status,code:code}))
    .setMimeType(ContentService.MimeType.JSON);
}
function jmSecureEqual_(a,b) {
  a=String(a||'');b=String(b||'');
  var diff=a.length^b.length;
  for(var i=0;i<Math.max(a.length,b.length);i++)diff|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);
  return diff===0;
}
function doGet(){
  return ContentService.createTextOutput('The Jewish Mutual mail gateway is available. Sending requires authentication.');
}
function doPost(e) {
  try {
    if(!e||!e.postData||!e.postData.contents||e.postData.contents.length>65000)
      return jmResponse_(false,'bad_request');
    var data=JSON.parse(e.postData.contents);
    var settings=PropertiesService.getScriptProperties();
    var expected=settings.getProperty('JM_BRIDGE_SECRET')||'';
    if(!/^[a-f0-9]{64}$/i.test(expected)||
       !jmSecureEqual_(String(data.token||''),expected))
      return jmResponse_(false,'unauthorized');
    var owner=Session.getEffectiveUser().getEmail().toLowerCase();
    if(owner!==JM_OWNER_EMAIL)return jmResponse_(false,'wrong_account');
    var id=String(data.idempotency_key||'');
    if(!JM_ID_PATTERN.test(id))return jmResponse_(false,'invalid_id');
    var to=String(data.to||'').trim();
    if(!JM_EMAIL_PATTERN.test(to)||to.length>254)return jmResponse_(false,'invalid_recipient');
    var subject=String(data.subject||'').slice(0,190);
    var body=String(data.text||'').slice(0,10000);
    var html=String(data.html||'');
    if(!subject||!body||!html||html.length>40000)
      return jmResponse_(false,'invalid_content');

    // The job ID is unique in Supabase. Locking and a permanent sent marker
    // prevent redeliveries, including when the upstream HTTP response is lost.
    var lock=LockService.getScriptLock();
    if(!lock.tryLock(10000))return jmResponse_(false,'busy');
    try{
      var marker='sent_'+id;
      if(settings.getProperty(marker))return jmResponse_(true,'already_sent');
      if(MailApp.getRemainingDailyQuota()<1)
        return jmResponse_(false,'daily_quota_exceeded');
      MailApp.sendEmail({
        to:to,subject:subject,body:body,htmlBody:html,
        name:'The Jewish Mutual',replyTo:JM_OWNER_EMAIL
      });
      settings.setProperty(marker,new Date().toISOString());
      return jmResponse_(true,'sent');
    }finally{lock.releaseLock();}
  }catch(err){
    // Do not log recipients, credentials, or the email body.
    console.error('JM mail delivery failed: '+(err&&err.name||'unknown'));
    return jmResponse_(false,'send_failed');
  }
}

/**
 * Run once in the editor to grant the script permission to send mail.
 * It does not send a test email or create a deployment.
 */
function authorizeJewishMutualMail(){
  if(Session.getEffectiveUser().getEmail().toLowerCase()!==JM_OWNER_EMAIL)
    throw new Error('Sign in with '+JM_OWNER_EMAIL);
  Logger.log('Sender authorized. Recipients remaining today: '+MailApp.getRemainingDailyQuota());
}
