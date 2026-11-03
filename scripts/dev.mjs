#!/usr/bin/env node
// Local preview that behaves like Netlify: clean URLs from netlify.toml, static files, and the two functions.
// Usage: node scripts/dev.mjs [port]   → http://localhost:8787
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.argv[2] || process.env.PORT || 8787);
const require = createRequire(import.meta.url);
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon", ".woff2": "font/woff2" };

// Parse the simple redirects we use from netlify.toml (from/to/status, no wildcards beyond trailing *).
const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");
const redirects = [...toml.matchAll(/\[\[redirects\]\]\s*\n\s*from = "([^"]+)"\s*\n\s*to = "([^"]+)"\s*\n\s*status = (\d+)/g)].map(m => ({ from: m[1], to: m[2], status: Number(m[3]) })).filter(r => !r.from.startsWith("http"));
function matchRedirect(path) {
  for (const r of redirects) {
    if (r.from.endsWith("/*")) { const base = r.from.slice(0, -1); if (path.startsWith(base)) return r; }
    else if (r.from === path) return r;
  }
  return null;
}
function sendFile(res, file, status = 200) {
  const ext = extname(file); res.writeHead(status, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": "no-store" }); res.end(readFileSync(file));
}
function readBody(req) { return new Promise(r => { let b = ""; req.on("data", c => b += c); req.on("end", () => r(b)); }); }

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x"); let path = decodeURIComponent(url.pathname);
  // functions
  const fn = path.match(/^\/\.netlify\/functions\/([a-z0-9-]+)$/);
  if (fn) {
    try {
      const mod = require(join(ROOT, "netlify", "functions", fn[1] + ".js"));
      const out = await mod.handler({ httpMethod: req.method, headers: { ...req.headers, origin: "http://localhost:" + PORT }, queryStringParameters: Object.fromEntries(url.searchParams), body: await readBody(req) });
      res.writeHead(out.statusCode || 200, out.headers || { "Content-Type": "application/json" }); res.end(out.body);
    } catch (e) { console.error(e); res.writeHead(500); res.end(JSON.stringify({ error: String(e.message) })); }
    return;
  }
  // Netlify Forms stand-in
  if (req.method === "POST" && path === "/") { const b = await readBody(req); console.log("[form]", b.slice(0, 300)); res.writeHead(200); res.end("ok"); return; }
  if (req.method === "POST" && path.startsWith("/order/thanks")) { const b = await readBody(req); console.log("[catering form]", b.slice(0, 300)); res.writeHead(303, { Location: req.url }); res.end(); return; }
  const r = matchRedirect(path);
  if (r) { if (r.status === 200) path = r.to; else { res.writeHead(r.status, { Location: r.to }); res.end(); return; } }
  let file = join(ROOT, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) && existsSync(file + ".html")) file = file + ".html";
  if (!existsSync(file)) { sendFile(res, join(ROOT, "404.html"), 404); return; }
  sendFile(res, file);
}).listen(PORT, () => console.log("zamani dev → http://localhost:" + PORT));
