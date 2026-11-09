import type { Membership } from "./0-types";
import type { PerkKey } from "./1-perks";
import type { AreaKey } from "./2-areas";
import type { ClassKey } from "./2-classes";
import type { PartnerKey } from "./1-partners";

/**
 * Karnety i warianty cenowe — rekord klucz → karnet.
 *
 * Klucz jest tożsamością karnetu; nie ma pola `id`. Kolejność kluczy =
 * kolejność kolumn w cenniku (cennik obowiązujący od 1 czerwca 2026 r.).
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
        code: "two_weeks",
        label: "2 tygodnie",
        price: { amount: 110, unit: "term" },
        term: { value: 2, unit: "week" },
      },
      {
        code: "eight_entries",
        label: "8 wejść",
        price: { amount: 120, unit: "term" },
        term: { value: 2, unit: "month" },
        entries: 8,
      },
      {
        code: "monthly",
        label: "Miesięczny",
        price: { amount: 149, unit: "term" },
        term: { value: 1, unit: "month" },
      },
      {
        code: "monthly_student_senior",
        label: "Uczniowski, studencki i seniorski",
        price: { amount: 139, unit: "term" },
        term: { value: 1, unit: "month" },
        perks: ["student-senior-eligibility"],
      },
      {
        code: "yearly",
        label: "Roczny",
        price: { amount: 1490, unit: "term" },
        term: { value: 12, unit: "month" },
        perks: ["two-months-free"],
      },
    ],
  },
  "mem-4-areas-cross": {
    slug: "4-strefy-plus-cross",
    name: "4 strefy + Cross",
    areas: ["area-free-weights", "area-machines", "area-cardio", "area-functional"],
    classes: ["class-cross-training"],
    partners: ["partner-multisport", "partner-medicover", "partner-fitprofit"],
    options: [
      {
        code: "eight_entries",
        label: "8 wejść",
        price: { amount: 160, unit: "term" },
        term: { value: 2, unit: "month" },
        entries: 8,
      },
      {
        code: "monthly",
        label: "Miesięczny",
        price: { amount: 180, unit: "term" },
        term: { value: 1, unit: "month" },
      },
      {
        code: "yearly",
        label: "Roczny",
        price: { amount: 1800, unit: "term" },
        term: { value: 12, unit: "month" },
        perks: ["two-months-free"],
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
        label: "1 wejście",
        price: { amount: 35, unit: "entry" },
        term: { value: 7, unit: "day" },
        entries: 1,
      },
      {
        code: "two_weeks",
        label: "2 tygodnie",
        price: { amount: 130, unit: "term" },
        term: { value: 2, unit: "week" },
      },
      {
        code: "eight_entries",
        label: "8 wejść",
        price: { amount: 150, unit: "term" },
        term: { value: 2, unit: "month" },
        entries: 8,
      },
      {
        code: "monthly",
        label: "Miesięczny",
        price: { amount: 170, unit: "term" },
        term: { value: 1, unit: "month" },
      },
      {
        code: "yearly",
        label: "Roczny",
        price: { amount: 1700, unit: "term" },
        term: { value: 12, unit: "month" },
        perks: ["two-months-free"],
      },
    ],
  },
  "mem-6-areas": {
    slug: "6-stref-plus-zajecia",
    name: "6 stref + Cross",
    areas: [
      "area-free-weights",
      "area-machines",
      "area-cardio",
      "area-functional",
      "area-cross",
      "area-roll-massage",
    ],
    classes: ["class-cross-training"],
    featured: true,
    options: [
      {
        code: "monthly",
        label: "Miesięczny",
        price: { amount: 190, unit: "term" },
        term: { value: 1, unit: "month" },
      },
      {
        code: "yearly",
        label: "Roczny",
        price: { amount: 1800, unit: "term" },
        term: { value: 12, unit: "month" },
        perks: ["two-months-free"],
      },
    ],
  },
} satisfies Record<string, Membership<AreaKey, ClassKey, PartnerKey, PerkKey>>;

/** Klucze karnetów — jedyny dozwolony sposób odwołania się do karnetu. */
export type MembershipKey = keyof typeof memberships;
