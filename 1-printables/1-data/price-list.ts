import { business as modelSource } from "../../0-core";
import type { BusinessModel, Day, Money, Partner, Service } from "../../0-core/0-types";
import type {
  PrintColumn,
  PrintPassTable,
  PrintPerkNote,
  PrintPriceList,
  PrintPriceRow,
  PrintScopeTable,
  PrintService,
} from "../0-print/0-types";
import { pln, plural, validityLabel, websiteLabel } from "../0-print/1-format";
import { assertPriceListIntegrity } from "./invariants";

/**
 * Adapter modelu (`0-core`) do dokumentu drukowanego.
 *
 * Warstwa 1 druku. Tłumaczy fakty biznesowe na gotowy cennik: liczy etykiety
 * („6 stref treningowych”, „ważne 7 dni”), porządkuje warianty w wiersze
 * i przypisuje dodatkom numery przypisów. Renderer nie zna już modelu.
 *
 * Kolejność wariantów jest decyzją prezentacyjną, nie danymi: model trzyma
 * je w kolejności zależnej od karnetu, a cennik potrzebuje jednego porządku
 * dla wszystkich kolumn. Kody spoza listy trafiają na koniec, więc nowy
 * wariant w rdzeniu nie zniknie z wydruku.
 */

const model: BusinessModel = modelSource;

/**
 * Dodatki pomijane na wydruku — decyzja redakcyjna. Model nadal ich używa
 * (np. na stronie), więc filtr siedzi w adapterze druku, a nie w rdzeniu.
 */
const HIDDEN_PERKS: readonly string[] = ["two-months-free"];

const printPerks = (variant: { perks?: string[] }): string[] =>
  (variant.perks ?? []).filter((perk) => !HIDDEN_PERKS.includes(perk));

const VARIANT_ORDER: readonly string[] = [
  "two_weeks",
  "eight_entries",
  "monthly",
  "monthly_student_retiree",
  "yearly",
];

const DAY_LABELS: Record<Day, string> = {
  mon: "pon.",
  tue: "wt.",
  wed: "śr.",
  thu: "czw.",
  fri: "pt.",
  sat: "sob.",
  sun: "niedz.",
};

const BOOKING_LABELS: Record<string, string> = {
  phone: "Rezerwacja telefoniczna",
  reception: "Rezerwacja w recepcji",
  online: "Rezerwacja online",
};

const themeToken = (key: string): string => model.brand.palette.tokens[key]?.hex ?? "";

const moneyText = (money: Money): string =>
  `${money.type === "from" ? "od " : ""}${pln(money.amount)}`;

const moneyWithUnit = (money: Money): string =>
  `${moneyText(money)}${money.unit === "hour" ? " / godz." : ""}`;

const daySpan = (days: Day[]): string => {
  const first = days[0] ? DAY_LABELS[days[0]] : "";
  const last = days.at(-1) ? DAY_LABELS[days.at(-1)!] : "";
  return days.length > 1 ? `${first}–${last}` : first;
};

const classesSubtitle = (classes: string[] | undefined): string =>
  (classes?.length ?? 0) > 0 ? "Z zajęciami grupowymi" : "Bez zajęć grupowych";

const accessList = Object.entries(model.catalog.accesses).map(([key, access], index) => ({
  key,
  access,
  index,
}));

const accessScopes = accessList.map(({ key, access, index }) => ({
  key,
  index: String(index + 1).padStart(2, "0"),
  name: access.name,
  subtitle: access.subtitle ?? classesSubtitle(access.classes),
  featured: access.featured === true,
  area_keys: access.areas,
  has_classes: (access.classes?.length ?? 0) > 0,
}));

const columns: PrintColumn[] = accessScopes.map((scope) => ({
  key: scope.key,
  index: scope.index,
  name: scope.name,
  subtitle: scope.subtitle,
  featured: scope.featured,
}));

const allVariants = accessList.flatMap(({ access }) => access.variants);
const allCodes = Array.from(new Set(allVariants.map((variant) => variant.code)));

const labelFor = (code: string): string =>
  allVariants.find((variant) => variant.code === code)?.label ?? code;

const orderedCodes = [
  ...VARIANT_ORDER.filter((code) => allCodes.includes(code)),
  ...allCodes
    .filter((code) => !VARIANT_ORDER.includes(code))
    .sort((first, second) => labelFor(first).localeCompare(labelFor(second), "pl")),
];

const orderedVariants = orderedCodes.flatMap((code) =>
  allVariants.filter((variant) => variant.code === code),
);

const perkCodes = Array.from(new Set(orderedVariants.flatMap((variant) => printPerks(variant))));
const perkNumbers = new Map(perkCodes.map((code, index) => [code, index + 1] as const));
const perkNotes: PrintPerkNote[] = perkCodes.map((code, index) => ({
  number: index + 1,
  label: model.catalog.perks[code] ?? code,
}));

const rows: PrintPriceRow[] = orderedCodes.map((code) => ({
  code,
  label: labelFor(code),
  cells: accessList.map(({ access }) => {
    const variant = access.variants.find((item) => item.code === code) ?? null;
    return variant
      ? {
          price: moneyText(variant.price),
          perk_numbers: printPerks(variant)
            .map((perk) => perkNumbers.get(perk) ?? 0)
            .filter((number) => number > 0),
        }
      : null;
  }),
}));

