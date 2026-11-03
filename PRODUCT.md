# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, one `<style>` and one `<script>` per page, JSON content files, Netlify hosting with Netlify Functions for ordering and payment handoff. Chosen by Faisel (owner/builder) on 2026-11-03: "New repo + Netlify preview", scaffolded under his `client-site` Track A pipeline (portal, not CMS). Payments route through the owner's existing Priority Commerce merchant account via MX Merchant Payment Links (hosted page) so card data never touches this site.

## Users

- **Primary:** Spring / North Houston diners deciding where to eat or ordering pickup from a phone, often in a car or at work. Many are repeat customers who already know the shawarma and family dinners; a growing share find the restaurant through Google Maps searches like "halal near me", "Lebanese food Spring TX", "shawarma Louetta".
- **Secondary:** Halal grocery shoppers near Riley Fuzzel Rd (Spring 77386) looking for meat, spices, and pantry staples, and checking whether the market is open before driving.
- **Tertiary:** Families and offices booking catering or family dinners for 4 to 6+ people; the congregation of the mosque directly across from the Louetta location (confirmed by Faisel 2026-11-03), many of whom read Arabic, Farsi, Hindi, or Urdu more comfortably than English.

## Product Purpose

One combined website for Zamani Grill & Market that replaces two disconnected WordPress sites (zamanigrill.com, last touched 2015-2025; zamani2market.com, still an "under construction" page). It must (1) make both locations findable and unambiguous on Google, (2) take first-party pickup orders so the restaurant stops paying 15-30% to delivery apps on orders it could own, (3) sell a small set of market staples online, and (4) capture catering requests. Success is measured in first-party orders per week, Google Business Profile actions (calls, directions), and catering leads.

## Positioning

The only place in Spring that is both a Lebanese grill and a halal market under one family, two locations, since 2008 on Louetta. Neighbors can eat the mixed grill and buy the same halal meat and spices to cook at home. Competitors are either a restaurant (Zara's Mediterranean, Nadia's, Lebanese Cuisine Aileen) or a grocery (Al Eman Halal Meat, K&K Grocery), never both.

## Operating Context

- **Louetta (original, restaurant + market):** 9440 Louetta Rd #3, Spring, TX 77379. (281) 251-9111. Hours per current site: Sun–Thu 10:45 am–9:00 pm, Fri–Sat 10:45 am–10:00 pm. Catering available. Google ~4.5★ / ~710 reviews, Yelp 4.1 / 204, DoorDash 4.8 / 1000+.
- **Riley Fuzzel (new, grocery only):** 1827 Riley Fuzzel Rd Ste B, Spring, TX 77386. Phone UNCONFIRMED: directories list (832) 791-5486 and (346) 225-1042. Hours UNCONFIRMED. Whether it sells any hot food UNCONFIRMED. Google ~4.8★ / ~39-58 reviews.
- **Closed:** FM 1488 / The Woodlands location (opened 2016, permanently closed). Site must not list it.
- **Payments:** Priority Commerce merchant services. POS hardware unconfirmed (Clover, MX POS, or bare terminal; register photo pending). Online payments go through an MX Merchant Payment Link (Link2Pay) created in the owner's MX Merchant portal; sandbox credentials not yet obtained.
- **Delivery today:** DoorDash, Uber Eats, Postmates only. Owner wants 5-10 mile in-house delivery from Louetta later; v1 is pickup only with delivery-app links.
- **Owner:** Arabic-speaking, not tech-savvy; a nephew handles technical questions. Faisel maintains the site through the change-request portal; the owner never logs into anything.
- **Naming:** platforms disagree ("Zamani Grill", "Zamani Mediterranean Grill", "Zamani international market and grill", "Zamani 2"). Site standardizes on **Zamani Grill & Market** with location names "Louetta" and "Riley Fuzzel".

## Capabilities and Constraints

