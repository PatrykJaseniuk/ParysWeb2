import type {
  PrintColumn,
  PrintPartner,
  PrintPerkNote,
  PrintPriceCell,
  PrintPriceList,
  PrintPriceRow,
  PrintScopeRow,
  PrintService,
} from "../0-print/0-types";
import { escapeHtml, when } from "./1-html";
import { printStyles } from "./2-styles";

/**
 * Renderer cennika do samodzielnego HTML-a.
 *
 * Dokument ma dwie strony A4 pion: pierwsza trzyma cennik i zakres
 * jeden pod drugim, druga — usługi, zasady i karty sportowe. Taki podział
 * pozwala powiększyć typografię bez rozbijania tabeli na dwa arkusze.
 *
 * Warstwa 2 zna wyłącznie dokument i zasoby (fonty, logo). Nie czyta plików,
 * nie zna modelu biznesowego i nie składa zapytań — dzięki temu ten sam
 * dokument można w przyszłości wyrenderować do innego formatu.
 */

export interface RenderAssets {
  /** Logo jako data URI, żeby wydruk był samowystarczalny. */
  logo_data_uri: string;
  /** `@font-face` z fontami wbudowanymi w base64. */
  font_css: string;
}

const PAGE_COUNT = 2;

const CHECK_ICON = [
  '<svg class="check" viewBox="0 0 10 10" aria-hidden="true">',
  '<path d="M1.4 5.3 4 7.7 8.7 2.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>',
  "</svg>",
].join("");

const renderBrand = (doc: PrintPriceList, assets: RenderAssets): string =>
  [
    '<div class="brand">',
    `<img class="brand-mark" src="${escapeHtml(assets.logo_data_uri)}" alt="" width="56" height="49">`,
    "<div>",
    `<span class="brand-name">${escapeHtml(doc.brand_short)}</span>`,
    `<span class="brand-sub">${escapeHtml(doc.brand_sub)}</span>`,
    "</div>",
    "</div>",
  ].join("\n");

const renderColumnHead = (column: PrintColumn): string =>
  [
    `<th scope="col"${when(column.featured, ' class="col-featured"')}>`,
    `<span class="col-index">${escapeHtml(column.index)}</span>`,
    `<span class="col-name">${escapeHtml(column.name)}</span>`,
    `<span class="col-sub">${escapeHtml(column.subtitle)}</span>`,
    when(column.featured, '<span class="badge">Pełny zakres</span>'),
    "</th>",
  ].join("\n");

const renderCell = (cell: PrintPriceCell | null, featured: boolean): string => {
  const superscript = cell?.perk_numbers.length
    ? `<sup>${cell.perk_numbers.join(",")}</sup>`
    : "";
  return [
    `<td${when(featured, ' class="col-featured"')}>`,
    cell ? `<span class="price">${escapeHtml(cell.price)}${superscript}</span>` : '<span class="empty">—</span>',
    "</td>",
  ].join("");
};

const renderPriceRow = (row: PrintPriceRow, columns: readonly PrintColumn[]): string =>
  [
    "<tr>",
    `<th scope="row" class="variant">${escapeHtml(row.label)}</th>`,
    ...row.cells.map((cell, index) => renderCell(cell, columns[index]?.featured === true)),
    "</tr>",
  ].join("\n");

const renderPerkNotes = (notes: readonly PrintPerkNote[]): string =>
  when(
    notes.length > 0,
    `<ul class="perks">${notes
      .map(
        (note) =>
          `<li><span class="num">${note.number}</span>${escapeHtml(note.label)}</li>`,
      )
      .join("")}</ul>`,
  );

const renderScopeRow = (row: PrintScopeRow, columns: readonly PrintColumn[]): string =>
  [
    "<tr>",
    `<th scope="row" class="scope-area">${escapeHtml(row.name)}</th>`,
    ...row.cells.map(
      (included, index) =>
        `<td${when(columns[index]?.featured === true, ' class="col-featured"')}>` +
        `${included ? CHECK_ICON : '<span class="dot">—</span>'}</td>`,
    ),
  ].join("\n");

