# Zamani Grill & Market — site update agent rules

This repo is a static multi-page site (`*.html`, `tx/spring/*/index.html`, `css/`, `js/`, `content/*.json`, `img/`)
deployed to Netlify from `main`. Change requests arrive as GitHub issues labeled `site-update`, filed from the
/updates portal and approved by the webmaster (Faisel) before you are invoked.

## Workflow (always)

1. Work on a branch named `claude/<short-description>`. **NEVER commit or push to `main`.**
2. Open a pull request that includes `Closes #<issue number>` and a plain-English summary of exactly what changed,
   written for a non-technical reviewer.
3. Netlify builds a preview for every PR. A human approves and merges — you never do.
4. If a request is ambiguous, contradictory, or out of scope, do **not** guess. Comment on the issue asking one
   specific clarifying question, and stop.

## Reading a request

| Type | Means |
| --- | --- |
| `CHANGE` | Replace the "Change this" text with the "To this" text, wherever it appears |
| `ADD` | Insert the new content at the described location, matching surrounding markup |
| `REMOVE` | Delete that content, and any now-empty container or dangling separator |
| `IMAGE` | Swap the referenced image for the attached one, keeping dimensions and `alt` accurate |
| `POST` | Add an announcement in the site's existing pattern, and link it from the footer nav |
| `OTHER` | Read carefully; ask if it isn't unambiguous |

The issue body also carries the raw request in an `operations-json` HTML comment.

## Content lives in JSON — then run the build

- **Menu** (items, prices, sizes, choices, photos): `content/menu.json`
- **Market** (products, units, prices): `content/market.json` — flip `pricesVerified` to `true` only when the owner
  has confirmed every price; until then prices render with a `~` estimate mark.
- **Locations** (address, phone, hours, review counts): `content/locations.json`
- **Translations**: `content/i18n/{ar,fa,hi,ur}.json`. English lives in the HTML itself; `en.json` is a generated
  key list. When you change English copy that carries a `data-i18n` key, update the four translations too, or
  remove the key from them so English shows instead of a stale translation.

After editing any JSON, run **`node scripts/build.mjs`** and commit the regenerated HTML. The build writes the
static menu, market, location cards, JSON-LD and sitemap between `<!-- @name --> … <!-- /@name -->` markers.
Never hand-edit inside those markers; edit the JSON. Netlify also runs the build on deploy.

Dish photos: add the source to `img/source/own/`, run the conversion in `scripts/` notes (900px + 480px `-sm`
WebP into `img/menu/`), and reference `img/menu/<name>.webp` in menu.json. Client-uploaded images land in
`img/uploads/`.

## What you may edit

- `content/*.json` and the generated HTML that follows from the build
- Copy inside the pages: headlines, ledes, descriptions, hours text, notices
- New pages that reuse the `@head`, `@header`, `@footer`, `@ticket` markers and the existing tokens

## What you must NEVER change without an explicit, unambiguous instruction

- Phone numbers, addresses, hours (they must match the Google Business Profile byte for byte)
- Prices. Copy them exactly as given. If a price looks wrong (`$0`, missing), ask on the issue.
- `netlify/functions/*`, `netlify.toml`, `.github/`, `updates.html`, `scripts/`, `js/site.js`, this file.
  If an issue asks for those, comment that it needs Faisel directly.
- The design system: fonts (Fustat, Red Hat Mono), color tokens, layout structure, the direction contract comment.
- Anything about payments. The checkout hands off to the owner's Priority / MX Merchant payment link via env vars
  (`MX_PAYMENT_LINK_URL`); the site never touches card data and must stay that way.

## Style rules

- Voice: warm, direct, family-run, plain English at an 8th-grade level. No exclamation marks, no "authentic",
  no "mouth-watering".
- Headings and UI in Fustat; prices, hours and labels in Red Hat Mono; body in system sans.
- Keep `data-i18n` attributes on anything you edit so the translations still apply.
- Preserve `rv` reveal classes and `data-item` attributes on dish rows.

## Verify before opening the PR

- `node scripts/build.mjs` runs clean and the diff contains only intended changes.
- Every image path exists. Every link resolves (clean URLs are mapped in `netlify.toml`).
- Prices in the diff match the issue text exactly.
- Looks right at 360px wide, in English and in Arabic (RTL).
