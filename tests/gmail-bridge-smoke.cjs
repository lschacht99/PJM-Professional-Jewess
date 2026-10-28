const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('google-apps-script/JewishMutualConfirmation.gs','utf8');
const props=new Map([['JM_BRIDGE_SECRET','a'.repeat(64)]]);
const sent=[];
let owner='thejewishmutual@gmail.com',quota=10,locked=false;
const sandbox={
 console:{error:()=>{}},
 ContentService:{MimeType:{JSON:'JSON'},createTextOutput(text){return{text,setMimeType(){return this;}}}},
 PropertiesService:{getScriptProperties(){return {getProperty:k=>props.get(k)||null,setProperty:(k,v)=>props.set(k,v)}}},
 Session:{getEffectiveUser(){return{getEmail:()=>owner}}},
 LockService:{getScriptLock(){return{tryLock(){if(locked)return false;locked=true;return true},releaseLock(){locked=false}}}},
 MailApp:{getRemainingDailyQuota(){return quota},sendEmail(message){sent.push(message)}},
};
vm.createContext(sandbox);
vm.runInContext(source,sandbox,{timeout:2500});
const job={
 idempotency_key:'jm-user-00000000-0000-4000-8000-000000000001',
 to:'recipient@example.invalid',subject:'We received your interests',
 text:'Hi there!',html:'<p>Hi there!</p>',
 token:'a'.repeat(64)
};
const invoke=(obj)=>JSON.parse(sandbox.doPost({postData:{contents:JSON.stringify(obj)}}).text);
assert.deepEqual(invoke({...job,token:'wrong'}),{ok:false,code:'unauthorized'});
assert.equal(sent.length,0);
owner='not-thejewishmutual@gmail.com';
assert.deepEqual(invoke(job),{ok:false,code:'wrong_account'});
owner='thejewishmutual@gmail.com';
quota=0;
assert.deepEqual(invoke(job),{ok:false,code:'daily_quota_exceeded'});
quota=10;
assert.deepEqual(invoke({...job,to:'not-an-email'}),{ok:false,code:'invalid_recipient'});
assert.deepEqual(invoke(job),{ok:true,code:'sent'});
assert.equal(sent.length,1);
assert.equal(sent[0].name,'The Jewish Mutual');
assert.equal(sent[0].replyTo,'thejewishmutual@gmail.com');
assert.equal(sent[0].to,'recipient@example.invalid');
assert.equal(sent[0].htmlBody,'<p>Hi there!</p>');
assert.deepEqual(invoke(job),{ok:true,code:'already_sent'});
assert.equal(sent.length,1,'repeated webhook must not send twice');
console.log('PASS: Gmail sender auth, account identity, quota, validation, formatting and deduplication.');
