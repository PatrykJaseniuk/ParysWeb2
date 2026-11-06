import type { Partner, Promotion } from "./0-types";

/**
 * Partnerzy i promocje — rekordy klucz → obiekt.
 *
 * Klucz jest tożsamością; do partnera odwołuje się `membership.partners`
 * (typ `PartnerKey`), a do promocji warstwa strony po `PromotionKey`.
 *
 * `applies_to` usunięte: zakres partnera wynika z `membership.partners`.
 * Jedno miejsce prawdy zamiast dwóch lustrzanych list.
 */

export const partners = {
  "partner-multisport": {
    name: "MultiSport",
    access_mode: "reception_hours",
    note: "Dostęp w godzinach pracy recepcji.",
  },
  "partner-medicover": {
    name: "Medicover Sport",
    access_mode: "24_7_after_registration",
    note: "Dostęp całodobowy dla zarejestrowanych klientów.",
  },
  "partner-fitprofit": {
    name: "FitProfit",
    access_mode: "24_7_after_registration",
    note: "Dostęp całodobowy dla zarejestrowanych klientów.",
  },
  "partner-pzu": {
    name: "PZU",
    access_mode: "unknown",
    note: "Zakres dostępu potwierdź w recepcji.",
  },
} satisfies Record<string, Partner>;

/** Klucze partnerów — jedyny dozwolony sposób odwołania się do partnera. */
export type PartnerKey = keyof typeof partners;

export const promotions = {
  "promo-student-99": {
    name: "Karnet studencki 99",
    state: "unused",
    price: { amount: 99, unit: "term" },
  },
  "promo-student-90": {
    name: "Karnet studencki 90 (archiwalna)",
    state: "archived",
    price: { amount: 90, unit: "term" },
  },
  "promo-boxing": {
    name: "Boks — nowe zajęcia grupowe",
    state: "expired",
    valid_to: "2024-10-01",
    conditions: "Modal promocyjny wyświetlany tylko przed 2024-10-01.",
  },
} satisfies Record<string, Promotion>;

/** Klucze promocji — jedyny dozwolony sposób odwołania się do promocji. */
export type PromotionKey = keyof typeof promotions;
