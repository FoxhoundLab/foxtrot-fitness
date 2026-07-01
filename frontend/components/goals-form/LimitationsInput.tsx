"use client";

import { Textarea } from "@/components/ui/Textarea";

export function LimitationsInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-1 font-display text-xl uppercase tracking-wide text-text-primary">
        Limitations
      </h3>
      <p className="mb-3 font-body text-xs text-text-muted">
        Injuries, movements to avoid, anything the program must respect.
      </p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., no box jumps, bad knees, rotator cuff injury"
      />
    </div>
  );
}
