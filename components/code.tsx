import { highlight, type Lang } from "@/lib/highlight";
import { CopyButton } from "./copy-button";

type CodeProps = { children: string; lang?: Lang; title?: string };

/** Highlighted code block with copy. Server component; no client JS beyond the button. */
export async function Code({ children, lang = "bash", title }: CodeProps) {
  const code = children.trim();
  const html = await highlight(code, lang);

  return (
    <figure className="group relative overflow-hidden rounded-xl border border-rule bg-paper-2">
      {title && (
        <figcaption className="border-b border-rule px-4 py-2 font-mono text-xs text-muted">{title}</figcaption>
      )}
      <div
        className="overflow-x-auto py-3.5 pr-12 pl-4 text-[13px] leading-relaxed [&_pre]:outline-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton text={code} className="absolute top-2 right-2 bg-paper-2 shadow-[-12px_0_12px_-4px_var(--color-paper-2)]" />
    </figure>
  );
}
