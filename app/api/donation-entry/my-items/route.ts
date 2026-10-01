import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { readVolunteerSessionToken, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";

// Lets a volunteer see what they personally have logged, so they can correct
// a mistake themselves instead of asking the admin. Scoped to their
// volunteerName -- there's no per-volunteer login, so that name is the only
// thing distinguishing "mine" from everyone else's entries.
export async function GET() {
  const cookieStore = await cookies();
  const session = readVolunteerSessionToken(cookieStore.get(VOLUNTEER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const items = await prisma.donationItem.findMany({
    where: { volunteerName: session.volunteerName },
    orderBy: { createdAt: "desc" },
    include: { donation: { select: { donorNumber: true, donorName: true } } },
  });

  return NextResponse.json({ ok: true, items });
}
