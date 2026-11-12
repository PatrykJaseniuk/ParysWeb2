# CMS dla Parysa — warianty integracji, koszty i rekomendacja

**Data:** 2026-11-12 · **Status:** analiza, nic nie zostało wdrożone
**Zakres:** sposoby dołączenia CMS-a do obecnego modelu (`0-core/`) i strony
(`1-web/`), bez zmiany publicznego adresu i bez utraty typu danych.

## W skrócie

- **A. Git-based CMS** (Pages CMS, Sveltia, Decap) — CMS zapisuje JSON/YAML
  commitem do repo, CI generuje z niego typowany `0-core/`. **Rekomendacja.**
- **B. Headless SaaS** (Sanity, Storyblok) — wygodna redakcja i podgląd, ale
  abonament, snapshot w repo i drugi hosting do preview.
- **C. Self-hosted** (Directus, Payload, Strapi) — pełny panel i role, ale
  własny serwer, baza, backupy i aktualizacje; sensowne tylko przy większym
  systemie (rezerwacje, recepcja).
- **D. Arkusz/Issue/Codespaces** — najtańszy etap przejściowy, bez prawdziwego
  CMS-a.

Niezależnie od wariantu: CMS ma zarządzać **danymi i mediami**, nie layoutem;
treść musi zostać poza `1-web/` (czyta ją też `1-printables/`), a typy,
`alt` i bramka `publishable` muszą dalej obowiązywać.

---

## 1. Punkt wyjścia — co musiałby obsługiwać CMS

Dziś źródłem prawdy są moduły TypeScript w `0-core/` (ok. 2 000 linii), a strona
i cennik A4 są tylko ich konsumentami. CMS nie może więc „po prostu” podmienić
danych: musi albo nadal produkować poprawny model TS, albo stać się nowym
źródłem prawdy i wymusić przebudowę całego kontraktu.

### 1.1. Co realnie zmienia się w treści

| Treść | Gdzie dziś | Jak często się zmienia | Czy CMS ma sens |
|---|---|---|---|
| Ceny, warianty, zakresy karnetów | `0-core/3-accesses.ts` | często (promocje, studenci, emeryci) | **tak, priorytet** |
| Godziny, telefon, e-mail, adres | `0-core/1-company.ts` | rzadko, ale pilnie | **tak** |
| Trenerzy, zajęcia, usługi | `0-core/2-classes.ts`, `2-services.ts` | kilka razy w roku | **tak** |
| Strefy i ich opisy | `0-core/2-areas.ts` | rzadko | raczej tak |
| Zdjęcia i alt | `1-web/0-site/1-site.ts`, `0-assets/` | kilka razy w roku | **tak, z pipeline'em** |
| Dokumenty prawne | `0-core/1-legal.ts`, `1-regulamin.ts` | rzadko, ale wymaga akceptacji prawnej | tak, z blokadą publikacji |
| SEO, nawigacja, układ stron, design | `1-web/0-site/1-site.ts`, komponenty | prawie nigdy | **nie** — to kod |
| `quality.publishable` | `1-web/0-site/2-quality.ts` | decyzja człowieka | **nie** — nie może być polem w CMS |

Wniosek: CMS powinien zarządzać **danymi biznesowymi i mediami**, a nie całym
modelem strony. Obejmowanie layoutu i definicji sekcji przez CMS to droga do
rozjechania designu i obejścia bramki `publishable`.

### 1.2. Twarde ograniczenia obecnego projektu

1. **Typy są kontraktem.** Klucze encji są tożsamością (`Record<klucz, obiekt>`),
   a referencje używają typów `AreaKey`, `ClassKey`, `TrainerKey`, … Literówka
   ma być błędem kompilacji, nie błędem w przeglądarce.
2. **Dwóch konsumentów.** `0-core/` czyta zarówno `1-web/`, jak i
   `1-printables/`. Treść nie może przenieść się do `1-web/`, bo cennik A4
   przestanie się budować.
3. **Statyczny hosting.** GitHub Pages nie uruchamia serwera: nie ma API,
   logowania, SSR ani podglądu per PR. CMS musi być albo w pełni kliencki
   (Git), albo działać poza stroną, a strona ma pobierać dane tylko w CI.
4. **Zero zależności runtime.** Strona nie może wymagać dostępności CMS-a,
   żeby się wyświetlić.
