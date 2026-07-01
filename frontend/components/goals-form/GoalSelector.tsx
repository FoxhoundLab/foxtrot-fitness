"use client";

import { Dumbbell, Flame, HeartPulse, Scale, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Goal } from "@/lib/types";

const GOALS: { value: Goal; label: string; description: string; icon: typeof Dumbbell }[] = [
  { value: "strength", label: "Strength", description: "Lift heavier. Low reps, big compounds.", icon: Dumbbell },
  { value: "hypertrophy", label: "Hypertrophy", description: "Build muscle. Volume and time under tension.", icon: Flame },
  { value: "conditioning", label: "Conditioning", description: "Engine work. Capacity, circuits, sweat.", icon: HeartPulse },
  { value: "balanced", label: "Balanced", description: "Strength + cardio + mobility, evenly split.", icon: Scale },
  { value: "longevity", label: "Longevity", description: "Train for the long game. Joints, zones, recovery.", icon: Shield },
];

export function GoalSelector({ value, onSelect }: { value: Goal; onSelect: (g: Goal) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {GOALS.map(({ value: v, label, description, icon: Icon }) => {
        const selected = value === v;
        return (
          <button
            key={v}
            onClick={() => onSelect(v)}
            className={cn(
              "flex min-h-[110px] flex-col items-start rounded-sm border bg-bg-secondary p-4 text-left transition-all",
              selected
                ? "border-accent-red shadow-glow-red"
                : "border-border-default hover:border-text-muted"
            )}
          >
            <Icon className={cn("mb-2 h-6 w-6", selected ? "text-accent-red" : "text-text-muted")} />
            <span className="font-display text-2xl uppercase tracking-wide text-text-primary">
              {label}
            </span>
            <span className="font-body text-xs text-text-secondary">{description}</span>
          </button>
        );
      })}
    </div>
  );
}
