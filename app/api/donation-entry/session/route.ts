import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readVolunteerSessionToken, VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";

// Lets the page check on load whether it already has a valid cookie, so a
// volunteer who reloads mid-shift doesn't have to type the code again.
export async function GET() {
  const cookieStore = await cookies();
  const session = readVolunteerSessionToken(cookieStore.get(VOLUNTEER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, volunteerName: session.volunteerName });
}
