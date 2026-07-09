"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookmarkPlus, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CodeNameBadge } from "@/components/program-viewer/CodeNameBadge";
import { PillarChecklist } from "@/components/program-viewer/PillarChecklist";
import { api, ApiError, getSessionEmail } from "@/lib/api";
import {
  cn,
  GENERATED_PROGRAM_KEY,
  LAST_REQUEST_KEY,
  WIZARD_DRAFT_KEY,
} from "@/lib/utils";
import type { GenerationRequest, Program } from "@/lib/types";

const PHASES = [
  "ANALYZING EQUIPMENT...",
  "DESIGNING SPLIT...",
  "ASSIGNING TEMPOS...",
  "MATCHING FINISHERS...",
  "VALIDATING 5 PILLARS...",
  "ASSIGNING CODE-NAME...",
];

interface GenError {
  title: string;
  message: string;
  cta: "retry" | "wait";
}

function classifyError(e: unknown, equipmentCount?: number): GenError {
  if (e instanceof ApiError && e.status === 429) {
    return {
      title: "Rate Limit Reached",
      message: e.message + ". Take a rest day — try again in an hour.",
      cta: "wait",
    };
  }
  if (e instanceof ApiError && e.status === 503) {
    return {
      title: "Generator Offline",
      message:
        "The AI service isn't configured on this server yet. This isn't your fault — contact the admin.",
      cta: "wait",
    };
  }
  if (e instanceof ApiError) {
    let message =
      "The AI couldn't produce a valid program this time. This usually resolves on retry.";
    if (equipmentCount && equipmentCount > 10) {
      message += " You selected a lot of equipment — try with fewer pieces for faster generation.";
    }
    return { title: "Generation Failed", message, cta: "retry" };
  }
  return {
    title: "Can't Reach the Server",
    message:
      "The backend isn't responding. Check your connection (or that the API is running) and retry.",
    cta: "retry",
  };
}

export default function GeneratePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [program, setProgram] = useState<Program | null>(null);
  const [error, setError] = useState<GenError | null>(null);
  const [saved, setSaved] = useState(false);
  const started = useRef(false);

  // Animation timers live in their own effect so React Strict Mode's
  // mount → cleanup → remount cycle doesn't kill them while the (guarded,
  // run-once) generation request is still in flight.
  const done = !!program || !!error;
  useEffect(() => {
    if (done) return;
    const ticker = setInterval(
      () => setPhase((p) => Math.min(p + 1, PHASES.length - 1)),
      1800
    );
    const clock = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      clearInterval(ticker);
      clearInterval(clock);
    };
  }, [done]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const raw = sessionStorage.getItem("foxtrot-generation-request");
    if (!raw) {
      router.replace("/onboard");
      return;
    }
    const request: GenerationRequest = JSON.parse(raw);

    api
      .generateProgram(request)
      .then((res) => {
        sessionStorage.removeItem("foxtrot-generation-request");
        sessionStorage.setItem(GENERATED_PROGRAM_KEY, JSON.stringify(res.program));
        sessionStorage.setItem(
          LAST_REQUEST_KEY,
          JSON.stringify({ programId: res.program.id, request })
        );
        setProgram(res.program);
      })
      .catch((e) => {
        // Restore the wizard draft so "Back to Wizard" lands on the filled-in
        // review step instead of an empty step 0 — no input loss on failure
        try {
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
        } catch {}
        setError(classifyError(e, request.equipment_ids.length));
      });
  }, [router]);

  const [saveError, setSaveError] = useState<string | null>(null);

  async function save() {
    if (!program) return;
    if (!getSessionEmail()) {
      router.push(`/auth/login?returnTo=${encodeURIComponent(`/program/${program.id}`)}`);
      return;
    }
    try {
      await api.saveProgram(program.id);
      setSaved(true);
    } catch {
      setSaveError("Save failed — the program wasn't persisted. Sign in and try generating again.");
    }
  }

  const isSignedIn = !!getSessionEmail();

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 font-display text-4xl uppercase text-accent-red">{error.title}</h1>
        <p className="mb-6 max-w-md font-body text-sm text-text-secondary">{error.message}</p>
        {error.cta === "retry" && (
          <Link href="/onboard">
            <Button variant="secondary">
              <RefreshCw className="h-4 w-4" />
              Back to Wizard
            </Button>
          </Link>
        )}
        {error.cta === "wait" && (
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/onboard">
              <Button variant="secondary">
                <RefreshCw className="h-4 w-4" />
                Back to Wizard
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="ghost">Back to Library</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (!program) {
    const finalPhase = phase === PHASES.length - 1;
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
                // Final phase loops a subtle pulse so a long generation
                // doesn't look frozen once the ticker runs out of phases
                i === phase && finalPhase && "animate-pulse",
                i > phase && "text-text-muted/40"
              )}
            >
              {label}
            </p>
          ))}
        </div>
        <p className="mt-8 font-mono text-xs text-text-muted">
          ELAPSED: {elapsed}s{finalPhase ? " — still working, hang tight" : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center animate-fade-in">
      <p className="mb-4 font-display text-lg uppercase tracking-[0.3em] text-text-muted">
        Program Ready
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
        ) : isSignedIn ? (
          <Button size="lg" onClick={save} className="shadow-glow-red-strong">
            <BookmarkPlus className="h-5 w-5" />
            Save Program
          </Button>
        ) : (
          <Link href={`/auth/login?returnTo=${encodeURIComponent(`/program/${program.id}`)}`}>
            <Button size="lg" className="shadow-glow-red-strong">
              <BookmarkPlus className="h-5 w-5" />
              Sign In to Save
            </Button>
          </Link>
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
