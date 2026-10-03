import { prisma } from "@/lib/db";

export type MonthlyPoint = { key: string; label: string; total: number };

const MONTH_LABEL = new Intl.DateTimeFormat("en-IN", { month: "short", timeZone: "UTC" });

// Total clothes donated per calendar month, for the trailing `months`
// months (default 12) ending with the current month -- zero-filled, so a
// quiet month shows as a dip rather than disappearing from the line.
export async function getMonthlyClothesDonated(months = 12): Promise<MonthlyPoint[]> {
  const now = new Date();
  const currentMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const rangeStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1));

  const items = await prisma.donationItem.findMany({
    where: { donation: { donatedAt: { gte: rangeStart } } },
    select: { quantity: true, donation: { select: { donatedAt: true } } },
  });

  const totals = new Map<string, number>();
  for (const item of items) {
    const d = item.donation.donatedAt;
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    totals.set(key, (totals.get(key) ?? 0) + item.quantity);
  }

  const points: MonthlyPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(currentMonthStart.getUTCFullYear(), currentMonthStart.getUTCMonth() - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    points.push({ key, label: MONTH_LABEL.format(d), total: totals.get(key) ?? 0 });
  }
  return points;
}
