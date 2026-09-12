import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validatePickupInterestForm } from "@/lib/field-config/pickup-interest";

// Backs the "book a free pickup" popup on the New Life to Old Clothes page.
// That page is raw static HTML (see app/new-life-to-old-clothes/route.ts),
// not a React page, so it can't call a Server Action directly -- a plain
// JSON route handler is what its vanilla-JS fetch() call posts to.
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

  const values = {
    name: String((body as Record<string, unknown>).name ?? "").trim(),
    phone: String((body as Record<string, unknown>).phone ?? "").trim(),
  };

  const fieldErrors = validatePickupInterestForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ ok: false, fieldErrors }, { status: 400 });
  }

  await prisma.pickupInterestResponse.create({ data: values });

  return NextResponse.json({ ok: true });
}
