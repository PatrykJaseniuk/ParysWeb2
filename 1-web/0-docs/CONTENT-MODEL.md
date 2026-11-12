# Model — trzy moduły TS, jak zależą i jak je edytować

> **Aktualizacja (2026-11-12):** dane katalogu (firma, cennik, strefy,
> zajęcia, trenerzy, usługi, partnerzy, dodatki, wejście jednorazowe) są
> edytowane w Pages CMS jako `0-content/*.json` i generowane do `0-core/`
> przez `tools/cms/generate.mjs`. Dokument poniżej opisuje układ sprzed CMS-a.
>
> **Uwaga historyczna (2026-11-06):** ten dokument opisuje układ sprzed
> przeniesienia rdzenia do `0-core/` i numeracji warstw w `1-web/`.
> Aktualny układ katalogów i ścieżki opisują [`../../README.md`](../../README.md)
> i [`../../AGENTS.md`](../../AGENTS.md). Poniższe zasady pojęciowe pozostają
> aktualne, ale nazwy plików (`business/`, `site/`) są nieaktualne.

Model to **kontrakt danych** dla generatorów treści, zapisany jako obiekty TypeScript.
Rdzeń (`business/`) nie zależy od niczego i nie zna żadnego pliku graficznego —
strona (`site/`) jest tylko jednym z jego zastosowań. Nie ma plików JSON w roli
źródła prawdy.

```
business/                 rdzeń — treść i marka, zero zależności
├── index.ts              kompozycja + `model_version`
├── types.ts              typy rdzenia
├── invariants.ts         reguły rdzenia (referencje, ceny, kompletność)
├── meta.ts               wersja, waluta, strefa czasowa, cennik
├── company.ts            tożsamość, kontakt, godziny, lokalizacja
├── brand.ts              nazwa, logo, paleta, typografia, głos, obraz
├── areas.ts              6 stref
├── memberships.ts        5 karnetów i 15 wariantów cenowych
├── single-entry.ts       samodzielne wejście jednorazowe
├── classes.ts            zajęcia, trenerzy, trening personalny
├── services.ts           usługi dodatkowe
├── partners.ts           partnerzy i promocje
├── integrations.ts       kalendarze i analityka
└── perks.ts              słownik dodatków

site/                     jedno z zastosowań rdzenia — strona
├── index.ts              design strony, media, powiązania, definicje stron
├── types.ts              typy strony i gotowości
├── quality.ts            gotowość do publikacji, pytania, defekty
└── invariants.ts         reguły rdzeń ↔ strona

model.ts                  barrel: `business`, `site`, `quality` + typy
src/                      aplikacja Astro (adapter, komponenty, strony)
```

```bash
npm run dev          # edycja z autouzupełnianiem
npm run model:check  # typy (astro check)
npm run build        # build + reguły spójności
npm run model:export # JSON dla konsumentów spoza TS → export/model.json
```

---

## 1. Dlaczego TypeScript, a nie JSON

| | JSON + schemat | obiekty TS |
| --- | --- | --- |
| Podpowiedzi przy edycji | ❌ | ✅ `business.` + Ctrl+Spacja |
| Literówka w polu | walidator przy buildzie | błąd w edytorze |
| Komentarze przy polach | ❌ | ✅ |
| Kontrakt kształtu | 2559 linii JSON Schema | 485 linii interfejsów |
| Neutralność formatu | ✅ | ❌ — stąd `model:export` |

Kompromis jest świadomy: model jest częścią projektu TS, a gdy trzeba go oddać
na zewnątrz, `npm run model:export` generuje `export/model.json` (artefakt, nie źródło).

---

## 2. Warstwy i zależności

| Plik | Odpowiada na pytanie | Zawiera | **Nie zawiera** |
| --- | --- | --- | --- |
| `business/` | *Kim jesteśmy, co oferujemy i za ile?* | tożsamość, marka (nazwa, logo, paleta, typografia, głos), kontakt, godziny, cennik, strefy, zajęcia, trenerzy, usługi, partnerzy, kalendarze | ścieżek do plików, nazw stron, układu strony |
| `site/index.ts` | *Co zbudować i jak to wygląda?* | design tokens, katalog mediów, powiązania encja → plik, nawigacja, CTA, SEO, definicje stron | cen, adresów, godzin |
| `site/quality.ts` | *Czego nie wiemy i czy wolno publikować?* | blokery, pytania, defekty, założenia, provenance | treści do wyrenderowania |

