import type { Service } from "./0-types";
import type { CalendarKey } from "./1-integrations";

/**
 * Usługi dodatkowe (badminton, sauna, masaż, bufet) — rekord klucz → usługa.
 *
 * Klucz jest tożsamością usługi; `calendar` odwołuje się do wpisu
 * w `integrations.calendars` przez `CalendarKey`.
 *
 * Pola opcjonalne pojawiają się tylko wtedy, gdy mają wartość — zamiast
 * `price: null` i `features: []` po prostu ich nie ma.
 */

export const services = {
  "svc-badminton": {
    slug: "badminton",
    name: "Badminton",
    description: "Pełnowymiarowy kort do gry w badmintona",
    price: { amount: 70, unit: "hour" },
    features: ["1 godzina gry"],
    booking: { channel: "reception" },
    calendar: "cal-room-availability",
  },
  "svc-sauna": {
    slug: "sauna",
    name: "Sauna",
    description: "Sucha sauna z leżakownią i prysznicem. Cena dotyczy wynajęcia całego pomieszczenia na wyłączność.",
    price: { amount: 70, unit: "hour" },
    features: ["wynajęcie na 1 godzinę", "maksymalnie 6 osób"],
    booking: {
      channel: "phone",
      lead_time_hours: 1,
      text: "Rezerwacja przynajmniej godzinę przed planowaną wizytą.",
    },
    calendar: "cal-sauna",
  },
  "svc-massage": {
    slug: "masaz",
    name: "Masaż",
    description: "Wybierz masaż klasyczny, sportowy, próżniowy lub relaksacyjny.",
    price: { amount: 120, unit: "hour", type: "from" },
    booking: { channel: "reception", text: "Zapisy w recepcji lub telefonicznie." },
  },
  "svc-buffet": {
    slug: "bufet-sklep",
    name: "Bufet i sklep z odżywkami",
    description: "W sklepie kupisz napoje, odżywki, suplementy diety, odzież sportową i akcesoria treningowe. W bufecie zamówisz koktajle proteinowe i kawę.",
    price_note: "Ceny w sklepie",
  },
} satisfies Record<string, Service<CalendarKey>>;

/** Klucze usług — jedyny dozwolony sposób odwołania się do usługi. */
export type ServiceKey = keyof typeof services;
