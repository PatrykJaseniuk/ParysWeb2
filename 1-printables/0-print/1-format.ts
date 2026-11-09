import type { Term } from "../../0-core/0-types";

/**
 * Formatowanie tekstu do druku.
 *
 * Warstwa 0 druku — czyste funkcje bez dostępu do modelu, plików i DOM.
 * Dzięki temu te same reguły (niełamliwa spacja, polska odmiana, cena bez
 * groszy) obowiązują w każdym materiale drukowanym.
 */

const plnFormatter = new Intl.NumberFormat("pl-PL", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

/** 1490 → „1 490 zł” (niełamliwa spacja z `Intl`). */
export function pln(amount: number): string {
  return `${plnFormatter.format(amount)}\u00a0zł`;
}

/**
 * Forma rzeczownika po liczbie: 1 miesiąc, 2 miesiące, 5 miesięcy,
 * 22 miesiące, 25 miesięcy.
 */
export function plural(count: number, forms: readonly [string, string, string]): string {
  const last = count % 10;
  const lastTwo = count % 100;
  const isFew = last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14);
  const form = count === 1 ? forms[0] : isFew ? forms[1] : forms[2];
  return form;
}

const TERM_FORMS = {
  day: ["dzień", "dni", "dni"],
  week: ["tydzień", "tygodnie", "tygodni"],
  month: ["miesiąc", "miesiące", "miesięcy"],
  year: ["rok", "lata", "lat"],
} as const;

/** „1 miesiąc”, „2 tygodnie”, „12 miesięcy”; brak terminu = „jedno wejście”. */
export function termLabel(term: Term | null): string {
  const forms = term ? TERM_FORMS[term.unit] : null;
  const label = term && forms ? `${term.value} ${plural(term.value, forms)}` : "jedno wejście";
  return label;
}

/** Szybkość odczytu etykiety: „7 dni” zamiast „jedno wejście” dla wejściówki. */
export function validityLabel(term: Term): string {
  return `ważne ${termLabel(term)}`;
}

/** `#e31e24` + 0,06 → `rgba(227, 30, 36, 0.06)`; zły hex wraca bez zmian. */
export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const expanded =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : clean;
  const channels = [0, 2, 4].map((start) => Number.parseInt(expanded.slice(start, start + 2), 16));
  const valid = expanded.length === 6 && channels.every((channel) => Number.isFinite(channel));
  return valid ? `rgba(${channels.join(", ")}, ${alpha})` : hex;
}

/** Adres bez protokołu i `www.` — na papierze liczy się krótki adres. */
export function websiteLabel(url: string): string {
  const hostOf = (value: string): string => {
    const parsed = (() => {
      try {
        return new URL(value).host;
      } catch {
        return value;
      }
    })();
    return parsed.replace(/^www\./, "");
  };
  return hostOf(url);
}
