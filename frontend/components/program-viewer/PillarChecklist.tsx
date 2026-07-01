"use client";

import { Dumbbell, Heart, Flame, Activity, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PillarCoverage } from "@/lib/types";

interface PillarChecklistProps {
  pillars: PillarCoverage;
  variant?: "compact" | "full";
  className?: string;
}

const PILLAR_CONFIG = [
  { key: "strength" as const, label: "Strength", icon: Dumbbell },
  { key: "zone2" as const, label: "Zone 2", icon: Heart },
  { key: "vo2max" as const, label: "VO2 Max", icon: Flame },
  { key: "mobility" as const, label: "Mobility", icon: Activity },
  { key: "recovery" as const, label: "Recovery", icon: Moon },
];

export function PillarChecklist({
  pillars,
  variant = "compact",
  className,
}: PillarChecklistProps) {
  const isFull = variant === "full";

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        isFull && "flex-wrap justify-center",
        className
      )}
    >
      {PILLAR_CONFIG.map(({ key, label, icon: Icon }) => {
        const passed = pillars[key];
        return (
          <div
            key={key}
            className={cn(
              "flex items-center gap-1.5",
              isFull && "flex-col gap-1"
            )}
            title={`${label}: ${passed ? "Passed" : "Missing"}`}
          >
            <div
              className={cn(
                "flex items-center justify-center",
                isFull ? "h-10 w-10" : "h-6 w-6",
                passed
                  ? "bg-accent-green/15 text-accent-green shadow-glow-green"
                  : "bg-bg-tertiary text-text-muted"
              )}
              style={{ borderRadius: "2px" }}
            >
              <Icon className={isFull ? "h-5 w-5" : "h-3.5 w-3.5"} />
            </div>
            {isFull && (
              <span
                className={cn(
                  "font-body text-xs uppercase tracking-wide",
                  passed ? "text-accent-green" : "text-text-muted"
                )}
              >
                {label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
