import type { PrintTheme } from "../0-print/0-types";
import { withAlpha } from "../0-print/1-format";

/**
 * Cennik ścienny A4 poziomo.
 *
 * Jedna tabela: wspólna kolumna karnetów, grupa wariantów cenowych po lewej
 * i grupa stref po prawej. Nagłówki stref są pełne, obrócone o 90° i zawijane
 * w kolumnach 15 mm. Dzięki zawijaniu nagłówek nie musi być wysoki.
 */

export function wallStyles(theme: PrintTheme): string {
  return `
:root {
  --paper: ${theme.paper};
  --ink: ${theme.ink};
  --brand: ${theme.brand};
  --brand-text: ${theme.brand_text};
  --on-brand: ${theme.on_brand};
  --rule: ${withAlpha(theme.ink, 0.18)};
  --rule-soft: ${withAlpha(theme.ink, 0.09)};
  --muted: ${withAlpha(theme.ink, 0.64)};
  --faint: ${withAlpha(theme.ink, 0.38)};
  --tint: ${withAlpha(theme.brand, 0.055)};
  --font-display: "${theme.display_family}", "Archivo", "Arial Narrow", sans-serif;
  --font-body: "${theme.body_family}", "Inter", system-ui, sans-serif;
  --font-mono: ${theme.mono_family}, ui-monospace, "DejaVu Sans Mono", monospace;
}

@page {
  size: A4 landscape;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  padding: 0;
  background: #d9d7d2;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 10pt;
  line-height: 1.35;
  font-variant-numeric: tabular-nums;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.wall-sheet {
  position: relative;
  width: 297mm;
  min-height: 210mm;
  padding: 6.5mm 7mm 4.5mm;
  background: var(--paper);
  display: flex;
  flex-direction: column;
}

.wall-sheet::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 2.8mm;
  background: var(--brand);
}

/* --- nagłówek ---------------------------------------------------- */

.wall-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10mm;
  padding-top: 1.4mm;
  padding-bottom: 1.6mm;
  border-bottom: 0.6pt solid var(--rule);
}

.wall-brand {
  display: flex;
  align-items: center;
  gap: 3mm;
}

.wall-brand-mark {
  display: block;
  width: 13mm;
  height: auto;
}

.wall-brand-name {
  display: block;
  font-family: var(--font-display);
  font-size: 25pt;
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.wall-brand-sub {
  display: block;
  margin-top: 1.4mm;
  font-family: var(--font-mono);
  font-size: 6pt;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--muted);
}

.wall-contact {
  display: block;
  margin-top: 1.2mm;
  font-size: 7.2pt;
  line-height: 1.3;
  color: var(--muted);
}

.wall-title {
  text-align: right;
}

.wall-kicker {
  margin: 0 0 1.4mm;
  font-family: var(--font-mono);
  font-size: 7pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.wall-title h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 40pt;
  font-weight: 800;
  line-height: 0.82;
  letter-spacing: -0.045em;
  text-transform: uppercase;
}

.wall-validity {
  margin: 1.6mm 0 0;
  font-size: 8.2pt;
  color: var(--muted);
}

.wall-quick {
  margin: 0.9mm 0 0;
  font-size: 8pt;
  font-weight: 600;
  color: var(--brand-text);
}


/* --- wejście jednorazowe w tabeli ------------------------------- */

.wall-row-single {
  height: 21mm;
}

.wall-row-single .wall-single-label {
  border-top: 1.2pt solid var(--ink);
}

.wall-table td.wall-single-price {
  border-top: 1.2pt solid var(--ink);
  text-align: center;
}

.wall-single-price .wall-price {
  font-size: 25pt;
}


.wall-single-label .wall-pass-name {
  font-size: 9.5pt;
}

.wall-table td.wall-single-scope {
  border-top: 1.2pt solid var(--ink);
  text-align: center;
  font-size: 9.5pt;
  line-height: 1.3;
  color: var(--muted);
}

/* --- tytuł tabeli ------------------------------------------------ */

.wall-table-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4mm;
  margin-top: 2.5mm;
  margin-bottom: 1.2mm;
  padding-bottom: 1mm;
  border-bottom: 1.2pt solid var(--ink);
}

.wall-table-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 12.5pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.wall-table-head span {
  font-family: var(--font-mono);
  font-size: 8.2pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}

/* --- jedna tabela ------------------------------------------------ */

.wall-sheet-prices .wall-table {
  margin-top: 3.5mm;
}

.wall-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.wall-label-col {
  width: 28mm;
}

.wall-variant-col {
  width: 25mm;
}

.wall-zone-col {
  width: 15mm;
}

.wall-table th,
.wall-table td {
  padding: 1.2mm 1.6mm;
  border-bottom: 0.4pt solid var(--rule-soft);
  text-align: left;
  vertical-align: middle;
}

.wall-table tbody tr {
  height: 21mm;
}

.wall-table tbody tr:last-child th,
.wall-table tbody tr:last-child td {
  border-bottom: 1pt solid var(--ink);
}

/* --- nagłówki grup i kolumn ------------------------------------- */

.wall-group-row th {
  padding-top: 0.9mm;
  padding-bottom: 0.9mm;
  border-bottom: 0.8pt solid var(--ink);
  background: var(--tint);
  font-family: var(--font-display);
  font-size: 9.6pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.wall-group-note {
  margin-left: 2mm;
  font-family: var(--font-mono);
  font-size: 6.6pt;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.wall-group-row .wall-corner {
  background: transparent;
  border-bottom: 1.2pt solid var(--ink);
  font-family: var(--font-body);
  font-size: 9.2pt;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  vertical-align: middle;
}

.wall-group-start {
  border-left: 1.2pt solid var(--ink);
}

.wall-column-row th {
  height: 24mm;
  padding: 1mm 0.5mm 1.2mm;
  border-bottom: 1.2pt solid var(--ink);
  font-family: var(--font-body);
  font-size: 9.2pt;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  text-align: center;
  vertical-align: middle;
}

/* --- tabela: karnety, ceny, zakres ------------------------------- */

.wall-table .wall-row-featured {
  background: var(--tint);
}

.wall-table .wall-row-featured .wall-pass {
  border-left: 2.4mm solid var(--brand);
}

.wall-pass {
  padding-top: 1.2mm;
  padding-bottom: 1.2mm;
}

.wall-pass-name {
  display: block;
  font-family: var(--font-display);
  font-size: 13pt;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.015em;
  text-transform: uppercase;
}

.wall-pass-sub {
  display: block;
  margin-top: 0.5mm;
  font-size: 7pt;
  line-height: 1.2;
  color: var(--muted);
}

.wall-table td.wall-price-cell {
  text-align: right;
}

.wall-table td.wall-check-cell {
  text-align: center;
}

.wall-price {
  font-family: var(--font-display);
  font-size: 22pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.035em;
  white-space: nowrap;
}

.wall-price sup {
  margin-left: 0.4mm;
  font-family: var(--font-mono);
  font-size: 7.5pt;
  font-weight: 600;
  line-height: 0;
  vertical-align: super;
  color: var(--brand-text);
}

.wall-empty {
  font-family: var(--font-mono);
  font-size: 12pt;
  color: var(--faint);
}

.wall-zone-col {
  text-align: center;
  vertical-align: bottom;
}

.wall-zone-head {
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1.2mm;
  max-width: 100%;
  padding-top: 1mm;
  vertical-align: middle;
}

.wall-zone-line {
  display: block;
  writing-mode: sideways-lr;
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 7pt;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--ink);
}

.wall-check {
  display: inline-block;
  width: 4mm;
  height: 4mm;
  color: var(--brand);
}

.wall-dot {
  font-family: var(--font-mono);
  font-size: 9pt;
  color: var(--faint);
}

.wall-perks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8mm 5mm;
  margin: 1.4mm 0 0;
  padding: 0;
  list-style: none;
  font-size: 8pt;
  line-height: 1.3;
  color: var(--muted);
}

.wall-perk-num {
  margin-right: 0.8mm;
  font-family: var(--font-mono);
  font-size: 6.8pt;
  color: var(--brand-text);
}


/* --- strona 2: usługi i zasady ---------------------------------- */

.wall-sheet + .wall-sheet {
  page-break-before: always;
  break-before: page;
}

.wall-title h1.wall-title-secondary {
  font-size: 30pt;
  line-height: 0.9;
}

.wall-info-grid {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 11mm;
  margin-top: 5mm;
  align-items: start;
}

.wall-info-column {
  min-width: 0;
}

.wall-info-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4mm;
  margin-bottom: 1.8mm;
  padding-bottom: 1mm;
  border-bottom: 1.2pt solid var(--ink);
}

.wall-info-head-gap {
  margin-top: 8mm;
}

.wall-info-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 13.5pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}

.wall-info-head span {
  font-family: var(--font-mono);
  font-size: 7pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}

/* usługi */

.wall-services {
  border-top: 0.6pt solid var(--rule);
}

.wall-service {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.8mm 4mm;
  padding: 3.2mm 0;
  border-bottom: 0.5pt solid var(--rule-soft);
}

.wall-service h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 10.5pt;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.wall-service-price {
  margin: 0;
  font-family: var(--font-display);
  font-size: 16pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--brand-text);
  text-align: right;
  white-space: nowrap;
}

.wall-service-price.note {
  font-size: 9pt;
  font-weight: 600;
  color: var(--muted);
}

.wall-service-desc {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 10.2pt;
  line-height: 1.4;
  color: var(--muted);
}

.wall-service-details {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 9.2pt;
  line-height: 1.35;
  color: var(--faint);
}

/* jak zacząć */

.wall-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 3mm;
  margin-top: 3mm;
}

.wall-step {
  padding-top: 2mm;
  border-top: 1.6pt solid var(--brand);
}

.wall-step-num {
  display: block;
  font-family: var(--font-mono);
  font-size: 7pt;
  letter-spacing: 0.14em;
  color: var(--brand-text);
}

.wall-step-text {
  display: block;
  margin-top: 1.2mm;
  font-size: 10pt;
  line-height: 1.35;
}

/* dostęp i karta */

.wall-access {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  background: var(--tint);
  border-top: 1.2pt solid var(--ink);
  border-bottom: 0.8pt solid var(--ink);
}

.wall-access-item {
  padding: 3.2mm 2.2mm;
  border-right: 0.5pt solid var(--rule);
}

.wall-access-item:last-child {
  border-right: 0;
}

.wall-access-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 6.8pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.wall-access-value {
  display: block;
  margin-top: 1mm;
  font-family: var(--font-display);
  font-size: 22pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--brand-text);
}

.wall-access-desc {
  display: block;
  margin-top: 1mm;
  font-size: 8.8pt;
  line-height: 1.3;
  color: var(--muted);
}

.wall-reception {
  margin: 2.8mm 0 0;
  font-size: 9pt;
  line-height: 1.35;
  color: var(--muted);
}

.wall-reception strong {
  margin-right: 1.2mm;
  font-family: var(--font-mono);
  font-size: 6.8pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink);
}

/* zasady */

.wall-rules {
  margin: 3mm 0 0;
  padding: 0;
  list-style: none;
}

.wall-rules li {
  position: relative;
  margin-bottom: 3.2mm;
  padding-left: 3.6mm;
  font-size: 10.2pt;
  line-height: 1.5;
}

.wall-rules li:last-child {
  margin-bottom: 0;
}

.wall-rules li::before {
  content: "";
  position: absolute;
  top: 1.3mm;
  left: 0;
  width: 1.5mm;
  height: 1.5mm;
  background: var(--brand);
}

/* karty sportowe */

.wall-partners {
  display: flex;
  flex-wrap: wrap;
  gap: 2mm;
  margin: 3mm 0 0;
  padding: 0;
  list-style: none;
}

.wall-partner {
  padding: 1.6mm 2.2mm;
  border: 0.5pt solid var(--rule);
  font-size: 10.2pt;
  line-height: 1.2;
}

.wall-partner-badge {
  display: block;
  margin-top: 0.5mm;
  font-family: var(--font-mono);
  font-size: 7pt;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted);
}

.wall-partners-note {
  margin: 2.8mm 0 0;
  font-size: 9pt;
  line-height: 1.4;
  color: var(--muted);
}

/* karnety ulgowe */

.wall-discounts {
  margin-top: 8mm;
}

.wall-discounts-text {
  margin: 2mm 0 0;
  font-size: 9.6pt;
  line-height: 1.4;
  color: var(--muted);
}

/* stopka strony 2 */

.wall-info-foot {
  margin-top: auto;
  padding-top: 2.6mm;
  display: grid;
  grid-template-columns: 1fr 1.1fr 1fr;
  gap: 6mm;
  border-top: 1.2pt solid var(--ink);
  font-size: 9pt;
  line-height: 1.4;
  color: var(--muted);
}

.wall-info-foot span {
  display: block;
}

.wall-foot-label {
  margin-bottom: 1mm;
  font-family: var(--font-mono);
  font-size: 6.8pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.wall-info-foot strong {
  display: block;
  margin-bottom: 0.6mm;
  font-size: 10pt;
  line-height: 1.3;
  color: var(--ink);
}

.wall-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media screen {
  body {
    padding: 12mm 0;
  }

  .wall-sheet {
    margin: 0 auto;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
  }

  .wall-sheet + .wall-sheet {
    margin-top: 12mm;
  }
}

@media print {
  body {
    background: var(--paper);
    padding: 0;
  }

  .wall-sheet {
    margin: 0;
    box-shadow: none;
  }
}
`;
}
