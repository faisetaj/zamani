---
name: Zamani Grill & Market
description: The Levant menu card, bright card stock, cedar ink, brass for the market, prices set in tabular mono.
colors:
  paper: "#FBF8F2"
  paper-2: "#F3EEE4"
  paper-3: "#EAE3D6"
  ink: "#14201C"
  muted: "#5B6661"
  ink-on-brand: "#F4F8F5"
  brand: "#1E6B4F"
  brand-deep: "#14523B"
  brand-lt: "#2F8A68"
  accent: "#B98A2E"
  accent-deep: "#8F6A1F"
  line: "rgba(20,32,28,.16)"
  line-strong: "rgba(20,32,28,.34)"
  closed-clay: "#8A3B2E"
typography:
  display:
    fontFamily: "Fustat, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.2rem, 4.2vw, 3.7rem)"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fustat, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.9rem)"
    fontWeight: 620
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  course:
    fontFamily: "Fustat, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)"
    fontWeight: 620
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Fustat, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    lineHeight: 1.05
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  price:
    fontFamily: "Red Hat Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "1.05rem"
    fontWeight: 500
    letterSpacing: "-0.01em"
    fontFeature: "tabular-nums"
  label:
    fontFamily: "Red Hat Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  stamp: "2px"
  sm: "4px"
  md: "6px"
  lg: "10px"
  pill: "999px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  rd: "16px"
  lg: "24px"
  rail: "64px"
  card-pad: "clamp(20px, 4vw, 56px)"
  course: "clamp(28px, 4vw, 52px)"
  section: "clamp(40px, 6vw, 88px)"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink-on-brand}"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.brand-deep}"
    textColor: "{colors.ink-on-brand}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
  button-brass:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
  button-brass-hover:
    backgroundColor: "{colors.accent-deep}"
    textColor: "{colors.paper}"
  add-stamp:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
    size: "44px"
  add-stamp-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  add-stamp-pressed:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.paper}"
  cart-ticket-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "9px 14px"
  cart-ticket-button-hover:
    backgroundColor: "{colors.brand-deep}"
    textColor: "{colors.paper}"
  lang-stamp:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
    typography: "{typography.label}"
  choice-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 14px"
    height: "40px"
  choice-chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  quantity-pill:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "40px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "13px 14px"
    height: "48px"
  step-band:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 12px 10px"
    height: "64px"
  step-band-selected:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink-on-brand}"
  radio-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  radio-card-selected:
    backgroundColor: "rgba(30,107,79,.08)"
    textColor: "{colors.ink}"
  course-nav-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  course-nav-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  frame:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.muted}"
    rounded: "{rounded.lg}"
    padding: "10px"
  brass-stamp:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.stamp}"
    padding: "7px 10px"
    typography: "{typography.label}"
  notice:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  notice-brass:
    backgroundColor: "rgba(185,138,46,.1)"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  place-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "22px 22px 24px"
  band-cedar:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink-on-brand}"
    padding: "clamp(40px, 6vw, 88px) clamp(20px, 4vw, 56px)"
  band-brass:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    padding: "clamp(40px, 6vw, 88px) clamp(20px, 4vw, 56px)"
  orderbar:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink-on-brand}"
    padding: "12px 16px"
  ticket-drawer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: "min(420px, 100%)"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  unverified-tag:
    backgroundColor: "transparent"
    textColor: "{colors.accent-deep}"
    rounded: "{rounded.stamp}"
    padding: "6px 8px"
    typography: "{typography.label}"
  review-slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "18px 18px 16px"
    width: "min(320px, 78vw)"
---

# Design System: Zamani Grill & Market

<!-- Recorded 2026-11-03 from the shipped build (css/site.css, scripts/build.mjs, the eight pages, js/site.js) and the finish-review screenshots in .impeccable/review/. Ground truth is the built code; where the direction contract (seed 0db87a8c) and the build differ, the build is recorded and the divergence is noted. -->

## Overview

**Creative North Star: "The Levant Menu Card"**

The whole site is one printed menu card lying on a counter. Every page is the same bright sheet of coated card stock (`paper`) set on a slightly darker counter (`paper-3`), with one soft shadow underneath and a 1px ruler rail down its left edge that keeps every course heading, price column, and section break on one vertical axis. The lineage is the 1960s–70s Beirut hotel and Middle East Airlines dining menu: bilingual, one spot color, prices set in tabular figures, photography as a garnish in its own frame and never as the ground. The menu is the page; the first course and its prices are already on the card when the first viewport lands, with a live round "add" stamp beside each dish.

