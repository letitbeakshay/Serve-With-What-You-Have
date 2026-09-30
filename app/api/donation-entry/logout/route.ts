import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { VOLUNTEER_SESSION_COOKIE } from "@/lib/volunteer-session";

// Actually invalidates the session cookie server-side. Without this, "Not
// so-and-so?" only reset the page's local state -- the still-valid cookie
// would log the previous volunteer straight back in on the next reload.
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(VOLUNTEER_SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
