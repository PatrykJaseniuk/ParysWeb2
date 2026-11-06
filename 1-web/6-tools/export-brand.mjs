#!/usr/bin/env node
/**
 * Renderuje księgę marki do Markdownu z modelu `0-core/2-brand.ts`.
 *
 * Wynik NIE jest źródłem prawdy. Źródłem jest `brand.ts`; ten plik tylko go
 * czyta, więc dokument nie może się rozjechać z modelem.
 *
 *   npm run brand:md   →   8-output/docs/BRAND.md
 */

import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";

const root = process.cwd();
const outFile = path.join(root, "8-output", "docs", "BRAND.md");

const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});

const cell = (v) => String(v).replace(/\|/g, "\\|");
const row = (...cells) => `| ${cells.map(cell).join(" | ")} |`;
const list = (items) => items.map((i) => `- ${i}`).join("\n");

try {
  const { business, site } = await server.ssrLoadModule("/0-site/4-model.ts");
  const brand = business.brand;

  const facts = business.identity.facts;
  const options = Object.values(business.catalog.memberships).flatMap((m) => m.options);
  const entries = options.filter((o) => o.price.unit === "entry").map((o) => o.price.amount);
  const monthly = options.filter((o) => o.code === "monthly").map((o) => o.price.amount);
  const monthlyRange =
    monthly.length > 1
      ? `${Math.min(...monthly)}–${Math.max(...monthly)} zł`
      : `${Math.min(...monthly)} zł`;

  const logoRows = brand.logo.variants.map((v) => {
    const assetId = site.design.logo[v.id];
    const asset = assetId ? site.media.assets[assetId] : null;
    const file = asset?.served ? `\`${asset.served.replace(/^\//, "7-public/")}\`` : "*(brak wdrożonego pliku)*";
    const size = asset?.width && asset?.height ? `${asset.width}×${asset.height}` : "—";
    return row(`**${v.name}**`, file, size, v.ratio ?? "—", v.min_width_px ? `${v.min_width_px} px` : "—", v.use.join(", ") || "—");
  });

  const paletteRows = Object.entries(brand.palette.tokens).map(([key, t]) =>
    row(`\`${key}\``, `\`${t.hex.toLowerCase()}\``, t.role.replace(/_/g, " "), t.contrast_on ? `na \`${t.contrast_on}\`` : "—", t.note ?? "—"),
  );

  const typeRows = Object.entries(brand.typography).map(([role, t]) =>
    row(`**${role}**`, t.family, t.weights.join(", "), t.transform === "uppercase" ? `wersaliki, tracking ${t.letter_spacing ?? "—"}` : "bez transformacji", t.line_height ?? "—", t.usage),
  );

  const vocabRows = brand.voice.vocabulary.map((v) => row(`**${v.term}**`, v.meaning));
  const formatRows = brand.voice.formats.map((f) => row(f.label, `\`${f.example}\``));

  const md = `# Księga marki — ${brand.name.canonical}

**Wersja:** ${business.model_version} · **Zakres:** identyfikacja wizualna i komunikacyjna

> Plik **wygenerowany** z \`0-core/2-brand.ts\`. Nie edytuj go ręcznie — zmień model
> i uruchom \`npm run brand:md\`. Źródłem prawdy jest model, ten dokument jest jego
> renderingiem dla ludzi.

---

## 1. Esencja

Klub treningowy w Nysie działający **od ${facts.founded} roku**. ${facts.area_m2} m²
i ${facts.rooms} stref treningowych: wolne ciężary, maszyny, cardio, crossfit,
sztuki walki, rollmasaż. Klub jest czynny **całą dobę**, karnety są **bez umowy**,
z możliwością zablokowania.

**Obietnica:** *${brand.promise}*

${row("Filar", "Co znaczy w praktyce")}
${row("---", "---")}
${brand.pillars.map((p) => row(`**${p.name}**`, p.meaning)).join("\n")}

Marka mówi jak instrukcja obsługi, nie jak ulotka. Kto przychodzi, chce wiedzieć
**ile, gdzie i kiedy** — i to ma dostać w pierwszym zdaniu.

---

## 2. Nazwa

${row("Forma", "Kiedy używać")}
${row("---", "---")}
${row(`**${brand.name.canonical}**`, "pełna nazwa: stopka, dane rejestrowe, pierwsze użycie w dokumencie, tytuł strony")}
${row(`**${brand.name.short}**`, "forma skrócona: nawigacja, tytuły sekcji, social, rozmowa")}
${row(`**${brand.name.with_city}**`, "gdy potrzebne rozróżnienie geograficzne: SEO, wizytówki, mapy")}

**Nie używamy** form historycznych jako nazwy marki: ${brand.name.legacy_do_not_use
    .filter((n) => n !== brand.name.short && n !== brand.name.with_city)
    .map((n) => `*${n}*`)
    .join(", ")}.
Krążą w starych wpisach i katalogach — w nowych materiałach ich nie powtarzamy.
Zostają w modelu jako \`alternate_names\` wyłącznie po to, żeby dało się je rozpoznać
w wyszukiwarce.

**Zasady pisowni:**

${list(brand.name.rules)}

---

## 3. Logo

${row("Wariant", "Plik", "Wymiary", "Proporcja", "Min. szerokość", "Użycie")}
${row("---", "---", "---", "---", "---", "---")}
${logoRows.join("\n")}

${brand.logo.variants.map((v) => `**${v.name}.** ${v.description}`).join("\n\n")}

**Pole ochronne:** ${brand.logo.clear_space}.

**Zakazy:**

${list(brand.logo.prohibited)}

---

## 4. Kolor

Czerwień jest **jedynym** akcentem. Reszta to skala szarości o ciepłym odcieniu.

${row("Token", "Hex", "Rola", "Kontrast", "Uwaga")}
${row("---", "---", "---", "---", "---")}
${paletteRows.join("\n")}

**Proporcje ${brand.palette.proportions.base} / ${brand.palette.proportions.neutral} / ${brand.palette.proportions.accent}:** tła ${brand.palette.proportions.base}%, typografia i elementy neutralne ${brand.palette.proportions.neutral}%, czerwień ${brand.palette.proportions.accent}%.

${list(brand.palette.rules)}

---

## 5. Typografia

${row("Rola", "Rodzina", "Ciężary", "Zasady", "Interlinia", "Użycie")}
${row("---", "---", "---", "---", "---", "---")}
${typeRows.join("\n")}

**Skala:** ${Object.entries(site.design.scale).map(([k, v]) => `\`${k}\` \`${v}\``).join(" · ")}.

