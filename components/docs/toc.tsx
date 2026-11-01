"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

/** "On this page": reads h2[id] from the rendered article and tracks the one in view. */
export function Toc() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const article = document.getElementById("doc-article");
    if (!article) return;
    const nodes = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2[id]"));
    const frame = requestAnimationFrame(() => {
      setHeadings(nodes.map((n) => ({ id: n.id, text: (n.textContent ?? "").replace(/#$/, "").trim() })));
      setActive(nodes[0]?.id ?? "");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="sticky top-24">
      <p className="font-mono text-[11px] tracking-wide text-faint uppercase">On this page</p>
      <ul className="mt-3 space-y-0.5 border-l border-rule">
        {headings.map((h) => (
          <li key={h.id} className="relative">
            {active === h.id && (
              <motion.span
                layoutId="toc-active"
                className="absolute top-0 bottom-0 -left-px w-px bg-honey"
                transition={{ type: "spring", stiffness: 400, damping: 36 }}
              />
            )}
            <a
              href={`#${h.id}`}
              className={`block py-1 pl-3 text-[13px] leading-snug transition-colors duration-(--dur-short) ${
                active === h.id ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
