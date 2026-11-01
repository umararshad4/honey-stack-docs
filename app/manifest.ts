import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "honey-stack docs",
    short_name: "honey-stack",
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#15110c",
    theme_color: "#15110c",
    categories: ["developer", "productivity", "utilities"],
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/pwa/192", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/pwa/512", type: "image/png", sizes: "512x512", purpose: "any" },
      { src: "/pwa/512", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
