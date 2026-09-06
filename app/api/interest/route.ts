import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateInterestForm } from "@/lib/field-config/interest";

// Backs the "show interest" popup on the homepage's Ways to serve section.
// That page is raw static HTML (see app/route.ts), not a React page, so it
// can't call a Server Action directly -- a plain JSON route handler is what
// its vanilla-JS fetch() call posts to.
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
    category: String((body as Record<string, unknown>).category ?? ""),
    name: String((body as Record<string, unknown>).name ?? "").trim(),
    phone: String((body as Record<string, unknown>).phone ?? "").trim(),
    email: String((body as Record<string, unknown>).email ?? "").trim(),
    message: String((body as Record<string, unknown>).message ?? "").trim(),
  };

  const fieldErrors = validateInterestForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ ok: false, fieldErrors }, { status: 400 });
  }

  await prisma.interestResponse.create({ data: values });

  return NextResponse.json({ ok: true });
}
