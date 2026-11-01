"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { docsNav, flatDocs } from "@/lib/nav";

function NavList({ layoutKey, onNavigate }: { layoutKey: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="space-y-7">
      {docsNav.map((group) => (
        <div key={group.label}>
          <p className="px-3 font-mono text-[11px] tracking-wide text-faint uppercase">{group.label}</p>
          <ul className="mt-2 space-y-0.5">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-lg px-3 py-1.5 text-[14px] transition-colors duration-(--dur-short) ${
                      active ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={`${layoutKey}-active`}
                        className="absolute inset-0 rounded-lg bg-paper-3"
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      >
                        <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-honey" />
                      </motion.span>
                    )}
                    <span className="relative">{link.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Sidebar() {
  return (
    <nav aria-label="Documentation" className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 pb-10" data-lenis-prevent="">
      <NavList layoutKey="sidebar" />
    </nav>
  );
}

export function MobileDocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = flatDocs.find((d) => d.href === pathname);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="mb-8 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-docs-nav"
        className="flex w-full items-center justify-between rounded-xl border border-rule bg-paper-2 px-4 py-3 text-left text-sm"
      >
        <span className="min-w-0 truncate">
          <span className="text-muted">Docs / </span>
          <span className="text-ink">{current?.title ?? "Menu"}</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="text-muted">
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-docs-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 rounded-xl border border-rule bg-paper-2 p-3"
          >
            <NavList layoutKey="mobile" onNavigate={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
