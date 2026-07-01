"use client";

import { cn } from "@/lib/utils";

const STEPS = ["Experience", "Equipment", "Goals", "Review"];

export function WizardStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className={cn("h-px w-6 sm:w-12", done || active ? "bg-accent-red" : "bg-border-default")}
              />
            )}
            <div className="flex flex-col items-center gap-1 px-1 sm:px-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center border font-display text-base",
                  active
                    ? "border-accent-red bg-accent-red text-text-primary shadow-glow-red"
                    : done
                      ? "border-accent-red text-accent-red"
                      : "border-border-default text-text-muted"
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "hidden font-display text-xs uppercase tracking-wider sm:block",
                  active ? "text-text-primary" : "text-text-muted"
                )}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
