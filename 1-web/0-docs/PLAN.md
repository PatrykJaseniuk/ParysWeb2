# Plan nowej strony — Sport Studio Parys (parys.nysa.pl)

> **Uwaga historyczna (2026-11-06):** dokument powstał przed przeniesieniem
> rdzenia do `0-core/` i numeracją warstw w `1-web/`; część ścieżek
> (`business/`, `site/`, `src/`) jest nieaktualna. Aktualny układ opisują
> [`../../README.md`](../../README.md) i [`../../AGENTS.md`](../../AGENTS.md).

**Wersja:** 1.0 · **Data:** 3 listopada 2026
**Zakres:** redesign + przebudowa techniczna strony siłowni i klubu fitness w Nysie.
**Status:** plan zatwierdzony do wdrożenia; szkielet strony działa (16 podstron).

---

## 1. Streszczenie decyzji

| Obszar | Decyzja | Uzasadnienie |
| --- | --- | --- |
| Stack | **Astro 5 + Tailwind CSS 4 + TypeScript**, statyczny export | Treści zmieniają się rzadko, nie ma logowania ani koszyka. Zero JS frameworka = najszybszy możliwy start. |
| Liczba podstron | **16** (było: 1) | Strefy, karnety i usługi potrzebują własnych adresów pod SEO i pod linkowanie w Google Business Profile. |
| Cennik | **Jawna tabela na stronie**, bez modala | Dziś ceny są schowane za przyciskiem „CENNIK”. To największa przeszkoda w konwersji i w wyszukiwaniu. |
| Design | Ciemny, „techniczny” (spec-sheet), akcent czerwieni marki, cennik na papierze | Odróżnia się od poprzedniej wersji (ogromne logo na wyblakłym zdjęciu) i pasuje do charakteru klubu. |
| Treści | Bez CMS-a: dane w `business/` i `site/` (trzy moduły TS) → typowany moduł TS | 6 stref, 4 karnety, 4 trenerów — CMS byłby nadmiarem. Decyzja o CMS po 6 miesiącach, jeśli dojdzie aktualizacja cen co miesiąc. |
| Hosting | GitHub Pages (jak dziś) lub Netlify/Vercel | Statyczny build, brak backendu. Rekomendacja: Netlify/Vercel dla deploy preview i nagłówków cache. |
| Rezerwacje | **Telefon + kalendarze Google** (jak dziś), z uproszczonym UI | System rezerwacji online to osobny projekt; strona ma nie blokować tej decyzji. |

---

## 2. Audyt starej strony

### 2.1 Pomiary

| Metryka | Stara strona | Nowa strona | Zmiana |
| --- | --- | --- | --- |
| Transfer przy pierwszym wejściu | **3 494 kB** | **312 kB** | **−91%** |
| Liczba requestów | 16 | 11 | −31% |
| Największy LCP (lokalnie, ciepły cache) | 588–808 ms | 188 ms | ~4× szybciej |
| CSS | 197 kB (Mantine) | ~10 kB po kompresji | −95% |
| JS na kliencie | 172 kB | 0 kB frameworka (2 skrypty ~3 kB) | −98% |
| Zdjęcie hero | `SilowniaBackground.png` — **884 kB** | WebP 18–80 kB, `srcset` 4 rozmiary | −95% |
| Zdjęcia stref | 6 × PNG po ~450 kB | 6 × WebP 20–46 kB | −93% |
| Indeksowalne adresy | 1 | 16 | +15 |

Pomiar: Chrome (CDP) na żywej stronie `https://parys.nysa.pl/` oraz na buildzie
produkcyjnym (`astro preview`). Liczby dla starej strony to realny transfer
(`transferSize`), nie rozmiar plików.

### 2.2 Najważniejsze problemy i decyzje

