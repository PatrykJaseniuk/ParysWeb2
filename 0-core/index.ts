import type { BusinessModel } from "./0-types";
import { meta, pricing_policy } from "./1-meta";
import { entry_policy } from "./1-access";
import { company } from "./1-company";
import { brand } from "./2-brand";
import { areas } from "./2-areas";
import { memberships } from "./3-memberships";
import { classes, trainers, personal_training } from "./2-classes";
import { single_entry } from "./3-single-entry";
import { services } from "./2-services";
import { partners, promotions } from "./1-partners";
import { integrations } from "./1-integrations";
import { perks } from "./1-perks";

/**
 * Rdzeń biznesu — fakty o firmie, bez ani jednej referencji do pliku graficznego.
 *
 * Moduły są rozdzielone tematycznie, a numer w nazwie pliku mówi, w której
 * warstwie zależności leży dany moduł: plik może importować tylko pliki
 * z niższym numerem (równy numer = ten sam poziom, importy zabronione).
 *
 *   0-types.ts          kontrakt kształtu — korzeń, zero importów
 *   1-perks.ts          słownik dodatków (eksportuje PerkKey)
 *   1-meta.ts           wersja, waluta, strefa czasowa, zasady cennika
 *   1-access.ts         karta klubowa i zasady wejścia
 *   1-company.ts        tożsamość, kontakt, godziny, lokalizacja
 *   1-partners.ts       partnerzy i promocje
 *   1-integrations.ts   kalendarze i analityka
 *   2-brand.ts          marka: nazwa, logo, paleta, typografia, głos, obraz
 *   2-areas.ts          6 stref treningowych
 *   2-classes.ts        Cross, trenerzy, trening personalny
 *   3-single-entry.ts   samodzielne wejście jednorazowe
 *   2-services.ts       usługi dodatkowe
 *   3-memberships.ts    5 karnetów i 15 wariantów cenowych
 *   3-single-entry.ts   wejście jednorazowe poza karnetami
 *   index.ts            kompozycja — najwyższa warstwa, importuje wszystko
 *
 * Tożsamość encji jest kluczem rekordu, nie polem `id`. Referencje używają
 * typów kluczy (`AreaKey`, `ClassKey`, …), więc nieistniejąca referencja to
 * błąd kompilacji, a nie błąd runtime.
 *
 * Relacje są zapisane dokładnie raz. Przynależność zajęć do karnetu siedzi
 * w `membership.classes`, a jej stronę odwrotną (`class.included_in`)
 * wyprowadza adapter. Programy partnerskie opłacają wejścia jednorazowe,
 * więc nie mają relacji z karnetem.
 *
 * Kolejność kluczy w rekordach = kolejność w UI; konsumenci iterują przez
 * `Object.entries` / `Object.values`.
 */
export const business = {
  model_version: "16.0.0",
  meta,
  identity: company,
  brand,
  pricing_policy,
  entry_policy,
  catalog: {
    single_entry,
    areas,
    memberships,
    classes,
    trainers,
    personal_training,
    services,
    partners,
    promotions,
    perks,
  },
  integrations,
} satisfies BusinessModel;

export type { AreaKey } from "./2-areas";
export type { MembershipKey } from "./3-memberships";
export type { ClassKey, TrainerKey } from "./2-classes";
export type { ServiceKey } from "./2-services";
export type { PartnerKey, PromotionKey } from "./1-partners";
export type { CalendarKey } from "./1-integrations";
export type { PerkKey } from "./1-perks";
