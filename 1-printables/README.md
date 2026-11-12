# `1-printables` — materiały drukowane

Konsument modelu `0-core`, niezależny od strony (`1-web`). Generuje dwie
wersje cennika:

- `8-output/cennik-a4.pdf` — ulotka A4 pion, dwie strony (fonty w PDF),
- `8-output/cennik-sciana-a4.pdf` — plakat A4 poziom, dwie strony do gabloty,
- `8-output/cennik-a4.html` i `8-output/cennik-sciana-a4.html` — samodzielne
  pliki do podglądu i wydruku przez przeglądarkę (fonty, logo i style są
  w środku, bez sieci i bez zewnętrznych plików).

Ceny, zakresy, usługi, godziny i dane kontaktowe pochodzą wyłącznie z `0-core`.
Wydruk nie ma własnej kopii cennika: zmiana w modelu trafia na papier po
ponownym `npm run build`.

## Struktura

Numer w nazwie katalogu to warstwa — **większy numer zależy od mniejszego**,
a `0` nie importuje niczego z tej paczki poza własnym typem.

| Katalog | Warstwa | Zawartość |
|---|---|---|
| `0-assets/` | 0 | źródła mediów druku (`icon-mark.svg`, kopia znaku z `1-web`) |
| `0-print/` | 0 | kontrakt dokumentu (`0-types`) i formatowanie (`1-format`) |
| `1-data/` | 1 | adapter `0-core` → dokument, reguły spójności |
| `2-render/` | 2 | HTML, style A4 i składanie obu wersji cennika |
| `3-tools/` | 3 | build: fonty, logo, PDF przez Chrome |
| `8-output/` | 8 | artefakty generowane w całości (`.gitignore`) |

Przepływ:

```text
0-core/  ─┐
           ├─→ 1-data/price-list.ts ─→ dokument ─→ 2-render/price-list.ts ─→ HTML/PDF (ulotka)
0-print/ ─┘                                 └─→ 2-render/wall.ts ────────→ HTML/PDF (plakat)
```

- `0-print/0-types.ts` nie zna modelu biznesowego — opisuje gotowy dokument
  („35 zł”, „ważne 7 dni”, numer kolumny). Dzięki temu renderer nie liczy cen
  ani nie odmienia rzeczowników.
- `1-data/price-list.ts` jest jedynym miejscem, które czyta `0-core`.
  Kolejność wariantów w tabeli to decyzja prezentacyjna; warianty spoza
  znanych kodów trafiają na koniec, więc nowy produkt w modelu nie zniknie
  z wydruku. `HIDDEN_PERKS` wyłącza z wydruku wybrane dodatki (np. „Dwa
  miesiące gratis”) — model i strona pozostają bez zmian.
- `1-data/invariants.ts` zatrzymuje build, gdy tabela jest pusta, karnet nie ma
  żadnej ceny albo przypis dodatku nie istnieje.
- `2-render/` nie dotyka dysku: dostaje dokument i zasoby (fonty, logo).
- `3-tools/build.ts` wbudowuje fonty i logo w HTML jako base64, więc wynik jest
  samowystarczalny. PDF powstaje przez Chrome w trybie headless.

## Komendy

W `1-printables/`:

```bash
npm install
npm run check        # tsc --noEmit
npm run build        # HTML + PDF w 8-output/
npm run clean        # usuwa 8-output/
```

`npm run build` wypisuje liczbę karnetów, wariantów i usług oraz ścieżki
artefaktów. Gdy Chrome nie jest dostępny, build kończy się poprawnie i zostawia
HTML — PDF można wtedy zrobić przez „Drukuj” w przeglądarce. Gdy Chrome jest,
ale nie wygeneruje PDF, build kończy się kodem błędu.

Wykrywanie przeglądarki: `CHROME_PATH`, potem `google-chrome-stable`,
`google-chrome`, `chromium`, `chromium-browser` i standardowa ścieżka macOS.
Ustaw np.:

```bash
CHROME_PATH=/usr/bin/google-chrome npm run build
```

## GitHub Actions

Cennik buduje workflow [`.github/workflows/cennik.yml`](../.github/workflows/cennik.yml)
przy pushu na `main` i w pull requestach, gdy zmienia się `0-core/`,
`1-printables/` albo sam workflow. Można go też uruchomić ręcznie
(`workflow_dispatch`).

Workflow robi `npm ci`, `npm run check` i `npm run build`, a następnie:

