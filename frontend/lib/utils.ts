import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTempo(tempo: string): string {
  return tempo;
}

export function formatDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "beginner":
      return "bg-accent-green text-bg-primary";
    case "intermediate":
      return "bg-accent-orange text-bg-primary";
    case "advanced":
      return "bg-accent-red text-text-primary";
    default:
      return "bg-bg-tertiary text-text-primary";
  }
}

export function formatBadgeColor(programName: string): string {
  const name = programName.toLowerCase();
  if (name.includes("crimson")) return "bg-badge-crimson";
  if (name.includes("cobalt")) return "bg-badge-cobalt";
  if (name.includes("sanguine")) return "bg-badge-sanguine";
  if (name.includes("genesis")) return "bg-badge-genesis";
  return "bg-accent-red";
}