import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { updateStory } from "../../actions";

export default async function EditStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await prisma.story.findUnique({ where: { slug } });
  if (!story) notFound();

  const boundUpdate = updateStory.bind(null, story.slug);

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/admin/stories" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Stories
      </Link>

      <h1 className="mt-3 font-heading text-xl font-semibold text-foreground sm:text-2xl">Edit story</h1>
      <p className="mt-1 text-sm text-muted-foreground">/stories/{story.slug}</p>

      <form action={boundUpdate} className="mt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={story.title} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" name="tags" required defaultValue={story.tags.join(", ")} />
          <p className="text-xs text-muted-foreground">
            Comma separated. The first tag is shown as the solid pill.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="banner">Banner image</Label>
          <img
            src={story.heroImagePath}
            width={story.heroImageWidth}
            height={story.heroImageHeight}
            alt=""
            className="h-32 w-auto rounded-lg border border-border object-cover"
          />
          <Input id="banner" name="banner" type="file" accept="image/jpeg,image/png,image/webp" />
          <p className="text-xs text-muted-foreground">Leave empty to keep the current banner.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyHtml">Body</Label>
          <Textarea id="bodyHtml" name="bodyHtml" required className="min-h-64 font-mono text-sm" defaultValue={story.bodyHtml} />
          <p className="text-xs text-muted-foreground">
            Paste HTML directly. Supported tags: p, h2, h3, strong, em, blockquote/cite, ul/ol/li, a.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="published" name="published" value="on" defaultChecked={story.published} />
          <Label htmlFor="published">Published</Label>
        </div>

        <Button type="submit">Save changes</Button>
      </form>
    </main>
  );
}
