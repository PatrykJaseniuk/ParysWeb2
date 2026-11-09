import type { GroupClass, PersonalTraining, Trainer } from "./0-types";
import type { CalendarKey } from "./1-integrations";

/**
 * Trenerzy, Cross i trening personalny.
 *
 * Trenerzy są rekordem klucz → trener; klucz jest tożsamością, do której
 * odwołują się zajęcia (`class.trainer`) i trening personalny
 * (`personal_training.trainers`) — oba przez `TrainerKey`.
 *
 * Przynależność Cross do karnetu jest zapisana po stronie karnetu
 * (`membership.classes`), typowanej przez `ClassKey` — tu jej nie duplikujemy.
 */

export const trainers = {
  "trainer-krzysztof": {
    name: "Krzysztof",
    role: "Trener osobisty, właściciel",
    instagram: "https://www.instagram.com/krzysztofjaseniuk/",
  },
  "trainer-lukasz": {
    name: "Łukasz",
    role: "Trener osobisty",
    instagram: "https://www.instagram.com/kowalski_trener/",
  },
  "trainer-rafal": {
    name: "Rafał",
    role: "Trener osobisty",
    instagram: "https://www.instagram.com/rafal_trenuje94/",
  },
  "trainer-cezary": {
    name: "Cezary",
    role: "Trener osobisty",
    instagram: "https://www.instagram.com/trener_cezary/",
  },
  "trainer-artur": {
    name: "Artur",
    role: "Trener boksu",
    instagram: "https://www.instagram.com/yanov.artur_boks/",
  },
} satisfies Record<string, Trainer>;

/** Klucze trenerów — jedyny dozwolony sposób odwołania się do trenera. */
export type TrainerKey = keyof typeof trainers;

export const classes = {
  "class-cross-training": {
    slug: "cross-trening",
    name: "Cross",
    summary: "Cross łączy gimnastykę, podnoszenie ciężarów i lekkoatletykę — małe grupy, indywidualne podejście do każdego uczestnika.",
    calendar: "cal-classes",
    description:
      "Cross łączy ćwiczenia gimnastyczne, pracę z ciężarami oraz ćwiczenia lekkoatletyczne. Rozwija siłę, mobilność, koordynację i wydolność. Zajęcia w małych grupach pozwalają dostosować ćwiczenia do możliwości uczestników.",
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
  booking: { channel: "phone", text: "Zapisy w recepcji lub telefonicznie." },
  trainers: [
    "trainer-krzysztof",
    "trainer-lukasz",
    "trainer-rafal",
    "trainer-cezary",
    "trainer-artur",
  ],
} satisfies PersonalTraining<TrainerKey>;
