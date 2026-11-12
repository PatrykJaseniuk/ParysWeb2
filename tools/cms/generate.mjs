#!/usr/bin/env node
/**
 * Generator treści CMS → typowany model `0-core`.
 *
 * Źródłem jest `0-content/*.json` (edytowane w Pages CMS). Ten skrypt:
 *   1. waliduje kształt i referencje między encjami,
 *   2. składa tablice z polem `key` w rekordy `Record<klucz, obiekt>`,
 *   3. generuje moduły TS z `satisfies` i typami kluczy.
 *
 * Uruchamianie (z `1-web/`):
 *   npm run cms:sync    # zapisz wygenerowane pliki
 *   npm run cms:check   # tylko sprawdź, czy pliki są aktualne
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const REPO = path.resolve(import.meta.dirname, "../..");
const CONTENT_DIR = path.join(REPO, "0-content");
const CORE_DIR = path.join(REPO, "0-core");
const CHECK = process.argv.includes("--check");

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * Pola opcjonalne w modelu. Pages CMS potrafi zapisać pusty string albo pustą
 * tablicę dla nieużywanego pola — usuwamy je, żeby nie trafiły do modelu jako
 * `""` lub `[]`. Puste pola wymagane zostają i wyłapie je walidacja albo TS.
 */
const OPTIONAL_KEYS = new Set([
  "legal_name", "nip", "regon", "google_place_id", "subtitle", "classes",
  "calendar", "instagram", "specialties", "trainer", "term", "entries",
  "perks", "price", "price_note", "features", "booking", "note", "type",
  "lead_time_hours", "text", "open", "close",
]);

const clean = (value, key = null) => {
  if (Array.isArray(value)) {
    const items = value.map((item) => clean(item)).filter((item) => item !== undefined && item !== null);
    return key !== null && OPTIONAL_KEYS.has(key) && items.length === 0 ? undefined : items;
  }
  if (isRecord(value)) {
    const entries = Object.entries(value).flatMap(([childKey, childValue]) => {
      const cleaned = clean(childValue, childKey);
      return cleaned === undefined || cleaned === null ? [] : [[childKey, cleaned]];
    });
    return key !== null && OPTIONAL_KEYS.has(key) && entries.length === 0
      ? undefined
      : Object.fromEntries(entries);
  }
  if (key !== null && OPTIONAL_KEYS.has(key) && value === "") return undefined;
  return value;
};

const readJson = (file) => clean(JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")));

const duplicateValues = (items, field) => {
  const counts = items.reduce((acc, item) => {
    const value = item[field];
    acc.set(value, (acc.get(value) ?? 0) + 1);
    return acc;
  }, new Map());
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
};

const sortedItems = (items) =>
  items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const orderA = Number.isInteger(a.item.order) ? a.item.order : a.index + 1;
      const orderB = Number.isInteger(b.item.order) ? b.item.order : b.index + 1;
      return orderA - orderB || a.index - b.index;
    })
    .map(({ item }) => item);

const stripMeta = ({ key, order, ...rest }) => rest;

const toRecord = (items) =>
  Object.fromEntries(sortedItems(items).map((item) => [item.key, stripMeta(item)]));

const header = (source) =>
  `// AUTO-GENERATED — nie edytuj ręcznie.\n` +
  `// Źródło: 0-content/${source}\n` +
  `// Generator: tools/cms/generate.mjs (npm run cms:sync w 1-web).\n\n`;

const json = (value) => JSON.stringify(value, null, 2);

const validateItems = (items, { label, keyField, prefix, required = [] }) => {
  if (!Array.isArray(items)) return [`${label}: oczekiwano tablicy`];
  if (items.length === 0) return [`${label}: tablica nie może być pusta`];

  const keyErrors = items.flatMap((item, index) => {
    const key = item?.[keyField];
    if (typeof key !== "string" || key.length === 0) {
      return [`${label}[${index}]: brak pola "${keyField}"`];
    }
    if (prefix && !key.startsWith(prefix)) {
      return [`${label}[${index}]: klucz "${key}" musi zaczynać się od "${prefix}"`];
    }
    if (prefix && !/^[a-z0-9-]+$/.test(key)) {
      return [`${label}[${index}]: klucz "${key}" może zawierać tylko małe litery, cyfry i myślniki`];
    }
    return [];
  });

  const duplicateErrors = duplicateValues(items, keyField).map(
    (value) => `${label}: zduplikowany klucz "${value}"`,
  );

  const orderErrors = items.flatMap((item, index) =>
    item.order === undefined || (Number.isInteger(item.order) && item.order > 0)
      ? []
      : [`${label}[${index}]: "order" musi być dodatnią liczbą całkowitą`],
  );

  const missingErrors = required.flatMap((field) =>
    items.flatMap((item, index) => {
      const value = item[field];
      const missing = value === undefined || value === null || value === "" ||
        (Array.isArray(value) && value.length === 0);
      return missing ? [`${label}[${index}]: brak wymaganego pola "${field}"`] : [];
    }),
  );

  return [...keyErrors, ...duplicateErrors, ...orderErrors, ...missingErrors];
};

