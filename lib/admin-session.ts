import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { ADMIN_SESSION_COOKIE, createSessionToken, readSessionToken, type AdminSession } from "@/lib/admin-auth";
import type { AdminUser } from "@/lib/generated/prisma/client";

export type CurrentAdmin = { kind: "owner" } | { kind: "user"; user: AdminUser };

// Resolves the logged-in admin from the session cookie. A user session whose
// row has since been deleted counts as logged out, so removing a teammate on
// the Users page revokes their access immediately.
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return null;
  if (session.kind === "owner") return { kind: "owner" };
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  return user ? { kind: "user", user } : null;
}

export async function setSessionCookie(session: AdminSession): Promise<void> {
  const { value, maxAge } = createSessionToken(session);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}
