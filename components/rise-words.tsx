import { Fragment, type CSSProperties } from "react";

export const cssDelay = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties;

/**
 * Masked word-by-word rise in pure CSS, for headings above the fold: it starts on first
 * paint, so the heading never waits for JavaScript. (Below the fold, use <Words>.)
 */
export function RiseWords({ text, accent, start = 0.05, step = 0.06 }: { text: string; accent?: string; start?: number; step?: number }) {
  const at = accent ? text.indexOf(accent) : -1;
  const words =
    at < 0
      ? text.split(/\s+/).map((w) => ({ w, accent: false }))
      : [
          ...text.slice(0, at).split(/\s+/).filter(Boolean).map((w) => ({ w, accent: false })),
          ...accent!.split(/\s+/).filter(Boolean).map((w) => ({ w, accent: true })),
          ...text.slice(at + accent!.length).split(/\s+/).filter(Boolean).map((w) => ({ w, accent: false })),
        ];

  return words.map(({ w, accent: a }, i) => (
    <Fragment key={i}>
      <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
        <span className={`mask-rise inline-block ${a ? "text-honey" : ""}`} style={cssDelay(start + i * step)}>
          {w}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}