5. **Bramka publikacji.** `quality.publishable` i `assertModelIntegrity()`
   zatrzymują build. CMS nie może tego omijać.
6. **Media mają wymagany alt.** `3-invariants.ts` traktuje brak `alt` jako błąd,
   a brak zdjęcia strefy/zajęć jako ostrzeżenie. Formularz CMS musi to wymuszać.
7. **Kolejność = kolejność kluczy.** Rekordy nie mają pola `order`. CMS, który
   sortuje listy alfabetycznie albo gubi kolejność, zmieni kolejność w UI.

### 1.3. Co to znaczy dla wyboru CMS-a

Są tylko trzy architektonicznie poprawne warianty:

```text
A. Git-based:     CMS (przeglądarka) → commit JSON/YAML → CI: walidacja + codegen → TS → build
B. Headless API:  CMS (SaaS) → webhook → CI: pobranie snapshotu → walidacja + codegen → build
C. Self-hosted:   CMS (własny serwer + DB) → API → CI: snapshot → walidacja + codegen → build
```

Wariant „strona pyta CMS w runtime” (SSR/ISR) jest technicznie możliwy, ale
wyklucza GitHub Pages, uzależnia dostępność strony od CMS-a i psuje obecny
budżet wydajności. Nie rekomenduję go.

---

## 2. Wariant A — CMS oparty na Git (bez serwera)

CMS działa w przeglądarce, loguje się przez GitHub i zapisuje zmiany jako
commit do repozytorium. Push na `main` uruchamia istniejący
`.github/workflows/deploy.yml`. Nie ma bazy danych ani nowego hostingu.

### 2.1. Narzędzia

| Narzędzie | Jak działa | Zalety | Ograniczenia |
|---|---|---|---|
| **Pages CMS** | hosted lub self-host; konfiguracja w `.pages.yml`; dostęp przez GitHub App | najmniej pracy, brak własnego OAuth, edycja plików i mediów, open source | interfejs głównie angielski; hosted zależy od zewnętrznego serwisu; GitHub App prosi o szerokie uprawnienia (m.in. Actions) |
| **Sveltia CMS** | kliencki SPA w `/admin`, konfiguracja zgodna z Decap; GitHub/GitLab; 25+ języków interfejsu | darmowy, MIT, dobry UX i mobile, aktywnie rozwijany, wielojęzyczny interfejs (polski warto potwierdzić w wybranej wersji) | brak wbudowanego logowania — trzeba postawić OAuth proxy (np. Cloudflare Worker); obecnie beta, GA planowane na koniec 2026; edytor musi mieć konto GitHub |
| **Decap CMS** | poprzednik Sveltii, ten sam model konfiguracji | dojrzały, dużo dokumentacji, editorial workflow (PR) | wolniejszy rozwój, cięższy UI, OAuth również trzeba obsłużyć |
| **Keystatic** | integracja z Astro, schemat w TS, świetny DX | najlepsze typowanie formularzy, lokalny tryb deweloperski | tryb GitHub wymaga hosta Node.js na API routes — **nie działa na czystym GitHub Pages**; trzebaby dodać serwer albo Keystatic Cloud |
| **TinaCMS** | Git-backed + Tina Cloud, visual editing | podgląd wizualny, dobre dla marketingu | cięższy integracyjnie, uzależnienie od Tina Cloud, większy koszt złożoności |

### 2.2. Jak to wpasować w obecny model

Najważniejsza decyzja: **CMS nie edytuje plików `.ts`**. Edytuje dane w
formacie przyjaznym formularzom, a osobny krok generuje z nich obecne moduły
TS. Dzięki temu:

- `0-core/0-types.ts` zostaje bez zmian,
- `AreaKey`, `ClassKey`, … nadal są wyprowadzane z danych,
- `1-printables/` nadal czyta ten sam `0-core/`,
- błędy referencji nadal wyłapuje `astro check` i `assertModelIntegrity()`.

Proponowany przepływ:

```text
0-content/                    ← edytowalne źródło (JSON/YAML), poza 1-web
  identity.json
  pricing.json                ← karnety i warianty jako tablice z `key`
  areas.json
  classes.json
  trainers.json
  services.json
  partners.json
  legal.json
  media.json
        │
        ▼
tools/cms/                    ← walidacja (Zod/JSON Schema) + codegen
        │
        ▼
0-core/2-areas.ts …           ← generowane, commitowane, nie edytować ręcznie
0-core/3-accesses.ts …
1-web/0-site/1-site.ts        ← media i design nadal ręcznie (albo osobny plik)
        │
        ▼
npm run check && npm run build && (1-printables) npm run build
```

