-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "heroImagePath" TEXT NOT NULL,
    "heroImageWidth" INTEGER NOT NULL,
    "heroImageHeight" INTEGER NOT NULL,
    "heroCaption" TEXT,
    "standfirst" TEXT,
    "authorName" TEXT NOT NULL DEFAULT 'Serve With What You Have',
    "authorInitials" TEXT NOT NULL DEFAULT 'SW',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bodyHtml" TEXT NOT NULL,
    "facts" JSONB,
    "gave" JSONB,
    "ctaHeading" TEXT,
    "ctaText" TEXT,
    "relatedSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_published_publishedAt_idx" ON "Story"("published", "publishedAt");
