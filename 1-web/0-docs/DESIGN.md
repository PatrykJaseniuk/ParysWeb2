# Design system — Sport Studio Parys

**Wersja:** 1.0 · **Zakres:** strona publiczna (marketing + cennik)

---

## 1. Idea

Strona ma wyglądać jak **karta sprzętu w dobrej siłowni**: dużo powietrza, ostre
krawędzie, techniczne etykiety, konkretne liczby. Nie jak szablon fitness z banku zdjęć.

Cztery zasady:

1. **Konkret zamiast ozdobników** — każda sekcja odpowiada na pytanie (ile, gdzie, kiedy, co).
2. **Czerwień jest akcentem, nie tłem** — wypełnia tylko przyciski, plakietki i pojedyncze znaki.
3. **Ciemno, ale nie „gamingowo”** — brak neonów, gradientów i poświat. Kontrast i typografia robią robotę.
4. **Cennik to papier** — jedyna jasna sekcja w całym serwisie. Ma wyglądać jak wydruk na ścianie recepcji.

---

## 2. Paleta

| Token | Hex | Rola | Kontrast |
| --- | --- | --- | --- |
| `ink` | `#0a0a0b` | Tło główne | — |
| `ink-2` | `#101012` | Tło kart i sekcji wtórnych | — |
| `ink-3` | `#17171a` | Tło pod zdjęcia, pola | — |
| `line` | `#26262b` | Linie 1 px, obramowania | — |
| `bone` | `#f2f1ed` | Tekst główny, sekcja „papier” | 17,5:1 na `ink` |
| `mist` | `#9d9da5` | Tekst pomocniczy | 7,4:1 na `ink` |
| `brand` | `#e31e24` | Wypełnienia, plakietki, duże liczby | 4,2:1 na `ink` (OK dla ≥18 px bold) |
| `brand-deep` | `#b01218` | Hover przycisków | — |
| `brand-text-dark` | `#f2404a` | Mały czerwony tekst na ciemnym tle | 6,1:1 ✅ |
| `brand-text-paper` | `#c8151b` | Mały czerwony tekst na papierze | 5,2:1 ✅ |

**Zasada:** czerwień `#e31e24` zostaje dla dużych elementów. Małe etykiety (10–11 px)
używają wariantów `brand-text-*`, żeby spełnić AA.

Kolory partnerów i zdjęć nie są modyfikowane poza filtrem `grayscale` (patrz § 7).

---

## 3. Typografia

### Rodziny
| Rola | Font | Waga | Zastosowanie |
| --- | --- | --- | --- |
| Display | **Archivo Variable** | 700–800 | Nagłówki H1–H3, ceny, duże liczby |
| Tekst | **Inter Variable** | 400–600 | Akapity, opisy, listy |
| Techniczny | monospace systemowy | 400–600 | Etykiety sekcji, indeksy, nadtytuły |

Oba fonty są self-hostowane (`@fontsource-variable`), tylko podzbiory latin + latin-ext.

### Skala
| Element | Rozmiar | Uwagi |
| --- | --- | --- |
| H1 (hero) | `clamp(2,4rem, 5,2rem)` | wersaliki, tracking −0,035 em, interlinia 0,88 |
| H1 (podstrona) | `clamp(2,3rem, 4,8rem)` | j.w. |
| H2 (sekcja) | `clamp(1,9rem, 3,5rem)` | j.w. |
| H3 (karta, podstrona) | `clamp(1,35rem, 1,9rem)` | j.w. |
| Lead | 15–18 px / 1,65 | `mist` |
| Treść | 15 px / 1,75 | `bone/80` |
| Etykieta | 10–11 px, tracking 0,3 em | wersaliki, mono, `mist` |
| Cena w tabeli | 20 px, 700, tabular | `num` |

### Zasady
- Nagłówki zawsze **wersalikami**, bez wyjątków od H1 do H3.
- Tracking ujemny tylko dla display; etykiety mają dodatni (0,2–0,3 em).
- Liczby zawsze **tabelaryczne** (`.num`) — ceny nie mogą „skakać” przy porównaniu.
- Maks. szerokość akapitu: 65–70 znaków (`max-w-xl` / `max-w-2xl`).
- Polskie cudzysłowy „…”, półpauza –, nie łącznik. Ceny: `1 390 zł` z niełamliwą spacją (`Intl.NumberFormat`).

---

## 4. Siatka i przestrzeń

- Kontener: `max-width: 1440 px`, padding 20 / 32 / 48 px (mobile / tablet / desktop).
- Dwunastokolumnowa siatka na desktopie (`lg:grid-cols-12`).
- Rytm pionowy sekcji: `py-14` → `lg:py-20` (56 → 80 px).
- Odstępy w kartach: 20–28 px; między kartami 16 px (mobile) / 20 px (desktop).
- Siatki z **włosowymi liniami** zamiast cieni: `border border-line`, `gap-px` z tłem `line`.

---

## 5. Kształty

