# honey-stack docs

The documentation site for [honey-stack](https://github.com/umararshad4/honey-stack) — one always-on toolkit for Claude Code and Codex that learns from every session.

**Live:** https://honey-stack.vercel.app

## Stack

Next.js 16 (App Router, Cache Components), Tailwind CSS v4, Motion, Lenis and Shiki. Every route is prerendered; the version badge and release list come from the GitHub Releases API and revalidate hourly, so the site tracks honey-stack's automatic releases without a redeploy.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm lint && pnpm build
pnpm start & pnpm seo:check http://localhost:3000   # SEO audit against a running build
```

## SEO

- Every page is registered in `lib/seo.ts` with a unique title (≤ 60 chars with the suffix), a 120–160 character description, keywords, canonical, Open Graph and Twitter tags.
- Per-page share images are rendered at build time by `app/og/[slug]` (Geist fonts in `assets/fonts`, OFL).
- Structured data (`lib/structured-data.ts`): WebSite + Person everywhere, SoftwareApplication + SoftwareSourceCode + FAQPage on the home page, TechArticle + BreadcrumbList on docs pages. The FAQ is visible on the page, as the markup requires.
- Crawl files: `sitemap.xml` (lastmod), `robots.txt`, `llms.txt`, `releases.xml` (RSS of GitHub releases), `manifest.webmanifest` and PNG app icons.
- Security headers (CSP, frame, referrer, permissions, HSTS) live in `next.config.ts`.
- `pnpm seo:check [baseUrl]` crawls every sitemap URL and fails on missing or duplicate titles and descriptions, a wrong canonical, missing Open Graph tags, broken share images, invalid JSON-LD, broken internal links, a soft 404 or missing headers.
- `pnpm indexnow` notifies IndexNow engines (Bing and partners) of every sitemap URL after a deploy.
- Search Console / Bing Webmaster verification: set `GOOGLE_SITE_VERIFICATION` or `BING_SITE_VERIFICATION` in Vercel and redeploy; the tags are added automatically.

## Motion

Motion (Framer Motion) and Lenis drive the animation. Every effect respects `prefers-reduced-motion`: `lib/use-reduced-motion.ts` is hydration-safe, and `MotionConfig reducedMotion="user"` skips transform animation. Canvas and auto-advancing pieces pause when off screen.

## Layout

- `app/page.tsx` — landing page; sections live in `components/landing/`
- `app/docs/*` — documentation pages; shell in `components/docs/`
- `lib/nav.ts` — docs navigation (sidebar, pager and sitemap read from it)
- `lib/skills.ts` — skill and subagent list
- `lib/github.ts` — cached release fetch with an offline fallback
- `app/globals.css` — design tokens (OKLCH palette, easings, Shiki colours)

Content follows the honey-stack README; when behaviour changes there, update the matching page here.

MIT © King Umar