**Siatka:** kontener maks. ${site.design.spacing.container_max_px} px, odstęp sekcji \`${site.design.spacing.section_y}\`. **Promienie:** ${Object.values(site.design.radius).join(", ")} — nic powyżej, poza logo.

Archivo i Inter są dostępne na SIL Open Font License 1.1, więc można ich używać
także w druku i na szyldzie.

---

## 6. Głos

**Styl.** ${brand.voice.style}

**Osoba.** ${brand.voice.person}

**Pojęcia kanoniczne** — używamy konsekwentnie:

${row("Mówimy", "Znaczy")}
${row("---", "---")}
${vocabRows.join("\n")}

**Czego nie mówimy:** ${brand.voice.avoid.map((a) => a.replace(/^„|”$/g, "")).join(", ")}.

**Format liczb i dat:**

${row("Co", "Jak")}
${row("---", "---")}
${formatRows.join("\n")}

**Dobrze:**

> ${brand.voice.example_good}

**Źle:**

> ${brand.voice.example_bad}

---

## 7. Obraz

**Treatment.** ${brand.imagery.treatment}

**Robimy:** ${brand.imagery.do.join(", ")}.

**Nie robimy:** ${brand.imagery.dont.join(", ")}.

---

## 8. Ruch

Poziom **${brand.motion.level}**. Czasy: **${brand.motion.durations_ms.fast} ms** i
**${brand.motion.durations_ms.base} ms**.

${list(brand.motion.rules)}

---

## 9. Czego nie robimy

${list(brand.prohibited)}

---

## 10. Utrzymanie

${row("Co", "Gdzie")}
${row("---", "---")}
${row("Marka: nazwa, logo, kolor, typografia, głos", "`0-core/2-brand.ts`")}
${row("Fakty o firmie", "`0-core/`")}
${row("Użycie marki na stronie: layout, media, strony", "`0-site/1-site.ts`")}
${row("Pliki logo i ikon", "`7-public/brand/`")}
${row("Uzasadnienia decyzji projektowych", "`0-docs/DESIGN.md`")}

Zmiana koloru lub kroju zaczyna się w modelu. Ten dokument wygenerujesz ponownie
przez \`npm run brand:md\`.

**Cennik dla kontekstu:** wejście od ${Math.min(...entries)} zł, karnet miesięczny
${monthlyRange}.
`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, md, "utf8");
  console.log(`✓ 8-output/docs/BRAND.md — ${md.split("\n").length} linii (model ${business.model_version})`);
} finally {
  await server.close();
}