const renderService = (service: PrintService): string => {
  const details = service.details.length
    ? `<p class="service-details">${service.details.map(escapeHtml).join(" · ")}</p>`
    : "";
  const price = service.price ?? service.price_note ?? "";
  return [
    '<article class="service-card">',
    '<div class="service-top">',
    `<h3>${escapeHtml(service.name)}</h3>`,
    `<p class="service-price${service.price ? "" : " note"}">${escapeHtml(price)}</p>`,
    "</div>",
    `<p class="service-desc">${escapeHtml(service.description)}</p>`,
    details,
    "</article>",
  ].join("\n");
};

const renderPartner = (partner: PrintPartner): string =>
  `<li class="partner">${escapeHtml(partner.name)}<span class="badge-note">${escapeHtml(partner.badge)}</span></li>`;

const renderFooter = (doc: PrintPriceList, page: number): string => {
  const { contact, hours, legal } = doc;
  const nip = legal.nip ? ` · NIP ${escapeHtml(legal.nip)}` : "";
  const regon = legal.regon ? ` · REGON ${escapeHtml(legal.regon)}` : "";
  return [
    '<footer class="foot">',
    [
      "<div><strong>Adres</strong>",
      `<span class="row">${escapeHtml(contact.address)}</span>`,
      `<p class="legal">${escapeHtml(legal.operator)}${nip}${regon} · Strona ${page} z ${PAGE_COUNT}</p>`,
      "</div>",
    ].join(""),
    [
      "<div><strong>Kontakt</strong>",
      `<span class="row">${escapeHtml(contact.phone)}</span>`,
      `<span class="row">${escapeHtml(contact.email)}</span>`,
      `<span class="row">${escapeHtml(contact.website_label)}</span>`,
      "</div>",
    ].join(""),
    [
      "<div><strong>Recepcja</strong>",
      ...hours.reception.map((row) => `<span class="row">${escapeHtml(row)}</span>`),
      `<span class="row">${escapeHtml(hours.note)}</span>`,
      "</div>",
    ].join(""),
    "</footer>",
  ].join("\n");
};

const renderSheetPrices = (doc: PrintPriceList, assets: RenderAssets): string => {
  const { passes, single_entry: entry } = doc;
  const columnHeads = passes.columns.map(renderColumnHead).join("\n");
  const priceRows = passes.rows.map((row) => renderPriceRow(row, passes.columns)).join("\n");

  return [
    '<section class="sheet sheet-prices" aria-label="Cennik karnetów">',
    '<header class="masthead">',
    renderBrand(doc, assets),
    '<div class="title">',
    `<p class="kicker">${escapeHtml(doc.kicker)}</p>`,
    `<h1>${escapeHtml(doc.title)}</h1>`,
    "</div>",
    "</header>",

    '<section class="entry">',
    '<div class="entry-copy">',
    '<p class="entry-label">Poza karnetem</p>',
    `<h2>${escapeHtml(entry.name)}</h2>`,
    `<p class="entry-desc">${escapeHtml(entry.description)}</p>`,
    `<ul class="chips">${entry.facts
      .map((fact) => `<li class="chip">${escapeHtml(fact)}</li>`)
      .join("")}</ul>`,
    "</div>",
    '<p class="entry-price">',
    `<span class="amount">${escapeHtml(entry.price)}</span>`,
    `<span class="unit">${escapeHtml(entry.unit)}</span>`,
    `<span class="validity">${escapeHtml(entry.validity)}</span>`,
    "</p>",
    "</section>",

    '<section class="section section-prices">',
    '<div class="section-head">',
    "<h2>Karnety</h2>",
    `<span class="meta">${escapeHtml(passes.summary)}</span>`,
    "</div>",
    '<table class="matrix">',
    `<caption class="sr-only">${escapeHtml(passes.caption)}</caption>`,
    `<colgroup><col class="col-variant">${passes.columns.map(() => "<col>").join("")}</colgroup>`,
    `<thead><tr><th scope="col">Wariant</th>${columnHeads}</tr></thead>`,
    `<tbody class="price-body">${priceRows}</tbody>`,
    '<tbody class="scope-body">',
    '<tr class="scope-lead">',
    `<th colspan="${passes.columns.length + 1}" scope="colgroup">`,
    `<span class="scope-label">${escapeHtml(doc.scope.label)}</span>`,
    `<span class="scope-note">${escapeHtml(doc.scope.note)}</span>`,
    "</th>",
    "</tr>",
    `${doc.scope.rows.map((row) => renderScopeRow(row, passes.columns)).join("\n")}`,
    "</tbody>",
    "</table>",
    `<p class="matrix-note">${escapeHtml(doc.club_card_note)}</p>`,
    renderPerkNotes(passes.perk_notes),
    "</section>",

    renderFooter(doc, 1),
    "</section>",
  ].join("\n");
};

