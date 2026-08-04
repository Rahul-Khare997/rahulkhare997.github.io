# Rahul Khare — résumé site (Next.js)

Source for <https://rahul-khare997.github.io>. Static Next.js export,
published to GitHub Pages by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
on every push to `main`.

The previous single-file version is preserved on the **`v1-single-file`**
branch.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Dev server on <http://localhost:3210>. `npm run build` emits a fully static
site to `out/`.

## Editing content

All copy, metrics, roles, projects and education live in
[`lib/content.ts`](lib/content.ts). Components read from it and never hardcode
facts, so updating the résumé means editing one file.

The downloadable PDF is `public/assets/Rahul_Khare_Resume.pdf`. Keep it in sync
with `lib/content.ts` — a site that contradicts the applied résumé is worse
than no site.

## Design decisions

| Area | Choice | Source |
|---|---|---|
| Layout | Left 34% sticky full-height, right 62% scrolls | brittanychiang.com |
| Palette | Navy + gold (dark), cream + bronze (light) | the original site |
| Experience | Tabbed functional tracks per role | the original site |
| Cursor | 600px radial spotlight, written to a CSS var via ref | brittanychiang.com |
| Section numerals | Oversized ghost digits behind headings | the original site |
| Chip rows | `mask-image` edge fade | chanhdai.com |
| Tokens | Semantic CSS vars, light + dark both first-class | chanhdai.com |
| Glass | `backdrop-blur` on the mobile sticky section label only | all of them |

Motion: Framer Motion for tab underlines and panel swaps, CSS for entrances.
One easing, ~0.24s for interaction, 0.6–0.7s for entrances.

## Failure modes this build defends against

Every one of these was found by testing, not by theory.

- **No JS.** Entrance styles are gated on a `.js` class the boot script adds,
  so nothing is stranded at `opacity: 0`. All copy is in the static HTML.
- **Animations paused or disabled.** `.hero-reveal` uses `animation-fill-mode:
  backwards` with no base `opacity: 0` — the resting state is visible, and the
  from-state applies only while the animation is pending or running. A frozen
  timeline (background tab) or blocked animations leave the page readable.
- **Frame loop throttled.** `Counter` renders the *real* figure first and only
  counts up from a confirmed live frame, with a timeout that lands the true
  value regardless. A résumé must never display `0%` where `10%` belongs.
- **Stalled exit animations.** Tab panels use a keyed remount rather than
  `AnimatePresence mode="wait"`, which serialises exit before enter and leaves
  the old panel mounted if the exit never completes. The terminal has no exit
  animation at all, so Escape always closes it. The preloader dismisses on a
  timer and restores `body` overflow in cleanup, so it can never trap the page.
- **Shared UI state.** Theme and recruiter mode live in one module-level store
  (`useSyncExternalStore`), not per-component `useState`, so the controls and
  the recruiter bar cannot drift out of sync.

Accessibility: `prefers-reduced-motion` disables all entrance motion, tablists
implement the ARIA keyboard contract (arrows, Home/End, roving tabindex),
there is a skip link, and focus rings are explicit.

## Company logos

`public/assets/logos/` ships Zenquip, TD and The Home Depot. To add another,
drop the file there and point `src` at it in `lib/content.ts`:

```ts
logo: { src: 'assets/logos/td.png', text: 'TD', color: '#00B140', bg: '#ffffff' },
```

Without `src` the component renders a brand-coloured monogram tile instead, so
a missing file degrades to something deliberate rather than a broken image
(ATA Freight still uses one).

Everything under `public/` is published, so keep source archives out of it —
zips, `.DS_Store` and extracted folders live in `.logo-sources/`, which is
gitignored. Prefer SVG where available: The Home Depot's mark is 11KB as SVG
versus 106KB as an 800×800 PNG, and stays crisp at any size.

The tile constrains with `max-h-full max-w-full object-contain`, not
`h-full w-full`. A logo with a non-square aspect ratio (TD is 90×96) overflows
a square tile when both dimensions are forced, because the intrinsic ratio
beats a percentage height.

## AI chat

The widget talks only to the Cloudflare Worker in [`worker/`](worker/), which
holds the Gemini key as an encrypted secret. See
[`worker/README.md`](worker/README.md) for deployment and for where the key
goes. Set `NEXT_PUBLIC_AI_PROXY_URL` to the Worker URL to switch the widget on;
with it unset the widget does not render.

Verified: with the proxy configured, the built site contains no Google API key
string, no `GEMINI_API_KEY`, and no direct `generativelanguage.googleapis.com`
URL.

## Contact form

A static export has no server, so the page cannot send mail on its own. Set
`NEXT_PUBLIC_FORM_ENDPOINT` at build time to any endpoint that accepts a POST
(Formspree, Web3Forms, Getform) and the inline form appears and submits to it.
With the variable unset the form is not rendered at all — the Google Form and
the mailto link remain the routes, so nothing can silently swallow a message.

## Deploying to GitHub Pages

`next.config.mjs` already sets `output: 'export'`, `images.unoptimized`, and
`trailingSlash`. No `basePath` is needed — `rahul-khare997.github.io` is a user
site served from the domain root.

Already configured. Pages **Source** is set to **GitHub Actions**, and pushing
to `main` builds and publishes `out/`.

To roll back to the old single-file site: point Pages **Source** back at
**Deploy from a branch → `v1-single-file` → `/`**.

The workflow runs `touch out/.nojekyll` — without it Jekyll strips the `_next/`
directory and every asset 404s.

## Carried over from the old site

Photo, navy/gold palette (both themes), launch screen, ticker, ghost section
numerals, grid wash, tabbed experience tracks, skills panels, Recruiter Mode,
backtick terminal, theme toggle, copy-email, back-to-top, scroll progress,
languages, awards, relocation and target-role chips, Google Form link.

Deliberately dropped: particle canvas, scramble-text headings, magnetic
cursor. The typewriter is now a rotating discipline line.

**The API key used by the old site remains valid and remains in this repo's
git history.** Deleting it in Google Cloud Console is the only thing that
retires it; removing it from the current tree does not.

The AI chat is ported, but rebuilt: the old widget shipped a live API key in
client source. It now calls the Cloudflare Worker in [`worker/`](worker/),
which holds the key as an encrypted secret.
