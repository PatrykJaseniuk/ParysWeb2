import type {
  PrintColumn,
  PrintPartner,
  PrintPriceCell,
  PrintPriceList,
  PrintPriceRow,
  PrintScopeRow,
  PrintService,
} from "../0-print/0-types";
import { escapeHtml, when } from "./1-html";
import { wallStyles } from "./wall-styles";

/**
 * Renderer cennika ściennego A4 poziomo.
 *
 * Jedna tabela: wspólna kolumna karnetów, po lewej grupa wariantów cenowych,
 * po prawej grupa stref. Dzięki temu nie ma powtórzonych nazw wierszy ani
 * dwóch osobnych tabel.
 */

export interface WallAssets {
  logo_data_uri: string;
  font_css: string;
}

const PAGE_COUNT = 2;

const CHECK_ICON = [
  '<svg class="wall-check" viewBox="0 0 10 10" aria-hidden="true">',
  '<path d="M1.4 5.3 4 7.7 8.7 2.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>',
  "</svg>",
].join("");

const renderBrand = (
  doc: PrintPriceList,
  assets: WallAssets,
  showContact = true,
): string =>
  [
    '<div class="wall-brand">',
    `<img class="wall-brand-mark" src="${escapeHtml(assets.logo_data_uri)}" alt="" width="56" height="49">`,
    "<div>",
    `<span class="wall-brand-name">${escapeHtml(doc.brand_short)}</span>`,
    `<span class="wall-brand-sub">${escapeHtml(doc.brand_sub)}</span>`,
    when(
      showContact,
      `<span class="wall-contact">${escapeHtml(doc.contact.phone)} · ${escapeHtml(doc.contact.website_label)} · ${escapeHtml(doc.contact.address)}</span>`,
    ),
    "</div>",
    "</div>",
  ].join("\n");

const renderVariantHead = (row: PrintPriceRow): string =>
  `<th scope="col">${escapeHtml(row.label)}</th>`;

const renderPassLabel = (column: PrintColumn): string =>
  [
    '<th scope="row" class="wall-pass">',
    `<span class="wall-pass-name">${escapeHtml(column.name)}</span>`,
    `<span class="wall-pass-sub">${escapeHtml(column.subtitle)}</span>`,
    "</th>",
  ].join("\n");

const renderPriceCell = (cell: PrintPriceCell | null): string =>
  [
    '<td class="wall-price-cell">',
    cell
      ? `<span class="wall-price">${escapeHtml(cell.price_value)}</span>`
      : '<span class="wall-empty">—</span>',
    "</td>",
  ].join("");

const renderZoneHead = (row: PrintScopeRow, index: number): string =>
  [
    `<th scope="col" class="wall-zone-col${when(index === 0, " wall-group-start")}" title="${escapeHtml(row.name)}">`,
    '<span class="wall-zone-head">',
    ...row.wall_lines.map((line) => `<span class="wall-zone-line">${escapeHtml(line)}</span>`),
    "</span>",
    "</th>",
  ].join("");

const renderMatrixRow = (
  column: PrintColumn,
  passIndex: number,
  variants: readonly PrintPriceRow[],
  zones: readonly PrintScopeRow[],
): string =>
  [
    `<tr${when(column.featured, ' class="wall-row-featured"')}>`,
    renderPassLabel(column),
    ...variants.map((row) => renderPriceCell(row.cells[passIndex] ?? null)),
    renderPriceCell(null),
    ...zones.map(
      (zone, index) =>
        `<td class="wall-check-cell${when(index === 0, " wall-group-start")}">` +
        `${zone.cells[passIndex] ? CHECK_ICON : '<span class="wall-dot">—</span>'}</td>`,
    ),
    "</tr>",
  ].join("\n");

const renderService = (service: PrintService): string =>
  [
    '<div class="wall-service">',
    '<div class="wall-service-copy">',
    `<h3>${escapeHtml(service.name)}</h3>`,
    `<p class="wall-service-desc">${escapeHtml(service.description)}</p>`,
    when(
      service.details.length > 0,
      `<p class="wall-service-details">${service.details.map(escapeHtml).join(" · ")}</p>`,
    ),
    "</div>",
    `<p class="wall-service-price${service.price ? "" : " note"}">${escapeHtml(service.price ?? service.price_note ?? "")}</p>`,
    "</div>",
  ].join("\n");

