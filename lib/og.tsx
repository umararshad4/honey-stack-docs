import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { cacheLife } from "next/cache";
import { OG_SIZE, pageForOgSlug, sectionOf } from "./seo";

// Satori can't read CSS variables or oklch(); these are the sRGB equivalents of the theme tokens.
const C = { paper: "#15110c", rule: "#3a3127", ink: "#f6f1ea", muted: "#b3aa9e", faint: "#7d7368", honey: "#f3b544" };

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

/** Hex outlines across the right edge, brightening toward a honey cluster. */
function Honeycomb() {
  const r = 34;
  const dx = Math.sqrt(3) * r;
  const dy = 1.5 * r;
  const cells: { x: number; y: number; d: number }[] = [];
  for (let row = -1; row * dy < OG_SIZE.height + r; row++) {
    for (let x = 640 + (row % 2 ? dx / 2 : 0); x < OG_SIZE.width + dx; x += dx) {
      const y = row * dy;
      cells.push({ x, y, d: Math.hypot(x - 1010, y - 250) });
    }
  }
  const hex = (x: number, y: number, s: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${i ? "L" : "M"}${(x + s * Math.cos(a)).toFixed(1)} ${(y + s * Math.sin(a)).toFixed(1)}`;
    }).join(" ") + "Z";

  return (
    <svg width={OG_SIZE.width} height={OG_SIZE.height} style={{ position: "absolute", top: 0, left: 0 }}>
      {cells.map((c, i) => {
        const glow = Math.max(0, 1 - c.d / 300);
        const edge = Math.min(1, (c.x - 640) / 260);
        return (
          <path
            key={i}
            d={hex(c.x, c.y, r - 3)}
            fill={C.honey}
            fillOpacity={glow > 0.55 ? glow * 0.32 : 0}
            stroke={glow > 0.25 ? C.honey : C.rule}
            strokeOpacity={glow > 0.25 ? 0.25 + glow * 0.6 : 0.9 * edge}
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}

async function render(slug: string): Promise<ArrayBuffer | null> {
  "use cache";
  cacheLife("max");

  const page = pageForOgSlug(slug);
  if (!page) return null;
  const isHome = page.path === "/";
  const kicker = isHome ? "Claude Code · Codex" : `Docs · ${sectionOf(page.path) ?? "Guide"}`;
  const heading = isHome ? "The agent toolkit that learns from you." : page.name;
  const lede = isHome ? "~2 KB of rules · 38 skills · RSI that ships its own upgrades" : page.description;
  const [semibold, regular, mono] = await Promise.all([
    font("Geist-SemiBold.ttf"),
    font("Geist-Regular.ttf"),
    font("GeistMono-Medium.ttf"),
  ]);

  const response = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `radial-gradient(1000px 640px at 0% 0%, rgba(214,140,40,0.26), rgba(21,17,12,0) 70%), ${C.paper}`,
          color: C.ink,
          fontFamily: "Geist",
        }}
      >
        <Honeycomb />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", width: "100%", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.2 20.5 7.1v9.8L12 21.8 3.5 16.9V7.1L12 2.2Z" stroke={C.honey} strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M12 7.6c1.9 2.3 3 4 3 5.4a3 3 0 0 1-6 0c0-1.4 1.1-3.1 3-5.4Z" fill={C.honey} />
            </svg>
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 30, color: C.ink }}>honey-stack</div>
            <div
              style={{
                display: "flex",
                marginLeft: 12,
                padding: "6px 16px",
                border: `1.5px solid ${C.rule}`,
                borderRadius: 999,
                fontFamily: "Geist Mono",
                fontSize: 20,
                color: C.honey,
              }}
            >
              {kicker}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: isHome ? 860 : 780 }}>
            <div style={{ display: "flex", fontSize: isHome ? 80 : 84, fontWeight: 600, letterSpacing: -3, lineHeight: 1.02 }}>{heading}</div>
            <div style={{ display: "flex", fontSize: 29, lineHeight: 1.4, color: C.muted }}>{lede}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Geist Mono", fontSize: 22, color: C.faint }}>
            <div style={{ display: "flex", width: 10, height: 10, borderRadius: 999, background: C.honey }} />
            {`honey-stack.vercel.app${isHome ? "" : page.path}`}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
  return response.arrayBuffer();
}

export async function ogResponse(slug: string) {
  const png = await render(slug);
  if (!png) return new Response("Not found", { status: 404 });
  return new Response(png, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
