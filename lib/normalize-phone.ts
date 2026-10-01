// Strips everything but digits, so "93459 20202", "9345920202", and a copy
// with a stray invisible character all match as the same phone number. Used
// wherever a donor needs to be matched/deduplicated by phone, not just
// displayed -- the original, human-entered string is still what's shown.
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}
