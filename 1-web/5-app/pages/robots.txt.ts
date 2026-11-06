import type { APIRoute } from "astro";

/**
 * robots.txt generowany przy buildzie.
 * Zastępuje pusty `robot.txt` ze starej strony (błędna nazwa, 0 B).
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("sitemap-index.xml", site ?? "https://parys.nysa.pl");

  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "# Dokumenty robocze (polityka prywatności, regulamin) — do odblokowania",
    "# po uzupełnieniu treści prawnej.",
    "Disallow: /polityka-prywatnosci",
    "Disallow: /regulamin",
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
