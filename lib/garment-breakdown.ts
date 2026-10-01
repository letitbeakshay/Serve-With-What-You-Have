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
