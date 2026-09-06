import sanitizeHtml from "sanitize-html";

// Admin pastes raw HTML for a story body. This strips scripts, event
// handlers and anything outside the tags the story template actually
// styles (see the .read column CSS in app/stories/[slug]/page.tsx).
export function sanitizeStoryHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "strong", "em", "blockquote", "cite", "br", "ul", "ol", "li", "a"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
