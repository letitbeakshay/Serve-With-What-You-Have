// Shared form state shape, conditional-visibility logic, and validation for
// the v1 field set. Used by both the public form (client-side, per step) and
// the submit server action (full validation before writing to the DB), so
// the two never drift apart.

import {
  DECLARATIONS,
  EMAIL_REGEX,
  PHONE_REGEX,
  PIN_CODE_REGEX,
  URL_REGEX,
  STEPS,
  type FieldKey,
  type HeadcountValue,
  type ShowIf,
} from "./v1";

export type ResponseFormData = {
  orgName: string;
  orgType: string;
  orgTypeOther: string;
  isRegistered: "YES" | "NO" | "IN_PROCESS" | "";
  registrationNumber: string;
  yearStarted: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  fullAddress: string;
  mapsLink: string;
  contactName: string;
  contactRole: string;
  phone: string;
  altPhone: string;
  email: string;
  headcounts: HeadcountValue;
  whoServe: string[];
  whoServeOther: string;
  supportOffered: string[];
  supportOfferedOther: string;
  mostNeeded: string;
  volunteerHelp: string[];
  volunteerHelpOther: string;
  website: string;
  facebook: string;
  instagram: string;
  youtube: string;
  additionalNotes: string;
  declarations: Record<string, boolean>;
};

export function createEmptyFormData(): ResponseFormData {
  return {
    orgName: "",
    orgType: "",
    orgTypeOther: "",
    isRegistered: "",
    registrationNumber: "",
    yearStarted: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    fullAddress: "",
    mapsLink: "",
    contactName: "",
    contactRole: "",
    phone: "",
    altPhone: "",
    email: "",
    headcounts: {},
    whoServe: [],
    whoServeOther: "",
    supportOffered: [],
    supportOfferedOther: "",
    mostNeeded: "",
    volunteerHelp: [],
    volunteerHelpOther: "",
    website: "",
    facebook: "",
    instagram: "",
    youtube: "",
    additionalNotes: "",
    declarations: Object.fromEntries(DECLARATIONS.map((d) => [d.key, false])),
  };
}

function readDepValue(data: ResponseFormData, key: FieldKey): unknown {
  return (data as unknown as Record<FieldKey, unknown>)[key];
}

export function isFieldVisible(showIf: ShowIf | undefined, data: ResponseFormData): boolean {
  if (!showIf) return true;
  const depValue = readDepValue(data, showIf.field as FieldKey);
  if (showIf.equals !== undefined) return depValue === showIf.equals;
  if (showIf.notEquals !== undefined) return depValue !== showIf.notEquals;
  if (showIf.includes !== undefined) {
    return Array.isArray(depValue) && depValue.includes(showIf.includes);
  }
  return true;
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

// Options for "mostNeeded" are whatever the organisation ticked in
// "supportOffered", plus their own "other" text if they wrote one.
export function getMostNeededOptions(
  data: ResponseFormData,
  supportLabels: Record<string, string>,
): { value: string; label: string }[] {
  const options = data.supportOffered
    .filter((code) => code !== "other")
    .map((code) => ({ value: code, label: supportLabels[code] ?? code }));
  if (data.supportOffered.includes("other") && !isBlank(data.supportOfferedOther)) {
    options.push({ value: "other", label: data.supportOfferedOther.trim() });
  }
  return options;
}

function validateField(key: FieldKey, data: ResponseFormData): string | null {
  switch (key) {
    case "orgName":
      return isBlank(data.orgName) ? "Tell us your organisation's name." : null;
    case "orgType":
      return isBlank(data.orgType) ? "Choose the type that fits best." : null;
    case "orgTypeOther":
      return isBlank(data.orgTypeOther) ? "Tell us what kind of organisation this is." : null;
    case "isRegistered":
      return data.isRegistered === "" ? "Let us know if you're registered." : null;
    case "city":
      return isBlank(data.city) ? "Tell us your city." : null;
    case "state":
      return isBlank(data.state) ? "Choose your state." : null;
    case "pinCode":
      if (isBlank(data.pinCode)) return "Enter your PIN code.";
      return PIN_CODE_REGEX.test(data.pinCode) ? null : "PIN code should be 6 digits.";
    case "fullAddress":
      return isBlank(data.fullAddress) ? "Tell us the full address." : null;
    case "mapsLink":
      if (isBlank(data.mapsLink)) return null;
      return URL_REGEX.test(data.mapsLink) ? null : "That doesn't look like a valid link.";
    case "contactName":
      return isBlank(data.contactName) ? "Tell us who we should contact." : null;
    case "contactRole":
      return isBlank(data.contactRole) ? "Tell us their role." : null;
    case "phone":
      if (isBlank(data.phone)) return "Enter a phone number.";
      return PHONE_REGEX.test(data.phone) ? null : "Phone number should be 10 digits.";
    case "altPhone":
      if (isBlank(data.altPhone)) return null;
      return PHONE_REGEX.test(data.altPhone) ? null : "Phone number should be 10 digits.";
    case "email":
      if (isBlank(data.email)) return null;
      return EMAIL_REGEX.test(data.email) ? null : "That doesn't look like a valid email.";
    case "whoServeOther":
      return isBlank(data.whoServeOther) ? "Tell us who else you serve." : null;
    case "supportOffered":
      return data.supportOffered.length === 0 ? "Choose at least one kind of support." : null;
    case "supportOfferedOther":
      return isBlank(data.supportOfferedOther) ? "Tell us what other support you can receive." : null;
    case "mostNeeded":
      return isBlank(data.mostNeeded) ? "Choose what you need most right now." : null;
    case "volunteerHelpOther":
      return isBlank(data.volunteerHelpOther) ? "Tell us what else volunteers could help with." : null;
    case "website":
    case "facebook":
    case "instagram":
    case "youtube": {
      const value = data[key];
      if (isBlank(value)) return null;
      return URL_REGEX.test(value) ? null : "That doesn't look like a valid link.";
    }
    case "declarations":
      return DECLARATIONS.every((d) => data.declarations[d.key])
        ? null
        : "Please agree to all of these before submitting.";
    default:
      return null;
  }
}

// Exposed for on-blur / on-change validation of a single field, so the form
// doesn't wait until the user tries to advance a step to flag bad input.
export function validateSingleField(key: FieldKey, data: ResponseFormData): string | null {
  return validateField(key, data);
}

export function validateStep(stepId: string, data: ResponseFormData): Partial<Record<FieldKey, string>> {
  const step = STEPS.find((s) => s.id === stepId);
  if (!step) return {};
  const errors: Partial<Record<FieldKey, string>> = {};
  for (const field of step.fields) {
    if (!isFieldVisible(field.showIf, data)) continue;
    if (!field.required) continue;
    const error = validateField(field.key, data);
    if (error) errors[field.key] = error;
  }
  return errors;
}

export function validateAll(data: ResponseFormData): Partial<Record<FieldKey, string>> {
  let errors: Partial<Record<FieldKey, string>> = {};
  for (const step of STEPS) {
    errors = { ...errors, ...validateStep(step.id, data) };
  }
  return errors;
}
