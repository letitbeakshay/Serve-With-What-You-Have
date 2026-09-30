import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { readVolunteerSessionToken, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";

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

  return NextResponse.json({ ok: true, donors });
}