const renderPartner = (partner: PrintPartner): string =>
  `<li class="wall-partner">${escapeHtml(partner.name)}<span class="wall-partner-badge">${escapeHtml(partner.badge)}</span></li>`;

const renderStep = (text: string, index: number): string =>
  [
    '<div class="wall-step">',
    `<span class="wall-step-num">${String(index + 1).padStart(2, "0")}</span>`,
    `<span class="wall-step-text">${escapeHtml(text)}</span>`,
    "</div>",
  ].join("\n");

const renderAccess = (doc: PrintPriceList): string =>
  [
    '<div class="wall-access">',
    '<div class="wall-access-item">',
    '<span class="wall-access-label">Wejście jednorazowe</span>',
    `<span class="wall-access-value">${escapeHtml(doc.single_entry.price)}</span>`,
    `<span class="wall-access-desc">${escapeHtml(doc.single_entry.validity)}</span>`,
    "</div>",
    '<div class="wall-access-item">',
    '<span class="wall-access-label">Karta klubowa</span>',
    `<span class="wall-access-value">${escapeHtml(doc.club_card_fee)}</span>`,
    '<span class="wall-access-desc">przy rejestracji karnetu</span>',
    "</div>",
    '<div class="wall-access-item">',
    '<span class="wall-access-label">Dostęp</span>',
    `<span class="wall-access-value">${escapeHtml(doc.access_window)}</span>`,
    '<span class="wall-access-desc">po odebraniu karty</span>',
    "</div>",
    "</div>",
  ].join("\n");


const renderSingleEntryRow = (doc: PrintPriceList): string =>
  [
    '<tr class="wall-row-single">',
    '<th scope="row" class="wall-pass wall-single-label">',
    '<span class="wall-pass-name">KARNET JEDNORAZOWY</span>',
    `<span class="wall-pass-sub">${escapeHtml(doc.single_entry.validity)} · bez rejestracji</span>`,
    "</th>",
    ...doc.passes.rows.map(() => renderPriceCell(null)),
    '<td class="wall-price-cell wall-single-price">',
    `<span class="wall-price">${escapeHtml(doc.single_entry.price)}</span>`,
    "</td>",
    `<td colspan="${doc.scope.rows.length}" class="wall-single-scope wall-group-start">`,
    "wszystkie strefy i zajęcia grupowe",
    "</td>",
    "</tr>",
  ].join("\n");

export function renderWallPriceList(doc: PrintPriceList, assets: WallAssets): string {
  const { passes, scope } = doc;
  const variantHeads = passes.rows.map(renderVariantHead).join("\n");
  const zoneHeads = scope.rows.map((row, index) => renderZoneHead(row, index)).join("\n");
  const rows = passes.columns
    .map((column, index) => renderMatrixRow(column, index, passes.rows, scope.rows))
    .join("\n");
  const services = doc.services.map(renderService).join("\n");
  const steps = doc.how_to_start.map(renderStep).join("\n");
  const rules = doc.policy_notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("\n");
  const partners = doc.partners.map(renderPartner).join("\n");
  const reception = doc.hours.reception.join(" · ");

  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(doc.title)} ścienny — ${escapeHtml(doc.kicker)}</title>
