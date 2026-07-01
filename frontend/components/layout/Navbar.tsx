"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";
import { clearSession, getSessionEmail } from "@/lib/api";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/onboard", label: "Generate" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(getSessionEmail());
  }, [pathname]);

  function signOut() {
    clearSession();
    setEmail(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border-default bg-bg-primary/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-xl uppercase tracking-[0.2em] text-text-primary"
        >
          Foxtrot <span className="text-accent-red">Fitness</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-display text-base uppercase tracking-wider transition-colors",
                pathname === link.href
                  ? "text-accent-red"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {email ? (
          <button
            onClick={signOut}
            title={email}
            className="flex min-h-[44px] items-center gap-2 font-display text-base uppercase tracking-wider text-text-secondary transition-colors hover:text-accent-red"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="flex min-h-[44px] items-center gap-2 font-display text-base uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary"
          >
            <UserCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
