import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { readVolunteerSessionToken, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";
import { isAgeCategory, isGarmentForGender, isGender } from "@/lib/garment-catalog";

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

  const { donationId, gender, ageCategory, garmentType, quantity } = body as Record<string, unknown>;

  if (typeof donationId !== "string" || !donationId) {
    return NextResponse.json({ ok: false, error: "Please choose a donor." }, { status: 400 });
  }
  if (!isGender(gender)) {
    return NextResponse.json({ ok: false, error: "Please choose male, female or general." }, { status: 400 });
  }
  // GENERAL items skip the age step entirely; MALE/FEMALE items require one.
  const resolvedAgeCategory = gender === "GENERAL" ? null : isAgeCategory(ageCategory) ? ageCategory : null;
  if (gender !== "GENERAL" && resolvedAgeCategory === null) {
    return NextResponse.json({ ok: false, error: "Please choose an age category." }, { status: 400 });
  }
  if (!isGarmentForGender(gender, garmentType)) {
    return NextResponse.json({ ok: false, error: "Please choose a garment type." }, { status: 400 });
  }
  const parsedQuantity = Number(quantity);
  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 999) {
    return NextResponse.json({ ok: false, error: "Enter a quantity between 1 and 999." }, { status: 400 });
  }

  const donation = await prisma.clothDonation.findUnique({ where: { id: donationId } });
  if (!donation) {
    return NextResponse.json({ ok: false, error: "That donor could not be found." }, { status: 404 });
  }

  await prisma.donationItem.create({
    data: {
      donationId,
      volunteerName: session.volunteerName,
      gender,
      ageCategory: resolvedAgeCategory,
      garmentType,
      quantity: parsedQuantity,
    },
  });

  return NextResponse.json({ ok: true });
}