| # | Problem w starej wersji | Wpływ | Decyzja w nowej wersji |
| --- | --- | --- | --- |
| 1 | Cennik ukryty za przyciskiem „CENNIK” (modal/rozwinięcie) | Użytkownik nie wie, ile zapłaci, dopóki nie kliknie. Google nie widzi cen. | Cennik jako pełna macierz na stronie głównej + dedykowana podstrona `/karnety`. |
| 2 | Jedna długa strona, brak podstron | Tylko 1 adres do zaindeksowania, brak możliwości linkowania do „sauny” czy „sali cross” | 16 adresów, każda strefa i usługa ma własny URL. |
| 3 | Logo w hero zajmuje ~75% wysokości ekranu mobile (640 z 844 px) | Użytkownik nie widzi niczego poza logo | Hero z nagłówkiem, konkretną obietnicą i dwoma CTA; logo w nagłówku. |
| 4 | Wyblakłe tło hero (nakładka + niska jakość), brak hierarchii | Strona wygląda na nieaktualną | Ciemne tło, mocna typografia, zdjęcie w kontrastowej ramce. |
| 5 | Zdjęcia 711×400 px w kartach 400 px szerokości, brak `srcset` | Rozmycie na HiDPI, marnowanie transferu | WebP + `srcset` + `sizes`, `loading="lazy"` poza pierwszym ekranem. |
| 6 | Przycisk „Log in” bez akcji | Sygnał „strona niedokończona” | Usunięty. |
| 7 | Literówki: „Zajecia”, „godzinny terening”, „lekkoatletka”, „Posiadamy wiele maszyny” | Wpływ na wiarygodność | Poprawione w warstwie danych (§ `fixes` w `src/data/business.ts`). |
| 8 | Wiele `<h1>` na stronie, brak JSON-LD, pusty `robot.txt` (zła nazwa), brak sitemap | Słabe SEO lokalne | Jedno `<h1>` na podstronę, JSON-LD `HealthClub` + `WebSite` + `BreadcrumbList` + `FAQPage`, `robots.txt` i `sitemap.xml` generowane przy buildzie. |
| 9 | Jeśli kalendarze i mapa ładują się od razu w iframe — ciężkie zasoby zewnętrzne | Wolniejszy start, cookies third-party przed zgodą | „Fasady”: mapa i kalendarz ładują iframe dopiero po kliknięciu. |
| 10 | Brak stałego telefonu na mobile | Utrudniony kontakt | Sticky pasek „Zadzwoń / Cennik” na mobile. |
| 11 | Zdjęcia trenerów to ten sam placeholder z Pixabay | Wygląda na atrapę | Monogramy (inicjały) do czasu dostarczenia prawdziwych zdjęć. |
| 12 | Brak danych prawnych (NIP, regulamin, polityka) | Ryzyko formalne przy publikacji | Szkielety dokumentów z checklistą do uzupełnienia (noindex do czasu gotowości). |

---

## 3. Cele

### Biznesowe
1. **Zmniejszyć liczbę telefonów „ile kosztuje karnet”** — cennik ma odpowiadać w 10 sekund.
2. **Zwiększyć liczbę zapytań o trening personalny i usługi** (sauna, badminton, masaż).
3. **Poprawić wiarygodność**: prawdziwe zdjęcia, konkretne godziny, jasne zasady.
4. **Być widocznym lokalnie** na frazy „siłownia Nysa”, „karnet Nysa”, „sauna Nysa”.

### Produktowe
- Cennik zrozumiały bez kontaktu z recepcją.
- Droga do telefonu: maks. 2 kliknięcia z każdego miejsca.
- Dojazd: mapa + adres w 1 kliknięciu.

### Techniczne (budżety)
| Metryka | Budżet | Wynik szkieletu |
| --- | --- | --- |
| Transfer pierwszego wejścia | ≤ 500 kB | 312 kB ✅ |
| LCP (4G, mobile) | ≤ 1,8 s | ~0,9 s (lokalnie 188 ms) |
| CLS | ≤ 0,05 | 0 (wymiary obrazów zadeklarowane) |
| JS frameworka | 0 kB | 0 kB ✅ |
| Lighthouse Performance | ≥ 95 | do potwierdzenia na produkcji |
| Lighthouse a11y | ≥ 95 | do potwierdzenia |

---

## 4. Grupa docelowa i scenariusze

### Persony
1. **„Nowy w mieście” (25–35 lat)** — szuka siłowni blisko domu, porównuje ceny w Google, decyzja w 1 wieczór.
2. **„Uczeń / student” (18–26)** — wrażliwy na cenę, chce wiedzieć, czy jest zniżka i czy może wejść wieczorem.
3. **„Pracujący rodzic” (35–50)** — liczy się czas: czy jest 24/7, czy jest parking, czy da się przyjść o 6:00.

