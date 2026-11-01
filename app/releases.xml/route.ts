import { getReleases } from "@/lib/github";
import { site } from "@/lib/site";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** RSS feed of honey-stack releases, refreshed with the cached GitHub release list. */
export async function GET() {
  const releases = await getReleases(20);
  const items = releases
    .map(
      (r) => `    <item>
      <title>${escape(`honey-stack ${r.tag}`)}</title>
      <link>${escape(r.url)}</link>
      <guid isPermaLink="true">${escape(r.url)}</guid>
      ${r.date ? `<pubDate>${new Date(r.date).toUTCString()}</pubDate>` : ""}
      <description>${escape(r.summary || `Release ${r.tag}`)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>honey-stack releases</title>
    <link>${site.url}</link>
    <atom:link href="${site.url}/releases.xml" rel="self" type="application/rss+xml"/>
    <description>Every honey-stack release, published automatically after a green merge to main.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
