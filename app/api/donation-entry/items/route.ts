import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { readVolunteerSessionToken, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";
import { validateDonationItemInput } from "@/lib/validate-donation-item";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = readVolunteerSessionToken(cookieStore.get(VOLUNTEER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { donationId } = body as Record<string, unknown>;
  if (typeof donationId !== "string" || !donationId) {
    return NextResponse.json({ ok: false, error: "Please choose a donor." }, { status: 400 });
  }

  const result = validateDonationItemInput(body);
  if ("error" in result) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });

  const donation = await prisma.clothDonation.findUnique({ where: { id: donationId } });
  if (!donation) {
    return NextResponse.json({ ok: false, error: "That donor could not be found." }, { status: 404 });
  }

  await prisma.donationItem.create({
    data: {
      donationId,
      volunteerName: session.volunteerName,
      ...result.data,
    },
  });

  return NextResponse.json({ ok: true });
}