Uwagi do układu:

- `0-content/` musi być **poza `1-web/`**, bo czyta je także `1-printables/`.
- `0-core/` pozostaje bez zależności runtime; walidator i codegen to narzędzie
  build-time, nie import w rdzeniu.
- Generowane pliki powinny mieć nagłówek `AUTO-GENERATED — nie edytuj` i być
  commitowane, żeby build na GitHub Pages nie wymagał uruchamiania CMS-a.
- `tools/cms/` to nowa granica narzędzi w rootcie (obok `.github/`), więc
  trzeba ją dopisać do `AGENTS.md` i `README.md`. Nie należy wpychać codegenu
  do `1-web/6-tools/`, bo pisałby „w górę” do `0-core/`.

### 2.3. Kształt danych przyjazny CMS-owi

Obecne rekordy (`Record<klucz, obiekt>`) są świetne dla TypeScriptu, ale słabe
dla większości CMS-ów, które operują na listach. Rozwiązanie: w `0-content/`
trzymać **tablice z polem `key`**, a codegen składa z nich rekord i sprawdza
unikalność:

```json
{
  "accesses": [
    {
      "key": "access-monthly",
      "slug": "miesieczny",
      "name": "Karnet miesięczny",
      "areas": ["area-free-weights", "area-machines"],
      "variants": [
        { "code": "monthly", "label": "Miesiąc", "price": { "amount": 149, "unit": "month" } }
      ]
    }
  ]
}
```

Codegen generuje dokładnie dzisiejszy kształt:

```ts
export const accesses = {
  "access-monthly": { /* … */ },
} satisfies Record<string, Access<AreaKey, ClassKey, PerkKey>>;

export type AccessKey = keyof typeof accesses;
```

Zalety: CMS dostaje listę z drag-and-drop, a model zachowuje tożsamość klucza.
Wada: `key` jest widoczne w formularzu i **nie wolno go zmieniać po utworzeniu**
— zmiana klucza to migracja referencji, nie edycja treści. To trzeba opisać
w instrukcji dla redaktora i pilnować w CI (patrz §6).

### 2.4. Formularze — zakres pierwszego wdrożenia

Sensowny MVP to cztery ekrany:

1. **Cennik** — karnety, warianty, ceny, terminy, dodatki; podgląd macierzy
   „warianty × karnety” liczony przez adapter, nie wpisywany ręcznie.
2. **Kontakt i godziny** — telefon, e-mail, adres, godziny recepcji, social.
3. **Trenerzy i zajęcia** — imię, rola, specjalizacje, Instagram, przypisanie
   do zajęć; lista trenerów jako relacja, nie wolny tekst.
4. **Media** — zdjęcia stref/trenerów/zajęć, wymagany `alt`, credit, kolejność.

Dokumenty prawne lepiej zostawić na drugi etap: wymagają wersjonowania,
akceptacji prawnej i świadomego „publikuję”. CMS może dać edycję, ale
zatwierdzenie powinno zostać po stronie człowieka (PR lub osobna rola).

### 2.5. Media w wariancie Git

- Upload do `1-web/0-assets/uploads/` (albo `0-content/media/`), potem
  istniejący `npm run assets` generuje `7-public/`.
- W CI dodać limit rozmiaru pliku (np. 2 MB na wejściu) i wymóg `alt`.
- Nie wrzucać do repo dziesiątek zdjęć 4000 px; GitHub Pages ma limity
  rozmiaru repo i przepustowości. Docelowo sesja zdjęciowa → WebP + `srcset`.
- Jeśli CMS ma wbudowaną kompresję — włączyć; jeśli nie, dodać krok
  `prepare_assets.py` przed commitem albo w CI.

### 2.6. Podgląd zmian

GitHub Pages **nie ma deploy preview per PR**. Opcje:

1. **Bez podglądu wizualnego** — redaktor widzi formularz i po merge'u stronę.
   Najtaniej, ale ryzykowne przy większych zmianach.
2. **Cloudflare Pages / Netlify tylko do preview** — budują ten sam commit
   z PR-a, produkcja zostaje na GitHub Pages. Darmowe plany wystarczą.
