// Masks the last 4 digits of a phone number as "x", preserving everything
// else (spacing, formatting) as-is. Used server-side, before the number
// ever reaches a volunteer's browser -- not a display-only mask, since a
// client-side mask would still leak the real number over the network.
export function maskPhoneLast4(phone: string): string {
  const chars = phone.split("");
  let remaining = 4;
  for (let i = chars.length - 1; i >= 0 && remaining > 0; i--) {
    if (/\d/.test(chars[i])) {
      chars[i] = "x";
      remaining--;
    }
  }
  return chars.join("");
}
