import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Admin
      </Link>

      <div className="mt-3 flex items-center justify-between gap-4">
        <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">Stories</h1>
        <Link href="/admin/stories/new" className={buttonVariants({ variant: "default" })}>
          New story
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        {stories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No stories yet. Create one above.</p>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{story.title}</p>
                <p className="truncate text-sm text-muted-foreground">
                  /stories/{story.slug} &middot; {story.published ? "Published" : "Hidden"} &middot;{" "}
                  {dateFormatter.format(story.publishedAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/stories/${story.slug}/edit`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
                <Link
                  href={`/stories/${story.slug}`}
                  target="_blank"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
