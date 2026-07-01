const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

import type {
  Equipment,
  Movement,
  Finisher,
  Program,
  GenerationRequest,
  GenerationResponse,
} from "./types";

export const api = {
  // Equipment
  listEquipment: () => apiFetch<Equipment[]>("/api/equipment"),

  // Movements
  listMovements: () => apiFetch<Movement[]>("/api/movements"),

  // Finishers
  listFinishers: () => apiFetch<Finisher[]>("/api/finishers"),

  // Programs
  listPrograms: () => apiFetch<Program[]>("/api/programs"),
  getProgram: (id: string) => apiFetch<Program>(`/api/programs/${id}`),
  saveProgram: (id: string) =>
    apiFetch<Program>(`/api/programs/${id}/save`, { method: "POST" }),
  deleteProgram: (id: string) =>
    apiFetch<void>(`/api/programs/${id}`, { method: "DELETE" }),
  listExamplePrograms: () => apiFetch<Program[]>("/api/programs/examples"),

  // Generation
  generateProgram: (request: GenerationRequest) =>
    apiFetch<GenerationResponse>("/api/generate", {
      method: "POST",
      body: JSON.stringify(request),
    }),

  // Auth
  requestMagicLink: (email: string) =>
    apiFetch<void>("/api/auth/request-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};