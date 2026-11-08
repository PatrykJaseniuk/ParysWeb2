import type { Meta, PricingPolicy } from "./0-types";

/**
 * Wersja modelu, waluta, strefa czasowa i provenance danych.
 */

export const meta: Meta = {
  locale: "pl-PL",
  currency: "PLN",
  timezone: "Europe/Warsaw",
  generated_at: "2026-11-08T19:30:00+01:00",
  source: {
    type: "mixed",
    repository: "https://github.com/PatrykJaseniuk/ParysWeb",
    commit: "8a14e21",
    live_url: "https://parys.nysa.pl/",
    verified_by_owner: false,
  },
};

/**
 * Zasady cennika wspólne dla wszystkich pozycji — tu, a nie w 26 obiektach ceny.
 */

export const pricing_policy: PricingPolicy = {
  enrollment_fee: { amount: 15, applies_to: "all_except_single_entry" },
  contract: "none",
  freeze_allowed: true,
  includes_vat: null,
  prices_confirmed_by_owner: true,
  notes: [
    "Cennik obowiązuje od 1 czerwca 2026 r.",
    "Ceny pochodzą z cennika przekazanego przez właściciela; nie potwierdzono, czy są brutto.",
  ],
};
