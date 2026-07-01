import { DayCard } from "./DayCard";
import type { ProgramDesignView } from "@/lib/types";

export function DesignView({ design }: { design: ProgramDesignView }) {
  if (design.days.length === 0) {
    return (
      <p className="py-12 text-center font-body text-sm text-text-muted">
        No structured days available for this program.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly overview strip */}
      <div className="flex flex-wrap gap-2">
        {design.days.map((d) => (
          <a
            key={d.day}
            href={`#day-${d.day}`}
            className="rounded-sm border border-border-default bg-bg-secondary px-3 py-2 font-display text-sm uppercase tracking-wide text-text-secondary transition-colors hover:border-border-active hover:text-text-primary"
          >
            Day {d.day} · {d.name}
          </a>
        ))}
      </div>

      <div className="space-y-6">
        {design.days.map((d) => (
          <div key={d.day} id={`day-${d.day}`} className="scroll-mt-20">
            <DayCard day={d} />
          </div>
        ))}
      </div>
    </div>
  );
}
