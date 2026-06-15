# Professional Jewess

A private, curated **mentorship network** connecting frum Jewish professional women
with students, seminary/college women, and early-career women — in medicine, law,
tech, business, finance, and beyond.

It is deliberately **not a directory**. You don't browse and "pick" a mentor like a
dating app. You see who's in the network through name-hidden previews and an
inspiration feed, name a few women you'd love to learn from, and the team makes a
careful, human match. After the match it's **just you and her** — a private space
with her full profile, scheduling, and messages.

This repo is a working **front-end + Worker** scaffold built to deploy on
**Cloudflare Workers** as a fast, installable PWA. The UI is real and complete; the
backend is a thin, privacy-first API ready to grow into production (auth, email,
durable storage).

---

## Tech stack

- **React 18 + Vite** — mobile-first single-page app, one custom design system
  (no UI framework), installable PWA.
- **Cloudflare Workers** — one Worker serves the JSON API (`/api/*`) **and** the
  built static assets, with SPA deep-link fallback.
- **KV (optional)** — durable storage for applications / preferences / matches.
  Falls back to in-memory storage when not configured.
- **GitHub Actions** — build + deploy on push to `main`.

---

## The product model (and how to change it)

The brief explored two extremes — an open directory vs. fully blind matching. This
build ships the **middle path** that was approved:

- **Curated, name-hidden previews.** Members see a mentor's field, path, education,
  and what she can help with — but **not her name** unless she opted into public
  visibility, and never her workplace or contact info.
- **Preferences, not booking.** A mentee names **up to three** women she'd like to
  learn from and why. Nobody is "booked."
- **The team makes the match.** Admin weighs preferences against fit, stage,
  observance, and each mentor's capacity.
- **Then it's you and her.** Full profile, calendar, and a private thread unlock
  only after the match.
- **Inspiration feed**, not a people-directory: opt-in posts of milestones and
  lessons, with **Mazel tov / Chazak** reactions instead of likes. No photos, no
  follower counts, no public ratings.
- **Mentor visibility is private by default:** `public` · `members` · `private`.

**Want fully blind matching instead?** Hide the previews tab and keep onboarding +
"request a match." The API already accepts applications with **no preferences**
(`prefs` is optional), so no backend change is needed.

---

## Run it locally

Requires Node 18+.

```bash
npm install
```

**Front end only** (renders bundled sample data, no backend needed):

```bash
npm run dev          # http://localhost:5173
```

**Full stack** (SPA + Worker API together):

```bash
npm run worker:dev   # Worker on http://localhost:8787  (terminal 1)
npm run dev          # Vite proxies /api → 8787          (terminal 2)
```

Test the API directly:

```bash
curl http://localhost:8787/api/health
curl http://localhost:8787/api/mentors   # curated previews only — note: no names for members-only mentors, no contact info
```

---

## Deploy to Cloudflare Workers

1. Install Wrangler and log in (one time): `npx wrangler login`.
2. *(Optional, for durable storage)* create a KV namespace and paste its id into
   `wrangler.toml`:
   ```bash
   npx wrangler kv namespace create PJ_KV
   ```
3. Build and deploy:
   ```bash
   npm run deploy       # vite build && wrangler deploy
   ```

Wrangler uploads the built `dist/` as static assets and publishes the Worker. Your
app is live at `https://professional-jewess.<your-subdomain>.workers.dev` (or your
custom domain).

### Continuous deploy (GitHub Actions)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`. Add one
repo secret:

- `CLOUDFLARE_API_TOKEN` — a token with the **Edit Cloudflare Workers** template.

(Optionally add `CLOUDFLARE_ACCOUNT_ID` and uncomment the matching line if your
token spans multiple accounts.)

---

## Project structure

```
professional-jewess/
├─ index.html                 # PWA + iOS add-to-home-screen meta
├─ wrangler.toml              # Worker + static assets (SPA fallback) + optional KV
├─ vite.config.js             # /api proxy → wrangler dev for local full stack
├─ package.json               # dev / build / worker:dev / deploy scripts
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ manifest.webmanifest    # installable PWA
│  ├─ sw.js                   # offline app shell (network-first; never caches /api)
│  ├─ icon.svg, icon-192/512.png, icon-maskable-512.png, apple-touch-icon.png
│  └─ robots.txt              # allows marketing, disallows /api
├─ src/
│  ├─ main.jsx                # mounts App, registers the service worker
│  ├─ App.jsx                 # the full app: front door + feed + previews→match + dashboards
│  ├─ theme.css               # the "Heirloom Garnet" design system
│  ├─ data.js                 # sample content (drives the app offline; seeds the Worker)
│  ├─ api.js                  # client for the Worker API (with offline fallback)
│  └─ status.js               # student / mentor / admin match status vocabularies
└─ worker/
   ├─ index.js                # routes /api/* to handlers; serves the SPA otherwise
   └─ store.js                # PII-stripped previews, KV-or-memory storage, endpoints
```

## API (privacy-first)

All responses are JSON and `no-store`. Contact info is **never** returned to clients.

| Method | Path                  | Purpose                                                        |
|-------:|-----------------------|----------------------------------------------------------------|
| GET    | `/api/health`         | Liveness check                                                 |
| GET    | `/api/mentors`        | **Curated previews only** — name hidden unless public; private mentors excluded; no org/email/phone |
| GET    | `/api/feed`           | Inspiration posts (opt-in milestones / reflections)            |
| POST   | `/api/applications`   | Submit a student or mentor application → `submitted`           |
| POST   | `/api/preferences`    | Optional 1–3 preferred mentors + why → `match_in_progress`     |
| GET    | `/api/me/match`       | Current member's match status (stub until auth)                |
| POST   | `/api/admin/match`    | Admin confirms a match (gate with admin auth in production)    |

There is intentionally **no endpoint that returns the full mentor list with
identities** — that's the whole point.

---

## What's real vs. next

**Real now:** the entire mobile-first UI (public site, feed, previews→preferences
→match flow, the "you & her" hub with scheduling + messages, mentor and admin
views, visibility controls), the PWA, the Worker API with privacy-stripped
previews, and one-command Cloudflare deploy.

**Sample / stubbed:** the app renders bundled data from `src/data.js` so it runs
offline and as a standalone preview. Auth, sessions, real persistence, and email
are scaffolded but not implemented.

**Roadmap:**
- Authentication + sessions (e.g. Cloudflare Access, Lucia, or a magic-link flow).
- Persist applications/matches in KV (uncomment the binding) or D1.
- Transactional email for application + match notifications.
- Admin CMS for stories, events, resources, and the monthly theme.
- Optional muted-autoplay hero video (poster + lazy-loaded MP4/WebM) — the layout
  leaves room for it without disturbing the front door.

---

*A prototype. Replace the sample copy in `src/data.js` and the marketing sections
of `src/App.jsx` freely.*
