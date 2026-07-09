"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookmarkPlus, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { CodeNameBadge } from "@/components/program-viewer/CodeNameBadge";
import { PillarChecklist } from "@/components/program-viewer/PillarChecklist";
import { DesignView } from "@/components/program-viewer/DesignView";
import { ExecutionView } from "@/components/program-viewer/ExecutionView";
import { api, getSessionEmail } from "@/lib/api";
import {
  cn,
  formatDifficultyColor,
  GENERATED_PROGRAM_KEY,
  LAST_REQUEST_KEY,
  WIZARD_DRAFT_KEY,
} from "@/lib/utils";
import type { GenerationRequest, Program } from "@/lib/types";

function readLocalProgram(id: string): Program | null {
  try {
    const raw = sessionStorage.getItem(GENERATED_PROGRAM_KEY);
    if (!raw) return null;
    const program: Program = JSON.parse(raw);
    return program.id === id ? program : null;
  } catch {
    return null;
  }
}

export default function ProgramPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  // "local" = generated this session but not persisted server-side yet
  const [source, setSource] = useState<"api" | "local">("api");
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("design");
  const [justSaved, setJustSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getProgram(params.id)
      .then((p) => {
        setProgram(p);
        setSource("api");
      })
      .catch(() => {
        // Not in the DB — an anonymous generation lives only in this browser
        const local = readLocalProgram(params.id);
        if (local) {
          setProgram(local);
          setSource("local");
        } else {
          setError(true);
        }
      });
  }, [params.id]);

  const isSignedIn = !!getSessionEmail();

  async function saveToLibrary() {
    if (!program) return;
    setSaveError(null);
    try {
      const saved = await api.createProgram(program);
      sessionStorage.setItem(GENERATED_PROGRAM_KEY, JSON.stringify(saved));
      setProgram(saved);
      setSource("api");
      setJustSaved(true);
      router.replace(`/program/${saved.id}`);
    } catch {
      setSaveError("Save failed — check that you're still signed in and try again.");
    }
  }

  function editAndRegenerate() {
    if (!program) return;
    try {
      const raw = sessionStorage.getItem(LAST_REQUEST_KEY);
      if (raw) {
        const stored: { programId: string; request: GenerationRequest } = JSON.parse(raw);
        if (stored.programId === params.id || stored.programId === program.id) {
          const { request } = stored;
          sessionStorage.setItem(
            WIZARD_DRAFT_KEY,
            JSON.stringify({
              step: 3,
              experience: request.user_level,
              selectedIds: request.equipment_ids,
              goal: request.goals.primary,
              days: request.goals.days_per_week,
              minutes: request.goals.session_length_minutes,
              limitations: request.goals.limitations,
              dislikes: request.preferences.dislikes,
              alternatives: request.preferences.preferred_alternatives,
              finisherStyle: request.goals.finisher_preference,
            })
          );
        }
      }
    } catch {}
    router.push("/onboard");
  }

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-pulse-red bg-accent-red" />
      </div>
    );
  }

  const showSave = source === "local" && !program.is_example;

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

        {/* Action row */}
        <div className="no-print mt-6 flex flex-wrap items-center gap-3">
          {justSaved && (
            <span className="inline-flex items-center gap-2 font-body text-sm text-accent-green">
              <CheckCircle2 className="h-4 w-4" /> Saved to your library
            </span>
          )}
          {!justSaved && showSave && isSignedIn && (
            <Button onClick={saveToLibrary} className="shadow-glow-red-strong">
              <BookmarkPlus className="h-4 w-4" />
              Save to Library
            </Button>
          )}
          {!justSaved && showSave && !isSignedIn && (
            <Link href={`/auth/login?returnTo=${encodeURIComponent(`/program/${program.id}`)}`}>
              <Button className="shadow-glow-red-strong">
                <BookmarkPlus className="h-4 w-4" />
                Sign In to Save
              </Button>
            </Link>
          )}
          {!program.is_example && (
            <Button variant="secondary" onClick={editAndRegenerate}>
              <RefreshCw className="h-4 w-4" />
              Edit Inputs &amp; Regenerate
            </Button>
          )}
        </div>
        {saveError && (
          <p className="no-print mt-3 font-body text-sm text-accent-red">{saveError}</p>
        )}
        {source === "local" && !justSaved && (
          <p className="no-print mt-3 font-body text-xs text-text-muted">
            This program isn&apos;t saved yet — it lives only in this browser session.
          </p>
        )}
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
