// AUTO-GENERATED — nie edytuj ręcznie.
// Źródło: 0-content/accesses.json
// Generator: tools/cms/generate.mjs (npm run cms:sync w 1-web).

import type { Access } from "./0-types";
import type { PerkKey } from "./1-perks";
import type { AreaKey } from "./2-areas";
import type { ClassKey } from "./2-classes";

export const accesses = {
  "acc-4-areas": {
    "slug": "4-strefy",
    "name": "4 strefy",
    "featured": false,
    "areas": [
      "area-free-weights",
      "area-machines",
      "area-cardio",
      "area-functional"
    ],
    "variants": [
      {
        "code": "two_weeks",
        "label": "2 tygodnie",
        "price": {
          "amount": 110,
          "unit": "term"
        },
        "term": {
          "value": 2,
          "unit": "week"
        }
      },
      {
        "code": "eight_entries",
        "label": "8 wejść",
        "price": {
          "amount": 120,
          "unit": "term"
        },
        "term": {
          "value": 2,
          "unit": "month"
        },
        "entries": 8
      },
      {
        "code": "monthly",
        "label": "Miesięczny",
        "price": {
          "amount": 149,
          "unit": "term"
        },
        "term": {
          "value": 1,
          "unit": "month"
        }
      },
      {
        "code": "monthly_student_retiree",
        "label": "Uczniowski, studencki i emerycki",
        "price": {
          "amount": 139,
          "unit": "term"
        },
        "term": {
          "value": 1,
          "unit": "month"
        },
        "perks": [
          "student-retiree-eligibility"
        ]
      },
      {
        "code": "yearly",
        "label": "Roczny",
        "price": {
          "amount": 1490,
          "unit": "term"
        },
        "term": {
          "value": 12,
          "unit": "month"
        },
        "perks": [
          "two-months-free"
        ]
      }
    ]
  },
  "acc-4-areas-cross": {
    "slug": "4-strefy-plus-cross",
    "name": "4 strefy + zajęcia grupowe",
    "featured": false,
    "areas": [
      "area-free-weights",
      "area-machines",
      "area-cardio",
      "area-functional"
    ],
    "classes": [
      "class-cross-training"
    ],
    "variants": [
      {
        "code": "eight_entries",
        "label": "8 wejść",
        "price": {
          "amount": 160,
          "unit": "term"
        },
        "term": {
          "value": 2,
          "unit": "month"
        },
        "entries": 8
      },
      {
        "code": "monthly",
        "label": "Miesięczny",
        "price": {
          "amount": 180,
          "unit": "term"
        },
        "term": {
          "value": 1,
          "unit": "month"
        }
      },
      {
        "code": "yearly",
        "label": "Roczny",
        "price": {
          "amount": 1800,
          "unit": "term"
        },
        "term": {
          "value": 12,
          "unit": "month"
        },
        "perks": [
          "two-months-free"
        ]
      }
    ]
  },
  "acc-5-areas": {
    "slug": "5-stref",
    "name": "5 stref",
    "featured": false,
    "areas": [
      "area-free-weights",
      "area-machines",
      "area-cardio",
      "area-functional",
      "area-cross"
    ],
    "variants": [
      {
        "code": "two_weeks",
        "label": "2 tygodnie",
        "price": {
          "amount": 130,
          "unit": "term"
        },
        "term": {
          "value": 2,
          "unit": "week"
        }
      },
      {
        "code": "eight_entries",
        "label": "8 wejść",
        "price": {
          "amount": 150,
          "unit": "term"
        },
        "term": {
          "value": 2,
          "unit": "month"
        },
        "entries": 8
      },
      {
        "code": "monthly",
        "label": "Miesięczny",
        "price": {
          "amount": 170,
          "unit": "term"
        },
        "term": {
          "value": 1,
          "unit": "month"
        }
      },
      {
        "code": "yearly",
        "label": "Roczny",
        "price": {
          "amount": 1700,
          "unit": "term"
        },
        "term": {
          "value": 12,
          "unit": "month"
        },
        "perks": [
          "two-months-free"
        ]
      }
    ]
  },
  "acc-6-areas": {
    "slug": "6-stref-plus-zajecia",
    "name": "6 stref + zajęcia grupowe",
    "featured": true,
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
    ],
    "variants": [
      {
        "code": "monthly",
        "label": "Miesięczny",
        "price": {
          "amount": 190,
          "unit": "term"
        },
        "term": {
          "value": 1,
          "unit": "month"
        }
      },
      {
        "code": "yearly",
        "label": "Roczny",
        "price": {
          "amount": 1800,
          "unit": "term"
        },
        "term": {
          "value": 12,
          "unit": "month"
        },
        "perks": [
          "two-months-free"
        ]
      }
    ]
  },
  "acc-roll-massage": {
    "slug": "rollmasaz",
    "name": "Rollmasaż",
    "subtitle": "Tylko rollmasaż",
    "featured": false,
    "areas": [
      "area-roll-massage"
    ],
    "variants": [
      {
        "code": "eight_entries",
        "label": "8 wejść",
        "price": {
          "amount": 100,
          "unit": "term"
        },
        "entries": 8
      }
    ]
  }
} satisfies Record<string, Access<AreaKey, ClassKey, PerkKey>>;

/** Klucze karnetów — jedyny dozwolony sposób odwołania się do karnetu. */
export type AccessKey = keyof typeof accesses;
