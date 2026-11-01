#!/usr/bin/env node
// Tells IndexNow engines (Bing, Yandex, Seznam, Naver…) which URLs changed. Run after a deploy:
//   node scripts/indexnow.mjs            # every URL in the live sitemap
import { readdirSync } from "node:fs";

const SITE = "https://honey-stack.vercel.app";
const keyFile = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file in public/");
const key = keyFile.replace(".txt", "");

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
process.exit(res.ok ? 0 : 1);
