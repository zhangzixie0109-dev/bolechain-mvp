export type Role = "student" | "parent" | "counselor";

export interface UserProfile {
  email: string;
  role: Role;
  inviteCode?: string;
  linkedStudentId?: string;
}

const STORAGE_KEY = "bolechain_user";

export function login(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}

export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
