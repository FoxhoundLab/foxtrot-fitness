const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SESSION_KEY = "foxtrot-user-email";
const TOKEN_KEY = "foxtrot-session-jwt";

export function getSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(email: string, token: string) {
  localStorage.setItem(SESSION_KEY, email);
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getSessionToken();
  const email = getSessionEmail();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      // JWT is the real auth; X-User-Email only works as a dev-mode fallback
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : email
          ? { "X-User-Email": email }
          : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      detail = (await res.json()).detail ?? detail;
    } catch {}
    throw new ApiError(res.status, detail);
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
  // Persist a client-held program (anonymous generation saved after sign-in)
  createProgram: (program: Program) =>
    apiFetch<Program>("/api/programs", {
      method: "POST",
      body: JSON.stringify({
        name: program.name,
        goal_tag: program.goal_tag,
        difficulty: program.difficulty,
        split: program.split,
        user_level: program.user_level,
        design_view: program.design_view,
        execution_view: program.execution_view,
      }),
    }),
  deleteProgram: (id: string) =>
    apiFetch<void>(`/api/programs/${id}`, { method: "DELETE" }),
  listExamplePrograms: () => apiFetch<Program[]>("/api/programs/examples"),

  // Generation
  generateProgram: (request: GenerationRequest) =>
    apiFetch<GenerationResponse>("/api/generate", {
      method: "POST",
      body: JSON.stringify(request),
    }),

  // Auth — backend expects email/token as query params
  requestMagicLink: (email: string, returnTo?: string) =>
    apiFetch<{ message: string; dev_link?: string }>(
      `/api/auth/request-link?email=${encodeURIComponent(email)}` +
        (returnTo ? `&return_to=${encodeURIComponent(returnTo)}` : ""),
      { method: "POST" }
    ),
  verifyToken: (token: string, returnTo?: string) =>
    apiFetch<{ email: string; token: string; status: string; return_to?: string | null }>(
      `/api/auth/verify?token=${encodeURIComponent(token)}` +
        (returnTo ? `&return_to=${encodeURIComponent(returnTo)}` : ""),
      { method: "POST" }
    ),
};