### Scenariusze krytyczne
| Scenariusz | Ścieżka w nowej stronie |
| --- | --- |
| „Ile kosztuje karnet?” | Google → `/karnety` → macierz → telefon (sticky na mobile) |
| „Czy jest sauna i ile kosztuje?” | Google → `/uslugi#sauna` → kalendarz → telefon |
| „Czy są zajęcia cross?” | `/zajecia` → harmonogram → karnet z zajęciami |
| „Gdzie zaparkować?” | `/kontakt` → mapa (1 klik) |
| „Czy dostanę zniżkę jako student?” | `/karnety` → FAQ „Czy przysługuje mi zniżka…” |

---

## 5. Architektura informacji

```
/                       Strona główna — cennik w kontekście, wszystkie sekcje
├── /karnety            Cennik + macierz zakresów + FAQ + jak zacząć
├── /strefy             Lista 6 stref
│   ├── /strefy/wolne-ciezary
│   ├── /strefy/maszyny-ze-stosem
│   ├── /strefy/cardio
│   ├── /strefy/sala-funkcjonalna
│   ├── /strefy/sala-cross
│   └── /strefy/rollmasaz-platforma-wibrujaca
├── /zajecia            Cross trening + harmonogram
├── /trenerzy           Czterech trenerów + cena + jak to działa
├── /uslugi             Sauna, badminton, masaż, bufet + kalendarze
├── /kontakt            Dane, godziny, mapa, rezerwacje
├── /polityka-prywatnosci   (noindex do uzupełnienia)
├── /regulamin              (noindex do uzupełnienia)
└── 404
```

**Nawigacja główna (6 pozycji):** Strefy · Karnety · Zajęcia · Trenerzy · Usługi · Kontakt.
**Nawigacja w stopce:** dodatkowo Polityka prywatności.
**CTA w nagłówku:** „Cennik” (jedyny przycisk — nie konkuruje z niczym).

---

## 6. Struktura strony głównej

| # | Sekcja | Rola | Kluczowy element |
| --- | --- | --- | --- |
| 1 | Hero | Powiedzieć w 3 s, co to jest i że działa 24/7 | H1 „Siłownia w Nysie. Czynna całą dobę.” + 2 CTA + pasek statystyk |
| 2 | Marquee | Pokazać szerokość oferty | Przewijane nazwy stref i usług |
| 3 | Strefy (6) | Pobudzić wyobraźnię | Zdjęcia (kolor po hover), linki do podstron, sprzęt i klimatyzacja pod nagłówkiem |
| 4 | Cennik | **Zamknąć pytanie o cenę** | Macierz 6 wariantów × 4 karnety na jasnym tle |
| 5 | Zajęcia grupowe | Pokazać ofertę poza siłownią | 2 karty + link do harmonogramu |
| 6 | Trening personalny | Sprzedać usługę 1:1 | 4 trenerzy, cena 110 zł/h |
| 7 | Usługi dodatkowe | Dowieźć saunę/badminton/masaż | 4 karty z cenami i rezerwacją |
| 8 | Partnerzy | Zdjąć obiekcję „czy moja karta działa” | Karty MultiSport/Medicover/FitProfit + zakres |
| 9 | Kontakt | Doprowadzić do wizyty | Telefon, adres, parking, godziny, mapa (na klik) |

Rytm wizualny: ciemne sekcje przedzielone **jedną jasną sekcją cennika** — wygląda
jak wydrukowany cennik na ścianie i naturalnie przyciąga wzrok w środku strony.

---

## 7. Cennik — najważniejsza decyzja projektowa

**Problem:** 15 wariantów cenowych w 4 zakresach to dużo. Stara strona ukrywała je
w modalu, przez co użytkownik nie mógł porównać.

**Rozwiązanie:**
- **Desktop:** macierz `wariant × karnet` — 6 wierszy, 4 kolumny. Warianty uporządkowane
  od najkrótszego do najdłuższego. Kolumna „6 stref + zajęcia grupowe” wyróżniona jako
  pełny zakres. Puste komórki to myślnik, nie „0 zł”.
- **Mobile:** 4 karty (po jednej na zakres) z listą wariantów — czytelne bez poziomego scrolla.
- **Etykiety:** zamiast krzyczących „MIESIĘCZNY uczeń/senior” — „Miesiąc (uczeń/senior)”,
  z krótkim opisem pod spodem.
