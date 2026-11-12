# Pages CMS — instrukcja redaktora

**Status:** MVP na gałęzi `cms/pages-cms` · **Zakres:** cennik, firma/kontakt,
strefy, trenerzy, zajęcia, usługi, partnerzy, dodatki, wejście jednorazowe.

CMS edytuje pliki `0-content/*.json`. Z nich generator tworzy typowany model
`0-core/`, z którego budowana jest strona i cennik A4. Nie edytujesz plików
`0-core/` ani kodu strony.

## 1. Logowanie

1. Wejdź na <https://app.pagescms.org>.
2. Zaloguj się kontem GitHub **albo** użyj zaproszenia e-mailem od
   administratora (Pages CMS pozwala zapraszać redaktorów bez konta GitHub).
3. Wybierz repozytorium `PatrykJaseniuk/ParysWeb2`.
4. W menu po lewej wybierz sekcję: Firma i kontakt, Cennik i karnety, Strefy,
   Trenerzy i zajęcia, Usługi, Partnerzy, Dodatki, Wejście jednorazowe.

Jeśli nie widzisz repo, poproś administratora o zaproszenie lub nadanie dostępu
do repozytorium.

## 2. Zasady edycji

- **Klucz jest tożsamością.** Pola `key` / `code` (np. `acc-4-areas`,
  `area-cardio`, `trainer-artur`) nie zmieniaj po utworzeniu. Zmiana klucza
  zrywa referencje i wymaga migracji.
- **Kolejność = pole `order`.** 1 oznacza pierwszy element w cenniku lub na
  liście. Po dodaniu wpisu nadaj mu kolejny numer.
- **Ceny w PLN, bez „zł” w polu kwoty.** Kwota ma być liczbą, np. `149`.
- **Nie usuwaj wpisów, których nie rozumiesz.** Usunięcie karnetu, strefy lub
  trenera może zepsuć referencje w innych sekcjach.
- **Nowa strefa / trener / zajęcia / kod wariantu** wymaga też dopisania opcji
  w `.pages.yml` (pole `select`), inaczej nie będzie widoczne w formularzu.
  To zadanie dewelopera.

## 3. Zapis i publikacja

1. Po zmianie kliknij **Save**. CMS zapisuje commit do repozytorium.
2. GitHub Actions uruchamia kontrolę:
   - generator `0-content` → `0-core` (workflow **CMS sync** commituje wynik),
   - `npm run check` — typy i referencje,
   - build strony i cennika A4.
3. Jeśli kontrola przejdzie, zmiana trafia na stronę po wdrożeniu.
4. Jeśli kontrola się nie powiedzie, cofnij zmianę w CMS albo popraw błąd.
   Nie edytuj `0-core/` ręcznie.

## 4. Dla dewelopera

Po zmianie JSON poza CMS-em:

```bash
cd 1-web
npm run cms:sync     # 0-content → 0-core
npm run check        # cms:check + astro check
npm run build
cd ../1-printables
npm run check && npm run build
```

`npm run cms:sync` jest jedynym dozwolonym sposobem zmiany wygenerowanych
modułów. `npm run cms:check` wykryje rozjazd bez zapisu; build i tak synchronizuje
model przed budową, ale commit powinien zawierać oba pliki.

## 5. Czego jeszcze nie ma

- **Media:** zdjęcia i bindingi (`media.assets`, `media.bindings`) nadal
  edytuje deweloper w `1-web/0-site/1-site.ts`. CMS nie ma jeszcze pola
  uploadu podłączonego do pipeline'u.
- **Dokumenty prawne, marka, SEO, layout:** poza CMS-em.
- **`quality.publishable`:** decyzja człowieka, nie pole w CMS.
- **Podgląd wizualny:** GitHub Pages nie ma preview per PR; na razie
  obowiązuje formularz + build.

## 6. Awaria i wycofanie

- Zmianę można cofnąć `git revert` commita CMS-a.
- Jeśli CMS zapisze niepoprawny JSON, build zatrzyma się na walidacji
  generatora — komunikat wskaże plik i encję.
- Jeśli Pages CMS jest niedostępny, dane nadal są w repo; deweloper może
  edytować JSON i uruchomić `npm run cms:sync`.
