#!/usr/bin/env node
// Renders content/*.json into the static pages between <!-- @block --> ... <!-- /@block --> markers,
// so crawlers and no-JS visitors see the full menu, market, and locations. Also writes sitemap.xml.
// Idempotent: run `node scripts/build.mjs` after editing any JSON. No dependencies.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = process.env.SITE_URL || "https://zamanigrill.com";
const read = f => JSON.parse(readFileSync(join(ROOT, "content", f), "utf8"));
const menu = read("menu.json"), market = read("market.json"), locs = read("locations.json");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => "$" + Number(n).toFixed(2);
const attr = o => esc(JSON.stringify(o));
const PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

/* ---------- menu ---------- */
function dishRow(item, { prefix = "" } = {}) {
  const data = { id: item.id, name: item.name, kind: "menu" };
  if (item.price != null) data.price = item.price;
  if (item.variants) data.variants = item.variants;
  if (item.choices) data.choices = item.choices;
  if (item.minQty) data.minQty = item.minQty;
  const img = item.img ? `<img class="dish-img" src="${prefix}${item.img.replace(".webp", "-sm.webp")}" width="480" height="359" alt="${esc(item.name)}" loading="lazy" decoding="async">` : "";
  const price = item.variants
    ? `<div class="variants">${item.variants.map(v => `<span class="price"><small>${esc(v.label)}</small>${money(v.price)}</span>`).join("")}</div>`
    : `<span class="price">${money(item.price)}</span>`;
  const tags = [item.note, item.serves, item.minQty ? `Min ${item.minQty}` : null].filter(Boolean).map(x => `<span class="tag">${esc(x)}</span>`).join("");
  return `<article class="dish${img ? "" : " no-img"}" data-item="${attr(data)}" id="item-${esc(item.id)}">
  ${img}
  <div class="dish-body"><h3><span class="code">${esc(item.id)}</span>${esc(item.name)}</h3>${item.desc ? `<p data-i18n="menu.${esc(item.id)}.desc">${esc(item.desc)}</p>` : ""}${tags}</div>
  <div class="dish-side">${price}<button type="button" class="add" aria-label="Add ${esc(item.name)}">${PLUS}</button></div>
</article>`;
}
function courseNote(c) {
  if (c.id === "mains" || c.id === "ground") return menu.sidesNote;
  if (c.id === "sandwiches") return menu.sandwichNote;
  if (c.id === "skewers") return "Minimum order of 6 skewers per kind.";
  if (c.id === "drinks") return "All beverages $1.99.";
  return "";
}
function renderMenu(prefix = "") {
  return menu.categories.map(c => `<section class="course" id="c-${c.id}" aria-labelledby="h-${c.id}">
  <div class="course-head"><h2 id="h-${c.id}" data-i18n="cat.${c.id}">${esc(c.name)}</h2>${courseNote(c) ? `<p class="note" data-i18n="catnote.${c.id}">${esc(courseNote(c))}</p>` : `<span class="n">${c.items.length}</span>`}</div>
  <div class="dishes">${c.items.map(i => dishRow(i, { prefix })).join("\n")}</div>
</section>`).join("\n");
}
function renderMenuNav() {
  return menu.categories.map(c => `<a href="#c-${c.id}"><span data-i18n="cat.${c.id}">${esc(c.name)}</span><span class="n">${c.items.length}</span></a>`).join("");
}
function renderCourseNav() {
  return menu.categories.map(c => `<a href="#c-${c.id}" data-i18n="cat.${c.id}">${esc(c.name)}</a>`).join("");
}
function renderFeatured(ids, prefix = "") {
  const all = new Map(); menu.categories.forEach(c => c.items.forEach(i => all.set(i.id, i)));
  return ids.map(id => all.get(id)).filter(Boolean).map(i => dishRow(i, { prefix })).join("\n");
}

/* ---------- market ---------- */
function renderMarket(prefix = "") {
  const est = !market.pricesVerified;
  return market.categories.map(c => `<section class="aisle" id="a-${c.id}" aria-labelledby="h-${c.id}">
  <figure class="frame"><img src="${prefix}${c.img}" width="1200" height="800" alt="${esc(c.name)}" loading="lazy" decoding="async"><figcaption><b data-i18n="aisle.${c.id}">${esc(c.name)}</b><span data-i18n="market.stockPhoto">Stock photo until ours is shot</span></figcaption></figure>
  <div><h2 id="h-${c.id}" data-i18n="aisle.${c.id}">${esc(c.name)}</h2><p class="blurb" data-i18n="aisle.${c.id}.blurb">${esc(c.blurb)}</p>
  <div class="goods">${c.items.map(i => `<div class="good" data-item="${attr({ id: i.id, name: i.name, price: i.price, kind: "market", est })}">
    <div><div class="nm">${esc(i.name)}</div><div class="ds">${esc(i.desc)}</div></div>
    <div><span class="price${est ? " est" : ""}">${money(i.price)}</span><div class="unit">${esc(i.unit)}</div></div>
    <button type="button" class="add" aria-label="Add ${esc(i.name)}">${PLUS}</button>
  </div>`).join("\n")}</div></div>
</section>`).join("\n");
}

