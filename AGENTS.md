# AGENTS.md

Zasady pracy w tym repozytorium — dla agentów AI i ludzi. Opis projektu
znajduje się w [`README.md`](README.md).

## Zanim zaczniesz

- Pracuj z roota repo; aplikacja i komendy są w `1-web/`.
- Po każdej zmianie modelu lub kodu uruchom: `cd 1-web && npm run check && npm run build`.
- Nie edytuj artefaktów: `1-web/8-output/`, `1-web/.astro/`, `node_modules/`. Nie są źródłem
  prawdy.

## Wdrożenie

- Strona: **https://patrykjaseniuk.github.io/ParysWeb2/** (GitHub Pages, repo
  `PatrykJaseniuk/ParysWeb2`); push na `main` uruchamia
  [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
- `base: "/ParysWeb2"` w `1-web/astro.config.mjs`; `SITE_ORIGIN`/`SITE_URL`
  w `1-web/2-ui/seo.ts`; linki i assety przez `withBase`
  w `1-web/1-data/business.ts`.
- **Domena `parys.nysa.pl` należy do starej strony** (repo `ParysWeb`). Nie
  przypisuj jej do `ParysWeb2` — zmiana `cname` w Pages tego repo zabierze
  domenę starej stronie.

## Zależności: numer = warstwa

- Katalogi w rootcie: **większy numer zależy od mniejszego**, ten sam numer =
  ten sam poziom (bez importów między sobą), `0` nie importuje niczego.
  - `0-core/` — rdzeń modelu, zero zależności zewnętrznych,
  - `1-web/` — konsument rdzenia (strona Astro),
  - `1-printables/` — kolejny konsument (na razie pusty).
- Ta sama zasada obowiązuje pliki w `0-core/`: prefiks numeru to warstwa,
  import wolno prowadzić tylko do pliku z **niższym** numerem.
  `0-core/index.ts` jest wyjątkiem — to kompozycja i publiczny punkt wejścia.
- Nie twórz importów „w górę" ani między plikami o tym samym numerze.

## Model (`0-core`)

1. **Tożsamość = klucz rekordu.** Encje katalogu to `Record<klucz, obiekt>`;
   nie dodawaj pola `id`. Wyjątki: `Highlight.id` (kotwica UI) i
   `LogoVariant.id` (dyskryminant unii).
2. **Referencje tylko przez typy kluczy** (`AreaKey`, `ClassKey`, `TrainerKey`,
   `PartnerKey`, `CalendarKey`, `PerkKey`), nigdy przez `string`.
   Nowy rodzaj referencji: dodaj parametr generyczny do kształtu w `0-types.ts`
   i przekaż właściwy typ klucza w `satisfies` modułu danych.
3. **Relacja zapisana raz.** Przynależność zajęć/partnerów do karnetu siedzi
   w `membership.*`; inwersję (`included_in`, zakres partnera) liczy adapter.
4. **Kolejność = kolejność kluczy.** Iteruj przez `Object.entries` /
   `Object.values`; nie zakładaj, że katalog jest tablicą.
5. **Nowa encja:** wpis w rekordzie w odpowiednim module (klucz stabilny,
   kebab-case, z prefiksem typu: `area-`, `class-`, `svc-`, `partner-`, …).
   Jeśli encja ma pliki — dodaj wpis w `media.bindings` w
   `1-web/0-site/1-site.ts`; jeśli jest strefą lub zajęciami — pamiętaj o
   ostrzeżeniu o brakującym zdjęciu w `1-web/0-site/3-invariants.ts`.
6. **Wersjonowanie:** zmiana kontraktu rdzenia = podbicie `model_version`
   w `0-core/index.ts`. `site.requires` i `quality.requires` biorą wersję
   z modelu, więc nie duplikuj numerów ręcznie.
7. **Brak walidacji referencji w runtime.** W `0-core` nie ma i nie powinno być
   `invariants.ts` — poprawność referencji pilnuje TypeScript. Reguły warstwy
   strony żyją wyłącznie w `1-web/0-site/3-invariants.ts`.

## Warstwa strony (`1-web`)

Numeracja lokalna `1-web`, niezależna od numeracji roota:

| Katalog | Warstwa | Zawartość |
|---|---|---|
| `0-assets/` | 0 | źródła mediów (zdjęcia, wideo, logo, SEO) |
| `0-docs/` | 0 | dokumentacja pisana ręcznie |
| `0-site/` | 0 | `0-types` … `3-invariants` + `4-model.ts` (barrel) |
| `1-data/` | 1 | adapter `business.ts` |
| `2-ui/` | 2 | `icons`, `seo`, `styles`, `ui/` |
| `3-components/` | 3 | sekcje, cennik, Header/Footer/StickyCta |
| `4-layouts/` | 4 | BaseLayout, LegalPage |
| `5-app/` | 5 | `pages/**` — `srcDir` Astro |
| `6-tools/` | 6 | skrypty (eksport, optymalizacja assetów) |
| `7-public/` | 7 | `publicDir` — serwowane assety generowane z `0-assets` |
| `8-output/` | 8 | `dist/`, `export/`, `docs/BRAND.md`, `tmp/` |

Poza numeracją zostaje wyłącznie granica narzędzi: `package.json`,
`package-lock.json`, `node_modules/`, `astro.config.mjs`, `tsconfig.json`,
`README.md`, `.gitignore`, `.vscode/` oraz generowany cache `.astro/`.

Zasady:

- Import tylko do katalogu o niższym numerze; w obrębie tej samej warstwy
  importy są dozwolone (to jej wewnętrzna struktura). `0-site/` może
  importować `0-core/` (globalne 0).
- `0-site/1-site.ts` — design, `media.bindings`: **klucz = klucz encji**
  z `0-core`. Brak wpisu oznacza brak pliku (działa `media.fallbacks`).
- `0-site/2-quality.ts` — blokery, pytania i założenia; `publishable` to
  decyzja człowieka, nie agenta.
- `1-data/business.ts` — jedyny adapter modelu do widoków. Komponenty nie
  czytają modelu bezpośrednio.
- `5-app/pages/**` — nazwy plików wyznaczają URL-e; nie prefiksuj ich numerami.
- `6-tools/` konsumuje `0-assets/` i `0-site/4-model.ts`, produkuje `7-public/`
  i `8-output/`.
- `8-output/` jest generowany w całości (`.gitignore`).

## Styl

- TypeScript strict, 2 spacje, cudzysłowy podwójne, przecinki końcowe jak
  w istniejących plikach.
- Treści, komentarze i nazwy domenowe po polsku; klucze encji kebab-case,
  pozostałe pola `snake_case`.
- Pieniądze w PLN (`meta.currency`), bez powtarzania waluty przy kwotach.
- Nie duplikuj wartości wyprowadzalnych (etykiety, „ważny 1 miesiąc”, zakresy) —
  licz je w adapterze.

## Weryfikacja

```bash
cd 1-web
npm run check        # 0 errors, 0 warnings
npm run build        # build + assertModelIntegrity() przy starcie
npm run model:export # opcjonalnie: poprawny 8-output/export/model.json
```

Sukces = brak błędów `astro check`, build kończy się `[build] Complete!`,
a log modelu pokazuje 6 stref · 4 karnety · 20 wariantów · 2 zajęcia ·
4 trenerów · 4 usługi.
