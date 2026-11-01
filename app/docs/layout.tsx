import { Pager } from "@/components/docs/pager";
import { MobileDocsNav, Sidebar } from "@/components/docs/sidebar";
import { Toc } from "@/components/docs/toc";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-5 pt-28 pb-24 sm:px-8 lg:grid-cols-[13.5rem_minmax(0,1fr)] xl:grid-cols-[13.5rem_minmax(0,1fr)_11rem] xl:gap-14">
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>
      <div className="min-w-0">
        <MobileDocsNav />
        <article id="doc-article" className="max-w-3xl">
          {children}
        </article>
        <div className="max-w-3xl">
          <Pager />
        </div>
      </div>
      <aside className="hidden xl:block">
        <Toc />
      </aside>
    </div>
  );
}
