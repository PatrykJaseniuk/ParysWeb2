import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { plural } from "../0-print/1-format";
import { priceList } from "../1-data/price-list";
import { renderPriceList } from "../2-render/price-list";
import { renderWallPriceList } from "../2-render/wall";

/**
 * Build cenników: model → dokument → samodzielny HTML → PDF.
 *
 * Powstają dwie wersje tego samego modelu:
 * - `cennik-a4` — dwustronna ulotka A4 pion (cennik + zakres, usługi i zasady),
 * - `cennik-sciana-a4` — jednostronicowy plakat A4 poziom do gabloty.
 *
 * Warstwa 3 (narzędzia) jako jedyna dotyka dysku i przeglądarki. Fonty
 * i logo wbudowujemy w HTML jako base64, więc plik można otworzyć z dowolnego
 * katalogu i wydrukować bez sieci. PDF powstaje przez Chrome w trybie
 * headless; gdy Chrome nie jest zainstalowany, zostaje poprawny HTML do
 * wydruku przez Ctrl+P.
 */

const root = fileURLToPath(new URL("..", import.meta.url));
const outputDir = join(root, "8-output");
const profileDir = join(outputDir, "tmp", "chrome-profile");

const FONT_PACKAGES = ["@fontsource-variable/archivo", "@fontsource-variable/inter"] as const;

const CHROME_CANDIDATES = [
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "google-chrome-stable",
  "google-chrome",
  "chromium",
  "chromium-browser",
] as const;

const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;
const SIZE_TOLERANCE_PT = 2;

function inlineFontFaces(packageName: string): string {
  const packageDir = join(root, "node_modules", packageName);
  const cssPath = join(packageDir, "index.css");
  if (!existsSync(cssPath)) {
    throw new Error(`Brak pakietu ${packageName}. Uruchom w 1-printables: npm install.`);
  }
  const css = readFileSync(cssPath, "utf8");
  const blocks = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
  const inlined = blocks
    .filter((block) => /-(latin|latin-ext)-wght-normal\.woff2/.test(block))
    .map((block) => {
      const file = block.match(/url\(\.\/files\/([^)]+)\)/)?.[1] ?? "";
      const base64 = readFileSync(join(packageDir, "files", file)).toString("base64");
      return block
        .replace(/url\([^)]+\)/, `url(data:font/woff2;base64,${base64})`)
        .replace("font-display: swap;", "font-display: block;");
    });
  if (inlined.length === 0) {
    throw new Error(`Nie znaleziono fontów latin/latin-ext w ${packageName}.`);
  }
  return inlined.join("\n");
}

function logoDataUri(): string {
  const logoPath = join(root, "0-assets", "icon-mark.svg");
  return `data:image/svg+xml;base64,${readFileSync(logoPath).toString("base64")}`;
}

function findChrome(): string | null {
  const candidates = [process.env.CHROME_PATH, ...CHROME_CANDIDATES].filter(
    (candidate): candidate is string => Boolean(candidate),
  );
  const resolvers = candidates.map((candidate) => {
    if (candidate.includes("/")) {
      return existsSync(candidate) ? candidate : null;
    }
    const probe = spawnSync("which", [candidate], { encoding: "utf8" });
    return probe.status === 0 ? (probe.stdout ?? "").trim() : null;
  });
  return resolvers.find((candidate): candidate is string => Boolean(candidate)) ?? null;
}

function printPdf(
  chrome: string,
  htmlPath: string,
  pdfPath: string,
): { ok: boolean; message: string } {
  mkdirSync(profileDir, { recursive: true });
  const result = spawnSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--no-pdf-header-footer",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=10000",
      `--user-data-dir=${profileDir}`,
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ],
    { encoding: "utf8", timeout: 120_000 },
  );
  rmSync(profileDir, { recursive: true, force: true });
  const ok = result.status === 0 && existsSync(pdfPath) && statSync(pdfPath).size > 0;
  const message = ok
    ? `PDF: ${pdfPath}`
    : `Chrome nie wygenerował PDF (kod ${result.status ?? "?"}): ${(result.stderr || "").trim()}`;
  return { ok, message };
}

interface PdfMetadata {
  pages: number;
  width_pt: number;
  height_pt: number;
}

/** Metadane PDF z `pdfinfo`; `null`, gdy narzędzia nie ma lub plik jest nieczytelny. */
function readPdfMetadata(path: string): PdfMetadata | null {
  const result = spawnSync("pdfinfo", [path], { encoding: "utf8", timeout: 30_000 });
  const output = result.stdout ?? "";
  const pages = Number(output.match(/^Pages:\s+(\d+)/m)?.[1] ?? 0);
  const size = output.match(/^Page size:\s+([\d.]+) x ([\d.]+)/m);
  const width = Number(size?.[1] ?? 0);
  const height = Number(size?.[2] ?? 0);
  return result.status === 0 && pages > 0 && width > 0 && height > 0
    ? { pages, width_pt: width, height_pt: height }
    : null;
}

