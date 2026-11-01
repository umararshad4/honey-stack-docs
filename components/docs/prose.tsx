import Link from "next/link";
import type { ReactNode } from "react";
import { CONTENT_UPDATED, pageSeo } from "@/lib/seo";
import { docGraph } from "@/lib/structured-data";
import { JsonLd } from "../json-ld";
import { RiseWords } from "../rise-words";

const updated = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
  new Date(`${CONTENT_UPDATED}T00:00:00Z`),
);

/** Page heading plus the breadcrumb trail and structured data that match it. */
export function DocHeader({ path, title, lede }: { path: string; title: string; lede: ReactNode }) {
  const { name } = pageSeo(path);
  return (
    <header className="mb-10 border-b border-rule pb-8">
      <JsonLd data={docGraph(path)} />
      <nav aria-label="Breadcrumb" className="mb-5 hidden font-mono text-xs text-muted lg:block">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-faint">
            /
          </li>
          <li>
            {path === "/docs" ? (
              <span aria-current="page" className="text-ink">
                Docs
              </span>
            ) : (
              <Link href="/docs" className="transition-colors hover:text-ink">
                Docs
              </Link>
            )}
          </li>
          {path !== "/docs" && (
            <>
              <li aria-hidden="true" className="text-faint">
                /
              </li>
              <li aria-current="page" className="text-ink">
                {name}
              </li>
            </>
          )}
        </ol>
      </nav>
      <h1 className="text-4xl font-semibold tracking-[-0.035em] text-balance text-ink [overflow-wrap:anywhere] sm:text-5xl">
        <RiseWords text={title} start={0.05} step={0.05} />
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted">{lede}</p>
      <p className="mt-5 font-mono text-xs text-muted">
        Updated <time dateTime={CONTENT_UPDATED}>{updated}</time>
      </p>
    </header>
  );
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="group scroll-mt-28 text-2xl font-semibold tracking-tight text-ink">
      <a href={`#${id}`} data-plain="" className="no-underline">
        {children}
        <span aria-hidden="true" className="ml-2 text-faint opacity-0 transition-opacity group-hover:opacity-100">
          #
        </span>
      </a>
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold tracking-tight text-ink">{children}</h3>;
}

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="rounded-xl border border-honey/30 bg-honey/[0.05] px-5 py-4 text-[15px] leading-relaxed">
      {title && <p className="mb-1 font-medium text-honey">{title}</p>}
      <div className="text-body">{children}</div>
    </aside>
  );
}

type Row = ReactNode[];

export function Table({ head, rows }: { head: string[]; rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-rule">
      <table className="w-full min-w-[32rem] border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-rule bg-paper-2">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-medium text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-rule last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 align-top leading-relaxed ${j === 0 ? "text-ink" : "text-muted"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="list-none space-y-4 [counter-reset:step] [&>li]:relative [&>li]:pl-10 [&>li]:[counter-increment:step] [&>li]:before:absolute [&>li]:before:top-0.5 [&>li]:before:left-0 [&>li]:before:grid [&>li]:before:size-6 [&>li]:before:place-items-center [&>li]:before:rounded-full [&>li]:before:border [&>li]:before:border-rule-strong [&>li]:before:font-mono [&>li]:before:text-xs [&>li]:before:text-honey [&>li]:before:content-[counter(step)]">{children}</ol>;
}

export function Bullets({ children }: { children: ReactNode }) {
  return <ul className="list-none space-y-2 [&>li]:relative [&>li]:pl-5 [&>li]:before:absolute [&>li]:before:top-[0.75em] [&>li]:before:left-0 [&>li]:before:size-1.5 [&>li]:before:rounded-full [&>li]:before:bg-honey/70">{children}</ul>;
}
