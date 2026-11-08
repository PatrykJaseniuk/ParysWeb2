import type { QualityModel } from "./0-types";
import { business } from "../../0-core";
import { site } from "./1-site";

/**
 * Rejestr gotowości do publikacji: blokery, otwarte pytania, znane defekty,
 * przyjęte założenia i provenance. Nic z tego pliku nie trafia na stronę.
 *
 * `publishable` to decyzja człowieka — `invariants.ts` pilnuje tylko, żeby
 * nie została ustawiona przedwcześnie.
 */
export const quality = {
  requires: { business: business.model_version, site: site.site_version },
  quality_version: "1.1.0",
  publishable: false,
  questions: [
    {
      id: "q-6-streft-scope",
      question: "Cennik wymienia w karnecie 6 stref tylko zajęcia Cross — czy nadal obejmuje on także zajęcia bokserskie?",
      owner: "owner",
      blocks_publish: false,
      affects: [
        "catalog.memberships.mem-6-areas"
      ]
    },
    {
      id: "q-legal-data",
      question: "Jaki jest NIP, pełna nazwa firmy i adres rejestrowy?",
      owner: "owner",
      blocks_publish: true,
      affects: [
        "identity.legal_name"
      ]
    },
    {
      id: "q-legal-docs",
      question: "Czy istnieją regulamin i polityka prywatności? Kto je przygotuje?",
      owner: "lawyer",
      blocks_publish: true,
      affects: [
        "site.pages.privacy",
        "site.pages.terms"
      ]
    },
    {
      id: "q-postal-code",
      question: "Czy kod pocztowy 48-300 jest poprawny dla Poniatowskiego 3?",
      owner: "owner",
      blocks_publish: false,
      affects: [
        "identity.address.postal_code"
      ]
    },
    {
      id: "q-functional-room",
      question: "Czy opis Sali funkcjonalnej (tekst roboczy) jest akceptowalny?",
      owner: "owner",
      blocks_publish: false,
      affects: [
        "catalog.areas.area-functional"
      ]
    },
    {
      id: "q-cross-scope",
      question: "Czy „4 strefy + cross” ma obejmować strefę Sala cross, czy tylko zajęcia?",
      owner: "owner",
      blocks_publish: false,
      affects: [
        "catalog.memberships.mem-4-areas-cross"
      ]
    },
    {
      id: "q-pzu",
      question: "Czy PZU jest nadal akceptowane i na jakich zasadach?",
      owner: "owner",
      blocks_publish: false,
      affects: [
        "catalog.partners.partner-pzu"
      ]
    },
    {
      id: "q-sunday",
      question: "Jakie są godziny recepcji w niedziele i święta?",
      owner: "owner",
      blocks_publish: false,
      affects: [
        "identity.hours.reception"
      ]
    },
    {
      id: "q-trainer-photos",
      question: "Czy są zdjęcia trenerów?",
      owner: "photographer",
      blocks_publish: false,
      affects: [
        "catalog.trainers"
      ]
    },
    {
      id: "q-student-promo",
      question: "Czy promocja „Karnet studencki 99” obowiązuje i jakie ma warunki?",
      owner: "marketing",
      blocks_publish: false,
      affects: [
        "catalog.promotions.promo-student-99"
      ]
    },
    {
      id: "q-analytics",
      question: "Czy włączamy GA4 i czy potrzebny jest baner zgód?",
      owner: "marketing",
      blocks_publish: false,
      affects: [
        "integrations.analytics"
      ]
    }
  ],
  issues: [
    {
      id: "dq-name-cross",
      severity: "medium",
      area: "Karnety",
      issue: "Nazwa „4 strefy + cross” nie odpowiada zakresowi: karnet obejmuje zajęcia Cross trening, ale nie strefę Sala cross.",
      resolution: "Potwierdzić zakres; w UI nazwa handlowa z dopiskiem pod spodem."
    },
    {
      id: "dq-functional-room",
      severity: "medium",
      area: "Strefy",
      issue: "Sala funkcjonalna ma opis roboczy (status draft) — brak tekstu od właściciela.",
      resolution: "Zaakceptować tekst roboczy lub dostarczyć własny."
    },
    {
      id: "dq-boxing-photo",
      severity: "medium",
      area: "Media",
      issue: "Zajęcia bokserskie używają zdjęcia sali cross (ten sam asset co strefa).",
      resolution: "Dostarczyć zdjęcie z zajęć bokserskich."
    },
    {
      id: "dq-zone-photos",
      severity: "medium",
      area: "Media",
      issue: "Zdjęcia stref mają 711×400 px — za mało na hero i ekrany HiDPI.",
      resolution: "Sesja zdjęciowa w rozdzielczości min. 1600 px."
    },
    {
      id: "dq-pzu",
      severity: "medium",
      area: "Partnerzy",
      issue: "PZU wymieniony jako partner, ale bez logo i bez zasad dostępu.",
      resolution: "Dodać logo i zakres dostępu albo usunąć z listy."
    },
    {
      id: "dq-brand-css",
      severity: "low",
      area: "Marka",
      issue:
        "Tokeny kolorów żyją w brand.ts i w src/styles/global.css. Wartości się zgadzają, ale nic nie pilnuje, że zmiana w modelu dotrze do CSS.",
      resolution: "Dodać invariant porównujący tokeny z CSS albo generować CSS z modelu.",
    },
    {
      id: "dq-student-promo",
      severity: "low",
      area: "Promocje",
      issue: "Grafika „Karnet studencki 99” nie ma daty ważności ani warunków.",
      resolution: "Potwierdzić aktualność lub wycofać z materiałów."
    }
  ],
  unknowns: [
    {
      path: "identity.address.postal_code",
      assumption: "48-300 — kod Nysy, niepotwierdzony dla tego adresu",
      risk: "medium"
    },
    {
      path: "pricing_policy",
      assumption: "ceny z cennika od 1 czerwca 2026; VAT nieznany (includes_vat = null)",
      risk: "medium"
    },
    {
      path: "identity.legal_name",
      assumption: "brak danych rejestrowych — publikacja wstrzymana",
      risk: "high"
    },
    {
      path: "identity.hours.reception",
      assumption: "niedziela i święta: recepcja nieczynna, klub 24/7 na kartę",
      risk: "low"
    }
  ],
  provenance: {
    extracted_at: "2026-11-08T19:30:00+01:00",
    source_repository: "https://github.com/PatrykJaseniuk/ParysWeb",
    source_commit: "8a14e21",
    legacy_stack: [
      "Next.js 14 (App Router, static export)",
      "React 18 + TypeScript",
      "Mantine 7",
      "Storybook 7",
      "Jest + React Testing Library",
      "OpenAPI Generator (klient Strapi, nieużywany w UI)"
    ],
    legacy_notes: [
      {
        item: "Przycisk „Log in” w nagłówku",
        reason: "Brak handlera i brak UI logowania — w nowej stronie nie odtwarzamy."
      },
      {
        item: "Sekcja „Aktualności”",
        reason: "Zakomentowana w kodzie, dane to tylko link do Facebooka."
      },
      {
        item: "Modal promocyjny BOKS",
        reason: "Wygasł 2024-10-01; w modelu jako promo-boxing ze stanem expired."
      },
      {
        item: "Grafika „KARNET STUDENCKI 99”",
        reason: "Nieużywana w kodzie i bez warunków — czeka na decyzję marketingową."
      },
      {
        item: "Klient OpenAPI / Strapi",
        reason: "Model danych CMS istniał, ale UI korzystał z lokalnych plików src/Data."
      },
      {
        item: "Stopka „Written by Patryk”",
        reason: "Element autorski bez linku — nie przenosimy."
      }
    ],
    derived_from: {
      file: "business-data.v1.json",
      note: "Model v2 powstał z eksportu v1; identyfikatory encji zostały nadane w migracji.",
      migrated_at: "2026-11-03"
    }
  }
} satisfies QualityModel;