interface DocumentSpec {
  label: string;
  html: string;
  htmlPath: string;
  pdfPath: string;
  expectedPages: number;
  orientation: "portrait" | "landscape";
}

interface DocumentResult extends DocumentSpec {
  pdf: { ok: boolean; message: string };
  pdf_meta: PdfMetadata | null;
  layout_ok: boolean;
  layout_message: string;
}

const orientationIsCorrect = (meta: PdfMetadata, orientation: DocumentSpec["orientation"]): boolean =>
  orientation === "portrait"
    ? meta.width_pt < meta.height_pt
    : meta.width_pt > meta.height_pt;

const sizeIsA4 = (meta: PdfMetadata, orientation: DocumentSpec["orientation"]): boolean =>
  orientation === "portrait"
    ? Math.abs(meta.width_pt - A4_WIDTH_PT) <= SIZE_TOLERANCE_PT &&
      Math.abs(meta.height_pt - A4_HEIGHT_PT) <= SIZE_TOLERANCE_PT
    : Math.abs(meta.width_pt - A4_HEIGHT_PT) <= SIZE_TOLERANCE_PT &&
      Math.abs(meta.height_pt - A4_WIDTH_PT) <= SIZE_TOLERANCE_PT;

function buildDocument(chrome: string | null, spec: DocumentSpec): DocumentResult {
  mkdirSync(outputDir, { recursive: true });
  rmSync(spec.pdfPath, { force: true });
  writeFileSync(spec.htmlPath, spec.html, "utf8");

  const pdf = chrome
    ? printPdf(chrome, spec.htmlPath, spec.pdfPath)
    : {
        ok: false,
        message: "Nie znaleziono Chrome — pominięto PDF. HTML wydrukujesz przez Ctrl+P.",
      };

  const pdf_meta = pdf.ok ? readPdfMetadata(spec.pdfPath) : null;
  const layout_ok =
    pdf_meta !== null &&
    pdf_meta.pages === spec.expectedPages &&
    orientationIsCorrect(pdf_meta, spec.orientation) &&
    sizeIsA4(pdf_meta, spec.orientation);
  const layout_message = pdf_meta
    ? `PDF: ${pdf_meta.pages} ${plural(pdf_meta.pages, ["strona", "strony", "stron"])} · ${pdf_meta.width_pt.toFixed(0)} × ${pdf_meta.height_pt.toFixed(0)} pt · ${layout_ok ? `A4 ${spec.orientation === "portrait" ? "pion" : "poziom"}` : "niepoprawny układ"}`
    : "PDF: nie udało się sprawdzić liczby stron (brak pdfinfo)";

  return { ...spec, pdf, pdf_meta, layout_ok, layout_message };
}

function megabytes(path: string): string {
  return `${(statSync(path).size / 1024).toFixed(0)} kB`;
}

const fontCss = FONT_PACKAGES.map(inlineFontFaces).join("\n");
const assets = {
  logo_data_uri: logoDataUri(),
  font_css: fontCss,
};

const documents: DocumentSpec[] = [
  {
    label: "cennik A4 (ulotka)",
    html: renderPriceList(priceList, assets),
    htmlPath: join(outputDir, "cennik-a4.html"),
    pdfPath: join(outputDir, "cennik-a4.pdf"),
    expectedPages: 2,
    orientation: "portrait",
  },
  {
    label: "cennik ścienny A4",
    html: renderWallPriceList(priceList, assets),
    htmlPath: join(outputDir, "cennik-sciana-a4.html"),
    pdfPath: join(outputDir, "cennik-sciana-a4.pdf"),
    expectedPages: 2,
    orientation: "landscape",
  },
];

const chrome = findChrome();
const results = documents.map((document) => buildDocument(chrome, document));

const variantCount = priceList.passes.rows.reduce(
  (count, row) => count + row.cells.filter((cell) => cell !== null).length,
  0,
);
const counts = `${priceList.passes.columns.length} ${plural(priceList.passes.columns.length, ["karnet", "karnety", "karnetów"])} · ${variantCount} ${plural(variantCount, ["wariant", "warianty", "wariantów"])} · ${priceList.services.length} ${plural(priceList.services.length, ["usługa", "usługi", "usług"])}`;

const summary = results.flatMap((result) => [
  `${result.label} · ${counts}`,
  `HTML: ${result.htmlPath} (${megabytes(result.htmlPath)})`,
  result.pdf.message,
  ...(result.pdf.ok ? [result.layout_message] : []),
]);

console.log(summary.join("\n"));

const failed = results.some(
  (result) => !result.pdf.ok || (result.pdf_meta !== null && !result.layout_ok),
);

if (chrome && failed) {
  process.exitCode = 1;
}
