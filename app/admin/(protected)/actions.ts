"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "form";
}

export async function createForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 2;
  // Slugs must be unique; append -2, -3, etc. on collision rather than
  // failing, since the founder shouldn't have to think about URLs.
  while (await prisma.form.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  await prisma.form.create({
    data: { name, slug, status: "OPEN" },
  });

  revalidatePath("/admin");
}
