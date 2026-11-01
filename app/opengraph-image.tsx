import { ImageResponse } from "next/og";

export const alt = "honey-stack — the agent toolkit that learns from you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori can't read CSS variables or oklch(), so these are the sRGB equivalents of the theme tokens.
const PAPER = "#15110c";
const INK = "#f6f1ea";
const MUTED = "#b3aa9e";
const HONEY = "#f3b544";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: `radial-gradient(900px 600px at 0% 0%, rgba(214,140,40,0.28), transparent 70%), ${PAPER}`,
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: HONEY }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.2 20.5 7.1v9.8L12 21.8 3.5 16.9V7.1L12 2.2Z" stroke={HONEY} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M12 7.6c1.9 2.3 3 4 3 5.4a3 3 0 0 1-6 0c0-1.4 1.1-3.1 3-5.4Z" fill={HONEY} />
          </svg>
          honey-stack
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>The agent toolkit that learns from you.</div>
          <div style={{ fontSize: 30, color: MUTED }}>~2 KB of always-on rules · 38 skills · RSI for Claude Code and Codex</div>
        </div>
      </div>
    ),
    size,
  );
}
