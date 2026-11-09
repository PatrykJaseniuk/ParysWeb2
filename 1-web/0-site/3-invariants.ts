/**
 * Reguły spójności modelu — to, co dokłada warstwa strony.
 *
 * Rdzeń (`0-core`) pilnuje referencji i unikalności na poziomie typów, więc
 * tutaj zostają rzeczy, które rdzeń widzieć nie może: powiązania encji
 * z plikami, istnienie assetów, zgodność wersji, unikalność ścieżek
 * i bramka publikacji.
 *
 * Wywoływany raz przy imporcie adaptera — niespójny model zatrzymuje build.
 */

import type { BusinessModel } from "../../0-core/0-types";
import type { QualityModel, SiteModel } from "./0-types";
import { business } from "../../0-core";
import { site } from "./1-site";
import { quality } from "./2-quality";

const KNOWN_HEADS = new Set([
  "brand",
  "identity",
  "catalog",
  "pricing_policy",
  "legal",
  "integrations",
  "design",
  "media",
  "site",
]);

export function assertModelIntegrity(): void {
  const b: BusinessModel = business;
  const s: SiteModel = site;
  const q: QualityModel = quality;

  const errors: string[] = [];
  const warnings: string[] = [];

  /** Klucze encji katalogu — warstwa strony wiąże po nich `media.bindings`. */
  const entityIds = new Set<string>();
  for (const collection of [
    b.catalog.areas,
    b.catalog.memberships,
    b.catalog.classes,
    b.catalog.trainers,
    b.catalog.services,
    b.catalog.partners,
    b.catalog.promotions,
  ]) {
    for (const key of Object.keys(collection)) entityIds.add(key);
  }

  /* --- powiązania encja → plik --- */
  for (const [id, roles] of Object.entries(s.media.bindings)) {
    if (!entityIds.has(id)) errors.push(`media.bindings: nieznana encja "${id}"`);
    for (const [role, assetId] of Object.entries(roles)) {
      if (assetId === null || assetId === undefined) continue;
      if (!s.media.assets[assetId]) {
        errors.push(`media.bindings.${id}.${role}: nieznany asset "${assetId}"`);
      }
    }
  }

  for (const id of Object.keys(b.catalog.areas)) {
    if (!s.media.bindings[id]?.photo) {
      warnings.push(`area ${id}: brak zdjęcia (fallback: ${s.media.fallbacks.area ?? "brak"})`);
    }
  }
  for (const id of Object.keys(b.catalog.classes)) {
    if (!s.media.bindings[id]?.photo) {
      warnings.push(`class ${id}: brak zdjęcia (fallback: ${s.media.fallbacks.class ?? "brak"})`);
    }
  }

  /* --- assety --- */
  const pageAssets: [string, string | null][] = [
    ["design.logo.mark", s.design.logo.mark],
    ["design.logo.full", s.design.logo.full],
    ["design.logo.motto", s.design.logo.motto],
    ["media.hero", s.media.hero],
    ["site.icons.favicon", s.site.icons.favicon],
    ["site.icons.apple_touch", s.site.icons.apple_touch],
    ["site.seo_defaults.og_image", s.site.seo_defaults.og_image],
  ];
  const usedAssets = new Set<string>();
  for (const [where, assetId] of pageAssets) {
    if (!assetId) continue;
    usedAssets.add(assetId);
    if (!s.media.assets[assetId]) errors.push(`${where}: nieznany asset "${assetId}"`);
  }
  for (const roles of Object.values(s.media.bindings)) {
    for (const assetId of Object.values(roles)) {
      if (assetId) usedAssets.add(assetId);
    }
  }
  for (const [id, asset] of Object.entries(s.media.assets)) {
    if (!usedAssets.has(id)) warnings.push(`asset ${id}: nigdzie nie użyty`);
    if (["image", "logo"].includes(asset.kind) && !asset.alt && !asset.roles.includes("favicon")) {
      errors.push(`asset ${id}: brak alt`);
    }
  }

  /* --- wersje --- */
  if (s.requires.business !== b.model_version) {
    errors.push(`site.requires.business = ${s.requires.business}, a business.model_version = ${b.model_version}`);
  }
  if (q.requires.business !== b.model_version) {
    errors.push(`quality.requires.business = ${q.requires.business}, a business.model_version = ${b.model_version}`);
  }
  if (q.requires.site !== s.site_version) {
    errors.push(`quality.requires.site = ${q.requires.site}, a site.site_version = ${s.site_version}`);
  }

  /* --- strony --- */
  const paths = new Set<string>();
  for (const page of s.site.pages) {
    if (paths.has(page.path)) errors.push(`site.pages: zduplikowana ścieżka "${page.path}"`);
    paths.add(page.path);
    const sectionIds = new Set<string>();
    for (const section of page.sections) {
      if (sectionIds.has(section.id)) {
        errors.push(`page ${page.id}: zduplikowana sekcja "${section.id}"`);
      }
      sectionIds.add(section.id);
      for (const ref of section.content_refs) {
        const head = ref.split(".")[0];
        if (!KNOWN_HEADS.has(head)) {
          errors.push(`page ${page.id}/${section.id}: nieznana ścieżka "${ref}"`);
        }
      }
    }
  }

  /* --- ścieżki w quality --- */
  for (const question of q.questions) {
    for (const path of question.affects) {
      if (!KNOWN_HEADS.has(path.split(".")[0])) {
        errors.push(`question ${question.id}: nieznana ścieżka "${path}"`);
      }
    }
  }
  for (const unknown of q.unknowns) {
    if (!KNOWN_HEADS.has(unknown.path.split(".")[0])) {
      errors.push(`unknown: nieznana ścieżka "${unknown.path}"`);
    }
  }

  /* --- bramka publikacji --- */
  const blockers = q.questions.filter((x) => x.blocks_publish);
  const blockerIssues = q.issues.filter((x) => x.severity === "blocker");
  if (q.publishable && (blockers.length > 0 || blockerIssues.length > 0)) {
    errors.push(
      `quality.publishable = true, mimo ${blockers.length} blokujących pytań i ${blockerIssues.length} blokerów`,
    );
  }
  if (q.publishable && !b.pricing_policy.prices_confirmed_by_owner) {
    errors.push("quality.publishable = true, a ceny nie są potwierdzone przez właściciela");
  }
  if (!q.publishable && blockers.length === 0 && blockerIssues.length === 0) {
    warnings.push("publishable = false, ale nie ma blokerów — publikacja czeka na decyzję człowieka");
  }

  /* --- raport --- */
  for (const w of warnings) console.warn(`[model] ⚠ ${w}`);

  if (errors.length > 0) {
    throw new Error(
      `Model nie spełnia kontraktu (${errors.length} błędów):\n  • ${errors.join("\n  • ")}`,
    );
  }

  const options = Object.values(b.catalog.memberships).reduce((n, m) => n + m.options.length, 0);
  console.log(
    `[model] ${Object.keys(b.catalog.areas).length} stref · ` +
    `${Object.keys(b.catalog.memberships).length} karnetów · ` +
    `${options} wariantów · ${Object.keys(b.catalog.classes).length} zajęć · ` +
    `${Object.keys(b.catalog.trainers).length} trenerów · ` +
    `${Object.keys(b.catalog.services).length} usług · ` +
    `${s.site.pages.length} stron · ${Object.keys(s.media.assets).length} assetów · ` +
    `${Object.keys(s.media.bindings).length} powiązań`,
  );
  console.log(
    `[model] wersje: business ${b.model_version} · site ${s.site_version} · quality ${q.quality_version}`,
  );
  console.log(
    `[model] pytania: ${q.questions.length} (blokujących: ${blockers.length}) · publikowalne: ${q.publishable}` +
    (blockers.length > 0 ? ` · blokują: ${blockers.map((x) => x.id).join(", ")}` : ""),
  );
}
