import { contact, business, seo, memberships } from "../1-data/business";

export const SITE_URL = "https://parys.nysa.pl";
export const OG_IMAGE = `${SITE_URL}/og/og-default.jpg`;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Główny schemat organizacji — zastępuje zakomentowany JSON-LD ze starej strony. */
export function gymSchema() {
  const monthly = memberships
    .flatMap((m) => m.options.map((o) => o.price_pln))
    .sort((a, b) => a - b);

  return {
    "@context": "https://schema.org",
    "@type": ["HealthClub", "ExerciseGym"],
    "@id": `${SITE_URL}/#organization`,
    name: business.name,
    alternateName: ["Siłownia Parys Nysa", "Parys Nysa 24/7"],
    url: SITE_URL,
    logo: `${SITE_URL}/brand/icon-512.png`,
    image: OG_IMAGE,
    description: seo.description,
    slogan: business.tagline,
    foundingDate: String(business.established),
    telephone: contact.phone_e164,
    email: contact.email,
    priceRange: `${monthly[0]}–${monthly.at(-1)} PLN`,
    currenciesAccepted: "PLN",
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      postalCode: contact.address.postal_code,
      addressLocality: contact.address.city,
      addressCountry: contact.address.country_code,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: contact.coordinates.lat,
      longitude: contact.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
        description: "Klub czynny całą dobę dla posiadaczy karnetów",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "22:00",
        description: "Recepcja",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
        description: "Recepcja",
      },
    ],
    sameAs: contact.social.map((s) => s.url),
    hasMap: contact.mapEmbed,
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: business.name,
    inLanguage: "pl-PL",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function offerSchema(membership: {
  name: string;
  fromPrice: number;
  id: string;
}) {
  return {
    "@type": "Offer",
    name: membership.name,
    price: membership.fromPrice,
    priceCurrency: "PLN",
    url: absoluteUrl(`/karnety#${membership.id}`),
    availability: "https://schema.org/InStock",
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
