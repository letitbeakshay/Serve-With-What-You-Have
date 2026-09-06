import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ALLOWED_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Writes the uploaded banner to public/stories/<slug>/hero.<ext> and reads
// back its real dimensions so the <img> never causes layout shift.
//
// NOTE: this writes to the local filesystem, which works in development but
// is NOT persisted on Vercel's read-only production filesystem. Before this
// goes live, banner storage needs to move to Supabase Storage (or similar)
// instead of public/.
export async function saveStoryImage(
  file: File,
  slug: string,
): Promise<{ path: string; width: number; height: number }> {
  const ext = ALLOWED_EXT[file.type];
  if (!ext) {
    throw new Error("Banner must be a JPEG, PNG or WebP image.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(buffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Couldn't read the image dimensions.");
  }

  const dir = join(process.cwd(), "public", "stories", slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `hero.${ext}`), buffer);

  return {
    path: `/stories/${slug}/hero.${ext}`,
    width: metadata.width,
    height: metadata.height,
  };
}
