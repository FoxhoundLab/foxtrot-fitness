"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

function FoxHomeIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/fox-head.png"
      alt=""
      width={20}
      height={20}
      className={cn("object-contain", className)}
    />
  );
}

const ITEMS = [
  { href: "/", label: "Home", icon: FoxHomeIcon },
  { href: "/library", label: "Library", icon: Library },
  { href: "/onboard", label: "Generate", icon: Plus },
  { href: "/auth/login", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 z-40 flex border-t border-border-default bg-bg-primary md:hidden">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5",
              active ? "text-accent-red" : "text-text-muted"
            )}
          >
            {active && <span className="absolute top-0 h-0.5 w-10 bg-accent-red" />}
            <Icon className="h-5 w-5" />
            <span className="font-display text-[10px] uppercase tracking-wider">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
