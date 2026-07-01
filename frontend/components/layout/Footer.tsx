import Link from "next/link";

export function Footer() {
  return (
    <footer className="no-print border-t border-border-default px-4 py-8 pb-24 md:pb-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <p className="font-display text-lg uppercase tracking-widest text-text-muted">
          Foxtrot Fitness
        </p>
        <nav className="flex gap-4 font-body text-xs text-text-muted">
          <Link href="/library" className="hover:text-text-secondary">Library</Link>
          <Link href="/onboard" className="hover:text-text-secondary">Generate</Link>
          <Link href="/auth/login" className="hover:text-text-secondary">Sign In</Link>
        </nav>
        <p className="font-body text-xs text-text-muted">Build Your Mission. 2026</p>
      </div>
    </footer>
  );
}