/* ---------- locations ---------- */
const fmtTime = t => { const [h, m] = t.split(":").map(Number); const ampm = h >= 12 ? "pm" : "am"; const hh = ((h + 11) % 12) + 1; return `${hh}:${String(m).padStart(2, "0")} ${ampm}`; };
function hoursTable(l) {
  return `<div class="hours" data-i18n-hours>${l.hours.map(h => `<div><span data-i18n="days.${h.dayCodes.join("")}">${esc(h.days)}</span><time>${fmtTime(h.open)} – ${fmtTime(h.close)}</time></div>`).join("")}</div>${l.hoursVerified === false ? `<span class="unverified" data-i18n="hours.unverified">Hours and phone from a directory listing — confirming with the store</span>` : ""}`;
}
function placeCard(l, prefix = "", H = "h3") {
  return `<article class="place rv" id="${l.id}">
  <img src="${prefix}${l.photo}" width="900" height="674" alt="${esc(l.fullName)}" loading="lazy" decoding="async">
  <div class="place-body">
    <${H}>${esc(l.name)}</${H}>
    <p data-i18n="loc.${l.id}.tagline">${esc(l.tagline)}</p>
    <address>${esc(l.street)}<br>${esc(l.city)}, ${esc(l.state)} ${esc(l.zip)}<br><a href="tel:${l.phoneE164}" class="mono">${esc(l.phone)}</a></address>
    <div class="hero-meta" style="margin:0;padding:0;border:0"><span data-open-now="${attr(l.hours)}"></span></div>
    ${hoursTable(l)}
    <div class="place-actions"><a class="btn ghost" href="${l.googleMapsUrl}" target="_blank" rel="noopener" data-i18n="loc.directions">Directions</a><a class="btn ghost" href="tel:${l.phoneE164}" data-i18n="loc.call">Call</a><a class="btn" href="${prefix}${l.slug}/" data-i18n="loc.details">Details</a></div>
  </div>
</article>`;
}
function renderPlaces(prefix = "", H = "h3") { return locs.locations.map(l => placeCard(l, prefix, H)).join("\n"); }
function renderFooterNap(prefix = "") {
  return locs.locations.map(l => `<div><p class="fh">${esc(l.name)}</p><address>${esc(l.street)}<br>${esc(l.city)}, ${esc(l.state)} ${esc(l.zip)}<br><a href="tel:${l.phoneE164}" class="mono">${esc(l.phone)}</a>${l.phoneNote ? `<span class="confirming" data-i18n="foot.confirming">number being confirmed</span>` : ""}</address></div>`).join("");
}
function renderJsonLd(pageKind, locId) {
  const toSpec = l => l.hours.map(h => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.dayCodes.map(d => ({ Su: "Sunday", Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday" }[d])), opens: h.open, closes: h.close }));
  const node = l => ({
    "@type": l.kind.includes("restaurant") ? ["Restaurant", "GroceryStore"] : "GroceryStore",
    "@id": `${SITE}/${l.slug}/#place`, name: l.fullName, url: `${SITE}/${l.slug}/`, telephone: l.phoneE164, image: `${SITE}/${l.photo}`,
    servesCuisine: l.kind.includes("restaurant") ? ["Lebanese", "Mediterranean", "Middle Eastern", "Halal"] : undefined,
    priceRange: "$$", acceptsReservations: false,
    address: { "@type": "PostalAddress", streetAddress: l.street, addressLocality: l.city, addressRegion: l.state, postalCode: l.zip, addressCountry: "US" },
    geo: { "@type": "GeoCoordinates", latitude: l.geo.lat, longitude: l.geo.lng },
    openingHoursSpecification: toSpec(l), hasMap: l.googleMapsUrl,
    parentOrganization: { "@id": `${SITE}/#org` },
    hasMenu: l.kind.includes("restaurant") ? `${SITE}/menu` : undefined
  });
  const org = { "@type": "Organization", "@id": `${SITE}/#org`, name: locs.brand, url: SITE + "/", logo: `${SITE}/img/brand/mark.svg`, sameAs: ["https://www.facebook.com/zamanimarketgrill"] };
  const graph = [org, ...(locId ? [node(locs.locations.find(l => l.id === locId))] : locs.locations.map(node))];
  if (pageKind === "menu") graph.push({ "@type": "Menu", "@id": `${SITE}/menu#menu`, name: "Zamani Grill menu", url: `${SITE}/menu`, inLanguage: "en",
    hasMenuSection: menu.categories.map(c => ({ "@type": "MenuSection", name: c.name, hasMenuItem: c.items.map(i => ({ "@type": "MenuItem", name: i.name, description: i.desc || undefined, image: i.img ? `${SITE}/${i.img}` : undefined, offers: i.variants ? i.variants.map(v => ({ "@type": "Offer", name: v.label, price: v.price.toFixed(2), priceCurrency: "USD" })) : { "@type": "Offer", price: i.price.toFixed(2), priceCurrency: "USD" } })) })) });
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, (k, v) => v === undefined ? undefined : v)}</script>`;
}


/* ---------- shared chrome ---------- */
const CONTRACT = `<!--
  DIRECTION CONTRACT — Levant Menu Card (seed 0db87a8c)
  THESIS: The menu is the page. A bright card of typography where every dish, price and pickup time is already set, English and
  Arabic at equal weight, and the photo is the garnish. It refuses the full-bleed food hero with an "Order Online" button.
  OWN-WORLD: Card stock #FBF8F2 as a shadowed sheet on a darker counter; ink #14201C; one cedar green #1E6B4F that owns whole
  regions (order rail, catering band); brass #B98A2E for the market; hairline rules, dashed dish leaders, tabular Red Hat Mono
  prices; Fustat for Latin and Arabic; round stamp "add", pill quantity, square remove; a left ruler rail aligning every course.
  STORY: A hungry neighbor sees the first course and its prices in one glance, adds in one tap, pays on the kitchen's own
  Priority payment page, and learns the same halal meat is sold next door.
  FIRST VIEWPORT: Left 7/12: wordmark, headline, lede, two actions, open-now line. Right 5/12: one framed dish photo cycling
  through the owner's own studio shots under a brass stamp. Phone: frame first, headline, cedar order rail pinned to the bottom.
  FORM: Levant Menu Card, candidate 7 of 7 on the grounded list, assigned by the roll; built code-led.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every
  shipping raster carrying its provenance.
-->`;
const NAV = [["index.html", "", "nav.home", "Home"], ["menu.html", "menu", "nav.menu", "Menu"], ["market.html", "market", "nav.market", "Market"], ["catering.html", "catering", "nav.catering", "Catering"], ["locations.html", "locations", "nav.locations", "Locations"]];
function renderHead(prefix, ctx) {
  const langs = ["ar", "fa", "hi", "ur"];
  const canon = `${SITE}${ctx.path}`;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
<link rel="canonical" href="${canon}">
${langs.map(l => `<link rel="alternate" hreflang="${l}" href="${canon}${canon.includes("?") ? "&" : "?"}lang=${l}">`).join("\n")}
<link rel="alternate" hreflang="en" href="${canon}">
<link rel="alternate" hreflang="x-default" href="${canon}">
<meta name="theme-color" content="#FBF8F2">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fustat:wght@500..700&family=Red+Hat+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${prefix}css/site.css">
<script>try{var l=localStorage.getItem("zamani-lang");if(l){l=JSON.parse(l);if(l&&l!=="en"){document.documentElement.lang=l;document.documentElement.dir=(l==="hi")?"ltr":"rtl"}}}catch(e){}</script>`;
}
function renderHeader(prefix, ctx) {
  return `<header class="top">
  <a class="wordmark" href="${prefix || "./"}" aria-label="Zamani Grill & Market, home"><span class="lat">Zamani</span><span class="ar" lang="ar" aria-hidden="true">زماني</span><span class="sub">Grill &amp; Market</span></a>
  <nav class="nav" aria-label="Site">${NAV.map(([file, key, i18n, label]) => `<a href="${prefix}${key || ""}${key ? "" : (prefix ? "" : "./")}"${ctx.page === key ? ' aria-current="page"' : ""} data-i18n="${i18n}">${label}</a>`).join("")}</nav>
  <div class="top-actions">
    <details class="lang"><summary aria-label="Language"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg><span class="cur">EN</span></summary><div class="lang-menu" role="group" aria-label="Choose language"></div></details>
    <button type="button" class="cartbtn" data-open-ticket aria-label="Open your ticket"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h14v18l-2.3-1.6L14.4 21l-2.4-1.6L9.6 21l-2.3-1.6L5 21z"/><path d="M9 8h6M9 12h6"/></svg><span class="lbl" data-i18n="cart.ticket">Ticket</span><span class="count">0</span></button>
  </div>
</header>`;
}
function renderFooter(prefix) {
  return `<footer class="foot">
  <div><p class="fh" data-i18n="foot.about">Zamani Grill &amp; Market</p><p data-i18n="foot.blurb">Family-run Lebanese grill and halal market in Spring, Texas since 2008. Fresh ingredients, fire-grilled kabobs, and the same halal meat and spices for your own kitchen.</p>
    <p style="margin-top:12px"><a href="https://www.facebook.com/zamanimarketgrill" rel="noopener" target="_blank">Facebook</a></p></div>
  ${renderFooterNap(prefix)}
  <div><p class="fh" data-i18n="foot.visit">Visit</p><ul>${NAV.slice(1).map(([f, key, i18n, label]) => `<li><a href="${prefix}${key}" data-i18n="${i18n}">${label}</a></li>`).join("")}<li><a href="${prefix}privacy" data-i18n="foot.privacy">Privacy &amp; terms</a></li></ul></div>
  <div class="legal"><span>© <span class="num">${new Date().getFullYear()}</span> Zamani Grill &amp; Market. <span data-i18n="foot.halal">Fully halal. No alcohol.</span></span><span data-i18n="foot.prices">Prices subject to change without notice.</span></div>
</footer>`;
}
function renderTicket(prefix) {
  return `<div class="scrim" hidden></div>
<aside class="ticket" aria-label="Your ticket" role="dialog" aria-modal="true">
  <div class="ticket-head"><h2 data-i18n="cart.yourTicket">Your ticket</h2><button type="button" class="close" aria-label="Close" data-i18n-attr="aria-label:cart.close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
  <div class="ticket-body"></div>
  <div class="ticket-foot"><div class="totals"></div><a class="btn" href="${prefix}checkout" data-i18n="cart.checkout">Pickup &amp; pay</a></div>
</aside>
<div class="orderbar"><div class="sum"></div><a class="btn" href="${prefix}checkout" data-i18n="cart.review">Review ticket</a></div>
<script src="${prefix}js/site.js" defer></script>`;
}

/* ---------- apply to pages ---------- */
const blocks = {
  "menu": p => renderMenu(p), "menu-nav": () => renderMenuNav(), "course-nav": () => renderCourseNav(),
  "featured": p => renderFeatured(["A25", "H20", "B5", "M7", "K3", "H17"], p), "hero-dishes": p => renderFeatured(["M2", "M8", "F1"], p),
  "market": p => renderMarket(p), "places": (p, c) => renderPlaces(p, c.page === "locations" ? "h2" : "h3"), "footer-nap": p => renderFooterNap(p),
  "jsonld-home": () => renderJsonLd("home"), "jsonld-menu": () => renderJsonLd("menu"),
  "jsonld-louetta": () => renderJsonLd("place", "louetta"), "jsonld-riley-fuzzel": () => renderJsonLd("place", "riley-fuzzel"),
  "jsonld-locations": () => renderJsonLd("home"),
  "contract": () => CONTRACT, "head": (p, c) => renderHead(p, c), "header": (p, c) => renderHeader(p, c), "footer": p => renderFooter(p), "ticket": p => renderTicket(p)
};
function walk(dir, out = []) { for (const f of readdirSync(dir)) { if (["node_modules", ".git", "img", ".impeccable", "scripts", "netlify"].includes(f)) continue; const p = join(dir, f); if (statSync(p).isDirectory()) walk(p, out); else if (f.endsWith(".html")) out.push(p); } return out; }
let touched = 0;
for (const file of walk(ROOT)) {
  let html = readFileSync(file, "utf8"); const before = html;
  const rel = file.slice(ROOT.length + 1); const depth = rel.split("/").length - 1; const prefix = "../".repeat(depth);
  const pathNoExt = rel.replace(/index\.html$/, "").replace(/\.html$/, ""); const page = pathNoExt.split("/")[0] === "tx" ? "locations" : pathNoExt.replace(/\/$/, "");
  const ctx = { page, path: "/" + pathNoExt };
  html = html.replace(/<!-- @([a-z-]+) -->[\s\S]*?<!-- \/@\1 -->/g, (m, name) => blocks[name] ? `<!-- @${name} -->\n${blocks[name](prefix, ctx)}\n<!-- /@${name} -->` : m);
  if (html !== before) { writeFileSync(file, html); touched++; console.log("rendered", file.slice(ROOT.length + 1)); }
}

/* ---------- sitemap ---------- */
const pages = ["/", "/menu", "/market", "/catering", "/locations", "/tx/spring/louetta/", "/tx/spring/riley-fuzzel/"];
const today = new Date().toISOString().slice(0, 10);
const langs = ["ar", "fa", "hi", "ur"];
const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  pages.map(p => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod>${langs.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${p}${p.includes("?") ? "&" : "?"}lang=${l}"/>`).join("")}<xhtml:link rel="alternate" hreflang="en" href="${SITE}${p}"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p}"/></url>`).join("\n") + "\n</urlset>\n";
writeFileSync(join(ROOT, "sitemap.xml"), sm);
console.log(`build ok: ${touched} page(s) rendered, sitemap.xml written`);
