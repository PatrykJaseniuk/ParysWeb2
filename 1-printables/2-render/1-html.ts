/**
 * Pomocniki HTML dla warstwy renderowania.
 *
 * Wszystkie teksty z modelu przechodzą przez `escapeHtml` — nawet jeśli
 * dzisiaj nie zawierają znaków specjalnych, wydruk nie może zależeć od
 * tego założenia. Warstwa 2 nie zna `fs` ani modelu: dostaje gotowy dokument.
 */

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Zamienia znaki specjalne HTML na encje; kolejność nie ma znaczenia. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ENTITIES[char] ?? char);
}

/** Warunkowy fragment bez `if` w środku szablonu. */
export function when(condition: boolean, value: string): string {
  return condition ? value : "";
}

/** Skleja fragmenty linii, pomijając puste. */
export function lines(fragments: readonly string[]): string {
  return fragments.filter((fragment) => fragment.length > 0).join("\n");
}
