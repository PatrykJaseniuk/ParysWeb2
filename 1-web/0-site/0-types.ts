/**
 * Typy strony — kontrakt kształtu warstwy budowy i gotowości publikacji.
 *
 * Nic tutaj nie opisuje firmy: fakty i marka mieszkają w `0-core/0-types.ts`.
 */

export type ContentStatus = "complete" | "draft" | "missing" | "unknown" | "not_applicable";

/** Role plików przypisanych do encji w `site.media.bindings`. */
export interface MediaRoles {
  photo?: string | null;
  video?: string | null;
  poster?: string | null;
  logo?: string | null;
  image?: string | null;
}

/* ------------------------------------------------------------------ *
 *  site.ts
 * ------------------------------------------------------------------ */
export interface Design {
  direction: string;
  /** Skala i siatka strony — nie marka, tylko ten serwis. */
  scale: { h1: string; h2: string; h3: string };
  spacing: { section_y: string; container_max_px: number };
  radius: { sm: string; md: string };
  /**
   * Mapowanie wariantów logo na pliki z `media.assets`.
   * Reguły użycia, pole ochronne i zakazy są w `brand.ts`.
   */
  logo: { mark: string; full: string | null; motto: string | null };
}

export interface Asset {
  kind: "image" | "video" | "icon" | "logo" | "document";
  source: string | null;
  served: string | null;
  mime: string;
  width: number | null;
  height: number | null;
  duration_s: number | null;
  alt: string;
  roles: string[];
  credit: string | null;
  variants: { width: number; path: string; format?: string }[];
  status: ContentStatus;
}

export interface MediaCatalog {
  assets: Record<string, Asset>;
  /** Klucz = klucz encji z `0-core`. Jedyny łącznik między biznesem a plikami. */
  bindings: Record<string, MediaRoles>;
  hero: string | null;
  fallbacks: {
    area?: string;
    class?: string;
    trainer?: string;
    partner?: string;
  };
}

export interface Link {
  label: string;
  href: string;
  kind?: "link" | "phone" | "email";
}

export type SectionType =
  | "page_header"
  | "hero"
  | "highlights"
  | "area_grid"
  | "area_detail"
  | "pricing_matrix"
  | "scope_table"
  | "class_list"
  | "class_detail"
  | "trainer_list"
  | "service_list"
  | "partner_list"
  | "contact_block"
  | "calendar_embed"
  | "map_embed"
  | "faq"
  | "cta"
  | "prose"
  | "legal_placeholder"
  | "error_page";

export interface PageSection {
  id: string;
  type: SectionType;
  required: boolean;
  content_refs: string[];
  note: string | null;
}

export interface Page {
  id: string;
  path: string;
  title: string;
  description: string;
  intent: string;
  noindex: boolean;
  source: string | null;
  sections: PageSection[];
}

export interface SiteSpec {
  canonical_base: string;
  nav: Link[];
  cta: { primary: Link; secondary: Link };
  seo_defaults: {
    title_template: string;
    description: string;
    locale: string;
    og_image: string | null;
  };
  verification: { google_site_verification: string | null };
  icons: { favicon: string | null; apple_touch: string | null };
  pages: Page[];
}

export interface SiteModel {
  site_version: string;
  requires: { business: string };
  design: Design;
  media: MediaCatalog;
  site: SiteSpec;
}

/* ------------------------------------------------------------------ *
 *  quality.ts
 * ------------------------------------------------------------------ */

export interface Question {
  id: string;
  question: string;
  owner: "owner" | "lawyer" | "photographer" | "developer" | "marketing";
  blocks_publish: boolean;
  affects: string[];
}

export interface Issue {
  id: string;
  severity: "blocker" | "high" | "medium" | "low";
  area: string;
  issue: string;
  resolution: string;
}

export interface Unknown {
  path: string;
  assumption: string;
  risk: "low" | "medium" | "high";
}

export interface Provenance {
  extracted_at: string;
  source_repository: string;
  source_commit: string | null;
  legacy_stack: string[];
  legacy_notes: { item: string; reason: string }[];
  derived_from: { file: string; note?: string; migrated_at: string } | null;
}

export interface QualityModel {
  quality_version: string;
  requires: { business: string; site: string };
  publishable: boolean;
  questions: Question[];
  issues: Issue[];
  unknowns: Unknown[];
  provenance: Provenance;
}
