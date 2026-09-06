// The simplified "just a few details" onboarding field set. Reuses the
// country-code list and phone shape from v1, since those are just shared
// reference data, not part of the (currently dormant) detailed wizard.
import { COUNTRY_CODES, DEFAULT_PHONE_COUNTRY_CODE, PHONE_REGEX } from "@/lib/field-config/v1";

export { COUNTRY_CODES, DEFAULT_PHONE_COUNTRY_CODE, PHONE_REGEX };

export const CONTACT_NAME_MAX = 120;
export const ORG_NAME_MAX = 160;
export const LOCATION_MAX = 160;
export const REFERRAL_MAX = 200;

export type SimpleFormErrors = Partial<
  Record<"contactName" | "phone" | "orgName" | "location" | "referralSource", string>
>;

export type SimpleFormValues = {
  contactName: string;
  phoneCountryCode: string;
  phone: string;
  orgName: string;
  location: string;
  referralSource: string;
};

export function validateSimpleForm(values: SimpleFormValues): SimpleFormErrors {
  const errors: SimpleFormErrors = {};

  if (!values.contactName.trim()) errors.contactName = "Please tell us your name.";
  else if (values.contactName.length > CONTACT_NAME_MAX) errors.contactName = "That name is too long.";

  if (!PHONE_REGEX.test(values.phone.trim())) errors.phone = "Enter a 10 digit phone number.";

  if (!values.orgName.trim()) errors.orgName = "Please enter the association's name.";
  else if (values.orgName.length > ORG_NAME_MAX) errors.orgName = "That name is too long.";

  if (!values.location.trim()) errors.location = "Please tell us where it's located.";
  else if (values.location.length > LOCATION_MAX) errors.location = "That's too long, try shortening it.";

  if (!values.referralSource.trim()) errors.referralSource = "Please let us know how you heard about us.";
  else if (values.referralSource.length > REFERRAL_MAX) errors.referralSource = "That's too long, try shortening it.";

  return errors;
}