- publikuje artefakt **`cennik`** z plikami PDF i HTML obu wersji (30 dni) —
  do pobrania z zakładki **Actions → wybrane uruchomienie → Artifacts**,
- aktualizuje publiczny **GitHub Release `cennik`** ze stałymi linkami:

  - `https://github.com/PatrykJaseniuk/ParysWeb2/releases/download/cennik/cennik-a4.pdf`
  - `https://github.com/PatrykJaseniuk/ParysWeb2/releases/download/cennik/cennik-a4.html`
  - `https://github.com/PatrykJaseniuk/ParysWeb2/releases/download/cennik/cennik-sciana-a4.pdf`
  - `https://github.com/PatrykJaseniuk/ParysWeb2/releases/download/cennik/cennik-sciana-a4.html`

Release powstaje tylko dla buildów z `main`; tag `cennik` wskazuje na commit
ostatniego builda. Build w CI wymaga Chrome — na `ubuntu-latest` jest
zainstalowany domyślnie.

## Wydruk

### Ulotka A4 — `cennik-a4.pdf`

- Format: **A4 pion, dwie strony**, marginesy 9/12/7 mm wpisane w arkusz
  (`@page { size: A4 portrait; margin: 0 }`).
- Strona 1: cennik i zakres jeden pod drugim; strona 2: usługi, zasady,
  karty sportowe i skrót dostępu.
- Typografia: ceny 18 pt, warianty 11 pt, zakres i treść 9,5–10 pt, stopka
  8 pt. Żaden tekst informacyjny nie schodzi poniżej 8 pt.
- Druk dwustronny: **duplex, flip on long edge**; wydruk w skali 100%
  (bez „fit to page”).

### Plakat ścienny A4 — `cennik-sciana-a4.pdf`

- Format: **A4 poziomo, dwie strony** (`@page { size: A4 landscape; margin: 0 }`).
- Jedna tabela ze wspólną kolumną „Karnet”. Po lewej grupa „Warianty”
  (6 kolumn cen, w tym „1 wejście”), po prawej grupa „Zakres”
  (7 kolumn stref); wiersze są
  współdzielone, bez powtarzania nazw karnetów. Warianty mają
  dodatkową kolumnę „1 wejście”, a pod karnetami jest wiersz „Karnet
  jednorazowy” z ceną 35 zł i zakresem wszystkich stref.
- Nagłówki stref są pełne, obrócone o 90° i zawijane w kolumnach 15 mm.
  Dzięki zawijaniu mieszczą się w nagłówku o wysokości 24 mm. W komórkach są
  same liczby, a nad tabelą dopisek „ceny w zł · ✓ w cenie”.
- Typografia: ceny 25 pt, nazwy karnetów 10,5 pt, nagłówki stref 7 pt,
  nagłówek 40 pt. Wersja przeznaczona do czytania z kilku metrów.
- Strona 1: cennik i zakres w jednej tabeli. Strona 2: usługi dodatkowe,
  dostęp i karta klubowa, zasady, karty sportowe, „Jak zacząć”, karnety ulgowe
  i kontakt.
- Do gabloty: druk 100%, papier matowy, rama bez odblasków; nie zmniejszać
  do A5.
- Papier: `#f2f1ed`, tekst: `#0a0a0b`, akcent: `#e31e24` / `#c8151b` — kolory
  i fonty pochodzą z `business.brand`, nie z kopii w CSS.
- Cennik jest jedyną jasną sekcją marki („wydruk na ścianie recepcji”).
- Reguły marki: wersaliki w nagłówkach, ceny tabelaryczne, czerwień tylko jako
  akcent, brak cieni i gradientów.
- Znak w nagłówku to kopia `logos/svg/IconParysLogoMini.svg` z `1-web/0-assets`
  — warstwy są niezależne, więc materiał drukowany ma własne źródło assetu.

## Zasady

- `8-output/` jest generowany w całości — nie edytuj go ręcznie.
- Treści, komentarze i nazwy domenowe po polsku; klucze kebab-case, pola
  `snake_case`; kwoty w PLN bez powtarzania waluty przy cenie.
- Przy nowym materiale drukowanym: dodaj moduł w `1-data/` i renderer
  w `2-render/`, a wspólne formatowanie trzymaj w `0-print/`.
- Po zmianie modelu lub kodu: `npm run check && npm run build`, a w `1-web/`
  `npm run check && npm run build`.
- Build sprawdza przez `pdfinfo` (jeśli jest dostępne), że ulotka ma dwie
  strony A4 pion, a plakat — dwie strony A4 poziom.
