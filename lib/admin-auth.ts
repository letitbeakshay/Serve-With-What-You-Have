import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_KEYLEN = 64;

export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(pin, salt, SCRYPT_KEYLEN);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

// Team-member passwords use the same scrypt scheme as the owner PIN.
export const hashPassword = hashPin;
export const verifyPassword = verifyPin;

export const PASSWORD_MIN_LENGTH = 8;

export const ADMIN_SESSION_COOKIE = "swwyh_admin_session";
export const MAX_PIN_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 5;
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Who a session belongs to. The owner logs in with the PIN and has no
// AdminUser row; teammates log in with email + password.
export type AdminSession = { kind: "owner" } | { kind: "user"; userId: string };

const OWNER_SUBJECT = "owner";
const USER_SUBJECT_PREFIX = "u_";

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

export function createSessionToken(session: AdminSession): { value: string; maxAge: number } {
  const subject = session.kind === "owner" ? OWNER_SUBJECT : `${USER_SUBJECT_PREFIX}${session.userId}`;
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${subject}.${expiresAt}`;
  return { value: `${payload}.${sign(payload)}`, maxAge: SESSION_MAX_AGE_SECONDS };
}

// Returns the session the token encodes, or null if it is missing, expired
// or tampered with. Callers that need to know the user still exists (or
// still has to reset their password) look the row up themselves.
export function readSessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [subject, expiresAtStr, signature] = token.split(".");
  if (!subject || !expiresAtStr || !signature) return null;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  const expectedBuf = Buffer.from(sign(`${subject}.${expiresAtStr}`), "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length) return null;
  if (!timingSafeEqual(expectedBuf, actualBuf)) return null;
  if (subject === OWNER_SUBJECT) return { kind: "owner" };
  if (subject.startsWith(USER_SUBJECT_PREFIX)) {
    const userId = subject.slice(USER_SUBJECT_PREFIX.length);
    return userId ? { kind: "user", userId } : null;
  }
  return null;
}

export function isValidSessionToken(token: string | undefined): boolean {
  return readSessionToken(token) !== null;
}
