# Logo Parys — ściągawka

## Do użycia w nowej stronie

| Rola | Plik źródłowy | Render PNG | Uwagi |
| --- | --- | --- | --- |
| Logo oficjalne (ikona + PARYS) | [`svg/Parys_logo_wektor.svg`](svg/Parys_logo_wektor.svg) | [`renders/parys-logo-official.png`](renders/parys-logo-official.png) | Oficjalny wektor wskazywany w JSON-LD; pełny napis PARYS. Odzyskany z historii Git. |
| Logo nagłówka (wariant z konturem) | [`svg/Parys_logo_wektor_1.svg`](svg/Parys_logo_wektor_1.svg) | [`renders/parys-logo-primary.png`](renders/parys-logo-primary.png) | Czerwona ikona `#e31e24` + kontur PARYS; odpowiada komponentowi `IconParysLogo`. |
| Ikona / favicon | [`svg/IconParysLogoMini.svg`](svg/IconParysLogoMini.svg) | [`renders/parys-icon.png`](renders/parys-icon.png) | Czerwony zaokrąglony kwadrat z białą sylwetką. |
| Motto | [`svg/Parys_haslo.svg`](svg/Parys_haslo.svg) | [`renders/parys-motto.png`](renders/parys-motto.png) | „Nie pozwól aby przypadek uformował Twoje ciało”. |
| Logo 24/7 | [`svg/Parys_logo_24_7_SC.svg`](svg/Parys_logo_24_7_SC.svg) | [`renders/parys-logo-24-7.png`](renders/parys-logo-24-7.png) | Wariant „siłownia cross + 24/7”. |
| Logo poziome (szare) | [`svg/ParysLogoLight.svg`](svg/ParysLogoLight.svg) | [`renders/parys-logo-horizontal-grey.png`](renders/parys-logo-horizontal-grey.png) | Szara ikona + czarny napis. |
| Wordmark „siłownia / cross” | [`svg/Parys_SC_poziom.svg`](svg/Parys_SC_poziom.svg) | [`renders/parys-wordmark-silownia-cross.png`](renders/parys-wordmark-silownia-cross.png) | Sam tekst, bez ikony. |

## Warianty dodatkowe

- `svg/Parys_logo_3D_pion.svg` / `svg/Parys_logo_3D_poziom.svg` — logo 3D „siłownia - cross”.
- `svg/Parys_SC_pion.svg` — logo „siłownia - cross” w pionie.
- `svg/Parys_logo_wektor_SC_poziom.svg` — logotyp poziomy z ikoną i dopiskiem „siłownia - cross”.
- `svg/Parys_logo_24_7_.svg` — samo 24/7.
- `svg/ParysLogoDark.svg` — wersja na ciemne tło (białe elementy).
- `svg/g2.svg`, `svg/g3.svg` — wordmarki „siłownia cross”.
- `svg/freedom.svg` — ikona dłoni z ptakiem (używana przy karnetach).

## Nie używać na produkcji

- `svg/cos.svg` — placeholder.
- `svg/test.svg` — plik testowy.
- `legacy/dalle-logo-attempt-*.png` — próby logo z DALL·E.
- `legacy/fitness-sport-studio-logo.png` — dawne logo „PARYS fitness sport studio”.
- `legacy/Parys_SC_pion.jpeg` — logo na czarnym tle, niska jakość.

## Kolory marki

| Kolor | HEX |
| --- | --- |
| Czerwień logo | `#e31e24` |
| Czerwień UI (Mantine) | `#cb171d` |
| Ciemny | `#2b2a29` |
| Jasny | `#ebecec` |
| Biały | `#fefefe` |

Uwaga: pliki `renders/*.png` są wygenerowane z SVG przez Inkscape i przycięte z białego marginesu.
Mają przezroczyste tło; jeśli podglądarka pokazuje białe tło, to jest to tło komponentu, nie pliku.
