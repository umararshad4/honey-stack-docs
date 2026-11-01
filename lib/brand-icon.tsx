import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

export const ICON_SIZES = [192, 512] as const;

/** The hex-and-drop mark on warm paper. Padding keeps it inside the maskable safe zone. */
export function brandIcon(size: number) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#17120c" }}>
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
          <path d="M12 2.2 20.5 7.1v9.8L12 21.8 3.5 16.9V7.1L12 2.2Z" stroke="#f3b544" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M12 7.6c1.9 2.3 3 4 3 5.4a3 3 0 0 1-6 0c0-1.4 1.1-3.1 3-5.4Z" fill="#f3b544" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}

export async function brandIconPng(size: number): Promise<ArrayBuffer> {
  "use cache";
  cacheLife("max");
  return brandIcon(size).arrayBuffer();
}
