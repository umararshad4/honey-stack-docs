/** Honeycomb cell mark: a hexagon with a single filled drop of honey. */
export function LogoMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 2.2 20.5 7.1v9.8L12 21.8 3.5 16.9V7.1L12 2.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 7.6c1.9 2.3 3 4 3 5.4a3 3 0 0 1-6 0c0-1.4 1.1-3.1 3-5.4Z" fill="currentColor" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 text-ink">
      <LogoMark className="text-honey" />
      <span className="font-mono text-[13px] font-medium tracking-tight">honey-stack</span>
    </span>
  );
}
