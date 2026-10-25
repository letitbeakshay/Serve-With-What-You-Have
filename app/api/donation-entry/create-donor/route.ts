import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { readVolunteerSessionToken, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";
import { parseDonationFormData } from "@/lib/cloth-donation";
import { findOrCreateDonor, getOrCreateAnonymousDonor } from "@/lib/donor";

// Lets a volunteer add a donor on the spot at /donation-entry, rather than
// only being able to pick from donors the admin already logged. Same
// validation and donor-matching as the admin "Log a donation" form and the
// public /add-donor link, just gated by the volunteer session instead.
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = readVolunteerSessionToken(cookieStore.get(VOLUNTEER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const formData = await request.formData();
  const result = parseDonationFormData(formData);
  if ("error" in result) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });

  const { isAnonymous, ...data } = result.data;
  const donor = isAnonymous
    ? await getOrCreateAnonymousDonor()
    : await findOrCreateDonor({ phone: data.phone, name: data.donorName, email: data.email });

  const donation = await prisma.clothDonation.create({ data: { ...data, donorId: donor.id } });

  return NextResponse.json({
    ok: true,
    donor: {
      id: donation.id,
      donorNumber: donation.donorNumber,
      donorName: donation.donorName,
      phone: donation.phone,
      donatedAt: donation.donatedAt,
    },
  });
}
