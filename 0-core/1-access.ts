import type { EntryPolicy } from "./0-types";

/**
 * Dostęp do obiektu i karta klubowa.
 *
 * Wejście jednorazowe nie wymaga rejestracji i odbywa się w godzinach
 * recepcji. Karnet wymaga rejestracji i daje dostęp 24/7 przez kartę
 * klubową. Programy partnerskie opłacają wejście jednorazowe do wszystkich
 * stref i Cross. Bramka nie odczytuje kart partnerskich.
 */
export const entry_policy: EntryPolicy = {
  single_entry_requires_registration: false,
  single_entry_access: "reception_hours",
  access_requires_registration: true,
  access_window: "24_7",
  partner_single_entry_scope: "all_areas_and_cross",
  registered_partner_access: "24_7",
  partner_cards_read_by_gate: false,
  club_card_fee: 20,
};
