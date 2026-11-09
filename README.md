# Parys — model danych i strona Sport Studio Parys

Repozytorium zawiera typowany model danych siłowni (**`0-core`**) oraz
generowaną z niego statyczną stronę (**`1-web`**, Astro 5 + Tailwind 4).
Źródłem prawdy są moduły TypeScript — nie JSON, CMS ani baza danych.

## Struktura i kolejność zależności

Katalogi mają numery warstw: **większy numer zależy od mniejszego**, ten sam
numer oznacza ten sam poziom (pliki/katalogi równoległe nie importują się
nawzajem), a `0` jest korzeniem, który nie importuje niczego.

| Katalog | Warstwa | Rola |
|---|---|---|
| `0-core/` | 0 | fakty o firmie, marka, cennik, katalog encji |
| `1-web/` | 1 | warstwa strony (`site/`) + aplikacja Astro |
| `1-printables/` | 1 | konsument modelu: cennik A4 do druku (PDF + HTML) |

Ta sama zasada obowiązuje pliki w `0-core/` — prefiks numeru wyznacza warstwę:

```text
0-types          kontrakt kształtu (korzeń, zero importów)
1-perks          słownik dodatków
1-meta           wersja, waluta, strefa czasowa, cennik
1-company        tożsamość, kontakt, godziny, lokalizacja
1-partners       partnerzy i promocje
1-integrations   kalendarze i analityka
2-brand          marka: nazwa, logo, paleta, typografia, głos
2-areas          6 stref treningowych
2-classes        zajęcia, trenerzy, trening personalny
2-services       usługi dodatkowe
3-memberships    5 karnetów i 15 wariantów cenowych
3-single-entry   samodzielne wejście jednorazowe
index.ts         kompozycja i publiczny punkt wejścia rdzenia
```

## `0-core` — model

- Encje katalogu to rekordy **klucz → obiekt**; klucz jest tożsamością, więc
  nie ma pola `id`.
- Referencje między encjami używają typów kluczy (`AreaKey`, `ClassKey`, …)
  wyprowadzanych przez `keyof typeof` — literówka jest błędem kompilacji.
- Relacja jest zapisana dokładnie raz (np. `membership.classes`); stronę
  odwrotną wyprowadza adapter.
- Kolejność kluczy = kolejność w UI; konsumenci iterują przez
  `Object.entries` / `Object.values`.
- Rdzeń nie ma walidacji runtime — poprawność referencji pilnuje TypeScript.
  Zmiana kontraktu wymaga podbicia `model_version` w `0-core/index.ts`.
- `1-web/0-site/3-invariants.ts` dokłada reguły warstwy strony (powiązania
  z plikami, assety, wersje, bramka publikacji).

## `1-web` — strona

Wewnątrz `1-web` obowiązuje ta sama zasada, z numeracją lokalną od 0:

| Katalog | Warstwa | Zawartość |
|---|---|---|
| `0-assets/` | 0 | źródła mediów: zdjęcia, wideo, logo, SEO |
| `0-docs/` | 0 | dokumentacja pisana ręcznie (PLAN, CONTENT-MODEL, DESIGN, screenshots) |
| `0-site/` | 0 | `0-types` … `3-invariants` oraz `4-model.ts` (barrel modelu) |
| `1-data/` | 1 | adapter modelu do widoków |
| `2-ui/` | 2 | ikony, SEO, style, prymitywy UI |
| `3-components/` | 3 | sekcje, cennik, Header/Footer/StickyCta |
| `4-layouts/` | 4 | BaseLayout, LegalPage |
| `5-app/` | 5 | strony Astro (`srcDir`) |
| `6-tools/` | 6 | skrypty: eksport modelu/marki, optymalizacja assetów |
| `7-public/` | 7 | pliki serwowane (`publicDir`), generowane z `0-assets` przez `6-tools` |
| `8-output/` | 8 | `dist/`, `export/`, `docs/BRAND.md`, `tmp/` |

- `5-app/` jest ustawione jako `srcDir`, `7-public/` jako `publicDir`,
  a `8-output/` jako `outDir` w `astro.config.mjs`; nazwy plików
  w `pages/` wyznaczają URL-e, dlatego nie mają prefiksów.
- `6-tools/` konsumuje `0-assets/` i `0-site/4-model.ts`, a produkuje
  `7-public/` oraz zawartość `8-output/`.
- `8-output/` jest w całości generowany i wpisany do `.gitignore`.
- Poza numeracją zostaje tylko **granica narzędzi**: `package.json`,
  `package-lock.json`, `node_modules/`, `astro.config.mjs`, `tsconfig.json`,
  `README.md`, `.gitignore`, `.vscode/` — wymagają ich npm, Astro i edytor
  (analogicznie do `.vscode/` w rootcie repo).

## `1-printables` — druk

Drugi konsument modelu, niezależny od strony. Buduje jednostronicowy **cennik
A4** z tych samych danych co `1-web`: ceny karnetów, wejście jednorazowe,
zakres stref, usługi, zasady, godziny i kontakt.

Wynik trafia do `1-printables/8-output/`:

- `cennik-a4.pdf` — gotowy do druku (fonty i logo w środku pliku),
- `cennik-a4.html` — samodzielny podgląd i wydruk przez przeglądarkę.

```bash
cd 1-printables
npm install
npm run check   # tsc --noEmit
npm run build   # HTML + PDF; PDF wymaga Chrome (albo CHROME_PATH)
```

Automatyczny build: workflow **„Cennik A4”**
([`.github/workflows/cennik.yml`](.github/workflows/cennik.yml)) publikuje
artefakt `cennik-a4` z PDF i HTML. Szczegóły i podział warstw opisuje
[`1-printables/README.md`](1-printables/README.md).

## Komendy

Wszystkie uruchamiane w `1-web/`:

```bash
npm install
npm run dev          # serwer developerski (http://localhost:4321/ParysWeb2/)
npm run check        # astro check — typy całego projektu
npm run build        # build statyczny + reguły spójności modelu
npm run preview      # podgląd builda
npm run model:export # eksport modelu do JSON (8-output/export/model.json)
npm run brand:md     # eksport księgi marki (8-output/docs/BRAND.md)
npm run assets       # optymalizacja obrazów (wymaga Python 3 + Pillow)
```

## Publikacja

- **Repo:** https://github.com/PatrykJaseniuk/ParysWeb2
- **Strona:** https://patrykjaseniuk.github.io/ParysWeb2/ — GitHub Pages,
  wdrożenie przez [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
  przy każdym pushu na `main`.
- Strona jest budowana z `base: "/ParysWeb2"` (`astro.config.mjs`), a linki
  i assety dostają prefiks w adapterze (`withBase` w `1-web/1-data/business.ts`).
- **Domena `parys.nysa.pl` należy do starej strony** (repo `ParysWeb`) i nie
  jest podłączona do tego projektu — nie zmieniaj `cname` w Pages tego repo.

## Wymagania

Node.js 20+ (testowane na 22) i npm. Opcjonalnie Python 3 z Pillow do
`npm run assets`.

## Status

Strona jest budowana, ale `quality.publishable = false` — publikację blokują
m.in. niepotwierdzone ceny i dane rejestrowe. Bramka żyje w
`1-web/0-site/2-quality.ts` i jest sprawdzana przy buildzie.

Artefakty w `1-web/8-output/` (dist, export, tmp) oraz cache `1-web/.astro/` nie są źródłem
prawdy i nie należy ich edytować ręcznie.
