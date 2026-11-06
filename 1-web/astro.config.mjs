import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  srcDir: "./5-app",
  publicDir: "./7-public",
  outDir: "./8-output/dist",
  site: "https://parys.nysa.pl",
  trailingSlash: "never",
  integrations: [
    sitemap({
      // Dokumenty prawne są `noindex` do czasu uzupełnienia — nie trafiają do sitemapy.
      filter: (page) =>
        !page.includes("/polityka-prywatnosci") && !page.includes("/regulamin"),
    }),
  ],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: "auto",
  },
});
