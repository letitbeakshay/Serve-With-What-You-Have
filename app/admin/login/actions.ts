"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { LOCKOUT_MINUTES, MAX_PIN_ATTEMPTS, verifyPassword, verifyPin } from "@/lib/admin-auth";
import { setSessionCookie } from "@/lib/admin-session";

export type LoginState = { error: string } | null;

function lockoutMessage(lockedUntil: Date): string {
  const minutesLeft = Math.ceil((lockedUntil.getTime() - Date.now()) / 60000);
  return `Too many attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.`;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const pin = String(formData.get("pin") ?? "").trim();

  const state = await prisma.adminAuthState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  if (state.lockedUntil && state.lockedUntil > new Date()) {
    return { error: lockoutMessage(state.lockedUntil) };
  }

  const storedHash = process.env.ADMIN_PIN_HASH;
  const correct = Boolean(storedHash) && Boolean(pin) && verifyPin(pin, storedHash as string);

  if (!correct) {
    const failedAttempts = state.failedAttempts + 1;
    const shouldLock = failedAttempts >= MAX_PIN_ATTEMPTS;
    await prisma.adminAuthState.update({
      where: { id: 1 },
      data: {
        failedAttempts: shouldLock ? 0 : failedAttempts,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000) : null,
      },
    });
    return shouldLock
      ? { error: `Too many attempts. Try again in ${LOCKOUT_MINUTES} minutes.` }
      : { error: "Incorrect PIN." };
  }

  await prisma.adminAuthState.update({
    where: { id: 1 },
    data: { failedAttempts: 0, lockedUntil: null },
  });

  await setSessionCookie({ kind: "owner" });
  redirect("/admin");
}

// Team-member login. Lockout is tracked per user rather than on the shared
// AdminAuthState row, so one teammate's typos can't lock the owner out.
export async function loginWithPasswordAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const genericError = { error: "Incorrect email or password." };

  if (!email || !password) return genericError;

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return genericError;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { error: lockoutMessage(user.lockedUntil) };
  }

  if (!verifyPassword(password, user.passwordHash)) {
    const failedAttempts = user.failedAttempts + 1;
    const shouldLock = failedAttempts >= MAX_PIN_ATTEMPTS;
    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        failedAttempts: shouldLock ? 0 : failedAttempts,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000) : null,
      },
    });
    return shouldLock ? { error: `Too many attempts. Try again in ${LOCKOUT_MINUTES} minutes.` } : genericError;
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { failedAttempts: 0, lockedUntil: null },
  });

  await setSessionCookie({ kind: "user", userId: user.id });
  redirect(user.mustResetPassword ? "/admin/reset-password" : "/admin");
}
