import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/normalize-phone";
import type { Donor } from "@/lib/generated/prisma/client";

// Finds the Donor this phone number already belongs to, or creates one. Used
// every time a cloth donation is logged (admin form, /add-donor link) so the
// same person is recognized across however many times they give -- across
// however many kinds of serving this grows to cover, not just clothes.
export async function findOrCreateDonor(input: { phone: string; name: string; email?: string | null }): Promise<Donor> {
  const normalized = normalizePhone(input.phone);
  const existing = await prisma.donor.findUnique({ where: { phone: normalized } });
  if (existing) return existing;

  return prisma.donor.create({
    data: { phone: normalized, name: input.name, email: input.email || null },
  });
}

// The single shared donor every donation with no known giver attaches to,
// instead of inventing a placeholder phone number for each one. There is
// only ever one of these; this creates it on first use and reuses it after.
export async function getOrCreateAnonymousDonor(): Promise<Donor> {
  const existing = await prisma.donor.findFirst({ where: { isAnonymous: true } });
  if (existing) return existing;

  return prisma.donor.create({
    data: { name: "Anonymous", phone: null, donorNumber: null, isAnonymous: true },
  });
}
