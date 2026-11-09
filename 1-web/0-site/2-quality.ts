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
  quality_version: "1.14.0",
  publishable: true,
  questions: [
    {
      id: "q-legal-docs",
      question: "Regulamin jest wyłączony ze strony — do akceptacji prawnej i ewentualnego włączenia w przyszłości.",
      owner: "lawyer",
      blocks_publish: false,
      affects: [
        "legal.terms"
      ]
    }
  ],
  issues: [
    {
      id: "dq-zone-photos",
      severity: "medium",
      area: "Media",
      issue: "Zdjęcia stref mają 711×400 px — za mało na hero i ekrany HiDPI.",
      resolution: "Sesja zdjęciowa w rozdzielczości min. 1600 px."
    },
    {
      id: "dq-trainer-photos",
      severity: "low",
      area: "Media",
      issue: "Zdjęcia trenerów to profile 150×150 px z Instagrama — wystarczają na awatary, ale nie na większe portrety.",
      resolution: "Przy sesji zdjęciowej zastąpić portretami w rozdzielczości min. 800 px."
    },
    {
      id: "dq-trainer-krzysztof-specialty",
      severity: "low",
      area: "Trenerzy",
      issue: "Profil Krzysztofa nie ma publicznego opisu specjalności — karta nie ma tagów specjalizacji.",
      resolution: "Potwierdzić specjalność u właściciela lub uzupełnić profil Instagram."
    },
    {
      id: "dq-brand-css",
      severity: "low",
      area: "Marka",
      issue:
        "Tokeny kolorów żyją w brand.ts i w src/styles/global.css. Wartości się zgadzają, ale nic nie pilnuje, że zmiana w modelu dotrze do CSS.",
      resolution: "Dodać invariant porównujący tokeny z CSS albo generować CSS z modelu.",
    }
  ],
  unknowns: [
    {
      path: "pricing_policy",
      assumption: "ceny z cennika od 1 czerwca 2026; potwierdzone jako brutto (includes_vat = true)",
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
        item: "Modal promocyjny zajęć grupowych",
        reason: "Nieaktualny; wpis pominięty w nowym modelu."
      },
      {
        item: "Grafika „KARNET STUDENCKI 99”",
        reason: "Promocja usunięta z modelu — grafika nie jest już używana."
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
