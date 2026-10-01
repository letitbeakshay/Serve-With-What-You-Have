"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/admin-session";
import { parseDonationFormData } from "@/lib/cloth-donation";
import { findOrCreateDonor } from "@/lib/donor";

export type DonationFormState = { error?: string; success?: string } | null;

async function requireAdmin(): Promise<boolean> {
  return Boolean(await getCurrentAdmin());
}

export async function createDonation(
  _prevState: DonationFormState,
  formData: FormData,
): Promise<DonationFormState> {
  if (!(await requireAdmin())) return { error: "You must be logged in." };

  const result = parseDonationFormData(formData);
  if ("error" in result) return { error: result.error };

  const donor = await findOrCreateDonor({
    phone: result.data.phone,
    name: result.data.donorName,
    email: result.data.email,
  });
  await prisma.clothDonation.create({ data: { ...result.data, donorId: donor.id } });

  revalidatePath("/admin/donations");
  revalidatePath("/admin/donors");
  return { success: `Added ${result.data.donorName}.` };
}

export async function updateDonation(id: string, formData: FormData) {
  if (!(await requireAdmin())) throw new Error("You must be logged in.");

  const existing = await prisma.clothDonation.findUnique({ where: { id } });
  if (!existing) throw new Error("Donation not found.");

  const result = parseDonationFormData(formData);
  if ("error" in result) throw new Error(result.error);

  // Re-resolve the donor link in case the phone number was corrected --
  // this donation now belongs to whoever that phone actually matches.
  const donor = await findOrCreateDonor({
    phone: result.data.phone,
    name: result.data.donorName,
    email: result.data.email,
  });
  await prisma.clothDonation.update({ where: { id }, data: { ...result.data, donorId: donor.id } });

  revalidatePath("/admin/donations");
  revalidatePath("/admin/donors");
  redirect("/admin/donations");
}

export async function deleteDonation(formData: FormData) {
  if (!(await requireAdmin())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.clothDonation.deleteMany({ where: { id } });
  revalidatePath("/admin/donations");
}