const renderSheetInfo = (doc: PrintPriceList, assets: RenderAssets): string => {
  const services = doc.services.map(renderService).join("\n");
  const rules = doc.policy_notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("\n");
  const partners = doc.partners.map(renderPartner).join("");

  return [
    '<section class="sheet sheet-info" aria-label="Usługi i zasady">',
    '<header class="masthead masthead-secondary">',
    renderBrand(doc, assets),
    '<div class="title">',
    `<p class="kicker">Cennik · strona 2 z ${PAGE_COUNT}</p>`,
    '<h1 class="title-secondary">Usługi i zasady</h1>',
    `<p class="intro">${escapeHtml(doc.intro)}</p>`,
    "</div>",
    "</header>",

    '<section class="info-section">',
    '<div class="section-head">',
    "<h2>Usługi</h2>",
    '<span class="meta">Dostępne w klubie</span>',
    "</div>",
    `<div class="service-grid">${services}</div>`,
    "</section>",

    '<section class="info-section info-section-last">',
    '<div class="info-grid">',
    "<div>",
    '<div class="section-head">',
    "<h2>Zasady</h2>",
    "</div>",
    `<ul class="rules">${rules}</ul>`,
    "</div>",
    "<div>",
    '<div class="section-head">',
    "<h2>Karty sportowe</h2>",
    "</div>",
    `<ul class="partner-list">${partners}</ul>`,
    `<p class="partners-note">${escapeHtml(doc.partners_note)}</p>`,
    "</div>",
    "</div>",
    "</section>",

    '<section class="access-band">',
    '<div class="access-item">',
    '<span class="access-label">Karta klubowa</span>',
    `<span class="access-value">${escapeHtml(doc.club_card_fee)}</span>`,
    '<span class="access-desc">przy rejestracji karnetu</span>',
    "</div>",
    '<div class="access-item">',
    '<span class="access-label">Dostęp</span>',
    `<span class="access-value">${escapeHtml(doc.access_window)}</span>`,
    '<span class="access-desc">z kartą klubową</span>',
    "</div>",
    '<div class="access-item">',
    '<span class="access-label">Wejście jednorazowe</span>',
    `<span class="access-value">${escapeHtml(doc.single_entry.price)}</span>`,
    `<span class="access-desc">${escapeHtml(doc.single_entry.validity)} · ${escapeHtml(doc.single_entry.facts.join(" · "))}</span>`,
    "</div>",
    "</section>",

    renderFooter(doc, 2),
    "</section>",
  ].join("\n");
};

export function renderPriceList(doc: PrintPriceList, assets: RenderAssets): string {
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(doc.title)} — ${escapeHtml(doc.kicker)}</title>
<meta name="generator" content="${escapeHtml(doc.source.generator)} · model ${escapeHtml(doc.source.model_version)}">
<meta name="dcterms.created" content="${escapeHtml(doc.source.generated_at)}">
<style>
${assets.font_css}
${printStyles(doc.theme)}
</style>
</head>
<body>
${renderSheetPrices(doc, assets)}
${renderSheetInfo(doc, assets)}
</body>
</html>
`;
}
