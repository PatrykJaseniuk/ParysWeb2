import type { LegalDocument } from "./0-types";

/**
 * Przeprojektowany regulamin klubu — wersja następcza dla `terms`
 * z `1-legal.ts`. Oba dokumenty żyją obok siebie do czasu, aż konsument
 * (warstwa strony) zdecyduje się przełączyć na ten wariant.
 *
 * Zmiany względem `terms`:
 *   - wydzielona sekcja definicji (spójna terminologia w całym dokumencie),
 *   - osobne sekcje „Godziny i dostęp” oraz „Karta klubowa”,
 *   - nowe sekcje „Zdrowie i bezpieczeństwo” oraz „Rozwiązanie umowy”,
 *   - doprecyzowane zasady dla osób niepełnoletnich (do 13 lat pod opieką,
 *     13–17 lat za pisemną zgodą opiekuna),
 *   - jeden spójny akapit o monitoringu i ochronie danych.
 *
 * Dokument jest danymi, nie treścią strony: te same zasady obowiązują
 * w recepcji, na stronie i w materiałach drukowanych. Warstwa strony
 * renderuje sekcje po kolei i podstawia tokeny:
 *
 *   {address}        — adres obiektu,
 *   {email}          — adres e-mail recepcji,
 *   {phone}          — numer telefonu recepcji,
 *   {club_card_fee}  — opłata za kartę klubową,
 *   {entry_price}    — cena wejścia jednorazowego.
 *
 * Tokeny podstawia adapter (`1-web/1-data/business.ts`), więc ceny i kontakt
 * mają jedno źródło prawdy. Rdzeń nie zawiera znaczników HTML.
 */

