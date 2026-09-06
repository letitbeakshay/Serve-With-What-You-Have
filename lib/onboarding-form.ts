import { prisma } from "@/lib/db";

export const ONBOARDING_FORM_SLUG = "onboard";

// There is exactly one shared onboarding link now (not one per
// organisation), so this ensures that single Form row exists instead of
// letting the admin create arbitrarily many.
export async function getOnboardingForm() {
  return prisma.form.upsert({
    where: { slug: ONBOARDING_FORM_SLUG },
    update: {},
    create: {
      name: "Orphanage Onboarding",
      slug: ONBOARDING_FORM_SLUG,
      status: "OPEN",
      fieldSetVersion: "v2",
    },
  });
}
