# `tools/cms` — generator treści CMS → model

Generator zamienia edytowalne pliki `0-content/*.json` na typowane moduły
w `0-core/`. Nie jest importowany przez stronę ani przez cennik A4 — to
narzędzie build-time.

## Uruchamianie

Z katalogu `1-web/`:

```bash
npm run cms:sync    # zapisz wygenerowane moduły 0-core
npm run cms:check   # tylko sprawdź zgodność (bez zapisu)
```

`cms:check` jest częścią `npm run check`. Build strony i cennika uruchamia
`cms:sync` przed budową, a workflow **CMS sync** commituje wygenerowane pliki
po zmianie w `0-content/`.

## Przepływ

```text
0-content/*.json
      │  walidacja + sortowanie po "order"
      ▼
tools/cms/generate.mjs
      │  Record<klucz, obiekt> + satisfies + typy kluczy
      ▼
0-core/1-company.ts, 1-perks.ts, 1-partners.ts, 2-areas.ts,
0-core/2-classes.ts, 2-services.ts, 3-single-entry.ts, 3-accesses.ts
```

Walidacja obejmuje:

- wymagane pola i typy kluczy (`area-`, `class-`, `trainer-`, `svc-`,
  `partner-`, `acc-`),
- unikalność kluczy i kodów wariantów,
- referencje `areas`, `classes`, `perks`, `trainer`, `personal_training.trainers`,
- dodatnią kolejność `order`.

Puste pola opcjonalne (`null`, `""`, puste tablice) są usuwane, żeby CMS nie
wpisywał do modelu wartości pustych. Puste pola wymagane przechodzą do TS
i zatrzymują `astro check`.

## Zasady

- **Nie edytuj wygenerowanych plików `0-core/`** — nagłówek mówi
  `AUTO-GENERATED`, a `cms:check` wykryje ręczną zmianę.
- Klucz (`key`, `code`) jest tożsamością encji; zmiana klucza to migracja
  referencji, nie edycja treści.
- Kolejność w rekordzie wynika z pola `order` (1 = pierwszy).
- Generowane pliki są commitowane, żeby build na GitHub Pages nie wymagał
  uruchamiania CMS-a ani Nodeowego generatora.
- Nowa encja w CMS: dodaj wpis w JSON i — jeśli pojawia się nowa opcja
  w polu `select` — zaktualizuj `.pages.yml`.

## Dodawanie nowego pliku treści

1. Dodaj plik do `0-content/` i wpis `type: file` w `.pages.yml`.
2. Dodaj `readJson(...)` i walidację w `generate.mjs`.
3. Dodaj emitter (`files.set(...)`) z właściwym typem i importami.
4. Uruchom `npm run cms:sync`, potem `npm run check` i buildy.
5. Dopisz plik do listy generowanych w `AGENTS.md`.
