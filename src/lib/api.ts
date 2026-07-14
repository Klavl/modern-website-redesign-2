const AUTH_URL = "https://functions.poehali.dev/ff1614be-0445-4f10-921a-09d271205366";
const EVENTS_URL = "https://functions.poehali.dev/64afce21-a026-4651-8beb-2d3b8cf3bd77";

const TOKEN_KEY = "shodhan_token";
const INSTRUCTOR_KEY = "shodhan_instructor";

export type Instructor = {
  id: number;
  full_name: string;
  cities: string[];
  bio: string;
  photo_url: string;
  role?: string;
  gender?: string;
  age?: number | null;
  experience_years?: number | null;
  telegram?: string;
  vk?: string;
  login?: string;
  created_at?: string;
};

export type ShodhanEvent = {
  id: number;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  city: string;
  price: string;
  spots: number;
  contact_link: string;
  is_active?: boolean;
  is_mass?: boolean;
  instructor_name?: string;
  instructor_photo?: string;
  instructor_id?: number;
};

async function callAuth(body: Record<string, unknown>, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Session-Token"] = token;
  const res = await fetch(AUTH_URL, { method: "POST", headers, body: JSON.stringify(body) });
  return res.json();
}

async function callEvents(body: Record<string, unknown>, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Session-Token"] = token;
  const res = await fetch(EVENTS_URL, { method: "POST", headers, body: JSON.stringify(body) });
  return res.json();
}

// ── AUTH ────────────────────────────────────────────────────────────────────

export async function login(loginVal: string, password: string) {
  const data = await callAuth({ action: "login", login: loginVal, password });
  if (data.success && data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(INSTRUCTOR_KEY, JSON.stringify(data.instructor));
  }
  return data;
}

export async function adminListInstructors() {
  const token = getToken();
  return callAuth({ action: "admin_list" }, token || undefined);
}

export async function adminCreateInstructor(full_name: string, login: string, password: string, cities: string[]) {
  const token = getToken();
  return callAuth({ action: "admin_create", full_name, login, password, cities }, token || undefined);
}

export async function adminDeleteInstructor(id: number) {
  const token = getToken();
  return callAuth({ action: "admin_delete", id }, token || undefined);
}

export async function adminSetCredentials(id: number, login: string, password: string) {
  const token = getToken();
  return callAuth({ action: "admin_set_credentials", id, login, password }, token || undefined);
}

export async function adminUpdateInstructor(id: number, data: Partial<Instructor>) {
  const token = getToken();
  return callAuth({ action: "admin_update", id, ...data }, token || undefined);
}

export async function getPublicInstructors(): Promise<Instructor[]> {
  const data = await callAuth({ action: "public_instructors" });
  return data.instructors || [];
}

export async function logout() {
  const token = getToken();
  if (token) await callAuth({ action: "logout" }, token);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(INSTRUCTOR_KEY);
}

export async function getMe(): Promise<Instructor | null> {
  const token = getToken();
  if (!token) return null;
  const data = await callAuth({ action: "me" }, token);
  if (data.error) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(INSTRUCTOR_KEY);
    return null;
  }
  localStorage.setItem(INSTRUCTOR_KEY, JSON.stringify(data));
  return data as Instructor;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCachedInstructor(): Instructor | null {
  const raw = localStorage.getItem(INSTRUCTOR_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function updateProfile(bio: string, cities: string[], photo_url: string) {
  const token = getToken();
  return callAuth({ action: "update", bio, cities, photo_url }, token || undefined);
}

// ── EVENTS ───────────────────────────────────────────────────────────────────

export async function getPublicEvents(): Promise<ShodhanEvent[]> {
  const res = await fetch(EVENTS_URL, { method: "GET" });
  const data = await res.json();
  return data.events || [];
}

export async function getMyEvents(): Promise<ShodhanEvent[]> {
  const token = getToken();
  const data = await callEvents({ action: "my" }, token || undefined);
  return data.events || [];
}

export async function createEvent(event: Omit<ShodhanEvent, "id" | "title" | "is_active" | "instructor_name" | "instructor_photo" | "instructor_id">) {
  const token = getToken();
  return callEvents({ action: "create", ...event }, token || undefined);
}

export async function updateEvent(id: number, event: Omit<ShodhanEvent, "id" | "title" | "is_active" | "instructor_name" | "instructor_photo" | "instructor_id">) {
  const token = getToken();
  return callEvents({ action: "update", id, ...event }, token || undefined);
}

export async function deleteEvent(id: number) {
  const token = getToken();
  return callEvents({ action: "delete", id }, token || undefined);
}