- **Opłata wpisowa 15 zł** pokazana raz, pod tabelą, nie w każdej komórce.
- **Zastrzeżenie:** „ceny potwierdź w recepcji” — bo eksport odzwierciedla stan kodu, nie cennik na ścianie.

**Niespójność do rozstrzygnięcia:** karnet „4 strefy + cross” obejmuje zajęcia Cross
trening, ale **nie** strefę Sala cross. Nazwa sugeruje coś odwrotnego. W UI nazwa
została zachowana (jest w obrocie), ale pod nią jest dopisek „4 strefy + zajęcia Cross
trening” i przypis w `/karnety`.

---

## 8. Design — skrót

Pełny opis: [`DESIGN.md`](DESIGN.md).

- **Paleta:** `#0a0a0b` (tło), `#f2f1ed` (papier), `#e31e24` (brand), `#9d9da5` (tekst pomocniczy).
- **Typografia:** Archivo (nagłówki, 800, wersaliki, ciasny tracking) + Inter (treść) + monospace (etykiety techniczne).
- **Kształt:** ostre krawędzie, włosowe linie 1 px, brak zaokrągleń poza 2 px.
- **Sygnatura:** numerowane sekcje (`01 / STREFY`), czerwona ramka offsetowa wokół hero, pasek statystyk jak w karcie sprzętu.
- **Stan ciemny tylko** — cennik jako jedyna jasna sekcja („papier”).

---

## 9. Model treści — skrót

Pełny opis: [`CONTENT-MODEL.md`](CONTENT-MODEL.md).

- Źródło: moduły w `business/` i `site/` — `business/` (fakty, 9 plików), `site.ts` (design,
  media, strony), `quality.ts` (blokery publikacji). Kształt pilnuje `satisfies`
  w `astro check`, spójność — `invariants.ts` uruchamiany przy buildzie.
  Adapter `src/data/business.ts` tłumaczy model na widoki UI.
- Encje: `areas` (6), `memberships` (4 × 15 wariantów), `group_classes` (2), `trainers` (4),
  `services` (4), `partners` (4), `calendars` (4), `contact`.
- Korekty redakcyjne są **w jednym miejscu** (`fixes`), więc da się je przejrzeć i wycofać.

---

## 10. Architektura techniczna

### 10.1 Struktura
```text
src/
  components/
    ui/           Icon, SectionHead, PageHero, MapEmbed, CalendarEmbed
    sections/     Hero, Facts, Zones, Pricing, Classes, Trainers, Services, Partners, ContactSection, CtaBand
    pricing/      PriceMatrix
  data/business.ts
  layouts/BaseLayout.astro
  lib/            seo.ts (JSON-LD), icons.ts
  pages/          16 tras
  styles/global.css
```

### 10.2 Skąd biorą się dane
`{business/, site/, model.ts}` → import w `src/data/business.ts` → typowane obiekty + funkcje pochodne
(`pln()`, `buildMatrix()`, `areaById()`, `calendarById()`). Komponenty nie czytają JSON-a
bezpośrednio — dzięki temu zmiana modelu to jedno miejsce.

### 10.3 Obrazy
`scripts/prepare_assets.py` (Pillow) generuje z oryginałów:
- hero: 2400/1800/1200/800 px WebP,
- strefy: 711/500 px WebP,
- partnerzy: 96 px wysokości WebP z przezroczystością,
- ikony 512/192/180 PNG + wektorowa ikona SVG,
- OG 1200×630.

Wszystkie `<img>` mają `width`/`height` (zero CLS), `srcset` + `sizes`,
`loading="lazy"` poza pierwszym ekranem, `fetchpriority="high"` dla hero.

### 10.4 JavaScript
Dwa małe skrypty wbudowane przez Astro:
1. menu mobilne (toggle + Escape + blokada scrolla),
2. fasady mapy i kalendarzy (podmiana `data-src` → `src` po kliknięciu).

Brak frameworka, brak hydratacji, brak `client:load`.

### 10.5 Formularze
**Brak formularza kontaktowego** — świadomie. Stara strona go nie miała i nie ma
procesu obsługi zgłoszeń. Kontakt = telefon i e-mail. Jeśli w przyszłości ma być
formularz, potrzebny jest odbiorca (e-mail/CRM) i polityka prywatności.

