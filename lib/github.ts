import { cacheLife } from "next/cache";
import { site } from "./site";

export type Release = { tag: string; date: string; url: string; summary: string };

const API = site.repo.replace("https://github.com/", "https://api.github.com/repos/");

/** First meaningful changelog bullet, without merge noise or conventional-commit prefixes. */
function summarize(body: unknown): string {
  if (typeof body !== "string") return "";
  const bullet = body
    .split("\n")
    .map((line) => line.replace(/^\s*[-*]\s+/, "").trim())
    .find((line) => line && !line.startsWith("#") && !/^merge pull request/i.test(line));
  if (!bullet) return "";
  const clean = bullet.replace(/^[a-z]+(\([^)]*\))?!?:\s*/i, "").replaceAll("`", "");
  const text = clean.charAt(0).toUpperCase() + clean.slice(1);
  return text.length > 150 ? `${text.slice(0, 147).trimEnd()}…` : text;
}

/**
 * Latest published releases, refreshed hourly. honey-stack cuts its own releases after
 * every green merge, so this keeps the site's version current without redeploying.
 * Returns [] when GitHub is unreachable or rate-limited; callers render a fallback.
 */
export async function getReleases(limit = 6): Promise<Release[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(`${API}/releases?per_page=${limit}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((r) => r && !r.draft && !r.prerelease && typeof r.tag_name === "string")
      .map((r) => ({
        tag: r.tag_name as string,
        date: typeof r.published_at === "string" ? r.published_at : "",
        url: r.html_url as string,
        summary: summarize(r.body),
      }));
  } catch {
    return [];
  }
}

export async function getLatestVersion(): Promise<string> {
  const [latest] = await getReleases();
  return latest?.tag ?? site.fallbackVersion;
}
