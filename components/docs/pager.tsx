"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { flatDocs } from "@/lib/nav";
import { site } from "@/lib/site";

export function Pager() {
  const pathname = usePathname();
  const i = flatDocs.findIndex((d) => d.href === pathname);
  if (i === -1) return null;
  const prev = flatDocs[i - 1];
  const next = flatDocs[i + 1];

  return (
    <div className="mt-20 border-t border-rule pt-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={prev.href} className="group rounded-xl border border-rule p-4 transition-colors hover:border-rule-strong hover:bg-paper-2">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <ArrowLeft size={13} className="transition-transform duration-(--dur-short) group-hover:-translate-x-0.5" /> Previous
            </span>
            <span className="mt-1 block text-ink">{prev.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link href={next.href} className="group rounded-xl border border-rule p-4 text-right transition-colors hover:border-rule-strong hover:bg-paper-2">
            <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
              Next <ArrowRight size={13} className="transition-transform duration-(--dur-short) group-hover:translate-x-0.5" />
            </span>
            <span className="mt-1 block text-ink">{next.title}</span>
          </Link>
        )}
      </div>
      <p className="mt-6 text-xs text-muted">
        Source of truth:{" "}
        <a href={`${site.repo}/tree/main/docs`} className="underline decoration-rule-strong underline-offset-4 hover:text-ink">
          the honey-stack guides
        </a>
        . Spotted a gap? Open an issue.
      </p>
    </div>
  );
}
