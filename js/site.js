/* Zamani Grill & Market — shared behavior: language, cart, menu controls, hours, reveal.
   No framework. Everything degrades: the menu, prices and locations are already in the HTML. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const money = n => "$" + (Math.round(n * 100) / 100).toFixed(2);
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const TAX = Number(document.documentElement.dataset.tax || 0.0825);

  /* ---------------- language ---------------- */
  const LANGS = {
    en: { native: "English", dir: "ltr" },
    ar: { native: "العربية", dir: "rtl", font: "Noto+Naskh+Arabic:wght@400;600" },
    fa: { native: "فارسی", dir: "rtl", font: "Vazirmatn:wght@400;600" },
    ur: { native: "اردو", dir: "rtl", font: "Noto+Nastaliq+Urdu:wght@400;600" },
    hi: { native: "हिन्दी", dir: "ltr", font: "Noto+Sans+Devanagari:wght@400;600" }
  };
  const strings = { en: null };
  let lang = "en";

  function fontFor(code) {
    const f = LANGS[code] && LANGS[code].font; if (!f) return;
    const id = "font-" + code; if (document.getElementById(id)) return;
    const l = document.createElement("link"); l.id = id; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=" + f + "&display=swap"; document.head.appendChild(l);
  }
  async function loadStrings(code) {
    if (strings[code]) return strings[code];
    try {
      const r = await fetch("/content/i18n/" + code + ".json", { cache: "force-cache" });
      if (!r.ok) throw 0; strings[code] = await r.json(); return strings[code];
    } catch { return null; }
  }
  function t(key, fallback) {
    const s = strings[lang]; if (s && s[key] != null) return s[key];
    const e = strings.en; if (e && e[key] != null) return e[key];
    return fallback != null ? fallback : key;
  }
  function applyStrings() {
    $$("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n; const val = t(key, null); if (val == null) return;
      if (el.dataset.i18nHtml != null) el.innerHTML = val; else el.textContent = val;
    });
    $$("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(",").forEach(pair => {
        const [attr, key] = pair.split(":"); const val = t(key.trim(), null); if (val != null) el.setAttribute(attr.trim(), val);
      });
    });
    const pt = document.querySelector("title"); if (pt && pt.dataset.i18n) document.title = t(pt.dataset.i18n, document.title);
    document.dispatchEvent(new CustomEvent("zamani:lang", { detail: { lang } }));
  }
  async function setLang(code, persist = true) {
    if (!LANGS[code]) code = "en";
    if (!strings.en) { strings.en = snapshotEnglish(); }
    if (code !== "en") { fontFor(code); const s = await loadStrings(code); if (!s) code = "en"; }
    lang = code;
    const html = document.documentElement; html.lang = code; html.dir = LANGS[code].dir;
    if (persist) ls.set("zamani-lang", code);
    $$(".lang-menu button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === code)));
    const cur = $(".lang > summary .cur"); if (cur) cur.textContent = code.toUpperCase();
    applyStrings();
    const d = $(".lang"); if (d) d.open = false;
  }
  function snapshotEnglish() {
    const s = {};
    $$("[data-i18n]").forEach(el => { s[el.dataset.i18n] = el.dataset.i18nHtml != null ? el.innerHTML : el.textContent; });
    $$("[data-i18n-attr]").forEach(el => { el.dataset.i18nAttr.split(",").forEach(p => { const [a, k] = p.split(":"); s[k.trim()] = el.getAttribute(a.trim()); }); });
    const pt = document.querySelector("title"); if (pt && pt.dataset.i18n) s[pt.dataset.i18n] = document.title;
    return s;
  }
  function initLang() {
    const d = $(".lang"); if (!d) return;
    const menu = $(".lang-menu", d);
    Object.entries(LANGS).forEach(([code, L]) => {
      const b = document.createElement("button"); b.type = "button"; b.dataset.lang = code; b.lang = code; b.dir = L.dir;
      b.innerHTML = '<span class="native">' + L.native + '</span><span class="code">' + code.toUpperCase() + "</span>";
      b.addEventListener("click", () => setLang(code)); menu.appendChild(b);
    });
    document.addEventListener("click", e => { if (d.open && !d.contains(e.target)) d.open = false; });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && d.open) d.open = false; });
    const url = new URLSearchParams(location.search).get("lang");
    const saved = ls.get("zamani-lang", null);
    const pick = url || saved || "en";
    if (pick !== "en") setLang(pick, !!url || !!saved); else { strings.en = snapshotEnglish(); $$(".lang-menu button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === "en"))); }
  }

  /* ---------------- cart ---------------- */
  const cart = {
    key: "zamani-cart",
    state: ls.get("zamani-cart", { items: [], location: "louetta" }),
    save() { ls.set(this.key, this.state); render.all(); },
    lineKey(item, variant, choices) { return [item.id, variant && variant.label, JSON.stringify(choices || {})].join("|"); },
    add(item, { variant = null, choices = {}, qty = 1 } = {}) {
      const unit = variant ? variant.price : item.price;
      const key = this.lineKey(item, variant, choices);
      const ex = this.state.items.find(l => l.key === key);
      if (ex) ex.qty += qty; else this.state.items.push({ key, id: item.id, name: item.name, variant: variant ? variant.label : null, choices, qty, unit, kind: item.kind || "menu", minQty: item.minQty || 1, est: !!item.est });
      this.save(); return key;
    },
    setQty(key, qty) {
      const l = this.state.items.find(x => x.key === key); if (!l) return;
      if (qty < (l.minQty || 1)) { if (qty <= 0 || qty < l.minQty) { this.state.items = this.state.items.filter(x => x.key !== key); } }
      else l.qty = qty;
      this.save();
    },
    remove(key) { this.state.items = this.state.items.filter(x => x.key !== key); this.save(); },
    clear() { this.state.items = []; this.save(); },
    count() { return this.state.items.reduce((n, l) => n + l.qty, 0); },
    subtotal() { return this.state.items.reduce((n, l) => n + l.unit * l.qty, 0); },
    tax() { return this.subtotal() * TAX; },
    total() { return this.subtotal() + this.tax(); }
  };
  window.ZamaniCart = cart;

  const render = {
    all() { this.count(); this.ticket(); this.bar(); this.summary(); },
    count() {
      const n = cart.count();
      $$(".cartbtn .count").forEach(el => { el.textContent = n; });
      $$(".cartbtn").forEach(b => { b.classList.remove("bump"); void b.offsetWidth; if (n) b.classList.add("bump"); });
    },
    lines(container, editable) {
      container.innerHTML = "";
      if (!cart.state.items.length) { container.innerHTML = '<p class="ticket-empty" data-i18n="cart.empty">' + t("cart.empty", "Nothing on your ticket yet. Add something from the menu.") + "</p>"; return; }
      cart.state.items.forEach(l => {
        const div = document.createElement("div"); div.className = "line";
        const meta = [l.variant, ...Object.entries(l.choices || {}).map(([k, v]) => v)].filter(Boolean).join(" · ");
        div.innerHTML = '<div class="name">' + esc(l.name) + "</div>" +
          '<div class="price' + (l.est ? " est" : "") + '">' + money(l.unit * l.qty) + "</div>" +
          (meta ? '<div class="meta">' + esc(meta) + "</div>" : "") +
          (editable ? '<div class="ctl"><div class="qty"><button type="button" data-dec aria-label="' + t("cart.less", "Fewer") + '">−</button><output>' + l.qty + '</output><button type="button" data-inc aria-label="' + t("cart.more", "More") + '">+</button></div>' +
            '<button type="button" class="rm" data-rm aria-label="' + t("cart.remove", "Remove") + '"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>'
            : '<div class="meta">× ' + l.qty + "</div>");
        if (editable) {
          $("[data-dec]", div).addEventListener("click", () => cart.setQty(l.key, l.qty - 1));
          $("[data-inc]", div).addEventListener("click", () => cart.setQty(l.key, l.qty + 1));
          $("[data-rm]", div).addEventListener("click", () => cart.remove(l.key));
        }
        container.appendChild(div);
      });
    },
    totals(el) {
      if (!el) return;
      const est = cart.state.items.some(l => l.est);
      el.innerHTML = '<div><span data-i18n="cart.subtotal">' + t("cart.subtotal", "Subtotal") + "</span><span class=\"price\">" + money(cart.subtotal()) + "</span></div>" +
        '<div><span>' + t("cart.tax", "Sales tax") + ' <small>(' + (TAX * 100).toFixed(2).replace(/\.?0+$/, "") + "%)</small></span><span class=\"price\">" + money(cart.tax()) + "</span></div>" +
        '<div class="grand"><span data-i18n="cart.total">' + t("cart.total", "Total") + "</span><span class=\"price\">" + money(cart.total()) + "</span></div>" +
        (est ? '<small>' + t("cart.estNote", "~ Market prices are estimates until confirmed at pickup.") + "</small>" : "");
    },
    ticket() {
      const tk = $(".ticket"); if (!tk) return;
      this.lines($(".ticket-body", tk), true); this.totals($(".totals", tk));
      const go = $(".ticket-foot .btn", tk); if (go) go.toggleAttribute("disabled", !cart.state.items.length);
    },
    bar() {
      const bar = $(".orderbar"); if (!bar) return;
      const n = cart.count(); bar.toggleAttribute("data-show", n > 0 && !document.body.classList.contains("page-checkout"));
      const s = $(".sum", bar); if (s) s.innerHTML = money(cart.total()) + "<small>" + n + " " + t(n === 1 ? "cart.item" : "cart.items", n === 1 ? "item" : "items") + " · " + t("cart.pickup", "pickup") + "</small>";
    },
    summary() {
      const sm = $(".summary"); if (!sm) return;
      this.lines($(".summary-lines", sm), true); this.totals($(".totals", sm));
    }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function openTicket(open) {
    const tk = $(".ticket"), sc = $(".scrim"); if (!tk) return;
    tk.toggleAttribute("data-open", open); sc && sc.toggleAttribute("data-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { const c = $(".ticket .close"); c && c.focus(); }
  }
  function toast(msg) {
    let el = $(".toast"); if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.setAttribute("data-show", ""); clearTimeout(el._t); el._t = setTimeout(() => el.removeAttribute("data-show"), 1800);
  }

  /* ---------------- dish rows ---------------- */
  function initDishes() {
    $$("[data-item]").forEach(row => {
      let item; try { item = JSON.parse(row.dataset.item); } catch { return; }
      const add = $(".add", row); if (!add) return;
      const needsConfig = (item.variants && item.variants.length) || (item.choices && item.choices.length) || item.minQty > 1;
      add.addEventListener("click", () => {
        if (!needsConfig) { cart.add(item); pressed(add); toast(t("cart.added", "Added to your ticket")); return; }
        let cfg = $(".config", row);
        if (!cfg) { cfg = buildConfig(item, row, add); row.appendChild(cfg); }
        const open = cfg.hidden; $$(".config").forEach(c => { c.hidden = true; }); cfg.hidden = !open;
        if (!cfg.hidden) { const f = cfg.querySelector("input"); f && f.focus(); }
      });
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") $$(".config").forEach(c => c.hidden = true); });
  }
  function pressed(btn) { btn.classList.add("pressed"); setTimeout(() => btn.classList.remove("pressed"), 700); }
  function buildConfig(item, row, addBtn) {
    const cfg = document.createElement("div"); cfg.className = "config"; cfg.hidden = true;
    const uid = "cfg-" + item.id + "-" + Math.random().toString(36).slice(2, 7);
    let html = "";
    if (item.variants && item.variants.length) {
      html += '<div><h4>' + t("cfg.size", "Size") + '</h4><div class="group">' + item.variants.map((v, i) =>
        '<label class="choice"><input type="radio" name="' + uid + '-v" value="' + i + '"' + (i === 0 ? " checked" : "") + '><span>' + esc(v.label) + ' <b class="price">' + money(v.price) + "</b></span></label>").join("") + "</div></div>";
    }
    (item.choices || []).forEach((g, gi) => {
      html += '<div><h4>' + esc(g.label) + '</h4><div class="group">' + g.options.map((o, i) =>
        '<label class="choice"><input type="radio" name="' + uid + "-c" + gi + '" value="' + esc(o) + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(o) + "</span></label>").join("") + "</div></div>";
    });
    const min = item.minQty || 1;
    html += '<div class="config-foot"><div class="qty"><button type="button" data-dec aria-label="' + t("cart.less", "Fewer") + '">−</button><output>' + min + '</output><button type="button" data-inc aria-label="' + t("cart.more", "More") + '">+</button></div>' +
      (min > 1 ? '<span class="err" style="color:var(--muted)">' + t("cfg.min", "Minimum") + " " + min + "</span>" : "") +
      '<button type="button" class="btn" data-confirm>' + t("cfg.add", "Add to ticket") + " · <span class=\"price\"></span></button></div>";
    cfg.innerHTML = html;
    const out = $("output", cfg), priceEl = $("[data-confirm] .price", cfg);
    const current = () => {
      const vi = $("input[name='" + uid + "-v']:checked", cfg); const variant = vi ? item.variants[Number(vi.value)] : null;
      const choices = {}; (item.choices || []).forEach((g, gi) => { const c = $("input[name='" + uid + "-c" + gi + "']:checked", cfg); if (c) choices[g.label] = c.value; });
      const qty = Number(out.value || out.textContent); return { variant, choices, qty };
    };
    const refresh = () => { const { variant, qty } = current(); priceEl.textContent = money((variant ? variant.price : item.price) * qty); };
    cfg.addEventListener("change", refresh);
    $("[data-dec]", cfg).addEventListener("click", () => { out.textContent = Math.max(min, Number(out.textContent) - 1); refresh(); });
    $("[data-inc]", cfg).addEventListener("click", () => { out.textContent = Number(out.textContent) + 1; refresh(); });
    $("[data-confirm]", cfg).addEventListener("click", () => {
      const { variant, choices, qty } = current(); cart.add(item, { variant, choices, qty }); pressed(addBtn); cfg.hidden = true; out.textContent = min; refresh();
      toast(t("cart.added", "Added to your ticket"));
    });
    refresh(); return cfg;
  }

  /* ---------------- hours / open now ---------------- */
  function initHours() {
    const els = $$("[data-open-now]"); if (!els.length) return;
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
    const day = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][now.getDay()]; const mins = now.getHours() * 60 + now.getMinutes();
    els.forEach(el => {
      let rules; try { rules = JSON.parse(el.dataset.openNow); } catch { return; }
      const r = rules.find(x => x.dayCodes.includes(day)); if (!r) return;
      const [oh, om] = r.open.split(":").map(Number), [ch, cm] = r.close.split(":").map(Number);
      const open = mins >= oh * 60 + om && mins < ch * 60 + cm;
      const fmt = h => { const d = new Date(); d.setHours(...h.split(":").map(Number), 0, 0); return d.toLocaleTimeString(lang === "en" ? "en-US" : undefined, { hour: "numeric", minute: "2-digit" }); };
      el.innerHTML = open ? '<span class="open">' + t("hours.openNow", "Open now") + "</span> · " + t("hours.until", "until") + " " + fmt(r.close)
        : '<span class="closed">' + t("hours.closedNow", "Closed now") + "</span> · " + t("hours.opens", "opens") + " " + fmt(r.open);
    });
  }

  /* ---------------- menu side nav ---------------- */
  function initCourseNav() {
    const links = $$(".menu-aside nav a, .course-nav a"); if (!links.length) return;
    const map = new Map(); links.forEach(a => { const id = a.getAttribute("href").slice(1); const sec = document.getElementById(id); if (sec) map.set(sec, a); });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { links.forEach(l => l.classList.remove("active")); const a = map.get(en.target); if (a) { links.filter(l => l.getAttribute("href") === a.getAttribute("href")).forEach(l => l.classList.add("active")); } } });
    }, { rootMargin: "-30% 0px -60% 0px" });
    map.forEach((a, sec) => io.observe(sec));
  }

  /* ---------------- reveal ---------------- */
  function initReveal() {
    const els = $$(".rv"); if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach(e => io.observe(e));
  }

  /* ---------------- checkout ---------------- */
  function initCheckout() {
    const form = $("#checkout"); if (!form) return;
    document.body.classList.add("page-checkout");
    const loc = cart.state.location; const r = form.querySelector("input[name=location][value='" + loc + "']"); if (r) r.checked = true;
    form.addEventListener("change", e => { if (e.target.name === "location") { cart.state.location = e.target.value; cart.save(); } });
    const payOnline = form.querySelector("input[name=tender][value=online]");
    if (payOnline && form.dataset.paymentsEnabled !== "true") { payOnline.disabled = true; const card = payOnline.closest(".radio-card"); if (card) card.style.opacity = ".5"; const pk = form.querySelector("input[name=tender][value=pickup]"); if (pk) pk.checked = true; }
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!cart.state.items.length) { toast(t("checkout.emptyErr", "Your ticket is empty.")); return; }
      let ok = true;
      $$(".field", form).forEach(f => f.classList.remove("invalid"));
      ["name", "phone"].forEach(n => { const i = form.elements[n]; if (!i.value.trim()) { ok = false; i.closest(".field").classList.add("invalid"); } });
      const phone = form.elements.phone.value.replace(/\D/g, ""); if (phone.length < 10) { ok = false; form.elements.phone.closest(".field").classList.add("invalid"); }
      if (!ok) { const first = $(".field.invalid input", form); first && first.focus(); return; }
      const btn = $("button[type=submit]", form); btn.classList.add("loading"); btn.disabled = true;
      const fd = new FormData(form);
      const payload = {
        customer: { name: fd.get("name"), phone: fd.get("phone"), email: fd.get("email") || "" },
        location: fd.get("location"), pickup: fd.get("pickup"), tender: fd.get("tender"), notes: fd.get("notes") || "",
        items: cart.state.items.map(l => ({ id: l.id, kind: l.kind, variant: l.variant, choices: l.choices, qty: l.qty })),
        lang, page: location.href
      };
      try {
        // 1) log the order to Netlify Forms (zero-cost record in the Netlify UI)
        const logBody = new URLSearchParams({ "form-name": "orders", name: payload.customer.name, phone: payload.customer.phone, email: payload.customer.email, location: payload.location, pickup: payload.pickup, tender: payload.tender, notes: payload.notes, items: cart.state.items.map(l => l.qty + "× " + l.name + (l.variant ? " (" + l.variant + ")" : "")).join("; "), total: money(cart.total()) });
        fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: logBody }).catch(() => {});
        // 2) hand to the order function (server-side pricing, kitchen notice, payment link)
        const res = await fetch("/.netlify/functions/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.redirect) throw new Error(data.error || "order-failed");
        ls.set("zamani-last-order", { no: data.orderNo, total: data.total, items: cart.state.items, location: payload.location, pickup: payload.pickup, tender: payload.tender, at: Date.now() });
        cart.clear();
        location.href = data.redirect;
      } catch (err) {
        btn.classList.remove("loading"); btn.disabled = false;
        const box = $("#checkout-error"); if (box) { box.hidden = false; box.textContent = t("checkout.failed", "We couldn't send your order. Please call the restaurant and we'll take it by phone.") + " (" + (err.message || "error") + ")"; box.focus(); }
      }
    });
  }
  function initThanks() {
    const el = $("[data-last-order]"); if (!el) return;
    const o = ls.get("zamani-last-order", null); const q = new URLSearchParams(location.search);
    const no = q.get("o") || (o && o.no); if (no) $$("[data-order-no]").forEach(x => x.textContent = no);
    if (o && o.items) { const list = $("[data-order-items]"); if (list) list.innerHTML = o.items.map(l => "<div><span>" + l.qty + "× " + esc(l.name) + (l.variant ? " (" + esc(l.variant) + ")" : "") + "</span><span class=\"price\">" + money(l.unit * l.qty) + "</span></div>").join(""); const tot = $("[data-order-total]"); if (tot) tot.textContent = money(o.total || 0); }
  }

  /* ---------------- wire up ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initLang(); initDishes(); initHours(); initCourseNav(); initReveal(); initCheckout(); initThanks(); render.all();
    $$("[data-open-ticket]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openTicket(true); }));
    const tk = $(".ticket"); if (tk) { $(".close", tk).addEventListener("click", () => openTicket(false)); }
    const sc = $(".scrim"); if (sc) sc.addEventListener("click", () => openTicket(false));
    document.addEventListener("keydown", e => { if (e.key === "Escape") openTicket(false); });
    document.addEventListener("zamani:lang", () => { render.all(); initHours(); });
    window.addEventListener("storage", e => { if (e.key === cart.key) { cart.state = ls.get(cart.key, cart.state); render.all(); } });
  });
})();