Color is committed at region scale. One cedar green (`brand`) owns whole fields: the catering band, the order rail pinned to the bottom of a phone, a selected pickup-time step, the selected language. It is never dusted across the page as tints. Brass (`accent`) is the counterweight and belongs to the market surfaces (the market page band, the Riley Fuzzel location band, the home market band) and to marks of provisionality: the rotated "from our kitchen" stamp on the hero frame, the dashed "hours unverified" tag, the `~` on an estimated price. Everything else is ink on paper separated by hairlines: solid between sections, dashed between dishes, dotted between hours.

The build is density-tolerant by design. A dish row is 16px of vertical padding over a dashed hairline, a course is a sticky heading plus rows, and a section is one hairline away from the next. Nothing is a floating card except the sheet itself; depth belongs to the things that lift off the card (the ticket drawer, the language menu, a toast, a place card on hover) and to the review slips, which are small paper slips laid on the card at a slight tilt. The system refuses the category standard it was rolled against: no full-bleed food hero, no "Order Online" button floating over a photo, no feature-card triptych, no text over photography.

**Key Characteristics:**
- One sheet, one shadow, one ruler rail; everything inside the sheet is flat and ruled by hairlines.
- Cedar green at region scale; brass for the market and for anything provisional; ink does the rest.
- Three voices: Fustat for names and headings, the system sans for sentences, Red Hat Mono for every number and label.
- Every control is a distinct shape (round add, pill quantity and chips, 4px-square buttons, 3px-square remove) and changes state by fill, never by tint alone.
- Photos live in a padded frame on a `paper-2` mat with a caption below; text never sits on a photo.
- Five scripts, one card: Arabic, Farsi, and Urdu mirror the whole sheet right-to-left with their own faces; Hindi stays left-to-right in Devanagari; prices, codes, and phone numbers stay LTR Western digits inside isolated spans.

## Colors

Warm bright card stock, a green-black ink, one cedar green that behaves like a spot ink, and a brass counterweight; no grays, no blues, no gradients.

### Primary
- **Cedar** (`brand`): the spot ink. Owns whole regions (`.band`, `.orderbar`, the selected `.steps` cell, the selected language button, the pressed add stamp) and the few hairline-scale marks that point at them: the nav underline, the `em` in the hero headline, the Arabic wordmark, focus outlines, the scrollbar thumb, the `::selection` highlight.
- **Cedar Deep** (`brand-deep`): the hover fill for every cedar or ink button, the color of inline text links (`.link`), of dish tags, and of the "Open now" line. It is the darker step cedar goes to under the hand.
- **Cedar Light** (`brand-lt`): declared in `:root` under the client-site contract but unused by any rule in the shipped stylesheet. Reserved; do not reach for it until a role is established.

### Secondary
- **Brass** (`accent`): the market's field color (`.band.brass`) and the color of stamps and provisional marks (`.frame .stamp`, the dashed `.unverified` border, the `.notice.brass` border, the rating star). Brass carries ink text, never paper text, except when a brass button is hovered to `accent-deep`.
- **Brass Deep** (`accent-deep`): the text color for provisional labels (`.unverified`, `.foot .confirming`, the `~` after an estimated `.price.est`) and the hover fill of a brass button.

### Tertiary
- **Closed Clay** (`closed-clay`): the only warm red on the card. It means "closed" (`.hero-meta .closed`), "invalid" (`.field.invalid` border, `.field .error`, `.config .err`), and "remove" (the `.line .rm` hover). The stylesheet writes this value literally six times rather than as a custom property; treat it as a token anyway and keep it to those three meanings.