const validateReferences = (items, field, allowed, label) =>
  items.flatMap((item) => {
    const values = item[field];
    if (values === undefined) return [];
    if (!Array.isArray(values)) return [`${label} ${item.key ?? "?"}: "${field}" musi być tablicą`];
    return values
      .filter((value) => !allowed.has(value))
      .map((value) => `${label} ${item.key ?? "?"}: nieznana referencja "${field}" → "${value}"`);
  });

const validateScalarReference = (items, field, allowed, label) =>
  items.flatMap((item) => {
    const value = item[field];
    if (value === undefined) return [];
    return allowed.has(value)
      ? []
      : [`${label} ${item.key ?? "?"}: nieznana referencja "${field}" → "${value}"`];
  });

const validateVariantPerks = (accesses, allowedPerks) =>
  accesses.flatMap((access) =>
    (access.variants ?? []).flatMap((variant) =>
      (variant.perks ?? [])
        .filter((perk) => !allowedPerks.has(perk))
        .map((perk) => `cennik ${access.key}/${variant.code}: nieznany dodatek "${perk}"`),
    ),
  );

const validateVariantCodes = (accesses) =>
  accesses.flatMap((access) => {
    if (!Array.isArray(access.variants) || access.variants.length === 0) {
      return [`cennik ${access.key}: brak wariantów`];
    }
    const duplicates = duplicateValues(access.variants, "code").map(
      (code) => `cennik ${access.key}: zduplikowany kod wariantu "${code}"`,
    );
    const codes = access.variants.flatMap((variant, index) =>
      typeof variant.code === "string" && variant.code.length > 0
        ? []
        : [`cennik ${access.key}: wariant[${index}] bez "code"`],
    );
    return [...duplicates, ...codes];
  });

const content = {
  company: readJson("company.json"),
  perks: readJson("perks.json").perks,
  partners: readJson("partners.json").partners,
  areas: readJson("areas.json").areas,
  services: readJson("services.json").services,
  accesses: readJson("accesses.json").accesses,
  singleEntry: readJson("single-entry.json").single_entry,
  classes: readJson("classes.json"),
};

const errors = [
  ...(isRecord(content.company) ? [] : ["company.json: oczekiwano obiektu"]),
  ...validateItems(content.perks, { label: "dodatki", keyField: "code", prefix: null, required: ["label"] }),
  ...validateItems(content.partners, { label: "partnerzy", keyField: "key", prefix: "partner-", required: ["name"] }),
  ...validateItems(content.areas, { label: "strefy", keyField: "key", prefix: "area-", required: ["slug", "name", "description"] }),
  ...validateItems(content.services, { label: "usługi", keyField: "key", prefix: "svc-", required: ["slug", "name", "description"] }),
  ...validateItems(content.accesses, { label: "cennik", keyField: "key", prefix: "acc-", required: ["slug", "name", "areas", "variants"] }),
  ...validateItems(content.classes.trainers, { label: "trenerzy", keyField: "key", prefix: "trainer-", required: ["name", "role"] }),
  ...validateItems(content.classes.classes, { label: "zajęcia", keyField: "key", prefix: "class-", required: ["slug", "name", "summary", "description"] }),
  ...validateVariantCodes(content.accesses),
  ...validateReferences(content.accesses, "areas", new Set(content.areas.map((area) => area.key)), "cennik"),
  ...validateReferences(content.accesses, "classes", new Set(content.classes.classes.map((item) => item.key)), "cennik"),
  ...validateVariantPerks(content.accesses, new Set(content.perks.map((perk) => perk.code))),
  ...validateScalarReference(content.classes.classes, "trainer", new Set(content.classes.trainers.map((item) => item.key)), "zajęcia"),
  ...validateReferences([content.singleEntry], "areas", new Set(content.areas.map((area) => area.key)), "wejście"),
  ...validateReferences([content.singleEntry], "classes", new Set(content.classes.classes.map((item) => item.key)), "wejście"),
  ...validateReferences([content.classes.personal_training], "trainers", new Set(content.classes.trainers.map((item) => item.key)), "trening personalny"),
];

if (errors.length > 0) {
  console.error(`Nie można wygenerować modelu — ${errors.length} błędów:`);
  for (const error of errors) console.error(`  • ${error}`);
  process.exit(1);
}

const files = new Map();

files.set(
  "1-company.ts",
  header("company.json") +
    `import type { Identity } from "./0-types";\n\n` +
    `export const company: Identity = ${json(content.company)};\n`,
);

