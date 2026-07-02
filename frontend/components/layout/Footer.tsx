import Image from "next/image";
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
        <p className="flex items-center gap-2 font-body text-xs text-text-muted">
          <Image
            src="/fox-head.png"
            alt="Foxtrot Fitness logo"
            width={20}
            height={20}
            className="h-5 w-5 object-contain opacity-70"
          />
          Build Your Workout. 2026
        </p>
      </div>
    </footer>
  );
}
