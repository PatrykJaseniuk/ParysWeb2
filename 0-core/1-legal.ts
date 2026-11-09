import type { LegalDocument } from "./0-types";

/**
 * Regulamin klubu — ogólne zasady korzystania z obiektu i karnetów.
 * Dane konkretnego karnetu zapisuje odrębna umowa z `2-membership-agreement.ts`.
 *
 * Dokument jest danymi, nie treścią strony: te same zasady obowiązują
 * w recepcji, na stronie i w materiałach drukowanych, więc należą do rdzenia.
 * Warstwa strony renderuje sekcje po kolei i podstawia tokeny:
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

export const terms: LegalDocument = {
  slug: "regulamin",
  title: "Regulamin",
  description: "Zasady korzystania z obiektu Sport Studio Parys w Nysie — karnety, karta klubowa, wejścia, rezerwacje i reklamacje.",
  version: "1.0",
  effective_from: "2026-11-09",
  intro: [
    "Regulamin określa zasady korzystania z obiektu Sport Studio Parys przy {address}. Jest dostępny w recepcji oraz na stronie internetowej klubu. Karnet wymaga podpisania umowy członkowskiej i opłacenia wybranego wariantu z góry. Kupując wejście jednorazowe lub rezerwując usługę, akceptujesz odpowiednie postanowienia regulaminu.",
  ],
  sections: {
    "postanowienia-ogolne": {
      title: "1. Postanowienia ogólne",
      paragraphs: [
        "Organizatorem obiektu jest Sport Studio Parys, {address}, e-mail: {email}, tel. {phone}.",
      ],
      items: [
        "Klub — obiekt Sport Studio Parys wraz z jego strefami i usługami.",
        "Klubowicz — osoba posiadająca ważny karnet.",
        "Karnet — imienne uprawnienie do korzystania z klubu w zakresie i przez okres wskazany w cenniku.",
        "Karta klubowa — imienny nośnik dostępu do klubu.",
        "Wejście jednorazowe — jednorazowe uprawnienie do korzystania ze wszystkich stref i zajęć grupowych.",
        "Recepcja — punkt obsługi klubowiczów; godziny jej pracy podane są na stronie Kontakt.",
      ],
    },
    "wejscie-i-karta": {
      title: "2. Wejście i karta klubowa",
      items: [
        "Karnet wymaga rejestracji i wydania karty klubowej. Opłata za kartę wynosi {club_card_fee}.",
        "Karta jest imienna i nieprzenoszalna. Nie wolno udostępniać jej innym osobom ani wchodzić na cudzą kartę.",
        "Z aktywnym karnetem wchodzisz o dowolnej porze — także w niedziele i święta, poza godzinami pracy recepcji.",
        "Wejście jednorazowe kosztuje {entry_price}, nie wymaga rejestracji ani karty i obowiązuje wyłącznie w godzinach pracy recepcji.",
        "Utratę karty zgłoś niezwłocznie w recepcji. Wydanie nowej karty wiąże się z opłatą {club_card_fee}.",
        "Klub może odmówić wstępu osobie, której karnet wygasł, karta została zablokowana lub która narusza regulamin.",
      ],
    },
    karnety: {
      title: "3. Karnety",
      items: [
        "Rodzaje karnetów, ich zakres i ceny określa cennik stanowiący załącznik do regulaminu.",
        "Wszystkie ceny w cenniku są cenami brutto — zawierają podatek VAT.",
        "Karnet obowiązuje przez okres wskazany w cenniku, liczony od dnia zakupu.",
        "Karnety są przedpłacone, nie odnawiają się automatycznie i nie podlegają zawieszaniu ani blokowaniu.",
        "Karnet jest imienny. Nie można przenosić go na inną osobę ani odstępować praw z niego wynikających.",
        "Karnety ulgowe wymagają dokumentu potwierdzającego uprawnienie, np. legitymacji studenckiej. Brak dokumentu może skutkować odmową zastosowania ceny ulgowej.",
        "Zmiana cennika nie wpływa na karnety już opłacone — obowiązuje przez cały opłacony okres.",
      ],
    },
    "wejscia-jednorazowe-i-partnerzy": {
      title: "4. Wejścia jednorazowe i programy partnerskie",
      items: [
        "Wejście jednorazowe obejmuje wszystkie strefy oraz zajęcia grupowe i obowiązuje w godzinach pracy recepcji.",
        "MultiSport wymaga weryfikacji tożsamości przez pracownika recepcji — jest dostępny wyłącznie w godzinach jej pracy.",
        "Medicover Sport, FitProfit i PZU po rejestracji pozwalają odebrać kartę klubową dającą dostęp przez całą dobę i umożliwiającą samodzielną rejestrację wizyty w terminalu.",
        "Programy partnerskie opłacają wyłącznie wejścia jednorazowe — nie służą do opłacania karnetów i nie są nośnikiem dostępu.",
      ],
    },
    "zasady-korzystania": {
      title: "5. Zasady korzystania z obiektu",
      items: [
        "W strefach treningowych obowiązuje strój sportowy, zmienne obuwie i ręcznik.",
        "Sprzęt po użyciu odkładaj na miejsce; wolne ciężary i maszyny wycieraj po treningu.",
        "Zabrania się wnoszenia alkoholu, środków odurzających i palenia tytoniu poza miejscami do tego wyznaczonymi.",
        "Wejście do pomieszczeń technicznych i zaplecza jest dozwolone wyłącznie pracownikom klubu.",
        "Sprzęt własny można wnosić tylko za zgodą obsługi.",
        "Nie wolno filmować ani fotografować innych osób bez ich zgody.",
        "Zabrania się wprowadzania zwierząt, z wyjątkiem psa asystującego.",
        "Awarię sprzętu lub zagrożenie bezpieczeństwa zgłoś niezwłocznie w recepcji.",
      ],
    },
    "osoby-niepelnoletnie": {
      title: "6. Osoby niepełnoletnie",
      items: [
        "Zawarcie umowy członkowskiej przez osobę niepełnoletnią wymaga pisemnej zgody i podpisu przedstawiciela ustawowego lub opiekuna prawnego.",
        "Opiekun podaje dane wymagane w umowie, potwierdza zapoznanie się z regulaminem i ponosi odpowiedzialność w zakresie przewidzianym prawem.",
        "Klub nie świadczy usługi opieki nad osobami niepełnoletnimi.",
      ],
    },
    "zajecia-i-trening": {
      title: "7. Zajęcia grupowe i trening personalny",
      items: [
        "Zapisy na zajęcia i treningi prowadzi recepcja — osobiście lub telefonicznie.",
        "Liczba miejsc jest ograniczona; decyduje kolejność zgłoszeń.",
        "Rezerwację odwołaj najpóźniej godzinę przed rozpoczęciem. Nieodwołana rezerwacja przepada.",
        "Prosimy o punktualność — spóźnienie może uniemożliwić udział w zajęciach.",
        "Podczas treningu obowiązują polecenia trenera, w szczególności dotyczące techniki i bezpieczeństwa.",
      ],
    },
    "uslugi-dodatkowe": {
      title: "8. Usługi dodatkowe",
      items: [
        "Sauna — wynajęcie pomieszczenia na godzinę na wyłączność, dla maksymalnie 6 osób. Rezerwacja telefoniczna najpóźniej godzinę przed wizytą. Obowiązuje ręcznik i obuwie zmienne; osoby z przeciwwskazaniami zdrowotnymi korzystają z sauny na własną odpowiedzialność.",
        "Badminton — wynajęcie kortu na godzinę, rezerwacja w recepcji. Obowiązuje obuwie o podeszwie niebrudzącej.",
        "Bufet i sklep — sprzedaż napojów, odżywek i akcesoriów odbywa się na zasadach sprzedaży detalicznej; ceny podane są na miejscu.",
        "Rezerwacje usług dodatkowych odwołuje się najpóźniej godzinę przed rozpoczęciem.",
      ],
    },
    monitoring: {
      title: "9. Monitoring",
      paragraphs: [
        "Teren obiektu jest objęty monitoringiem wizyjnym w celu zapewnienia bezpieczeństwa osób i mienia. Obszary monitorowane oznaczone są tablicami informacyjnymi. Nagrania przechowujemy przez 30 dni, chyba że stanowią dowód w postępowaniu — wtedy dłużej. Dostęp do nagrań mają wyłącznie osoby upoważnione oraz uprawnione organy. Zasady przetwarzania danych osobowych, w tym wizerunku, opisuje polityka prywatności dostępna w stopce serwisu.",
      ],
    },
    odpowiedzialnosc: {
      title: "10. Odpowiedzialność",
      items: [
        "Klub utrzymuje sprzęt i urządzenia w stanie sprawnym i dba o bezpieczeństwo w strefach treningowych.",
        "Rzeczy pozostawione w szatni bez nadzoru przechowywane są na zasadach określonych w prawie; przedmioty wartościowe oddaj do depozytu w recepcji.",
        "Klubowicz odpowiada za szkody wyrządzone w mieniu klubu z własnej winy.",
        "O planowanych przerwach technicznych informujemy z wyprzedzeniem. W razie dłuższego zamknięcia strefy warunki rozliczenia ustalamy indywidualnie.",
      ],
    },
    reklamacje: {
      title: "11. Reklamacje",
      items: [
        "Reklamację możesz złożyć w recepcji, telefonicznie lub e-mailem na adres {email}.",
        "Opisz sprawę, podaj datę zdarzenia i swoje oczekiwania — przyspieszy to rozpatrzenie.",
        "Reklamację rozpatrujemy w ciągu 14 dni od jej otrzymania i odpowiadamy w tej samej formie.",
        "Jeśli reklamacja zostanie odrzucona, możesz zwrócić się do powiatowego lub miejskiego rzecznika konsumenta albo dochodzić roszczeń przed sądem.",
      ],
    },
    "zmiany-i-postanowienia-koncowe": {
      title: "12. Zmiany regulaminu i postanowienia końcowe",
      items: [
        "O zmianach regulaminu informujemy z 14-dniowym wyprzedzeniem w recepcji i na stronie internetowej klubu.",
        "Zmiany nie naruszają warunków karnetów już opłaconych na cały opłacony okres.",
        "W sprawach nieuregulowanych stosuje się przepisy prawa polskiego, w tym Kodeksu cywilnego i ustawy o prawach konsumenta.",
        "Załącznikiem do regulaminu jest cennik karnetów i usług.",
      ],
    },
  },
};
