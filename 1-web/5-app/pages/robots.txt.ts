import type { APIRoute } from "astro";

/**
 * robots.txt generowany przy buildzie.
 * Zastępuje pusty `robot.txt` ze starej strony (błędna nazwa, 0 B).
 */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const origin = site ?? new URL("https://patrykjaseniuk.github.io");
  const sitemap = new URL(`${base.replace(/\/$/, "")}/sitemap-index.xml`, origin);
  const basePath = base.replace(/\/$/, "");

  const body = [
    "User-agent: *",
    `Allow: ${basePath || ""}/`,
    "",
    `Sitemap: ${sitemap.toString()}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
