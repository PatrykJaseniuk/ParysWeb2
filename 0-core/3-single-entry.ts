// AUTO-GENERATED — nie edytuj ręcznie.
// Źródło: 0-content/single-entry.json
// Generator: tools/cms/generate.mjs (npm run cms:sync w 1-web).

import type { SingleEntry } from "./0-types";
import type { AreaKey } from "./2-areas";
import type { ClassKey } from "./2-classes";

export const single_entry = {
  "name": "Wejście jednorazowe",
  "description": "Wszystkie strefy i zajęcia grupowe, bez rejestracji.",
  "price": {
    "amount": 35,
    "unit": "entry"
  },
  "term": {
    "value": 7,
    "unit": "day"
  },
  "areas": [
    "area-free-weights",
    "area-machines",
    "area-cardio",
    "area-functional",
    "area-cross",
    "area-roll-massage"
  ],
  "classes": [
    "class-cross-training"
  ]
} satisfies SingleEntry<AreaKey, ClassKey>;
