/**
 * Dodatki wariantów cenowych — słownik kod → etykieta.
 *
 * Wariant podaje tylko kod (`perks: ["two-months-free"]`), więc etykieta
 * „Dwa miesiące gratis” istnieje w modelu raz, a nie w każdym wariancie rocznym.
 * Zbiór dozwolonych kodów jest zarazem typem `PerkKey`, więc nieznany dodatek
 * w wariancie to błąd kompilacji.
 */
export const perks = {
  "student-senior-eligibility": "Uczniowie oraz studenci do 26 lat na studiach dziennych i seniorzy od 67 lat",
  "two-months-free": "Dwa miesiące gratis",
} satisfies Record<string, string>;

/** Kody dodatków — jedyny dozwolony sposób odwołania się do wpisu słownika. */
export type PerkKey = keyof typeof perks;
