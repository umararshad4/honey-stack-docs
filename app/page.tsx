import { JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/landing/faq";
import { Flow } from "@/components/landing/flow";
import { Hero } from "@/components/landing/hero";
import { InstallCta } from "@/components/landing/install-cta";
import { Ladder } from "@/components/landing/ladder";
import { RsiLoop } from "@/components/landing/rsi-loop";
import { SelfShip } from "@/components/landing/self-ship";
import { SkillsPreview } from "@/components/landing/skills-preview";
import { Why } from "@/components/landing/why";
import { getReleases } from "@/lib/github";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { homeGraph } from "@/lib/structured-data";

export const metadata = pageMetadata("/");

export default async function Home() {
  const releases = await getReleases();
  const version = releases[0]?.tag ?? site.fallbackVersion;

  return (
    <main>
      <JsonLd data={homeGraph(version)} />
      <Hero version={version} releasesUrl={`${site.repo}/releases`} />
      <Why />
      <Ladder />
      <Flow />
      <RsiLoop />
      <SelfShip releases={releases} />
      <SkillsPreview />
      <Faq />
      <InstallCta />
    </main>
  );
}
