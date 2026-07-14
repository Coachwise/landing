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

- `content/_index.{fa,en}.md` — the home page (hero, sections, FAQ, footer)
- `content/blog/*.{fa,en}.md` — blog posts; the body is markdown, the summary
  lives in `description`
- `i18n/{fa,en}.toml` — the few UI strings that aren't page content (button
  labels, skip link, "read more")

Edit those to change the site. Keep each pair structurally identical; one layout
reads the same keys from both languages.

The nav and footer are defined **once**, on the home page, and every other page
borrows them via `.Site.Home.Params` — so a blog post doesn't need its own copy
of either.

## Blog

Posts live in `content/blog/`, one file per language, sharing a filename stem so
Hugo pairs them as translations (`beta.fa.md` ↔ `beta.en.md`). A post needs
`title`, `description` (used for the summary, `<meta description>` and the social
card), `date`, and `slug`. The blog has an RSS feed at `/blog/index.xml`.

The home page automatically features the newest post; there is nothing to wire up.

## SEO

Every page emits a canonical URL, `hreflang` alternates for both languages plus
`x-default`, an Open Graph/Twitter card, and JSON-LD:

- home → `SoftwareApplication` + `FAQPage` (generated from the `faq` front matter,
  so the questions on the page and the ones Google sees can never drift apart)
- post → `BlogPosting`

The structured data deliberately carries **no ratings, prices, or install counts** —
none of those exist yet, and fabricated markup is what gets a site penalised.

The social card is `static/img/og.png`, generated from the brand:

```bash
node scripts/gen-og.mjs     # re-run after any brand or headline change
```

It borrows the Playwright that `app/` already installs, so this project keeps no
`node_modules` of its own.

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

The page is the brand mark, opened out. The mark is a climber cresting a ridge
inside a rising ring: the ridge and ring take the surrounding ink (navy on light,
ice on dark), and the climber alone keeps the brand yellow — the one thing that
never blends into its background. The page follows the same split. Above the
ridgeline it's summit light and navy ink; below it the page inverts into the dark
mass of the mountain, which is where the actual work — logging, plans, coaching —
lives.

The gauge beside each section down there isn't decoration: it tracks how far up
the product you've come. Logging is the base, plans are the route, coaching and
money are the summit, so the line fills further on each section.

Type is Lalezar (a Persian display face from Iranian poster lettering; its Latin
covers the English page, so one voice serves both) over Vazirmatn for body text.
Both are self-hosted in `static/fonts/` — Google Fonts is not a dependency worth
handing users in Iran.

## Deploying

`hugo --gc --minify` emits a static `public/`. It has no backend and no build
step beyond Hugo, so any static host or an nginx root will serve it. Set the
real domain in `baseURL` before building for production.
