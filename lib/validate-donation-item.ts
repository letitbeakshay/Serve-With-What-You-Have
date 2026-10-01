import { isAgeCategory, isGarmentForGender, isGender, type AgeCategory, type Gender } from "@/lib/garment-catalog";

export type ValidatedDonationItem = {
  gender: Gender;
  ageCategory: AgeCategory | null;
  garmentType: string;
  quantity: number;
};

export type ValidateResult = { error: string } | { data: ValidatedDonationItem };

// Shared by the create route and the edit route so a volunteer correcting an
// entry is held to exactly the same rules as logging a new one.
export function validateDonationItemInput(body: unknown): ValidateResult {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request." };
  }

  const { gender, ageCategory, garmentType, quantity } = body as Record<string, unknown>;

  if (!isGender(gender)) {
    return { error: "Please choose male, female or general." };
  }
  // GENERAL items skip the age step entirely; MALE/FEMALE items require one.
  const resolvedAgeCategory = gender === "GENERAL" ? null : isAgeCategory(ageCategory) ? ageCategory : null;
  if (gender !== "GENERAL" && resolvedAgeCategory === null) {
    return { error: "Please choose an age category." };
  }
  if (!isGarmentForGender(gender, garmentType)) {
    return { error: "Please choose a garment type." };
  }
  const parsedQuantity = Number(quantity);
  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 999) {
    return { error: "Enter a quantity between 1 and 999." };
  }

  return { data: { gender, ageCategory: resolvedAgeCategory, garmentType, quantity: parsedQuantity } };
}
