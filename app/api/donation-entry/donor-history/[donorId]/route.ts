import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { readVolunteerSessionToken, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";
import { maskPhoneLast4 } from "@/lib/mask-phone";

// Read-only: lets a volunteer see everything already logged for one donor
// (across every time that person has given, not just the one drop-off they
// tapped), so they can check "has this already been entered?" before adding
// more. No edit or delete access -- that's still only through My entries,
// scoped to a volunteer's own entries.
export async function GET(_request: Request, { params }: { params: Promise<{ donorId: string }> }) {
  const cookieStore = await cookies();
  const session = readVolunteerSessionToken(cookieStore.get(VOLUNTEER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const { donorId } = await params;
  const donor = await prisma.donor.findUnique({
    where: { id: donorId },
    include: {
      clothDonations: {
        orderBy: { donatedAt: "desc" },
        include: { items: { orderBy: { createdAt: "desc" } } },
      },
    },
  });
  if (!donor) return NextResponse.json({ ok: false, error: "Donor not found." }, { status: 404 });

  const donations = donor.clothDonations.map((d) => ({
    id: d.id,
    donorNumber: d.donorNumber,
    donatedAt: d.donatedAt,
    washed: d.washed,
    collectionPoint: d.collectionPoint,
    location: d.location,
  }));

  const items = donor.clothDonations.flatMap((d) =>
    d.items.map((item) => ({
      id: item.id,
      garmentType: item.garmentType,
      quantity: item.quantity,
      gender: item.gender,
      ageCategory: item.ageCategory,
      volunteerName: item.volunteerName,
      createdAt: item.createdAt,
    })),
  );

  return NextResponse.json({
    ok: true,
    donor: {
      id: donor.id,
      donorNumber: donor.donorNumber,
      name: donor.name,
      phone: donor.phone ? maskPhoneLast4(donor.phone) : null,
    },
    donations,
    items,
  });
}
