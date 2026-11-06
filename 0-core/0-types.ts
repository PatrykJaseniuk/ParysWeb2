/**
 * Typy rdzenia — kontrakt kształtu danych o firmie.
 *
 * Moduły w `0-core/` używają `satisfies`,
 * więc zła nazwa pola lub zła wartość to błąd kompilacji, a edytor podpowiada
 * dostępne pola przy pisaniu.
 *
 * Tożsamość encji nie jest polem — mieszka w kluczu rekordu w modułach danych.
 * Typy referencji (`AreaKey`, `ClassKey`, …) są wyprowadzane z tych kluczy przez
 * `keyof typeof`, więc literówka w referencji jest błędem kompilacji, a nie
 * dopiero błędem runtime.
 */

export type AccessMode = "24_7" | "reception_hours" | "24_7_after_registration" | "unknown";
export type PriceUnit = "entry" | "term" | "hour" | "item";
export type PriceType = "exact" | "from";
export type TermUnit = "day" | "week" | "month" | "year";
export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type HighlightIcon =
  | "clock"
  | "barbell"
  | "area"
  | "snowflake"
  | "users"
  | "parking"
  | "spark"
  | "phone"
  | "calendar"
  | "check";

/* ------------------------------------------------------------------ *
 *  Wspólne
 * ------------------------------------------------------------------ */

/**
 * Kwota w PLN. Waluta jest jedna dla całego modelu (`meta.currency`),
 * więc nie powtarzamy jej przy każdej cenie.
 */
export interface Money {
  amount: number;
  unit: PriceUnit;
  /** Brak = cena dokładna. `"from"` = „od …”. */
  type?: "from";
}

export interface Term {
  value: number;
  unit: TermUnit;
}

/* ------------------------------------------------------------------ *
 *  business/
 * ------------------------------------------------------------------ */

export interface Meta {
  locale: string;
  currency: string;
  timezone: string;
  generated_at: string;
  source: {
    type: "legacy-export" | "owner-input" | "mixed";
    repository: string | null;
    commit: string | null;
    live_url: string | null;
    verified_by_owner: boolean;
  };
}

