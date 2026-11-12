/**
 * Kontrakt dokumentu drukowanego.
 *
 * To warstwa 0 druku: opisuje gotowy do złożenia dokument, a nie model
 * biznesowy. Wszystkie teksty są już sformatowane po polsku („1 490 zł”,
 * „ważne 2 tygodnie”), więc renderer nie zna ani waluty, ani odmiany.
 *
 * Dzięki temu ten sam dokument może dostać inne opakowanie (HTML/PDF,
 * SVG do druku wielkoformatowego), bez powielania logiki cen.
 */

export interface PrintTheme {
  /** Tło papieru i kolor tekstu — jasna wersja marki. */
  paper: string;
  ink: string;
  brand: string;
  /** Czerwień dla małego tekstu na papierze (kontrast AA). */
  brand_text: string;
  /** Tekst na wypełnieniu marki (biały — kontrast AA). */
  on_brand: string;
  display_family: string;
  body_family: string;
  mono_family: string;
}

export interface PrintSource {
  model_version: string;
  /** ISO 8601 z modelu — nie jest datą ważności cennika. */
  generated_at: string;
  generator: string;
}

export interface PrintSingleEntry {
  name: string;
  description: string;
  /** Cena gotowa do druku, np. „35 zł”. */
  price: string;
  unit: string;
  /** „ważne 7 dni”. */
  validity: string;
  facts: string[];
}

export interface PrintColumn {
  /** Klucz karnetu z `0-core` — koreluje tabelę cen i tabelę zakresu. */
  key: string;
  /** Numer porządkowy kolumny, np. „01”. */
  index: string;
  name: string;
  subtitle: string;
  featured: boolean;
}

export interface PrintPriceCell {
  price: string;
  /** Sama liczba, bez waluty — do gęstych tabel ściennych. */
  price_value: string;
  /** Numery odnośników do `PrintPassTable.perk_notes`. */
  perk_numbers: number[];
}

export interface PrintPriceRow {
  code: string;
  label: string;
  cells: (PrintPriceCell | null)[];
}

export interface PrintPerkNote {
  number: number;
  label: string;
}

export interface PrintPassTable {
  caption: string;
  summary: string;
  columns: PrintColumn[];
  rows: PrintPriceRow[];
  perk_notes: PrintPerkNote[];
}

export interface PrintScopeRow {
  key: string;
  name: string;
  /** Linie pionowego nagłówka plakatu, od lewej do prawej. */
  wall_lines: string[];
  /** Wyrównane z kolumnami tabeli cen. */
  cells: boolean[];
}

/**
 * Zakres jest kontynuacją tabeli cen: dziedziczy jej kolumny i nie ma
 * własnego nagłówka. `label` i `note` tworzą wiersz wprowadzający.
 */
export interface PrintScopeTable {
  label: string;
  note: string;
  rows: PrintScopeRow[];
}

export interface PrintService {
  key: string;
  name: string;
  description: string;
  price: string | null;
  price_note: string | null;
  details: string[];
}

export interface PrintPartner {
  name: string;
  /** Warunki wejścia wynikające z `catalog.partners`. */
  badge: string;
}

export interface PrintContact {
  address: string;
  phone: string;
  email: string;
  website: string;
  website_label: string;
}

export interface PrintHours {
  reception: string[];
  note: string;
}

export interface PrintLegal {
  operator: string;
  nip: string | null;
  regon: string | null;
}

export interface PrintPriceList {
  title: string;
  kicker: string;
  /** Krótka nazwa marki do nagłówka („Parys”). */
  brand_short: string;
  /** Podpis pod znakiem, zgodny z logo („siłownia / cross”). */
  brand_sub: string;
  intro: string;
  theme: PrintTheme;
  single_entry: PrintSingleEntry;
  passes: PrintPassTable;
  scope: PrintScopeTable;
  services: PrintService[];
  policy_notes: string[];
  /** Krótkie kroki zakupu karnetu — rewers plakatu ściennego. */
  how_to_start: string[];
  club_card_note: string;
  /** Opłata za kartę klubową gotowa do druku, np. „20 zł”. */
  club_card_fee: string;
  /** „24/7” albo „w godzinach pracy recepcji”. */
  access_window: string;
  /** Zdanie o okresie obowiązywania cennika, np. „Cennik obowiązuje od…”. */
  validity_note: string;
  partners: PrintPartner[];
  partners_note: string;
  contact: PrintContact;
  hours: PrintHours;
  legal: PrintLegal;
  source: PrintSource;
}
