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

export type EntryWindow = "reception_hours" | "24_7";
export type PriceUnit = "entry" | "term" | "hour" | "item";
export type PriceType = "exact" | "from";
export type TermUnit = "day" | "week" | "month" | "year";
export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

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
}

export interface PricingPolicy {
  contract: "none" | "required" | "optional";
  freeze_allowed: boolean;
  /** `null` = nie wiemy, czy ceny zawierają VAT. */
  includes_vat: boolean | null;
  prices_confirmed_by_owner: boolean;
  notes: string[];
}

/**
 * Zasady wejścia do obiektu. Karta klubowa jest nośnikiem dostępu;
 * karty partnerskie służą wyłącznie do opłacenia wejścia jednorazowego.
 */
export interface EntryPolicy {
  single_entry_requires_registration: boolean;
  single_entry_access: EntryWindow;
  membership_requires_registration: boolean;
  membership_access: EntryWindow;
  partner_single_entry_scope: "all_areas_and_cross";
  registered_partner_access: EntryWindow;
  partner_cards_read_by_gate: boolean;
  club_card_fee: number;
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
  PerkCode extends string = string,
> {
  slug: string;
  name: string;
  subtitle?: string;
  /** Klucze stref z `catalog.areas`. */
  areas: AreaKey[];
  /** Klucze zajęć z `catalog.classes`. */
  classes?: ClassKey[];
  featured?: boolean;
  options: MembershipOption<PerkCode>[];
}

/**
 * Wejście jednorazowe — samodzielny produkt, nie wariant karnetu.
 * Zasady rejestracji i godzin wejścia określa `entry_policy`.
 */
export interface SingleEntry<AreaKey extends string = string, ClassKey extends string = string> {
  name: string;
  description: string;
  price: Money;
  term: Term;
  areas: AreaKey[];
  classes?: ClassKey[];
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
  /** Profil trenera na Instagramie. Brak = trener nie ma podanego profilu. */
  instagram?: string;
  /** Krótkie specjalizacje z publicznego opisu profilu. */
  specialties?: string[];
}

export interface PersonalTraining<TrainerKey extends string = string> {
  name: string;
  description: string;
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
  /** Czy po rejestracji można otrzymać fizyczną kartę klubową. */
  can_register_club_card: boolean;
  /** Czy karta klubowa pozwala samodzielnie zarejestrować wizytę w terminalu. */
  terminal_visit_registration: boolean;
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
  single_entry: SingleEntry;
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

/* ------------------------------------------------------------------ *
 *  1-legal.ts
 * ------------------------------------------------------------------ */

export interface LegalSection {
  title: string;
  /** Akapity poprzedzają listę. Teksty mogą zawierać tokeny w klamrach. */
  paragraphs?: string[];
  items?: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  description: string;
  version: string;
  /** ISO 8601 (`YYYY-MM-DD`). */
  effective_from: string;
  /** Akapity wprowadzające, renderowane przed pierwszą sekcją. */
  intro: string[];
  /** Klucz sekcji jest jej tożsamością i kotwicą; kolejność kluczy = kolejność dokumentu. */
  sections: Record<string, LegalSection>;
}

/* ------------------------------------------------------------------ *
 *  2-membership-agreement.ts
 * ------------------------------------------------------------------ */

export type AgreementFieldKind =
  | "text"
  | "date"
  | "money"
  | "choice"
  | "checkbox"
  | "signature";

export interface AgreementField {
  /** Stabilny klucz pola formularza, nie identyfikator osoby. */
  key: string;
  label: string;
  kind: AgreementFieldKind;
  required: boolean;
  /** Pole warunkowe, np. wyłącznie dla klubowicza niepełnoletniego. */
  condition?: "minor";
  /** Token wartości drukowanej z modelu; puste pole go nie ma. */
  value_token?: string;
  /** Lista albo wartości wyliczane przez konsumenta z wskazanego katalogu. */
  source?: "catalog.memberships" | "catalog.membership_options";
  options?: string[];
  note?: string;
}

export interface AgreementFormSection {
  key: string;
  title: string;
  paragraphs?: string[];
  fields: AgreementField[];
}

export interface AgreementDeclaration {
  key: string;
  text: string;
  /** Oświadczenia wymagane nie są odrębnymi zgodami marketingowymi. */
  required: boolean;
  condition?: "minor";
}

export interface MembershipAgreementDocument {
  slug: string;
  title: string;
  description: string;
  version: string;
  effective_from: string;
  /** Wzór nie może trafić do podpisu, dopóki status pozostaje `draft`. */
  status: "draft" | "approved";
  draft_notice: string;
  /** Tokeny, których konsument nie może zastąpić pustym ciągiem. */
  required_tokens: string[];
  intro: string[];
  form_sections: AgreementFormSection[];
  declarations: AgreementDeclaration[];
  /** Klauzula dotyczy klubowiczów, nie statycznej strony internetowej. */
  privacy_notice: {
    title: string;
    intro: string[];
    /** Klucz sekcji jest jej tożsamością i kotwicą; kolejność kluczy = kolejność dokumentu. */
    sections: Record<string, LegalSection>;
  };
}

export interface BusinessModel {
  model_version: string;
  meta: Meta;
  identity: Identity;
  /** Marka: reguły nazwy, logo, koloru, typografii i głosu. */
  brand: BrandModel;
  pricing_policy: PricingPolicy;
  entry_policy: EntryPolicy;
  legal: {
    /** Obecnie publikowany regulamin (`1-legal.ts`). */
    terms: LegalDocument;
    /** Przeprojektowany regulamin — wersja następcza (`1-regulamin.ts`). */
    regulamin: LegalDocument;
    membership_agreement: MembershipAgreementDocument;
  };
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
