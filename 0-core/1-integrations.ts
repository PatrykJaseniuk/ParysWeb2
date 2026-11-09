import type { CalendarSource, Integrations } from "./0-types";

/**
 * Kalendarze Google i analityka.
 *
 * Kalendarze są rekordem klucz → źródło. Znaczenie klucza jest lokalne:
 * `"cal-classes"` istnieje tylko w tym rekordzie. Inne moduły odnoszą się do
 * kalendarza przez `CalendarKey` — kompilator pilnuje, czy taki wpis istnieje.
 *
 * Strefa czasowa jest jedna dla wszystkich kalendarzy — w `meta.timezone`.
 * `embed_url` zostaje dosłownie: to parametr wygenerowany przez Google.
 */

export const calendars = {
  "cal-classes": {
    purpose: "Harmonogram zajęć grupowych (Cross trening)",
    title: "Zajęcia grupowe",
    embed_url: "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FWarsaw&bgcolor=%23ffffff&mode=WEEK&src=NDQ4Njk2NDc4MmQyYTdmMjNjZmZjOWQyNTc5ODY3NmMzN2JhZDM1YzAwZmZjN2Y2ZWZlNWRjZmU4NTQzZTgyM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23D50000",
    colors: ["#d50000"],
  },
  "cal-room-availability": {
    purpose: "Dostępność sali (używana dla strefy Cross i usługi Badminton)",
    title: "Dostępność sali",
    embed_url: "https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FWarsaw&showTitle=1&showNav=0&showPrint=0&showTabs=0&mode=WEEK&showCalendars=0&showTz=0&title=Dost%C4%99pno%C5%9B%C4%87%20sali&src=MWt1M280MjcyZnVvMWg2bDFjY200cGJsYW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=azJsbjN0Z3B0cTZrNmFubXY2amZrczNzbW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23795548&color=%23D50000",
    colors: ["#795548", "#d50000"],
  },
  "cal-sauna": {
    purpose: "Rezerwacje sauny",
    title: "Sauna",
    embed_url: "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Europe%2FWarsaw&showTitle=1&showNav=1&showDate=0&showPrint=0&showTabs=0&showCalendars=0&mode=WEEK&src=ODYyOTdlNTk1Y2E0OTlhMTc2ZDMxMGU4YjNlOWVlNjAzN2E3NTljOGNkZjJiYWUyYmFkNDBkZjg1MjI2YzYzYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F4511E",
    colors: ["#f4511e"],
  },
  "cal-rollmassage": {
    purpose: "Dostępność rollmasażu i platformy wibrującej",
    title: "Rollmasaż",
    embed_url: "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Europe%2FWarsaw&showNav=1&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&src=MG44bzgwdGk2OTBodmRxZmpmMzY0ZGhjZDhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23009688",
    colors: ["#009688"],
  },
} satisfies Record<string, CalendarSource>;

/** Klucze kalendarzy — jedyny dozwolony sposób odwołania się do kalendarza. */
export type CalendarKey = keyof typeof calendars;

export const integrations = {
  calendars,
  analytics: {
    provider: "google_analytics_4",
    measurement_id: "G-GKTQMBN0Y8",
    status: "inactive",
    requires_consent: true,
  },
} satisfies Integrations;
