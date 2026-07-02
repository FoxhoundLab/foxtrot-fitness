"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookmarkPlus, Eye, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CodeNameBadge } from "@/components/program-viewer/CodeNameBadge";
import { PillarChecklist } from "@/components/program-viewer/PillarChecklist";
import { api, ApiError, getSessionEmail } from "@/lib/api";
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

const REQUEST_KEY = "foxtrot-generation-request";
const DRAFT_KEY = "foxtrot-wizard-draft";

interface GenError {
  title: string;
  message: string;
  cta: "retry" | "wait";
}

function classifyError(e: unknown): GenError {
  if (e instanceof ApiError && e.status === 0) {
    return {
      title: "Generation Timed Out",
      message:
        "The AI took longer than expected. Your inputs are saved — retrying usually works.",
      cta: "retry",
    };
  }
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
    return {
      title: "Generation Failed",
      message:
        "The AI couldn't produce a valid program this time. This usually resolves on retry.",
      cta: "retry",
    };
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
  const [saveError, setSaveError] = useState<string | null>(null);

  const started = useRef(false);
  const inFlight = useRef<AbortController | null>(null);
  const cancelled = useRef(false);
  const startTime = useRef<number | null>(null);

  const run = useCallback(() => {
    const raw = sessionStorage.getItem(REQUEST_KEY);
    if (!raw) {
      router.replace("/onboard");
      return;
    }
    const request: GenerationRequest = JSON.parse(raw);

    setError(null);
    setPhase(0);
    setElapsed(0);
    startTime.current = Date.now();
    cancelled.current = false;

    const controller = new AbortController();
    inFlight.current = controller;

    api
      .generateProgram(request, { signal: controller.signal })
      .then((res) => {
        sessionStorage.removeItem(REQUEST_KEY);
        sessionStorage.removeItem(DRAFT_KEY); // wizard draft no longer needed
        setProgram(res.program);
      })
      .catch((e) => {
        if (cancelled.current) return; // user bailed; we're already navigating
        setError(classifyError(e));
      });
  }, [router]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
  }, [run]);

  // Tickers live in their own effect so StrictMode remounts / cancels can't freeze the UI
  const generating = !program && !error;
  useEffect(() => {
    if (!generating) return;
    if (startTime.current === null) startTime.current = Date.now();
    const phaseTicker = setInterval(
      () => setPhase((p) => Math.min(p + 1, PHASES.length - 1)),
      1800
    );
    const clock = setInterval(
      () => setElapsed(Math.floor((Date.now() - (startTime.current ?? Date.now())) / 1000)),
      1000
    );
    return () => {
      clearInterval(phaseTicker);
      clearInterval(clock);
    };
  }, [generating]);

  function cancel() {
    if (!window.confirm("Cancel this generation? Your wizard inputs are kept.")) return;
    cancelled.current = true;
    inFlight.current?.abort();
    router.push("/onboard");
  }

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
      setSaveError("Save failed — the program wasn't persisted. Sign in and try generating again.");
    }
  }

  const isSignedIn = !!getSessionEmail();

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="w-full max-w-md border border-accent-red/40 bg-bg-secondary p-8">
          <h1 className="mb-2 font-display text-4xl uppercase text-accent-red">{error.title}</h1>
          <p className="mb-6 font-body text-sm text-text-secondary">{error.message}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {error.cta === "retry" && (
              <>
                <Button onClick={run}>
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Link href="/onboard">
                  <Button variant="ghost">Edit Inputs</Button>
                </Link>
              </>
            )}
            {error.cta === "wait" && (
              <Link href="/library">
                <Button variant="secondary">Back to Library</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="mb-10 h-20 w-20 animate-pulse-red bg-accent-red" />
        <p className="mb-6 font-display text-xl uppercase tracking-[0.2em] text-text-primary">
          Generating <span className="font-mono text-accent-red">({elapsed}s)</span>
        </p>
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
        <Button variant="ghost" size="sm" onClick={cancel} className="mt-10">
          <X className="h-4 w-4" />
          Cancel
        </Button>
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
        ) : isSignedIn ? (
          <Button size="lg" onClick={save} className="shadow-glow-red-strong">
            <BookmarkPlus className="h-5 w-5" />
            Save Operation
          </Button>
        ) : (
          <Link href="/auth/login">
            <Button size="lg" variant="secondary">
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
