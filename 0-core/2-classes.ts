import type { GroupClass, PersonalTraining, Trainer } from "./0-types";
import type { CalendarKey } from "./1-integrations";

/**
 * Trenerzy, zajęcia grupowe i trening personalny.
 *
 * Trenerzy są rekordem klucz → trener; klucz jest tożsamością, do której
 * odwołują się zajęcia (`class.trainer`) i trening personalny
 * (`personal_training.trainers`) — oba przez `TrainerKey`.
 *
 * Przynależność zajęć do karnetu jest zapisana po stronie karnetu
 * (`membership.classes`), typowanej przez `ClassKey` — tu jej nie duplikujemy.
 */

export const trainers = {
  "trainer-krzysztof": { name: "Krzysztof", role: "Trener osobisty, właściciel" },
  "trainer-lukasz": { name: "Łukasz", role: "Trener osobisty" },
  "trainer-rafal": { name: "Rafał", role: "Trener osobisty" },
  "trainer-andrzej": { name: "Andrzej", role: "Trener osobisty" },
} satisfies Record<string, Trainer>;

/** Klucze trenerów — jedyny dozwolony sposób odwołania się do trenera. */
export type TrainerKey = keyof typeof trainers;

export const classes = {
  "class-cross-training": {
    slug: "cross-trening",
    name: "Cross trening",
    summary: "Gimnastyka, podnoszenie ciężarów i lekkoatletyka w jednym treningu — małe grupy, indywidualne podejście do każdego uczestnika.",
    calendar: "cal-classes",
    description:
      "Trening łączy ćwiczenia gimnastyczne, pracę z ciężarami oraz ćwiczenia lekkoatletyczne. Rozwija siłę, mobilność, koordynację i wydolność. Zajęcia w małych grupach pozwalają dostosować ćwiczenia do możliwości uczestników.",
  },
} satisfies Record<string, GroupClass<TrainerKey, CalendarKey>>;

/** Klucze zajęć — jedyny dozwolony sposób odwołania się do zajęć. */
export type ClassKey = keyof typeof classes;

/**
 * Trening personalny — pozycja katalogu, nie karnet. Jest jeden, więc nie
 * potrzebuje klucza; referencje do trenerów są typowane przez `TrainerKey`.
 */

export const personal_training = {
  name: "Trening personalny",
  description: "Zajęcia indywidualne z trenerem",
  price: { amount: 110, unit: "hour" },
  booking: { channel: "phone", text: "Zapisy w recepcji lub telefonicznie." },
  trainers: ["trainer-krzysztof", "trainer-lukasz", "trainer-rafal", "trainer-andrzej"],
} satisfies PersonalTraining<TrainerKey>;
