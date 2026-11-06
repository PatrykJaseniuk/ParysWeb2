import type { Membership } from "./0-types";
import type { PerkKey } from "./1-perks";
import type { AreaKey } from "./2-areas";
import type { ClassKey } from "./2-classes";
import type { PartnerKey } from "./1-partners";

/**
 * Karnety i warianty cenowe — rekord klucz → karnet.
 *
 * Klucz jest tożsamością karnetu; nie ma pola `id`. Kolejność kluczy =
 * kolejność kolumn w cenniku.
 *
 * Referencje do stref, zajęć i partnerów są typowane ich kluczami
 * (`AreaKey`, `ClassKey`, `PartnerKey`), a dodatki — `PerkKey`. Nieistniejąca
 * referencja to błąd kompilacji. Wariant opisuje się pięcioma polami — `id`
 * wariantu nie istnieje, bo tożsamością wariantu jest `code`. Etykiety
 * dodatków są w `catalog.perks`.
 */

export const memberships = {
  "mem-4-areas": {
    slug: "4-strefy",
    name: "4 strefy",
    areas: ["area-free-weights", "area-machines", "area-cardio", "area-functional"],
    partners: ["partner-multisport", "partner-medicover", "partner-fitprofit"],
    options: [
      {
        code: "entry",
        label: "Jednorazowo",
        price: { amount: 25, unit: "entry" },
        entries: 1,
      },
      {
        code: "two_weeks",
        label: "2 tygodnie",
        price: { amount: 100, unit: "term" },
        term: { value: 2, unit: "week" },
      },
      {
        code: "four_entries",
        label: "4 wejścia",
        price: { amount: 70, unit: "term" },
        term: { value: 2, unit: "month" },
        entries: 4,
      },
      {
        code: "eight_entries",
        label: "8 wejść",
        price: { amount: 110, unit: "term" },
        term: { value: 2, unit: "month" },
        entries: 8,
      },
      {
        code: "ten_entries",
        label: "10 wejść",
        price: { amount: 120, unit: "term" },
        term: { value: 2, unit: "month" },
        entries: 10,
      },
      {
        code: "monthly",
        label: "Miesięczny",
        price: { amount: 139, unit: "term" },
        term: { value: 1, unit: "month" },
        perks: ["freeze"],
      },
      {
        code: "monthly_student_senior",
        label: "Uczniowski i senior",
        price: { amount: 129, unit: "term" },
        term: { value: 1, unit: "month" },
        perks: ["freeze", "student-senior-eligibility"],
      },
      {
        code: "yearly",
        label: "Roczny",
        price: { amount: 1390, unit: "term" },
        term: { value: 12, unit: "month" },
        perks: ["freeze", "two-months-free"],
      },
    ],
  },
  "mem-5-areas": {
    slug: "5-stref",
    name: "5 stref",
    areas: ["area-free-weights", "area-machines", "area-cardio", "area-functional", "area-cross"],
    options: [
      {
        code: "entry",
        label: "Jednorazowo",
        price: { amount: 35, unit: "entry" },
        entries: 1,
      },
      {
        code: "ten_entries",
        label: "10 wejść",
        price: { amount: 150, unit: "term" },
        term: { value: 2, unit: "month" },
        entries: 10,
      },
      {
        code: "monthly",
        label: "Miesięczny",
        price: { amount: 160, unit: "term" },
        term: { value: 1, unit: "month" },
        perks: ["freeze"],
      },
      {
        code: "yearly",
        label: "Roczny",
        price: { amount: 1600, unit: "term" },
        term: { value: 12, unit: "month" },
        perks: ["freeze", "two-months-free"],
      },
    ],
  },
  "mem-6-areas": {
    slug: "6-stref-plus-zajecia",
    name: "6 stref + zajęcia grupowe",
    subtitle: "6 stref + Cross trening i boks",
    areas: [
      "area-free-weights",
      "area-machines",
      "area-cardio",
      "area-functional",
      "area-cross",
      "area-roll-massage",
    ],
    classes: ["class-cross-training", "class-boxing"],
    featured: true,
    options: [
      {
        code: "entry",
        label: "Jednorazowo",
        price: { amount: 35, unit: "entry" },
        entries: 1,
      },
      {
        code: "ten_entries",
        label: "10 wejść",
        price: { amount: 170, unit: "term" },
        term: { value: 2, unit: "month" },
        entries: 10,
      },
      {
        code: "monthly",
        label: "Miesięczny",
        price: { amount: 180, unit: "term" },
        term: { value: 1, unit: "month" },
        perks: ["freeze"],
      },
    ],
  },
  "mem-4-areas-cross": {
    slug: "4-strefy-plus-cross",
    name: "4 strefy + cross",
    subtitle: "4 strefy + zajęcia Cross trening",
    areas: ["area-free-weights", "area-machines", "area-cardio", "area-functional"],
    classes: ["class-cross-training"],
    partners: ["partner-multisport", "partner-medicover", "partner-fitprofit"],
    options: [
      {
        code: "entry",
        label: "Jednorazowo",
        price: { amount: 35, unit: "entry" },
        entries: 1,
      },
      {
        code: "two_weeks",
        label: "2 tygodnie",
        price: { amount: 120, unit: "term" },
        term: { value: 2, unit: "week" },
      },
      {
        code: "ten_entries",
        label: "10 wejść",
        price: { amount: 150, unit: "term" },
        term: { value: 2, unit: "month" },
        entries: 10,
      },
      {
        code: "monthly",
        label: "Miesięczny",
        price: { amount: 160, unit: "term" },
        term: { value: 1, unit: "month" },
        perks: ["freeze"],
      },
      {
        code: "yearly",
        label: "Roczny",
        price: { amount: 1600, unit: "term" },
        term: { value: 12, unit: "month" },
        perks: ["freeze", "two-months-free"],
      },
    ],
  },
} satisfies Record<string, Membership<AreaKey, ClassKey, PartnerKey, PerkKey>>;

/** Klucze karnetów — jedyny dozwolony sposób odwołania się do karnetu. */
export type MembershipKey = keyof typeof memberships;