<meta name="generator" content="${escapeHtml(doc.source.generator)} · model ${escapeHtml(doc.source.model_version)}">
<meta name="dcterms.created" content="${escapeHtml(doc.source.generated_at)}">
<style>
${assets.font_css}
${wallStyles(doc.theme)}
</style>
</head>
<body>
<section class="wall-sheet" aria-label="Cennik ścienny">
  <header class="wall-head">
    ${renderBrand(doc, assets)}
    <div class="wall-title">
      <p class="wall-kicker">${escapeHtml(doc.kicker)}</p>
      <h1>${escapeHtml(doc.title)}</h1>
      <p class="wall-validity">${escapeHtml(doc.validity_note)}</p>
      <p class="wall-quick">Karta klubowa ${escapeHtml(doc.club_card_fee)} · dostęp ${escapeHtml(doc.access_window)}</p>
    </div>
  </header>

  <table class="wall-table wall-price-table">
    <caption class="wall-sr-only">${escapeHtml(passes.caption)}</caption>
    <colgroup>
      <col class="wall-label-col">
      ${passes.rows.map(() => '<col class="wall-variant-col">').join("")}
      <col class="wall-variant-col">
      ${scope.rows.map(() => '<col class="wall-zone-col">').join("")}
    </colgroup>
    <thead>
      <tr class="wall-group-row">
        <th rowspan="2" scope="col" class="wall-corner">Karnet</th>
        <th colspan="${passes.rows.length + 1}" scope="colgroup" class="wall-group">Warianty <span class="wall-group-note">ceny w zł</span></th>
        <th colspan="${scope.rows.length}" scope="colgroup" class="wall-group wall-group-start">Zakres <span class="wall-group-note">✓ w cenie</span></th>
      </tr>
      <tr class="wall-column-row">
        ${variantHeads}
        <th scope="col">1 wejście</th>
        ${zoneHeads}
      </tr>
    </thead>
    <tbody>${rows}${renderSingleEntryRow(doc)}</tbody>
  </table>

</section>

<section class="wall-sheet wall-sheet-info" aria-label="Usługi i zasady">
  <header class="wall-head">
    ${renderBrand(doc, assets, false)}
    <div class="wall-title">
      <p class="wall-kicker">Cennik · strona 2 z ${PAGE_COUNT}</p>
      <h1 class="wall-title-secondary">Usługi i zasady</h1>
      <p class="wall-validity">${escapeHtml(doc.validity_note)}</p>
    </div>
  </header>

  <div class="wall-info-grid">
    <div class="wall-info-column">
      <div class="wall-info-head">
        <h2>Usługi dodatkowe</h2>
        <span>ceny i rezerwacja</span>
      </div>
      <div class="wall-services">${services}</div>

      <div class="wall-info-head wall-info-head-gap">
        <h2>Jak zacząć</h2>
        <span>4 kroki</span>
      </div>
      <div class="wall-steps">${steps}</div>
    </div>

    <div class="wall-info-column">
      <div class="wall-info-head">
        <h2>Dostęp i karta</h2>
        <span>24/7</span>
      </div>
      ${renderAccess(doc)}
      <p class="wall-reception"><strong>Recepcja</strong> ${escapeHtml(reception)}</p>

      <div class="wall-info-head wall-info-head-gap">
        <h2>Zasady</h2>
      </div>
      <ul class="wall-rules">${rules}</ul>

      <div class="wall-info-head wall-info-head-gap">
        <h2>Karty sportowe</h2>
      </div>
      <ul class="wall-partners">${partners}</ul>
      <p class="wall-partners-note">${escapeHtml(doc.partners_note)}</p>
    </div>
  </div>

    <section class="wall-discounts">
      <div class="wall-info-head">
        <h2>Karnety ulgowe</h2>
        <span>wymagany dokument</span>
      </div>
      <p class="wall-discounts-text">${escapeHtml(passes.perk_notes[0]?.label ?? "")}</p>
    </section>

  <footer class="wall-info-foot">
    <div>
      <span class="wall-foot-label">Telefon / e-mail</span>
      <strong>${escapeHtml(doc.contact.phone)}</strong>
      <span>${escapeHtml(doc.contact.email)}</span>
    </div>
    <div>
      <span class="wall-foot-label">Adres / strona</span>
      <strong>${escapeHtml(doc.contact.address)}</strong>
      <span>${escapeHtml(doc.contact.website_label)}</span>
    </div>
    <div>
      <span class="wall-foot-label">Recepcja</span>
      ${doc.hours.reception.map((row) => `<span>${escapeHtml(row)}</span>`).join("")}
    </div>
  </footer>
</section>
</body>
</html>
`;
}
