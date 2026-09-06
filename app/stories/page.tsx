import type { Metadata } from "next";
import { getAllStories } from "@/lib/stories";
import { SiteHeader } from "@/components/stories/site-header";
import { SiteFooter } from "@/components/stories/site-footer";
import { ScrollReveal } from "@/components/stories/scroll-reveal";
import { StoryCard } from "@/components/stories/story-card";

// Story list changes whenever admin publishes a new one; not worth
// statically prerendering (and it would need DB access at build time).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stories | Serve With What You Have",
  description: "Small things people have served with, told in their own words.",
};

export default async function StoriesIndexPage() {
  const stories = await getAllStories();

  return (
    <>
      <SiteHeader />

      <main>
        <section className="list-head">
          <div className="wrap">
            <div className="rv">
              <p className="eyebrow">Stories</p>
              <h1>What this looks like, in people&apos;s own words.</h1>
            </div>
          </div>
        </section>

        <section className="more">
          <div className="wrap">
            {stories.length === 0 ? (
              <p className="empty">No stories yet. Check back soon.</p>
            ) : (
              <div className="grid3">
                {stories.map((story) => (
                  <StoryCard story={story} key={story.slug} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
