import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { plural } from "../0-print/1-format";
import { priceList } from "../1-data/price-list";
import { renderPriceList } from "../2-render/price-list";

/**
 * Build cennika A4: model → dokument → samodzielny HTML → PDF.
 *
 * Warstwa 3 (narzędzia) jako jedyna dotyka dysku i przeglądarki. Fonty
 * i logo wbudowujemy w HTML jako base64, więc plik można otworzyć z dowolnego
 * katalogu i wydrukować bez sieci. PDF powstaje przez Chrome w trybie
 * headless; gdy Chrome nie jest zainstalowany, zostaje poprawny HTML do
 * wydruku przez Ctrl+P.
 */

const root = fileURLToPath(new URL("..", import.meta.url));
const outputDir = join(root, "8-output");
const htmlPath = join(outputDir, "cennik-a4.html");
const pdfPath = join(outputDir, "cennik-a4.pdf");
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

function printPdf(chrome: string): { ok: boolean; message: string } {
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

function megabytes(path: string): string {
  return `${(statSync(path).size / 1024).toFixed(0)} kB`;
}

const fontCss = FONT_PACKAGES.map(inlineFontFaces).join("\n");
const html = renderPriceList(priceList, {
  logo_data_uri: logoDataUri(),
  font_css: fontCss,
});

mkdirSync(outputDir, { recursive: true });
rmSync(pdfPath, { force: true });
writeFileSync(htmlPath, html, "utf8");

const chrome = findChrome();
const pdf = chrome
  ? printPdf(chrome)
  : {
      ok: false,
      message: "Nie znaleziono Chrome — pominięto PDF. HTML wydrukujesz przez Ctrl+P.",
    };

const variantCount = priceList.passes.rows.reduce(
  (count, row) => count + row.cells.filter((cell) => cell !== null).length,
  0,
);

const summary = [
  `cennik A4 · ${priceList.passes.columns.length} ${plural(priceList.passes.columns.length, ["karnet", "karnety", "karnetów"])} · ${variantCount} ${plural(variantCount, ["wariant", "warianty", "wariantów"])} · ${priceList.services.length} ${plural(priceList.services.length, ["usługa", "usługi", "usług"])}`,
  `HTML: ${htmlPath} (${megabytes(htmlPath)})`,
  pdf.message,
];

console.log(summary.join("\n"));

if (chrome && !pdf.ok) {
  process.exitCode = 1;
}
