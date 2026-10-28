# The Jewish Mutual — Development release checklist

This repository is an **early-stage, publicly accessible development website**, not a confirmed program calendar.

## Status and visitor expectations
- Career conversations and practical experience cards describe ideas being developed, not scheduled places, confirmed mentors, internships or commitments.
- Site pages currently include `<meta name="robots" content="noindex,follow">` to discourage premature search indexing. This does not prevent someone from opening the GitHub Pages URL. Remove `noindex` on the pages intended to be public **only when launch readiness is approved**.
- The homepage remains a short invitation. The Experiences page is the source of truth for detailed ideas and the multiple-interest form. The old Join URL routes to the two active paths.

## Registration intake / operational steps
- Submissions use Supabase tables `pj_interest_shortlists`, `pj_applications` and `pj_inquiries`. Frontend requests contain only a publishable key, never a service key. Anon `SELECT`, `UPDATE`, `DELETE` must remain disabled; keep RLS and column grants verified.
- **No transactional email service is currently configured in the static site.** Saving a record and showing an on-screen acknowledgment is not the same as sending a confirmation email. Do not tell visitors an automated email was sent.
- Before public promotion, choose a verified sender domain and transactional email provider (e.g. Resend, Postmark, or similar), configure a server-side integration/Edge Function with its secret in server-side secrets, and add an email-delivery trigger on successful submissions. Never put SMTP/API credentials in this GitHub Pages repository.
- Establish a staff owner for each incoming inquiry category (participant, professional, workplace, contact). Review Supabase submissions through authenticated admin access until automated alerts are verified. Do not expose applicant data in a public dashboard or client-side `SELECT`.
- Add spam/rate limiting at the server or edge before large-scale promotion. A hidden honeypot and disabled submit button deter basic accidents but do not stop automated spam.
- Verify one legitimate consented submission through each of the three forms, verify exact stored data, follow-up email, and staff notification, then delete authorized test records. The existing Playwright tests intercept writes and do **not** test actual deliverability.
- Decide on data retention and deletion service-level targets; update Privacy accordingly once actual processes are established.

## Metrics — only after privacy review
Track aggregated: homepage to Experiences click, catalog filter interaction, selections created, drawer opened, successful participant request, professional inquiry. Use a privacy-conscious service and update the privacy notice if new tracking is added. Avoid shipping unverified analytics scripts or transmitting sensitive form fields in analytics events.

## Before announcing a public launch
1. Resolve provider credentials and staff notifications; establish reliable follow-up.
2. Validate all critical routes, keyboard navigation, Safari on a real iPhone, and form submissions with authorized test data.
3. Confirm that the first online pilots have realistic professional collaborators; distinguish any scheduled sessions from ideas.
4. Revisit `robots`, sitemap, canonical URLs, social previews, and social image crops. Remove the staging `noindex` when ready.
5. Run `node tests/release-audit.cjs` and `node tests/experience-smoke.cjs` (the latter needs Playwright and a local web server). Resolve red GitHub Actions checks before merging.

## Design principles
- Playful but credible; never present a possible event as scheduled.
- Get to a real professional interaction and meaningful takeaway, not just a game.
- Orthodox women should feel understood without repetitive audience badges or assumptions.
- Keep professional CTA easy to find and don't bury the applicant in an extensive form too early.
