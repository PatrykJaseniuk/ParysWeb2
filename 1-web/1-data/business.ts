/**
 * Warstwa danych — adapter modelu (`0-core/` i `0-site/`) do widoków UI.
 *
 * Model jest kontraktem dla generatora strony, a nie kształtem, którego
 * oczekują komponenty. Ten plik tłumaczy jedno na drugie:
 *
 *   0-core/                ┐
 *   0-site/1-site.ts       ├─→  business.ts  →  komponenty
 *   0-site/2-quality.ts    ┘
 *
 * Zasady:
 *  - komponenty nie czytają modelu bezpośrednio,
 *  - nic nie jest dopisywane „na sztywno” — wszystkie wartości pochodzą z modelu,
 *  - teksty wyprowadzalne (np. „ważny 1 miesiąc”) liczymy tutaj, żeby nie było
 *    duplikacji w danych.
 */

import { business as businessModelSource } from "../../0-core";
import { site as siteModel } from "../0-site/1-site";
import { quality } from "../0-site/2-quality";
import type { BusinessModel, Money, Term } from "../../0-core/0-types";
import type { Asset, MediaRoles } from "../0-site/0-types";
import { assertModelIntegrity } from "../0-site/3-invariants";

/**
 * Adapter czyta model przez szeroki kontrakt (`BusinessModel`), a nie przez
 * wąskie typy literałowe rekordów — dzięki temu `Object.entries` daje jednolity
 * kształt encji z opcjonalnymi polami.
 */
const businessModel: BusinessModel = businessModelSource;

/** Reguły międzypliku — niespójny model zatrzymuje build. */
assertModelIntegrity();

/**
 * Bazowa ścieżka wdrożenia (GitHub Pages: `/ParysWeb2`).
 * Wszystkie wewnętrzne URL-e w modelu są zapisane od roota (`/karnety`,
 * `/img/...`), a ta warstwa dokłada prefiks wdrożenia.
 */
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * `/karnety` → `/ParysWeb2/karnety`; `#kotwica` i adresy zewnętrzne bez zmian.
 * Strona główna nie dostaje końcowego ukośnika (`/ParysWeb2`), bo
 * `trailingSlash: "never"` — inaczej dev server zwraca 404.
 */
