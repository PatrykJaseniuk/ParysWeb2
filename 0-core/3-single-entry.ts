import type { SingleEntry } from "./0-types";
import type { AreaKey } from "./2-areas";
import type { ClassKey } from "./2-classes";

/**
 * Wejście jednorazowe — samodzielny produkt dostępny niezależnie od karnetu.
 *
 * Obejmuje wszystkie strefy i zajęcia grupowe. Nie wymaga rejestracji ani karty
 * klubowej; obowiązuje w godzinach pracy recepcji (`entry_policy`).
 */
export const single_entry = {
  name: "Wejście jednorazowe",
  description: "Wszystkie strefy i zajęcia grupowe, bez rejestracji.",
  price: { amount: 35, unit: "entry" },
  term: { value: 7, unit: "day" },
  areas: [
    "area-free-weights",
    "area-machines",
    "area-cardio",
    "area-functional",
    "area-cross",
    "area-roll-massage",
  ],
  classes: ["class-cross-training"],
} satisfies SingleEntry<AreaKey, ClassKey>;
