import type { MetadataRoute } from "next";
import { flatDocs } from "@/lib/nav";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url }, ...flatDocs.map((d) => ({ url: `${site.url}${d.href}` }))];
}
