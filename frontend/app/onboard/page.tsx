"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WizardStepper } from "@/components/equipment-wizard/WizardStepper";
import { ExperienceGate } from "@/components/equipment-wizard/ExperienceGate";
import { CategorySelector, CATEGORY_META } from "@/components/equipment-wizard/CategorySelector";
import { ItemPicker } from "@/components/equipment-wizard/ItemPicker";
import { SummaryReview } from "@/components/equipment-wizard/SummaryReview";
import { GoalSelector } from "@/components/goals-form/GoalSelector";
import { SchedulePicker } from "@/components/goals-form/SchedulePicker";
import { LimitationsInput } from "@/components/goals-form/LimitationsInput";
import { PreferencesInput } from "@/components/goals-form/PreferencesInput";
import { api, getSessionEmail } from "@/lib/api";
import type {
  DaysPerWeek,
  Equipment,
  Experience,
  FinisherPreference,
  GenerationRequest,
  Goal,
  SessionLength,
  UserGoals,
  UserPreferences,
} from "@/lib/types";

const DEFAULT_DAYS: Record<Experience, DaysPerWeek> = {
  beginner: 3,
  intermediate: 4,
  advanced: 5,
};

const DRAFT_KEY = "foxtrot-wizard-draft";

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 0: experience
  const [experience, setExperience] = useState<Experience | null>(null);

  // Step 1: equipment
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentError, setEquipmentError] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Step 2: goals + preferences
  const [goal, setGoal] = useState<Goal>("balanced");
  const [days, setDays] = useState<DaysPerWeek>(4);
  const [minutes, setMinutes] = useState<SessionLength>(60);
  const [limitations, setLimitations] = useState("");
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [alternatives, setAlternatives] = useState<Record<string, string>>({});
  const [finisherStyle, setFinisherStyle] = useState<FinisherPreference>("mixed");
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    api
      .listEquipment()
      .then(setEquipment)
      .catch(() => setEquipmentError(true));
  }, []);

  // B1: restore draft on mount, then persist on every change
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setStep(d.step ?? 0);
        setExperience(d.experience ?? null);
        setSelectedIds(new Set(d.selectedIds ?? []));
        setGoal(d.goal ?? "balanced");
        setDays(d.days ?? 4);
        setMinutes(d.minutes ?? 60);
        setLimitations(d.limitations ?? "");
        setDislikes(d.dislikes ?? []);
        setAlternatives(d.alternatives ?? {});
        setFinisherStyle(d.finisherStyle ?? "mixed");
      }
    } catch {}
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        step,
        experience,
        selectedIds: Array.from(selectedIds),
        goal,
        days,
        minutes,
        limitations,
        dislikes,
        alternatives,
        finisherStyle,
      })
    );
  }, [restored, step, experience, selectedIds, goal, days, minutes, limitations, dislikes, alternatives, finisherStyle]);

  const categories = useMemo(() => {
    const order = Object.keys(CATEGORY_META);
    const grouped = equipment.reduce<Record<string, Equipment[]>>((acc, e) => {
      (acc[e.category] ??= []).push(e);
      return acc;
    }, {});
    return Object.entries(grouped).sort(
      ([a], [b]) => (order.indexOf(a) + 100) % 100 - ((order.indexOf(b) + 100) % 100)
    );
  }, [equipment]);

  function selectExperience(level: Experience) {
    setExperience(level);
    setDays(DEFAULT_DAYS[level]);
    setStep(1);
  }

  function toggleItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const goals: UserGoals = {
    primary: goal,
    experience: experience ?? "intermediate",
    days_per_week: days,
    session_length_minutes: minutes,
    limitations,
    finisher_preference: finisherStyle,
  };

  const preferences: UserPreferences = {
    dislikes,
    preferred_alternatives: alternatives,
    finisher_style: finisherStyle,
    goals: { primary: [goal], secondary: [] },
  };

  function generate() {
    if (!getSessionEmail()) {
      // generation requires auth; draft persists so they can resume after login
      router.push("/auth/login");
      return;
    }
    const request: GenerationRequest = {
      equipment_ids: Array.from(selectedIds),
      goals,
      preferences,
      user_level: experience ?? "intermediate",
    };
    sessionStorage.setItem("foxtrot-generation-request", JSON.stringify(request));
    sessionStorage.removeItem(DRAFT_KEY);
    router.push("/generate");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-28 md:pb-12">
      <div className="mb-10">
        <WizardStepper current={step} />
      </div>

      {step === 0 && <ExperienceGate value={experience} onSelect={selectExperience} />}

      {step === 1 && (
        <div className="animate-fade-in">
          <h1 className="mb-2 font-display text-4xl uppercase tracking-wide text-text-primary">
            Select Your <span className="text-accent-red">Gear</span>
          </h1>
          <p className="mb-6 font-body text-sm text-text-secondary">
            Your program is built around what you actually have. No equipment? Skip ahead —
            bodyweight works.
          </p>
          {equipmentError && (
            <p className="mb-4 border border-accent-red bg-accent-red/10 p-3 font-body text-sm text-text-primary">
              Couldn&apos;t load the equipment catalog. Check that the backend is running, or
              continue bodyweight-only.
            </p>
          )}
          <div className="space-y-3">
            {categories.map(([cat, items]) => (
              <CategorySelector
                key={cat}
                category={cat}
                itemCount={items.length}
                selectedCount={items.filter((i) => selectedIds.has(i.id)).length}
                expanded={expanded.has(cat)}
                onToggle={() =>
                  setExpanded((prev) => {
                    const next = new Set(prev);
                    next.has(cat) ? next.delete(cat) : next.add(cat);
                    return next;
                  })
                }
              >
                <ItemPicker
                  items={items}
                  selected={selectedIds}
                  onToggle={toggleItem}
                  onToggleAll={(ids, select) =>
                    setSelectedIds((prev) => {
                      const next = new Set(prev);
                      ids.forEach((id) => (select ? next.add(id) : next.delete(id)));
                      return next;
                    })
                  }
                  experience={experience ?? "intermediate"}
                />
              </CategorySelector>
            ))}
          </div>
        </div>
      )}

      {step === 2 && experience && (
        <div className="animate-fade-in space-y-8">
          <div>
            <h1 className="mb-2 font-display text-4xl uppercase tracking-wide text-text-primary">
              Set Your <span className="text-accent-red">Objectives</span>
            </h1>
            <p className="mb-6 font-body text-sm text-text-secondary">
              Every parameter shapes the program.
            </p>
            <h3 className="mb-3 font-display text-xl uppercase tracking-wide text-text-primary">
              Primary Goal
            </h3>
            <GoalSelector value={goal} onSelect={setGoal} />
          </div>
          <SchedulePicker
            experience={experience}
            days={days}
            minutes={minutes}
            onDaysChange={setDays}
            onMinutesChange={setMinutes}
          />
          <div>
            <h3 className="mb-3 font-display text-xl uppercase tracking-wide text-text-primary">
              Limitations & Preferences
            </h3>
          </div>
          <LimitationsInput value={limitations} onChange={setLimitations} />
          <PreferencesInput
            dislikes={dislikes}
            alternatives={alternatives}
            finisherStyle={finisherStyle}
            onDislikesChange={setDislikes}
            onAlternativesChange={setAlternatives}
            onFinisherStyleChange={setFinisherStyle}
          />
        </div>
      )}

      {step === 3 && experience && (
        <div className="animate-fade-in">
          <h1 className="mb-6 font-display text-4xl uppercase tracking-wide text-text-primary">
            Review <span className="text-accent-red">& Build</span>
          </h1>
          <SummaryReview
            experience={experience}
            equipment={equipment}
            selectedIds={selectedIds}
            goals={goals}
            preferences={preferences}
            onGenerate={generate}
          />
        </div>
      )}

      {/* Nav buttons (experience step advances on card click) */}
      {step > 0 && (
        <div className="mt-10 flex justify-between">
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < 3 && (
            <Button onClick={() => setStep(step + 1)}>
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
