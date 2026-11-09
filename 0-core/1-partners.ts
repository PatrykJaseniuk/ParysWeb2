import type { Partner, Promotion } from "./0-types";

/**
 * Programy partnerskie i promocje — rekordy klucz → obiekt.
 *
 * Programy partnerskie są formami płatności za wejście jednorazowe do
 * wszystkich stref i Cross. Nie opłacają karnetów i nie są nośnikiem dostępu.
 *
 * Medicover Sport, FitProfit i PZU pozwalają po rejestracji odebrać fizyczną
 * kartę klubową. Karta daje dostęp 24/7 i pozwala płacić samodzielnie
 * w terminalu. MultiSport wymaga weryfikacji tożsamości przez pracownika,
 * dlatego działa wyłącznie w godzinach recepcji.
 */

export const partners = {
  "partner-multisport": {
    name: "MultiSport",
    can_register_club_card: false,
    terminal_payment: false,
    note: "Wejście jednorazowe do wszystkich stref i Cross, tylko w godzinach pracy recepcji — wymagana weryfikacja tożsamości przez pracownika.",
  },
  "partner-medicover": {
    name: "Medicover Sport",
    can_register_club_card: true,
    terminal_payment: true,
    note: "Wejście jednorazowe do wszystkich stref i Cross. Po rejestracji karta klubowa 24/7 i płatność w terminalu.",
  },
  "partner-fitprofit": {
    name: "FitProfit",
    can_register_club_card: true,
    terminal_payment: true,
    note: "Wejście jednorazowe do wszystkich stref i Cross. Po rejestracji karta klubowa 24/7 i płatność w terminalu.",
  },
  "partner-pzu": {
    name: "PZU",
    can_register_club_card: true,
    terminal_payment: true,
    note: "Wejście jednorazowe do wszystkich stref i Cross. Po rejestracji karta klubowa 24/7 i płatność w terminalu.",
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
} satisfies Record<string, Promotion>;

/** Klucze promocji — jedyny dozwolony sposób odwołania się do promocji. */
export type PromotionKey = keyof typeof promotions;
