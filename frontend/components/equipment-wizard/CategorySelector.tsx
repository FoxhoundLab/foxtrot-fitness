"use client";

import { ChevronDown, Anchor, Armchair, Dumbbell, Cog, HeartPulse, PersonStanding, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const CATEGORY_META: Record<string, { label: string; icon: typeof Dumbbell }> = {
  barbells: { label: "Barbells & Plates", icon: Anchor },
  rack: { label: "Squat Rack & Bench", icon: Armchair },
  weights: { label: "Dumbbells & Kettlebells", icon: Dumbbell },
  machines: { label: "Machines", icon: Cog },
  cardio: { label: "Cardio Equipment", icon: HeartPulse },
  bodyweight: { label: "Bodyweight Gear", icon: PersonStanding },
  specialty: { label: "Specialty", icon: Sparkles },
};

interface CategorySelectorProps {
  category: string;
  itemCount: number;
  selectedCount: number;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export function CategorySelector({
  category,
  itemCount,
  selectedCount,
  expanded,
  onToggle,
  children,
}: CategorySelectorProps) {
  const meta = CATEGORY_META[category] ?? { label: category, icon: Dumbbell };
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "rounded-sm border bg-bg-secondary transition-all",
        expanded ? "border-border-active" : "border-border-default"
      )}
    >
      <button
        onClick={onToggle}
        className="flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left"
      >
        <Icon className={cn("h-5 w-5", selectedCount > 0 ? "text-accent-red" : "text-text-muted")} />
        <span className="flex-1 font-display text-xl uppercase tracking-wide text-text-primary">
          {meta.label}
        </span>
        {selectedCount > 0 && (
          <span className="flex items-center gap-1 bg-accent-red px-2 py-0.5 font-mono text-xs text-text-primary">
            <Check className="h-3 w-3" />
            {selectedCount}/{itemCount}
          </span>
        )}
        <ChevronDown
          className={cn("h-5 w-5 text-text-muted transition-transform", expanded && "rotate-180")}
        />
      </button>
      {expanded && <div className="border-t border-border-default p-4">{children}</div>}
    </div>
  );
}
