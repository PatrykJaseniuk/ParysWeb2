import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  srcDir: "./5-app",
  publicDir: "./7-public",
  outDir: "./8-output/dist",
  // Produkcja: https://parys.nysa.pl/ (domena własna, GitHub Pages).
  // Repo: PatrykJaseniuk/ParysWeb2 — push na `main` uruchamia deploy.
  site: "https://parys.nysa.pl",
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
