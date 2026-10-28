# The Jewish Mutual — Development release checklist

This repository is an **early-stage, publicly accessible development website**, not a confirmed program calendar.

## Status and visitor expectations
- Career conversations and practical experience cards describe ideas being developed, not scheduled places, confirmed mentors, internships or commitments.
- Site pages currently include `<meta name="robots" content="noindex,follow">` to discourage premature search indexing. This does not prevent someone from opening the GitHub Pages URL. Remove `noindex` on the pages intended to be public **only when launch readiness is approved**.
- The homepage remains a short invitation. The Experiences page is the source of truth for detailed ideas and the multiple-interest form. The old Join URL routes to the two active paths.

## Registration intake / operational steps
- Submissions use Supabase tables `pj_interest_shortlists`, `pj_applications` and `pj_inquiries`. Frontend requests contain only a publishable key, never a service key. Anon `SELECT`, `UPDATE`, `DELETE` must remain disabled; keep RLS and column grants verified.
- **Confirmation backend now installed:** An `INSERT` into any of the three Jewish Mutual intake tables adds an email job in a private Supabase outbox. The authenticated `jm-confirmation` Edge Function creates branded HTML/plain-text receipts through Resend, records provider IDs and avoids duplicate sends. Optional team notifications are supported. See [the email setup instructions](ops/AUTOMATIC-CONFIRMATIONS.md).
- **Sending is deliberately disabled until a real sender domain and Resend sending API key are configured.** Do not claim an email was sent while `pj_mail_settings.enabled=false`. New jobs remain `waiting_for_setup` and are not automatically backfilled. No credentials are committed in the GitHub repository.
- Establish a staff owner for each incoming inquiry category (participant, professional, workplace, contact). Review Supabase submissions through authenticated admin access until automated alerts are verified. Do not expose applicant data in a public dashboard or client-side `SELECT`.
- Email receipts are limited to one per address and form type per ten minutes. Add further server/edge bot protection to the anonymous submission endpoints before large-scale promotion; frontend honeypots alone do not stop automated spam.
- Verify one legitimate consented submission through each of the three forms, verify exact stored data, follow-up email, and staff notification, then delete authorized test records. The existing Playwright tests intercept writes and do **not** test actual deliverability.
- Decide on data retention and deletion service-level targets; update Privacy accordingly once actual processes are established.

## Metrics — only after privacy review
Track aggregated: homepage to Experiences click, catalog filter interaction, selections created, drawer opened, successful participant request, professional inquiry. Use a privacy-conscious service and update the privacy notice if new tracking is added. Avoid shipping unverified analytics scripts or transmitting sensitive form fields in analytics events.

## Before announcing a public launch
1. Resolve provider credentials and staff notifications; establish reliable follow-up.
2. Validate all critical routes, keyboard navigation, Safari on a real iPhone, and form submissions with authorized test data.
3. Confirm that the first online pilots have realistic professional collaborators; distinguish any scheduled sessions from ideas.
4. Revisit `robots`, sitemap, canonical URLs, social previews, and social image crops. Remove the staging `noindex` when ready.
5. Run `node tests/release-audit.cjs`, `node tests/confirmation-smoke.cjs` and `node tests/experience-smoke.cjs` (the latter needs Playwright and a local web server). GitHub Actions also checks Deno compilation. Resolve red checks before merging.

## Design principles
- Playful but credible; never present a possible event as scheduled.
- Get to a real professional interaction and meaningful takeaway, not just a game.
- Orthodox women should feel understood without repetitive audience badges or assumptions.
- Keep professional CTA easy to find and don't bury the applicant in an extensive form too early.
