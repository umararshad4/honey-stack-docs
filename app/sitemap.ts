import type { MetadataRoute } from "next";
import { absolute, ogSlug, pages } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: absolute(page.path),
    lastModified: page.updated,
    changeFrequency: page.path === "/" ? "weekly" : "monthly",
    priority: page.path === "/" ? 1 : page.path === "/docs" || page.path === "/docs/install" ? 0.9 : 0.7,
    images: [absolute(`/og/${ogSlug(page.path)}`)],
  }));
}
