import Link from "next/link";
import type { StoryCard as StoryCardData } from "@/lib/stories";

export function StoryCard({ story }: { story: StoryCardData }) {
  return (
    <Link className="scard rv" href={`/stories/${story.slug}`}>
      <div className="ph">
        <img src={story.hero.src} width={story.hero.width} height={story.hero.height} alt="" loading="lazy" />
      </div>
      <div className="bd">
        <h3>{story.title}</h3>
        <p>{story.excerpt}</p>
        <div className="meta">
          {story.tags.slice(0, 2).map((tag) => (
            <span className="pill" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
