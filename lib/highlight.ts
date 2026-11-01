import { cacheLife } from "next/cache";
import { createCssVariablesTheme, createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

export type Lang = "bash" | "json";

const theme = createCssVariablesTheme({ name: "honey", variablePrefix: "--shiki-" });

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [theme],
    langs: [import("shiki/langs/bash.mjs"), import("shiki/langs/json.mjs")],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/** Build-time syntax highlighting; colours come from --shiki-* tokens in globals.css. */
export async function highlight(code: string, lang: Lang): Promise<string> {
  "use cache";
  cacheLife("max");
  const hl = await getHighlighter();
  return hl.codeToHtml(code, { lang, theme: "honey" });
}
