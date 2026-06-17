# Professional Jewess — website

A plain **static multi-page website**. Every page is its own `.html` file, they all
share one stylesheet (`styles.css`), and there is **no build step** — no React, no
npm, no bundler. Edit a page, save, done.

## Pages
**Public:** `index.html` (home), `how-it-works.html`, `for-mentees.html`,
`for-mentors.html`, `apply.html` (multi-step form), `login.html`, `stories.html`,
`faq.html`, `contact.html`, `404.html`.
**App (after login):** `dashboard.html` (cohort feed), `match.html`, `cohort.html`,
`profile.html`.

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

A prototype — replace the sample copy freely.
