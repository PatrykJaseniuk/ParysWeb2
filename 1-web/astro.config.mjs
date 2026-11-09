import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  srcDir: "./5-app",
  publicDir: "./7-public",
  outDir: "./8-output/dist",
  // Projektowy GitHub Pages: https://patrykjaseniuk.github.io/ParysWeb2/
  // Domena parys.nysa.pl należy do starej strony (repo ParysWeb).
  site: "https://patrykjaseniuk.github.io",
  base: "/ParysWeb2",
  trailingSlash: "never",
  integrations: [
    sitemap(),
  ],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: "auto",
  },
});
