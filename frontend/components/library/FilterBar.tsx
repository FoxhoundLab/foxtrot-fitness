"use client";

import { Select } from "@/components/ui/Select";

export interface LibraryFilters {
  goal: string;
  split: string;
  sort: "newest" | "oldest";
}

interface FilterBarProps {
  filters: LibraryFilters;
  goals: string[];
  splits: string[];
  onChange: (f: LibraryFilters) => void;
}

export function FilterBar({ filters, goals, splits, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="min-w-[160px] flex-1 sm:flex-none">
        <Select
          value={filters.goal}
          onChange={(e) => onChange({ ...filters, goal: e.target.value })}
          aria-label="Filter by goal"
        >
          <option value="">All Goals</option>
          {goals.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
      </div>
      <div className="min-w-[140px] flex-1 sm:flex-none">
        <Select
          value={filters.split}
          onChange={(e) => onChange({ ...filters, split: e.target.value })}
          aria-label="Filter by split"
        >
          <option value="">All Splits</option>
          {splits.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div className="min-w-[140px] flex-1 sm:flex-none">
        <Select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as "newest" | "oldest" })}
          aria-label="Sort"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </Select>
      </div>
    </div>
  );
}