3. **Przeniesienie hostingu** — wtedy preview i ewentualny SSR stają się
   naturalne, ale zmienia się obecny, sprawdzony deploy.

Rekomendacja: na start opcja 1 + testowy PR; przy większym zespole opcja 2.

### 2.7. Uwierzytelnianie i role

- **Pages CMS:** GitHub App; uprawnienia wynikają z dostępu do repo. Osobne
  role redaktora nie istnieją — albo ktoś ma write do repo, albo nie.
- **Sveltia/Decap:** OAuth przez GitHub; przy `editorial_workflow` zmiany
  lądują na branchu i w PR, więc można rozdzielić „redaguje” od „zatwierdza”
  przez uprawnienia GitHub teamów.
- **Keystatic:** GitHub App + write access; ewentualnie Keystatic Cloud.
- W każdym wariancie redaktor potrzebuje konta GitHub. Jeśli to przeszkoda,
  wariant A odpada i trzeba iść w B lub C (logowanie e-mail).

### 2.8. Koszt i nakład

| Element | Koszt |
|---|---|
| CMS (Pages CMS / Sveltia / Decap) | 0 zł |
| OAuth proxy (Sveltia/Decap) | 0 zł w darmowym planie Workera/Netlify |
| Hosting strony | bez zmian (GitHub Pages) |
| Wdrożenie | ok. 4–7 dni: ekstrakcja danych, codegen, schemat, testy, instrukcja |
| Utrzymanie | niskie; aktualizacje CMS-a i pilnowanie, żeby nie zniknął hosting OAuth |

---

## 3. Wariant B — headless CMS z API (SaaS)

Treść żyje w zewnętrznym CMS-ie, a build pobiera ją przez API i zapisuje
**snapshot w repo**. Strona nadal jest statyczna; CMS jest tylko narzędziem
redakcyjnym.

### 3.1. Narzędzia

| Narzędzie | Mocne strony | Uwagi |
|---|---|---|
| **Sanity** | elastyczny schemat, Studio w React, GROQ, CDN obrazów, role, webhooki, dobre preview | darmowy plan dla małego zespołu; limity się zmieniają — sprawdzić przed wyborem |
| **Storyblok** | visual editor, komponenty, Astro SDK, webhooki | najlepszy, jeśli redakcja ma układać sekcje; większe ryzyko „page buildera” |
| **Contentful** | dojrzały, bogate API, uprawnienia | cięższy i droższy; dla jednej strony to nadmiar |
| **DatoCMS / Hygraph / Prismic** | podobne SaaS-y | wybór drugorzędny; liczy się schemat i preview |

### 3.2. Przepływ

```text
Sanity/Storyblok
      │  publish → webhook
      ▼
GitHub Actions
      │  snapshot (JSON) + walidacja + codegen
      ▼
0-core/*.ts (generowane) → build → GitHub Pages
```

Snapshot w repo jest ważny: build nie może zależeć od dostępności API CMS-a
i od zmiany treści w trakcie builda. Webhook odświeża snapshot w osobnym
commicie/PR, a deploy działa jak dziś.

### 3.3. Co zyskujecie, a co płacicie

**Zysk:**

- logowanie e-mail, role redaktor/publikator, historia wersji,
- media library z transformacjami i CDN,
- podgląd wizualny (przy osobnym preview hostingu),
- brak potrzeby konta GitHub u redaktora,
- możliwość pracy z telefonu.

**Koszt:**

- miesięczny abonament (darmowe plany mają limity użytkowników i transferu),
- schemat CMS trzeba utrzymywać w dwóch miejscach: CMS i walidator,
- token API w sekretach GitHub Actions,
- ryzyko lock-inu — migracja treści wymaga eksportu,
- preview wizualny prawie zawsze wymaga drugiego hostingu (SSR lub preview
  deployment), bo GitHub Pages jest statyczne.

### 3.4. Kiedy wybrać B

Gdy spełnione są co najmniej dwa warunki:

- redaktorzy nie mają i nie chcą mieć konta GitHub,
- treść zmienia się co tydzień lub częściej,
- potrzebny jest podgląd „jak będzie wyglądać” przed publikacją,
- są role i odpowiedzialność za publikację,
- budżet rzędu kilkudziesięciu złotych miesięcznie nie jest problemem.