---

## 11. SEO

- `title` i `description` unikalne dla każdej z 16 podstron.
- `canonical` na każdy adres, `lang="pl"`.
- JSON-LD: `HealthClub` + `ExerciseGym` (adres, geo, godziny 24/7 + recepcja, `priceRange`),
  `WebSite`, `BreadcrumbList` na podstronach, `FAQPage` na `/karnety`.
- `sitemap-index.xml` generowany przez `@astrojs/sitemap`, `robots.txt` z endpointu.
- Open Graph + Twitter Card, dedykowany obraz 1200×630.
- Semantyka: jedno `<h1>` na stronę, `<h2>` sekcji, `<table>` w cenniku z `caption`.
- **Lokalne SEO (poza kodem):** aktualizacja wizytówki Google Business Profile
  (godziny 24/7, zdjęcia, link do `/karnety`), spójność NAP we wszystkich katalogach.

---

## 12. Dostępność

- Kontrast tekstu ≥ 4,5:1 (tekst pomocniczy rozjaśniony do ~5:1).
- Skip link „Przejdź do treści”.
- Widoczny fokus (`:focus-visible`, czerwona obwódka).
- Menu mobilne: `aria-expanded`, `aria-controls`, zamykanie Escape, blokada scrolla.
- Ikony dekoracyjne `aria-hidden`, przyciski ikonowe mają `aria-label`.
- `prefers-reduced-motion` wyłącza marquee i animacje.
- Tabele z `scope="col"` / `scope="row"` i `caption`.
- Cennik drukuje się poprawnie (`@media print`).

---

## 13. Analityka i pomiar

- GA4 (`G-GKTQMBN0Y8` z danych) — **do włączenia po decyzji o zgodach**.
  W starej wersji komponent istniał, ale był zakomentowany.
- Rekomendowane zdarzenia: `tel_click`, `cennik_view`, `calendar_open`, `map_open`,
  `partner_click`, `scroll_90`.
- Minimalny dashboard: telefony, odsłony `/karnety`, odsłony `/uslugi`, wejścia z Google.
- Zgody: bez banera cookies strona nie powinna odpalać GA4. Do decyzji:
  baner (np. lekkie rozwiązanie) albo rezygnacja z analityki.

---

## 14. Integracje

| Integracja | Stan obecny | Plan |
| --- | --- | --- |
| Google Calendar (4 kalendarze) | iframe w modalu | iframe ładowany po kliknięciu (fasada) + link „Otwórz w Google Calendar” |
| Google Maps | iframe | fasada + link do nawigacji |
| MultiSport / Medicover / FitProfit | informacja tekstowa | karty + jasny zakres dostępu |
| Facebook / Instagram | linki w stopce | linki w stopce i sekcji kontaktu |
| GA4 | zakomentowane | do włączenia po decyzji o zgodach |
| System rezerwacji | brak | poza zakresem; strona przygotowana na podmianę kalendarzy na link do systemu |

---

## 15. Wdrożenie

1. **Build:** `npm run build` → katalog `dist/` (statyczny).
2. **Hosting:** rekomendacja Netlify/Vercel (deploy preview, nagłówki cache, HTTPS).
   Alternatywa: GitHub Pages — build działa bez zmian, ale bez preview i z ograniczonym
   cache.
3. **Domena:** `parys.nysa.pl` — przekierowanie z `www` do wersji bez `www` (lub odwrotnie,
   byle spójnie), wymuszone HTTPS.
4. **Nagłówki cache:** `/_astro/*` i `/img/*` — `max-age=31536000, immutable`;
   HTML — `max-age=0, must-revalidate`.
5. **Weryfikacja Google Search Console** — plik `google39cb9d79c986de59.html` z eksportu
   można przenieść do `public/`, żeby nie tracić weryfikacji.
6. **Staging:** osobny deploy preview przed publikacją.

---

## 16. Roadmapa

