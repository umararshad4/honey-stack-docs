import Link from "next/link";
import { site } from "@/lib/site";
import { LogoMark } from "./logo";
import { Words } from "./reveal";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/install", label: "Install" },
  { href: "/docs/skills", label: "Skills" },
  { href: site.repo, label: "GitHub" },
  { href: `${site.repo}/blob/main/CHANGELOG.md`, label: "Changelog" },
  { href: "/releases.xml", label: "Releases feed" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 pt-20 pb-12 sm:px-8">
        <p className="max-w-3xl text-3xl leading-[1.12] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-5xl">
          <Words text="Smallest complete change. Proof before done. Better every session." accent="Better every session." stagger={0.035} />
        </p>
        <nav aria-label="Footer" className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
          <Link href="/" className="flex items-center gap-2 text-ink" aria-label="honey-stack home">
            <LogoMark size={18} className="text-honey" />
            <span className="font-mono text-[13px]">honey-stack</span>
          </Link>
          {links.map((l) =>
            l.href.startsWith("/") && !l.href.endsWith(".xml") ? (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            ),
          )}
          <span className="sm:ml-auto">
            MIT © {site.author} ·{" "}
            <a href={site.docsRepo} className="transition-colors hover:text-ink">
              Edit these docs
            </a>
          </span>
        </nav>
      </div>
      {/* Decorative outline wordmark, drawn as generated content so it is never read as text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none -mb-[0.22em] text-center font-semibold tracking-[-0.06em] whitespace-nowrap text-paper-2 select-none [font-size:clamp(4rem,17vw,15rem)] [line-height:1] [-webkit-text-stroke:1px_var(--color-rule)] before:content-['honey-stack']"
      />
    </footer>
  );
}
