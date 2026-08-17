"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  ADMIN_SESSION_COOKIE,
  LOCKOUT_MINUTES,
  MAX_PIN_ATTEMPTS,
  createSessionToken,
  verifyPin,
} from "@/lib/admin-auth";

export type LoginState = { error: string } | null;

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const pin = String(formData.get("pin") ?? "").trim();

  const state = await prisma.adminAuthState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  if (state.lockedUntil && state.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((state.lockedUntil.getTime() - Date.now()) / 60000);
    return { error: `Too many attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.` };
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

  const { value, maxAge } = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  redirect("/admin");
}