Dla samego cennika i godzin to nadmiar.

---

## 4. Wariant C — CMS self-hosted (Directus / Payload / Strapi)

Własny serwer z bazą danych i panelem administracyjnym. Strona nadal buduje
się statycznie, ale dochodzi drugi system do utrzymania.

| Narzędzie | Charakter | Uwagi |
|---|---|---|
| **Directus** | panel nad istniejącą bazą (Postgres/MySQL/SQLite), role, flows, REST/GraphQL | dobry, gdy chcecie „prawdziwy” admin i integracje; wymaga VPS, backupów, aktualizacji |
| **Payload** | code-first CMS na Next.js, własne API | świetny dla zespołu JS, ale dociąga runtime Next.js; cięższy niż obecny statyk |
| **Strapi** | Node + DB, REST/GraphQL | był w starej stronie (klient OpenAPI nieużywany); nie ma przewagi nad Directusem, a jest cięższy |

**Koszt:** VPS 20–60 zł/mies. + domena/backupy + ok. 7–15 dni wdrożenia
+ stała uwaga na aktualizacje bezpieczeństwa. **Zysk:** pełna kontrola, role,
media, integracje, brak opłat per user. **Ryzyko:** to już nie jest „statyczna
strona z CMS-em”, tylko dodatkowy system, który może paść albo zostać
niezaktualizowany.

Rekomendacja: tylko jeśli w planach jest więcej niż CMS — np. rezerwacje,
członkostwa, panel dla recepcji, integracja z terminalem. Sam cennik tego nie
uzasadnia.

---

## 5. Wariant D — „CMS bez CMS-a” (szybki, tani, ograniczony)

Jeśli celem jest wyłącznie zdjęcie z właściciela obowiązku dzwonienia do
programisty przy każdej zmianie ceny, można zacząć od lżejszych rozwiązań:

| Rozwiązanie | Jak działa | Plusy | Minusy |
|---|---|---|---|
| **GitHub Issue Forms → Actions → PR** | właściciel wypełnia formularz w Issues, Action generuje zmianę JSON i otwiera PR | 0 zł, pełna historia, walidacja w CI, bez nowego logowania | mało przyjazne; każde pole to osobny formularz; brak podglądu |
| **Google Sheets / Airtable → Action** | arkusz jest źródłem, Action pobiera CSV/JSON i generuje model | właściciel zna arkusz; łatwe masowe zmiany cen | łatwo zepsuć strukturę; brak typów; media osobno; zależność od API arkusza |
| **Codespaces / edycja w GitHub Web** | redaktor edytuje TS lub JSON w przeglądarce | pełne typy, zero nowych narzędzi | wymaga szkolenia i ostrożności; łatwo zrobić błąd |
| **Własny mini-panel** | statyczna strona `/admin` + GitHub API | dokładnie dopasowany do modelu | to już projekt CMS-a; utrzymanie i bezpieczeństwo po Waszej stronie |

To dobre **etapy przejściowe** albo uzupełnienie: np. arkusz do masowej zmiany
cen, a CMS do zdjęć i opisów.

---

## 6. Porównanie

| Kryterium | A. Git CMS | B. SaaS API | C. Self-hosted | D. Arkusz/Issue |
|---|---|---|---|---|
| Gdzie treść | repo (JSON/YAML) | baza dostawcy | własna baza | arkusz/Issue |
| Kto edytuje | konto GitHub | e-mail + rola | e-mail + rola | konto Google/GitHub |
| Podgląd wizualny | brak / osobny hosting | zwykle tak (preview) | tak | brak |
| Role i workflow | GitHub (PR) | wbudowane | wbudowane | ograniczone |
| Media | repo + pipeline | CDN dostawcy | własny storage | ręcznie |
| Koszt miesięczny | 0 zł | 0–150 zł | 20–60 zł + ops | 0 zł |
| Wpływ na GitHub Pages | brak | brak (build pobiera snapshot) | brak | brak |
| Czas wdrożenia | 4–7 dni | 7–12 dni | 7–15 dni | 1–2 dni |
| Lock-in | bardzo mały | średni | mały | średni (arkusz) |
| Ryzyko „dwa źródła prawdy” | średnie | wysokie | wysokie | wysokie |
| Dopasowanie do Parysa | **najlepsze** | dobre przy rozwoju redakcji | tylko przy większym systemie | jako etap 0 |

