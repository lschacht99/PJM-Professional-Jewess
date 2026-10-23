# The Jewish Mutual — Experience catalog and registration rollout

## Status
This change is developed on a feature branch and has **not been merged or published**. No email messages are sent automatically.

## Site changes
- Homepage: five first-wave opportunities and invitations to volunteer.
- Experiences: 24 career ideas with field filtering, first-wave opportunities, and the participant-facing **Career visits** request pathway.
- Get involved: separate entry points for student/community volunteers, professionals sharing expertise, and workplace hosts.
- Shared mobile-first drawer: bottom sheet on phones, right-side panel on desktop; native dialog focus behavior, close button, Escape, and background overlay.
- Existing `join.html` remains as a fallback for visitors without JavaScript.
- Labels no longer mix participant career access with professionals offering assistance.

## Public messaging and timing
- Interest forms do not confirm attendance, a date, a facilitator, a venue, or an employer relationship.
- Dates are shared when a viable group and logistics have been arranged; expressing interest creates no obligation to attend.
- Women-centered is used for initial offerings; no women-only eligibility exclusion was implemented.
- Role categories in a challenge are interests, not promises of a particular facilitator.
- Programs can be prioritized based on demand without promising they will run quickly.

## Intake: existing Supabase instance
Tables are RLS protected with anonymous insert-only column grants and no anonymous SELECT privilege.

| Request | Table | Source | Notes |
| --- | --- | --- | --- |
| Specific experience | `pj_applications` | `jewish-mutual-interest-2026` | `help_needed` contains experience ID/title and availability; `field` holds participant perspective |
| General career fields (home selector) | `pj_applications` | `jewish-mutual-interest-2026` | `help_needed` contains selections |
| Workplace visits | `pj_applications` | `jewish-mutual-workplace-2026` | `help_needed` contains requested fields |
| Volunteer | `pj_inquiries` | `jewish-mutual-volunteer-2026` | `message` contains contribution choices, location, availability |
| Professional or employer | `pj_inquiries` | `jewish-mutual-expert-2026` | `message` contains contribution choices |
| Participant who also wants to help | `pj_applications` | `jewish-mutual-interest-2026` | `help_offered` flags volunteer interest |

The public key is a Supabase **publishable** key already in the existing site. It is not a service-role credential. Do not put secrets in frontend code.

## Pre-publish checklist
1. Review content, suitability, audience and locations of first-wave experiences.
2. Verify the site displays and scrolls correctly at 320px, 375px, 430px, tablet and desktop widths.
3. Check dialog opening and closing via touch, keyboard Escape, backdrop, focus return, and screen readers.
4. Test submissions with approved test data in staging or under explicit permission; do not silently add test signups to production.
5. Check legitimate submissions, duplicate requests, failures, timeouts, spam, and public insert quotas before sending traffic.
6. If traffic grows, move to a rate-limited server-side submission endpoint and dedicated structured experience/volunteer tables.
7. Ensure the destination URL and custom domain (if used) serve the new branch after merge, clear caches and verify canonical URLs.
8. Do not send newsletter or company outreach emails without explicit approval.

## Editorial follow-ups
- Design actual facilitator packets for the flagship challenge, College Decoded and Inside Tech.
- Decide whether any women-only enrollment rules are appropriate after legal and operational review.
- Decide which experiences should receive exact duration, location and age/skill prerequisites once organized.
- Add secure organizer-only analytics after the first live submissions.
