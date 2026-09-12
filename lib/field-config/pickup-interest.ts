// Field set for the "book a free pickup" popup on the New Life to Old
// Clothes page. Just enough to know who is interested before sending them
// on to WhatsApp.

const PHONE_DIGITS_MIN = 7;
const PHONE_DIGITS_MAX = 15;
const NAME_MAX = 120;

export type PickupInterestFormErrors = Partial<Record<"name" | "phone", string>>;

export type PickupInterestFormValues = {
  name: string;
  phone: string;
};

export function validatePickupInterestForm(values: PickupInterestFormValues): PickupInterestFormErrors {
  const errors: PickupInterestFormErrors = {};

  if (!values.name.trim()) errors.name = "Please tell us your name.";
  else if (values.name.length > NAME_MAX) errors.name = "That name is too long.";

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (phoneDigits.length < PHONE_DIGITS_MIN || phoneDigits.length > PHONE_DIGITS_MAX) {
    errors.phone = "Please enter a valid phone number.";
  }

  return errors;
}
