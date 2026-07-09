"use client";

import { Pencil, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CATEGORY_META } from "./CategorySelector";
import type { Equipment, Experience, UserGoals, UserPreferences } from "@/lib/types";

interface SummaryReviewProps {
  experience: Experience;
  equipment: Equipment[];
  selectedIds: Set<string>;
  goals: UserGoals;
  preferences: UserPreferences;
  onGenerate: () => void;
  onEditStep?: (step: number) => void;
  generating?: boolean;
}

function Section({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-lg uppercase tracking-wider text-accent-red">
          {title}
        </h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex min-h-[44px] items-center gap-1 px-2 font-body text-xs uppercase tracking-wider text-text-muted underline decoration-accent-red underline-offset-4 transition-colors hover:text-accent-red"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        )}
      </div>
      {children}
    </Card>
  );
}

export function SummaryReview({
  experience,
  equipment,
  selectedIds,
  goals,
  preferences,
  onGenerate,
  onEditStep,
  generating,
}: SummaryReviewProps) {
  const selectedEquipment = equipment.filter((e) => selectedIds.has(e.id));
  const byCategory = selectedEquipment.reduce<Record<string, string[]>>((acc, e) => {
    (acc[e.category] ??= []).push(e.name);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Section title="Experience" onEdit={onEditStep && (() => onEditStep(0))}>
        <p className="font-display text-2xl uppercase text-text-primary">{experience}</p>
      </Section>

      <Section
        title={`Equipment (${selectedEquipment.length})`}
        onEdit={onEditStep && (() => onEditStep(1))}
      >
        {selectedEquipment.length === 0 ? (
          <p className="font-body text-sm text-text-muted">
            Bodyweight only — no equipment selected.
          </p>
        ) : (
          <div className="space-y-2">
            {Object.entries(byCategory).map(([cat, names]) => (
              <div key={cat}>
                <span className="font-body text-xs uppercase tracking-wider text-text-muted">
                  {CATEGORY_META[cat]?.label ?? cat}
                </span>
                <p className="font-body text-sm text-text-primary">{names.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Goals" onEdit={onEditStep && (() => onEditStep(2))}>
        <div className="grid gap-x-6 gap-y-2 font-body text-sm sm:grid-cols-2">
          <p>
            <span className="text-text-muted">Primary: </span>
            <span className="uppercase text-text-primary">{goals.primary}</span>
          </p>
          <p>
            <span className="text-text-muted">Schedule: </span>
            <span className="font-mono text-text-primary">
              {goals.days_per_week} days · {goals.session_length_minutes} min
            </span>
          </p>
          <p>
            <span className="text-text-muted">Finishers: </span>
            <span className="text-text-primary">{goals.finisher_preference}</span>
          </p>
          {goals.limitations && (
            <p className="sm:col-span-2">
              <span className="text-text-muted">Limitations: </span>
              <span className="text-text-primary">{goals.limitations}</span>
            </p>
          )}
          {preferences.dislikes.length > 0 && (
            <p className="sm:col-span-2">
              <span className="text-text-muted">Avoiding: </span>
              <span className="text-text-primary">{preferences.dislikes.join(", ")}</span>
            </p>
          )}
        </div>
      </Section>

      <Button
        onClick={onGenerate}
        disabled={generating}
        size="lg"
        className="w-full animate-pulse-red"
      >
        <Rocket className="h-5 w-5" />
        {generating ? "Generating…" : "Generate Program"}
      </Button>
    </div>
  );
}
