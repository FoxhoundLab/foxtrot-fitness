// TypeScript types mirroring backend Pydantic schemas

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Goal = "strength" | "hypertrophy" | "conditioning" | "balanced" | "longevity" | "hybrid";
export type Experience = "beginner" | "intermediate" | "advanced";
export type DaysPerWeek = 3 | 4 | 5;
export type SessionLength = 30 | 45 | 60 | 75 | 90;
export type FinisherPreference = "metabolic" | "volume" | "mixed" | "none";
export type FocusArea =
  | "legs"
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "full_body"
  | "core";

export interface UserGoals {
  primary: Goal;
  experience: Experience;
  days_per_week: DaysPerWeek;
  session_length_minutes: SessionLength;
  limitations: string;
  finisher_preference: FinisherPreference;
}

export interface UserPreferences {
  dislikes: string[];
  preferred_alternatives: Record<string, string>;
  finisher_style: FinisherPreference;
  goals: {
    primary: string[];
    secondary: string[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  equipment_ids: string[];
  goals: UserGoals;
  preferences: UserPreferences;
  user_level: Experience;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  category: string;
  name: string;
  aliases: string[];
  requires: string[];
  paired_with: string[];
  movements: string[];
  icon: string | null;
}

export interface Movement {
  id: string;
  name: string;
  aliases: string[];
  equipment_required: string[];
  muscle_groups: string[];
  movement_pattern: string;
  difficulty: Difficulty;
  tempo_default: string;
  alternatives: string[];
  contraindications: string[];
}

export interface Finisher {
  id: string;
  name: string;
  format: string;
  duration_minutes: number | null;
  rounds: number | null;
  rest_between_rounds: number | null;
  reps_scheme: string | null;
  movements: FinisherMovement[];
  equipment_required: string[];
  type: string;
  difficulty: Difficulty;
  notes: string | null;
}

export interface FinisherMovement {
  name?: string;
  minute?: number;
  reps?: number | string;
  distance_meters?: number;
  duration_seconds?: number;
  detail?: string;
}

export interface ProgramMovement {
  name: string;
  sets: number;
  reps: string;
  tempo: string;
  rest_seconds: number;
  notes: string | null;
}

export interface ProgramCardio {
  type: "zone-2" | "vo2-max" | "hiit";
  duration_minutes: number;
  equipment: string | null;
  notes: string | null;
}

export interface ProgramDay {
  day: number;
  name: string;
  movements: ProgramMovement[];
  finisher: Finisher | null;
  cardio: ProgramCardio | null;
  mobility: string | null;
}

export interface PillarCoverage {
  strength: boolean;
  zone2: boolean;
  vo2max: boolean;
  mobility: boolean;
  recovery: boolean;
}

export interface ProgramDesignView {
  days: ProgramDay[];
  finishers_used: string[];
  pillars_covered: PillarCoverage;
}

export interface Program {
  id: string;
  user_id: string | null;
  name: string;
  goal_tag: string;
  difficulty: Difficulty;
  split: string;
  user_level: Experience;
  design_view: ProgramDesignView;
  execution_view: string;
  version: number;
  is_active: boolean;
  is_example: boolean;
  created_at: string;
}

export interface GenerationRequest {
  equipment_ids: string[];
  goals: UserGoals;
  preferences: UserPreferences;
  user_level: Experience;
}

export interface GenerationResponse {
  program: Program;
}