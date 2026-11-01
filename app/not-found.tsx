import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-start justify-center px-5 pt-28">
      <p className="font-mono text-sm text-honey">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">This cell is empty.</h1>
      <p className="mt-3 text-muted">The page you asked for doesn&apos;t exist, or it moved.</p>
      <div className="mt-8 flex gap-3 text-sm">
        <Link href="/" className="rounded-full bg-honey px-4 py-2 font-medium text-on-honey">Home</Link>
        <Link href="/docs" className="rounded-full border border-rule px-4 py-2 text-ink hover:bg-paper-2">Docs</Link>
      </div>
    </main>
  );
}
