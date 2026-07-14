# Coachwise landing page

The public marketing site: what Coachwise is, and where to get the app. Hugo,
no theme dependency — the layouts and CSS here are the whole site.

Persian is the default language and is served at `/`; English is at `/en/`.
The page is RTL-first: the stylesheet uses CSS logical properties throughout, so
both directions come out of one sheet.

## Run it

```bash
hugo server        # http://localhost:1313  (fa), /en/ (en)
hugo --gc --minify # build to public/
```

## Where the content lives

All copy is front matter — one file per language, nothing hard-coded in the
layouts:

- `content/_index.fa.md` — Persian
- `content/_index.en.md` — English
- `i18n/{fa,en}.toml` — the few UI strings that aren't page content (button
  labels, skip link)

Edit those to change the page. Keep the two `_index` files structurally
identical; the layout reads the same keys from both.

## App download buttons

The store listings don't exist yet, so `playStoreURL` / `appStoreURL` in
`hugo.toml` are empty and the buttons render as disabled "coming soon" chips.
Fill one in and that button becomes a real link — no other change needed.
`apkURL` optionally offers the APK (the `app/` CI already builds one) as a
direct download before the listings go live.

The buttons are custom art on purpose. Google's and Apple's official store
badges are trademarked and licensed only for real listings — swap them in when
the listings are live, not before.

## Design

The page is the brand mark in section. The mark is an iceberg built on one rule:
a single colour, the summit at full strength and the submerged mass dimmed to
42%. The page follows that rule literally — above the waterline it's cold ice
light and navy ink; below it, the page inverts into deep water, where the
features live and every yellow is held at 0.42.

The depth gauge beside each section down there isn't decoration: it tracks how
deep into the product you are — logging at the surface, plans midwater, coaching
and money at depth.

Type is Lalezar (a Persian display face from Iranian poster lettering; its Latin
covers the English page, so one voice serves both) over Vazirmatn for body text.
Both are self-hosted in `static/fonts/` — Google Fonts is not a dependency worth
handing users in Iran.

## Deploying

`hugo --gc --minify` emits a static `public/`. It has no backend and no build
step beyond Hugo, so any static host or an nginx root will serve it. Set the
real domain in `baseURL` before building for production.
