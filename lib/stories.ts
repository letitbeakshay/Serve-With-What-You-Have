import { prisma } from "@/lib/db";
import type { Story as StoryRow } from "@/lib/generated/prisma/client";

export type GaveSquareState = "money" | "given" | "unused";

export type GaveData = {
  label: string;
  subtext: string;
  squares: GaveSquareState[]; // length 9, left-to-right, top-to-bottom
  primaryTag: string;
};

export type FactData = { value: string; label: string };

export type StoryCard = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  hero: { src: string; width: number; height: number };
};

export type StoryData = {
  slug: string;
  title: string;
  tags: string[];
  hero: { src: string; width: number; height: number; caption: string | null };
  standfirst: string;
  author: { name: string; initials: string };
  publishedAt: Date;
  bodyHtml: string;
  facts: FactData[] | null;
  gave: GaveData | null;
  cta: { heading: string; text: string } | null;
  related: StoryCard[];
};

function isGaveData(value: unknown): value is GaveData {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.label === "string" &&
    typeof v.subtext === "string" &&
    typeof v.primaryTag === "string" &&
    Array.isArray(v.squares) &&
    v.squares.length === 9
  );
}

function isFactArray(value: unknown): value is FactData[] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (f) => f && typeof f === "object" && typeof (f as FactData).value === "string" && typeof (f as FactData).label === "string",
    )
  );
}

function fallbackStandfirst(bodyHtml: string): string {
  const text = bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

function toCard(row: StoryRow): StoryCard {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.standfirst ?? fallbackStandfirst(row.bodyHtml),
    tags: row.tags,
    hero: { src: row.heroImagePath, width: row.heroImageWidth, height: row.heroImageHeight },
  };
}

async function toStoryData(row: StoryRow): Promise<StoryData> {
  const related =
    row.relatedSlugs.length > 0
      ? await prisma.story.findMany({
          where: { slug: { in: row.relatedSlugs }, published: true },
        })
      : [];

  // Preserve the order editors picked in relatedSlugs, not DB order.
  const relatedBySlug = new Map(related.map((r) => [r.slug, r]));
  const orderedRelated = row.relatedSlugs
    .map((slug) => relatedBySlug.get(slug))
    .filter((r): r is StoryRow => Boolean(r))
    .map(toCard);

  return {
    slug: row.slug,
    title: row.title,
    tags: row.tags,
    hero: {
      src: row.heroImagePath,
      width: row.heroImageWidth,
      height: row.heroImageHeight,
      caption: row.heroCaption,
    },
    standfirst: row.standfirst ?? fallbackStandfirst(row.bodyHtml),
    author: { name: row.authorName, initials: row.authorInitials },
    publishedAt: row.publishedAt,
    bodyHtml: row.bodyHtml,
    facts: isFactArray(row.facts) ? row.facts : null,
    gave: isGaveData(row.gave) ? row.gave : null,
    cta: row.ctaHeading && row.ctaText ? { heading: row.ctaHeading, text: row.ctaText } : null,
    related: orderedRelated,
  };
}

export async function getStory(slug: string): Promise<StoryData | null> {
  const row = await prisma.story.findUnique({ where: { slug } });
  if (!row || !row.published) return null;
  return toStoryData(row);
}

export async function getAllStories(): Promise<StoryCard[]> {
  const rows = await prisma.story.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toCard);
}

export async function getRecentStories(limit: number): Promise<StoryCard[]> {
  const rows = await prisma.story.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map(toCard);
}
