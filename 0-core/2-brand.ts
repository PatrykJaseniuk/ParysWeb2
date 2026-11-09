import type { BrandModel } from "./0-types";
import { company } from "./1-company";

/**
 * Księga marki jako dane — tożsamość, logo, kolor, typografia, głos i obraz.
 *
 * To nie jest opis strony: te reguły obowiązują także w druku, na szyldzie
 * i w social. Strona jest tylko jednym z zastosowań marki — dlatego pliki
 * logo są mapowane dopiero w `site.ts`, a tutaj występują jako nazwy logiczne.
 *
 * Wartości liczbowe (hex, wagi, czasy) są tu jedynym źródłem prawdy.
 * `src/styles/global.css` powtarza tokeny kolorów — zgodność nie jest jeszcze
 * sprawdzana automatem (patrz `quality.ts` → `dq-brand-css`).
 */
export const brand = {
  /* --- nazwa ------------------------------------------------------- */
  name: {
    canonical: company.display_name,
    short: "Parys",
    with_city: "Parys Nysa",
    legacy_do_not_use: company.alternate_names,
    rules: [
      "„Parys” odmieniamy (w Parysie, do Parysa); nazwy pełnej nie odmieniamy (Sport Studio Parys).",
      "„24/7” zawsze z ukośnikiem, bez spacji.",
      "Nazw partnerów nie odmieniamy: „karta MultiSport”, nie „kartą MultiSporta”.",
    ],
  },

  promise: company.tagline,

  pillars: [
    { name: "Konkret", meaning: "Liczby zamiast przymiotników: 1989, 1000 m², 149 zł, 24/7." },
    { name: "Dostępność", meaning: "Czynne 24/7, karnety bez umowy, wejście jednorazowe od 35 zł." },
    { name: "Rzemiosło", meaning: "Sprzęt i strefy opisane rzeczowo, bez marketingowego lakieru." },
    { name: "Ciągłość", meaning: "Ta sama siłownia od 1989 roku, ta sama nazwa, to samo miejsce." },
  ],

  /* --- logo -------------------------------------------------------- */
  logo: {
    variants: [
      {
        id: "mark",
        name: "Sygnet",
        description:
          "Czerwony kwadrat o zaokrąglonych narożnikach z białą figurą: kropka nad dwoma lustrzanymi łukami.",
        ratio: "1,15:1",
        min_width_px: 24,
        use: ["awatar", "favicon", "ikona aplikacji", "nagłówek i stopka strony"],
      },
      {
        id: "full",
        name: "Sygnatura pełna",
        description:
          "Sygnet nad napisem PARYS. Napis ma gruby, zaokrąglony kontur i jasne wypełnienie — obrys jest częścią znaku, nie ozdobą.",
        ratio: "1,38:1",
        min_width_px: 96,
        use: ["wydruk", "social", "szyld"],
      },
      {
        id: "motto",
        name: "Lockup z mottem",
        description: "Sygnatura pozioma z mottem. W eksporcie bez wdrożonego renderu.",
        ratio: "8,77:1",
        min_width_px: null,
        use: [],
      },
    ],
    clear_space: "0,5 × wysokość sygnetu z każdej strony",
    prohibited: [
      "Nie rozciągaj, nie ściskaj i nie obracaj znaku.",
      "Nie zmieniaj czerwieni na inny odcień ani bieli na inny kolor.",
      "Nie usuwaj obrysu napisu i nie zamieniaj go na cień.",
      "Nie dodawaj gradientów, poświat ani cieni.",
      "Nie umieszczaj sygnetu na zdjęciu bez pola ochronnego.",
      "Nie odtwarzaj logo fontem — używaj plików z `public/brand/`.",
    ],
  },

  /* --- kolor ------------------------------------------------------- */
  palette: {
    tokens: {
      ink: { hex: "#0a0a0b", role: "background", contrast_on: null, note: "Tło główne" },
      surface: { hex: "#101012", role: "surface", contrast_on: null },
      surface_alt: { hex: "#17171a", role: "surface_alt", contrast_on: null },
      line: { hex: "#26262b", role: "border", contrast_on: null },
      text: { hex: "#f2f1ed", role: "text", contrast_on: "ink", note: "Kontrast 17,5:1" },
      text_muted: { hex: "#9d9da5", role: "text_muted", contrast_on: "ink", note: "Kontrast 7,4:1" },
      paper: { hex: "#f2f1ed", role: "background", contrast_on: null, note: "Sekcja cennika" },
      brand: { hex: "#e31e24", role: "accent", contrast_on: "ink", note: "4,2:1 — tylko duży tekst i wypełnienia" },
      brand_hover: { hex: "#b01218", role: "accent_hover", contrast_on: null },
      brand_text_dark: {
        hex: "#f2404a",
        role: "accent_text_dark",
        contrast_on: "ink",
        note: "Mały tekst na ciemnym — 6,1:1",
      },
      brand_text_paper: {
        hex: "#c8151b",
        role: "accent_text_paper",
        contrast_on: "paper",
        note: "Mały tekst na papierze — 5,2:1",
      },
      on_accent: { hex: "#ffffff", role: "on_accent", contrast_on: "brand" },
    },
    proportions: { base: 60, neutral: 30, accent: 10 },
    rules: [
      "Czerwień #e31e24 na ciemnym tle ma 4,2:1 — tylko duży tekst (≥18 px bold) i wypełnienia.",
      "Małe etykiety (10–12 px): brand_text_dark na ciemnym, brand_text_paper na papierze.",
      "Czerwień nigdy nie jest tłem dużej sekcji — jedyne duże czerwone pole to kwadrat w logo.",
    ],
  },

  /* --- typografia -------------------------------------------------- */
  typography: {
    display: {
      family: "Archivo Variable",
      source: "@fontsource-variable/archivo",
      weights: [700, 800],
      transform: "uppercase",
      letter_spacing: "-0.035em",
      line_height: 0.88,
      usage: "Nagłówki i liczby. Wersaliki, ciasny tracking, interlinia 0,88.",
    },
    body: {
      family: "Inter Variable",
      source: "@fontsource-variable/inter",
      weights: [400, 500, 600],
      transform: "none",
      line_height: 1.7,
      usage: "Tekst ciągły. Bez transformacji, interlinia 1,7.",
    },
    mono: {
      family: "ui-monospace",
      source: "system",
      weights: [400, 600],
      transform: "uppercase",
      letter_spacing: "0.2em",
      line_height: 1.4,
      usage: "Etykiety techniczne, metadane, liczby w cenniku. Wersaliki, tracking 0,2 em.",
    },
  },

  /* --- głos -------------------------------------------------------- */
  voice: {
    style: "Konkret, liczby, krótkie zdania. Bez superlatywów i wykrzykników.",
    person: "Druga osoba liczby pojedynczej lub bezpośrednie zwroty („trenujesz”, „sprawdź”).",
    vocabulary: [
      { term: "karnet", meaning: "produkt na okres lub liczbę wejść" },
      { term: "wejście", meaning: "pojedyncza wizyta" },
      { term: "wariant", meaning: "konkretna cena w ramach karnetu" },
      { term: "strefa", meaning: "wydzielona część klubu, np. strefa cross" },
      { term: "zajęcia", meaning: "trening grupowy z harmonogramem" },
      { term: "trening personalny", meaning: "sesja jeden na jeden" },
    ],
    avoid: [
      "„najlepsza siłownia w regionie”",
      "„profesjonalizm na najwyższym poziomie”",
      "wyrazy zakończone na -ość bez treści",
      "już dziś",
      "tylko teraz",
      "nie przegap",
    ],
    formats: [
      { label: "cena", example: "1 390 zł — bez groszy, z niełamliwą spacją" },
      { label: "powierzchnia", example: "1000 m²" },
      { label: "dostępność", example: "24/7 — zawsze z ukośnikiem" },
      { label: "godziny", example: "08:00–22:00" },
      { label: "data", example: "1 października 2024" },
    ],
    example_good: "Karnet miesięczny 149 zł. Bez umowy lojalnościowej.",
    example_bad: "Zapraszamy do skorzystania z naszej bogatej oferty w konkurencyjnych cenach!",
  },

  /* --- obraz ------------------------------------------------------- */
  imagery: {
    treatment: "Zdjęcia stref w skali szarości 55% i kolor dopiero na hover.",
    do: [
      "naturalne światło",
      "kadry poziome 16:10",
      "ludzie w ruchu, bez patrzenia w obiektyw",
    ],
    dont: [
      "stockowe uśmiechy",
      "wodotryski HDR",
      "zdjęcia z banków obrazów",
      "emoji w grafice",
    ],
  },

  /* --- ruch -------------------------------------------------------- */
  motion: {
    level: "minimal",
    durations_ms: { fast: 200, base: 400 },
    rules: [
      "Wyłącznie transform i opacity — bez animowania układu.",
      "Animacja nie opóźnia treści i nie blokuje przewijania.",
      "respektujemy prefers-reduced-motion.",
    ],
  },

  /* --- czego nie robimy -------------------------------------------- */
  prohibited: [
    "emoji w UI",
    "automatyczne karuzele",
    "pełnoekranowe wideo w tle",
    "odliczania i sztuczna pilność",
    "cienie materialowe",
    "zaokrąglenia powyżej 4 px",
    "Karuzel z automatycznym przewijaniem.",
    "Gradientów jako wypełnienia sekcji.",
  ],
} satisfies BrandModel;
