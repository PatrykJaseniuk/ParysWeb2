#!/usr/bin/env node
/**
 * Audyt Lighthouse opublikowanej strony albo lokalnego podglądu.
 *
 *   npm run lighthouse                                  → mobile + desktop, https://parys.nysa.pl/
 *   npm run lighthouse -- --profile mobile              → tylko mobile
 *   npm run lighthouse -- --url http://localhost:4321/  → build z `npm run preview`
 *
 * Wynik: 8-output/lighthouse/<profil>.report.html (do otwarcia w przeglądarce)
 * i <profil>.report.json (dane do porównań). Katalog jest w `.gitignore`, więc
 * raport jest artefaktem, nie źródłem prawdy.
 *
 * Uwaga: kategoria `agentic-browsing` widoczna w PageSpeed Insights nie
 * istnieje w lokalnym Lighthouse 12 — audyt obejmuje cztery pozostałe.
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const outDir = path.join(root, "8-output", "lighthouse");
const cli = require.resolve("lighthouse/cli/index.js");

const DEFAULT_URL = "https://parys.nysa.pl/";
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const PROFILES = {
  mobile: ["--form-factor=mobile", "--screenEmulation.mobile"],
  desktop: ["--preset=desktop"],
};
const METRICS = {
  "first-contentful-paint": "FCP",
  "largest-contentful-paint": "LCP",
  "total-blocking-time": "TBT",
  "cumulative-layout-shift": "CLS",
  "speed-index": "SI",
};

/** Wartość argumentu `--nazwa wartość` albo `--nazwa=wartość`; inaczej `fallback`. */
const argValue = (name, fallback) => {
  const inline = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  const index = process.argv.indexOf(`--${name}`);
  const positional = index >= 0 ? process.argv[index + 1] : undefined;
  const value = inline ? inline.slice(name.length + 3) : positional;

  return value && !value.startsWith("--") ? value : fallback;
};

const url = argValue("url", DEFAULT_URL);
const chromeFlags = argValue("chrome-flags", "--headless=new");
const profileArg = argValue("profile", "both");
const profiles = profileArg === "both" ? Object.keys(PROFILES) : [profileArg];
const unknown = profiles.filter((profile) => !(profile in PROFILES));

const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
};

/** Uruchamia Lighthouse CLI i zwraca ścieżkę do wygenerowanego JSON-a (albo null). */
const runProfile = (profile) => {
  const target = path.join(outDir, profile);
  const args = [
    cli,
    url,
    `--output-path=${target}`,
    "--output=html",
    "--output=json",
    `--only-categories=${CATEGORIES.join(",")}`,
    ...PROFILES[profile],
    `--chrome-flags=${chromeFlags}`,
    "--quiet",
  ];
  const { status } = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });

  return status === 0 ? target : null;
};

const readReport = (target) =>
  JSON.parse(fs.readFileSync(`${target}.report.json`, "utf8"));

const percent = (value) => `${Math.round((value ?? 0) * 100)}/100`;

const row = (profile, report) => ({
  profil: profile,
  wydajność: percent(report.categories.performance?.score),
  dostępność: percent(report.categories.accessibility?.score),
  "dobre praktyki": percent(report.categories["best-practices"]?.score),
  seo: percent(report.categories.seo?.score),
  ...Object.fromEntries(
    Object.entries(METRICS).map(([id, label]) => [
      label,
      report.audits[id]?.displayValue ?? "—",
    ]),
  ),
});

/** Audyty z wagą > 0 — tylko one realnie obniżają ocenę kategorii. */
const scoredAudits = (report) =>
  new Set(
    Object.values(report.categories)
      .filter(Boolean)
      .flatMap((category) => category.auditRefs)
      .filter((ref) => ref.weight > 0)
      .map((ref) => ref.id),
  );

/** Metryki są już w tabeli, więc nie powtarzamy ich na liście problemów. */
const problems = (report) => {
  const scored = scoredAudits(report);

  return Object.values(report.audits)
    .filter((audit) => scored.has(audit.id) && !(audit.id in METRICS))
    .filter((audit) => audit.score !== null && audit.score < 1)
    .map((audit) => `  • [${audit.id}] ${audit.title}`);
};

/** Diagnostyka bez wpływu na ocenę (np. cache, dostarczanie obrazów). */
const hints = (report) => {
  const scored = scoredAudits(report);

  return Object.values(report.audits).filter(
    (audit) =>
      !scored.has(audit.id) &&
      audit.score === 0 &&
      !["manual", "notApplicable", "informative"].includes(audit.scoreDisplayMode),
  ).length;
};

const validProfiles = unknown.length > 0 ? [] : profiles;
fs.mkdirSync(outDir, { recursive: true });

const results = validProfiles
  .map((profile) => ({ profile, target: runProfile(profile) }))
  .map(({ profile, target }) =>
    target ? { profile, target, report: readReport(target) } : { profile, target: null },
  );

if (unknown.length > 0) {
  fail(`nieznany profil: ${unknown.join(", ")} — dostępne: ${Object.keys(PROFILES).join(", ")}`);
}

if (results.length > 0) {
  console.log(`\nLighthouse ${url}\n`);
  console.table(results.filter((r) => r.report).map((r) => row(r.profile, r.report)));
  results
    .filter((r) => r.report)
    .forEach((r) => {
      const failures = problems(r.report);
      const extra = hints(r.report);
      const label =
        failures.length === 1 ? "1 audyt obniża ocenę" : `${failures.length} audytów obniża ocenę`;
      console.log(
        failures.length > 0
          ? `${r.profile}: ${label}\n${failures.join("\n")}`
          : `${r.profile}: żaden audyt nie obniża oceny`,
      );
      console.log(`  + ${extra} wskazówek w raporcie HTML`);
      console.log(`  → ${path.relative(root, r.target)}.report.html\n`);
    });
  results
    .filter((r) => !r.target)
    .forEach((r) => fail(`profil ${r.profile}: Lighthouse zakończył się błędem`));
}
