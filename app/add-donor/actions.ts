"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { parseDonationFormData } from "@/lib/cloth-donation";
import { findOrCreateDonor, getOrCreateAnonymousDonor } from "@/lib/donor";

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

  const { isAnonymous, ...data } = result.data;
  const donor = isAnonymous
    ? await getOrCreateAnonymousDonor()
    : await findOrCreateDonor({ phone: data.phone, name: data.donorName, email: data.email });
  await prisma.clothDonation.create({ data: { ...data, donorId: donor.id } });

  revalidatePath("/admin/donations");
  revalidatePath("/admin/donors");
  return { success: `Added ${data.donorName}. You can log another one below.` };
}