---

## 7. Rekomendacja

### 7.1. Wariant docelowy: A + generowany TS

Najlepszy stosunek zysku do kosztu i ryzyka:

- **CMS:** Pages CMS (najmniej pracy) albo Sveltia CMS (lepszy UX i
  wielojęzyczny interfejs, ale trzeba postawić OAuth proxy). Wybór po
  półdniowym teście na kopii repo.
- **Dane:** `0-content/` w rootcie, tablice z `key`, codegen do obecnych
  modułów `0-core/`.
- **Walidacja:** Zod/JSON Schema w `tools/cms/` + `astro check` +
  `assertModelIntegrity()` + build `1-printables/`.
- **Zakres MVP:** cennik, kontakt/godziny, trenerzy, strefy, media.
- **Poza zakresem:** layout, sekcje strony, SEO, `quality.publishable`,
  analityka, kalendarze.
- **Hosting:** bez zmian — GitHub Pages; ewentualnie Cloudflare Pages tylko
  do podglądu PR-ów.

To zachowuje najważniejszą rzecz w tym repo: **model pozostaje typowany**,
a CMS jest tylko wygodniejszym edytorem danych, nie nowym źródłem prawdy
w runtime.

### 7.2. Kiedy wybrać B zamiast A

Jeśli po rozmowie z właścicielem okaże się, że:

- nikt nie chce konta GitHub,
- zmiany będą co tydzień,
- potrzebny jest podgląd „na żywo” i role,

wtedy **Sanity** (albo Storyblok, jeśli redakcja ma układać sekcje) jest
lepszym wyborem niż walczenie z OAuth i Git-em. Trzeba wtedy zaakceptować
miesięczny koszt i snapshot w repo.

### 7.3. Czego nie robić

- **Nie stawiać WordPressa headless** tylko dlatego, że „wszyscy znają panel”.
  To PHP + baza + aktualizacje + bezpieczeństwo, bez zysku dla tej skali.
- **Nie robić page buildera** (Storyblok/Builder.io) dla całej strony. Obecny
  `site.pages` i design system są spójne; CMS nad layoutem to regres.
- **Nie przenosić treści do `1-web/`.** `1-printables/` czyta `0-core/`
  i musi dalej działać.
- **Nie dopuszczać CMS-a do `quality.publishable`.** To decyzja człowieka,
  a `invariants.ts` ma dalej blokować przedwczesną publikację.
- **Nie zmieniać kluczy encji w CMS-ie.** Zmiana `area-cardio` na
  `area-cardio-2` musi być migracją z aktualizacją referencji, nie edycją pola.

---

## 8. Plan wdrożenia wariantu A (gdy zapadnie decyzja)

### Etap 0 — decyzje i pomiar (0,5 dnia)

1. Wybrać edytora: Pages CMS vs Sveltia (test na kopii repo).
2. Ustalić zakres MVP i osobę odpowiedzialną za treść.
3. Spisać zasady: klucze niezmienne, `alt` wymagany, kwoty w PLN, kolejność
   listy = kolejność w UI.

### Etap 1 — ekstrakcja danych (1–2 dni)

1. `npm run model:export` → punkt odniesienia.
2. Skrypt jednorazowy: TS → `0-content/` (tablice z `key`).
3. Codegen: `0-content/` → `0-core/*.ts`.
4. Test „zero diff”: wygenerowany model po `model:export` jest identyczny
   z wyjściowym (poza kolejnością i formatowaniem).
5. `npm run check`, `npm run build`, `1-printables: npm run check && npm run build`.

### Etap 2 — CMS i CI (1–2 dni)

1. Dodać CMS (`.pages.yml` albo `/admin` + `config.yml`).
2. Skonfigurować logowanie i uprawnienia (GitHub App / OAuth).
3. Dodać krok CI: `cms:check` — generuje ponownie i failuje, jeśli wynik różni
   się od commitowanych plików (`git diff --exit-code`).
4. Dodać test integralności: brak nieznanych kluczy, brak duplikatów, brak
   zmienionych kluczy (porównanie z poprzednim commitem), wymagany `alt`.

### Etap 3 — pilot (1 dzień)

1. Właściciel zmienia jedną cenę i jedno zdjęcie na branchu testowym.
2. Sprawdzić: PR → build → podgląd (jeśli jest) → merge → deploy.
3. Sprawdzić cennik A4 po zmianie.
4. Zebrać uwagi i uprościć formularze.

