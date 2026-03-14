// src/api/projects.ts
// ─────────────────────────────────────────────────────────────────────────────
// All worker communication lives here.
// The JWT is fetched from Amplify on every call so it's always fresh
// (Amplify auto-refreshes it if the access token has expired).
// The worker extracts the user's sub from the token — we never send userId
// in the request body or query string.
// ─────────────────────────────────────────────────────────────────────────────

import { fetchAuthSession } from "aws-amplify/auth";

const BASE = import.meta.env.VITE_API_URL;

// ── Types ─────────────────────────────────────────────────────────────────────
export type ProjectStatus     = "open" | "in_progress" | "review" | "completed" | "cancelled";
export type ProjectVisibility = "public" | "invite";

export interface Project {
  id:          string;
  user_id:     string;
  title:       string;
  category:    string;
  description: string;
  skills:      string[];          // already parsed from JSON by the worker
  budget:      string | null;
  timeline:    string | null;
  visibility:  ProjectVisibility;
  status:      ProjectStatus;
  posted_at:   string;            // ISO-8601
}

export interface CreateProjectPayload {
  title:               string;
  category:            string;
  description:         string;
  skills:              string[];
  budget:              string | null;
  timeline:            string | null;
  visibility:          ProjectVisibility;
  cf_turnstile_token?: string;
}

export interface ProjectFilters {
  status?:     ProjectStatus;
  visibility?: ProjectVisibility;
  search?:     string;
}

// ── Auth header ───────────────────────────────────────────────────────────────
async function authHeader(): Promise<{ Authorization: string }> {
  const session = await fetchAuthSession();
  const token   = session.tokens?.accessToken?.toString();
  if (!token) throw new Error("No active session — please sign in again.");
  return { Authorization: `Bearer ${token}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error((data as any)?.error ?? `HTTP ${res.status}`);
  return data as T;
}

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * POST /api/projects
 * userId is never sent — the worker reads it from the JWT.
 */
export async function createProject(
  payload: CreateProjectPayload
): Promise<{ success: boolean; id: string; posted_at: string }> {
  const res = await fetch(`${BASE}/api/projects`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body:    JSON.stringify(payload),   // no userId here
  });
  return handleResponse(res);
}

/**
 * GET /api/projects
 * Returns only the authenticated user's own projects.
 * Optional filters: status, visibility, search term.
 */
export async function fetchProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  const params = new URLSearchParams();
  if (filters.status)     params.set("status",     filters.status);
  if (filters.visibility) params.set("visibility", filters.visibility);
  if (filters.search)     params.set("s",          filters.search);

  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${BASE}/api/projects${qs}`, {
    headers: await authHeader(),
  });
  return handleResponse<Project[]>(res);
}

/**
 * PATCH /api/projects/:id
 * Worker checks ownership before updating.
 */
export async function updateProject(
  id: string,
  patch: Partial<Pick<Project, "status" | "visibility" | "title" | "description" | "budget" | "timeline" | "skills">>
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/api/projects/${id}`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body:    JSON.stringify(patch),
  });
  return handleResponse(res);
}

/**
 * DELETE /api/projects/:id
 * Worker checks ownership before deleting.
 */
export async function deleteProject(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/api/projects/${id}`, {
    method:  "DELETE",
    headers: await authHeader(),
  });
  return handleResponse(res);
}