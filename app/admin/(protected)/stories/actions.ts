"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { sanitizeStoryHtml } from "@/lib/sanitize-story-html";
import { saveStoryImage } from "@/lib/save-story-image";

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "story";
}

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createStory(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const bodyHtml = String(formData.get("bodyHtml") ?? "").trim();
  const banner = formData.get("banner");

  if (!title || !bodyHtml || !(banner instanceof File) || banner.size === 0) {
    throw new Error("Title, banner and body are all required.");
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 2;
  while (await prisma.story.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const hero = await saveStoryImage(banner, slug);

  await prisma.story.create({
    data: {
      slug,
      title,
      tags,
      heroImagePath: hero.path,
      heroImageWidth: hero.width,
      heroImageHeight: hero.height,
      bodyHtml: sanitizeStoryHtml(bodyHtml),
    },
  });

  revalidatePath("/");
  revalidatePath("/stories");
  redirect("/admin/stories");
}

export async function updateStory(slug: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const bodyHtml = String(formData.get("bodyHtml") ?? "").trim();
  const published = formData.get("published") === "on";
  const banner = formData.get("banner");

  if (!title || !bodyHtml) {
    throw new Error("Title and body are required.");
  }

  const existing = await prisma.story.findUnique({ where: { slug } });
  if (!existing) {
    throw new Error("Story not found.");
  }

  const hero = banner instanceof File && banner.size > 0 ? await saveStoryImage(banner, slug) : null;

  await prisma.story.update({
    where: { slug },
    data: {
      title,
      tags,
      bodyHtml: sanitizeStoryHtml(bodyHtml),
      published,
      ...(hero && {
        heroImagePath: hero.path,
        heroImageWidth: hero.width,
        heroImageHeight: hero.height,
      }),
    },
  });

  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath(`/stories/${slug}`);
  redirect("/admin/stories");
}