files.set(
  "1-perks.ts",
  header("perks.json") +
    `export const perks = ${json(
      Object.fromEntries(sortedItems(content.perks).map((perk) => [perk.code, perk.label])),
    )} satisfies Record<string, string>;\n\n` +
    `/** Kody dodatków — jedyny dozwolony sposób odwołania się do wpisu słownika. */\n` +
    `export type PerkKey = keyof typeof perks;\n`,
);

files.set(
  "1-partners.ts",
  header("partners.json") +
    `import type { Partner } from "./0-types";\n\n` +
    `export const partners = ${json(toRecord(content.partners))} satisfies Record<string, Partner>;\n\n` +
    `/** Klucze partnerów — jedyny dozwolony sposób odwołania się do partnera. */\n` +
    `export type PartnerKey = keyof typeof partners;\n`,
);

files.set(
  "2-areas.ts",
  header("areas.json") +
    `import type { Area } from "./0-types";\n` +
    `import type { CalendarKey } from "./1-integrations";\n\n` +
    `export const areas = ${json(toRecord(content.areas))} satisfies Record<string, Area<CalendarKey>>;\n\n` +
    `/** Klucze stref — jedyny dozwolony sposób odwołania się do strefy. */\n` +
    `export type AreaKey = keyof typeof areas;\n`,
);

files.set(
  "2-classes.ts",
  header("classes.json") +
    `import type { GroupClass, PersonalTraining, Trainer } from "./0-types";\n` +
    `import type { CalendarKey } from "./1-integrations";\n\n` +
    `export const trainers = ${json(toRecord(content.classes.trainers))} satisfies Record<string, Trainer>;\n\n` +
    `/** Klucze trenerów — jedyny dozwolony sposób odwołania się do trenera. */\n` +
    `export type TrainerKey = keyof typeof trainers;\n\n` +
    `export const classes = ${json(toRecord(content.classes.classes))} satisfies Record<string, GroupClass<TrainerKey, CalendarKey>>;\n\n` +
    `/** Klucze zajęć — jedyny dozwolony sposób odwołania się do zajęć. */\n` +
    `export type ClassKey = keyof typeof classes;\n\n` +
    `export const personal_training = ${json(content.classes.personal_training)} satisfies PersonalTraining<TrainerKey>;\n`,
);

files.set(
  "2-services.ts",
  header("services.json") +
    `import type { Service } from "./0-types";\n` +
    `import type { CalendarKey } from "./1-integrations";\n\n` +
    `export const services = ${json(toRecord(content.services))} satisfies Record<string, Service<CalendarKey>>;\n\n` +
    `/** Klucze usług — jedyny dozwolony sposób odwołania się do usługi. */\n` +
    `export type ServiceKey = keyof typeof services;\n`,
);

files.set(
  "3-single-entry.ts",
  header("single-entry.json") +
    `import type { SingleEntry } from "./0-types";\n` +
    `import type { AreaKey } from "./2-areas";\n` +
    `import type { ClassKey } from "./2-classes";\n\n` +
    `export const single_entry = ${json(content.singleEntry)} satisfies SingleEntry<AreaKey, ClassKey>;\n`,
);

files.set(
  "3-accesses.ts",
  header("accesses.json") +
    `import type { Access } from "./0-types";\n` +
    `import type { PerkKey } from "./1-perks";\n` +
    `import type { AreaKey } from "./2-areas";\n` +
    `import type { ClassKey } from "./2-classes";\n\n` +
    `export const accesses = ${json(toRecord(content.accesses))} satisfies Record<string, Access<AreaKey, ClassKey, PerkKey>>;\n\n` +
    `/** Klucze karnetów — jedyny dozwolony sposób odwołania się do karnetu. */\n` +
    `export type AccessKey = keyof typeof accesses;\n`,
);

const mismatches = [...files.entries()].flatMap(([name, next]) => {
  const file = path.join(CORE_DIR, name);
  const previous = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  return previous === next ? [] : [{ name, file, previous, next }];
});

if (CHECK) {
  if (mismatches.length > 0) {
    console.error("Model nie jest zsynchronizowany z 0-content:");
    for (const { name } of mismatches) console.error(`  • 0-core/${name}`);
    console.error("Uruchom `npm run cms:sync` w 1-web i zacommituj wynik.");
    process.exit(1);
  }
  console.log(`✓ 0-core jest zsynchronizowany z 0-content (${files.size} plików)`);
} else {
  for (const { file, next } of mismatches) {
    fs.writeFileSync(file, next, "utf8");
    console.log(`✓ zapisano 0-core/${path.basename(file)}`);
  }
  if (mismatches.length === 0) console.log("✓ 0-core już aktualne");
}
