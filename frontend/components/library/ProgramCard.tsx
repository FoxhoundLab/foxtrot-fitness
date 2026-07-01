"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeNameBadge } from "@/components/program-viewer/CodeNameBadge";
import { PillarChecklist } from "@/components/program-viewer/PillarChecklist";
import { cn, formatDifficultyColor } from "@/lib/utils";
import type { Program } from "@/lib/types";

export function ProgramCard({ program }: { program: Program }) {
  const date = new Date(program.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/program/${program.id}`} className="group block h-full">
      <div className="flex h-full flex-col rounded-sm border border-border-default bg-bg-secondary p-5 transition-all hover:border-border-active hover:shadow-glow-red">
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
