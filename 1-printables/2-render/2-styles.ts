import type { PrintTheme } from "../0-print/0-types";
import { withAlpha } from "../0-print/1-format";

/**
 * Dwie strony A4 pion — „papier” marki: jasne tło, czarny tekst, czerwień
 * jako akcent.
 *
 * Strona 1 trzyma cennik i zakres jeden pod drugim, strona 2 — usługi,
 * zasady i karty sportowe. Taki podział pozwala użyć typografii czytelnej
 * z odległości kilku metrów, bez ściskania tabeli na jednym arkuszu.
 *
 * Wymiary w milimetrach i punktach, bo dokument ma wyjść z drukarki, a nie
 * przeskalować się w oknie przeglądarki. Zasady marki: ostre krawędzie,
 * włosowe linie, czerwień tylko w akcentach, wersaliki w nagłówkach.
 */

export function printStyles(theme: PrintTheme): string {
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
  size: A4 portrait;
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
  font-size: 9.5pt;
  line-height: 1.38;
  font-variant-numeric: tabular-nums;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.sheet {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  padding: 9mm 12mm 7mm;
  background: var(--paper);
  display: flex;
  flex-direction: column;
}

.sheet::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 2.4mm;
  background: var(--brand);
}

.sheet + .sheet {
  page-break-before: always;
  break-before: page;
}

.sheet-info {
  justify-content: space-between;
}

.sheet-info .foot {
  margin-top: 0;
}

/* --- nagłówek ---------------------------------------------------- */

.masthead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8mm;
  padding-top: 1.5mm;
  border-bottom: 0.5pt solid var(--rule);
  padding-bottom: 3.4mm;
}

.brand {
  display: flex;
  align-items: center;
  gap: 3mm;
}

.brand-mark {
  display: block;
  width: 14mm;
  height: auto;
}

.brand-name {
  display: block;
  font-family: var(--font-display);
  font-size: 22pt;
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.brand-sub {
  display: block;
  margin-top: 1.8mm;
  font-family: var(--font-mono);
  font-size: 6.2pt;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--muted);
}

.title {
  text-align: right;
}

.kicker {
  margin: 0 0 1.8mm;
  font-family: var(--font-mono);
  font-size: 7pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.title h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 38pt;
  font-weight: 800;
  line-height: 0.82;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.title h1.title-secondary {
  font-size: 29pt;
  line-height: 0.9;
}

.intro {
  margin: 2mm 0 0 auto;
  max-width: 78mm;
  font-size: 8.2pt;
  line-height: 1.35;
  color: var(--muted);
}

/* --- wejście jednorazowe ----------------------------------------- */

.entry {
  display: flex;
  align-items: center;
  gap: 5mm;
  margin-top: 3.4mm;
  padding: 3mm 5.2mm;
  background: var(--tint);
  border: 0.5pt solid var(--rule);
  border-left: 2.5mm solid var(--brand);
}

.entry-copy {
  flex: 1;
}

.entry-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 6.5pt;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}

