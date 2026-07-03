"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { CodeNameBadge } from "@/components/program-viewer/CodeNameBadge";
import { PillarChecklist } from "@/components/program-viewer/PillarChecklist";
import { DesignView } from "@/components/program-viewer/DesignView";
import { ExecutionView } from "@/components/program-viewer/ExecutionView";
import { api } from "@/lib/api";
import { cn, formatDifficultyColor } from "@/lib/utils";
import type { Program } from "@/lib/types";

export default function ProgramPage({ params }: { params: { id: string } }) {
  const [program, setProgram] = useState<Program | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("design");

  useEffect(() => {
    api
      .getProgram(params.id)
      .then(setProgram)
      .catch(() => setError(true));
  }, [params.id]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 font-display text-4xl uppercase text-accent-red">Program Not Found</h1>
        <p className="mb-6 font-body text-sm text-text-secondary">
          This program doesn&apos;t exist, or the backend isn&apos;t reachable.
        </p>
        <Link
          href="/library"
          className="flex items-center gap-2 font-display uppercase tracking-wide text-text-primary hover:text-accent-red"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Library
        </Link>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-6 h-4 w-20" />
        <Skeleton className="mb-4 h-12 w-64" />
        <Skeleton className="mb-2 h-4 w-96 max-w-full" />
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="mb-8 h-6 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-28 md:pb-12">
      {/* Header */}
      <div className="no-print mb-4">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-text-muted hover:text-text-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Library
        </Link>
      </div>
      <header className="mb-8">
        <CodeNameBadge name={program.name} size="lg" className="mb-3" />
        <p className="mb-4 font-body text-base text-text-secondary">{program.goal_tag}</p>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-sm px-2 py-0.5 font-display text-xs uppercase tracking-wide",
              formatDifficultyColor(program.difficulty)
            )}
          >
            {program.difficulty}
          </span>
          <span className="font-mono text-sm text-text-secondary">{program.split}</span>
          <span className="font-mono text-xs text-text-muted">v{program.version}</span>
        </div>
        <PillarChecklist pillars={program.design_view.pillars_covered} variant="compact" />
      </header>

      {/* View toggle */}
      <Tabs
        tabs={[
          { value: "design", label: "Design View" },
          { value: "execution", label: "Execution View" },
        ]}
        value={tab}
        onChange={setTab}
        className="no-print mb-6"
      />

      {tab === "design" ? (
        <DesignView design={program.design_view} />
      ) : (
        <ExecutionView content={program.execution_view} />
      )}
    </div>
  );
}
