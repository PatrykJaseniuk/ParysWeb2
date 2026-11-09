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
  contract: "required",
  freeze_allowed: false,
  includes_vat: true,
  prices_confirmed_by_owner: true,
  notes: [
    "Cennik obowiązuje od 1 czerwca 2026 r.",
    "Ceny są brutto — zawierają VAT (potwierdzone przez właściciela).",
    "Karnety są przedpłacone i wymagają podpisania umowy członkowskiej; nie odnawiają się automatycznie.",
    "Karnety nie podlegają blokowaniu ani zawieszaniu.",
  ],
};
