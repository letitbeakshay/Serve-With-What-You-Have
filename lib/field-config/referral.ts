// Field set for "Know a home? Share it with us" -- someone telling us about
// an orphanage/home rather than the home onboarding itself. Deliberately
// tiny: we call to get everything else.

export const REFERRER_NAME_MAX = 120;
export const ORG_NAME_MAX = 160;
export const LOCATION_MAX = 160;

// Lenient on purpose: this is someone else's number, relayed secondhand,
// so we don't enforce the strict 10-digit India format used elsewhere.
const PHONE_DIGITS_MIN = 7;
const PHONE_DIGITS_MAX = 15;

export type ReferralFormErrors = Partial<Record<"orgName" | "orgPhone" | "location", string>>;

export type ReferralFormValues = {
  referrerName: string;
  orgName: string;
  orgPhone: string;
  location: string;
};

export function validateReferralForm(values: ReferralFormValues): ReferralFormErrors {
  const errors: ReferralFormErrors = {};

  if (!values.orgName.trim()) errors.orgName = "Please tell us the orphanage's name.";
  else if (values.orgName.length > ORG_NAME_MAX) errors.orgName = "That name is too long.";

  const phoneDigits = values.orgPhone.replace(/\D/g, "");
  if (phoneDigits.length < PHONE_DIGITS_MIN || phoneDigits.length > PHONE_DIGITS_MAX) {
    errors.orgPhone = "Please enter a valid contact number.";
  }

  if (!values.location.trim()) errors.location = "Please tell us where they're located.";
  else if (values.location.length > LOCATION_MAX) errors.location = "That's too long, try shortening it.";

  return errors;
}
