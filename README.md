# Professional Jewess — website

A plain **static multi-page website**. Every page is its own `.html` file, they all
share one stylesheet (`styles.css`), and there is **no build step** — no React, no
npm, no bundler. Edit a page, save, done.

## Pages
**Public:** `index.html` (home), `how-it-works.html`, `for-mentees.html`,
`for-mentors.html`, `apply.html` (multi-step form), `login.html`, `stories.html`,
`faq.html`, `contact.html`, `404.html`.
**App (after login):** `dashboard.html` (cohort feed), `match.html`, `schedule.html`
(shared mentor/mentee schedule), `messages.html` (in-app messenger), `cohort.html`,
`profile.html` (account security & notification preferences).

Shared: `styles.css` (the design system), `assets/main.js` (mobile menu),
`assets/` (icons), `manifest.webmanifest` (installable PWA).

## See it locally
Just **double-click `index.html`** — it opens in your browser. To click between pages
properly (some browsers are picky opening files directly), run a tiny local server:
```
cd this-folder
python3 -m http.server 8000      # then open http://localhost:8000
```

## Put it online (no build)
**GitHub Pages**
1. Create a repo and add **all these files** (the files themselves, not a zip) at the
   top level.
2. Repo **Settings → Pages → Source: `main` branch / root → Save.**
3. A minute later you get a live URL. `index.html` is the home page automatically.

**Cloudflare Pages / Netlify** — even easier: drag this whole folder into the
dashboard's "upload"/"deploy" area. No build command, no output folder needed.

## Editing
- **Text & links:** open any `.html` and edit the words between the tags.
- **Colors & fonts:** all in `styles.css` at the top (the `:root` variables — e.g.
  `--garnet`, `--paper`).
- **The menu** is the same block near the top of each page; change links there.
- **Forms** (`apply.html`, `contact.html`) currently show a confirmation only. To
  collect real submissions with no server, make a free Formspree form and set the
  form's `action` to your Formspree URL with `method="post"`.

## Scheduling, messaging & accounts (prototype)
`schedule.html` is a shared mentor/mentee schedule: either side can add times, the
other matches ("books") them, and the mentor can optionally open **group calls**
with a seat limit. Matched calls export to **Google Calendar** (one-click link) or
any other calendar app (**.ics** download). `messages.html` is a simple in-app
messenger, and `profile.html` adds two-step verification (email or SMS code) and
opt-in match notifications by email and text. Everything is mobile-first and
persists in `localStorage` (`assets/schedule.js`) — it's a working demo, not a
server. A "Reset demo data" link on the schedule page clears it.

**Going to production:** the notifications, real accounts/2FA, and multi-user
scheduling need a backend. Rather than building one, the intended path is to
plug in an existing open-source scheduler — [Cal.com](https://cal.com)
(self-hostable, the de-facto open-source Calendly; supports Google Calendar,
ICS, group/collective events, email/SMS workflows), its fully-MIT sibling
[Cal.diy](https://github.com/calcom/cal.diy), or the lighter PHP option
[Easy!Appointments](https://easyappointments.org). Each mentor gets a booking
page (embeddable in `schedule.html`); auth/2FA and messaging can come from a
hosted backend like Supabase or Firebase (both have free tiers).

A prototype — replace the sample copy freely.
