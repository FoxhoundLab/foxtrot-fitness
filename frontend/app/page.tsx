import Image from "next/image";
import Link from "next/link";
import { Dumbbell, Target, Zap, ArrowRight } from "lucide-react";
import { CodeNameBadge } from "@/components/program-viewer/CodeNameBadge";
import { PillarChecklist } from "@/components/program-viewer/PillarChecklist";
import { cn, formatDifficultyColor } from "@/lib/utils";
import type { Program, PillarCoverage } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchExamplePrograms(): Promise<Program[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/programs/examples`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return res.json();
  } catch {
    return FALLBACK_PROGRAMS;
  }
}

// Fallback data — used if backend isn't running.
// Matches the seed data in backend/app/seed/example_programs.json.
const FALLBACK_PROGRAMS: Program[] = [
  {
    id: "genesis-protocol",
    user_id: null,
    name: "Genesis Protocol",
    goal_tag: "Foundational Strength & Movement Literacy",
    difficulty: "beginner",
    split: "4-day",
    user_level: "beginner",
    design_view: {
      days: [],
      finishers_used: [],
      pillars_covered: {
        strength: true,
        zone2: true,
        vo2max: false,
        mobility: true,
        recovery: true,
      },
    },
    execution_view: "",
    version: 1,
    is_active: false,
    is_example: true,
    created_at: "2026-07-01T00:00:00Z",
  },
  {
    id: "cobalt-fury",
    user_id: null,
    name: "Cobalt Fury",
    goal_tag: "High-Volume Hypertrophy & Metabolic Conditioning",
    difficulty: "intermediate",
    split: "4-day",
    user_level: "intermediate",
    design_view: {
      days: [],
      finishers_used: ["the-compression", "the-engine-burn", "the-genesis-chipper"],
      pillars_covered: {
        strength: true,
        zone2: true,
        vo2max: true,
        mobility: true,
        recovery: true,
      },
    },
    execution_view: "",
    version: 1,
    is_active: false,
    is_example: true,
    created_at: "2026-07-01T00:00:00Z",
  },
  {
    id: "sanguine-thunder",
    user_id: null,
    name: "Sanguine Thunder",
    goal_tag: "Hybrid Strength & Aerobic Capacity",
    difficulty: "intermediate",
    split: "4-day",
    user_level: "intermediate",
    design_view: {
      days: [],
      finishers_used: ["hiit-circuit"],
      pillars_covered: {
        strength: true,
        zone2: true,
        vo2max: true,
        mobility: true,
        recovery: true,
      },
    },
    execution_view: "",
    version: 1,
    is_active: false,
    is_example: true,
    created_at: "2026-07-01T00:00:00Z",
  },
];

function ProgramCard({ program }: { program: Program }) {
  const isGenesis = program.name.toLowerCase().includes("genesis");
  const pillars = program.design_view.pillars_covered;
  const pillarsPassed = Object.values(pillars).filter(Boolean).length;

  return (
    <Link href={`/program/${program.id}`} className="group block">
      <div
        className={cn(
          "relative h-full border border-border-default bg-bg-secondary p-6",
          "transition-all duration-200 hover:border-border-active hover:shadow-glow-red"
        )}
        style={{ borderRadius: "2px" }}
      >
        {/* START HERE badge for Genesis Protocol */}
        {isGenesis && (
          <div className="absolute -top-px -right-px bg-accent-green px-3 py-1 font-display text-xs uppercase tracking-widest text-bg-primary">
            Start Here
          </div>
        )}

        {/* Code-name badge */}
        <div className="mb-4">
          <CodeNameBadge name={program.name} size="lg" />
        </div>

        {/* Goal tag */}
        <p className="mb-4 font-body text-sm text-text-secondary">
          {program.goal_tag}
        </p>

        {/* Stats row */}
        <div className="mb-5 flex items-center gap-3">
          <span
            className={cn(
              "px-2 py-0.5 font-display text-xs uppercase tracking-wide",
              formatDifficultyColor(program.difficulty)
            )}
            style={{ borderRadius: "2px" }}
          >
            {program.difficulty}
          </span>
          <span className="font-mono text-sm text-text-secondary">
            {program.split}
          </span>
          <span className="font-mono text-sm text-text-muted">
            {pillarsPassed}/5 pillars
          </span>
        </div>

        {/* Pillar mini */}
        <PillarChecklist pillars={pillars} variant="compact" />

        {/* CTA */}
        <div className="mt-6 flex items-center gap-2 font-display text-sm uppercase tracking-wide text-accent-red transition-colors group-hover:text-accent-red-dark">
          <span>View Program</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function HowItWorksStep({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: string;
  icon: typeof Dumbbell;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex-1">
      <div className="mb-4 flex h-14 w-14 items-center justify-center border border-border-active bg-accent-red/10">
        <Icon className="h-7 w-7 text-accent-red" />
      </div>
      <div className="mb-1 font-display text-sm uppercase tracking-widest text-text-muted">
        Step {step}
      </div>
      <h3 className="mb-2 font-display text-2xl uppercase tracking-wide text-text-primary">
        {title}
      </h3>
      <p className="font-body text-sm text-text-secondary">{description}</p>
    </div>
  );
}

export default async function HomePage() {
  const programs = await fetchExamplePrograms();

  // Sort: Genesis Protocol first
  const sortedPrograms = [...programs].sort((a, b) => {
    const aGenesis = a.name.toLowerCase().includes("genesis") ? 0 : 1;
    const bGenesis = b.name.toLowerCase().includes("genesis") ? 0 : 1;
    return aGenesis - bGenesis;
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* === HERO === */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4">
        {/* Background glow effect + logo watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-accent-red/5 blur-[120px]" />
          <Image
            src="/foxtrot-logo.png"
            alt=""
            width={700}
            height={700}
            priority
            className="absolute h-[500px] w-[500px] object-contain opacity-[0.06] md:h-[700px] md:w-[700px]"
          />
        </div>

        <div className="relative z-10 max-w-4xl text-center">
          {/* Brand */}
          <p className="mb-6 font-display text-lg uppercase tracking-[0.3em] text-accent-red">
            Foxtrot Fitness
          </p>

          {/* Headline */}
          <h1 className="mb-6 font-display text-7xl uppercase leading-none tracking-wide text-text-primary sm:text-8xl md:text-9xl">
            Build Your
            <br />
            <span className="text-accent-red">Workout</span>
          </h1>

          {/* Subhead */}
          <p className="mx-auto mb-10 max-w-2xl font-body text-lg text-text-secondary sm:text-xl">
            Smart programming tailored to your equipment.
            Proper recovery built into every split.
          </p>

          {/* CTA */}
          <Link
            href="/onboard"
            className="inline-flex items-center gap-3 bg-accent-red px-10 py-4 font-display text-xl uppercase tracking-wider text-text-primary transition-all hover:bg-accent-red-dark hover:shadow-glow-red-strong animate-pulse-red"
            style={{ borderRadius: "2px" }}
          >
            Start Building
            <ArrowRight className="h-5 w-5" />
          </Link>

          {/* Stats bar */}
          <div className="mt-16 flex flex-col items-center justify-center gap-3 font-body text-xs text-text-muted sm:flex-row sm:gap-8 sm:text-sm">
            <span className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-accent-orange" />
              130+ Equipment Types
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent-orange" />
              Unique Finishers
            </span>
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent-orange" />
              5-Pillar Validation
            </span>
          </div>
        </div>
      </section>

      {/* === EXAMPLE PROGRAMS === */}
      <section className="border-t border-border-default px-4 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="mb-12">
            <h2 className="font-display text-5xl uppercase tracking-wide text-text-primary">
              Example Programs
            </h2>
            <div className="mt-2 h-1 w-24 bg-accent-red" />
            <p className="mt-4 font-body text-base text-text-secondary">
              Three programs. Three intensities. Every one validated against
              the 5-pillar blueprint.
            </p>
          </div>

          {/* Program cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="border-t border-border-default px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="font-display text-5xl uppercase tracking-wide text-text-primary">
              How It Works
            </h2>
            <div className="mt-2 h-1 w-24 bg-accent-red" />
          </div>

          <div className="flex flex-col gap-12 md:flex-row md:gap-8">
            <HowItWorksStep
              step="01"
              icon={Dumbbell}
              title="Select Your Gear"
              description="Pick from barbells, dumbbells, machines, bodyweight gear, and more. Your program is built around what you actually have."
            />
            <HowItWorksStep
              step="02"
              icon={Target}
              title="Set Your Goals"
              description="Choose your experience level, training days, focus areas, and limitations. Every parameter shapes the output."
            />
            <HowItWorksStep
              step="03"
              icon={Zap}
              title="Get Your Program"
              description="AI generates a named program with movements, tempos, finishers — validated against the 5-pillar blueprint. Copy-paste ready."
            />
          </div>

          {/* CTA bar */}
          <div className="mt-16 border border-border-default bg-bg-secondary p-8 text-center">
            <p className="mb-4 font-display text-3xl uppercase tracking-wide text-text-primary">
              Ready to Deploy?
            </p>
            <p className="mb-6 font-body text-sm text-text-secondary">
              Your workout is one click away.
            </p>
            <Link
              href="/onboard"
              className="inline-flex items-center gap-3 bg-accent-red px-8 py-3 font-display text-lg uppercase tracking-wider text-text-primary transition-all hover:bg-accent-red-dark hover:shadow-glow-red"
              style={{ borderRadius: "2px" }}
            >
              Build Your Workout
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}