### Etap 4 — cutover i dokumentacja (1 dzień)

1. Oznaczyć moduły danych jako generowane; dopisać to do `AGENTS.md`.
2. Dodać `1-web/0-docs/CMS-INSTRUKCJA.md` dla redaktora (po polsku, ze
   zrzutami ekranu).
3. Ustalić procedurę awaryjną: ręczna edycja JSON + `npm run cms:sync`,
   rollback przez `git revert`.
4. Zaplanować przegląd po 3 miesiącach: czy CMS jest używany, czy nie warto
   przejść na B.

---

## 9. Ryzyka i sposoby ograniczenia

| Ryzyko | Skutek | Ograniczenie |
|---|---|---|
| Dwa źródła prawdy (JSON i TS) | ktoś edytuje wygenerowany plik i zmiana znika | nagłówek `AUTO-GENERATED`, `cms:check` w CI, code review |
| Zmiana klucza encji | zerwane referencje, błąd builda lub ciche zniknięcie | klucz nieedytowalny po utworzeniu; CI wykrywa zmianę zestawu kluczy |
| CMS zapisze niepoprawny typ | build padnie | Zod + `astro check`; komunikaty po polsku |
| Brak `alt` | błąd `invariants.ts` | pole wymagane w CMS; walidacja przed commitem |
| Zdjęcia za duże | wolna strona, limity GitHub Pages | limit rozmiaru, WebP, `srcset`, sesja zdjęciowa |
| CMS padnie / zniknie | brak edycji, ale strona działa | treść w repo; dla B — snapshot w repo |
| Tokeny i sekrety | wyciek dostępu do repo | sekrety Actions, OAuth w Workerze, 2FA, least privilege |
| CMS zmieni kolejność | inna kolejność w cenniku | listy z jawną kolejnością; test golden |
| Redaktor opublikuje bez akceptacji | błąd prawny/cenowy | PR lub rola „publisher”; `quality.publishable` poza CMS |
| Rozjazd podglądu i produkcji | „u mnie działa” | ten sam commit, ten sam build; preview z PR-a |
| Lock-in dostawcy | trudna migracja | dane w JSON/YAML w repo; eksport; brak proprietary formatów |

---

## 10. Pytania, na które trzeba odpowiedzieć przed wdrożeniem

1. **Kto będzie edytował** — właściciel, recepcja, agencja? Ile osób?
2. **Jak często** zmieniają się ceny i godziny? Czy są promocje sezonowe?
3. **Czy redaktor ma konto GitHub** i czy akceptuje logowanie przez GitHub?
4. **Czy potrzebny jest podgląd wizualny** przed publikacją?
5. **Jaki jest budżet miesięczny** — 0 zł, 50 zł, 200 zł?
6. **Czy w planach są aktualności/blog** i nowe podstrony, czy tylko dane?
7. **Kto zatwierdza** dokumenty prawne i publikację cennika?
8. **Czy w najbliższym roku** dojdzie rezerwacja/recepcja/integracje, które
   uzasadniają wariant C?

Jeśli odpowiedzi to „właściciel, kilka razy w roku, GitHub może być, podgląd
nie jest konieczny, budżet 0 zł, tylko dane” — **wariant A jest oczywisty**.
Jeśli „agencja, co tydzień, bez GitHuba, podgląd tak, budżet 100 zł” —
**wariant B**.

---

## 11. Szkice konfiguracji (poglądowe, nieprodukcyjne)

### 11.1. Pages CMS — minimalny cennik

```yaml
# .pages.yml
media: "1-web/0-assets/uploads"

content:
  - name: cennik
    label: Cennik
    type: file
    path: 0-content/pricing.json
    fields:
      - name: accesses
        label: Karnety
        type: object
        list: true
        fields:
          - { name: key, label: Klucz (nie zmieniaj), type: string, required: true }
          - { name: slug, label: Slug, type: string, required: true }
          - { name: name, label: Nazwa, type: string, required: true }
          - name: variants
            label: Warianty
            type: object
            list: true
            fields:
              - { name: code, label: Kod, type: string, required: true }
              - { name: label, label: Etykieta, type: string, required: true }
              - name: price
                label: Cena
                type: object
                fields:
                  - { name: amount, label: Kwota PLN, type: number, required: true }
                  - { name: unit, label: Jednostka, type: select, options: [entry, term, hour, item] }
```