export function withBase(path: string): string {
  const alreadyPrefixed =
    BASE_PATH !== "" && (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`));
  const resolved = path === "/" ? BASE_PATH || "/" : `${BASE_PATH}${path}`;
  return path.startsWith("/") && !alreadyPrefixed ? resolved : path;
}

const bindings: Record<string, MediaRoles> = siteModel.media.bindings;

/** Media encji pochodzą z warstwy strony, nie z modelu biznesowego. */
function mediaOf(id: string): MediaRoles {
  return bindings[id] ?? {};
}

/* ------------------------------------------------------------------ *
 *  Formatowanie
 * ------------------------------------------------------------------ */

const plnFormatter = new Intl.NumberFormat("pl-PL", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

/** 1490 → "1 490 zł" (niełamliwa spacja z Intl). */
export function pln(amount: number): string {
  return `${plnFormatter.format(amount)}\u00a0zł`;
}

const MONTHS_PL: Record<number, string> = {
  1: "miesiąc",
  2: "miesiące",
  3: "miesiące",
  4: "miesiące",
  6: "miesięcy",
  12: "miesięcy",
};

const TERM_UNIT_PL: Record<string, string> = {
  day: "dni",
  week: "tygodnie",
  month: "miesiąc",
  year: "lata",
};

/** Termin ważności jako tekst: "1 miesiąc", "2 tygodnie", "12 miesięcy". */
function termLabel(term: Term | null): string {
  if (!term) return "jedno wejście";
  if (term.unit === "month") return `${term.value} ${MONTHS_PL[term.value] ?? "miesięcy"}`;
  if (term.unit === "week") return `${term.value} ${term.value === 1 ? "tydzień" : "tygodnie"}`;
  if (term.unit === "day") return `${term.value} ${term.value === 1 ? "dzień" : "dni"}`;
  return `${term.value} ${TERM_UNIT_PL[term.unit] ?? ""}`.trim();
}

/** Opis ceny: "149 zł", "od 120 zł / godz." */
function priceText(money: Money | null, note: string | null = null): string {
  if (!money) return note ?? "—";
  const prefix = money.type === "from" ? "od " : "";
  const suffix = money.unit === "hour" ? " / godz." : "";
  return `${prefix}${pln(money.amount)}${suffix}`;
}

/* ------------------------------------------------------------------ *
 *  Assety
 * ------------------------------------------------------------------ */

export function asset(id: string | null | undefined) {
  if (!id) return null;
  const assets: Record<string, Asset> = siteModel.media.assets;
  const a = assets[id];
  if (!a) return null;
  const variants = a.variants ?? [];
  const largest = variants.length ? variants[variants.length - 1] : null;
  return {
    id,
    src: withBase(a.served ?? largest?.path ?? ""),
    srcset: variants.map((v) => `${withBase(v.path)} ${v.width}w`).join(", "),
    alt: a.alt,
    width: largest?.width ?? null,
  };
}

/* ------------------------------------------------------------------ *
 *  Encje
 * ------------------------------------------------------------------ */

export const business = {
  name: businessModel.identity.display_name,
  tagline: businessModel.identity.tagline,
  shortDescription: businessModel.identity.description,
  established: businessModel.identity.facts.founded,
  area: businessModel.identity.facts.area_m2,
  rooms: businessModel.identity.facts.rooms,
  open24: businessModel.identity.facts.open_24_7,
  website: businessModel.identity.website,
};

const DAYS_PL: Record<string, string> = {
  mon: "pon",
  tue: "wt",
  wed: "śr",
  thu: "czw",
  fri: "pt",
  sat: "sob",
  sun: "ndz",
};

export const contact = {
  email: businessModel.identity.contact.email,
  phone: businessModel.identity.contact.phone_display,
  phone_e164: businessModel.identity.contact.phone_e164,
  address: {
    street: businessModel.identity.address.street,
    city: businessModel.identity.address.city,
    postal_code: businessModel.identity.address.postal_code,
    country: "Polska",
    country_code: businessModel.identity.address.country_code,
    postalIsAssumed: quality.unknowns.some((u) => u.path === "identity.address.postal_code"),
    full: `${businessModel.identity.address.street}, ${businessModel.identity.address.postal_code ?? ""} ${businessModel.identity.address.city}`.trim(),
  },
  reception_hours: businessModel.identity.hours.reception
    .filter((r) => !r.closed && r.open && r.close)
    .map((r) => ({
      days:
        r.days.length > 1
          ? `${DAYS_PL[r.days[0]]} - ${DAYS_PL[r.days[r.days.length - 1]]}`
          : DAYS_PL[r.days[0]],
      open: r.open!,
      close: r.close!,
    })),
  reception_hours_note: "Brak informacji o niedzieli i dniach świątecznych.",
  facility_hours: businessModel.identity.hours.facility.note,
  social: businessModel.identity.social.map((s) => ({
    platform: s.platform === "facebook" ? "Facebook" : "Instagram",
    url: s.url,
    handle: s.handle,
  })),
  mapEmbed: businessModel.identity.location.map_embed_url,
  coordinates: { lat: businessModel.identity.location.lat, lng: businessModel.identity.location.lng },
  placeName: businessModel.identity.location.place_name,
};

const HIGHLIGHT_ICONS: Record<string, string> = {
  clock: "IconClockShield",
  barbell: "IconBarbell",
  area: "IconSquare",
  snowflake: "IconAirConditioning",
  users: "IconHeartHandshake",
  parking: "IconParking",
};

/** Tytuł karty: jeśli highlight wskazuje fakt, wartość pochodzi z faktu. */
function highlightTitle(h: (typeof businessModel.identity.highlights)[number]): string {
  if (!h.fact) return h.title;
  const prefix = h.prefix ? `${h.prefix} ` : "";
  return `${prefix}${businessModel.identity.facts[h.fact]}${h.suffix ?? ""}`;
}

export const facilities = businessModel.identity.highlights.map((h) => ({
  id: h.id,
  title: highlightTitle(h),
  label: h.title,
  description: h.text ?? "",
  icon_hint: HIGHLIGHT_ICONS[h.icon] ?? "IconSpark",
  content_ref: h.ref ?? null,
  isPartners: h.ref === "partners",
}));

export const areas = Object.entries(businessModel.catalog.areas).map(([id, a]) => ({
  id,
  slug: a.slug,
  name: a.name,
  short: a.short,
  description: a.description,
  photo: mediaOf(id).photo ?? null,
  video: mediaOf(id).video ?? null,
  calendar: a.calendar ?? null,
  calendarId: a.calendar ?? null,
  image: asset(mediaOf(id).photo),
}));

export function areaById(id: string) {
  return areas.find((a) => a.id === id || a.slug === id);
}

/* ------------------------------------------------------------------ *
 *  Karnety
 * ------------------------------------------------------------------ */

/** Kolejność wariantów w cenniku — rosnąco po czasie trwania. */
export const OPTION_ORDER = [
  "entry",
  "two_weeks",
  "eight_entries",
  "monthly",
  "monthly_student_senior",
  "yearly",
] as const;

export const OPTION_META: Record<string, { label: string; short: string; description: string }> = {
  entry: {
    label: "Wejście jednorazowe",
    short: "1 wejście",
    description: "Jedno wejście ważne 7 dni.",
  },
  two_weeks: {
    label: "2 tygodnie",
    short: "2 tyg.",
    description: "Nielimitowane wejścia przez 14 dni.",
  },
  eight_entries: {
    label: "8 wejść",
    short: "8 wejść",
    description: "Osiem wejść ważnych 2 miesiące.",
  },
  monthly: {
    label: "Karnet miesięczny",
    short: "Miesiąc",
    description: "Nielimitowane wejścia przez miesiąc.",
  },
  monthly_student_senior: {
    label: "Miesiąc — uczeń/senior",
    short: "Miesiąc uczeń/senior",
    description: "Uczniowie oraz studenci do 26 lat na studiach dziennych, a także seniorzy od 67 lat.",
  },
  yearly: {
    label: "Karnet roczny",
    short: "Rok",
    description: "12 miesięcy, dwa miesiące gratis.",
  },
};

export const enrollmentFee = businessModel.pricing_policy.enrollment_fee.amount;

export type MembershipOptionView = {
  id: string;
  label: string;
  price_pln: number;
  price_text: string;
  validity: string;
  entries: number | null;
  features: string[];
  term: Term | null;
  access: string;
};

export type MembershipView = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  areas_included: string[];
  classes_included: string[];
  partner_access: { partner: string; access: string; logo: string | null }[];
  options: MembershipOptionView[];
  enrollment_fee_pln: number;
  no_contract: boolean;
  fromPrice: number;
  monthlyFrom: number | null;
  optionIds: string[];
  notes: string[];
  order: number;
  featured: boolean;
};

export const memberships: MembershipView[] = Object.entries(
  businessModel.catalog.memberships,
).map(([id, m], index) => {
  const options: MembershipOptionView[] = m.options.map((o) => ({
    id: o.code,
    label: o.label,
    price_pln: o.price.amount,
    price_text: priceText(o.price),
    validity: termLabel(o.term ?? null),
    entries: o.entries ?? null,
    features: (o.perks ?? []).map((code) => businessModel.catalog.perks[code] ?? code),
    term: o.term ?? null,
    access: businessModel.identity.hours.facility.mode,
  }));

  const monthly = options.filter((o) => o.id === "monthly");

  return {
    id,
    slug: m.slug,
    name: m.name,
    subtitle: m.subtitle ?? null,
    areas_included: m.areas,
    classes_included: m.classes ?? [],
    partner_access: (m.partners ?? []).map((partnerId) => {
      const partner = businessModel.catalog.partners[partnerId];
      return {
        partner: partner?.name ?? partnerId,
        access:
          partner?.access_mode === "reception_hours"
            ? "dostęp w godzinach otwarcia recepcji"
            : "całodobowy dostęp dla zarejestrowanych klientów",
        logo: partner ? (asset(mediaOf(partnerId).logo)?.src ?? null) : null,
      };
    }),
    options,
    enrollment_fee_pln: businessModel.pricing_policy.enrollment_fee.amount,
    no_contract: businessModel.pricing_policy.contract === "none",
    fromPrice: Math.min(...options.map((o) => o.price_pln)),
    monthlyFrom: monthly.length ? Math.min(...monthly.map((o) => o.price_pln)) : null,
    optionIds: options.map((o) => o.id),
    notes: [] as string[],
    order: index,
    featured: m.featured === true,
  };
});

export const optionCount = memberships.reduce((count, membership) => count + membership.options.length, 0);

export interface MatrixCell {
  price: number;
  option: MembershipOptionView;
}

export interface MatrixRow {
  optionId: string;
  meta: { label: string; short: string; description: string };
  cells: (MatrixCell | null)[];
}

/** Macierz warianty × karnety — używana w cenniku i na stronie /karnety. */
export function buildMatrix(): { columns: MembershipView[]; rows: MatrixRow[] } {
  const rows = OPTION_ORDER.map((optionId) => ({
    optionId,
    meta: OPTION_META[optionId]!,
    cells: memberships.map((m) => {
      const option = m.options.find((o) => o.id === optionId);
      return option ? { price: option.price_pln, option } : null;
    }),
  }));

  return { columns: memberships, rows: rows.filter((row) => row.cells.some(Boolean)) };
}

export const entryPrice = Math.min(
  ...Object.values(businessModel.catalog.memberships).flatMap((m) =>
    m.options.map((o) => o.price.amount),
  ),
);

export const monthlyFrom = Math.min(
  ...Object.values(businessModel.catalog.memberships).flatMap((m) =>
    m.options.filter((o) => o.code === "monthly").map((o) => o.price.amount),
  ),
);

/* ------------------------------------------------------------------ *
 *  Zajęcia, trenerzy, usługi, partnerzy
 * ------------------------------------------------------------------ */

export const groupClasses = Object.entries(businessModel.catalog.classes).map(([id, c]) => ({
  id,
  slug: c.slug,
  name: c.name,
  summary: c.summary,
  description: c.description,
  photo: asset(mediaOf(id).photo),
  video: mediaOf(id).video ?? null,
  calendar: c.calendar ?? null,
  included_in: Object.entries(businessModel.catalog.memberships)
    .filter(([, m]) => (m.classes ?? []).some((classKey) => classKey === id))
    .map(([membershipKey]) => membershipKey),
}));

export const trainers = Object.entries(businessModel.catalog.trainers).map(([id, t]) => ({
  id,
  name: t.name,
  description: t.role,
  photo: asset(mediaOf(id).photo)?.src ?? null,
}));

export const personalTraining = {
  description: businessModel.catalog.personal_training.description,
  price: {
    amount_pln: businessModel.catalog.personal_training.price.amount,
    unit: "godzina",
    price_text: priceText(businessModel.catalog.personal_training.price),
    source_label: "godzinny trening",
  },
};

export const services = Object.entries(businessModel.catalog.services).map(([id, s]) => ({
  id,
  slug: s.slug,
  name: s.name,
  description: s.description,
  price: s.price
    ? {
      amount_pln: s.price.amount,
      unit: s.price.type === "from" ? "od" : "godzina",
      price_text: priceText(s.price),
      features: s.features,
    }
    : null,
  price_note: s.price_note,
  booking: s.booking?.text ?? null,
  bookingChannel: s.booking?.channel ?? null,
  calendar: s.calendar,
  video: mediaOf(id).video ?? null,
}));

const ACCESS_LABEL: Record<string, string> = {
  reception_hours: "Dostęp w godzinach pracy recepcji.",
  "24_7_after_registration": "Dostęp całodobowy dla zarejestrowanych klientów.",
  "24_7": "Dostęp całodobowy.",
  unknown: "Zakres dostępu potwierdź w recepcji.",
};

export const partners = Object.entries(businessModel.catalog.partners).map(([id, p]) => {
  const applies = Object.entries(businessModel.catalog.memberships)
    .filter(([, m]) => (m.partners ?? []).some((partnerKey) => partnerKey === id))
    .map(([, m]) => m.name);
  const logoSrc = mediaOf(id).logo ?? null;
  const logo = asset(logoSrc);
  return {
    id,
    name: p.name,
    logo: logoSrc,
    logoSrc: logo?.src ?? null,
    logoAlt: logo?.alt ?? p.name,
    access_note: ACCESS_LABEL[p.access_mode] ?? ACCESS_LABEL.unknown,
    note: p.note ?? ACCESS_LABEL[p.access_mode] ?? null,
    scope: applies.length ? `Karnety: ${applies.join(" i ")}` : null,
  };
});

export const calendars = Object.entries(businessModel.integrations.calendars).map(([id, c]) => ({
  id,
  purpose: c.purpose,
  title: c.title,
  url: c.embed_url,
  timezone: businessModel.meta.timezone,
  default_view: "WEEK",
  color: c.colors[0] ?? null,
  colors: c.colors,
}));

export function calendarById(id: string | null | undefined) {
  if (!id) return undefined;
  return calendars.find((c) => c.id === id);
}

/* ------------------------------------------------------------------ *
 *  Nawigacja i SEO
 * ------------------------------------------------------------------ */

export const nav = siteModel.site.nav.map((n) => ({ label: n.label, href: withBase(n.href) }));

export const cta = {
  primary: { ...siteModel.site.cta.primary, href: withBase(siteModel.site.cta.primary.href) },
  secondary: { ...siteModel.site.cta.secondary, href: withBase(siteModel.site.cta.secondary.href) },
};

export const seo = {
  title: businessModel.identity.display_name,
  description: siteModel.site.seo_defaults.description,
  canonical_url: `${BASE_PATH}/`,
  favicon: asset("asset-favicon")?.src ?? withBase("/favicon.ico"),
};

/** Czy model pozwala publikować (bramka z `_quality`). */
export const publishable: boolean = quality.publishable;
