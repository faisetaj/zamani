// Zamani Grill & Market — order intake.
// Re-prices the cart from content/*.json (never trusts the browser), assigns an order number,
// notifies the kitchen by email, and hands the customer to the Priority / MX Merchant Payment Link
// (Link2Pay hosted page) when configured. Card data never touches this function.
//
// Env vars (Netlify UI):
//   MX_PAYMENT_LINK_URL   the Link2Pay URL from MX Merchant > Settings > Payment Links (optional until live)
//   RESEND_API_KEY        for kitchen notification email (optional; logs to function output if absent)
//   ORDER_EMAIL_TO        comma-separated kitchen inboxes, e.g. "orders@zamanigrill.com,faisel@example.com"
//   ORDER_EMAIL_FROM      verified sender, e.g. "Zamani Orders <orders@zamanigrill.com>"
//   SITE_URL              e.g. https://zamanigrill.com (defaults to the request origin)
//   TAX_RATE              defaults to menu.json taxRate (0.0825)

const fs = require("fs");
const path = require("path");

const json = (status, body) => ({ statusCode: status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, body: JSON.stringify(body) });
const money = n => "$" + (Math.round(n * 100) / 100).toFixed(2);
const clean = (s, max = 200) => String(s || "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, max);

function loadContent() {
  const root = path.join(__dirname, "..", "..", "content");
  const read = f => JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
  const menu = read("menu.json"), market = read("market.json"), locations = read("locations.json");
  const catalog = new Map();
  menu.categories.forEach(c => c.items.forEach(i => catalog.set("menu:" + i.id, { ...i, kind: "menu", category: c.name })));
  market.categories.forEach(c => c.items.forEach(i => catalog.set("market:" + i.id, { ...i, kind: "market", category: c.name, est: !market.pricesVerified })));
  return { menu, market, locations, catalog };
}

function orderNumber() {
  const d = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const ymd = d.getFullYear().toString().slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return "Z-" + ymd + "-" + rand;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "method-not-allowed" });
  let body; try { body = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "bad-json" }); }

  const { catalog, locations, menu } = loadContent();
  const taxRate = Number(process.env.TAX_RATE || menu.taxRate || 0.0825);

  const customer = { name: clean(body.customer && body.customer.name, 80), phone: clean(body.customer && body.customer.phone, 30), email: clean(body.customer && body.customer.email, 120) };
  if (!customer.name || customer.phone.replace(/\D/g, "").length < 10) return json(400, { error: "name-and-phone-required" });

  const loc = locations.locations.find(l => l.id === body.location) || locations.locations[0];
  const pickup = ["asap", "20", "45", "scheduled"].includes(body.pickup) ? body.pickup : "asap";
  const tender = body.tender === "online" && process.env.MX_PAYMENT_LINK_URL ? "online" : "pickup";
  const notes = clean(body.notes, 500);

  // Re-price every line from the catalog. Unknown ids are rejected, not guessed.
  const lines = [];
  for (const raw of (Array.isArray(body.items) ? body.items : []).slice(0, 60)) {
    const item = catalog.get((raw.kind === "market" ? "market:" : "menu:") + String(raw.id));
    if (!item) return json(400, { error: "unknown-item", id: raw.id });
    let unit = item.price, variant = null;
    if (item.variants && item.variants.length) {
      variant = item.variants.find(v => v.label === raw.variant) || item.variants[0]; unit = variant.price;
    }
    const minQty = item.minQty || 1;
    const qty = Math.min(99, Math.max(minQty, parseInt(raw.qty, 10) || minQty));
    const choices = {};
    (item.choices || []).forEach(g => { const v = raw.choices && raw.choices[g.label]; if (g.options.includes(v)) choices[g.label] = v; });
    if (typeof unit !== "number") return json(400, { error: "unpriced-item", id: raw.id });
    lines.push({ id: item.id, kind: item.kind, name: item.name, variant: variant ? variant.label : null, choices, qty, unit, total: unit * qty, est: !!item.est });
  }
  if (!lines.length) return json(400, { error: "empty-order" });

  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const orderNo = orderNumber();
  const siteUrl = (process.env.SITE_URL || (event.headers && (event.headers.origin || ("https://" + event.headers.host))) || "").replace(/\/$/, "");

  const summary = lines.map(l => `${l.qty}× ${l.name}${l.variant ? " (" + l.variant + ")" : ""}${Object.keys(l.choices).length ? " — " + Object.entries(l.choices).map(([k, v]) => k + ": " + v).join(", ") : ""}  ${money(l.total)}${l.est ? " ~est" : ""}`).join("\n");
  const pickupText = { asap: "ASAP (about 20–25 min)", 20: "In 20 minutes", 45: "In 45 minutes", scheduled: "Scheduled — see notes" }[pickup];
  const text = [
    `NEW ${tender === "online" ? "ONLINE-PAY" : "PAY-AT-PICKUP"} ORDER  ${orderNo}`,
    `Location: ${loc.fullName}`,
    `Customer: ${customer.name}  ${customer.phone}${customer.email ? "  " + customer.email : ""}`,
    `Pickup: ${pickupText}`,
    notes ? `Notes: ${notes}` : null,
    "",
    summary,
    "",
    `Subtotal ${money(subtotal)}   Tax ${money(tax)}   TOTAL ${money(total)}`,
    tender === "online" ? "Payment: customer sent to MX Merchant payment page. Confirm PAID in MX Merchant (or the PaymentSuccess webhook email) before preparing." : "Payment: collect at pickup.",
    lines.some(l => l.est) ? "~est = market item priced from the placeholder list; charge the shelf price." : null
  ].filter(x => x !== null).join("\n");

  // Kitchen notification. Fails soft: the order still proceeds and is logged.
  let notified = false;
  if (process.env.RESEND_API_KEY && process.env.ORDER_EMAIL_TO) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.ORDER_EMAIL_FROM || "Zamani Orders <onboarding@resend.dev>", to: process.env.ORDER_EMAIL_TO.split(",").map(s => s.trim()), subject: `Order ${orderNo} · ${loc.name} · ${money(total)} · ${customer.name}`, text })
      });
      notified = r.ok; if (!r.ok) console.error("resend", r.status, await r.text());
    } catch (e) { console.error("resend-failed", e); }
  }
  console.log(JSON.stringify({ orderNo, total, tender, location: loc.id, notified, lines: lines.length }));
  console.log(text);

  let redirect;
  if (tender === "online") {
    const u = new URL(process.env.MX_PAYMENT_LINK_URL);
    u.searchParams.set("Amt", total.toFixed(2));
    u.searchParams.set("Memo", `Order ${orderNo} pickup ${loc.name}`);
    u.searchParams.set("ShowMemo", "1");
    u.searchParams.set("CustomerName", customer.name);
    if (customer.email) u.searchParams.set("Email", customer.email);
    u.searchParams.set("Phone", customer.phone);
    u.searchParams.set("PONumber", orderNo);
    u.searchParams.set("ClientData", JSON.stringify({ orderNo, loc: loc.id, items: lines.map(l => l.qty + "x" + l.id) }).slice(0, 500));
    redirect = u.toString();
  } else {
    redirect = `${siteUrl}/order/thanks/?o=${encodeURIComponent(orderNo)}&pay=pickup`;
  }
  return json(200, { ok: true, orderNo, total, tender, notified, redirect });
};
