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
```

## Layout

- `app/page.tsx` — landing page; sections live in `components/landing/`
- `app/docs/*` — documentation pages; shell in `components/docs/`
- `lib/nav.ts` — docs navigation (sidebar, pager and sitemap read from it)
- `lib/skills.ts` — skill and subagent list
- `lib/github.ts` — cached release fetch with an offline fallback
- `app/globals.css` — design tokens (OKLCH palette, easings, Shiki colours)

Content follows the honey-stack README; when behaviour changes there, update the matching page here.

MIT © King Umar
