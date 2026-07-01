"use client";

import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Experience } from "@/lib/types";

const LEVELS: {
  value: Experience;
  label: string;
  description: string;
  expect: string;
  bars: number;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to structured training",
    expect: "Lower volume, simple movements, 3-day default. We build the foundation first.",
    bars: 1,
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Consistent training 6+ months",
    expect: "Standard volume, full movement library, 4-day default. Progressive overload dialed in.",
    bars: 2,
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Years of structured programming",
    expect: "High volume, complex movements, 5-day available. Maximum intensity unlocked.",
    bars: 3,
  },
];

interface ExperienceGateProps {
  value: Experience | null;
  onSelect: (level: Experience) => void;
}

export function ExperienceGate({ value, onSelect }: ExperienceGateProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="font-display text-5xl uppercase tracking-wide text-text-primary sm:text-6xl">
          Choose Your <span className="text-accent-red">Level</span>
        </h1>
        <p className="mt-3 font-body text-base text-text-secondary">
          Everything downstream adapts to this — volume, complexity, schedule.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {LEVELS.map((level) => {
          const selected = value === level.value;
          return (
            <button
              key={level.value}
              onClick={() => onSelect(level.value)}
              className={cn(
                "group flex min-h-[220px] flex-col items-start rounded-sm border bg-bg-secondary p-6 text-left transition-all",
                selected
                  ? "border-accent-red shadow-glow-red-strong"
                  : "border-border-default hover:border-border-active hover:shadow-glow-red"
              )}
            >
              <div className="mb-4 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <Dumbbell
                    key={i}
                    className={cn(
                      "h-6 w-6",
                      i < level.bars
                        ? selected
                          ? "text-accent-red"
                          : "text-accent-orange"
                        : "text-border-default"
                    )}
                  />
                ))}
              </div>
              <h2 className="mb-1 font-display text-3xl uppercase tracking-wide text-text-primary">
                {level.label}
              </h2>
              <p className="mb-3 font-body text-sm text-text-secondary">{level.description}</p>
              <p className="font-body text-xs leading-relaxed text-text-muted">{level.expect}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
