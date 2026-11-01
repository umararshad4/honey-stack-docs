#!/usr/bin/env node
// Crawls a running site the way the SeriusTech audit did and fails on any SEO regression.
// Usage: node scripts/seo-check.mjs [baseUrl]   (default http://localhost:3000)

const PROD = "https://honey-stack.vercel.app";
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const failures = [];
const warnings = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const toBase = (url) => url.replace(PROD, base);
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1].toLowerCase(), decode(m[2])]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => attrs(m[0]));
const meta = (html, key, value) => tags(html, "meta").find((t) => t[key] === value)?.content;

async function get(path, init) {
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const res = await fetch(url, { redirect: "manual", ...init });
  return { res, url, text: init?.method === "HEAD" ? "" : await res.text() };
}

const checked = new Map();
async function reachable(path) {
  if (checked.has(path)) return checked.get(path);
  const p = get(path, { method: "GET" }).then(({ res }) => res.status);
  checked.set(path, p);
  return p;
}

// 1. robots.txt and sitemap
const robots = await get("/robots.txt");
if (robots.res.status !== 200) fail("robots.txt", `HTTP ${robots.res.status}`);
if (!robots.text.includes(`Sitemap: ${PROD}/sitemap.xml`)) fail("robots.txt", "missing Sitemap line");
if (/Disallow:\s*\/\s*$/m.test(robots.text)) fail("robots.txt", "blocks the whole site");

const sitemap = await get("/sitemap.xml");
if (sitemap.res.status !== 200) fail("sitemap.xml", `HTTP ${sitemap.res.status}`);
const locs = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length === 0) fail("sitemap.xml", "no URLs");
if (!/<lastmod>/.test(sitemap.text)) warn("sitemap.xml", "no lastmod");

// 2. Every sitemap page
const titles = new Map();
const descriptions = new Map();
const rows = [];

for (const loc of locs) {
  const path = new URL(loc).pathname;
  const { res, text: html } = await get(toBase(loc));
  const where = path;
  if (res.status !== 200) {
    fail(where, `HTTP ${res.status}`);
    continue;
  }

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const description = meta(html, "name", "description") ?? "";
  const canonical = tags(html, "link").find((t) => t.rel === "canonical")?.href;
  const h1s = (html.match(/<h1\b/g) ?? []).length;
  const robotsMeta = meta(html, "name", "robots") ?? "";
  const lang = html.match(/<html[^>]*\blang="([^"]+)"/)?.[1];
  const og = Object.fromEntries(
    tags(html, "meta")
      .filter((t) => t.property?.startsWith("og:"))
      .map((t) => [t.property, t.content]),
  );
  const twitterCard = meta(html, "name", "twitter:card");

  if (!title) fail(where, "missing <title>");
  else if (title.length > 60) warn(where, `title is ${title.length} chars`);
  if (titles.has(title)) fail(where, `duplicate title (also ${titles.get(title)})`);
  titles.set(title, path);

  if (!description) fail(where, "missing meta description");
  else if (description.length < 70 || description.length > 160) warn(where, `description is ${description.length} chars`);
  if (descriptions.has(description)) fail(where, `duplicate description (also ${descriptions.get(description)})`);
  descriptions.set(description, path);

  if (h1s !== 1) fail(where, `${h1s} <h1> elements`);
  if (canonical !== loc) fail(where, `canonical ${canonical} ≠ ${loc}`);
  if (/noindex/i.test(robotsMeta)) fail(where, "noindex");
  if (lang !== "en") fail(where, `html lang=${lang}`);
  if (!tags(html, "meta").some((t) => t.name === "viewport")) fail(where, "missing viewport");

  for (const key of ["og:title", "og:description", "og:url", "og:image", "og:image:width", "og:image:height", "og:image:alt", "og:type"]) {
    if (!og[key]) fail(where, `missing ${key}`);
  }
  if (og["og:url"] && og["og:url"] !== loc) fail(where, `og:url ${og["og:url"]} ≠ ${loc}`);
  if (twitterCard !== "summary_large_image") fail(where, "twitter:card is not summary_large_image");
  if (og["og:image"]) {
    const img = await get(toBase(og["og:image"]), { method: "GET" });
    const type = img.res.headers.get("content-type") ?? "";
    if (img.res.status !== 200 || !type.startsWith("image/")) fail(where, `og:image ${og["og:image"]} → ${img.res.status} ${type}`);
  }

  const types = new Set();
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      for (const node of data["@graph"] ?? [data]) types.add(node["@type"]);
    } catch (e) {
      fail(where, `JSON-LD does not parse: ${e.message}`);
    }
  }
  const need = path === "/" ? ["WebSite", "SoftwareApplication", "FAQPage", "WebPage"] : ["WebSite", "TechArticle", "BreadcrumbList"];
  for (const t of need) if (!types.has(t)) fail(where, `JSON-LD missing ${t}`);

  const links = new Set(
    [...html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"/g)].map((m) => m[1]).filter((h) => !h.startsWith("//")),
  );
  for (const href of links) {
    const status = await reachable(href);
    if (status !== 200) fail(where, `internal link ${href} → ${status}`);
  }

  rows.push({ path, title: title.length, description: description.length, h1: h1s, jsonld: [...types].join(",") });
}

// 3. Unknown URLs must 404 and stay out of the index
const missing = await get("/this-page-does-not-exist");
if (missing.res.status !== 404) fail("404", `unknown URL returned ${missing.res.status}`);
if (!/<meta name="robots" content="[^"]*noindex/.test(missing.text)) fail("404", "missing noindex");

// 4. Machine-readable files
const llms = await get("/llms.txt");
if (llms.res.status !== 200 || !llms.text.startsWith("# honey-stack")) fail("llms.txt", `HTTP ${llms.res.status}`);
const rss = await get("/releases.xml");
if (rss.res.status !== 200 || !rss.text.includes("<rss")) fail("releases.xml", `HTTP ${rss.res.status}`);
const items = (rss.text.match(/<item>/g) ?? []).length;
if (items === 0) warn("releases.xml", "feed has no items (GitHub unreachable at build?)");
const manifest = await get("/manifest.webmanifest");
if (manifest.res.status !== 200) fail("manifest", `HTTP ${manifest.res.status}`);
else {
  for (const icon of JSON.parse(manifest.text).icons ?? []) {
    const status = await reachable(icon.src);
    if (status !== 200) fail("manifest", `icon ${icon.src} → ${status}`);
  }
}

// 5. Security headers
const home = await get("/");
for (const h of ["content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"]) {
  if (!home.res.headers.get(h)) fail("headers", `missing ${h}`);
}

console.table(rows);
console.log(`${locs.length} sitemap URLs · ${checked.size} internal links checked · ${items} feed items`);
for (const w of warnings) console.log(`warn  ${w}`);
for (const f of failures) console.log(`FAIL  ${f}`);
console.log(failures.length ? `\n${failures.length} SEO check(s) failed against ${base}` : `\nAll SEO checks passed against ${base}`);
process.exit(failures.length ? 1 : 0);