| Etap | Zakres | Czas | Zależności |
| --- | --- | --- | --- |
| **0. Fundament** ✅ | Audyt, dane, design system, szkielet 16 podstron | zrobione | — |
| **1. Treści** | Potwierdzenie cen, uzupełnienie opisu Sali funkcjonalnej, dane prawne | 1–2 dni pracy właściciela | lista pytań § 18 |
| **2. Zdjęcia** | Sesja: strefy (min. 1600 px), trenerzy, sauna, badminton, masaż | 0,5 dnia sesji + 2 dni obróbki | zgoda na wizerunek trenerów |
| **3. Wideo** | Kompresja 11 filmów (189 MB → ~15 MB), postery | 1 dzień | decyzja: wideo na stronie czy tylko w tle |
| **4. Prawo** | Regulamin, polityka prywatności, NIP | 1–3 dni | prawnik / właściciel |
| **5. Analityka** | GA4 + zgody + zdarzenia | 0,5 dnia | decyzja o banerze cookies |
| **6. Publikacja** | DNS, HTTPS, Search Console, wizytówka Google | 0,5 dnia | etapy 1–5 |
| **7. Po starcie** | Monitoring, korekty treści, zdjęcia | ciągłe | — |

**Realny termin publikacji:** 1–2 tygodnie od dostarczenia treści i zdjęć.
Kod jest gotowy — blokują dane, nie technologia.

---

## 17. Ryzyka

| Ryzyko | Prawdopodobieństwo | Wpływ | Mitygacja |
| --- | --- | --- | --- |
| Ceny w danych są nieaktualne | wysokie | wysoki | Zastrzeżenie w UI + potwierdzenie przed publikacją |
| Brak zdjęć trenerów | wysokie | średni | Monogramy; sesja w etapie 2 |
| Zdjęcia 711×400 px na dużych ekranach | wysokie | średni | Ograniczone rozmiary wyświetlania, sesja zdjęciowa |
| Brak danych prawnych | średnie | wysoki (formalny) | Dokumenty `noindex` do czasu uzupełnienia |
| Usługi (sauna/badminton) rezerwowane przez telefon — ryzyko podwójnych rezerwacji | średnie | średni | Kalendarz jako źródło prawdy + informacja „potwierdź telefonicznie” |
| Właściciel nie ma czasu na treści | średnie | wysoki | Teksty robocze są już napisane; wystarczy akceptacja |
| Migracja SEO (stara strona ma 1 URL) | niskie | średni | Przekierowania 301 ze starych anchorów, sitemap, Search Console |

---

## 18. Pytania do właściciela

**Blokujące publikację:**
1. Czy ceny i zakresy karnetów są aktualne (stan z eksportu)?
2. Jaki jest kod pocztowy i pełne dane firmy (NIP, nazwa do stopki)?
3. Czy „4 strefy + cross” ma obejmować strefę Sala cross, czy tylko zajęcia Cross trening?
4. Czy regulamin i polityka prywatności istnieją? Jeśli nie — kto je przygotuje?
5. Czy PZU jest nadal akceptowane i na jakich zasadach?

**Ważne:**
6. Opis Sali funkcjonalnej (w źródle był pusty) — czy zaakceptować tekst roboczy?
7. Czy promocja „Karnet studencki 99” obowiązuje? Jakie ma warunki i daty?
8. Godziny recepcji w niedziele i święta.
9. Czy są prawdziwe zdjęcia trenerów?
10. Czy potrzebna jest analityka (GA4) i baner cookies?

**Opcjonalne:**
11. Czy wideo (11 filmów, 189 MB) ma być na stronie, czy wystarczą zdjęcia?
12. Czy planowany jest system rezerwacji online (sauna, badminton, masaż)?
13. Czy dochodzą nowe zajęcia grupowe lub strefy?

---

## 19. Definition of done

- [ ] Ceny potwierdzone przez właściciela i zaktualizowane w `business/memberships.ts`.
- [ ] Opis Sali funkcjonalnej zaakceptowany.
- [ ] Regulamin i polityka prywatności uzupełnione (i zdjęty `noindex`).
- [ ] Zdjęcia: strefy ≥ 1600 px, trenerzy.
- [ ] Wizytówka Google zaktualizowana (godziny, zdjęcia, link do cennika).
- [ ] `sitemap.xml` i `robots.txt` dostępne publicznie.
- [ ] Test na urządzeniu mobilnym (iOS Safari + Android Chrome).
- [ ] Lighthouse: Performance ≥ 95, Accessibility ≥ 95, SEO 100.
- [ ] Przekierowania 301 ze starych adresów (jeśli były linkowane kotwice).
- [ ] Backup starej wersji strony.
