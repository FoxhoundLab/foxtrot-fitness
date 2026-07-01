"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Equipment, Experience } from "@/lib/types";

// Plain-English descriptions shown to beginners
const BEGINNER_HINTS: Record<string, string> = {
  "barbell-olympic": "The long bar for squats, presses, deadlifts",
  "bumper-plates": "Rubber weight plates for the barbell",
  "ez-curl-bar": "Curved bar, easier on the wrists for curls",
  "squat-rack": "The metal frame that holds a barbell",
  bench: "Flat bench for pressing",
  "incline-bench": "Adjustable bench that tilts up",
  dumbbells: "Handheld weights",
  kettlebells: "Cannonball weights with a handle",
  "cable-machine": "Pulley machine with a stack of weights",
  "pull-up-bar": "Bar you hang from for pull-ups",
  trx: "Suspension straps",
  rings: "Gymnastic rings",
  "dip-station": "Parallel bars for dips",
  ghd: "Glute-ham machine",
  rower: "Rowing machine",
  "assault-bike": "Fan bike with moving arms",
  "exercise-bike": "Stationary bike",
  "battle-ropes": "Heavy ropes you slam",
  bosu: "Half-ball balance trainer",
  "plyo-boxes": "Boxes for jumping",
  "resistance-bands": "Stretchy bands",
  "ab-wheel": "Wheel with handles for core rollouts",
  "foam-roller": "Foam cylinder for muscle release",
  "weight-belt": "Belt for adding weight to pull-ups/dips",
};

interface ItemPickerProps {
  items: Equipment[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  experience: Experience;
}

export function ItemPicker({ items, selected, onToggle, experience }: ItemPickerProps) {
  const showHints = experience === "beginner";

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => {
        const isSelected = selected.has(item.id);
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={cn(
              "flex min-h-[52px] items-center gap-3 rounded-sm border px-3 py-2.5 text-left transition-all",
              isSelected
                ? "border-accent-red bg-accent-red/10"
                : "border-border-default bg-bg-tertiary hover:border-text-muted"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center border",
                isSelected ? "border-accent-red bg-accent-red" : "border-border-default"
              )}
            >
              {isSelected && <Check className="h-3.5 w-3.5 text-text-primary" />}
            </span>
            <span className="min-w-0">
              <span className="block font-body text-sm font-medium text-text-primary">
                {item.name}
              </span>
              {showHints && BEGINNER_HINTS[item.id] && (
                <span className="block font-body text-xs text-text-muted">
                  {BEGINNER_HINTS[item.id]}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
