import { AGE_CATEGORIES, AGE_CATEGORY_LABELS, GENDERS, GENDER_LABELS, type AgeCategory, type Gender } from "./garment-catalog";

type QuantityItem = { garmentType: string; quantity: number };

// One total per garment type regardless of who logged it or which gender/age
// it was for -- e.g. two separate "Pants" entries of 2 each collapse into a
// single entry. Shared by the donor view page, the on-screen donations
// table, and the Excel export so all three agree.
export function groupByGarment(items: QuantityItem[]): Array<[string, number]> {
  const byGarment = new Map<string, number>();
  for (const item of items) {
    byGarment.set(item.garmentType, (byGarment.get(item.garmentType) ?? 0) + item.quantity);
  }
  return [...byGarment.entries()].sort((a, b) => b[1] - a[1]);
}

// "4 x Shirts, 4 x Pants, 2 x Blankets"
export function summarizeGarments(items: QuantityItem[]): string {
  return groupByGarment(items)
    .map(([garment, qty]) => `${qty} x ${garment}`)
    .join(", ");
}

type AgeGenderItem = { gender: Gender; ageCategory: AgeCategory | null; quantity: number };

export type AgeGenderGroup = {
  key: string;
  label: string;
  total: number;
  byGender: Array<{ gender: Gender; label: string; quantity: number }>;
};

// Adult/Teen/Child, each split by who it's for -- plus a trailing "General"
// bucket for items with no age category at all (bedsheets, blankets, and
// the like, which aren't gendered or aged). Buckets with nothing logged are
// left out entirely rather than shown as a zero.
export function groupByAgeAndGender(items: AgeGenderItem[]): AgeGenderGroup[] {
  function byGenderWithin(bucket: AgeGenderItem[]) {
    return GENDERS.map((gender) => ({
      gender,
      label: GENDER_LABELS[gender],
      quantity: bucket.filter((item) => item.gender === gender).reduce((sum, item) => sum + item.quantity, 0),
    })).filter((g) => g.quantity > 0);
  }

  const groups: AgeGenderGroup[] = [];

  for (const age of AGE_CATEGORIES) {
    const bucket = items.filter((item) => item.ageCategory === age);
    if (bucket.length === 0) continue;
    groups.push({
      key: age,
      label: AGE_CATEGORY_LABELS[age],
      total: bucket.reduce((sum, item) => sum + item.quantity, 0),
      byGender: byGenderWithin(bucket),
    });
  }

  const ageless = items.filter((item) => item.ageCategory === null);
  if (ageless.length > 0) {
    groups.push({
      key: "general",
      label: "General",
      total: ageless.reduce((sum, item) => sum + item.quantity, 0),
      byGender: byGenderWithin(ageless),
    });
  }

  return groups;
}
