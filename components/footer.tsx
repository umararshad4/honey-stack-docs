import Link from "next/link";
import { site } from "@/lib/site";
import { LogoMark } from "./logo";

export function Footer() {
  return (
    <footer className="relative border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <p className="max-w-2xl text-2xl leading-snug font-medium tracking-tight text-balance text-ink sm:text-3xl">
          Smallest complete change. Proof before done.{" "}
          <span className="text-muted">Better every session.</span>
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
          <span className="flex items-center gap-2 text-ink">
            <LogoMark size={18} className="text-honey" />
            <span className="font-mono text-[13px]">honey-stack</span>
          </span>
          <Link href="/docs" className="transition-colors hover:text-ink">Docs</Link>
          <Link href="/docs/install" className="transition-colors hover:text-ink">Install</Link>
          <a href={site.repo} className="transition-colors hover:text-ink">GitHub</a>
          <a href={`${site.repo}/blob/main/CHANGELOG.md`} className="transition-colors hover:text-ink">Changelog</a>
          <span className="sm:ml-auto">MIT © {site.author}</span>
        </div>
      </div>
    </footer>
  );
}
