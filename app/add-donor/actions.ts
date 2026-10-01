"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { parseDonationFormData } from "@/lib/cloth-donation";
import { findOrCreateDonor } from "@/lib/donor";

export type AddDonorState = { error?: string; success?: string } | null;

// Intentionally public, no login required -- this is the shareable link
// version of the admin's "Log a donation" form, meant to be opened on a
// phone at a collection point. Same validation as the admin form, via
// parseDonationFormData.
export async function createPublicDonation(
  _prevState: AddDonorState,
  formData: FormData,
): Promise<AddDonorState> {
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
  return { success: `Added ${result.data.donorName}. You can log another one below.` };
}