### Neutral
- **Card Stock** (`paper`): the sheet and every surface that sits on it (buttons at rest, inputs, chips, the ticket drawer, sticky course heads). Also the phone body background below 860px, where the sheet goes flush.
- **Mat** (`paper-2`): the recessed surface one step down: the photo frame mat, the config panel under a dish, the ticket footer, the order summary, the footer, notices, and ghost-button hover.
- **Counter** (`paper-3`): the body background the sheet rests on at desktop widths, the quantity-button hover, and the skeleton shimmer's dark stop.
- **Ink** (`ink`): text, the wordmark, the cart button fill, the selected chip fill, the add stamp's hover fill, the toast, the stroke of the `.steps` and `.qty` outlines.
- **Muted Ink** (`muted`): descriptions, ledes, captions, labels, addresses, counts, the rail label. The second type color; there is no third.
- **Paper on Cedar** (`ink-on-brand`): text on any cedar field.
- **Hairline** (`line`) and **Hairline Strong** (`line-strong`): the two rule weights. `line` separates (section borders, dish leaders, the ruler rail stripes, frame borders, `.proof` gutters); `line-strong` outlines things you touch (inputs, ghost buttons, the language stamp, chips, the remove square, the ticket's edge, the wordmark's divider).

### Named Rules
**The Region Rule.** Cedar commits at region scale. A cedar surface is a whole band, bar, cell, or button, never a tinted panel, a 10% wash behind a section, or a pale green background. The one cedar tint in the build (`rgba(30,107,79,.08)` behind a selected radio card) is paired with a full cedar border; tint never carries state alone.

**The Brass Rule.** Brass means "market" or "not yet confirmed." A brass field appears only on market surfaces; a brass mark appears only as a stamp, a dashed tag, or a `~`. Brass never colors a heading, a price, or body copy.

**The Two-Ink Rule.** Type is `ink` or `muted`. Cedar, brass, and clay may color a word only when they carry a meaning (the hero `em`, an open/closed state, a provisional label, a link).

## Typography

**Display Font:** Fustat (weights 500–700 loaded; with system-ui, Segoe UI, Helvetica, Arial fallback)
**Body Font:** the system sans stack (-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial)
**Label/Mono Font:** Red Hat Mono (400, 500; with ui-monospace, Menlo, Consolas fallback)
**Script faces:** Fustat with Noto Naskh Arabic fallback for Arabic; Vazirmatn for Farsi; Noto Nastaliq Urdu for Urdu; Noto Sans Devanagari for Hindi. Under RTL the display and sans stacks both resolve to the Arabic stack; Hindi swaps both to Devanagari.

**Character:** A tight, slightly condensed grotesk for everything with a name, an unobtrusive native sans for sentences, and a monospace that makes every price, code, time, and label read as set type on a printed card. The pairing is calm and typographic; nothing is decorative and nothing is italic.

