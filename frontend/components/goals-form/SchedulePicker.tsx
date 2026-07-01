"use client";

import { cn } from "@/lib/utils";
import type { DaysPerWeek, Experience, SessionLength } from "@/lib/types";

// Days available adapt to experience level
const DAYS_BY_EXPERIENCE: Record<Experience, DaysPerWeek[]> = {
  beginner: [3, 4],
  intermediate: [3, 4, 5],
  advanced: [3, 4, 5],
};

const SESSION_LENGTHS: SessionLength[] = [30, 45, 60, 75, 90];

interface SchedulePickerProps {
  experience: Experience;
  days: DaysPerWeek;
  minutes: SessionLength;
  onDaysChange: (d: DaysPerWeek) => void;
  onMinutesChange: (m: SessionLength) => void;
}

function OptionGrid<T extends number>({
  options,
  value,
  onChange,
  suffix,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  suffix: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "min-h-[52px] min-w-[72px] rounded-sm border px-4 transition-all",
            value === opt
              ? "border-accent-red bg-accent-red/10 shadow-glow-red"
              : "border-border-default bg-bg-tertiary hover:border-text-muted"
          )}
        >
          <span className="block font-display text-2xl text-text-primary">{opt}</span>
          <span className="block font-body text-[10px] uppercase tracking-wider text-text-muted">
            {suffix}
          </span>
        </button>
      ))}
    </div>
  );
}

export function SchedulePicker({
  experience,
  days,
  minutes,
  onDaysChange,
  onMinutesChange,
}: SchedulePickerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-display text-xl uppercase tracking-wide text-text-primary">
          Days Per Week
        </h3>
        <OptionGrid
          options={DAYS_BY_EXPERIENCE[experience]}
          value={days}
          onChange={onDaysChange}
          suffix="days"
        />
      </div>
      <div>
        <h3 className="mb-3 font-display text-xl uppercase tracking-wide text-text-primary">
          Session Length
        </h3>
        <OptionGrid
          options={SESSION_LENGTHS}
          value={minutes}
          onChange={onMinutesChange}
          suffix="min"
        />
      </div>
    </div>
  );
}
