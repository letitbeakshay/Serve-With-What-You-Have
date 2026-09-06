"use server";

import { prisma } from "@/lib/db";
import { validateSimpleForm, type SimpleFormErrors } from "@/lib/field-config/v2";

export type SimpleSubmitState =
  | { status: "idle" }
  | { status: "error"; error?: string; fieldErrors?: SimpleFormErrors }
  | { status: "success" };

export async function submitSimpleResponse(
  formId: string,
  _prevState: SimpleSubmitState,
  formData: FormData,
): Promise<SimpleSubmitState> {
  const values = {
    contactName: String(formData.get("contactName") ?? "").trim(),
    phoneCountryCode: String(formData.get("phoneCountryCode") ?? "+91").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    orgName: String(formData.get("orgName") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    referralSource: String(formData.get("referralSource") ?? "").trim(),
  };

  const fieldErrors = validateSimpleForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const form = await prisma.form.findUnique({ where: { id: formId } });
  if (!form || form.status === "CLOSED") {
    return { status: "error", error: "This form isn't taking responses right now." };
  }

  await prisma.simpleResponse.create({
    data: { formId, ...values },
  });

  return { status: "success" };
}
