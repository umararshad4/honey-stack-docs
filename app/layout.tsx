import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { getLatestVersion } from "@/lib/github";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "honey-stack — the agent toolkit that learns", template: "%s · honey-stack" },
  description: `${site.tagline} ~2 KB of always-on rules, 38 skills, and RSI: it learns from your corrections and improves itself.`,
  openGraph: { type: "website", siteName: "honey-stack", url: site.url },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#15110c", colorScheme: "dark" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const version = await getLatestVersion();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="relative min-h-dvh">
        <div aria-hidden="true" className="bloom pointer-events-none fixed inset-0 -z-10" />
        <SmoothScroll>
          <a
            href="#main"
            className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-honey px-4 py-2 text-sm font-medium text-on-honey focus-visible:translate-y-0"
          >
            Skip to content
          </a>
          <Nav version={version} />
          <div id="main">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
