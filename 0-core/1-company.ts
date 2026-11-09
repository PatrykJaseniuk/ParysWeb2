import type { Identity } from "./0-types";

/**
 * Dane firmy: tożsamość, kontakt, godziny i lokalizacja.
 *
 * Wartości liczbowe pochodzą z `facts` — jedno źródło prawdy dla roku
 * założenia, powierzchni i liczby sal.
 */

export const company: Identity = {
  display_name: "Sport Studio Parys",
  alternate_names: [
    "Siłownia Parys",
    "Parys Nysa",
    "Siłownia Parys Nysa 24/7",
    "Parys siłownia - cross",
    "Siłownia-cross Parys Nysa",
  ],
  type: "gym",
  tagline: "Nie pozwól, aby przypadek uformował Twoje ciało",
  description: "Sport Studio Parys to siłownia w Nysie działająca od 1989 roku. Na 1000 m² znajdziesz 6 stref treningowych, Cross i trening personalny. Klub jest dostępny dla klubowiczów 24/7. Dodatkowo możesz skorzystać z sauny i badmintona.",
  facts: { founded: 1989, area_m2: 1000, rooms: 6, open_24_7: true },
  languages: ["pl"],
  website: "https://parys.nysa.pl/",
  address: { street: "Poniatowskiego 3", city: "Nysa", postal_code: "48-300", country_code: "PL" },
  contact: { phone_e164: "+48774336301", phone_display: "77 433 63 01", email: "sportstudioparys@gmail.com" },
  hours: {
    facility: { mode: "24_7", requires: "membership", note: "Dostęp na kartę o każdej porze, także w niedziele i święta." },
    reception: [
      { days: ["mon", "tue", "wed", "thu", "fri"], open: "08:00", close: "22:00" },
      { days: ["sat"], open: "09:00", close: "14:00" },
      { days: ["sun"], closed: true },
    ],
  },
  location: {
    lat: 50.480214,
    lng: 17.324212,
    place_name: "SIŁOWNIA Parys Nysa 24/7",
    google_place_id: "0x4711c4125f989f0b:0xb3c7ba6aef95e9fb",
    map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1269.449756421455!2d17.324211918625632!3d50.48021441438569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4711c4125f989f0b%3A0xb3c7ba6aef95e9fb!2sSI%C5%81OWNIA%20Parys%20Nysa%2024%2F7!5e0!3m2!1spl!2spl!4v1703884164412!5m2!1spl!2spl",
  },
  social: [
    {
      platform: "facebook",
      url: "https://www.facebook.com/parysnysa?locale=pl_PL",
      handle: "parysnysa",
    },
    {
      platform: "instagram",
      url: "https://www.instagram.com/silownia_parys/",
      handle: "silownia_parys",
    },
  ],
};
