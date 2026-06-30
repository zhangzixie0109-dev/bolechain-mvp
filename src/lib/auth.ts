export type Role = "student" | "parent";
export type DegreeLevel = "undergrad" | "grad" | "phd";
export type Curriculum = "DSE" | "A-Level" | "IB" | "AP" | "gaokao" | "other";

export interface UserProfile {
  email: string;
  role: Role;
  degreeLevel?: DegreeLevel;
  curriculum?: Curriculum;
  targetGrade?: string;
  university?: string; // for grad/phd
  did: string;
  linkedChildEmail?: string; // for parent
  inviteCode?: string;
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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}

export function generateDid(): string {
  const rand = Math.random().toString(36).substring(2, 14);
  return `did:key:mock_${rand}`;
}

export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
