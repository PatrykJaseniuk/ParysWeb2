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
  "trainer-andrzej": { name: "Andrzej", role: "Trener boksu" },
} satisfies Record<string, Trainer>;

/** Klucze trenerów — jedyny dozwolony sposób odwołania się do trenera. */
export type TrainerKey = keyof typeof trainers;

export const classes = {
  "class-cross-training": {
    slug: "cross-trening",
    name: "Cross trening",
    summary: "Gimnastyka, podnoszenie ciężarów, boks i lekkoatletyka w jednym treningu — małe grupy, indywidualne podejście do każdego uczestnika.",
    calendar: "cal-classes",
    description:
      "Trening, który charakteryzuje się wszechstronnością ćwiczeń z różnych dyscyplin sportowych takich jak: gimnastyka, podnoszenie ciężarów, boks, lekkoatletka. Na treningu kształtujemy wszystkie cechy motoryczne, poprawiamy wzorce ruchowe, mobilizujemy, aktywizujemy mięśnie, oraz poprawiamy wydolność sercowo-naczyniową organizmu. Treningi prowadzone są w małych grupach, co pozwala na indywidualne podejście do każdego uczestnika.",
  },
  "class-boxing": {
    slug: "boks",
    name: "Boks",
    summary: "Technika uderzeń, defensywa i poruszanie się po ringu. Rozgrzewka, ćwiczenia techniczne i sparingi w parach — od podstaw.",
    calendar: "cal-classes",
    trainer: "trainer-andrzej",
    description:
      "Zajęcia bokserskie w naszej siłowni to świetna okazja, aby nauczyć się podstaw tego ekscytującego sportu walki. Poprowadzi je doświadczony trener, który wprowadzi uczestników w tajniki prawidłowej techniki uderzeń, defensywy i przemieszczania się po ringu. Zajęcia składają się z rozgrzewki, rozmaitych ćwiczeń technicznych, oraz sparingów w parach. Niezależnie od poziomu zaawansowania, każdy może wziąć udział i podnieść swoją kondycję fizyczną, siłę i koordynację. Zapraszamy wszystkich chętnych do dołączenia do naszej grupy bokserskiej!",
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
