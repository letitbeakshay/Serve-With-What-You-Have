import { prisma } from "@/lib/db";

// Supabase's free tier pauses a project after about a week with no database
// activity, which is what took the admin panel down. This route makes one
// real query so any traffic to it counts as activity and keeps the project
// awake. It's built to be hit two ways:
//   1. Vercel Cron (see vercel.json) — the reliable, always-on path.
//   2. As an <img> embed pasted on any page people actually visit, since it
//      answers with a real (tiny, transparent) GIF rather than JSON.
// Either way it must never be cached, or the query it depends on never runs.

export const dynamic = "force-dynamic";
export const revalidate = 0;

// A 1x1 transparent GIF, the smallest valid image, so this doubles as a
// classic tracking-pixel embed.
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
  "base64",
);

export async function GET() {
  try {
    await prisma.adminAuthState.findUnique({ where: { id: 1 } });
  } catch (error) {
    // Report failure but still return the pixel: an embed on an external
    // page shouldn't show a broken image just because this check errored.
    console.error("keepalive query failed", error);
  }

  return new Response(TRANSPARENT_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
    },
  });
}
