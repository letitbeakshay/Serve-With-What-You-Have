// Field set for the "show interest" popup on the homepage's Ways to serve
// section (skills / time / refer-a-need -- the ways that aren't live yet).

export const INTEREST_CATEGORIES = ["skill", "time", "refer"] as const;
export type InterestCategory = (typeof INTEREST_CATEGORIES)[number];

export function isInterestCategory(value: unknown): value is InterestCategory {
  return typeof value === "string" && (INTEREST_CATEGORIES as readonly string[]).includes(value);
}

export const INTEREST_CATEGORY_LABELS: Record<InterestCategory, string> = {
  skill: "A skill to share",
  time: "Time to serve",
  refer: "Knows someone who needs help",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_MIN = 7;
const PHONE_DIGITS_MAX = 15;

const NAME_MAX = 120;
const EMAIL_MAX = 200;
const MESSAGE_MAX = 1000;

export type InterestFormErrors = Partial<Record<"name" | "phone" | "email" | "message" | "category", string>>;

export type InterestFormValues = {
  category: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export function validateInterestForm(values: InterestFormValues): InterestFormErrors {
  const errors: InterestFormErrors = {};

  if (!isInterestCategory(values.category)) errors.category = "Unknown category.";

  if (!values.name.trim()) errors.name = "Please tell us your name.";
  else if (values.name.length > NAME_MAX) errors.name = "That name is too long.";

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (phoneDigits.length < PHONE_DIGITS_MIN || phoneDigits.length > PHONE_DIGITS_MAX) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!EMAIL_REGEX.test(values.email.trim()) || values.email.length > EMAIL_MAX) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.message.trim()) errors.message = "Please tell us a little about how you can help.";
  else if (values.message.length > MESSAGE_MAX) errors.message = "That's a bit long, try trimming it down.";

  return errors;
}
