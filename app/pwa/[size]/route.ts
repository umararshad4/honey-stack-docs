import { brandIconPng, ICON_SIZES } from "@/lib/brand-icon";

export function generateStaticParams() {
  return ICON_SIZES.map((size) => ({ size: String(size) }));
}

export async function GET(_request: Request, { params }: RouteContext<"/pwa/[size]">) {
  const size = Number((await params).size);
  if (!ICON_SIZES.includes(size as (typeof ICON_SIZES)[number])) return new Response("Not found", { status: 404 });
  return new Response(await brandIconPng(size), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400" },
  });
}
