"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Trash2, X } from "lucide-react";
import { CodeNameBadge } from "@/components/program-viewer/CodeNameBadge";
import { PillarChecklist } from "@/components/program-viewer/PillarChecklist";
import { cn, formatDifficultyColor } from "@/lib/utils";
import type { Program } from "@/lib/types";

interface ProgramCardProps {
  program: Program;
  onDelete?: (id: string) => Promise<void>;
}

export function ProgramCard({ program, onDelete }: ProgramCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const date = new Date(program.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  async function confirmDelete(e: React.MouseEvent) {
    e.preventDefault();
    setDeleting(true);
    try {
      await onDelete?.(program.id);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <Link href={`/program/${program.id}`} className="group block h-full">
      <div className="relative flex h-full flex-col rounded-sm border border-border-default bg-bg-secondary p-5 transition-all hover:border-border-active hover:shadow-glow-red">
        {onDelete && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
            {confirming ? (
              <>
                <span className="mr-1 font-display text-xs uppercase tracking-wider text-accent-red">
                  Delete?
                </span>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  aria-label="Confirm delete"
                  className="flex h-8 w-8 items-center justify-center bg-accent-red text-text-primary hover:bg-accent-red-dark disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setConfirming(false);
                  }}
                  aria-label="Cancel delete"
                  className="flex h-8 w-8 items-center justify-center border border-border-default text-text-secondary hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setConfirming(true);
                }}
                aria-label={`Delete ${program.name}`}
                className="flex h-8 w-8 items-center justify-center text-text-muted opacity-0 transition-opacity hover:text-accent-red focus:opacity-100 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        <div className="mb-3">
          <CodeNameBadge name={program.name} size="md" />
        </div>
        <p className="mb-4 flex-1 font-body text-sm text-text-secondary">{program.goal_tag}</p>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-sm px-2 py-0.5 font-display text-xs uppercase tracking-wide",
              formatDifficultyColor(program.difficulty)
            )}
          >
            {program.difficulty}
          </span>
          <span className="font-mono text-xs text-text-secondary">{program.split}</span>
          <span className="font-mono text-xs text-text-muted">{date}</span>
        </div>
        <div className="flex items-center justify-between">
          <PillarChecklist pillars={program.design_view.pillars_covered} variant="compact" />
          <ArrowRight className="h-4 w-4 text-accent-red transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
