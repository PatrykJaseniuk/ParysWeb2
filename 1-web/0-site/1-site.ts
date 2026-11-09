import type { SiteModel } from "./0-types";
import { business } from "../../0-core";

/**
 * Warstwa budowy strony: design, katalog mediów, powiązania encja → plik
 * oraz definicje stron.
 *
 * `media.bindings` to jedyne miejsce w modelu, które łączy encję biznesową
 * z plikiem. Klucz = klucz encji z `0-core`, wartość = role plików.
 * Brak wpisu oznacza brak pliku — wtedy działa `media.fallbacks`.
 */
export const site = {
  requires: { business: business.model_version },
  site_version: "4.16.0",
  design: {
    direction: "Ciemny, techniczny interfejs w duchu karty sprzętowej: ostre krawędzie, włosowe linie 1 px, duża typografia wersalikowa i czerwień jako jedyny akcent. Cennik jest jedyną jasną sekcją — wygląda jak wydruk na ścianie recepcji.",
    scale: {
      h1: "clamp(2.4rem, 6.2vw, 5.2rem)",
      h2: "clamp(1.9rem, 4.2vw, 3.5rem)",
      h3: "clamp(1.35rem, 2.3vw, 1.9rem)",
    },
    spacing: {
      section_y: "clamp(3.5rem, 5vw, 5rem)",
      container_max_px: 1440,
    },
    radius: {
      sm: "2px",
      md: "4px",
    },
    logo: {
      mark: "asset-logo-mark",
      full: "asset-logo-full",
      motto: "asset-logo-motto",
    },
  },
  media: {
    assets: {
      "asset-favicon": {
        kind: "icon",
        source: "seo/favicon.ico",
        served: "/favicon.ico",
        mime: "image/x-icon",
        width: null,
        height: null,
        duration_s: null,
        alt: "",
        roles: [
          "favicon"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "complete"
      },
      "asset-logo-full": {
        kind: "logo",
        source: "logos/renders/parys-logo-primary.png",
        served: "/brand/logo.webp",
        mime: "image/webp",
        width: 900,
        height: 655,
        duration_s: null,
        alt: "Logotyp Sport Studio Parys z napisem PARYS i „siłownia / cross”",
        roles: [
          "logo-full"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "complete"
      },
      "asset-logo-mark": {
        kind: "logo",
        source: "logos/svg/IconParysLogoMini.svg",
        served: "/brand/icon-mark.svg",
        mime: "image/svg+xml",
        width: null,
        height: null,
        duration_s: null,
        alt: "Znak Sport Studio Parys — biała figura w czerwonym kwadracie",
        roles: [
          "logo-mark",
          "favicon"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "complete"
      },
      "asset-logo-motto": {
        kind: "logo",
        source: "logos/renders/parys-motto.png",
        served: null,
        mime: "image/png",
        width: 4856,
        height: 554,
        duration_s: null,
        alt: "Motto: Nie pozwól, aby przypadek uformował Twoje ciało",
        roles: [
          "motto"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "complete"
      },
      "asset-logo-partner-fitprofit": {
        kind: "logo",
        source: "partners/fitProfit.png",
        served: "/img/partnerzy/fitprofit.webp",
        mime: "image/webp",
        width: 778,
        height: 205,
        duration_s: null,
        alt: "Karta FitProfit — płatność za wejście jednorazowe",
        roles: [
          "partner-logo"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "complete"
      },
      "asset-logo-partner-medicover": {
        kind: "logo",
        source: "partners/medicover.png",
        served: "/img/partnerzy/medicover.webp",
        mime: "image/webp",
        width: 778,
        height: 152,
        duration_s: null,
        alt: "Karta Medicover Sport — płatność za wejście jednorazowe",
        roles: [
          "partner-logo"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "complete"
      },
      "asset-logo-partner-multisport": {
        kind: "logo",
        source: "partners/multisport.png",
        served: "/img/partnerzy/multisport.webp",
        mime: "image/webp",
        width: 408,
        height: 454,
        duration_s: null,
        alt: "Karta MultiSport Plus — płatność za wejście jednorazowe",
        roles: [
          "partner-logo"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "complete"
      },
      "asset-logo-partner-pzu": {
        kind: "logo",
        source: "partners/pzu.png",
        served: "/img/partnerzy/pzu.webp",
        mime: "image/webp",
        width: 428,
        height: 428,
        duration_s: null,
        alt: "Logo PZU — płatność za wejście jednorazowe",
        roles: [
          "partner-logo"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "complete"
      },
      "asset-og-default": {
        kind: "image",
        source: null,
        served: "/og/og-default.jpg",
        mime: "image/jpeg",
        width: 1200,
        height: 630,
        duration_s: null,
        alt: "Sport Studio Parys — siłownia w Nysie czynna całą dobę",
        roles: [
          "og"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "complete"
      },
      "asset-photo-zone-cardio": {
        kind: "image",
        source: "photos/zones/cardio.png",
        served: "/img/strefy/cardio-711.webp",
        mime: "image/webp",
        width: 711,
        height: 400,
        duration_s: null,
        alt: "Strefa cardio — bieżnie, orbitreki i wioślarze",
        roles: [
          "zone-photo"
        ],
        credit: "Sport Studio Parys",
        variants: [
          {
            width: 500,
            path: "/img/strefy/cardio-500.webp",
            format: "webp"
          },
          {
            width: 711,
            path: "/img/strefy/cardio-711.webp",
            format: "webp"
          }
        ],
        status: "complete"
      },
      "asset-photo-zone-cross": {
        kind: "image",
        source: "photos/zones/cross.png",
        served: "/img/strefy/sala-cross-711.webp",
        mime: "image/webp",
        width: 711,
        height: 400,
        duration_s: null,
        alt: "Sala cross z kratownicą i sprzętem do crossfitu",
        roles: [
          "zone-photo"
        ],
        credit: "Sport Studio Parys",
        variants: [
          {
            width: 500,
            path: "/img/strefy/sala-cross-500.webp",
            format: "webp"
          },
          {
            width: 711,
            path: "/img/strefy/sala-cross-711.webp",
            format: "webp"
          }
        ],
        status: "complete"
      },
      "asset-photo-zone-free-weights": {
        kind: "image",
        source: "photos/zones/wolneCiezary.png",
        served: "/img/strefy/wolne-ciezary-711.webp",
        mime: "image/webp",
        width: 711,
        height: 400,
        duration_s: null,
        alt: "Strefa wolnych ciężarów — sztangi olimpijskie, hantle i racki",
        roles: [
          "zone-photo"
        ],
        credit: "Sport Studio Parys",
        variants: [
          {
            width: 500,
            path: "/img/strefy/wolne-ciezary-500.webp",
            format: "webp"
          },
          {
            width: 711,
            path: "/img/strefy/wolne-ciezary-711.webp",
            format: "webp"
          }
        ],
        status: "complete"
      },
      "asset-photo-zone-functional": {
        kind: "image",
        source: "photos/zones/rozgrzewka.png",
        served: "/img/strefy/sala-funkcjonalna-711.webp",
        mime: "image/webp",
        width: 711,
        height: 400,
        duration_s: null,
        alt: "Sala funkcjonalna z drabinkami gimnastycznymi i materacami",
        roles: [
          "zone-photo"
        ],
        credit: "Sport Studio Parys",
        variants: [
          {
            width: 500,
            path: "/img/strefy/sala-funkcjonalna-500.webp",
            format: "webp"
          },
          {
            width: 711,
            path: "/img/strefy/sala-funkcjonalna-711.webp",
            format: "webp"
          }
        ],
        status: "complete"
      },
      "asset-photo-zone-machines": {
        kind: "image",
        source: "photos/zones/maszynyZeStosem.png",
        served: "/img/strefy/maszyny-ze-stosem-711.webp",
        mime: "image/webp",
        width: 711,
        height: 400,
        duration_s: null,
        alt: "Maszyny ze stosem w dwóch salach treningowych",
        roles: [
          "zone-photo"
        ],
        credit: "Sport Studio Parys",
        variants: [
          {
            width: 500,
            path: "/img/strefy/maszyny-ze-stosem-500.webp",
            format: "webp"
          },
          {
            width: 711,
            path: "/img/strefy/maszyny-ze-stosem-711.webp",
            format: "webp"
          }
        ],
        status: "complete"
      },
      "asset-photo-zone-roll-massage": {
        kind: "image",
        source: "photos/zones/rollWibra.png",
        served: "/img/strefy/rollmasaz-711.webp",
        mime: "image/webp",
        width: 711,
        height: 400,
        duration_s: null,
        alt: "Rollmasaż i platforma wibrująca VibroFit",
        roles: [
          "zone-photo"
        ],
        credit: "Sport Studio Parys",
        variants: [
          {
            width: 500,
            path: "/img/strefy/rollmasaz-500.webp",
            format: "webp"
          },
          {
            width: 711,
            path: "/img/strefy/rollmasaz-711.webp",
            format: "webp"
          }
        ],
        status: "complete"
      },
      "asset-photo-trainer-krzysztof": {
        kind: "image",
        source: "photos/trainers/krzysztof.jpg",
        served: "/img/trenerzy/krzysztof.webp",
        mime: "image/webp",
        width: 150,
        height: 150,
        duration_s: null,
        alt: "Krzysztof Jaseniuk — trener osobisty i właściciel Sport Studio Parys",
        roles: [
          "trainer-photo"
        ],
        credit: "Instagram — @krzysztofjaseniuk",
        variants: [],
        status: "complete"
      },
      "asset-photo-trainer-lukasz": {
        kind: "image",
        source: "photos/trainers/lukasz.jpg",
        served: "/img/trenerzy/lukasz.webp",
        mime: "image/webp",
        width: 150,
        height: 150,
        duration_s: null,
        alt: "Łukasz Kowalski — trener osobisty w Sport Studio Parys",
        roles: [
          "trainer-photo"
        ],
        credit: "Instagram — @kowalski_trener",
        variants: [],
        status: "complete"
      },
      "asset-photo-trainer-rafal": {
        kind: "image",
        source: "photos/trainers/rafal.jpg",
        served: "/img/trenerzy/rafal.webp",
        mime: "image/webp",
        width: 150,
        height: 150,
        duration_s: null,
        alt: "Rafał Nowicki — trener osobisty w Sport Studio Parys",
        roles: [
          "trainer-photo"
        ],
        credit: "Instagram — @rafal_trenuje94",
        variants: [],
        status: "complete"
      },
      "asset-photo-trainer-cezary": {
        kind: "image",
        source: "photos/trainers/cezary.jpg",
        served: "/img/trenerzy/cezary.webp",
        mime: "image/webp",
        width: 150,
        height: 150,
        duration_s: null,
        alt: "Cezary Jaseniuk — trener osobisty w Sport Studio Parys",
        roles: [
          "trainer-photo"
        ],
        credit: "Instagram — @trener_cezary",
        variants: [],
        status: "complete"
      },
      "asset-photo-trainer-artur": {
        kind: "image",
        source: "photos/trainers/artur.jpg",
        served: "/img/trenerzy/artur.webp",
        mime: "image/webp",
        width: 150,
        height: 150,
        duration_s: null,
        alt: "Artur Gennadievich — trener boksu w Sport Studio Parys",
        roles: [
          "trainer-photo"
        ],
        credit: "Instagram — @yanov.artur_boks",
        variants: [],
        status: "complete"
      },
      "asset-photo-service-badminton": {
        kind: "image",
        source: "photos/services/badminton.png",
        served: "/img/uslugi/badminton-1152.webp",
        mime: "image/webp",
        width: 1152,
        height: 720,
        duration_s: null,
        alt: "Kort do badmintona w Sport Studio Parys",
        roles: [
          "service-photo"
        ],
        credit: "Sport Studio Parys",
        variants: [
          {
            width: 500,
            path: "/img/uslugi/badminton-500.webp",
            format: "webp"
          },
          {
            width: 711,
            path: "/img/uslugi/badminton-711.webp",
            format: "webp"
          },
          {
            width: 900,
            path: "/img/uslugi/badminton-900.webp",
            format: "webp"
          },
          {
            width: 1152,
            path: "/img/uslugi/badminton-1152.webp",
            format: "webp"
          }
        ],
        status: "complete"
      },
      "asset-photo-service-buffet": {
        kind: "image",
        source: "photos/services/bufet.png",
        served: "/img/uslugi/bufet-sklep-1152.webp",
        mime: "image/webp",
        width: 1152,
        height: 720,
        duration_s: null,
        alt: "Bufet i sklep z odżywkami w Sport Studio Parys",
        roles: [
          "service-photo"
        ],
        credit: "Sport Studio Parys",
        variants: [
          {
            width: 500,
            path: "/img/uslugi/bufet-sklep-500.webp",
            format: "webp"
          },
          {
            width: 711,
            path: "/img/uslugi/bufet-sklep-711.webp",
            format: "webp"
          },
          {
            width: 900,
            path: "/img/uslugi/bufet-sklep-900.webp",
            format: "webp"
          },
          {
            width: 1152,
            path: "/img/uslugi/bufet-sklep-1152.webp",
            format: "webp"
          }
        ],
        status: "complete"
      },
      "asset-photo-service-sauna": {
        kind: "image",
        source: "photos/services/sauna.png",
        served: "/img/uslugi/sauna-1152.webp",
        mime: "image/webp",
        width: 1152,
        height: 720,
        duration_s: null,
        alt: "Wnętrze sauny w Sport Studio Parys",
        roles: [
          "service-photo"
        ],
        credit: "Sport Studio Parys",
        variants: [
          {
            width: 500,
            path: "/img/uslugi/sauna-500.webp",
            format: "webp"
          },
          {
            width: 711,
            path: "/img/uslugi/sauna-711.webp",
            format: "webp"
          },
          {
            width: 900,
            path: "/img/uslugi/sauna-900.webp",
            format: "webp"
          },
          {
            width: 1152,
            path: "/img/uslugi/sauna-1152.webp",
            format: "webp"
          }
        ],
        status: "complete"
      },
      "asset-video-service-badminton": {
        kind: "video",
        source: "videos/services/Badminton.mp4",
        served: null,
        mime: "video/mp4",
        width: 1280,
        height: 720,
        duration_s: 4.38,
        alt: "Wideo: pełnowymiarowy kort do badmintona",
        roles: [
          "video"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "missing"
      },
      "asset-video-service-buffet": {
        kind: "video",
        source: "videos/services/Bufet.mp4",
        served: null,
        mime: "video/mp4",
        width: 1280,
        height: 720,
        duration_s: 9.32,
        alt: "Wideo: bufet i sklep z odżywkami",
        roles: [
          "video"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "missing"
      },
      "asset-video-service-sauna": {
        kind: "video",
        source: "videos/services/Sauna.mp4",
        served: null,
        mime: "video/mp4",
        width: 1280,
        height: 720,
        duration_s: 11.2,
        alt: "Wideo: sauna sucha z leżakownią",
        roles: [
          "video"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "missing"
      },
      "asset-video-zone-cardio": {
        kind: "video",
        source: "videos/zones/cardio.mp4",
        served: null,
        mime: "video/mp4",
        width: 1280,
        height: 720,
        duration_s: 13.03,
        alt: "Wideo: strefa cardio — bieżnie, orbitreki i wioślarze",
        roles: [
          "video"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "missing"
      },
      "asset-video-zone-cross": {
        kind: "video",
        source: "videos/zones/cross.mp4",
        served: null,
        mime: "video/mp4",
        width: 1280,
        height: 720,
        duration_s: 17.6,
        alt: "Wideo: sala cross z kratownicą i sprzętem do crossfitu",
        roles: [
          "video"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "missing"
      },
      "asset-video-zone-free-weights": {
        kind: "video",
        source: "videos/zones/wolneCiezary.mp4",
        served: null,
        mime: "video/mp4",
        width: 1280,
        height: 720,
        duration_s: 11.03,
        alt: "Wideo: strefa wolnych ciężarów — sztangi olimpijskie, hantle i racki",
        roles: [
          "video"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "missing"
      },
      "asset-video-zone-functional": {
        kind: "video",
        source: "videos/zones/rozgrzewka.mp4",
        served: null,
        mime: "video/mp4",
        width: 1280,
        height: 720,
        duration_s: 12.97,
        alt: "Wideo: sala funkcjonalna z drabinkami gimnastycznymi i materacami",
        roles: [
          "video"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "missing"
      },
      "asset-video-zone-machines": {
        kind: "video",
        source: "videos/zones/maszynyZeStosem.mp4",
        served: null,
        mime: "video/mp4",
        width: 1280,
        height: 720,
        duration_s: 26.1,
        alt: "Wideo: maszyny ze stosem w dwóch salach treningowych",
        roles: [
          "video"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "missing"
      },
      "asset-video-zone-roll-massage": {
        kind: "video",
        source: "videos/zones/rollWibra.mp4",
        served: null,
        mime: "video/mp4",
        width: 1280,
        height: 720,
        duration_s: 9.37,
        alt: "Wideo: rollmasaż i platforma wibrująca VibroFit",
        roles: [
          "video"
        ],
        credit: "Sport Studio Parys",
        variants: [],
        status: "missing"
      }
    },
    bindings: {
      "area-cardio": {
        photo: "asset-photo-zone-cardio",
        video: "asset-video-zone-cardio"
      },
      "area-cross": {
        photo: "asset-photo-zone-cross",
        video: "asset-video-zone-cross"
      },
      "area-free-weights": {
        photo: "asset-photo-zone-free-weights",
        video: "asset-video-zone-free-weights"
      },
      "area-functional": {
        photo: "asset-photo-zone-functional",
        video: "asset-video-zone-functional"
      },
      "area-machines": {
        photo: "asset-photo-zone-machines",
        video: "asset-video-zone-machines"
      },
      "area-roll-massage": {
        photo: "asset-photo-zone-roll-massage",
        video: "asset-video-zone-roll-massage"
      },
      "class-cross-training": {
        photo: "asset-photo-zone-cross",
        video: "asset-video-zone-cross"
      },
      "trainer-krzysztof": {
        photo: "asset-photo-trainer-krzysztof"
      },
      "trainer-lukasz": {
        photo: "asset-photo-trainer-lukasz"
      },
      "trainer-rafal": {
        photo: "asset-photo-trainer-rafal"
      },
      "trainer-cezary": {
        photo: "asset-photo-trainer-cezary"
      },
      "trainer-artur": {
        photo: "asset-photo-trainer-artur"
      },
      "partner-fitprofit": {
        logo: "asset-logo-partner-fitprofit"
      },
      "partner-medicover": {
        logo: "asset-logo-partner-medicover"
      },
      "partner-multisport": {
        logo: "asset-logo-partner-multisport"
      },
      "partner-pzu": {
        logo: "asset-logo-partner-pzu"
      },
      "svc-badminton": {
        photo: "asset-photo-service-badminton",
        video: "asset-video-service-badminton"
      },
      "svc-buffet": {
        photo: "asset-photo-service-buffet",
        video: "asset-video-service-buffet"
      },
      "svc-sauna": {
        photo: "asset-photo-service-sauna",
        video: "asset-video-service-sauna"
      }
    },
    hero: null,
    fallbacks: {
      area: "placeholder",
      class: "duotone-reuse",
      trainer: "monogram",
      partner: "wordmark"
    }
  },
  site: {
    canonical_base: "https://parys.nysa.pl",
    nav: [
      {
        label: "Strefy",
        href: "/strefy",
        kind: "link"
      },
      {
        label: "Karnety",
        href: "/karnety",
        kind: "link"
      },
      {
        label: "Zajęcia",
        href: "/zajecia",
        kind: "link"
      },
      {
        label: "Trenerzy",
        href: "/trenerzy",
        kind: "link"
      },
      {
        label: "Usługi",
        href: "/uslugi",
        kind: "link"
      },
      {
        label: "Kontakt",
        href: "/kontakt",
        kind: "link"
      }
    ],
    cta: {
      primary: {
        label: "Zobacz karnety",
        href: "/karnety",
        kind: "link"
      },
      secondary: {
        label: "Zadzwoń",
        href: "tel:+48774336301",
        kind: "phone"
      }
    },
    seo_defaults: {
      title_template: "{title} — Sport Studio Parys, Nysa",
      description: "Siłownia i klub fitness w Nysie, czynne całą dobę. Sześć stref treningowych na 1000 m², zajęcia grupowe, trening personalny, sauna i badminton.",
      locale: "pl_PL",
      og_image: "asset-og-default"
    },
    verification: {
      google_site_verification: "google39cb9d79c986de59"
    },
    icons: {
      favicon: "asset-favicon",
      apple_touch: "asset-logo-mark"
    },
    pages: [
      {
        id: "home",
        path: "/",
        title: "Sport Studio Parys",
        description: "Siłownia i klub fitness w Nysie — czynne całą dobę. Wejście jednorazowe 35 zł, karnety bez umowy.",
        intent: "Jednoekranowe odpowiedzi: co to za miejsce, ile kosztuje, jak dojechać. Prowadzi do cennika i telefonu.",
        noindex: false,
        source: null,
        sections: [
          {
            id: "sec-hero",
            type: "hero",
            required: true,
            content_refs: [
              "identity.tagline",
              "identity.facts"
            ],
            note: null
          },
          {
            id: "sec-areas",
            type: "area_grid",
            required: true,
            content_refs: [
              "catalog.areas"
            ],
            note: null
          },
          {
            id: "sec-pricing",
            type: "pricing_matrix",
            required: true,
            content_refs: [
              "catalog.accesses",
              "pricing_policy"
            ],
            note: null
          },
          {
            id: "sec-classes",
            type: "class_list",
            required: true,
            content_refs: [
              "catalog.classes"
            ],
            note: null
          },
          {
            id: "sec-trainers",
            type: "trainer_list",
            required: false,
            content_refs: [
              "catalog.trainers",
              "catalog.personal_training"
            ],
            note: null
          },
          {
            id: "sec-services",
            type: "service_list",
            required: true,
            content_refs: [
              "catalog.services"
            ],
            note: null
          },
          {
            id: "sec-partners",
            type: "partner_list",
            required: false,
            content_refs: [
              "catalog.partners"
            ],
            note: null
          },
          {
            id: "sec-contact",
            type: "contact_block",
            required: true,
            content_refs: [
              "identity.contact",
              "identity.hours",
              "identity.address"
            ],
            note: null
          }
        ]
      },
      {
        id: "pricing",
        path: "/karnety",
        title: "Karnety i cennik",
        description: "Cennik karnetów: 4 strefy, 4 strefy + zajęcia grupowe, 5 stref, 6 stref + zajęcia grupowe oraz karnet 8 wejść na rollmasaż. Wejście jednorazowe 35 zł, bez umowy.",
        intent: "Zamknąć pytanie o cenę bez kontaktu z recepcją. Macierz wariantów, zakresy, FAQ.",
        noindex: false,
        source: null,
        sections: [
          {
            id: "sec-header",
            type: "page_header",
            required: true,
            content_refs: [
              "site.cta"
            ],
            note: null
          },
          {
            id: "sec-matrix",
            type: "pricing_matrix",
            required: true,
            content_refs: [
              "catalog.accesses",
              "pricing_policy"
            ],
            note: null
          },
          {
            id: "sec-scope",
            type: "scope_table",
            required: true,
            content_refs: [
              "catalog.accesses",
              "catalog.areas",
              "catalog.classes"
            ],
            note: null
          },
          {
            id: "sec-faq",
            type: "faq",
            required: false,
            content_refs: [
              "pricing_policy",
              "catalog.partners"
            ],
            note: null
          },
          {
            id: "sec-cta",
            type: "cta",
            required: false,
            content_refs: [
              "site.cta"
            ],
            note: null
          }
        ]
      },
      {
        id: "areas",
        path: "/strefy",
        title: "Strefy treningowe",
        description: "Sześć stref: wolne ciężary, maszyny ze stosem, cardio, sala funkcjonalna, sala cross, rollmasaż.",
        intent: "Lista wszystkich stref z linkami do podstron.",
        noindex: false,
        source: null,
        sections: [
          {
            id: "sec-header",
            type: "page_header",
            required: true,
            content_refs: [],
            note: null
          },
          {
            id: "sec-grid",
            type: "area_grid",
            required: true,
            content_refs: [
              "catalog.areas"
            ],
            note: null
          },
          {
            id: "sec-cta",
            type: "cta",
            required: false,
            content_refs: [
              "site.cta"
            ],
            note: null
          }
        ]
      },
      {
        id: "area-detail",
        path: "/strefy/{slug}",
        title: "{name} — strefa treningowa",
        description: "{short}",
        intent: "Podstrona jednej strefy. Pola {name} i {short} podstawiane z encji obszaru.",
        noindex: false,
        source: "catalog.areas",
        sections: [
          {
            id: "sec-header",
            type: "page_header",
            required: true,
            content_refs: [
              "catalog.areas"
            ],
            note: null
          },
          {
            id: "sec-detail",
            type: "area_detail",
            required: true,
            content_refs: [
              "catalog.areas"
            ],
            note: null
          },
          {
            id: "sec-calendar",
            type: "calendar_embed",
            required: false,
            content_refs: [
              "integrations.calendars"
            ],
            note: null
          },
          {
            id: "sec-cta",
            type: "cta",
            required: false,
            content_refs: [
              "site.cta"
            ],
            note: null
          }
        ]
      },
      {
        id: "classes",
        path: "/zajecia",
        title: "Zajęcia grupowe",
        description: "Zajęcia grupowe w małych grupach. Cross, harmonogram i zasady zapisów.",
        intent: "Zaprezentować zajęcia grupowe i pokazać terminy.",
        noindex: false,
        source: null,
        sections: [
          {
            id: "sec-header",
            type: "page_header",
            required: true,
            content_refs: [],
            note: null
          },
          {
            id: "sec-calendar",
            type: "calendar_embed",
            required: true,
            content_refs: [
              "integrations.calendars"
            ],
            note: null
          },
          {
            id: "sec-classes",
            type: "class_detail",
            required: true,
            content_refs: [
              "catalog.classes",
              "catalog.trainers"
            ],
            note: null
          },
          {
            id: "sec-cta",
            type: "cta",
            required: false,
            content_refs: [
              "site.cta"
            ],
            note: null
          }
        ]
      },
      {
        id: "trainers",
        path: "/trenerzy",
        title: "Trenerzy personalni i bokserscy",
        description: "Pięciu trenerów, trening indywidualny 1:1.",
        intent: "Przedstawić ludzi i charakter treningu 1:1.",
        noindex: false,
        source: null,
        sections: [
          {
            id: "sec-header",
            type: "page_header",
            required: true,
            content_refs: [
              "catalog.personal_training"
            ],
            note: null
          },
          {
            id: "sec-trainers",
            type: "trainer_list",
            required: true,
            content_refs: [
              "catalog.trainers"
            ],
            note: null
          },
          {
            id: "sec-cta",
            type: "cta",
            required: false,
            content_refs: [
              "site.cta"
            ],
            note: null
          }
        ]
      },
      {
        id: "services",
        path: "/uslugi",
        title: "Usługi dodatkowe",
        description: "Sauna, badminton i bufet — ceny, rezerwacje i kalendarze dostępności.",
        intent: "Pokazać ofertę poza siłownią i doprowadzić do rezerwacji telefonicznej.",
        noindex: false,
        source: null,
        sections: [
          {
            id: "sec-header",
            type: "page_header",
            required: true,
            content_refs: [],
            note: null
          },
          {
            id: "sec-services",
            type: "service_list",
            required: true,
            content_refs: [
              "catalog.services"
            ],
            note: null
          },
          {
            id: "sec-calendars",
            type: "calendar_embed",
            required: false,
            content_refs: [
              "integrations.calendars"
            ],
            note: null
          },
          {
            id: "sec-cta",
            type: "cta",
            required: false,
            content_refs: [
              "site.cta"
            ],
            note: null
          }
        ]
      },
      {
        id: "contact",
        path: "/kontakt",
        title: "Kontakt",
        description: "Poniatowskiego 3, 48-300 Nysa. Telefon 77 433 63 01. Klub czynny 24/7.",
        intent: "Doprowadzić do wizyty: telefon, adres, godziny, mapa.",
        noindex: false,
        source: null,
        sections: [
          {
            id: "sec-header",
            type: "page_header",
            required: true,
            content_refs: [],
            note: null
          },
          {
            id: "sec-contact",
            type: "contact_block",
            required: true,
            content_refs: [
              "identity.contact",
              "identity.hours",
              "identity.social"
            ],
            note: null
          },
          {
            id: "sec-map",
            type: "map_embed",
            required: true,
            content_refs: [
              "identity.location"
            ],
            note: null
          }
        ]
      },
      {
        id: "privacy",
        path: "/polityka-prywatnosci",
        title: "Polityka prywatności",
        description: "Kto przetwarza dane w serwisie, co trafia do Google i jak realizować swoje prawa.",
        intent: "Dokument prawny opisujący wyłącznie serwis internetowy; link dyskretny w stopce.",
        noindex: false,
        source: null,
        sections: [
          {
            id: "sec-header",
            type: "page_header",
            required: true,
            content_refs: [],
            note: null
          },
          {
            id: "sec-body",
            type: "prose",
            required: true,
            content_refs: [
              "identity.contact",
              "identity.address",
              "identity.location"
            ],
            note: "Treść opisuje realne przepływy: brak formularzy, embed Google po kliknięciu, logi hostingu."
          }
        ]
      },
      {
        id: "not-found",
        path: "/404",
        title: "Nie znaleziono strony",
        description: "Ta strona nie istnieje.",
        intent: "Strona błędu z drogą powrotu do cennika.",
        noindex: true,
        source: null,
        sections: [
          {
            id: "sec-body",
            type: "error_page",
            required: true,
            content_refs: [
              "site.nav"
            ],
            note: null
          }
        ]
      }
    ]
  }
} satisfies SiteModel;
