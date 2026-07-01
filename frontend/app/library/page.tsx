"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FolderOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgramCard } from "@/components/library/ProgramCard";
import { FilterBar, type LibraryFilters } from "@/components/library/FilterBar";
import { api, getSessionEmail } from "@/lib/api";
import type { Program } from "@/lib/types";

export default function LibraryPage() {
  const [programs, setPrograms] = useState<Program[] | null>(null);
  const [error, setError] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [filters, setFilters] = useState<LibraryFilters>({ goal: "", split: "", sort: "newest" });

  useEffect(() => {
    if (!getSessionEmail()) {
      setSignedOut(true);
      return;
    }
    api
      .listPrograms()
      .then(setPrograms)
      .catch(() => setError(true));
  }, []);

  const goals = useMemo(
    () => Array.from(new Set((programs ?? []).map((p) => p.goal_tag))).sort(),
    [programs]
  );
  const splits = useMemo(
    () => Array.from(new Set((programs ?? []).map((p) => p.split))).sort(),
    [programs]
  );

  const filtered = useMemo(() => {
    let list = programs ?? [];
    if (filters.goal) list = list.filter((p) => p.goal_tag === filters.goal);
    if (filters.split) list = list.filter((p) => p.split === filters.split);
    return [...list].sort((a, b) => {
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return filters.sort === "newest" ? diff : -diff;
    });
  }, [programs, filters]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 md:pb-12">
      <div className="mb-8">
        <h1 className="font-display text-5xl uppercase tracking-wide text-text-primary">
          Program <span className="text-accent-red">Library</span>
        </h1>
        <div className="mt-2 h-1 w-24 bg-accent-red" />
      </div>

      {signedOut && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <LogIn className="mb-4 h-12 w-12 text-text-muted" />
          <h2 className="mb-2 font-display text-3xl uppercase text-text-primary">
            Sign In Required
          </h2>
          <p className="mb-6 font-body text-sm text-text-secondary">
            Your saved programs live behind the wire. Sign in to access them.
          </p>
          <Link href="/auth/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      )}

      {error && (
        <div className="border border-accent-red bg-accent-red/10 p-4 font-body text-sm text-text-primary">
          Couldn&apos;t load your library. Check that the backend is running.
        </div>
      )}

      {!error && !signedOut && programs === null && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-12 w-12 animate-pulse-red bg-accent-red" />
        </div>
      )}

      {programs !== null && programs.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <FolderOpen className="mb-4 h-12 w-12 text-text-muted" />
          <h2 className="mb-2 font-display text-3xl uppercase text-text-primary">
            No Programs Yet
          </h2>
          <p className="mb-6 font-body text-sm text-text-secondary">
            Generate your first program and it lands here.
          </p>
          <Link href="/onboard">
            <Button size="lg" className="animate-pulse-red">
              Start Building
            </Button>
          </Link>
        </div>
      )}

      {programs !== null && programs.length > 0 && (
        <>
          <div className="mb-6">
            <FilterBar filters={filters} goals={goals} splits={splits} onChange={setFilters} />
          </div>
          {filtered.length === 0 ? (
            <p className="py-12 text-center font-body text-sm text-text-muted">
              No programs match those filters.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
