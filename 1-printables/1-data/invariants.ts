import type { PrintPriceList } from "../0-print/0-types";

/**
 * Reguły spójności dokumentu drukowanego.
 *
 * Rdzeń nie waliduje referencji w runtime — pilnuje ich TypeScript. Tutaj
 * sprawdzamy to, czego typy nie widzą: czy tabela nie jest pusta, czy każdy
 * karnet ma choć jedną cenę i czy odnośniki dodatków wskazują istniejące
 * przypisy. Błąd zatrzymuje build, zamiast wypuścić niekompletny wydruk.
 */

const nonEmpty = (value: string): boolean => value.trim().length > 0;

export function assertPriceListIntegrity(doc: PrintPriceList): void {
  const { passes, scope, single_entry: entry, theme, services, policy_notes: notes } = doc;

  const columnProblems = passes.columns.flatMap((column, index) => [
    ...(nonEmpty(column.index) ? [] : [`kolumna ${column.key}: pusty numer`]),
    ...(nonEmpty(column.name) ? [] : [`kolumna ${column.key}: pusta nazwa`]),
    ...(passes.rows.some((row) => row.cells[index] !== null)
      ? []
      : [`kolumna ${column.key}: brak jakiejkolwiek ceny`]),
  ]);

  const rowProblems = passes.rows.flatMap((row) => [
    ...(nonEmpty(row.label) ? [] : [`wiersz ${row.code}: pusta etykieta`]),
    ...(row.cells.some((cell) => cell !== null) ? [] : [`wiersz ${row.code}: brak cen w wierszu`]),
    ...row.cells.flatMap((cell) =>
      cell && !nonEmpty(cell.price) ? [`wiersz ${row.code}: pusta cena`] : [],
    ),
  ]);

  const uniqueCodeCount = new Set(passes.rows.map((row) => row.code)).size;
  const perkNumbers = new Set(passes.perk_notes.map((note) => note.number));
  const unknownPerks = passes.rows.flatMap((row) =>
    row.cells.flatMap((cell) =>
      cell
        ? cell.perk_numbers
            .filter((number) => !perkNumbers.has(number))
            .map((number) => `wiersz ${row.code}: nieznany przypis ${number}`)
        : [],
    ),
  );

  const themeProblems = [
    ...(nonEmpty(theme.paper) ? [] : ["motyw: brak koloru papieru"]),
    ...(nonEmpty(theme.ink) ? [] : ["motyw: brak koloru tekstu"]),
    ...(nonEmpty(theme.brand) ? [] : ["motyw: brak koloru marki"]),
    ...(nonEmpty(theme.on_brand) ? [] : ["motyw: brak koloru tekstu na marce"]),
    ...(nonEmpty(theme.display_family) ? [] : ["motyw: brak fontu nagłówków"]),
    ...(nonEmpty(theme.body_family) ? [] : ["motyw: brak fontu tekstu"]),
  ];

  const problems = [
    ...(passes.columns.length > 0 ? [] : ["brak karnetów w cenniku"]),
    ...(passes.rows.length > 0 ? [] : ["brak wariantów w cenniku"]),
    ...(uniqueCodeCount === passes.rows.length ? [] : ["zduplikowane kody wariantów"]),
    ...columnProblems,
    ...rowProblems,
    ...unknownPerks,
    ...themeProblems,
    ...(nonEmpty(entry.price) ? [] : ["wejście jednorazowe: brak ceny"]),
    ...(services.length > 0 ? [] : ["brak usług dodatkowych"]),
    ...(notes.length > 0 ? [] : ["brak zasad cennika"]),
    ...(nonEmpty(doc.source.model_version) ? [] : ["brak wersji modelu"]),
    ...scope.rows.flatMap((row) =>
      row.cells.length === passes.columns.length
        ? []
        : [`zakres ${row.key}: ${row.cells.length} komórek przy ${passes.columns.length} kolumnach`],
    ),
  ];

  if (problems.length > 0) {
    throw new Error(`Niespójny dokument drukowany:\n- ${problems.join("\n- ")}`);
  }
}
