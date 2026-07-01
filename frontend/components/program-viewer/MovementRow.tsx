import { cn, formatTempo } from "@/lib/utils";
import type { ProgramMovement } from "@/lib/types";

export function MovementRow({ movement }: { movement: ProgramMovement }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border-default/50 py-2.5 last:border-b-0">
      <span className="min-w-0 flex-1 font-body text-sm text-text-primary">
        {movement.name}
      </span>
      <span className="font-mono text-sm text-text-primary">
        {movement.sets}x{movement.reps}
      </span>
      {movement.tempo && movement.tempo !== "static" && (
        <span className="rounded-sm bg-accent-orange px-1.5 py-0.5 font-mono text-xs font-bold text-bg-primary">
          {formatTempo(movement.tempo)}
        </span>
      )}
      <span className="font-mono text-xs text-text-muted">
        {movement.rest_seconds}s rest
      </span>
      {movement.notes && (
        <span className={cn("w-full font-body text-xs text-text-secondary")}>
          {movement.notes}
        </span>
      )}
    </div>
  );
}