- Promień: **2 px** (przyciski, karty) — praktycznie ostre.
- Brak cieni poza jednym: `shadow-[0_1px_0_0_rgba(255,255,255,0.08)]` pod sticky headerem.
- Obramowania zawsze 1 px, kolor `line` (`#26262b`).
- Ikony w kwadratach 40–44 px z obramowaniem — nigdy wypełnionych kół (poza monogramami trenerów).

---

## 6. Komponenty

### Przyciski
| Wariant | Wygląd | Użycie |
| --- | --- | --- |
| `btn-primary` | tło `brand`, tekst biały | główne CTA („Zobacz karnety”, „Cennik”) |
| `btn-ghost` | przezroczysty, obramowanie `line` | akcje drugorzędne („Zadzwoń”) |
| `btn-light` | tło `ink`, tekst `bone` | CTA na jasnej sekcji |
| `btn-sm` | 10 px, mniejszy padding | nagłówek, pasek mobilny |

Wszystkie: mono, wersaliki, tracking 0,18 em, wysokość ~44 px (44 px = minimum dotykowe).

### Nagłówek sekcji (`SectionHead`)
Indeks (`01`) · etykieta · linia górna · H2 · opis · opcjonalny link po prawej.
Wariant `tone="light"` dla sekcji na papierze.

### Karta strefy
Zdjęcie 16:10 (grayscale 55% → kolor na hover), numer w rogu, opcjonalna plakietka
„Kalendarz”, tytuł + jednozdaniowy opis, strzałka w kwadracie.

### Tabela cennika
Macierz `wariant × karnet`. Nagłówek kolumny: numer, nazwa, podtytuł, „od X zł”.
Wiersz: nazwa wariantu + opis. Cena 20 px bold. Brak wariantu = `—` (`aria-label="niedostępne"`).
Kolumna wyróżniona: tło `brand/6%`, górna linia 2 px `brand`, plakietka „Pełny zakres”.
Stopka: karty partnerskie, zajęcia, zniżki.

Mobile: 4 karty z listą wariantów (bez poziomego scrolla).

### Fasada mapy / kalendarza
Prostokąt z ikoną, tytułem, przyciskiem „Pokaż mapę/kalendarz” i linkiem zewnętrznym.
Iframe ładuje się **dopiero po kliknięciu** (prywatność + wydajność).

### Pasek mobilny (sticky)
Dwa przyciski: „Zadzwoń” (ghost) i „Cennik” (primary). Zawsze widoczny na `lg:hidden`,
z `env(safe-area-inset-bottom)`.

### Marquee
Przewijany pas nazw stref i usług, 38 s, pauza na hover, wyłączony przy `prefers-reduced-motion`.

### FAQ
`<details>` z numeracją, ikoną chevron obracaną w `group-open`. Bez JS.

---

## 7. Obrazy i ikony

- **Zdjęcia stref**: 711×400 px źródła, wyświetlane max 500 px szerokości; `grayscale(0.55)`
  w spoczynku, kolor na hover — ujednolica różne warunki zdjęciowe.
- **Partnerzy**: skany kart (nie wektory) prezentowane jako karty w kaflach 16:10.
- **Trenerzy**: monogramy (inicjał w czarnym kole) do czasu sesji zdjęciowej.
- **Ikony**: własny zestaw 22 ikon liniowych 24×24, stroke 1,75, `currentColor`.

---

## 8. Ruch

| Element | Czas | Krzywa |
| --- | --- | --- |
| Hover przycisków / linków | 200 ms | ease |
| Zoom zdjęcia w karcie | 500 ms | ease |
| Marquee | 38 s liniowo | — |
| Obrót chevron w FAQ | 200 ms | ease |

Brak animacji wejścia sekcji, parallaxu i autoplay wideo. `prefers-reduced-motion`
wyłącza wszystko poza zmianami koloru.

---

## 9. Tryb jasny / ciemny

Strona jest **ciemna w całości**, z jednym wyjątkiem: sekcja cennika (`.bg-bone`) i
sekcja trenerów. Nie ma przełącznika motywu — spójność z marką (czerń + czerwień)
jest ważniejsza niż preferencja systemowa.

Elementy na papierze używają własnej skali szarości (`black/60`, `black/15`) i
ciemniejszej czerwieni `brand-text-paper`.

---

## 10. Dostępność w designie

- Minimalny rozmiar tekstu: 10 px tylko dla etykiet mono (nigdy dla treści).
- Kontrast treści ≥ 7:1, tekst pomocniczy ≥ 4,5:1, akcenty ≥ 4,5:1 (małe) / 3:1 (duże).
- Focus: 2 px `brand`, offset 3 px — widoczny na ciemnym i jasnym tle.
- Wszystkie elementy interaktywne ≥ 44×44 px.
- Informacja nigdy nie jest przekazywana tylko kolorem (brak wariantu = `—` i `aria-label`).
- `prefers-reduced-motion` respektowane globalnie.

---

## 11. Czego nie robimy

- Brak karuzel z automatycznym przewijaniem.
- Brak „hero” z pełnoekranowym wideo w tle (189 MB wideo z eksportu tego nie udźwignie).
- Brak liczników, odliczań i sztucznej pilności.
- Brak ikon emoji w interfejsie.
- Brak zaokrągleń > 4 px i cieni „materialowych”.
