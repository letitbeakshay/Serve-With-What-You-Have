import { readFileSync } from "node:fs";
import { join } from "node:path";

const templatePath = join(process.cwd(), "app/new-life-to-old-clothes/content.html");

export async function GET() {
  const html = readFileSync(templatePath, "utf-8");

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