export interface HoursRule {
  days: Day[];
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface IdentityFacts {
  founded: number;
  area_m2: number;
  rooms: number;
  open_24_7: boolean;
}

/**
 * Karta atutowa. Wartość liczbowa pochodzi z `facts` (jedno źródło prawdy),
 * a nie z kopii wpisanej w tekst.
 */
export interface Highlight {
  id: string;
  title: string;
  icon: HighlightIcon;
  /** Klucz faktu, np. `founded` → „od 1989”. */
  fact?: keyof IdentityFacts;
  prefix?: string;
  suffix?: string;
  text?: string;
  /** Karta renderuje listę encji zamiast tekstu. */
  ref?: "partners";
}

export interface Identity {
  display_name: string;
  legal_name?: string;
  alternate_names: string[];
  type: "gym" | "fitness_club" | "sports_center";
  tagline: string;
  description: string;
  facts: IdentityFacts;
  languages: string[];
  website: string;
  address: {
    street: string;
    city: string;
    postal_code: string;
    country_code: string;
  };
  contact: { phone_e164: string; phone_display: string; email: string };
  hours: {
    facility: { mode: "24_7" | "limited"; requires: "membership" | "none"; note: string };
    reception: HoursRule[];
  };
  location: {
    lat: number;
    lng: number;
    place_name: string;
    google_place_id: string | null;
    map_embed_url: string;
  };
  social: {
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "google";
    url: string;
    handle: string;
  }[];
  highlights: Highlight[];
}

export interface PricingPolicy {
  enrollment_fee: { amount: number; applies_to: "all" | "all_except_single_entry" };
  contract: "none" | "required" | "optional";
  freeze_allowed: boolean;
  /** `null` = nie wiemy, czy ceny zawierają VAT. */
  includes_vat: boolean | null;
  prices_confirmed_by_owner: boolean;
  notes: string[];
}

export interface Area<CalendarKey extends string = string> {
  slug: string;
  name: string;
  short: string;
  description: string;
  /** Klucz kalendarza z `integrations.calendars`. */
  calendar?: CalendarKey;
}

export interface MembershipOption<PerkCode extends string = string> {
  code: string;
  label: string;
  price: Money;
  term?: Term;
  /** Liczba wejść; brak = bez limitu. */
  entries?: number;
  /** Kody z `catalog.perks`. */
  perks?: PerkCode[];
}

export interface Membership<
  AreaKey extends string = string,
  ClassKey extends string = string,
  PartnerKey extends string = string,
  PerkCode extends string = string,
> {
  slug: string;
  name: string;
  subtitle?: string;
  /** Klucze stref z `catalog.areas`. */
  areas: AreaKey[];
  /** Klucze zajęć z `catalog.classes`. */
  classes?: ClassKey[];
  /** Klucze partnerów z `catalog.partners`. */
  partners?: PartnerKey[];
  featured?: boolean;
  options: MembershipOption<PerkCode>[];
}

export interface GroupClass<TrainerKey extends string = string, CalendarKey extends string = string> {
  slug: string;
  name: string;
  summary: string;
  description: string;
  calendar?: CalendarKey;
  trainer?: TrainerKey;
}

export interface Trainer {
  name: string;
  role: string;
}

export interface PersonalTraining<TrainerKey extends string = string> {
  name: string;
  description: string;
  price: Money;
  booking: { channel: "phone" | "reception" | "online"; text: string };
  trainers: TrainerKey[];
}

export interface Service<CalendarKey extends string = string> {
  slug: string;
  name: string;
  description: string;
  price?: Money;
  price_note?: string;
  features?: string[];
  booking?: {
    channel: "phone" | "reception" | "online" | "none";
    lead_time_hours?: number;
    text?: string;
  };
  calendar?: CalendarKey;
}

export interface Partner {
  name: string;
  access_mode: AccessMode;
  note?: string;
}

export interface Promotion {
  name: string;
  state: "active" | "expired" | "unused" | "archived";
  price?: Money;
  valid_from?: string;
  valid_to?: string;
  conditions?: string;
}

export interface Catalog {
  areas: Record<string, Area>;
  memberships: Record<string, Membership>;
  classes: Record<string, GroupClass>;
  trainers: Record<string, Trainer>;
  personal_training: PersonalTraining;
  services: Record<string, Service>;
  partners: Record<string, Partner>;
  promotions: Record<string, Promotion>;
  /** Słownik dodatków: kod → etykieta. Warianty podają tylko kod. */
  perks: Record<string, string>;
}

export interface CalendarSource {
  purpose: string;
  title?: string;
  embed_url: string;
  colors: string[];
}

export interface Integrations {
  calendars: Record<string, CalendarSource>;
  analytics: {
    provider: "google_analytics_4" | "plausible" | "none";
    measurement_id: string | null;
    status: "active" | "inactive" | "planned";
    requires_consent: boolean;
  };
}

export interface BusinessModel {
  model_version: string;
  meta: Meta;
  identity: Identity;
  /** Marka: reguły nazwy, logo, koloru, typografii i głosu. */
  brand: BrandModel;
  pricing_policy: PricingPolicy;
  catalog: Catalog;
  integrations: Integrations;
}

/* ------------------------------------------------------------------ *
 *  brand.ts
 * ------------------------------------------------------------------ */

export interface ColorToken {
  hex: string;
  role:
    | "background"
    | "surface"
    | "surface_alt"
    | "border"
    | "text"
    | "text_muted"
    | "accent"
    | "accent_hover"
    | "accent_text_dark"
    | "accent_text_paper"
    | "on_accent";
  contrast_on: string | null;
  /** Opcjonalna uwaga — pole pojawia się tylko tam, gdzie coś trzeba wyjaśnić. */
  note?: string | null;
}

export interface TypeFace {
  family: string;
  source?: string;
  weights: number[];
  transform: "uppercase" | "none" | "lowercase";
  letter_spacing?: string;
  line_height?: number;
}

export interface BrandName {
  /** Pełna nazwa — ta sama co `business.identity.display_name`. */
  canonical: string;
  short: string;
  with_city: string;
  /** Formy historyczne: rozpoznajemy, ale nie używamy. */
  legacy_do_not_use: string[];
  rules: string[];
}

export interface BrandPillar {
  name: string;
  meaning: string;
}

export interface LogoVariant {
  id: "mark" | "full" | "motto";
  name: string;
  description: string;
  ratio: string | null;
  min_width_px: number | null;
  use: string[];
}

export interface BrandLogo {
  variants: LogoVariant[];
  clear_space: string;
  prohibited: string[];
}

export interface BrandPalette {
  tokens: Record<string, ColorToken>;
  /** Udział procentowy: tło / neutralne / akcent. Suma = 100. */
  proportions: { base: number; neutral: number; accent: number };
  rules: string[];
}

export interface BrandTypeface extends TypeFace {
  usage: string;
}

export interface BrandVoice {
  style: string;
  person: string;
  vocabulary: { term: string; meaning: string }[];
  avoid: string[];
  formats: { label: string; example: string }[];
  example_good: string;
  example_bad: string;
}

export interface BrandImagery {
  treatment: string;
  do: string[];
  dont: string[];
}

export interface BrandMotion {
  level: "none" | "minimal" | "expressive";
  durations_ms: { fast: number; base: number };
  rules: string[];
}

export interface BrandModel {
  name: BrandName;
  promise: string;
  pillars: BrandPillar[];
  logo: BrandLogo;
  palette: BrandPalette;
  typography: { display: BrandTypeface; body: BrandTypeface; mono: BrandTypeface };
  voice: BrandVoice;
  imagery: BrandImagery;
  motion: BrandMotion;
  prohibited: string[];
}
