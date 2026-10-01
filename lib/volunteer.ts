import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/normalize-phone";
import type { Volunteer } from "@/lib/generated/prisma/client";

// Finds the Volunteer this phone number already belongs to, or creates one --
// same pattern as findOrCreateDonor, so a volunteer logging on different days
// or devices is still recognized as one person with one ID.
export async function findOrCreateVolunteer(input: { phone: string; name: string }): Promise<Volunteer> {
  const normalized = normalizePhone(input.phone);
  const existing = await prisma.volunteer.findUnique({ where: { phone: normalized } });
  if (existing) return existing;

  return prisma.volunteer.create({
    data: { phone: normalized, name: input.name },
  });
}