- Pages: Home, Menu (orderable), Market (small shop + what we carry), Catering (request form + family dinners), Locations (one page per location, state/city nested URLs: `/tx/spring/louetta/`, `/tx/spring/riley-fuzzel/`), Order flow (cart drawer, checkout, confirmation), Updates portal (Faisel's pipeline).
- Cart: client-side, persisted to localStorage; checkout posts to a Netlify Function that records the order and redirects to the Payment Link with `Amt`, `Memo` (order number), `ClientData` (item summary). Fallback tender: "Pay at pickup" when the Payment Link is not yet configured. Order notifications to the kitchen by email (SMS later).
- Restaurant menu: 60+ items with real prices captured 2026-11-03 from zamanigrill.com (last edited by owner Sept 2025). Prices are REAL but must be re-confirmed with the owner before go-live. Tax rate UNCONFIRMED (Harris County Spring TX, assume 8.25% and label).
- Market shop: 12-20 items (halal meat by the pound, spices, pantry). Products and prices are PLACEHOLDERS to be corrected by the owner; every placeholder price must be visibly labeled as such until confirmed.
- Pickup times: ASAP (quote 20-25 min) or scheduled within open hours. Kitchen capacity rules UNCONFIRMED.
- Catering: request form (date, headcount, menu interest) to email; no instant pricing beyond published family dinners and skewers-by-the-dozen.
- 301 plan: zamani2market.com redirects to the Riley Fuzzel location page; old zamanigrill.com paths (`/menus/menu`, `/hours`, `/reviews`, `/contact-us`, `/spring`) map to new URLs.
- Performance budget: single HTML per page, no framework, fonts ≤ 2 families and 2 weights each, Lighthouse ≥ 95 mobile. Local SEO: Restaurant + GroceryStore JSON-LD per location, Menu schema, NAP identical to Google Business Profile.
- Multilingual (required by Faisel 2026-11-03): English default plus Arabic, Farsi, Hindi, and Urdu UI translation via a language switcher. Arabic, Farsi, and Urdu render right-to-left; Hindi left-to-right. Menu item names stay in English with translated descriptions/categories; prices and phone numbers stay in Western digits. Translations authored in-house and flagged for native review before launch.

## Brand Commitments

- Name: Zamani Grill & Market. Existing logo: `https://www.zamanigrill.com/wp-content/uploads/2016/11/zamani.png` (raster) and `https://zamani2market.com/wp-content/uploads/2025/03/logo-1024x109.png` (wide raster); no vector on hand. A fresh wordmark is acceptable for v1, marked for owner approval.
- Voice: warm, direct, family-run, no hype. Existing homepage line: "Come and enjoy a little place of Lebanon in the heart of Texas."
- Binding visual constraint from Faisel (2026-11-03): **light editorial** direction, in the spirit of his Authyr marketing site (paper ground, deep ink type, one accent, generous whitespace, photos in clean frames), elegant, sleek, modern. Not dark-first.

## Evidence on Hand

- Full restaurant menu with prices (scraped 2026-11-03, in `content/menu.json` once built).
- Real ratings and review counts above (Google, Yelp, DoorDash, Tripadvisor 4.5/26) — citable as "4.5 stars across 700+ Google reviews" once re-checked at launch.
- No owner photography yet. Any food photography in v1 is stock, labeled for replacement; the owner owes photos of the grill, the market aisles, both storefronts, and the register.
- No testimonials, awards, or press on hand. Do not fabricate any.
- Deliverables from prior sessions: owner decks (EN https://claude.ai/artifact/M7fTnUv8vzhURi8xXTLc98, AR https://claude.ai/artifact/D7C7Djrpy4i7XYUWpvtXmo) and Faisel's launch tracker https://claude.ai/artifact/PJMKRyVBoF42YvFDSWF1Gs.

## Product Principles

1. **Order in three taps.** A hungry person on a phone must reach "add to cart" without reading a paragraph. The menu is the homepage's working core, not a PDF link.
2. **Two places, one family, never confused.** Every page states which location it is talking about; the grocery-only store never appears to serve hot food until the owner confirms it.
3. **Own the order.** First-party pickup is the primary action everywhere; delivery apps are secondary links, never the hero button.
4. **Never invent a business fact.** Unconfirmed prices, hours, and phone numbers ship as visibly marked placeholders or not at all.
5. **The owner never administers it.** Content lives in JSON; changes flow through Faisel's portal.

## Accessibility & Inclusion

Mobile-first at 360px, WCAG AA contrast, keyboard-operable cart and checkout, `prefers-reduced-motion` honored. Plain-language English at roughly an 8th-grade level. Four translated interfaces (ar, fa, hi, ur) with correct `lang`/`dir`, scripts set in faces that support them (Arabic/Persian/Urdu and Devanagari), and layouts that mirror cleanly in RTL.
