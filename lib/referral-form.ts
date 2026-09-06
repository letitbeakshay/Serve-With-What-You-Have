import { prisma } from "@/lib/db";

export const REFERRAL_FORM_SLUG = "refer-a-home";

// Same singleton pattern as getOnboardingForm(): exactly one shared link for
// "know a home? share it with us", not one per referrer.
export async function getReferralForm() {
  return prisma.form.upsert({
    where: { slug: REFERRAL_FORM_SLUG },
    update: {},
    create: {
      name: "Know a Home? Share It With Us",
      slug: REFERRAL_FORM_SLUG,
      status: "OPEN",
      fieldSetVersion: "v2-referral",
    },
  });
}