```
business/  ──┬──▶  site.ts  ──▶  quality.ts
               │        │                │
               └────────┴────────────────┘
                  (quality czyta oba)
```

- `business/` **nie zależy od niczego** — można go oddać do CRM-a, systemu rezerwacji
  albo generatora oferty PDF bez zabierania jednego pliku graficznego.
- `site/index.ts` zależy od `business/` (po `content_refs`, po kluczach `media.bindings`
  i po numerze wersji). Marka jest częścią `business/`, więc nie ma osobnej wersji
  ani osobnej zależności.
- `site/quality.ts` zależy od obu, ale **nikt z modelu go nie czyta** — konsumuje go
  walidacja, generator i pipeline publikacji.

**Wersje.** `site/index.ts` i `site/quality.ts` nie mają wpisanych numerów wersji — biorą je
z modułów, od których zależą:

```ts
// site/index.ts
export const site = {
  requires: { business: business.model_version },  // jedna wartość, zero duplikacji
  // …
} satisfies SiteModel;
```

Rozjazd wersji jest niemożliwy konstrukcyjnie; `invariants.ts` sprawdza to
dodatkowo, gdyby ktoś wpisał numer ręcznie.

---

## 3. Konwencje

| Obszar | Reguła |
| --- | --- |
| Klucze | `snake_case`, bez cudzysłowów — cudzysłów tylko gdy klucz nie jest identyfikatorem TS (np. `"area-cross"`) |
| `id` | stabilne, kebab-case, unikalne w całym modelu (`area-cross`, `mem-4-areas`, `svc-sauna`) |
| `slug` | osobne pole, tylko do URL — może się zmienić bez ruszania `id` |
| Referencje | wyłącznie po `id` |
| Pieniądze | `{ amount, unit, type? }` — waluta w `meta.currency`, VAT w `pricing_policy.includes_vat` |
| `price.unit` | `entry`, `term`, `hour`, `item` — **nie** `month`/`year` |
| Czas | `{ value, unit }` |
| Wejścia | liczba w `entries` (`entries: 10`); brak pola = bez limitu |
| Godziny | tablica reguł z dniami `mon…sun`, `closed` lub `open`/`close` |
| Statusy | **nie w `business/`** — brak potwierdzenia zapisuje `site/quality.ts` (pytania, `unknowns`, defekty) |
| Wartości wyprowadzalne | nie zapisywane: `order`, `id` wariantu, waluta, VAT, strona odwrotna relacji — liczy adapter |

---

## 4. `business/` — fakty i marka

Dziewięć modułów tematycznych. Każdy daje się objąć jednym spojrzeniem, bez scrollowania.

```
business/
├── index.ts          kompozycja + `model_version`
├── meta.ts           wersja, waluta, strefa czasowa, zasady cennika
├── company.ts        tożsamość, kontakt, godziny, lokalizacja
├── areas.ts          6 stref
├── memberships.ts    5 karnetów i 15 wariantów cenowych
├── single-entry.ts   samodzielne wejście jednorazowe
├── classes.ts        zajęcia, trenerzy, trening personalny
├── services.ts       usługi dodatkowe
├── partners.ts       partnerzy i promocje
├── integrations.ts   kalendarze i analityka
└── perks.ts          słownik dodatków
```

### Wariant cenowy — pięć pól, nie dziewięć

```ts
{
  code: "yearly",                            // klucz macierzy cennika
  label: "Roczny",
  price: { amount: 1490, unit: "term" },     // waluta z meta, VAT z pricing_policy
  term: { value: 12, unit: "month" },
  perks: ["two-months-free"],                // etykieta w catalog.perks
}
```

Czego w wariancie **nie ma** i dlaczego:

| Pole | Gdzie teraz | Dlaczego |
| --- | --- | --- |
| `id` | wyprowadzane `opt-<karnet>-<code>` | nigdzie nieużywane |
| `order` | kolejność listy | zawsze była pozycja × 10 |
| `price.currency` | `meta.currency` | jedna waluta dla całego modelu |
| `price.includes_vat` | `pricing_policy.includes_vat` | jedna odpowiedź na cały cennik |
| `price.type` | obecne tylko przy `"from"` | domyślnie cena dokładna |
| `access.mode` | `hours.facility.mode` | dostęp 24/7 to fakt o klubie, nie o wariancie |
| `entries.unlimited` | brak pola `entries` | brak wartości = bez limitu |

### Relacja zapisana dokładnie raz

| Relacja | Miejsce prawdy | Strona wyprowadzana |
| --- | --- | --- |
| zajęcia ↔ karnet | `membership.classes` | `class.included_in` |
| program partnerski ↔ wejście jednorazowe | `catalog.partners` + `entry_policy` | wspólny dla wszystkich programów |

Strony wyprowadzane liczy adapter (`src/data/business.ts`), więc nie istnieją dwie
listy, które mogą się rozjechać.

### Reguły wspólne (`pricing_policy` i `entry_policy`)

Brak umowy, zasada braku blokowania i **status VAT** są zapisane w
`pricing_policy`. Wejście jednorazowe bez rejestracji, karnet z rejestracją
i kartą klubową 24/7 oraz zakres programów partnerskich są zapisane raz
w `entry_policy`.

### Marka (`brand.ts`)

Księga marki jako dane. Reguły obowiązują **poza stroną** — w druku, na szyldzie,
w social — ale są faktami o firmie, więc mieszkają w `business/`, a nie obok niego.

```ts
export const brand = {
  name: { canonical: company.display_name, short: "Parys", with_city: "Parys Nysa", … },
  promise: company.tagline,
  logo: { variants: [/* mark, full, motto */], clear_space: "…", prohibited: [...] },
  palette: { tokens: {/* 12 tokenów */}, proportions: { base: 60, neutral: 30, accent: 10 }, rules: [...] },
  typography: { display, body, mono },
  voice: { style, person, vocabulary, avoid, formats, example_good, example_bad },
  imagery: { treatment, do, dont },
  motion: { level, durations_ms, rules },
  prohibited: [...],
} satisfies BrandModel;
```

- **Nazwa i obietnica nie są przepisane.** `canonical` bierze się z
  `company.display_name`, `promise` z `company.tagline`, a lista form zakazanych
  z `company.alternate_names`. `invariants.ts` pilnuje, żeby nie mogły się rozjechać.
- **Zero referencji do plików.** Warianty logo to nazwy logiczne (`mark`, `full`,
  `motto`), a mapowanie na `media.assets` siedzi w `site.design.logo`. Dlatego marka
  może mieszkać w `business/` bez łamania zasady „biznes nie dotyka plików".
- **`site.design` trzyma tylko to, co dotyczy tej strony:** kierunek, skalę, siatkę,
  promienie i mapowanie wariantów logo na pliki.
- **`8-output/docs/BRAND.md` jest generowany** z tego modułu (`npm run brand:md`). Nie edytuj
  go ręcznie — to rendering, nie źródło.
- Znany defekt: paleta jest powtórzona w `src/styles/global.css` i nic nie pilnuje
  zgodności (zapisane jako `dq-brand-css` w `site/quality.ts`).

---

## 5. `site/` — budowa strony

### 5.1 `media` — katalog plików i powiązania

To **jedyne miejsce w modelu**, które łączy encję biznesową z plikiem.

```ts
export const site = {
  requires: { business: business.model_version },
  media: {
    assets: {
      "asset-photo-zone-cross": {
        kind: "image",
        source: "photos/zones/cross.png",
        served: "/img/strefy/sala-cross-711.webp",
        width: 711,
        height: 400,
        alt: "Sala cross z kratownicą i sprzętem do crossfitu",
        roles: ["zone-photo"],
        variants: [
          { width: 500, path: "/img/strefy/sala-cross-500.webp", format: "webp" },
          { width: 711, path: "/img/strefy/sala-cross-711.webp", format: "webp" },
        ],
        // …
      },
    },
    bindings: {
      "area-cross": { photo: "asset-photo-zone-cross", video: "asset-video-zone-cross" },
    },
    hero: "asset-hero",
    fallbacks: { area: "placeholder", class: "duotone-reuse", trainer: "monogram", partner: "wordmark" },
  },
  // design, site…
} satisfies SiteModel;
```