### Hierarchy
- **Display** (Fustat 650, `clamp(2.2rem, 4.2vw, 3.7rem)`, line-height 1, tracking -0.025em, max 14ch): the one headline per page (`.hero h1`, `.page-head h1` at `clamp(2.2rem,4.6vw,3.8rem)`, `.thanks h1` up to 4rem). One word or phrase may be cedar via `em`.
- **Headline** (Fustat 620, `clamp(1.9rem, 3.4vw, 2.9rem)`, line-height 1.05): section heads (`.section-head h2`) and band heads (`.band h2` to 3rem, max 18ch). All headings are `text-wrap: balance`.
- **Course** (Fustat 620, `clamp(1.5rem, 2.6vw, 2.2rem)`): the sticky course heading over a run of dish rows; the aisle heading on the market uses the step below (`clamp(1.4rem,2.2vw,1.9rem)`), place-card and ticket headings sit at 1.5rem and 1.2rem.
- **Title** (Fustat 600, 1.15rem; 1.05rem in the hero list and below 520px): the dish name, the market good name, a ticket line name, a radio-card label, a pricelist item. Carries its item code as a 0.72rem mono chip before it.
- **Body** (system sans 400, 1rem/1.55): descriptions and notes, muted, capped at 58ch under a dish and 52–60ch in ledes. The lede steps up to `clamp(1.05rem, 1.5vw, 1.25rem)` at 1.5 line-height.
- **Price** (Red Hat Mono 500, 1.05rem, tabular, tracking -0.01em, forced LTR): one step below the dish name, never bolder than it. Variant prices step down to 0.95rem with a 0.72rem sans size label. An estimated price carries a brass-deep `~`.
- **Label** (Red Hat Mono 500, 0.72–0.84rem, tracking 0.05–0.14em, uppercase only on the rail label, the stamp, and the wordmark's "Grill & Market"): item codes, units, tags, counts, footer and aside headings, form labels (0.84rem, 0.01em, muted), the language stamp, the ticket count.

### Named Rules
**The Three-Voice Rule.** Fustat speaks names and headings, the system sans speaks sentences, Red Hat Mono speaks numbers and labels. No fourth face enters a surface, and no voice borrows another's job: a price is never set in Fustat, a sentence is never set in mono.

**The Quiet Price Rule.** Size carries hierarchy: the dish name at title size, the price one step smaller in tabular figures, flush to the end of the row. A price is never larger, bolder, or more colorful than the name beside it.

**The Script Rule.** Right-to-left pages drop heading letter-spacing to 0 and relax heading line-height to 1.3; Urdu body copy runs at 1.9. Prices, item codes, tags, and phone numbers stay LTR Western digits inside `unicode-bidi: isolate` spans, in every language.

## Layout

The page is a single sheet, `max-width: 1240px`, centered with `clamp(10px, 2vw, 28px)` of counter above and `clamp(24px, 4vw, 56px)` below. Inside it, a two-column grid: a 64px ruler rail (`--rail`) on the inline-start edge, then the main column. The rail is a `repeating-linear-gradient` of one hairline every 24px with a sticky, vertically-set mono label ("Spring · Texas · Est. 2008" on the home sheet, the market's two streets on market surfaces). It is a world element, not decoration, and it is what aligns every course heading and price column to one axis.

Horizontal rhythm comes from one inset, `--card-pad: clamp(20px, 4vw, 56px)`, used by the top bar, every section, course, band, page head, footer, and the checkout. Vertical rhythm: sections at `clamp(40px, 6vw, 88px)`, courses at `clamp(28px, 4vw, 52px)`, the hero at `clamp(28px, 4.5vw, 64px)`, dish rows at 16px, market goods at 12px, ticket lines at 14px. Gaps step through 4, 6, 8, 10, 12, 14, 16, 18, 22, 24px with no larger spacer; big breathing room comes from the section clamp, never from margin stacks.

Page templates reuse a handful of grids: the hero is `7fr / 5fr` (copy, then one framed photo); the menu is `1fr / 300px` with a sticky course index aside; the checkout is `1fr / 380px` with a sticky summary; bands, places, aisles, and catering split `1fr / 1fr` (aisles `2fr / 3fr` with a sticky frame); the footer is `1.4fr 1fr 1fr 1fr`; the proof strip is three cells with 1px hairline gutters made from the background.

Sticky stack: the top bar at 0 (z 40), course heads and the phone course-nav at 64px (112px below 860px where the nav wraps to a second row), the menu aside and checkout summary at 64–84px. The ticket drawer is z 60 over a z 55 scrim; the order bar is z 45; the toast is z 70.

Breakpoints, by what changes:
- **≤1040px:** the menu aside is replaced by a horizontally scrolling pill course-nav; the footer drops to two columns; the checkout stacks with the summary first.
- **≤860px:** the rail is removed (`--rail: 0`), the sheet goes flush to the viewport with no radius or shadow, and the body itself becomes `paper`; the top bar becomes two rows (wordmark + actions, then a scrolling nav); the hero stacks with the frame first; bands, places, aisles, catering, proof, and the footer go single-column; the cedar order bar turns on; the stepped band folds to a 2×2 grid.
- **≤520px:** a dish row goes to `84px / 1fr` with the price and add stamp dropping under the name; market goods drop their third column; hero buttons go full width.

## Elevation & Depth

Depth is reserved for the one thing that is physically a sheet on a counter, for the few things that lift off it, and for the review slips, which read as separate scraps of paper laid on the card. The sheet carries the system's single shadow plus a 1px inset white highlight (`inset 0 0 0 1px rgba(255,255,255,.6)`) that reads as coated stock. Everything inside the sheet is flat and ruled by hairlines; tonal layering is done with the three paper steps (`paper` surface, `paper-2` recess, `paper-3` counter), never with shadows. Photos get a mat, not a drop shadow.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 10px 30px -12px rgba(20,32,28,.28), 0 2px 6px -2px rgba(20,32,28,.14)`): the card on the counter; reused by the language menu, the toast, and a place card on hover, the three things that momentarily lift.
- **Ticket** (`-20px 0 50px -30px rgba(20,32,28,.4)`, mirrored to `20px` under RTL): the cart drawer sliding over the sheet.
- **Slip** (`0 8px 18px -12px rgba(20,32,28,.35)`): a review slip resting on the card; the only shadow an element inside the sheet may carry, and only because the slip is a second piece of paper.
- **Scrim** (`rgba(20,32,28,.35)` with `backdrop-filter: blur(2px)`): under the open ticket only.

### Named Rules
**The One Sheet Rule.** Inside the sheet nothing casts a shadow unless it is itself a piece of paper laid on the card (a review slip). Separation is a hairline (`line`), a dashed hairline, a mat (`paper-2`), or a 1px `line-strong` outline. Any other shadow means the element has left the card.

## Shapes

Corners are small and purposeful. The sheet, frames, cards, notices, the config panel, and the language menu use the large radius (10px); buttons, inputs, the cart button, and the stepped band use the small radius (4px); photos inside frames and the toast use 6px; stamps, item-code chips, the ticket count, and the unverified tag are nearly square (2px); the ticket-line remove button is 3px. Pills (999px) are reserved for things you flick between: the quantity stepper, choice chips, the language stamp, the course-nav chips. The add stamp is the only circle.

Control shape is semantic and distinct: **round** add (44px circle, 1.5px ink stroke), **pill** quantity (40px tall, ink stroke, square inner buttons), **square** buttons and inputs (4px, 48px tall), **small square** remove (32px, 3px). Stepped bands are a single 1px ink outline with 1px ink dividers between cells; nothing inside them is rounded.

Rules are hairlines in three textures: solid `line` between sections and under sticky heads; dashed `line` between dish rows, market goods, ticket lines, and pricelist rows; dotted `line` between hours rows. A dashed brass border means "unverified." Images are always 4:3 inside the frame (1:1 in market aisles, 16:9 on place cards), object-fit cover, with a 1px `line` border and a 6px radius. Nothing is clipped diagonally, masked, or rotated except the brass stamp (2°, counter-rotating to -3° while the hero photo swaps) and the review slips, which tilt -0.6°, 0.5°, -0.3° in a repeating three-card cycle via `--tilt`.

## Components

### Buttons
- **Shape:** small square corners (4px), 48px minimum height, Fustat 600 at 0.95rem, 14px 22px padding, 1px border matching the fill.
- **Primary:** cedar fill, paper text; hover darkens to cedar-deep; active drops 1px. Inside a cedar band the primary inverts to a paper button with ink text (`.band .btn`), and inside a brass band to an ink button with paper text.
- **Ghost:** transparent with a `line-strong` outline and ink text; hover fills `paper-2` and the outline goes ink. On cedar it is paper-text with a 50% white outline; on brass, ink text with a 45% ink outline.
- **Paper:** paper fill on cedar (the order bar's "Review ticket").
- **Brass:** brass fill with ink text; hover goes brass-deep with paper text. Used once, for the market's primary action on the Riley Fuzzel sheet.
- **Loading / disabled:** text goes transparent under an 18px spinning two-tone ring; disabled is 50% opacity with a not-allowed cursor.
- **Text link** (`.link`): no chrome, underlined, cedar-deep.

### Chips
- **Choice chip** (`.choice`): a pill with a `line-strong` outline on paper, 40px tall; selected fills ink with paper text. Focus is a 2px cedar outline at 2px offset. Used for variants and required choices in the inline config panel.
- **Course-nav chip:** the same pill at 0.86rem; the active course fills ink.
- **Item code** (`.code`): a 2px-radius mono chip with a `line` border, 0.72rem, muted, always LTR.
- **Tag** (`.tag`): bare mono text in cedar-deep (serving size, minimum quantity, piece count).
- **Unverified tag:** mono brass-deep text inside a dashed brass 2px-radius border.

### Cards / Containers
- **The sheet:** 10px radius, `paper`, the system shadow, the inset highlight; flush and shadowless below 860px.
- **Frame** (`.frame`): a 10px-radius `paper-2` mat with a 1px `line` border and 10px of padding around a 6px-radius 4:3 photo; a caption row below in 0.85rem muted with an ink-bold title; optionally a rotated brass stamp hanging off the top edge.
- **Place card** (`.place`): 10px radius, 1px `line` border, 16:9 photo, 22px body padding, hours as a dotted-rule table; hover lifts 2px and borrows the sheet shadow.
- **Config panel** (`.config`): full-row `paper-2` well, 10px radius, 1px `line` border, 16px 18px padding; it opens inline under a dish row rather than in a modal.
- **Notice:** 10px radius, `line-strong` border, `paper-2`, 0.92rem, an 18px stroke icon leading; the brass variant swaps the border to brass over a 10% brass wash.
- **Summary** (checkout): `paper-2` well with a `line` border, 20px padding, sticky.

### Inputs / Fields
- **Style:** 4px radius, 1px `line-strong` border, `paper` fill, 13px 14px padding, 48px minimum height, body font; placeholder in a light gray-green (`#8A938F`). Labels are mono 0.84rem muted above the field with a 6px gap.
- **Focus:** 2px cedar outline at 0 offset and the border turns cedar.
- **Error:** border and 0.84rem message in closed-clay; the message is hidden until `.invalid`.
- **Radio card:** a 10px-radius `line-strong` outlined row with a Fustat label, muted sub-line, and mono price; selected turns the border cedar over an 8% cedar wash.
- **Stepped band** (`.steps`): a one-outline grid of equal cells (64px tall, Fustat 600 label over a 0.74rem sans sub-label), ink dividers, selected cell filled cedar with paper text, focus a 2px brass inset outline. Folds to 2×2 below 860px. Used for pickup time.

### Navigation
- **Top bar:** sticky, `paper`, 1px `line` bottom rule, three-column grid (wordmark, centered nav, actions). Wordmark is Fustat 700 "Zamani" at 1.45rem, the Arabic زماني in cedar beside it, and a mono uppercase "Grill & Market" behind a `line-strong` divider (hidden on phones).
- **Nav links:** Fustat 500 at 0.9rem, 10px 2px padding, no underline; a 2px cedar bar scales in from the start edge (`transform-origin` flips under RTL) on hover and stays on the current page.
- **Language stamp:** a `details` summary styled as a pill with a globe stroke icon and the mono language code; open state darkens its border to ink. The menu is a 10px-radius paper panel with the sheet shadow; the current language fills cedar; each language is set in its own face and direction.
- **Cart button:** ink fill, paper text, 4px radius, a ticket stroke icon, "Ticket," and a paper count chip (2px radius, mono); bumps 6% when the count changes; the word hides on phones.
- **Menu aside / course-nav:** the desktop index lists courses with mono counts, the active one filled ink; the phone version is a scrolling row of pills under the sticky top bar.
- **Order bar (phone only):** a cedar field pinned to the bottom with safe-area padding, a Fustat summary with a sans sub-line at 85%, and a paper button; slides up when the ticket has items and never shows on checkout.

### Dish Row (signature)
The unit the whole system is built around: a three-column grid (112px 4:3 photo, body, side) with 18px gaps, 16px vertical padding, and a dashed hairline below. The body is the item-code chip, the Fustat 600 name, a muted 0.94rem description capped at 58ch, and mono tags. The side is the tabular price (or a stacked `variants` column of label + price) and the 44px round add stamp. The stamp inverts to ink on hover, scales to 0.92 on press, and fills cedar with a 420ms press animation when an item lands in the ticket; a toast ("Added to your ticket") rises from above the order bar for 1.8s. Rows without a photo drop the first column. The hero reuses the row at 64px photo / 40px stamp with descriptions hidden.

### Ticket Drawer (signature)
A fixed `min(420px, 100%)` paper panel on the inline-end edge with a `line-strong` edge and the ticket shadow, sliding from 104% off-canvas in 420ms (mirrored under RTL). Head (Fustat 1.2rem title, 40px square close), scrolling body of ticket lines (Fustat name, muted meta, mono price, then a 34px quantity pill and a 32px remove square), and a `paper-2` foot with a totals ledger (grand total above a `line-strong` rule) and a full-width primary button. New lines stamp in with a 6px drop and 0.98 scale.

### Cedar and Brass Bands
Full-width regions of `brand` or `accent` at section padding, with a 3rem-max Fustat headline capped at 18ch, 90%-opacity body copy capped at 56ch, inverted buttons, and a `fact` ladder: hairline-separated rows (25% paper or ink hairlines) with a 1.6rem Fustat figure over a 0.9rem caption. Cedar bands close the home sheet and the catering story; brass bands are the market's.

### Review Slips (signature)
Public reviews, verbatim, as paper slips sliding across the card between the proof strip and the featured dishes. The `.reviews` section runs `clamp(36px, 5vw, 64px)` of top padding with no horizontal inset, a bottom hairline, and `overflow: hidden`; its section head keeps `--card-pad` with a smaller headline (`clamp(1.6rem, 2.8vw, 2.3rem)`). Inside, the `.marquee` is a `max-content` flex row with 16px gaps that translates by half its width over `--marquee-dur` (70s, linear, infinite); the list is rendered once plus an `aria-hidden` duplicate (`.marquee-copy`, `display: contents`) so the loop is seamless, and it pauses on hover and on `focus-within`. Under RTL it slides the other way (`slide-rtl`). Each `.slip` is `min(320px, 78vw)` wide: paper, 1px `line-strong` border, 4px radius, 18px 18px 16px padding, a 10px grid, the slip shadow, and a per-card tilt. Contents: a row of 14px brass stars, a 0.98rem/1.5 blockquote forced LTR with a brass Fustat 700 opening quotation mark via `::before`, and a mono 0.74rem footer (name in ink 600, source and year in muted) pushed to the bottom. Under `prefers-reduced-motion` the animation stops, the duplicate is hidden, and the section becomes a horizontally scrollable row with mandatory scroll-snap on each slip. Content is `content/reviews.json` (real public reviews only, first name and initial, source, year), rendered by `renderReviews()` in `scripts/build.mjs`; never a fabricated review.

### Motion
One easing, `cubic-bezier(.16, 1, .3, 1)`, at two durations: 180ms (`--fast`) for fills, borders, and nav underlines; 420ms (`--slow`) for the ticket, scrim, order bar, reveal, and the three stamps (`bump` 1.06 on the cart count, `press` 0.9→1.08→1 on an add, `stamp` on a new ticket line). Reveal (`.rv`) is a 12px rise and fade on intersection, 8% before the bottom edge. The home hero's lattice draws its strokes over 2.6s in five staggered 250ms steps and the hero photo cross-fades in 0.5s while the stamp counter-rotates. The review marquee is the one continuous motion: a 70s linear loop (`--marquee-dur`) that pauses under the pointer or keyboard focus and reverses direction under RTL. `prefers-reduced-motion` removes every animation and transition and shows reveals at rest.

## Do's and Don'ts

### Do:
- **Do** put every new surface inside the one sheet, with the ruler rail and the top bar, inset by `--card-pad`; a new page is a new region of the same card, not a new card.
- **Do** separate content with hairlines: solid `line` between sections, dashed between rows, dotted between hours. Reach for `paper-2` when a region needs to recede.
- **Do** set every number in Red Hat Mono with tabular figures, forced LTR, one step smaller than the name it belongs to.
- **Do** commit cedar to a whole region or a whole control (a band, the order bar, a selected step, a pressed stamp) and let brass mark the market and anything unconfirmed.
- **Do** give every control its shape: round to add, pill to count or choose, square to commit, small square to remove; show state by fill (ink or cedar) with the text inverting to paper.
- **Do** keep photos in a `.frame` with a mat, a 1px border, and a caption that names the dish and its provenance; put text beside a photo, never on it.
- **Do** test each new surface in Arabic and Urdu: logical properties (`inline-start`/`inline-end`) everywhere, `unicode-bidi: isolate` on prices, codes, and phone numbers, and heading tracking reset to 0 under RTL.
- **Do** label unconfirmed business facts with the dashed brass `.unverified` tag or a `~` on the price; the provisional mark is part of the system.

### Don't:
- **Don't** use a full-bleed photo, a photo behind text, or a gradient; the ground is always card stock.
- **Don't** add shadows to anything inside the sheet; the sheet, the ticket, the language menu, a toast, a hovered place card, and the review slips (a second piece of paper on the card) are the complete list of things that lift.
- **Don't** tint cedar or brass behind a section, or carry state with a tint alone; the 8% cedar wash exists only under a selected radio card and only together with a cedar border.
- **Don't** introduce a fourth typeface, an italic, or an all-caps run longer than a mono label; the three uppercase runs on the card are the rail label, the brass stamp, and "Grill & Market" in the wordmark.
- **Don't** make a price louder than its dish: never bold, never larger than the name, never colored except the brass-deep `~` on an estimate.
- **Don't** replace the stepped band with a dropdown or the inline config panel with a modal; choices open in place, on the card.
- **Don't** use `brand-lt`, `#8A938F`, or any new hex without first giving it a role here; the palette is complete at fourteen values.
- **Don't** add decorative eyebrows or kickers above headings; the heading and the item-code chip are the only things that precede a name on this card.
