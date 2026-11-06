/**
 * Dodatki wariantów cenowych — słownik kod → etykieta.
 *
 * Wariant podaje tylko kod (`perks: ["freeze"]`), więc etykieta
 * „Możliwość zablokowania karnetu” istnieje w modelu raz, a nie osiem razy.
 * Zbiór dozwolonych kodów jest zarazem typem `PerkKey`, więc nieznany dodatek
 * w wariancie to błąd kompilacji.
 */
export const perks = {
  freeze: "Możliwość zablokowania karnetu",
  "student-senior-eligibility": "Uczniowie i studenci do 26 lat oraz seniorzy od 67 lat",
  "two-months-free": "Dwa miesiące gratis",
} satisfies Record<string, string>;

/** Kody dodatków — jedyny dozwolony sposób odwołania się do wpisu słownika. */
export type PerkKey = keyof typeof perks;
