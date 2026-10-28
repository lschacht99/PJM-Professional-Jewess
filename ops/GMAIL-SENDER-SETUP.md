# Send The Jewish Mutual confirmations from the existing Gmail address

**Sender:** `thejewishmutual@gmail.com` (an existing Google account, not a custom domain).
**Status:** Gmail integration code is prepared, but sending is **disabled** until the mailbox owner completes the secure one-time setup.

You do **not** need to buy a domain or subscribe to Google Workspace for this setup. Google Apps Script `MailApp` has a published quota of 100 recipients per day for consumer Gmail accounts (subject to Google's changing limits). Each applicant receipt uses one recipient; optional team notifications use an additional recipient. For a growing operation, a dedicated verified sending domain / transactional email provider remains the more scalable long-term option.

## One-time setup: approximately six actions in your accounts

1. Sign in as **thejewishmutual@gmail.com** and open [Google Apps Script](https://script.google.com/home/projects/create). Name the project **The Jewish Mutual - confirmations**.
2. Replace the default `Code.gs` code with the complete contents of [`google-apps-script/JewishMutualConfirmation.gs`](../../google-apps-script/JewishMutualConfirmation.gs). Save.
3. In the **Supabase SQL Editor** for project `vvveenntewwtyhnmimal`, execute:
   ```sql
   select webhook_token from public.pj_mail_settings where id=1;
   ```
   Treat the returned value as a **private credential**. Do not paste it in ChatGPT, GitHub or a website. In Apps Script, open **Project Settings → Script Properties → Add script property**. Set name `JM_BRIDGE_SECRET` and value to that exact token. Save.
4. In the Apps Script editor, select function `authorizeJewishMutualMail` and click **Run**. Review Google's permission request and authorize the script to send email **as thejewishmutual@gmail.com**. No email is sent by this test.
5. Choose **Deploy → New deployment → Web app**, set **Execute as: Me**, **Who has access: Anyone**, and deploy. Copy the `https://script.google.com/macros/s/.../exec` URL. This is a publicly reachable gateway **protected by the private token**; it cannot send without it. Keep the private token secret.
6. In **Supabase → Edge Functions → Secrets**, set `JM_GMAIL_SCRIPT_URL` to the full `.../exec` deployment URL. This switches the existing Edge Function's delivery transport to Gmail, leaving its secure database webhook authentication intact. The sender is **not enabled yet**.

## Test, then enable

Only after the script is deployed, authorized, and `JM_GMAIL_SCRIPT_URL` is set:

1. Submit an approved test inquiry using an inbox you control, with `pj_mail_settings.enabled=false`. It will queue as `waiting_for_setup`, **not send**.
2. In the Supabase SQL Editor, when you are ready for new public inquiries to trigger messages, turn on the sender:
   ```sql
   update public.pj_mail_settings
   set enabled=true,updated_at=now()
   where id=1;
   ```
3. Submit **one new, authorized test** from the website to an inbox you control (don't use the same type/address twice within ten minutes). Confirm the branded message arrives from `thejewishmutual@gmail.com`, the email shows the chosen experiences when present, and it clearly states that interest is not a booking. Check Gmail's Sent folder and the private queue. Verify the sender's daily quota is not exhausted.
4. Turn the sender off again if anything is wrong:
   ```sql
   update public.pj_mail_settings set enabled=false,updated_at=now() where id=1;
   ```

### Delivery audit (Supabase SQL Editor)

```sql
select kind,status,count(*) as jobs from public.pj_mail_jobs
group by kind,status order by kind,status;

select id,kind,status,provider_message_id,last_error,created_at,sent_at
from public.pj_mail_jobs order by created_at desc limit 20;
```

A `sent` status means the Google script accepted and invoked the send. Actual inbox delivery should still be checked. The `provider_message_id` is an internal idempotency marker in Gmail mode, not a Gmail Message ID.

## How the secure flow works

`Website signup → Supabase database insert → private mail outbox → authenticated Supabase Edge Function → Google Apps Script → MailApp → Gmail confirmation`.

The public website never sees the Supabase service-role key, webhook token, or Gmail permissions. Google Apps Script accepts only correctly signed jobs from the authenticated backend, checks the script runs under the expected mailbox, and records sent-job markers to prevent duplicate sends. Because Apps Script web apps need public access for server-to-server requests, the body includes an authentication token. Rotating the token requires updating the Apps Script Script Property and the database webhook credential together.

### Notes

- The existing Resend implementation is retained as an alternative if you later buy a domain. Setting `JM_GMAIL_SCRIPT_URL` selects Gmail over Resend.
- The app can send confirmations for participant interests, professionals, volunteers, workplace requests, and contact messages.
- Optional staff notifications are controlled by the `JM_TEAM_NOTIFY_EMAIL` Supabase secret; they consume another recipient from the same Gmail quota.
- The email display name will be **The Jewish Mutual**. The visible From address will be **thejewishmutual@gmail.com** because the owner authorized `MailApp`.
- Use Google's consumer Gmail quotas responsibly; do not repurpose the sender for marketing/bulk campaigns.
- Changing the website is **not** necessary to activate: the current forms already insert into the three backend tables.
- Gmail setup and authorization must be completed by the mailbox owner. No server can legitimately grant itself permission to send from that Gmail account without the owner's authorization.
