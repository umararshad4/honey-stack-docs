import { faq } from "./faq";
import { absolute, CONTENT_PUBLISHED, CONTENT_UPDATED, ogSlug, pageSeo, sectionOf } from "./seo";
import { site } from "./site";
import { skillCount } from "./skills";

type Node = Record<string, unknown>;

const ids = {
  website: `${site.url}/#website`,
  author: `${site.url}/#author`,
  software: `${site.url}/#software`,
  source: `${site.url}/#source`,
};

const author: Node = {
  "@type": "Person",
  "@id": ids.author,
  name: site.author,
  url: site.authorUrl,
  sameAs: [site.authorUrl],
};

const website: Node = {
  "@type": "WebSite",
  "@id": ids.website,
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": ids.author },
};

/** Site-wide graph rendered in the root layout. */
export function siteGraph() {
  return { "@context": "https://schema.org", "@graph": [website, author] };
}

/** Home page: the product, its source code, the page itself and the visible FAQ. */
export function homeGraph(version: string) {
  const page = pageSeo("/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": ids.software,
        name: site.name,
        description: site.description,
        url: site.url,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "AI coding agent plugin",
        operatingSystem: "macOS, Linux",
        softwareVersion: version.replace(/^v/, ""),
        softwareRequirements: "Claude Code or Codex; Python 3.9+; git",
        license: "https://opensource.org/licenses/MIT",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        installUrl: absolute("/docs/install"),
        downloadUrl: site.repo,
        releaseNotes: `${site.repo}/releases`,
        image: absolute(`/og/${ogSlug("/")}`),
        author: { "@id": ids.author },
        featureList: [
          "About 2 KB of always-on rules for Claude Code and Codex",
          `${skillCount} skills loaded only when a task needs them`,
          "Destructive-command guard, secret scan and receipt gate hooks",
          "RSI: learns WHEN → THEN rules from your corrections",
          "Evaluated skill patches with opt-in autonomous application",
          "Local, reversible install with no telemetry",
        ],
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": ids.source,
        name: site.name,
        codeRepository: site.repo,
        programmingLanguage: "Python",
        license: "https://opensource.org/licenses/MIT",
        author: { "@id": ids.author },
        targetProduct: { "@id": ids.software },
      },
      {
        "@type": "WebPage",
        "@id": `${site.url}/#webpage`,
        url: site.url,
        name: page.title,
        description: page.description,
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.software },
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

/** Docs page: a technical article plus the breadcrumb trail shown above its heading. */
export function docGraph(path: string) {
  const page = pageSeo(path);
  const url = absolute(path);
  const crumbs = [
    { name: "Home", url: site.url },
    { name: "Docs", url: absolute("/docs") },
    ...(path === "/docs" ? [] : [{ name: page.name, url }]),
  ];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: page.title,
        description: page.description,
        url,
        mainEntityOfPage: url,
        image: absolute(`/og/${ogSlug(path)}`),
        datePublished: CONTENT_PUBLISHED,
        dateModified: CONTENT_UPDATED,
        articleSection: sectionOf(path),
        keywords: page.keywords,
        inLanguage: "en",
        author: { "@id": ids.author },
        publisher: { "@id": ids.author },
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.software },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
      },
    ],
  };
}
