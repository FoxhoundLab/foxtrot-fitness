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

export interface ApiFetchOptions extends RequestInit {
  /** Per-call timeout; defaults to 30s. Slow endpoints (generation) override. */
  timeoutMs?: number;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { timeoutMs = 30_000, signal, ...rest } = options;
  const token = getSessionToken();
  const email = getSessionEmail();

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const finalSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        // JWT is the real auth; X-User-Email only works as a dev-mode fallback
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : email
            ? { "X-User-Email": email }
            : {}),
        ...rest.headers,
      },
      signal: finalSignal,
      ...rest,
    });
  } catch (e) {
    if (timeoutSignal.aborted) throw new ApiError(0, "Request timed out");
    throw e; // caller abort or genuine network failure
  }

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
  deleteProgram: (id: string) =>
    apiFetch<void>(`/api/programs/${id}`, { method: "DELETE" }),
  listExamplePrograms: () => apiFetch<Program[]>("/api/programs/examples"),

  // Generation — measured 190s server-side (120s/attempt LLM + retries); 240s ceiling
  generateProgram: (request: GenerationRequest, opts?: { signal?: AbortSignal }) =>
    apiFetch<GenerationResponse>("/api/generate", {
      method: "POST",
      body: JSON.stringify(request),
      timeoutMs: 240_000,
      signal: opts?.signal,
    }),

  // Auth — backend expects email/token as query params
  requestMagicLink: (email: string) =>
    apiFetch<{ message: string; dev_link?: string }>(
      `/api/auth/request-link?email=${encodeURIComponent(email)}`,
      { method: "POST" }
    ),
  verifyToken: (token: string) =>
    apiFetch<{ email: string; token: string; status: string }>(
      `/api/auth/verify?token=${encodeURIComponent(token)}`,
      { method: "POST" }
    ),
};
