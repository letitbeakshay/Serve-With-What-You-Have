import { createHmac, timingSafeEqual } from "node:crypto";

// Gates /donation-entry: a volunteer types their name, mobile number, and a
// shared code (not a per-person login) to get a signed cookie carrying their
// name and resolved Volunteer id, so every item they log is attributed to
// them without asking again each time. Deliberately lighter-weight than the
// admin session: this only protects donor names/phone numbers already
// visible in the admin panel, not anything more sensitive.

export const VOLUNTEER_SESSION_COOKIE = "swwyh_volunteer_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours, a single shift

export type VolunteerSession = { volunteerName: string; volunteerId: string };

function getSecret(): string {
  // Reuses the admin session secret rather than requiring a second one to
  // be configured -- this cookie is signed with it, never compared to it.
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function getVolunteerEntryCode(): string {
  return process.env.VOLUNTEER_ENTRY_CODE || "2026";
}

export function createVolunteerSessionToken(session: VolunteerSession): { value: string; maxAge: number } {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const encodedName = Buffer.from(session.volunteerName, "utf8").toString("base64url");
  const payload = `${encodedName}.${session.volunteerId}.${expiresAt}`;
  return { value: `${payload}.${sign(payload)}`, maxAge: SESSION_MAX_AGE_SECONDS };
}

export function readVolunteerSessionToken(token: string | undefined): VolunteerSession | null {
  if (!token) return null;
  const [encodedName, volunteerId, expiresAtStr, signature] = token.split(".");
  if (!encodedName || !volunteerId || !expiresAtStr || !signature) return null;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  const expectedBuf = Buffer.from(sign(`${encodedName}.${volunteerId}.${expiresAtStr}`), "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length) return null;
  if (!timingSafeEqual(expectedBuf, actualBuf)) return null;
  try {
    const volunteerName = Buffer.from(encodedName, "base64url").toString("utf8");
    return volunteerName ? { volunteerName, volunteerId } : null;
  } catch {
    return null;
  }
}