const accessCount = accessList.length;
const variantCount = allVariants.length;

const clubCardFee = pln(model.entry_policy.club_card_fee);
const accessWindow =
  model.entry_policy.access_window === "24_7" ? "24/7" : "w godzinach pracy recepcji";

const passes: PrintPassTable = {
  caption: "Cennik karnetów — warianty, ceny i zakres",
  summary: `${accessCount} ${plural(accessCount, ["karnet", "karnety", "karnetów"])} · ${variantCount} ${plural(variantCount, ["wariant", "warianty", "wariantów"])}`,
  columns,
  rows,
  perk_notes: perkNotes,
};

const clubCardNote = model.entry_policy.access_requires_registration
  ? `Karnet wymaga rejestracji i karty klubowej (${clubCardFee}); karta daje dostęp ${accessWindow}.`
  : "Karnet nie wymaga karty klubowej.";

const scope: PrintScopeTable = {
  label: "Zakres",
  note: "Strefy i zajęcia w karnecie",
  rows: [
    ...Object.entries(model.catalog.areas).map(([key, area]) => ({
      key,
      name: area.name,
      cells: accessScopes.map((scope) => scope.area_keys.includes(key)),
    })),
    {
      key: "classes",
      name: "Zajęcia grupowe",
      cells: accessScopes.map((scope) => scope.has_classes),
    },
  ],
};

const serviceDetail = (service: Service): string[] => {
  const booking = service.booking
    ? (service.booking.text ?? BOOKING_LABELS[service.booking.channel] ?? null)
    : null;
  return [...(service.features ?? []), ...(booking ? [booking] : [])];
};

const services: PrintService[] = Object.entries(model.catalog.services).map(([key, service]) => ({
  key,
  name: service.name,
  description: service.description,
  price: service.price ? moneyWithUnit(service.price) : null,
  price_note: service.price ? null : (service.price_note ?? null),
  details: serviceDetail(service),
}));

const partnerBadge = (partner: Partner): string =>
  partner.can_register_club_card && partner.terminal_visit_registration
    ? "Karta 24/7"
    : "Tylko recepcja";

const partners = Object.values(model.catalog.partners).map((partner) => ({
  name: partner.name,
  badge: partnerBadge(partner),
}));

const partnerScope =
  model.entry_policy.partner_single_entry_scope === "all_areas_and_cross"
    ? "wszystkie strefy i zajęcia grupowe"
    : "wybrane strefy";

const partnersNote = model.entry_policy.partner_cards_read_by_gate
  ? `Karty partnerskie opłacają wejście jednorazowe — ${partnerScope}.`
  : `Karta partnerska nie otwiera bramki. Programy opłacają wejście jednorazowe — ${partnerScope}; po rejestracji otrzymasz kartę klubową 24/7.`;

const reception = model.identity.hours.reception.map((rule) =>
  rule.closed
    ? `${daySpan(rule.days)} nieczynne`
    : `${daySpan(rule.days)} ${rule.open ?? ""}–${rule.close ?? ""}`.trim(),
);

const singleEntry = {
  name: model.catalog.single_entry.name,
  description: model.catalog.single_entry.description,
  price: moneyText(model.catalog.single_entry.price),
  unit: "za wejście",
  validity: validityLabel(model.catalog.single_entry.term),
  facts: [
    model.entry_policy.single_entry_access === "reception_hours"
      ? "W godzinach pracy recepcji"
      : "Całodobowo",
  ],
};

const doc: PrintPriceList = {
  title: "Cennik",
  kicker: `${model.identity.display_name} · ${model.identity.address.city}`,
  brand_short: model.brand.name.short,
  brand_sub: "siłownia / cross",
  intro: model.identity.tagline,
  theme: {
    paper: themeToken("paper"),
    ink: themeToken("ink"),
    brand: themeToken("brand"),
    brand_text: themeToken("brand_text_paper"),
    on_brand: themeToken("on_accent"),
    display_family: model.brand.typography.display.family,
    body_family: model.brand.typography.body.family,
    mono_family: model.brand.typography.mono.family,
  },
  single_entry: singleEntry,
  passes,
  scope,
  services,
  policy_notes: [...model.pricing_policy.notes],
  club_card_note: clubCardNote,
  partners,
  partners_note: partnersNote,
  contact: {
    address: `${model.identity.address.street}, ${model.identity.address.postal_code} ${model.identity.address.city}`,
    phone: model.identity.contact.phone_display,
    email: model.identity.contact.email,
    website: model.identity.website,
    website_label: websiteLabel(model.identity.website),
  },
  hours: {
    reception,
    note: model.identity.hours.facility.note,
  },
  legal: {
    operator: model.identity.legal_name ?? model.identity.display_name,
    nip: model.identity.nip ?? null,
    regon: model.identity.regon ?? null,
  },
  source: {
    model_version: model.model_version,
    generated_at: model.meta.generated_at,
    generator: "1-printables · cennik A4",
  },
};

assertPriceListIntegrity(doc);

/** Gotowy cennik — jedyny eksport adaptera. */
export const priceList: PrintPriceList = doc;
