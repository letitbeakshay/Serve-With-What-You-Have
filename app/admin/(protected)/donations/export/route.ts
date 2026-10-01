import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/admin-session";
import { resolveDateRange } from "@/lib/date-range";
import { AGE_CATEGORY_LABELS, GENDER_LABELS, type AgeCategory, type Gender } from "@/lib/garment-catalog";
import { summarizeGarments } from "@/lib/garment-breakdown";

// Route handlers sit outside the (protected) layout's own auth check, so
// this re-checks for a logged-in admin itself -- same as every admin server
// action does.
export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return new Response("Not signed in.", { status: 401 });

  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  const { range, gte, lt } = resolveDateRange(params);
  const donatedAtFilter = gte || lt ? { ...(gte && { gte }), ...(lt && { lt }) } : undefined;

  const donations = await prisma.clothDonation.findMany({
    where: donatedAtFilter ? { donatedAt: donatedAtFilter } : undefined,
    orderBy: { donatedAt: "desc" },
    include: { items: { orderBy: { createdAt: "desc" } } },
  });

  const dateOnly = new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }); // yyyy-mm-dd
  const dateTime = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const donorRows = donations.map((d) => ({
    ID: d.donorNumber,
    Name: d.donorName,
    "Mobile number": d.phone,
    Email: d.email ?? "",
    "Donated on": dateOnly.format(d.donatedAt),
    Washed: d.washed === null ? "Don't know" : d.washed ? "Washed" : "Unwashed",
    "Collection point": d.collectionPoint ?? "",
    Location: d.location ?? "",
    "Total items logged": d.items.reduce((sum, item) => sum + item.quantity, 0),
    "Logged entries": d.items.length,
    "Clothes donated": summarizeGarments(d.items) || "Nothing logged yet",
  }));

  // One row per logged item, across every donor in the filtered range --
  // the full detail behind each "Clothes donated" summary above.
  const itemRows = donations.flatMap((d) =>
    d.items.map((item) => ({
      "Donor ID": d.donorNumber,
      "Donor name": d.donorName,
      Garment: item.garmentType,
      Quantity: item.quantity,
      For: GENDER_LABELS[item.gender as Gender],
      Age: item.ageCategory ? AGE_CATEGORY_LABELS[item.ageCategory as AgeCategory] : "",
      "Logged by": item.volunteerName,
      "Logged on": dateTime.format(item.createdAt),
    })),
  );

  const donorSheet = XLSX.utils.json_to_sheet(donorRows);
  const itemSheet = XLSX.utils.json_to_sheet(itemRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, donorSheet, "Donors");
  XLSX.utils.book_append_sheet(workbook, itemSheet, "Items donated");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

  const suffix = range === "all" ? "all-time" : range;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="cloth-donations-${suffix}.xlsx"`,
    },
  });
}
