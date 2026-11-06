#!/usr/bin/env node
/**
 * Eksport modelu do JSON — dla konsumentów spoza TypeScriptu
 * (agent generujący stronę w innym stacku, import do CMS-a, PDF z ofertą).
 *
 * Wynik NIE jest źródłem prawdy. Źródłem są moduły w `0-core/` i `0-site/`.
 *
 *   npm run model:export   →   8-output/export/model.json
 */

import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";

const root = process.cwd();
const outFile = path.join(root, "8-output", "export", "model.json");

const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});

try {
  const { business, site, quality } = await server.ssrLoadModule("/0-site/4-model.ts");

  const payload = {
    model_version: business.model_version,
    business,
    site,
    quality,
  };

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2) + "\n", "utf8");

  const kb = Math.round(fs.statSync(outFile).size / 1024);
  console.log(`✓ 8-output/export/model.json — ${kb} kB (business ${business.model_version}, site ${site.site_version})`);
} finally {
  await server.close();
}