.entry h2 {
  margin: 0.9mm 0 0;
  font-family: var(--font-display);
  font-size: 16pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.entry-desc {
  margin: 1.6mm 0 0;
  max-width: 112mm;
  font-size: 8.8pt;
  line-height: 1.35;
  color: var(--muted);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 1.4mm;
  margin: 2mm 0 0;
  padding: 0;
  list-style: none;
}

.chip {
  padding: 0.9mm 1.8mm;
  border: 0.4pt solid var(--rule);
  font-family: var(--font-mono);
  font-size: 6.5pt;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.entry-price {
  flex-shrink: 0;
  text-align: right;
}

.amount {
  display: block;
  font-family: var(--font-display);
  font-size: 28pt;
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--brand-text);
  white-space: nowrap;
}

.entry-price .unit {
  display: block;
  margin-top: 1.2mm;
  font-family: var(--font-mono);
  font-size: 6.8pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

.entry-price .validity {
  display: block;
  margin-top: 0.7mm;
  font-size: 7.6pt;
  color: var(--muted);
}

/* --- sekcje ------------------------------------------------------ */

.section {
  margin-top: 4mm;
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4mm;
  margin-bottom: 2mm;
  padding-bottom: 1.2mm;
  border-bottom: 1pt solid var(--ink);
}

.section-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 14pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.section-head .meta {
  font-family: var(--font-mono);
  font-size: 6.8pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

/* --- tabela cen i zakresu ---------------------------------------- */

.matrix {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.matrix th,
.matrix td {
  padding: 2.2mm 2.4mm;
  border-bottom: 0.4pt solid var(--rule-soft);
  text-align: left;
  vertical-align: middle;
}

.matrix thead th {
  padding-top: 0;
  padding-bottom: 1.8mm;
  border-bottom: 0.9pt solid var(--ink);
  vertical-align: top;
}

.price-body tr:last-child th,
.price-body tr:last-child td {
  border-bottom: 0.9pt solid var(--ink);
}

.matrix .col-featured {
  background: var(--tint);
}

.matrix thead th.col-featured {
  border-top: 1.6pt solid var(--brand);
}

.col-index {
  display: block;
  font-family: var(--font-mono);
  font-size: 6.2pt;
  letter-spacing: 0.18em;
  color: var(--faint);
}

.col-name {
  display: block;
  margin-top: 1.6mm;
  font-family: var(--font-display);
  font-size: 11pt;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.015em;
  text-transform: uppercase;
}

.col-sub {
  display: block;
  margin-top: 1.2mm;
  font-size: 8.2pt;
  line-height: 1.28;
  color: var(--muted);
}

.badge {
  display: inline-block;
  margin-top: 1.5mm;
  padding: 0.8mm 1.6mm;
  background: var(--brand);
  color: var(--on-brand);
  font-family: var(--font-mono);
  font-size: 6.2pt;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.variant {
  font-family: var(--font-display);
  font-size: 11pt;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.price {
  font-family: var(--font-display);
  font-size: 18pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.025em;
  white-space: nowrap;
}

.price sup {
  margin-left: 0.6mm;
  font-family: var(--font-mono);
  font-size: 6.5pt;
  font-weight: 600;
  line-height: 0;
  vertical-align: super;
  color: var(--brand-text);
}

.empty {
  font-family: var(--font-mono);
  font-size: 10pt;
  color: var(--faint);
}

.matrix-note {
  margin: 2mm 0 0;
  font-size: 8.6pt;
  line-height: 1.4;
  color: var(--muted);
}

.perks {
  display: flex;
  flex-wrap: wrap;
  gap: 1mm 5mm;
  margin: 1.2mm 0 0;
  padding: 0;
  list-style: none;
  font-size: 8.2pt;
  line-height: 1.35;
  color: var(--muted);
}

.perks .num {
  margin-right: 1mm;
  font-family: var(--font-mono);
  font-size: 7pt;
  color: var(--brand-text);
}

/* --- zakres ------------------------------------------------------ */

.matrix .col-variant {
  width: 38mm;
}

.scope-lead th {
  padding: 2.4mm 2.4mm 2mm;
  background: var(--tint);
  border-top: 1pt solid var(--ink);
  border-bottom: 0.8pt solid var(--ink);
  font-family: var(--font-mono);
  font-size: 7pt;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.scope-label {
  margin-right: 2.8mm;
  color: var(--ink);
}

.scope-note {
  font-weight: 400;
}

.scope-body th,
.scope-body td {
  padding-top: 1.7mm;
  padding-bottom: 1.7mm;
}

.scope-area {
  font-size: 9.5pt;
  font-weight: 500;
  line-height: 1.25;
}

.scope-body .check {
  display: block;
  width: 3.2mm;
  height: 3.2mm;
  color: var(--brand);
}

.scope-body .dot {
  font-family: var(--font-mono);
  font-size: 8pt;
  color: var(--faint);
}

/* --- strona 2: usługi i zasady ---------------------------------- */

.info-section {
  margin-top: 8mm;
}

.info-section-last {
  margin-top: 10mm;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6mm;
  margin-top: 5mm;
}

.service-card {
  display: flex;
  flex-direction: column;
  min-height: 58mm;
  padding-top: 4mm;
  border-top: 1.6pt solid var(--brand);
}

.service-top {
  display: flex;
  flex-direction: column;
  gap: 1.4mm;
}

.service-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 14pt;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.service-price {
  margin: 0;
  font-family: var(--font-display);
  font-size: 15pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--brand-text);
}

.service-price.note {
  font-size: 9.5pt;
  font-weight: 600;
  color: var(--muted);
}

.service-desc {
  margin: 3mm 0 0;
  font-size: 10pt;
  line-height: 1.45;
  color: var(--muted);
}

.service-details {
  margin: 2.2mm 0 0;
  font-size: 9.2pt;
  line-height: 1.4;
  color: var(--muted);
}

.info-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 12mm;
}

.rules {
  margin: 4mm 0 0;
  padding: 0;
  list-style: none;
}

.rules li {
  position: relative;
  margin-bottom: 3.8mm;
  padding-left: 4.2mm;
  font-size: 10.5pt;
  line-height: 1.45;
}

.rules li:last-child {
  margin-bottom: 0;
}

.rules li::before {
  content: "";
  position: absolute;
  top: 1.5mm;
  left: 0;
  width: 1.6mm;
  height: 1.6mm;
  background: var(--brand);
}

.partner-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2mm;
  margin: 4mm 0 0;
  padding: 0;
  list-style: none;
}

.partner {
  padding: 1.8mm 2.4mm;
  border: 0.5pt solid var(--rule);
  font-size: 10pt;
  line-height: 1.2;
}

.partner .badge-note {
  display: block;
  margin-top: 0.7mm;
  font-family: var(--font-mono);
  font-size: 7pt;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.partners-note {
  margin: 4mm 0 0;
  font-size: 9.5pt;
  line-height: 1.45;
  color: var(--muted);
}


/* --- strona 2: skrót dostępu ------------------------------------- */

.access-band {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 10mm;
  background: var(--tint);
  border-top: 1.4pt solid var(--ink);
  border-bottom: 0.8pt solid var(--ink);
}

.access-item {
  padding: 4.4mm 5mm;
  border-right: 0.5pt solid var(--rule);
}

.access-item:last-child {
  border-right: 0;
}

.access-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 7pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

.access-value {
  display: block;
  margin-top: 1.4mm;
  font-family: var(--font-display);
  font-size: 22pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--brand-text);
}

.access-desc {
  display: block;
  margin-top: 1.4mm;
  font-size: 8.6pt;
  line-height: 1.35;
  color: var(--muted);
}

/* --- stopka ------------------------------------------------------ */


.foot {
  margin-top: auto;
  padding-top: 2mm;
  display: grid;
  grid-template-columns: 1.1fr 1fr 1.1fr;
  gap: 5mm;
  border-top: 0.9pt solid var(--ink);
  font-size: 8pt;
  line-height: 1.4;
  color: var(--muted);
}

.foot strong {
  display: block;
  margin-bottom: 1.2mm;
  font-family: var(--font-mono);
  font-size: 6.6pt;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink);
}

.foot a {
  color: inherit;
  text-decoration: none;
}

.foot .row {
  display: block;
}

.legal {
  margin-top: 1.4mm;
  padding-top: 1mm;
  border-top: 0.4pt solid var(--rule-soft);
  font-family: var(--font-mono);
  font-size: 7pt;
  line-height: 1.35;
  letter-spacing: 0.02em;
  color: var(--muted);
}

.sr-only {
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
    padding: 14mm 0;
  }

  .sheet {
    margin: 0 auto;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
  }

  .sheet + .sheet {
    margin-top: 14mm;
  }
}

@media print {
  body {
    background: var(--paper);
    padding: 0;
  }

  .sheet {
    margin: 0;
    box-shadow: none;
  }
}
`;
}
