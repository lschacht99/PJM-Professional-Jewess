# The Jewish Mutual — automatic confirmation emails

## Status: installed, safe mode (sending disabled)

- The Supabase Edge Function `jm-confirmation` is deployed in project `vvveenntewwtyhnmimal`.
- Database triggers are active for **new** rows in `pj_interest_shortlists`, `pj_applications`, and `pj_inquiries`. They add a private email job after a form is saved.
- A database-generated 64-character secret authenticates webhook dispatches. It is never in the public GitHub site. The Edge Function checks that secret using the service-role key that Supabase supplies server-side.
- Jobs are initially marked `waiting_for_setup`; **no email is sent** until the sender is verified and dispatch is explicitly enabled. Historical `waiting_for_setup` jobs are *not automatically sent retroactively*.
- The function supports Gmail Apps Script using the existing **thejewishmutual@gmail.com** mailbox, or Resend using a verified custom domain. Gmail is selected when the server-side `JM_GMAIL_SCRIPT_URL` environment secret is set. Both use per-job deduplication to avoid duplicate receipts on retries. It stores provider-accepted message IDs and errors in the private `pj_mail_jobs` outbox. A provider acceptance is not proof of inbox delivery.
- An optional separate team notification can be sent to a designated address after the user receipt succeeds. It includes the applicant name, email, and inquiry type, not the free-form message.

## One-time sender setup (requires email account/domain owner)

**Recommended for this project:** Follow [Gmail sender setup](GMAIL-SENDER-SETUP.md) to send directly from `thejewishmutual@gmail.com` without buying a domain. The instructions below describe the alternative Resend sender.

1. Verify a domain you control in **Resend** (add the DNS SPF/DKIM records Resend supplies). Use a sender address on that verified domain, e.g. `The Jewish Mutual <hello@your-verified-domain.org>`. This example is **not** an existing mailbox.
2. In Resend, create a sending-only API key. Do not add the key to this public GitHub repository or paste it into a website form.
3. In **Supabase Dashboard → Project `vvveenntewwtyhnmimal` → Edge Functions → Secrets**, save:
   - `JM_RESEND_API_KEY` = the sending API key (required)
   - `JM_FROM_EMAIL` = the verified sender (required)
   - `JM_REPLY_TO_EMAIL` = an inbox your team monitors (recommended)
   - `JM_TEAM_NOTIFY_EMAIL` = internal team inbox for optional new-inquiry alerts
4. Send one controlled test submission with an email you own. **Before enabling** the live trigger, check that the function can read its configured secrets and that your sender domain is verified. See the smoke-test procedure below.
5. In the Supabase SQL Editor, enable **only this organization's** dispatch:
   ```sql
   update public.pj_mail_settings
   set enabled=true,updated_at=now()
   where id=1;
   ```
   New signups will then queue webhook requests automatically; no browser changes are required. Do not turn this on before verifying the provider, and do not backfill older unconfirmed submissions without consent and review.

## Template behavior

| Form source | Confirmation subject | Notes |
|---|---|---|
| Homepage shortlist / Experiences interest | We received your career interests | Includes selected experience names when available, clarifies this is *not a booking* |
| Professionals | Thanks for offering your expertise | Makes clear no event or mentoring commitment is assumed |
| Volunteers | We received your volunteer interest | Acknowledges volunteer offer, no guaranteed assignment |
| Career-visit requests | We received your career-visit request | No workplace or date implied |
| Contact form | We received your message | Receipt only, not a response to the question |
| Other collaborations | We received your inquiry | Generic acknowledgment |

Every email uses a white, cobalt-accented Jewish Mutual layout, plain-text alternative, first name if supplied, contact link, and privacy link. The form content is HTML-escaped before rendering; free-form personal messages are not echoed into the email.

## Security and anti-spam

- Outbox and settings tables have RLS enabled and *no* anonymous `SELECT`, `INSERT`, `UPDATE` or `DELETE`.
- The public web app has no Resend API key, webhook secret, or service-role key.
- Webhooks send only a job UUID; the Edge Function reads the recipient from the private outbox.
- An atomic database update changes `queued` → `sending`, so concurrent deliveries cannot both send.
- A ten-minute per-address/per-category throttle prevents repeat receipts for rapid duplicate inquiries; submissions themselves are still recorded.
- A failed provider request becomes `failed` with a bounded error; it never invalidates a completed form submission. Do not assume it was never delivered if the provider response was ambiguous.

## Checking queues and errors

Run in the authenticated Supabase SQL Editor:

```sql
select status,kind,count(*) as jobs
from public.pj_mail_jobs group by status,kind order by status,kind;

select id,created_at,kind,status,last_error,sent_at
from public.pj_mail_jobs
where status in ('failed','queued','sending')
order by created_at desc limit 25;
```

For a **confirmed failed** job, after checking Resend's delivery logs and correcting the issue, retry up to 3 times with:

```sql
select public.pj_retry_confirmation('YOUR-JOB-UUID'::uuid);
```

This helper is not exposed to anonymous visitors and only works when sending is enabled. If the job is `sending` rather than `failed`, investigate before any manual retry.

## Smoke-test procedure

- With the sender still **disabled**, database inserts by the `anon` role should queue jobs as `waiting_for_setup` only. Transaction rollback tests confirm the triggers run without leaving a test contact.
- An unsigned function request returns HTTP **401**; a correctly signed request while sending is disabled returns **503 mail_not_enabled**.
- After verification and enablement, submit one valid interest form to an inbox you own and verify: 1 user confirmation, matching selected experience titles, an accurate non-booking disclaimer, private job status `sent`, Resend provider message ID, and optional team notification.
- Check spam and Resend's delivery log. If the provider accepted but the inbox did not receive it, treat delivery as unresolved.
- Test Professional, Volunteer and Contact with controlled test inboxes after approval. Delete only authorized test rows, with their related outbox records, once verification is complete.

## What this does not do

It does **not** create a sending mailbox, obtain sender-domain DNS access, create a Resend account, or manufacture an API key. Those require the organization's account owner. No messages will be sent from a fabricated address. The site's existing on-screen success messages remain truthful while the sender is disabled.

## Source files

- `ops/sql/pj-confirmation-outbox.sql` — private queue, 3 database triggers, authentication token and manual retry
- `supabase/functions/jm-confirmation/index.ts` — branded templates, Resend sender, idempotent delivery
- `tests/confirmation-smoke.cjs` — security and workflow regression checks
