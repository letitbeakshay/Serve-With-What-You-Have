"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/admin-session";

export type DonationFormState = { error?: string; success?: string } | null;

async function requireAdmin(): Promise<boolean> {
  return Boolean(await getCurrentAdmin());
}

export async function createDonation(
  _prevState: DonationFormState,
  formData: FormData,
): Promise<DonationFormState> {
  if (!(await requireAdmin())) return { error: "You must be logged in." };

  const donorName = String(formData.get("donorName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const donatedAtRaw = String(formData.get("donatedAt") ?? "").trim();

  if (!donorName) return { error: "Please enter the donor's name." };
  if (!phone) return { error: "Please enter a mobile number." };
  if (!donatedAtRaw) return { error: "Please enter the date they donated." };

  // Stored at midday UTC rather than midnight so the calendar date this
  // represents never shifts by a day when displayed from a different
  // timezone than the one it was entered in.
  const donatedAt = new Date(`${donatedAtRaw}T12:00:00.000Z`);
  if (Number.isNaN(donatedAt.getTime())) return { error: "That date doesn't look right." };

  await prisma.clothDonation.create({
    data: { donorName, phone, email: email || null, donatedAt },
  });

  revalidatePath("/admin/donations");
  return { success: `Added ${donorName}.` };
}

export async function deleteDonation(formData: FormData) {
  if (!(await requireAdmin())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.clothDonation.deleteMany({ where: { id } });
  revalidatePath("/admin/donations");
}
