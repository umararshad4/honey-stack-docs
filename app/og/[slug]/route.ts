import { ogResponse } from "@/lib/og";
import { ogSlugs } from "@/lib/seo";

export function generateStaticParams() {
  return ogSlugs().map((slug) => ({ slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[slug]">) {
  const { slug } = await params;
  return ogResponse(slug);
}