- Klucz w `bindings` to `id` encji z `business/` — `invariants.ts` sprawdza, że istnieje.
- `alt` jest wymagany dla obrazów i logotypów (wyjątek: favicon).
- **Brak wpisu w `bindings` = brak pliku.** Wtedy działa `fallbacks`.
- Ten sam plik może obsługiwać wiele encji (`asset-photo-zone-cross` obsługuje salę
  cross i Cross) bez duplikowania `alt` ani wariantów.

### 5.2 `design`

Tokeny kolorów z rolami, typografia, skala, spacing, kierunek zdjęć, logo, ruch i ton
głosu. Traktuj jak wytyczne, nie jak gotowy CSS.

### 5.3 `site` — architektura informacji

```ts
{
  id: "pricing",
  path: "/karnety",
  title: "Karnety i cennik",
  intent: "Zamknąć pytanie o cenę bez kontaktu z recepcją.",
  noindex: false,
  source: null,
  sections: [
    { id: "sec-matrix", type: "pricing_matrix", required: true,
      content_refs: ["catalog.memberships", "pricing_policy"] },
  ],
}
```

`source: "catalog.areas"` oznacza stronę generowaną z kolekcji — `path` zawiera wtedy
`{slug}`, a `title` placeholdery `{name}` / `{short}`.

---

## 6. `site/quality.ts` — gotowość do publikacji

Nic z tego pliku nie trafia na stronę.

| Pole | Rola | Przykład |
| --- | --- | --- |
| `publishable` | decyzja człowieka: czy wolno wdrożyć | `false` |
| `questions[]` | brakujące informacje | „Czy ceny są aktualne?” |
| `issues[]` | znane defekty | „PZU bez logo” |
| `unknowns[]` | wartości przyjęte roboczo | kod pocztowy `48-300` |
| `provenance` | skąd dane, z czego powstał model | commit `8a14e21` |

**Trzy typy wpisów różnią się tym, co masz:**

| Typ | Masz? | Kto odpowiada |
| --- | --- | --- |
| `question` | nic — brak informacji | właściciel / prawnik / fotograf |
| `unknown` | wartość, ale niepotwierdzoną | właściciel |
| `issue` | wartość, ale problematyczną | właściciel |

`affects` mówi, które pola zaktualizować po odpowiedzi.

**Bramka.** `publishable` nie jest wyliczane automatycznie: usunięcie ostatniego blokera
nie powinno samo odpalić publikacji. `invariants.ts` pilnuje tylko, żeby flaga nie
została ustawiona przedwcześnie:

```
[model] pytania: 11 (blokujących: 3) · publikowalne: false · blokują: q-prices, q-legal-data, q-legal-docs
```

---

## 7. Walidacja — dwa poziomy

**Poziom 1: typy.** `satisfies BusinessModel` w plikach danych. Zła nazwa pola, brak
pola, zły typ wartości → błąd w edytorze i w `astro check`. Zero kosztu w runtime.

**Poziom 2: reguły.** Dwa moduły, bo mają różnych konsumentów:

| Moduł | Co sprawdza | Kto go woła |
| --- | --- | --- |
| `business/invariants.ts` | referencje w rdzeniu, ceny, kompletność katalogu, spójność marki z tożsamością | każdy konsument rdzenia — także generator cennika czy grafik |
| `site/invariants.ts` | `media.bindings`, istnienie assetów, `alt`, wersje, ścieżki stron i jakości, bramkę publikacji | adapter strony, przy każdym buildzie |

