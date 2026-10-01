import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createVolunteerSessionToken, getVolunteerEntryCode, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";
import { findOrCreateVolunteer } from "@/lib/volunteer";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const volunteerName = String((body as Record<string, unknown>).volunteerName ?? "").trim();
  const phone = String((body as Record<string, unknown>).phone ?? "").trim();
  const code = String((body as Record<string, unknown>).code ?? "").trim();

  if (!volunteerName) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ ok: false, error: "Please enter your mobile number." }, { status: 400 });
  }
  if (code !== getVolunteerEntryCode()) {
    return NextResponse.json({ ok: false, error: "That code isn't right." }, { status: 401 });
  }

  const volunteer = await findOrCreateVolunteer({ phone, name: volunteerName });

  const { value, maxAge } = createVolunteerSessionToken({ volunteerName, volunteerId: volunteer.id });
  const cookieStore = await cookies();
  cookieStore.set(VOLUNTEER_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  return NextResponse.json({ ok: true, volunteerName });
}
