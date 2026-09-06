"use server";

import { prisma } from "@/lib/db";
import { validateReferralForm, type ReferralFormErrors } from "@/lib/field-config/referral";

export type ReferralSubmitState =
  | { status: "idle" }
  | { status: "error"; error?: string; fieldErrors?: ReferralFormErrors }
  | { status: "success" };

export async function submitReferral(
  formId: string,
  _prevState: ReferralSubmitState,
  formData: FormData,
): Promise<ReferralSubmitState> {
  const values = {
    referrerName: String(formData.get("referrerName") ?? "").trim(),
    orgName: String(formData.get("orgName") ?? "").trim(),
    orgPhone: String(formData.get("orgPhone") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
  };

  const fieldErrors = validateReferralForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const form = await prisma.form.findUnique({ where: { id: formId } });
  if (!form || form.status === "CLOSED") {
    return { status: "error", error: "This form isn't taking responses right now." };
  }

  await prisma.referralResponse.create({
    data: {
      formId,
      referrerName: values.referrerName || null,
      orgName: values.orgName,
      orgPhone: values.orgPhone,
      location: values.location,
    },
  });

  return { status: "success" };
}