| Sprawdzenie | Moduł | Typ |
| --- | --- | --- |
| karnet wskazuje nieistniejącą strefę / zajęcia | rdzeń | błąd |
| cena niedodatnia lub niecałkowita | rdzeń | błąd |
| nazwa w `brand` rozjechana z `identity.display_name` | rdzeń | błąd |
| `bindings` wskazuje nieistniejącą encję lub asset | strona | błąd |
| brak `alt` w obrazie lub logotypie | strona | błąd |
| niezgodność `requires` z wersją modułu | strona | błąd |
| `publishable: true` przy otwartych blokerach | strona | błąd |
| strefa lub zajęcia bez zdjęcia | strona | ostrzeżenie |
| asset nigdzie nie użyty | strona | ostrzeżenie |

`assertModelIntegrity()` z `site/invariants.ts` woła najpierw reguły rdzenia, potem
dokłada własne. Jest wywoływany przy imporcie adaptera, więc `astro build` **pada**
na niespójnym modelu:

```
Model nie spełnia kontraktu (1 błędów):
  • media.bindings: nieznana encja "area-cros"
```

---

## 8. Jak edytować

### Zmiana ceny
`business/memberships.ts` → `catalog.memberships[].options[].price.amount`.
Edytor podpowiada pole; literówka to błąd kompilacji.

### Dodanie strefy
1. Encja w `business/areas.ts` → `catalog.areas`.
2. Plik w `site/index.ts` → `media.assets` (+ `alt`).
3. Powiązanie w `site/index.ts` → `media.bindings["area-…"] = { photo: "asset-…" }`.
4. `npm run build` — reguły sprawdzą referencje.

Strona `/strefy/{slug}` utworzy się automatycznie (kolekcja `catalog.areas`).

### Podmiana zdjęcia na inne
Tylko `site/index.ts` → `media.bindings`. `business/` nietknięty.

### Podmiana pliku (ta sama rola)
Tylko `site/index.ts` → `media.assets[id].served` / `variants`.

### Odblokowanie publikacji
1. Uzupełnij dane, ustaw `blocks_publish: false` przy odpowiednich pytaniach.
2. `pricing_policy.prices_confirmed_by_owner: true`, `meta.source.verified_by_owner: true`.
3. `quality.publishable: true` (decyzja człowieka).
4. `npm run build` — reguły potwierdzą spójność.

---

## 9. Co się zmieniło

| wcześniej | teraz | Dlaczego |
| --- | --- | --- |
| `price_pln` + `price_text` | `price { amount, currency, unit, type }` | cena jako liczba |
| `validity: "1 miesiąc"` | `term { value, unit }` | sortowanie i porównywanie |
| `entries: null` | `{ unlimited }` / `{ count }` | `null` znaczyło dwie rzeczy |
| `features` z duplikatami | `perks` bez duplikatów | „ważny miesiąc” wynika z `term` |
| `enrollment_fee_pln` × 4 | `entry_policy.club_card_fee` | karta klubowa do karnetów, jedno źródło prawdy |
| referencje do plików w encjach | `site.media.bindings` | rdzeń biznesu bez zależności od mediów |
| jeden plik, wszystkie warstwy | trzy moduły | osobne cykle zmian i właściciele |
| JSON + JSON Schema | obiekty TS + `satisfies` + `invariants.ts` | podpowiedzi i kompilacja zamiast walidatora |

Archiwum poprzedniego eksportu: `data/archive/` (nieużywane przez kod).

---

## 10. Instrukcja dla generatora strony

1. `npm run model:check` — sprawdź typy.
2. Czytaj w kolejności: `site/quality.ts` (czy wolno publikować) → `business/` (fakty)
   → `site/index.ts` (co i jak budować).
3. Buduj strony z `site.pages`; kolejność i typy sekcji są w `sections`.
4. Dane do sekcji bierz z `content_refs`.
5. Media wyłącznie z `site.media.bindings`; brak wpisu → `fallbacks`.
6. Nie wymyślaj treści, gdy `description.status` to `missing` lub `unknown`.
7. `design` traktuj jako wytyczne, nie jako gotowy CSS.
8. Jeśli `publishable` jest `false` — zbuduj podgląd i oznacz go jako wersję roboczą.

Generator spoza TypeScriptu może użyć `npm run model:export` → `export/model.json`.
