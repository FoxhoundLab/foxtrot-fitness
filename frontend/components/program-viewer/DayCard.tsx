import { HeartPulse, StretchHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MovementRow } from "./MovementRow";
import { FinisherCard } from "./FinisherCard";
import type { ProgramDay } from "@/lib/types";

const CARDIO_LABELS: Record<string, string> = {
  "zone-2": "Zone 2",
  "vo2-max": "VO2 Max",
  hiit: "HIIT",
};

export function DayCard({ day }: { day: ProgramDay }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border-default bg-bg-tertiary px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center bg-accent-red font-display text-lg text-text-primary">
          {day.day}
        </span>
        <h3 className="font-display text-xl uppercase tracking-wide text-text-primary">
          {day.name}
        </h3>
      </div>

      {day.movements.length > 0 && (
        <div className="px-4 py-2">
          {day.movements.map((m, i) => (
            <MovementRow key={i} movement={m} />
          ))}
        </div>
      )}

      {day.cardio && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border-default px-4 py-3">
          <HeartPulse className="h-4 w-4 text-accent-blue" />
          <span className="font-display text-sm uppercase tracking-wide text-accent-blue">
            {CARDIO_LABELS[day.cardio.type] ?? day.cardio.type}
          </span>
          <span className="font-mono text-sm text-text-primary">
            {day.cardio.duration_minutes} min
          </span>
          {day.cardio.equipment && (
            <span className="font-mono text-xs text-text-muted">({day.cardio.equipment})</span>
          )}
          {day.cardio.notes && (
            <span className="w-full font-body text-xs text-text-secondary">{day.cardio.notes}</span>
          )}
        </div>
      )}

      {day.mobility && (
        <div className="flex items-start gap-2 border-t border-border-default px-4 py-3">
          <StretchHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
          <p className="font-body text-sm text-text-secondary">{day.mobility}</p>
        </div>
      )}

      {day.finisher && <FinisherCard finisher={day.finisher} />}
    </Card>
  );
}
