/** Visible on the home page and mirrored in FAQPage structured data. Facts only — no invented claims. */
export const faq = [
  {
    q: "What is honey-stack?",
    a: "An always-on workflow layer for Claude Code and Codex. It keeps about 2 KB of rules in every session, loads 38 skills only when a task needs them, and uses RSI to learn from your corrections.",
  },
  {
    q: "Does it work with both Claude Code and Codex?",
    a: "Yes. One install sets up both agents, and they share a single data directory in ~/.honey, so a rule learned in one carries over to the other.",
  },
  {
    q: "Is honey-stack free?",
    a: "Yes — it's open source under the MIT license. Reflection calls your own model provider (about $0.002 per session with Haiku), with weekly and monthly budget caps on by default.",
  },
  {
    q: "Does it send my code or sessions anywhere?",
    a: "No telemetry. It stores only redacted snippets of up to 300 characters, locally. Network use is limited to your model provider and a public git fetch — plus GitHub, only if you opt in to publishing.",
  },
  {
    q: "How is it different from installing several skill packs?",
    a: "Stacked toolkits inject roughly 25 KB of overlapping, competing prompts. honey-stack replaces them with one ~2 KB layer, turns competing always-on plugins off at install (reversibly) and distills their ideas into curated, attributed skills.",
  },
  {
    q: "How does it improve itself?",
    a: "Hooks observe redacted corrections, a small model proposes WHEN → THEN rules, and a rule goes live once two sessions back it. Skill patches must pass regression evaluations, and autonomous application is opt-in.",
  },
  {
    q: "Can I undo it?",
    a: "Yes. honey uninstall reverses every change the installer made and keeps ~/.honey unless you add --purge. Say “honey off” to pause it for a single session.",
  },
  {
    q: "What do I need to run it?",
    a: "Claude Code and/or Codex, python3 3.9 or newer, and git, on macOS or Linux. Windows isn't supported yet.",
  },
] as const;
