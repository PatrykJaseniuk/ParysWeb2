import type { Area } from "./0-types";
import type { CalendarKey } from "./1-integrations";

/**
 * Strefy treningowe — rekord klucz → strefa.
 *
 * Klucz jest tożsamością strefy: nie ma pola `id`, a inne obiekty odnoszą się
 * do strefy właśnie tym kluczem (`membership.areas`, typowane przez `AreaKey`).
 * Kolejność kluczy = kolejność w UI (nie ma pola `order`).
 */

export const areas = {
  "area-free-weights": {
    slug: "wolne-ciezary",
    name: "Wolne ciężary",
    short: "Sztangi olimpijskie, hantle, racki, suwnice",
    description:
      "Podstawowa sala do ćwiczeń jest wyposażona w maszyny na talerze, takie jak hamery o zmiennej geometrii ruchu, przeznaczone na wszystkie partie mięśniowe. Znajdziemy tu sztangi olimpijskie, łamane, kratownice, sztangielki, trap bar hex. Sala oferuje również szereg ławeczek skośnych, poziomych i ławeczek ze stojakami do wyciskania skośnego i poziomego. Posiadamy także suwnice Schmita, hack squat do przysiadów wypychających, oraz konstrukcje Rack z drążkami, poręczami i stojakami do przysiadów i martwych ciągów. Strefa ta, ze swoją bogatą różnorodnością maszyn, ciężarów i gryfów, jest w stanie zaskoczyć nawet najbardziej wymagające osoby.",
  },
  "area-machines": {
    slug: "maszyny-ze-stosem",
    name: "Maszyny ze stosem",
    short: "Dwie sale, maszyny na wszystkie partie",
    description:
      "Strefa ta posiada dwie sale, podzielone tematycznie, z bogatą ofertą maszyn z regulacją ciężaru na stosy. Dostępność maszyn pozwala pobudzić wszystkie partie mięśniowe w różnych wariantach ruchowych oraz płaszczyznach wykonywanych ćwiczeń.",
  },
  "area-cardio": {
    slug: "cardio",
    name: "Cardio",
    short: "Bieżnie, orbitreki, wioślarze, narciarze",
    description:
      "Urządzenia do ćwiczeń aerobowych pozwalają rozgrzać termicznie nasze ciało, wzmocnić układ sercowo-naczyniowy oraz przyspieszyć metabolizm, mobilizując spalanie tkanki tłuszczowej. Bogactwo maszyn cardio, takich jak bieżnie, orbitreki, stepy, wioślarze, narciarze, rowerki poziome, pionowe i hybrydowe, umożliwia wykonanie najbardziej zaawansowanego treningu wydolnościowego.",
  },
  "area-functional": {
    slug: "sala-funkcjonalna",
    name: "Sala funkcjonalna",
    short: "Rozgrzewka i trening funkcjonalny",
    description:
      "Przestrzeń do rozgrzewki i pracy z własnym ciałem: drabinki gimnastyczne, materace i przybory treningowe. Dobrze łączy się z sąsiednią salą cross, więc rozgrzewkę można płynnie przejść w trening siłowy.",
  },
  "area-cross": {
    slug: "sala-cross",
    name: "Sala cross",
    short: "Crossfit, kalistenika, sztuki walki",
    calendar: "cal-room-availability",
    description:
      "Hala przystosowana do ćwiczeń z własnym ciałem, do crossfitu, kalisteniki, oraz sztuk walki. Wysoka na 7m sala posiada kratownicę z linami do podciągania, taśmami do ewolucji powietrznych, kółkami gimnastycznymi. Wyposażona jest w długą konstrukcję RAK, na której zainstalowane są drążki, poręcze, kółka, taśmy TRX, gumy do podciągania, rękawy do ćwiczeń na brzuch, uchwyty do przysiadów, poręcze gimnastyczne. Sala posiada podłoże gumowane; do dyspozycji są materace gimnastyczne, kalimaty oraz rozkładana mata do ćwiczeń sztuk walki. Na wyposażeniu mamy łapy bokserskie, osłony, tarcze bokserskie, skakanki, gumy oporowe, taśmy oporowe, rowery airbike, narciarze, piłki lekarskie, stepy, skrzynie, kettelbelle, talerze, sztangi. Bogactwo przyrządów tej sali daje możliwość przeprowadzenia każdego treningu wytrzymałościowo-siłowego, jak również specjalistycznego.",
  },
  "area-roll-massage": {
    slug: "rollmasaz-platforma-wibrujaca",
    name: "Rollmasaż i platforma wibrująca",
    short: "Rollmasaż i platforma wibrująca",
    calendar: "cal-rollmassage",
    description:
      "Popularnie nazywana rolką, to bęben z rolek drewnianych, który obracając się wykonuje ruch masujący ciało. Bęben, obracając się, drenuje ciało, poprawiając ukrwienie, zwiększając przepływ krwi i limfy. Urządzenie to poprawia przemianę materii, usuwa wodę zbieraną podskórną, likwiduje nierówności skórne, takie jak cellulit, i ma istotny wpływ na spalanie tkanki tłuszczowej. Platforma wibrująca medyczna ma bardzo szerokie zastosowanie. Jest to biomechaniczna stymulacja mięśniowa, która powoduje pracę mięśni, rozgrzewając je, zwiększa ukrwienie, przyspiesza metabolizm i powoduje drenaż limfatyczny ciała. Jest to bardzo dobra metoda fizykalna do treningów osób z problemami narządu ruchu. Dla sportowców i osób aktywnych jest doskonałym uzupełnieniem treningu, poprzez regulację częstotliwości drgań, wywołując pracę mięśni głębokich i powierzchniowych.",
  },
} satisfies Record<string, Area<CalendarKey>>;

/** Klucze stref — jedyny dozwolony sposób odwołania się do strefy. */
export type AreaKey = keyof typeof areas;
