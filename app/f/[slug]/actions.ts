"use server";

import { prisma } from "@/lib/db";
import { DECLARATIONS_VERSION } from "@/lib/field-config/v1";
import { validateAll, type ResponseFormData } from "@/lib/field-config/form-state";
import { Prisma, RegistrationStatus } from "@/lib/generated/prisma/client";

export type SubmitResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Partial<Record<string, string>> };

function orNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export async function submitResponse(formSlug: string, data: ResponseFormData): Promise<SubmitResult> {
  const form = await prisma.form.findUnique({ where: { slug: formSlug } });

  if (!form) {
    return { success: false, error: "This form could not be found." };
  }
  if (form.status !== "OPEN") {
    return { success: false, error: "This form isn't accepting responses right now." };
  }

  const fieldErrors = validateAll(data);
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  await prisma.response.create({
    data: {
      formId: form.id,
      orgName: data.orgName.trim(),
      orgType: data.orgType,
      orgTypeOther: orNull(data.orgTypeOther),
      isRegistered: data.isRegistered as RegistrationStatus,
      registrationNumber: orNull(data.registrationNumber),
      yearStarted: data.yearStarted ? Number.parseInt(data.yearStarted, 10) : null,
      city: data.city.trim(),
      state: data.state,
      pinCode: data.pinCode.trim(),
      fullAddress: data.fullAddress.trim(),
      mapsLink: orNull(data.mapsLink),
      contactName: data.contactName.trim(),
      contactRole: data.contactRole.trim(),
      phoneCountryCode: data.phoneCountryCode,
      phone: data.phone.trim(),
      altPhone: orNull(data.altPhone),
      email: orNull(data.email),
      headcounts: data.headcounts as unknown as Prisma.InputJsonValue,
      whoServe: data.whoServe,
      whoServeOther: orNull(data.whoServeOther),
      supportOffered: data.supportOffered,
      supportOfferedOther: orNull(data.supportOfferedOther),
      mostNeeded: data.mostNeeded,
      volunteerHelp: data.volunteerHelp,
      volunteerHelpOther: orNull(data.volunteerHelpOther),
      website: orNull(data.website),
      facebook: orNull(data.facebook),
      instagram: orNull(data.instagram),
      youtube: orNull(data.youtube),
      additionalNotes: orNull(data.additionalNotes),
      declarationsVersion: DECLARATIONS_VERSION,
      declarationsAcceptedAt: new Date(),
      rawAnswers: data as unknown as Prisma.InputJsonValue,
    },
  });

  return { success: true };
}
