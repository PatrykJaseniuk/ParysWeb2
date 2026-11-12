// AUTO-GENERATED — nie edytuj ręcznie.
// Źródło: 0-content/areas.json
// Generator: tools/cms/generate.mjs (npm run cms:sync w 1-web).

import type { Area } from "./0-types";
import type { CalendarKey } from "./1-integrations";

export const areas = {
  "area-free-weights": {
    "slug": "wolne-ciezary",
    "name": "Wolne ciężary",
    "short": "Sztangi olimpijskie, hantle, racki, suwnice",
    "description": "Strefa do treningu z wolnymi ciężarami. Znajdziesz tu sztangi olimpijskie i łamane, hantle, trap bar, ławki oraz racki ze stojakami do przysiadów i martwych ciągów. Do dyspozycji są również maszyny na talerze, suwnice Smitha i hack squat. Możesz wykonać zarówno podstawowe ćwiczenia wielostawowe, jak i rozbudowany trening poszczególnych partii mięśniowych."
  },
  "area-machines": {
    "slug": "maszyny-ze-stosem",
    "name": "Maszyny ze stosem",
    "short": "Dwie sale z maszynami do treningu różnych partii",
    "description": "Dwie sale z maszynami ze stosem, podzielone tematycznie. Maszyny umożliwiają trening różnych partii mięśniowych w kilku wariantach ruchu oraz precyzyjną regulację obciążenia."
  },
  "area-cardio": {
    "slug": "cardio",
    "name": "Cardio",
    "short": "Bieżnie, orbitreki, wioślarze, narciarze",
    "description": "Strefa do rozgrzewki i treningu wytrzymałościowego. Do dyspozycji są bieżnie, orbitreki, stepy, wioślarze, narciarze oraz rowerki poziome, pionowe i hybrydowe. Różne rodzaje urządzeń pozwalają dopasować trening do preferowanej formy aktywności."
  },
  "area-functional": {
    "slug": "sala-funkcjonalna",
    "name": "Sala funkcjonalna",
    "short": "Rozgrzewka i trening funkcjonalny",
    "description": "Przestrzeń do rozgrzewki i treningu z masą własnego ciała. Do dyspozycji są drabinki gimnastyczne, materace i przybory treningowe."
  },
  "area-cross": {
    "slug": "sala-cross",
    "name": "Sala cross",
    "short": "Trening cross, kalistenika i sztuki walki",
    "calendar": "cal-room-availability",
    "description": "Sala o wysokości 7 m do treningu cross, kalisteniki i sztuk walki. Znajdziesz tu konstrukcję z drążkami, poręczami, kółkami i taśmami TRX, a także rowery airbike, narciarze, odważniki kettlebell, piłki lekarskie, skrzynie i gumy oporowe. Gumowana podłoga oraz rozkładana mata umożliwiają trening funkcjonalny i ćwiczenia sztuk walki."
  },
  "area-roll-massage": {
    "slug": "rollmasaz-platforma-wibrujaca",
    "name": "Rollmasaż i platforma wibrująca",
    "short": "Rollmasaż i platforma wibrująca",
    "calendar": "cal-rollmassage",
    "description": "Strefa z urządzeniem do rollmasażu i platformą wibrującą. Rollmasaż polega na masażu ciała za pomocą obracającego się bębna z drewnianymi rolkami. Platforma generuje drgania podczas wykonywania ćwiczeń."
  }
} satisfies Record<string, Area<CalendarKey>>;

/** Klucze stref — jedyny dozwolony sposób odwołania się do strefy. */
export type AreaKey = keyof typeof areas;
