import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getRecentStories } from "@/lib/stories";

const templatePath = join(process.cwd(), "app/home-content.html");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceBetween(html: string, marker: string, content: string): string {
  const pattern = new RegExp(`<!--${marker}-->[\\s\\S]*?<!--/${marker}-->`);
  return html.replace(pattern, `<!--${marker}-->${content}<!--/${marker}-->`);
}

export async function GET() {
  let html = readFileSync(templatePath, "utf-8");

  // If the database is unreachable, fall back to the static placeholder
  // content baked into the template rather than 500ing the whole homepage.
  const stories = await getRecentStories(3).catch(() => []);

  if (stories.length > 0) {
    const grid = stories
      .map(
        (story) => `
        <a class="scene" href="/stories/${escapeHtml(story.slug)}">
          <div class="top"><img src="${escapeHtml(story.hero.src)}" width="${story.hero.width}" height="${story.hero.height}" alt="" loading="lazy"></div>
          <div class="bd">
            <h3>${escapeHtml(story.title)}</h3>
            <p>${escapeHtml(story.excerpt)}</p>
            <div class="meta">${story.tags
              .slice(0, 2)
              .map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`)
              .join("")}</div>
          </div>
        </a>`,
      )
      .join("");

    html = replaceBetween(html, "SCENES_INTRO", "<p>Real stories from people who have already served with what they had.</p>");
    html = replaceBetween(html, "SCENES_GRID", grid);
    html = replaceBetween(
      html,
      "SCENES_CTA",
      `<div class="scenes-cta"><a class="btn btn-line" href="/stories">Read more stories <span class="arw">&rarr;</span></a></div>`,
    );
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