export const regulamin: LegalDocument = {
  slug: "regulamin-v2",
  title: "Regulamin",
  description:
    "Zasady korzystania z obiektu Sport Studio Parys w Nysie — dostęp 24/7, karnety, karta klubowa, wejścia, zajęcia, usługi, monitoring i reklamacje.",
  version: "2.0",
  effective_from: "2026-11-09",
  intro: [
    "Regulamin określa zasady korzystania z obiektu Sport Studio Parys przy {address} oraz świadczonych w nim usług, w tym zasady sprzedaży karnetów, wejść jednorazowych i usług dodatkowych.",
    "Regulamin stanowi wzorzec umowy w rozumieniu art. 384 Kodeksu cywilnego. Zawarciu umowy członkowskiej, zakupowi wejścia jednorazowego lub rezerwacji usługi towarzyszy zapoznanie się z regulaminem i jego akceptacja. Regulamin jest dostępny w recepcji oraz na stronie internetowej klubu.",
    "Integralną częścią regulaminu jest Cennik karnetów i usług oraz wzór umowy członkowskiej.",
  ],
  sections: {
    "postanowienia-ogolne": {
      title: "§ 1. Postanowienia ogólne",
      paragraphs: [
        "Organizatorem obiektu i stroną umów z Klientami jest Sport Studio Parys, {address}, e-mail: {email}, tel. {phone}.",
      ],
      items: [
        "Regulamin stosuje się do wszystkich osób przebywających na terenie obiektu, niezależnie od tytułu prawnego: karnetu, wejścia jednorazowego, programu partnerskiego lub usługi dodatkowej.",
        "W sprawach nieuregulowanych regulaminem stosuje się przepisy prawa polskiego, w szczególności Kodeksu cywilnego oraz ustawy o prawach konsumenta.",
      ],
    },
    definicje: {
      title: "§ 2. Definicje",
      items: [
        "Klub — obiekt Sport Studio Parys wraz ze strefami treningowymi, usługami i zapleczem.",
        "Klubowicz — osoba, która zawarła umowę członkowską i posiada ważny, opłacony karnet.",
        "Klient — Klubowicz oraz osoba korzystająca z klubu na podstawie wejścia jednorazowego lub programu partnerskiego.",
        "Karnet — imienne, przedpłacone uprawnienie do korzystania z klubu w zakresie i przez okres wskazany w Cenniku.",
        "Karta klubowa — imienny nośnik dostępu do klubu, wydawany przy rejestracji.",
        "Wejście jednorazowe — jednorazowe uprawnienie do korzystania ze wszystkich stref i zajęć grupowych, bez rejestracji i karty.",
        "Recepcja — punkt obsługi; godziny jej pracy podane są na stronie Kontakt.",
        "Cennik — wykaz karnetów, wejść i usług wraz z cenami brutto, stanowiący załącznik do regulaminu.",
        "Zajęcia grupowe — Cross prowadzony w małych grupach.",
        "Umowa członkowska — umowa zawierana na czas określony, dotycząca wybranego karnetu.",
        "Monitoring — system wizyjny obejmujący oznaczone obszary obiektu.",
      ],
    },
    "godziny-i-dostep": {
      title: "§ 3. Godziny otwarcia i zasady dostępu",
      items: [
        "Klub dla Klubowiczów jest dostępny przez całą dobę, we wszystkie dni tygodnia. Wejście poza godzinami pracy recepcji odbywa się na kartę klubową.",
        "Recepcja pracuje od poniedziałku do piątku w godzinach 08:00–22:00 oraz w soboty w godzinach 09:00–14:00; w niedziele i święta recepcja jest nieczynna.",
        "Wejście jednorazowe jest możliwe wyłącznie w godzinach pracy recepcji.",
        "Programy partnerskie bez karty klubowej (np. MultiSport) są obsługiwane wyłącznie w godzinach pracy recepcji.",
        "O planowanych przerwach technicznych klub informuje z wyprzedzeniem w recepcji i na stronie internetowej.",
      ],
    },
    "karta-klubowa": {
      title: "§ 4. Karta klubowa",
      items: [
        "Karta klubowa wydawana jest przy rejestracji karnetu. Opłata za wydanie karty wynosi {club_card_fee}.",
        "Karta jest imienna i nieprzenoszalna. Nie wolno jej udostępniać, używać cudzej karty ani umożliwiać wejścia osobie trzeciej.",
        "Utratę lub zniszczenie karty zgłoś niezwłocznie w recepcji. Wydanie nowej karty wiąże się z opłatą {club_card_fee}.",
        "Klub może zablokować kartę i odmówić wstępu osobie, której karnet wygasł lub która narusza regulamin.",
      ],
    },
    karnety: {
      title: "§ 5. Karnety",
      items: [
        "Rodzaje karnetów, ich zakres (strefy, zajęcia grupowe) oraz ceny określa Cennik.",
        "Wszystkie ceny są cenami brutto i zawierają podatek VAT.",
        "Karnet obowiązuje przez okres wskazany w Cenniku, liczony od dnia zakupu.",
        "Karnety są przedpłacone, nie odnawiają się automatycznie i nie podlegają zawieszaniu ani blokowaniu.",
        "Karnet jest imienny; nie można przenieść go na inną osobę ani odstąpić praw z niego wynikających.",
        "Karnety ulgowe (uczniowski, studencki, emerycki) wymagają dokumentu potwierdzającego uprawnienie. Brak dokumentu może skutkować odmową zastosowania ceny ulgowej.",
        "Zmiana Cennika nie wpływa na karnety już opłacone.",
      ],
    },
    "wejscia-jednorazowe-i-programy-partnerskie": {
      title: "§ 6. Wejścia jednorazowe i programy partnerskie",
      items: [
        "Wejście jednorazowe kosztuje {entry_price}, obejmuje wszystkie strefy oraz zajęcia grupowe i obowiązuje wyłącznie w godzinach pracy recepcji.",
        "MultiSport wymaga weryfikacji tożsamości przez pracownika recepcji i jest dostępny wyłącznie w godzinach jej pracy.",
        "Medicover Sport, FitProfit i PZU po rejestracji pozwalają odebrać kartę klubową dającą dostęp całodobowy i umożliwiającą samodzielną rejestrację wizyty w terminalu.",
        "Programy partnerskie opłacają wyłącznie wejścia jednorazowe; nie służą do opłacania karnetów i nie są nośnikiem dostępu.",
      ],
    },
    "zajecia-grupowe-i-trening-personalny": {
      title: "§ 7. Zajęcia grupowe i trening personalny",
      items: [
        "Zapisy na zajęcia i trening personalny prowadzi recepcja — osobiście lub telefonicznie.",
        "Liczba miejsc jest ograniczona; decyduje kolejność zgłoszeń.",
        "Rezerwację odwołaj najpóźniej godzinę przed rozpoczęciem. Nieodwołana rezerwacja przepada.",
        "Prosimy o punktualność — spóźnienie może uniemożliwić udział w zajęciach.",
        "Podczas zajęć i treningu obowiązują polecenia trenera dotyczące techniki i bezpieczeństwa.",
      ],
    },
    "uslugi-dodatkowe": {
      title: "§ 8. Usługi dodatkowe",
      items: [
        "Sauna — wynajęcie pomieszczenia na godzinę na wyłączność, dla maksymalnie 6 osób. Rezerwacja telefoniczna najpóźniej godzinę przed wizytą. Obowiązuje ręcznik i obuwie zmienne; osoby z przeciwwskazaniami zdrowotnymi korzystają z sauny na własną odpowiedzialność.",
        "Badminton — wynajęcie kortu na godzinę, rezerwacja w recepcji. Obowiązuje obuwie o podeszwie niebrudzącej.",
        "Bufet i sklep — sprzedaż napojów, odżywek i akcesoriów na zasadach sprzedaży detalicznej; ceny podane są na miejscu.",
        "Rezerwacje usług dodatkowych odwołuje się najpóźniej godzinę przed rozpoczęciem.",
      ],
    },
    "zasady-korzystania-z-obiektu": {
      title: "§ 9. Zasady korzystania z obiektu",
      items: [
        "W strefach treningowych obowiązuje strój sportowy, zmienne obuwie i ręcznik.",
        "Sprzęt po użyciu odkładaj na miejsce; wolne ciężary i maszyny wycieraj po treningu.",
        "Zabrania się wnoszenia alkoholu i środków odurzających oraz palenia tytoniu poza miejscami do tego wyznaczonymi.",
        "Wejście do pomieszczeń technicznych i zaplecza jest dozwolone wyłącznie pracownikom klubu.",
        "Sprzęt własny można wnosić wyłącznie za zgodą obsługi.",
        "Nie wolno filmować ani fotografować innych osób bez ich zgody.",
        "Zabrania się wprowadzania zwierząt, z wyjątkiem psa asystującego.",
        "Prowadzenie odpłatnych treningów dla innych osób bez zgody klubu jest zabronione.",
        "Awarię sprzętu lub zagrożenie bezpieczeństwa zgłoś niezwłocznie w recepcji.",
      ],
    },
    "zdrowie-i-bezpieczenstwo": {
      title: "§ 10. Zdrowie i bezpieczeństwo",
      items: [
        "Z usług klubu korzystasz na własną odpowiedzialność, w granicach własnych możliwości zdrowotnych. W razie wątpliwości skonsultuj się z lekarzem.",
        "Nie korzystaj ze sprzętu będąc pod wpływem alkoholu, środków odurzających lub w stanie złego samopoczucia.",
        "W razie wypadku lub nagłego pogorszenia samopoczucia zgłoś się do obsługi; na obiekcie znajduje się apteczka pierwszej pomocy.",
        "Przestrzegaj instrukcji obsługi sprzętu i oznakowania stref oraz poleceń obsługi w sytuacjach zagrożenia.",
      ],
    },
    "osoby-niepelnoletnie": {
      title: "§ 11. Osoby niepełnoletnie",
      items: [
        "Osoby poniżej 13. roku życia mogą przebywać w klubie wyłącznie pod opieką osoby dorosłej.",
        "Zawarcie umowy członkowskiej przez osobę w wieku 13–17 lat wymaga pisemnej zgody przedstawiciela ustawowego lub opiekuna prawnego.",
        "Przedstawiciel ustawowy lub opiekun prawny potwierdza zapoznanie się z regulaminem i ponosi odpowiedzialność w zakresie przewidzianym prawem.",
        "Klub nie świadczy usługi opieki nad osobami niepełnoletnimi.",
      ],
    },
    "monitoring-i-ochrona-danych": {
      title: "§ 12. Monitoring i ochrona danych",
      paragraphs: [
        "Teren obiektu jest objęty monitoringiem wizyjnym w celu zapewnienia bezpieczeństwa osób i mienia. Obszary monitorowane oznaczone są tablicami informacyjnymi. Nagrania przechowujemy przez 30 dni, chyba że stanowią dowód w postępowaniu — wtedy dłużej. Dostęp do nagrań mają wyłącznie osoby upoważnione oraz uprawnione organy. Zasady przetwarzania danych osobowych, w tym wizerunku, określa klauzula informacyjna przekazywana przy zapisie oraz polityka prywatności dostępna na stronie internetowej.",
      ],
    },
    odpowiedzialnosc: {
      title: "§ 13. Odpowiedzialność",
      items: [
        "Klub utrzymuje sprzęt i urządzenia w stanie sprawnym i dba o bezpieczeństwo w strefach treningowych.",
        "Rzeczy pozostawione bez nadzoru przechowywane są na zasadach określonych w prawie; przedmioty wartościowe oddaj do depozytu w recepcji.",
        "Klient odpowiada za szkody wyrządzone w mieniu klubu z własnej winy.",
        "W razie dłuższego zamknięcia strefy warunki rozliczenia ustalane są indywidualnie.",
      ],
    },
    "rozwiazanie-umowy": {
      title: "§ 14. Rozwiązanie umowy",
      items: [
        "Umowa członkowska jest zawierana na czas określony. Po upływie terminu nie odnawia się automatycznie.",
        "Karnet jest przedpłacony; rozwiązanie umowy przed upływem terminu nie powoduje zwrotu ceny za niewykorzystany okres, z zastrzeżeniem przepisów powszechnie obowiązujących.",
        "Klub może rozwiązać umowę lub odmówić wstępu w przypadku rażącego lub powtarzającego się naruszenia regulaminu, w szczególności udostępnienia karty osobie trzeciej lub działań zagrażających bezpieczeństwu.",
      ],
    },
    reklamacje: {
      title: "§ 15. Reklamacje",
      items: [
        "Reklamację możesz złożyć w recepcji, telefonicznie lub e-mailem na adres {email}.",
        "Opisz sprawę, podaj datę zdarzenia i swoje oczekiwania — przyspieszy to rozpatrzenie.",
        "Reklamację rozpatrujemy w ciągu 14 dni od jej otrzymania i odpowiadamy w tej samej formie.",
        "W razie odrzucenia reklamacji możesz zwrócić się do powiatowego lub miejskiego rzecznika konsumentów albo dochodzić roszczeń przed sądem.",
      ],
    },
    "zmiany-regulaminu-i-postanowienia-koncowe": {
      title: "§ 16. Zmiany regulaminu i postanowienia końcowe",
      items: [
        "O zmianach regulaminu informujemy z 14-dniowym wyprzedzeniem w recepcji i na stronie internetowej klubu.",
        "Zmiany nie naruszają warunków karnetów już opłaconych na cały opłacony okres.",
        "Załącznikiem do regulaminu jest Cennik karnetów i usług.",
        "Regulamin obowiązuje w wersji wskazanej na stronie internetowej klubu.",
      ],
    },
  },
};
