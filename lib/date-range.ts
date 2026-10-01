// Duration filter shared by any admin list that wants to filter by date
// range without client JS -- the choice lives in the URL (?range=...),
// resolved here into a gte/lt pair for a Prisma where clause.

export const RANGE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
] as const;

export type RangeValue = (typeof RANGE_OPTIONS)[number]["value"] | "custom";

export type ResolvedDateRange = {
  range: RangeValue;
  from: string; // yyyy-mm-dd, for prefilling the custom inputs
  to: string; // yyyy-mm-dd
  gte: Date | null;
  lt: Date | null; // exclusive
};

function utcDateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86_400_000);
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseISODate(value: string): Date | null {
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Params as they arrive from a Next.js server component's searchParams.
export function resolveDateRange(params: Record<string, string | string[] | undefined>): ResolvedDateRange {
  const rangeParam = typeof params.range === "string" ? params.range : "all";
  const today = utcDateOnly(new Date());
  const tomorrow = addDays(today, 1);

  if (rangeParam === "custom") {
    const fromRaw = typeof params.from === "string" ? params.from : "";
    const toRaw = typeof params.to === "string" ? params.to : "";
    const fromDate = fromRaw ? parseISODate(fromRaw) : null;
    const toDate = toRaw ? parseISODate(toRaw) : null;
    return {
      range: "custom",
      from: fromRaw,
      to: toRaw,
      gte: fromDate,
      lt: toDate ? addDays(toDate, 1) : null,
    };
  }

  switch (rangeParam) {
    case "today":
      return { range: "today", from: toISODate(today), to: toISODate(today), gte: today, lt: tomorrow };
    case "7d": {
      const from = addDays(today, -6);
      return { range: "7d", from: toISODate(from), to: toISODate(today), gte: from, lt: tomorrow };
    }
    case "30d": {
      const from = addDays(today, -29);
      return { range: "30d", from: toISODate(from), to: toISODate(today), gte: from, lt: tomorrow };
    }
    case "month": {
      const from = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
      return { range: "month", from: toISODate(from), to: toISODate(today), gte: from, lt: tomorrow };
    }
    case "year": {
      const from = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
      return { range: "year", from: toISODate(from), to: toISODate(today), gte: from, lt: tomorrow };
    }
    default:
      return { range: "all", from: "", to: "", gte: null, lt: null };
  }
}
