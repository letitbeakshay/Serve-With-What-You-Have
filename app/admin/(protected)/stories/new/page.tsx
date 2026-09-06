import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createStory } from "../actions";

export default function NewStoryPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/admin/stories" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Stories
      </Link>

      <h1 className="mt-3 font-heading text-xl font-semibold text-foreground sm:text-2xl">New story</h1>

      <form action={createStory} className="mt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required placeholder="Two bags that sat in a cupboard" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" name="tags" required placeholder="Clothes, Coimbatore, One afternoon" />
          <p className="text-xs text-muted-foreground">
            Comma separated. The first tag is shown as the solid pill.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="banner">Banner image</Label>
          <Input id="banner" name="banner" type="file" accept="image/jpeg,image/png,image/webp" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyHtml">Body</Label>
          <Textarea
            id="bodyHtml"
            name="bodyHtml"
            required
            className="min-h-64 font-mono text-sm"
            placeholder="<p>The bags had been at the bottom of the almirah for so long...</p>"
          />
          <p className="text-xs text-muted-foreground">
            Paste HTML directly. Supported tags: p, h2, h3, strong, em, blockquote/cite, ul/ol/li, a.
          </p>
        </div>

        <Button type="submit">Publish story</Button>
      </form>
    </main>
  );
}
