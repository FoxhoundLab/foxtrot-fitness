"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookmarkPlus, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CodeNameBadge } from "@/components/program-viewer/CodeNameBadge";
import { PillarChecklist } from "@/components/program-viewer/PillarChecklist";
import { api, getSessionEmail } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { GenerationRequest, Program } from "@/lib/types";

const PHASES = [
  "ANALYZING EQUIPMENT...",
  "DESIGNING SPLIT...",
  "ASSIGNING TEMPOS...",
  "MATCHING FINISHERS...",
  "VALIDATING 5 PILLARS...",
  "ASSIGNING CODE-NAME...",
];

export default function GeneratePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [program, setProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const raw = sessionStorage.getItem("foxtrot-generation-request");
    if (!raw) {
      router.replace("/onboard");
      return;
    }
    const request: GenerationRequest = JSON.parse(raw);

    const ticker = setInterval(
      () => setPhase((p) => Math.min(p + 1, PHASES.length - 1)),
      1800
    );

    api
      .generateProgram(request)
      .then((res) => {
        sessionStorage.removeItem("foxtrot-generation-request");
        setProgram(res.program);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Generation failed"))
      .finally(() => clearInterval(ticker));

    return () => clearInterval(ticker);
  }, [router]);

  const [saveError, setSaveError] = useState<string | null>(null);

  async function save() {
    if (!program) return;
    if (!getSessionEmail()) {
      router.push("/auth/login");
      return;
    }
    try {
      await api.saveProgram(program.id);
      setSaved(true);
    } catch {
      setSaveError("Save failed — check that you're signed in and try again.");
    }
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 font-display text-4xl uppercase text-accent-red">Generation Failed</h1>
        <p className="mb-6 max-w-md font-body text-sm text-text-secondary">{error}</p>
        <Link href="/onboard">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </Link>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="mb-10 h-20 w-20 animate-pulse-red bg-accent-red" />
        <div className="space-y-2 text-center">
          {PHASES.map((label, i) => (
            <p
              key={label}
              className={cn(
                "font-mono text-sm transition-all duration-500",
                i < phase && "text-text-muted line-through",
                i === phase && "text-accent-red",
                i > phase && "text-text-muted/40"
              )}
            >
              {label}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center animate-fade-in">
      <p className="mb-4 font-display text-lg uppercase tracking-[0.3em] text-text-muted">
        Operation Ready
      </p>
      <CodeNameBadge name={program.name} size="xl" className="mb-6" />
      <p className="mb-8 max-w-md font-body text-base text-text-secondary">{program.goal_tag}</p>
      <PillarChecklist
        pillars={program.design_view.pillars_covered}
        variant="full"
        className="mb-10"
      />
      {saveError && (
        <p className="mb-4 font-body text-sm text-accent-red">{saveError}</p>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        {saved ? (
          <Link href="/library">
            <Button size="lg">
              <Eye className="h-5 w-5" />
              View Library
            </Button>
          </Link>
        ) : (
          <Button size="lg" onClick={save} className="shadow-glow-red-strong">
            <BookmarkPlus className="h-5 w-5" />
            Save Operation
          </Button>
        )}
        <Link href={`/program/${program.id}`}>
          <Button variant="secondary" size="lg">
            <Eye className="h-5 w-5" />
            View Program
          </Button>
        </Link>
        <Link href="/onboard">
          <Button variant="ghost" size="lg">
            <RefreshCw className="h-5 w-5" />
            Refine
          </Button>
        </Link>
      </div>
    </div>
  );
}
