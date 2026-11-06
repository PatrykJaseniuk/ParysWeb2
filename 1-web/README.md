# 1-web — strona Sport Studio Parys

Konsument rdzenia [`../0-core`](../0-core): statyczna strona **Astro 5 +
Tailwind CSS 4 + TypeScript**. Zero frameworka JS na kliencie; treści pochodzą
z typowanego modelu, nie z CMS-a ani JSON-a.

## Układ katalogów

Numer katalogu to warstwa zależności (lokalnie w `1-web`, od 0). Import wolno
prowadzić tylko do katalogu o niższym numerze; w obrębie tej samej warstwy
importy są dozwolone. `0-site/` może też importować `0-core/`.

```text
0-assets/               # źródła mediów: photos, videos, partners, logos, seo
0-docs/                 # dokumentacja pisana: PLAN, CONTENT-MODEL, DESIGN
0-site/                 # definicje strony
  0-types.ts            #   kontrakty (SiteModel, QualityModel, Asset…)
  1-site.ts             #   design, media, nav, cta, seo, pages
  2-quality.ts          #   gotowość publikacji
  3-invariants.ts       #   assertModelIntegrity()
  4-model.ts            #   barrel: business, site, quality, assertModelIntegrity
1-data/
  business.ts           # adapter model → widoki (jedyny konsument 0-site)
2-ui/
  icons.ts  seo.ts  styles/global.css  ui/
3-components/
  sections/  pricing/  Header/Footer/StickyCta
4-layouts/
  BaseLayout.astro  LegalPage.astro
5-app/                  # srcDir Astro
  pages/                # nazwy plików = URL-e
6-tools/                # export-model, export-brand, prepare_assets
7-public/               # publicDir: pliki serwowane (generowane z 0-assets)
8-output/               # dist, export, docs/BRAND.md, tmp
```

Poza numeracją zostaje tylko granica narzędzi: `package.json`,
`package-lock.json`, `node_modules/`, `astro.config.mjs`, `tsconfig.json`,
`README.md`, `.gitignore`, `.vscode/`.

Konfiguracja Astro ([`astro.config.mjs`](astro.config.mjs)):

- `srcDir: "./5-app"` — routing,
- `publicDir: "./7-public"` — pliki serwowane 1:1,
- `outDir: "./8-output/dist"` — artefakty.

Komponenty nie czytają modelu bezpośrednio — tylko przez `1-data/business.ts`.

## Komendy

```bash
npm install
npm run dev          # http://localhost:4321/ParysWeb2/
npm run check        # astro check (typy całego projektu)
npm run build        # build + assertModelIntegrity() przy starcie
npm run preview      # podgląd builda
npm run model:export # 8-output/export/model.json
npm run brand:md     # 8-output/docs/BRAND.md z 0-core/2-brand.ts
npm run assets       # 7-public/ z 0-assets/ (Python 3 + Pillow)
```

## Wdrożenie

Strona działa pod **https://patrykjaseniuk.github.io/ParysWeb2/** (GitHub Pages,
repo `ParysWeb2`). Push na `main` uruchamia
[`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

- `base: "/ParysWeb2"` jest w [`astro.config.mjs`](astro.config.mjs),
- `SITE_ORIGIN`/`SITE_URL` w [`2-ui/seo.ts`](2-ui/seo.ts),
- wewnętrzne linki i assety dostają prefiks przez `withBase`
  w [`1-data/business.ts`](1-data/business.ts).

Domena `parys.nysa.pl` obsługuje starą stronę (repo `ParysWeb`) — ten projekt
nie powinien jej przejmować.

## Dokumentacja

- [`../README.md`](../README.md) — opis całego repozytorium i konwencji numeracji,
- [`../AGENTS.md`](../AGENTS.md) — zasady pracy i warstwy,
- [`0-docs/`](0-docs/) — PLAN, CONTENT-MODEL, DESIGN (starsze, opisują
  architekturę przed przeniesieniem rdzenia do `0-core`).
