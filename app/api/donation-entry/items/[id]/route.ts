import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { readVolunteerSessionToken, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";
import { validateDonationItemInput } from "@/lib/validate-donation-item";

// A volunteer may only edit or delete their own entries -- ownership is the
// item's volunteerName matching the session's, since there's no per-volunteer
// login to check against. Anyone else's entry 404s rather than 403s, so this
// doesn't leak whether a given id exists.
async function loadOwnedItem(id: string, volunteerName: string) {
  const item = await prisma.donationItem.findUnique({ where: { id } });
  if (!item || item.volunteerName !== volunteerName) return null;
  return item;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = readVolunteerSessionToken(cookieStore.get(VOLUNTEER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const existing = await loadOwnedItem(id, session.volunteerName);
  if (!existing) return NextResponse.json({ ok: false, error: "Entry not found." }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = validateDonationItemInput(body);
  if ("error" in result) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });

  // donationId is optional -- lets a volunteer correct who an entry was
  // actually logged against, not just the gender/age/garment/quantity.
  const { donationId } = body as Record<string, unknown>;
  let donationUpdate: { donationId: string } | Record<string, never> = {};
  if (donationId !== undefined) {
    if (typeof donationId !== "string" || !donationId) {
      return NextResponse.json({ ok: false, error: "Please choose a donor." }, { status: 400 });
    }
    const donation = await prisma.clothDonation.findUnique({ where: { id: donationId } });
    if (!donation) {
      return NextResponse.json({ ok: false, error: "That donor could not be found." }, { status: 404 });
    }
    donationUpdate = { donationId };
  }

  await prisma.donationItem.update({ where: { id }, data: { ...result.data, ...donationUpdate } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = readVolunteerSessionToken(cookieStore.get(VOLUNTEER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const existing = await loadOwnedItem(id, session.volunteerName);
  if (!existing) return NextResponse.json({ ok: false, error: "Entry not found." }, { status: 404 });

  await prisma.donationItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
