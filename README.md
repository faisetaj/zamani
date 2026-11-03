# Zamani Grill & Market — zamanigrill.com

Static multi-page site with first-party pickup ordering, a small market shop, catering requests, and five
languages (English, Arabic, Farsi, Hindi, Urdu). Built with Faisel's `client-site` pipeline: the owner never
logs in; changes come through `/updates` and land as GitHub issues.

## Run it locally

```bash
node scripts/build.mjs      # render content/*.json into the pages + sitemap (also runs on Netlify deploy)
node scripts/dev.mjs 8787   # http://localhost:8787 with clean URLs, redirects and the two functions
node scripts/shot.mjs out.png http://localhost:8787/ --w 390 --h 844 --mobile --scale 2   # real-phone screenshot
```

No npm install. Node 18+ (uses global `fetch`; `shot.mjs` needs Node 22 for the built-in WebSocket).

## Where things live

| Path | What |
| --- | --- |
| `content/menu.json` | Every dish, price, size, choice, photo. **Prices captured from the old site on 2026-11-03; owner must confirm.** |
| `content/market.json` | Market products. `pricesVerified: false` renders every price with a `~` estimate mark. |
| `content/locations.json` | Addresses, phones, hours, review counts. Riley Fuzzel hours/phone are from a directory listing (flagged). |
| `content/i18n/*.json` | Translations. `en.json` is generated from the HTML; edit the other four by hand. |
| `scripts/build.mjs` | Fills `<!-- @block -->` markers in every page, writes JSON-LD and `sitemap.xml`. |
| `netlify/functions/order.js` | Order intake: reprices from the catalog, emails the kitchen, redirects to the payment link. |
| `netlify/functions/mx-webhook.js` | Receives MX Merchant PaymentSuccess notices and relays a PAID email. |
| `img/menu/` | 41 dish photos (900px + 480px WebP) cropped from the restaurant's own 2015 studio shots in `img/source/own/`. |
| `img/market/` | Unsplash stand-ins until the market is photographed (see `img/market/PROVENANCE.md`). |
| `updates.html`, `.github/workflows/` | The change-request portal and agent workflows (verbatim from client-site). |
| `CLAUDE.md` | Guardrails for the update agent. |

## Go-live checklist

1. **GitHub**: create `faisetaj/zamani-grill`, push `main`. Add the repo secrets listed in the client-site `ops-hub.md`.
2. **Netlify**: import the repo. Build command `node scripts/build.mjs`, publish `.`, functions `netlify/functions` (all in `netlify.toml`).
   Enable **Forms** (the `orders` and `catering` forms register on first deploy) and turn on email notifications for both.
3. **Env vars** (Site settings → Environment):
   - `MX_PAYMENT_LINK_URL` — the Link2Pay URL from the owner's MX Merchant portal → Settings → Payment Links. Set
     `onSuccessUrl` to `https://zamanigrill.com/order/thanks/?pay=online` and `onFailureUrl` to `https://zamanigrill.com/order/failed/`.
     Until this is set, checkout offers pay-at-pickup only and `checkout.html` keeps `data-payments-enabled="false"`.
     When it is set, flip that attribute to `true` so the "Pay now online" option enables.
   - `MX_WEBHOOK_KEY` — any long random string; then subscribe MX notifications (see the comment in `mx-webhook.js`).
   - `RESEND_API_KEY`, `ORDER_EMAIL_FROM` (verified sender), `ORDER_EMAIL_TO` (kitchen inbox, comma-separated).
   - `SITE_URL=https://zamanigrill.com`, optionally `TAX_RATE` (defaults to 8.25%).
4. **Priority / MX Merchant**: the owner (or his nephew, with Dad present) creates the Payment Link in the MX portal and,
   if we want sandbox testing first, requests sandbox credentials from integratedSolutions@prth.com. Developer docs:
   https://developer.mxmerchant.com/docs/custom-payment-pages
5. **Domains**: point `zamanigrill.com` (GoDaddy) at Netlify; add `zamani2market.com` (Hostinger) as a domain alias so
   the 301s in `netlify.toml` send it to `/tx/spring/riley-fuzzel/`.
6. **Confirm with the owner before launch**: every menu price, the market product list and prices
   (`pricesVerified: true`), Riley Fuzzel hours and phone, whether Riley Fuzzel sells any hot food, catering lead time.
7. **Google Business Profile**: make the site's NAP match both listings byte for byte, add the website and
   `https://zamanigrill.com/menu` as the menu link, and the Order link once payments are live.
8. **Translations**: have a native reader check `content/i18n/ar|fa|hi|ur.json` (authored by Claude on 2026-11-03).
9. Register the client in the ops panel (`clients.json`) per `ops-hub.md`.

## Photos

The old WordPress site held 53 professional dish photos the restaurant owns; those power the menu. Anything in
`img/source/third-party/` (DoorDash header, Zabihah customer photos, Yahoo listing) is **not** cleared for use and is
gitignored. Still wanted from the owner: both storefronts, the butcher counter, market aisles, the grill, the register.
