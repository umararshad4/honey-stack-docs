import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { MotionProvider } from "@/components/motion-provider";
import { Nav } from "@/components/nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Spotlight } from "@/components/spotlight";
import { getLatestVersion } from "@/lib/github";
import { pageSeo } from "@/lib/seo";
import { site } from "@/lib/site";
import { siteGraph } from "@/lib/structured-data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const home = pageSeo("/");
const google = process.env.GOOGLE_SITE_VERIFICATION;
const bing = process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: { default: home.title, template: "%s · honey-stack" },
  description: home.description,
  keywords: home.keywords,
  authors: [{ name: site.author, url: site.authorUrl }],
  creator: site.author,
  publisher: site.author,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: { types: { "application/rss+xml": [{ url: "/releases.xml", title: "honey-stack releases" }] } },
  openGraph: { type: "website", siteName: site.name, locale: "en_US", url: site.url },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { title: site.name, statusBarStyle: "black-translucent" },
  ...((google || bing) && {
    verification: { ...(google && { google }), ...(bing && { other: { "msvalidate.01": bing } }) },
  }),
};

export const viewport: Viewport = { themeColor: "#15110c", colorScheme: "dark" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const version = await getLatestVersion();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="relative min-h-dvh">
        <JsonLd data={siteGraph()} />
        <div aria-hidden="true" className="bloom pointer-events-none fixed inset-0 -z-10" />
        <MotionProvider>
          <SmoothScroll>
            <a
              href="#main"
              className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-honey px-4 py-2 text-sm font-medium text-on-honey focus-visible:translate-y-0"
            >
              Skip to content
            </a>
            <ScrollProgress />
            <Spotlight />
            <Nav version={version} />
            <div id="main">{children}</div>
            <Footer />
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
