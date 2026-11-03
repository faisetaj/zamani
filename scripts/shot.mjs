#!/usr/bin/env node
// Full-page screenshots with real device emulation via the Chrome DevTools Protocol. No dependencies.
// node scripts/shot.mjs <out.png> <url> [--w 390] [--h 844] [--mobile] [--scale 2] [--eval "js"] [--wait 1200] [--settle]
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const out = args[0], url = args[1];
const opt = (k, d) => { const i = args.indexOf("--" + k); return i > -1 ? args[i + 1] : d; };
const flag = k => args.includes("--" + k);
const W = Number(opt("w", 1440)), H = Number(opt("h", 900)), SCALE = Number(opt("scale", 1)), MOBILE = flag("mobile");
const EVAL = opt("eval", null), WAIT = Number(opt("wait", 1500)), SETTLE = flag("settle"), VIEWPORT = flag("viewport");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9300 + Math.floor(Math.random() * 500);

const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check", `--remote-debugging-port=${PORT}`, "--user-data-dir=/tmp/zamani-shot-" + PORT, "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function waitPort() { for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) return r.json(); } catch {} await sleep(150); } throw new Error("chrome did not start"); }

try {
  await waitPort();
  const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const events = [];
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else if (m.method) events.push(m); };
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: SCALE, mobile: MOBILE, screenWidth: W, screenHeight: H });
  if (MOBILE) await send("Emulation.setTouchEmulationEnabled", { enabled: true });
  if (MOBILE) await send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" });
  await send("Page.navigate", { url });
  // wait for load + fonts
  for (let i = 0; i < 100; i++) { if (events.some(e => e.method === "Page.loadEventFired")) break; await sleep(100); }
  await send("Runtime.evaluate", { expression: "document.fonts ? document.fonts.ready.then(()=>1) : 1", awaitPromise: true });
  if (SETTLE) await send("Runtime.evaluate", { expression: "document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));document.querySelectorAll('.lattice path').forEach(p=>{p.style.animation='none';p.style.strokeDashoffset='0'});1" });
  if (EVAL) { const r = await send("Runtime.evaluate", { expression: EVAL, awaitPromise: true, returnByValue: true }); if (r.result && r.result.exceptionDetails) console.error("eval error:", JSON.stringify(r.result.exceptionDetails.exception)); else if (r.result && r.result.result && r.result.result.value !== undefined) console.log("eval →", JSON.stringify(r.result.result.value)); }
  await sleep(WAIT);
  const metrics = await send("Page.getLayoutMetrics");
  const css = metrics.result.cssContentSize || metrics.result.contentSize;
  const fullH = VIEWPORT ? H : Math.ceil(css.height);
  const scrollW = (await send("Runtime.evaluate", { expression: "document.documentElement.scrollWidth", returnByValue: true })).result.result.value;
  console.log(`${out}: viewport ${W}x${H}, document ${Math.ceil(css.width)}x${fullH}, scrollWidth ${scrollW}${scrollW > W ? "  ⚠ HORIZONTAL OVERFLOW" : ""}`);
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: !VIEWPORT, clip: { x: 0, y: 0, width: W, height: fullH, scale: 1 } });
  writeFileSync(out, Buffer.from(shot.result.data, "base64"));
  ws.close();
} catch (e) { console.error(e); process.exitCode = 1; }
finally { chrome.kill("SIGKILL"); }
