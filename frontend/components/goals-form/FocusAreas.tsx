"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FocusArea } from "@/lib/types";

const AREAS: { value: FocusArea; label: string }[] = [
  { value: "legs", label: "Legs" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms", label: "Arms" },
  { value: "full_body", label: "Full Body" },
  { value: "core", label: "Core" },
];

export function FocusAreas({
  selected,
  onToggle,
}: {
  selected: FocusArea[];
  onToggle: (a: FocusArea) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {AREAS.map(({ value, label }) => {
        const isSelected = selected.includes(value);
        return (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={cn(
              "flex min-h-[48px] items-center gap-2 rounded-sm border px-4 transition-all",
              isSelected
                ? "border-accent-red bg-accent-red/10 text-text-primary"
                : "border-border-default bg-bg-tertiary text-text-secondary hover:border-text-muted"
            )}
          >
            {isSelected && <Check className="h-4 w-4 text-accent-red" />}
            <span className="font-display text-lg uppercase tracking-wide">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
