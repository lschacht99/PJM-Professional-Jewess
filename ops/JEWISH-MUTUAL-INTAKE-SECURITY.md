# Jewish Mutual application security

Only Jewish Mutual intake is changed. Hamsa Nomads routes, functions, and tables are untouched.

## What is installed
- `jm-intake` Supabase Edge Function checks origin, content type, allowable table, input fields, consent, and bounded text before writing server-side with the private service-role key. It accepts **only** `pj_interest_shortlists`, `pj_applications`, and `pj_inquiries`.
- Private `pj_intake_limits` table and `pj_claim_intake_quota` RPC enforce atomic budgets: 8 submissions per network fingerprint per hour and 3 per email fingerprint per day. These are protection measures, not identity guarantees; shared networks and IP variability affect precision.
- Email and IP fingerprints are salted server-side; the quota table stores neither raw email nor raw IP. The endpoint never returns submitted PII.
- All three JS form families call one `assets/jm-secure-submit.js` client. Email confirmations continue through the existing private confirmation queue when sender credentials are activated.
- `pj-disable-public-inserts.sql` revokes both table and **column-level** public INSERT permissions and drops legacy anonymous insert policies. This is essential: Turnstile alone cannot protect a public database API.
- Cloudflare Turnstile is integrated with explicit rendering for dynamically opened forms, server-side Siteverify, exact hostname (`lschacht99.github.io`) and action (`jm_intake`) checks, single-use tokens and expiry. It activates automatically when both server-side secrets are configured.

## Cloudflare setup (one-time account action)
1. In [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile), create a **Managed** widget for hostname `lschacht99.github.io`. Do not enter an entire URL or a path. Because GitHub Pages shares that hostname with other repositories, scope protection to this app by verifying the `jm_intake` action and using only the protected Edge Function.
2. Copy the public **site key** and private **secret key**. The site key is not sensitive; the secret must never be pasted in a chat, GitHub repository, frontend JavaScript, or user-visible screenshot.
3. In Supabase project `vvveenntewwtyhnmimal` > Edge Functions > Secrets, set:
   - `JM_TURNSTILE_SITE_KEY` to the site key
   - `JM_TURNSTILE_SECRET_KEY` to the private secret
4. The deployed gateway's `GET` configuration endpoint will then show `captcha_required:true`. The browser automatically renders Turnstile on submission. No website code change is required.
5. Perform a controlled test on each form and confirm the Turnstile Siteverify response succeeds. A request without a valid Turnstile token should then be rejected with HTTP 403.

Until those secrets exist, **Turnstile challenges are not active**. The endpoint still enforces schema validation and per-network/per-email rate limits, and direct database writes must be disabled after successful cutover.

## Safe migration order
1. Deploy the `pj-intake-rate-limits.sql` setup and `jm-intake` function first.
2. Smoke-test invalid/malformed POSTs and a controlled legitimate submission to the endpoint.
3. Deploy the website update, and confirm homepage shortlist, Experiences, Professionals, Volunteer and Contact forms write through `jm-intake`.
4. **Only after the website is deployed**, execute `pj-disable-public-inserts.sql`. It must remove all anonymous **column** grants, not only table grants.
5. Test direct REST insert with a public key: it must fail; test the new gateway: it must still work.
6. Configure and verify Turnstile keys; the endpoint fails closed if only one secret is supplied.
7. Add email validation/opt-in follow-up before treating interest registrations as verified demand. Current accepted submissions should be reported as *unverified interest*, not verified people.

## Abuse analysis and operations
Monitor the count of rejects (HTTP 422, 403, 429), accepted submissions, and confirmed email addresses separately. A solution using IP fingerprints does not entirely stop distributed botnets. The browser honeypots and origin checks are secondary; they are not substitutes for token verification and disabled public database writes.

The rate-limit table contains only short-lived salted hashes. Purge old buckets periodically:
```sql
delete from public.pj_intake_limits where window_start < now()-interval '14 days';
```

To verify the permissions after cutover:
```sql
select table_name,
 count(*) filter(where has_column_privilege('anon',format('%I.%I',table_schema,table_name),column_name,'INSERT')) as anon_insertable_columns
from information_schema.columns
where table_schema='public'
and table_name in ('pj_applications','pj_interest_shortlists','pj_inquiries')
group by table_name;
```
All three counts must be zero. Do not weaken those restrictions to fix a broken form; repair the gateway client or function.

## Risks
- Attackers can manipulate apparent IP headers on some proxies, and determined botnets can distribute requests. Turnstile and email verification strengthen these controls.
- Real users on shared Wi-Fi can hit network quotas; staff can review and adjust the limits if necessary.
- Existing email confirmation sender is currently disabled pending Gmail owner authorization, so email verification is **not yet operational**.
