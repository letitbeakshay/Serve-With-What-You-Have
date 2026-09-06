import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStory } from "@/lib/stories";
import { SiteHeader } from "@/components/stories/site-header";
import { SiteFooter } from "@/components/stories/site-footer";
import { ScrollReveal } from "@/components/stories/scroll-reveal";
import { ReadingProgress } from "@/components/stories/reading-progress";
import { StoryCard } from "@/components/stories/story-card";
import { GaveGrid } from "@/components/stories/gave-grid";

type Params = { slug: string };

// Same reasoning as app/stories/page.tsx: content is DB-driven and can
// change at any time via the admin panel.
export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return {};

  const title = `${story.title} | Serve With What You Have`;
  return {
    title,
    description: story.standfirst,
    openGraph: {
      title,
      description: story.standfirst,
      images: [{ url: story.hero.src, width: story.hero.width, height: story.hero.height }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: story.standfirst,
      images: [story.hero.src],
    },
  };
}

export default async function StoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  return (
    <>
      <ReadingProgress />
      <SiteHeader />

      <main>
        <article>
          <section className="s-head">
            <div className="wrap">
              <div className="read">
                <Link className="back" href="/stories">
                  &larr; All stories
                </Link>
                <div className="tags">
                  {story.tags.map((tag, index) => (
                    <span className={index === 0 ? "pill solid" : "pill"} key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h1>{story.title}</h1>
                <p className="dek">{story.standfirst}</p>
                <div className="byline">
                  <span className="av">{story.author.initials}</span>
                  <span className="who">
                    <b>{story.author.name}</b>
                    <span>Shared in their own words &middot; {dateFormatter.format(story.publishedAt)}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="wrap">
            <div className="read rv">
              <div className="s-hero">
                <img src={story.hero.src} width={story.hero.width} height={story.hero.height} alt="" />
              </div>
              {story.hero.caption ? <p className="cap">{story.hero.caption}</p> : null}
            </div>
          </div>

          {story.facts ? (
            <div className="wrap">
              <div className="facts rv">
                {story.facts.map((fact) => (
                  <div className="fact" key={fact.label}>
                    <b>{fact.value}</b>
                    <span>{fact.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <section className="body">
            <div className="wrap">
              <div className="read" dangerouslySetInnerHTML={{ __html: story.bodyHtml }} />

              {story.gave ? (
                <div className="read">
                  <GaveGrid gave={story.gave} />
                </div>
              ) : null}

              {story.cta ? (
                <div className="close-cta rv">
                  <h2>{story.cta.heading}</h2>
                  <p>{story.cta.text}</p>
                  <Link className="btn btn-clay" href="/#ways">
                    See what I can serve with <span className="arw">&rarr;</span>
                  </Link>
                </div>
              ) : null}
            </div>
          </section>
        </article>

        {story.related.length > 0 ? (
          <section className="more">
            <div className="wrap">
              <div className="more-head rv">
                <div>
                  <p className="eyebrow">More stories</p>
                  <h2>Others who started with what they had.</h2>
                </div>
                <Link className="btn btn-line" href="/stories">
                  All stories
                </Link>
              </div>

              <div className="grid2">
                {story.related.map((related) => (
                  <StoryCard story={related} key={related.slug} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
