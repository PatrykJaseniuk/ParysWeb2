import type { PrintTheme } from "../0-print/0-types";
import { withAlpha } from "../0-print/1-format";

/**
 * Arkusz A4 — „papier” marki: jasne tło, czarny tekst, czerwień jako akcent.
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
  font-size: 7.4pt;
  line-height: 1.38;
  font-variant-numeric: tabular-nums;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.sheet {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  padding: 12mm 13mm 7mm;
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
}

/* --- nagłówek ---------------------------------------------------- */

.masthead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8mm;
  padding-top: 1.5mm;
  border-bottom: 0.5pt solid var(--rule);
  padding-bottom: 3.6mm;
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
  font-size: 21pt;
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.brand-sub {
  display: block;
  margin-top: 1.8mm;
  font-family: var(--font-mono);
  font-size: 5.6pt;
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
  font-size: 5.8pt;
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

.intro {
  margin: 2mm 0 0 auto;
  max-width: 74mm;
  font-size: 6.8pt;
  line-height: 1.35;
  color: var(--muted);
}

/* --- sekcje ------------------------------------------------------ */

.section {
  margin-top: 3.4mm;
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4mm;
  margin-bottom: 1.8mm;
  padding-bottom: 1.1mm;
  border-bottom: 1pt solid var(--ink);
}

.section-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 12pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.section-head .meta {
  font-family: var(--font-mono);
  font-size: 5.6pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

/* --- wejście jednorazowe ----------------------------------------- */

.entry {
  display: flex;
  align-items: center;
  gap: 5mm;
  margin-top: 3.6mm;
  padding: 3.2mm 5mm;
  background: var(--tint);
  border: 0.5pt solid var(--rule);
  border-left: 2.2mm solid var(--brand);
}

.entry-copy {
  flex: 1;
}

.entry-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 5.5pt;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}

.entry h2 {
  margin: 0.8mm 0 0;
  font-family: var(--font-display);
  font-size: 14pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.entry-desc {
  margin: 1.4mm 0 0;
  max-width: 108mm;
  font-size: 6.8pt;
  color: var(--muted);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2mm;
  margin: 1.8mm 0 0;
  padding: 0;
  list-style: none;
}

.chip {
  padding: 0.8mm 1.6mm;
  border: 0.4pt solid var(--rule);
  font-family: var(--font-mono);
  font-size: 5.4pt;
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
  font-size: 23pt;
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--brand-text);
  white-space: nowrap;
}

.entry-price .unit {
  display: block;
  margin-top: 1mm;
  font-family: var(--font-mono);
  font-size: 5.6pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

.entry-price .validity {
  display: block;
  margin-top: 0.6mm;
  font-size: 6.2pt;
  color: var(--muted);
}

/* --- tabela cen -------------------------------------------------- */

.matrix {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.matrix th,
.matrix td {
  padding: 1.6mm 2.4mm;
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

.matrix tbody tr:last-child th,
.matrix tbody tr:last-child td {
  border-bottom: 0.6pt solid var(--ink);
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
  font-size: 5.4pt;
  letter-spacing: 0.18em;
  color: var(--faint);
}

.col-name {
  display: block;
  margin-top: 1.4mm;
  font-family: var(--font-display);
  font-size: 9.2pt;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.015em;
  text-transform: uppercase;
}

.col-sub {
  display: block;
  margin-top: 1mm;
  font-size: 6.1pt;
  line-height: 1.25;
  color: var(--muted);
}

.badge {
  display: inline-block;
  margin-top: 1.4mm;
  padding: 0.7mm 1.4mm;
  background: var(--brand);
  color: var(--on-brand);
  font-family: var(--font-mono);
  font-size: 4.9pt;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.variant {
  font-family: var(--font-display);
  font-size: 8.2pt;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.price {
  font-family: var(--font-display);
  font-size: 13pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.025em;
  white-space: nowrap;
}

.price sup {
  margin-left: 0.5mm;
  font-family: var(--font-mono);
  font-size: 5pt;
  font-weight: 600;
  line-height: 0;
  vertical-align: super;
  color: var(--brand-text);
}

.empty {
  font-family: var(--font-mono);
  font-size: 8pt;
  color: var(--faint);
}

.matrix-note {
  margin: 1.8mm 0 0;
  font-size: 6.1pt;
  line-height: 1.35;
  color: var(--muted);
}

.perks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8mm 4mm;
  margin: 1.2mm 0 0;
  padding: 0;
  list-style: none;
  font-size: 6pt;
  line-height: 1.3;
  color: var(--muted);
}

.perks .num {
  margin-right: 0.8mm;
  font-family: var(--font-mono);
  font-size: 5.2pt;
  color: var(--brand-text);
}

/* --- zakres ------------------------------------------------------ */

.matrix .col-variant {
  width: 38mm;
}

.scope-body th,
.scope-body td {
  padding-top: 1mm;
  padding-bottom: 1mm;
}

.scope-lead th {
  padding: 1.5mm 2.4mm 1mm;
  border-bottom: 0.6pt solid var(--ink);
  font-family: var(--font-mono);
  font-size: 5.6pt;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.scope-label {
  margin-right: 2.5mm;
  color: var(--ink);
}

.scope-note {
  font-weight: 400;
}

.scope-area {
  font-size: 6.3pt;
  font-weight: 500;
  line-height: 1.2;
}

.scope-body .check {
  display: block;
  width: 2.7mm;
  height: 2.7mm;
  color: var(--brand);
}

.scope-body .dot {
  font-family: var(--font-mono);
  font-size: 6pt;
  color: var(--faint);
}

/* --- usługi i zasady --------------------------------------------- */

.bottom {
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 6mm;
  margin-top: 2.6mm;
}

.column-head {
  margin: 0 0 2.2mm;
  padding-bottom: 1.2mm;
  border-bottom: 1pt solid var(--ink);
  font-family: var(--font-display);
  font-size: 10.4pt;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.service {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0 3mm;
  padding: 1.15mm 0;
  border-bottom: 0.4pt solid var(--rule-soft);
}

.service:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.service h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 8pt;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.service-desc {
  margin: 0.7mm 0 0;
  font-size: 6.2pt;
  line-height: 1.32;
  color: var(--muted);
}

.service-details {
  margin: 0.8mm 0 0;
  font-size: 5.9pt;
  line-height: 1.3;
  color: var(--muted);
}

.service-price {
  margin: 0;
  text-align: right;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: 10pt;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.service-price.note {
  font-size: 6.4pt;
  font-weight: 600;
  color: var(--muted);
}

.rules {
  margin: 0;
  padding: 0;
  list-style: none;
}

.rules li {
  position: relative;
  margin-bottom: 1.5mm;
  padding-left: 3mm;
  font-size: 6.2pt;
  line-height: 1.34;
}

.rules li::before {
  content: "";
  position: absolute;
  top: 1.15mm;
  left: 0;
  width: 1.3mm;
  height: 1.3mm;
  background: var(--brand);
}

.partners {
  margin-top: 2.4mm;
  padding-top: 2mm;
  border-top: 0.5pt solid var(--rule);
}

.partners-title {
  margin: 0 0 1.4mm;
  font-family: var(--font-mono);
  font-size: 5.5pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.partner-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2mm;
  margin: 0;
  padding: 0;
  list-style: none;
}

.partner {
  padding: 0.9mm 1.6mm;
  border: 0.4pt solid var(--rule);
  font-size: 6pt;
  line-height: 1.15;
}

.partner .badge-note {
  display: block;
  margin-top: 0.5mm;
  font-family: var(--font-mono);
  font-size: 4.7pt;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.partners-note {
  margin: 1.4mm 0 0;
  font-size: 5.8pt;
  line-height: 1.3;
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
  font-size: 5.9pt;
  line-height: 1.3;
  color: var(--muted);
}

.foot strong {
  display: block;
  margin-bottom: 1mm;
  font-family: var(--font-mono);
  font-size: 5.3pt;
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
  margin-top: 1mm;
  padding-top: 0.8mm;
  border-top: 0.4pt solid var(--rule-soft);
  font-family: var(--font-mono);
  font-size: 4.6pt;
  letter-spacing: 0.02em;
  color: var(--faint);
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
