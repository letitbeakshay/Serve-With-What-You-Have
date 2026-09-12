"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PASSWORD_MIN_LENGTH, hashPassword, verifyPassword } from "@/lib/admin-auth";
import { getCurrentAdmin } from "@/lib/admin-session";

export type ResetPasswordState = { error: string } | null;

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.kind !== "user") redirect("/admin");

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  }
  if (password !== confirm) return { error: "The two passwords do not match." };
  if (verifyPassword(password, admin.user.passwordHash)) {
    return { error: "Please choose a password different from your current one." };
  }

  await prisma.adminUser.update({
    where: { id: admin.user.id },
    data: { passwordHash: hashPassword(password), mustResetPassword: false },
  });

  redirect("/admin");
}
