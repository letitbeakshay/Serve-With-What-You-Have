// Single source of truth for what a volunteer can pick in the donation-entry
// flow. Shared between the client wizard (button labels) and the item API
// route (which re-checks that a submitted garment type actually belongs to
// the submitted gender, since the client can't be trusted).

export const GENDERS = ["MALE", "FEMALE", "GENERAL"] as const;
export type Gender = (typeof GENDERS)[number];

export const AGE_CATEGORIES = ["ADULT", "TEEN", "CHILD"] as const;
export type AgeCategory = (typeof AGE_CATEGORIES)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  GENERAL: "General",
};

export const AGE_CATEGORY_LABELS: Record<AgeCategory, string> = {
  ADULT: "Adult",
  TEEN: "Teen",
  CHILD: "Child",
};

export const GARMENTS_BY_GENDER: Record<Gender, string[]> = {
  MALE: [
    "T-shirts",
    "Shirts",
    "Pants",
    "Jeans",
    "Shorts",
    "Track pants",
    "Sweaters",
    "Jackets",
    "Kurtas",
    "Dhoti / Veshti",
    "Formal wear",
  ],
  FEMALE: [
    "T-shirts",
    "Tops",
    "Shirts",
    "Pants",
    "Jeans",
    "Leggings",
    "Skirts",
    "Dresses",
    "Frocks",
    "Kurtis",
    "Salwar suits",
    "Sarees",
    "Blouses",
    "Churidar sets",
    "Sweaters",
    "Jackets",
    "Shawls",
  ],
  // No gender/age split for these -- bedsheets, blankets etc.
  GENERAL: ["Bedsheets", "Towels", "Blankets", "School bags", "Footwear (pairs)", "Other"],
};

// What icon each garment should show in the donation-entry grid. No icon
// library has one for every item here (there's no "saree" or "dhoti" icon
// anywhere), so each garment is grouped into a small number of recognizable
// shapes instead: a top, a bottom, a full one-piece outfit, or one of the
// General items' own icons.
export type GarmentIconKey =
  | "top"
  | "bottom"
  | "outfit"
  | "bed"
  | "blanket"
  | "towel"
  | "bag"
  | "shoe"
  | "other";

const GARMENT_ICON_KEYS: Record<string, GarmentIconKey> = {
  // Tops -- shirts, kurtas, sweaters, anything worn on the upper body
  "T-shirts": "top",
  Shirts: "top",
  Sweaters: "top",
  Jackets: "top",
  Kurtas: "top",
  "Formal wear": "top",
  Tops: "top",
  Kurtis: "top",
  Blouses: "top",
  Shawls: "top",
  // Bottoms -- a single lower-body garment
  Pants: "bottom",
  Jeans: "bottom",
  Shorts: "bottom",
  "Track pants": "bottom",
  "Dhoti / Veshti": "bottom",
  Leggings: "bottom",
  // Full one-piece outfits / draped garments
  Skirts: "outfit",
  Dresses: "outfit",
  Frocks: "outfit",
  "Salwar suits": "outfit",
  Sarees: "outfit",
  "Churidar sets": "outfit",
  // General (non-gendered) items
  Bedsheets: "bed",
  Blankets: "blanket",
  Towels: "towel",
  "School bags": "bag",
  "Footwear (pairs)": "shoe",
  Other: "other",
};

export function getGarmentIconKey(garmentType: string): GarmentIconKey {
  return GARMENT_ICON_KEYS[garmentType] ?? "other";
}

export function isGender(value: unknown): value is Gender {
  return typeof value === "string" && (GENDERS as readonly string[]).includes(value);
}

export function isAgeCategory(value: unknown): value is AgeCategory {
  return typeof value === "string" && (AGE_CATEGORIES as readonly string[]).includes(value);
}

export function isGarmentForGender(gender: Gender, garmentType: unknown): garmentType is string {
  return typeof garmentType === "string" && GARMENTS_BY_GENDER[gender].includes(garmentType);
}
