"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { FinisherPreference } from "@/lib/types";

const FINISHER_OPTIONS: { value: FinisherPreference; label: string; hint: string }[] = [
  { value: "metabolic", label: "Metabolic", hint: "Short, brutal, breathless" },
  { value: "volume", label: "Volume", hint: "Pump work, high reps" },
  { value: "mixed", label: "Mixed", hint: "Variety across the week" },
  { value: "none", label: "None", hint: "Skip finishers entirely" },
];

interface PreferencesInputProps {
  dislikes: string[];
  alternatives: Record<string, string>;
  finisherStyle: FinisherPreference;
  onDislikesChange: (d: string[]) => void;
  onAlternativesChange: (a: Record<string, string>) => void;
  onFinisherStyleChange: (f: FinisherPreference) => void;
}

export function PreferencesInput({
  dislikes,
  alternatives,
  finisherStyle,
  onDislikesChange,
  onAlternativesChange,
  onFinisherStyleChange,
}: PreferencesInputProps) {
  const [dislikeDraft, setDislikeDraft] = useState("");
  const [altFrom, setAltFrom] = useState("");
  const [altTo, setAltTo] = useState("");

  function addDislike() {
    const v = dislikeDraft.trim();
    if (v && !dislikes.includes(v)) onDislikesChange([...dislikes, v]);
    setDislikeDraft("");
  }

  function addAlternative() {
    const from = altFrom.trim();
    const to = altTo.trim();
    if (from && to) {
      onAlternativesChange({ ...alternatives, [from]: to });
      setAltFrom("");
      setAltTo("");
    }
  }

  return (
    <div className="space-y-6">
      {/* Dislikes tag input */}
      <div>
        <h3 className="mb-1 font-display text-xl uppercase tracking-wide text-text-primary">
          Movements You Hate
        </h3>
        <p className="mb-3 font-body text-xs text-text-muted">We&apos;ll keep them out.</p>
        <div className="flex gap-2">
          <Input
            value={dislikeDraft}
            onChange={(e) => setDislikeDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDislike())}
            placeholder="e.g., burpees"
          />
          <button
            onClick={addDislike}
            aria-label="Add dislike"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-border-default bg-bg-tertiary text-text-secondary hover:border-accent-red hover:text-accent-red"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        {dislikes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {dislikes.map((d) => (
              <span
                key={d}
                className="flex items-center gap-1.5 bg-bg-tertiary px-2.5 py-1 font-mono text-xs text-text-primary"
              >
                {d}
                <button
                  onClick={() => onDislikesChange(dislikes.filter((x) => x !== d))}
                  aria-label={`Remove ${d}`}
                  className="text-text-muted hover:text-accent-red"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Preferred alternatives */}
      <div>
        <h3 className="mb-1 font-display text-xl uppercase tracking-wide text-text-primary">
          Preferred Swaps
        </h3>
        <p className="mb-3 font-body text-xs text-text-muted">
          &quot;Instead of X, give me Y.&quot; Optional.
        </p>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <Input
            value={altFrom}
            onChange={(e) => setAltFrom(e.target.value)}
            placeholder="Instead of… (back squats)"
          />
          <Input
            value={altTo}
            onChange={(e) => setAltTo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAlternative())}
            placeholder="Give me… (goblet squats)"
          />
          <button
            onClick={addAlternative}
            aria-label="Add swap"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-border-default bg-bg-tertiary text-text-secondary hover:border-accent-red hover:text-accent-red"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        {Object.entries(alternatives).length > 0 && (
          <div className="mt-3 space-y-1.5">
            {Object.entries(alternatives).map(([from, to]) => (
              <div
                key={from}
                className="flex items-center gap-2 bg-bg-tertiary px-2.5 py-1.5 font-mono text-xs"
              >
                <span className="text-text-muted line-through">{from}</span>
                <span className="text-accent-red">→</span>
                <span className="flex-1 text-text-primary">{to}</span>
                <button
                  onClick={() => {
                    const next = { ...alternatives };
                    delete next[from];
                    onAlternativesChange(next);
                  }}
                  aria-label={`Remove swap ${from}`}
                  className="text-text-muted hover:text-accent-red"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Finisher preference */}
      <div>
        <h3 className="mb-3 font-display text-xl uppercase tracking-wide text-text-primary">
          Finisher Style
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FINISHER_OPTIONS.map(({ value, label, hint }) => (
            <button
              key={value}
              onClick={() => onFinisherStyleChange(value)}
              className={cn(
                "min-h-[64px] rounded-sm border p-3 text-left transition-all",
                finisherStyle === value
                  ? "border-accent-red bg-accent-red/10"
                  : "border-border-default bg-bg-tertiary hover:border-text-muted"
              )}
            >
              <span className="block font-display text-lg uppercase tracking-wide text-text-primary">
                {label}
              </span>
              <span className="block font-body text-[11px] text-text-muted">{hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
