import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { readVolunteerSessionToken, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";
import { maskPhoneLast4 } from "@/lib/mask-phone";

// Full list rather than a search endpoint: donor counts here are small
// enough that filtering client-side as the volunteer types is simpler and
// feels instant, with no debounce/network round trip per keystroke.
export async function GET() {
  const cookieStore = await cookies();
  const session = readVolunteerSessionToken(cookieStore.get(VOLUNTEER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const donors = await prisma.clothDonation.findMany({
    orderBy: { donatedAt: "desc" },
    select: { id: true, donorNumber: true, donorName: true, phone: true, donatedAt: true },
  });

  // The real number never leaves the server -- masked here, not just hidden
  // in the UI, so it's not sitting in the browser's network tab either.
  const masked = donors.map((donor) => ({ ...donor, phone: maskPhoneLast4(donor.phone) }));

  return NextResponse.json({ ok: true, donors: masked });
}
