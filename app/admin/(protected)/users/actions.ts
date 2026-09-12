"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { PASSWORD_MIN_LENGTH, hashPassword } from "@/lib/admin-auth";
import { getCurrentAdmin } from "@/lib/admin-session";

export type UserFormState = { error?: string; success?: string } | null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Server actions can be invoked directly, so each one re-checks that the
// caller is the owner rather than trusting that the page hid the form.
async function requireOwner(): Promise<boolean> {
  const admin = await getCurrentAdmin();
  return admin?.kind === "owner";
}

export async function createUser(_prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  if (!(await requireOwner())) return { error: "Only the owner can add users." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_REGEX.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return { error: "A user with that email already exists." };

  await prisma.adminUser.create({
    data: { email, passwordHash: hashPassword(password), mustResetPassword: true },
  });

  revalidatePath("/admin/users");
  return { success: `Added ${email}. Share the email and password with them; they will be asked to set a new password when they first log in.` };
}

export async function deleteUser(formData: FormData) {
  if (!(await requireOwner())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.adminUser.deleteMany({ where: { id } });
  revalidatePath("/admin/users");
}