### 11.2. Sveltia/Decap — kolekcja plików

```yaml
# 1-web/7-public/admin/config.yml
backend:
  name: github
  repo: PatrykJaseniuk/ParysWeb2
  branch: main
  base_url: https://oauth.example.workers.dev

media_folder: "1-web/0-assets/uploads"
public_folder: "/img/uploads"

collections:
  - name: "cennik"
    label: "Cennik"
    files:
      - name: "pricing"
        label: "Karnety i ceny"
        file: "0-content/pricing.json"
        fields:
          - { label: "Karnety", name: "accesses", widget: "list", fields: [
              { label: "Klucz", name: "key", widget: "string" },
              { label: "Nazwa", name: "name", widget: "string" },
              { label: "Warianty", name: "variants", widget: "list", fields: [
                { label: "Kod", name: "code", widget: "string" },
                { label: "Cena", name: "price", widget: "number" }
              ] }
            ] }
```

### 11.3. Walidacja i codegen — szkielet

```ts
// tools/cms/schema.ts
import { z } from "zod";

const Money = z.object({
  amount: z.number().nonnegative(),
  unit: z.enum(["entry", "term", "hour", "item"]),
  type: z.literal("from").optional(),
});

const Variant = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  price: Money,
  term: z.object({ value: z.number().int().positive(), unit: z.enum(["day", "week", "month", "year"]) }).optional(),
  entries: z.number().int().positive().optional(),
  perks: z.array(z.string()).optional(),
});

const Access = z.object({
  key: z.string().regex(/^access-/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  areas: z.array(z.string()).min(1),
  classes: z.array(z.string()).optional(),
  variants: z.array(Variant).min(1),
});

export const Pricing = z.object({ accesses: z.array(Access).min(1) });
```

Po walidacji codegen:

1. sprawdza unikalność `key` i `code`,
2. sprawdza, czy `areas`/`classes`/`perks` istnieją w pozostałych plikach,
3. generuje obiekty TS w kolejności z JSON-a,
4. dopisuje `satisfies` i typy kluczy,
5. na końcu uruchamia `astro check` (albo jest uruchamiany przed nim).

### 11.4. CI — dodatkowy krok

```yaml
- name: Sprawdź zgodność modelu z CMS
  working-directory: 1-web
  run: npm run cms:check
```

`cms:check` powinien:

```text
cms:sync  → generuje 0-core/*.ts
git diff --exit-code 0-core/  → fail, jeśli dane w repo są niezgodne z CMS
```

Dopiero potem `npm run check` i `npm run build`.

---

## 12. Podsumowanie

- **Najlepszy stosunek zysku do kosztu:** wariant A — Git-based CMS
  (Pages CMS lub Sveltia) + `0-content/` + generowany typowany `0-core/`.
- **Najlepszy UX redakcyjny:** wariant B — Sanity lub Storyblok, ale z
  snapshotem w repo i osobnym preview hostingiem.
- **Wariant C** ma sens tylko wtedy, gdy CMS jest częścią większego systemu
  (rezerwacje, członkostwa, recepcja).
- **Wariant D** nadaje się na etap przejściowy albo do masowej zmiany cen.
- Niezależnie od wyboru: CMS nie może być źródłem prawdy w runtime, nie może
  omijać typów, `alt` i bramki `publishable`, a treść musi pozostać poza
  `1-web/`, żeby `1-printables/` dalej działał.

---

## Źródła

Dokumentacja narzędzi (stan na 2026-11-12; wersje, limity i cenniki należy
sprawdzić przed wdrożeniem):

- Pages CMS — wprowadzenie i konfiguracja: <https://pagescms.org/docs/>
- Pages CMS — GitHub App i uprawnienia: <https://pagescms.org/docs/guides/installing/github-app/>
- Sveltia CMS — opis, licencja, ograniczenia: <https://sveltiacms.app/en/docs/intro>
- Sveltia CMS — backend GitHub: <https://sveltiacms.app/en/docs/backends/github>
- Keystatic — tryb GitHub wymagający hosta Node.js: <https://keystatic.com/docs/github-mode>
- Astro — przegląd integracji CMS: <https://docs.astro.build/en/guides/cms/>
- Sanity — cennik i limity: <https://www.sanity.io/pricing>
