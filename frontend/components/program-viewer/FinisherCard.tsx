import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Finisher, FinisherMovement } from "@/lib/types";

function movementLine(m: FinisherMovement): string {
  const parts: string[] = [];
  if (m.minute !== undefined) parts.push(`Min ${m.minute}:`);
  if (m.name) parts.push(m.name);
  if (m.reps !== undefined) parts.push(`x${m.reps}`);
  if (m.distance_meters) parts.push(`${m.distance_meters}m`);
  if (m.duration_seconds) parts.push(`${m.duration_seconds}s`);
  if (m.detail) parts.push(`— ${m.detail}`);
  return parts.join(" ");
}

export function FinisherCard({ finisher }: { finisher: Finisher }) {
  return (
    <div className="border-t-2 border-accent-red bg-bg-primary p-4">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <Flame className="h-5 w-5 text-accent-red" />
        <h4 className="font-display text-2xl uppercase tracking-wide text-text-primary">
          {finisher.name}
        </h4>
        <Badge variant="orange" size="sm" className="font-mono normal-case">
          {finisher.format}
        </Badge>
        {finisher.duration_minutes && (
          <span className="font-mono text-xs text-text-muted">
            {finisher.duration_minutes} min
          </span>
        )}
        {finisher.rounds && (
          <span className="font-mono text-xs text-text-muted">{finisher.rounds} rounds</span>
        )}
      </div>
      <ul className="space-y-1">
        {finisher.movements.map((m, i) => (
          <li key={i} className="font-mono text-sm text-text-secondary">
            {movementLine(m)}
          </li>
        ))}
      </ul>
      {finisher.reps_scheme && (
        <p className="mt-2 font-mono text-xs text-accent-orange">Scheme: {finisher.reps_scheme}</p>
      )}
      {finisher.notes && (
        <p className="mt-2 font-body text-xs text-text-muted">{finisher.notes}</p>
      )}
    </div>
  );
}
