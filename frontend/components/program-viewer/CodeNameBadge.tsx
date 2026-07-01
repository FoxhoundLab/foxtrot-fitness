"use client";

import { cn } from "@/lib/utils";

interface CodeNameBadgeProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "text-lg px-2.5 py-1",
  md: "text-xl px-3 py-1.5",
  lg: "text-3xl px-4 py-2",
  xl: "text-5xl px-6 py-3",
};

export function CodeNameBadge({ name, size = "md", className }: CodeNameBadgeProps) {
  const nameLower = name.toLowerCase();
  let badgeColor = "bg-accent-red";

  if (nameLower.includes("crimson")) badgeColor = "bg-badge-crimson";
  else if (nameLower.includes("cobalt")) badgeColor = "bg-badge-cobalt";
  else if (nameLower.includes("sanguine")) badgeColor = "bg-badge-sanguine";
  else if (nameLower.includes("genesis")) badgeColor = "bg-badge-genesis";

  return (
    <div
      className={cn(
        "inline-flex items-center font-display uppercase tracking-wider text-text-primary",
        badgeColor,
        sizeClasses[size],
        className
      )}
      style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)" }}
    >
      {name}
    </div>
  );
}
