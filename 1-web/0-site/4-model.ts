/**
 * Punkt wejścia modelu — dla konsumentów spoza aplikacji (skrypty, eksport JSON).
 *
 *   0-core/   rdzeń: fakty i marka (zero zależności, zero referencji do plików)
 *   0-site/   jedno z zastosowań rdzenia — strona: media, powiązania, strony
 *
 * Reguły spójności: `assertModelIntegrity()` w `3-invariants.ts` — rdzeń
 * (`0-core`) sprawdza referencje już w typach, tu dochodzą reguły strony.
 */

export { business } from "../../0-core";
export { site } from "./1-site";
export { quality } from "./2-quality";
export { assertModelIntegrity } from "./3-invariants";

export * from "../../0-core/0-types";
export * from "./0-types";
