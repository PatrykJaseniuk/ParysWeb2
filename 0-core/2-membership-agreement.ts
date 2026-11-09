import type { MembershipAgreementDocument } from "./0-types";

/**
 * Wzór umowy członkowskiej dla karnetu przedpłaconego.
 *
 * To dane dokumentu, a nie gotowy PDF. Konsument (np. `1-printables`) składa
 * formularz, podstawia tokeny i dopiero po zmianie `status` na `approved`
 * może udostępnić dokument do podpisu. Nazwa handlowa klubu nie zastępuje
 * danych przedsiębiorcy — `{legal_name}`, `{registered_address}` i `{nip}`
 * muszą pochodzić z potwierdzonych danych rejestrowych.
 *
 * Pozostałe tokeny: `{club_name}`, `{address}`, `{email}`, `{phone}`,
 * `{terms_version}`, `{terms_effective_from}`, `{club_card_fee}`.
 * Kwoty wpisywane do umowy są brutto. Nie ma polecenia zapłaty, cyklicznego
 * obciążania karty, konta online ani automatycznego odnawiania karnetu.
 */
export const membership_agreement: MembershipAgreementDocument = {
  slug: "umowa-czlonkowska",
  title: "Umowa członkowska — karnet przedpłacony",
  description:
    "Wzór umowy na karnet Sport Studio Parys: dane stron, wybrany karnet, oświadczenia, zgoda opiekuna i klauzula RODO.",
  version: "1.0",
  effective_from: "2026-11-09",
  status: "draft",
  draft_notice:
    "PROJEKT DO AKCEPTACJI PRAWNEJ. Przed użyciem uzupełnij nazwę rejestrową, adres i NIP przedsiębiorcy oraz potwierdź zasady retencji danych.",
  required_tokens: ["{legal_name}", "{registered_address}", "{nip}"],
  intro: [
    "Umowa zawarta w dniu {agreement_date} w Nysie pomiędzy {legal_name}, prowadzącym klub pod nazwą {club_name}, z adresem rejestrowym {registered_address}, NIP {nip}, zwanym dalej Klubem, a Klubowiczem wskazanym w części A.",
    "Przedmiotem umowy jest jednorazowy dostęp do zakresu usług wybranego karnetu przez okres lub liczbę wejść określone w części B. Umowa jest zawierana na czas określony i nie odnawia się automatycznie. Integralną częścią umowy jest Regulamin, wersja {terms_version} z dnia {terms_effective_from}, oraz Cennik dostępny przed zawarciem umowy w recepcji.",
  ],
  form_sections: [
    {
      key: "dane-klubowicza",
      title: "A. Dane Klubowicza",
      fields: [
        { key: "member-full-name", label: "Imię i nazwisko", kind: "text", required: true },
        { key: "member-birth-date", label: "Data urodzenia", kind: "date", required: true },
        { key: "member-address", label: "Adres zamieszkania", kind: "text", required: true },
        { key: "member-email", label: "Adres e-mail", kind: "text", required: true },
        { key: "member-phone", label: "Numer telefonu", kind: "text", required: true },
      ],
    },
    {
      key: "wybrany-karnet",
      title: "B. Wybrany karnet i rozliczenie",
      paragraphs: [
        "Karnet jest imienny i obejmuje wyłącznie strefy oraz zajęcia wskazane w Cenniku. Okres ważności liczy się od daty rozpoczęcia. W wariancie z limitem wejść niewykorzystane wejścia wygasają z końcem okresu ważności.",
      ],
      fields: [
        {
          key: "access-plan",
          label: "Karnet",
          kind: "choice",
          required: true,
          source: "catalog.accesses",
        },
        {
          key: "access-variant",
          label: "Wariant i okres / liczba wejść",
          kind: "choice",
          required: true,
          source: "catalog.access_variants",
        },
        { key: "access-start", label: "Data rozpoczęcia", kind: "date", required: true },
        { key: "access-end", label: "Data zakończenia", kind: "date", required: true },
        {
          key: "access-price",
          label: "Cena karnetu brutto",
          kind: "money",
          required: true,
          value_token: "{access_price}",
        },
        {
          key: "club-card-fee",
          label: "Opłata za kartę klubową brutto",
          kind: "money",
          required: true,
          value_token: "{club_card_fee}",
        },
        {
          key: "total-price",
          label: "Łącznie do zapłaty brutto",
          kind: "money",
          required: true,
          value_token: "{total_price}",
        },
        {
          key: "payment-method",
          label: "Forma płatności",
          kind: "choice",
          required: true,
          options: ["gotówka", "karta płatnicza — jednorazowo"],
        },
        {
          key: "payment-confirmation",
          label: "Numer potwierdzenia płatności / paragonu",
          kind: "text",
          required: false,
        },
        { key: "club-card-number", label: "Numer karty klubowej", kind: "text", required: true },
      ],
    },
    {
      key: "opiekun-prawny",
      title: "C. Przedstawiciel ustawowy / opiekun prawny — tylko dla osoby niepełnoletniej",
      paragraphs: [
        "Zawarcie umowy przez osobę niepełnoletnią wymaga zgody przedstawiciela ustawowego lub opiekuna prawnego. Opiekun potwierdza ją własnoręcznym podpisem; wymagane jest również podpisanie oświadczenia opiekuna w części E.",
      ],
      fields: [
        {
          key: "guardian-full-name",
          label: "Imię i nazwisko opiekuna",
          kind: "text",
          required: true,
          condition: "minor",
        },
        {
          key: "guardian-address",
          label: "Adres opiekuna",
          kind: "text",
          required: true,
          condition: "minor",
        },
        {
          key: "guardian-phone",
          label: "Telefon opiekuna",
          kind: "text",
          required: true,
          condition: "minor",
        },
        {
          key: "guardian-relationship",
          label: "Podstawa reprezentacji / pokrewieństwo",
          kind: "text",
          required: true,
          condition: "minor",
        },
      ],
    },
    {
      key: "zgody-marketingowe",
      title: "D. Dobrowolne zgody marketingowe",
      paragraphs: [
        "Zgody poniżej są nieobowiązkowe. Pozostawienie pustego pola oznacza brak zgody i nie wpływa na zawarcie umowy ani możliwość korzystania z klubu. Zgodę można wycofać w każdym czasie, bez wpływu na zgodność z prawem wcześniejszego przetwarzania.",
      ],
      fields: [
        {
          key: "marketing-email-consent",
          label: "Zgadzam się na otrzymywanie informacji handlowych od Klubu wiadomościami e-mail.",
          kind: "checkbox",
          required: false,
        },
        {
          key: "marketing-phone-consent",
          label: "Zgadzam się na otrzymywanie informacji handlowych od Klubu telefonicznie, w tym SMS-ami.",
          kind: "checkbox",
          required: false,
        },
      ],
    },
    {
      key: "podpisy",
      title: "F. Miejscowość, data i podpisy",
      fields: [
        { key: "signature-place", label: "Miejscowość", kind: "text", required: true },
        { key: "signature-date", label: "Data zawarcia umowy", kind: "date", required: true },
        { key: "member-signature", label: "Podpis Klubowicza", kind: "signature", required: true },
        {
          key: "guardian-signature",
          label: "Podpis przedstawiciela ustawowego / opiekuna prawnego",
          kind: "signature",
          required: true,
          condition: "minor",
        },
        {
          key: "club-representative-signature",
          label: "Podpis osoby przyjmującej umowę w imieniu Klubu",
          kind: "signature",
          required: true,
        },
      ],
    },
  ],
  declarations: [
    {
      key: "terms-accepted",
      text: "Oświadczam, że przed podpisaniem umowy otrzymałem/am możliwość zapoznania się z Regulaminem i Cennikiem, przeczytałem/am je i akceptuję. Rozumiem zakres wybranego karnetu, jego cenę brutto, okres ważności oraz zasady wejścia.",
      required: true,
    },
    {
      key: "prepaid-access",
      text: "Przyjmuję do wiadomości, że karnet jest przedpłacony, nie odnawia się automatycznie, nie podlega zawieszaniu ani przenoszeniu na inną osobę. Rozwiązanie umowy przed upływem jej terminu nie powoduje zwrotu ceny za niewykorzystany okres lub wejścia, z zastrzeżeniem przepisów powszechnie obowiązujących i postanowień Regulaminu.",
      required: true,
    },
    {
      key: "club-card",
      text: "Zobowiązuję się korzystać z imiennej karty klubowej zgodnie z Regulaminem, nie udostępniać jej innym osobom i niezwłocznie zgłosić jej utratę. Opłata za wydanie lub ponowne wydanie karty wynosi {club_card_fee}.",
      required: true,
    },
    {
      key: "health-and-safety",
      text: "Oświadczam, że nie znam przeciwwskazań zdrowotnych do korzystania z wybranych usług, a w razie wątpliwości skonsultuję je z lekarzem. Zobowiązuję się przestrzegać instrukcji obsługi sprzętu i zasad bezpieczeństwa. Oświadczenie nie wyłącza odpowiedzialności Klubu, której wyłączenie lub ograniczenie jest niedopuszczalne na mocy prawa.",
      required: true,
    },
    {
      key: "guardian-consent",
      text: "Jako przedstawiciel ustawowy / opiekun prawny wyrażam zgodę na zawarcie tej umowy przez osobę niepełnoletnią wskazaną w części A i na korzystanie przez nią z klubu zgodnie z Regulaminem. Akceptuję treść umowy w jej imieniu i zobowiązuję się do nadzoru w zakresie wymaganym prawem.",
      required: true,
      condition: "minor",
    },
    {
      key: "privacy-notice-received",
      text: "Potwierdzam otrzymanie klauzuli informacyjnej o przetwarzaniu danych osobowych klubowiczów, zamieszczonej po części podpisów. Przyjmuję do wiadomości, że obiekt jest objęty monitoringiem wizyjnym.",
      required: true,
    },
  ],
  privacy_notice: {
    title: "Klauzula informacyjna — dane osobowe Klubowicza",
    intro: [
      "Ta klauzula dotyczy umowy członkowskiej i korzystania z klubu. Polityka prywatności strony internetowej opisuje odrębne procesy i jej nie zastępuje.",
    ],
    sections: {
      "administrator-i-kontakt": {
        title: "1. Administrator i kontakt",
        paragraphs: [
          "Administratorem danych jest {legal_name}, adres rejestrowy: {registered_address}, NIP: {nip}. Kontakt w sprawach danych: {email}, tel. {phone}.",
        ],
      },
      "cele-i-podstawy": {
        title: "2. Cele i podstawy przetwarzania",
        items: [
          "Zawarcie i wykonanie umowy: identyfikacja Klubowicza, wydanie i obsługa karty, kontrola ważności karnetu, rezerwacje i kontakt organizacyjny — art. 6 ust. 1 lit. b RODO.",
          "Wypełnienie obowiązków prawnych, w szczególności prowadzenie dokumentacji podatkowej i księgowej — art. 6 ust. 1 lit. c RODO.",
          "Dochodzenie i obrona roszczeń, obsługa reklamacji oraz zapewnienie bezpieczeństwa osób i mienia — prawnie uzasadniony interes administratora, art. 6 ust. 1 lit. f RODO.",
          "Monitoring wizyjny oznaczonych obszarów obiektu w celu bezpieczeństwa, ochrony mienia i kontroli dostępu — art. 6 ust. 1 lit. f RODO. Monitoring nie obejmuje szatni, pryszniców ani toalet.",
          "Marketing bezpośredni własnych usług — art. 6 ust. 1 lit. f RODO; komunikacja e-mailowa, telefoniczna lub SMS wymaga odrębnej, dobrowolnej zgody zaznaczonej w części D.",
          "Dane osoby niepełnoletniej i jej opiekuna przetwarzamy w celu zawarcia i wykonania umowy oraz potwierdzenia zgody opiekuna — art. 6 ust. 1 lit. b i f RODO.",
        ],
      },
      "zakres-i-odbiorcy": {
        title: "3. Zakres danych i odbiorcy",
        paragraphs: [
          "Przetwarzamy dane wskazane w umowie, informacje o karnecie i płatnościach, rejestr wejść, korespondencję, reklamacje oraz wizerunek zarejestrowany przez monitoring. Nie zbieramy danych biometrycznych ani danych o zdrowiu w formularzu umowy i nie profilujemy Klubowiczów.",
          "Dane mogą otrzymywać wyłącznie w niezbędnym zakresie dostawcy obsługi informatycznej i systemu dostępu, poczty elektronicznej, księgowości oraz obsługi prawnej, a także podmioty uprawnione na podstawie prawa. Nie sprzedajemy danych. Jeżeli dostawca przetwarza dane poza EOG, przekazanie wymaga podstawy z rozdziału V RODO, np. decyzji o adekwatności albo standardowych klauzul umownych.",
        ],
      },
      "okres-przechowywania": {
        title: "4. Okres przechowywania",
        items: [
          "Dane umowne i rejestr wejść — przez czas trwania umowy, a następnie do przedawnienia roszczeń lub ich wygaśnięcia w inny sposób przewidziany prawem.",
          "Dokumenty księgowe i podatkowe — przez okres wymagany przepisami, co do zasady 5 lat od początku roku następującego po roku, którego dotyczy obowiązek podatkowy.",
          "Nagrania monitoringu — co do zasady do 30 dni; nagranie zabezpieczone jako dowód może być przechowywane do zakończenia postępowania i przedawnienia roszczeń.",
          "Dane wykorzystywane na podstawie zgody marketingowej — do jej wycofania, a następnie przez okres niezbędny do wykazania udzielonej zgody i obrony roszczeń.",
        ],
      },
      "prawa-i-dobrowolnosc": {
        title: "5. Prawa i dobrowolność podania danych",
        paragraphs: [
          "Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, przenoszenia danych oraz sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie. Zgodę możesz wycofać w każdym czasie. Masz również prawo skargi do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.",
          "Podanie danych oznaczonych jako wymagane jest dobrowolne, ale niezbędne do zawarcia i wykonania umowy. Bez nich nie możemy zarejestrować karnetu ani wydać imiennej karty. Żądania realizujemy bez zbędnej zwłoki, co do zasady w ciągu miesiąca.",
        ],
      },
    },
  },
};
