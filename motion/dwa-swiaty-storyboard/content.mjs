// Treść storyboardu „Dwa światy budowania” — ustalona z właścicielem scena po scenie (X 2026).
// Zmiany tekstu lektora / opisów rób tutaj, potem: node build.mjs

export const META = {
  title: 'Dwa światy budowania',
  sub: 'Storyboard dla animatora i montażysty · explainer 2D',
  version: 'v3 · październik 2026',
  length: '≈ 1:59 (118 s)',
  format: '1920 × 1080 · 25 kl/s · stereo',
};

export const SCENES = [
  {
    n: '00', world: 'old', title: 'Otwarcie: marzenie zmyte deszczem', tc: '0:00–0:07',
    vo: 'Budowa domu miała być spełnieniem marzeń.',
    music: 'Start: delikatne pianino (2–3 nuty, jasno). Od 0:04 wchodzi deszcz i pianino gaśnie w niski dron.',
    shots: [
      { id: '00A', type: 'PLAN OGÓLNY', tc: '0:00–0:04', anim: 'Papier milimetrowy. Fioletowa kreska rysuje na żywo wymarzony dom: dach, okna, drzewko, huśtawka, słońce. Wypełnienia w kolorach marki pojawiają się tuż za kreską.', vo: '„Budowa domu miała być…”', sfx: 'Skrobanie ołówka, ciepła nuta pianina.', trans: 'Ciągłe ujęcie → 00B' },
      { id: '00B', type: 'PLAN OGÓLNY', tc: '0:04–0:07', anim: 'Na papier spadają krople. Kolor rozmywa się i spływa smugami w dół, papier szarzeje. Szkic morfuje (linie zostają w miejscu) w prawdziwy, niedokończony dom z ujęcia 01A.', vo: '„…spełnieniem marzeń.”', sfx: 'Pierwsze krople na papierze → narastający deszcz.', trans: 'Morf szkicu w dom (match-cut kształtem)' },
    ],
  },
  {
    n: '01', world: 'old', title: 'Inwestor: nie wiedzą, co dzieje się na budowie', tc: '0:07–0:19',
    vo: 'To oszczędności całego życia. Kredyt na trzydzieści lat. A Ty stoisz przed własnym domem… i nie masz pojęcia, co się na nim dzieje.',
    music: 'Dron + deszcz. Pojedyncze, niskie nuty pianina w pauzach lektora.',
    shots: [
      { id: '01A', type: 'PLAN OGÓLNY', tc: '0:07–0:13', anim: 'Para stoi tyłem do kamery pod jednym parasolem. Przed nimi niedokończony dom: mury bez dachu, rusztowanie, kałuże, pusty plac, nikt nie pracuje. Bardzo wolny najazd kamery (zoom 100 → 108%).', vo: '„To oszczędności całego życia. Kredyt na trzydzieści lat.”', sfx: 'Deszcz o parasol, daleki szum ulicy.', trans: 'Cięcie' },
      { id: '01B', type: 'PÓŁZBLIŻENIE', tc: '0:13–0:19', anim: 'Para od przodu, w tle rozmyty dom. Tylko patrzą, nic nie mówią. Ona powoli opiera głowę o jego ramię, on wzdycha (ramiona unoszą się i opadają). Krople spływają po krawędzi parasola.', vo: '„A Ty stoisz przed własnym domem… i nie masz pojęcia, co się na nim dzieje.”', sfx: 'Wydech, deszcz ściszony pod lektora.', trans: 'Cięcie' },
    ],
  },
  {
    n: '02', world: 'old', title: 'Inwestor: wyceny, które się nie zgadzają', tc: '0:19–0:26',
    vo: 'Trzy wyceny. Trzy różne ceny. I żadnej pewności.',
    music: 'Trzy niskie uderzenia (tąpnięcia) zsynchronizowane z kwotami.',
    shots: [
      { id: '02A', type: 'PLAN AMERYKAŃSKI', tc: '0:19–0:22', anim: 'Noc, kuchnia, nad stołem lampa. Za oknem deszcz, na zegarku 23:40. Para siedzi naprzeciw siebie, między nimi trzy kartki. Bez ruchu, napięta cisza.', vo: '„Trzy wyceny.”', sfx: 'Brzęczenie lampy, deszcz o szybę.', trans: 'Najazd z góry → 02B' },
      { id: '02B', type: 'DETAL (z góry)', tc: '0:22–0:26', anim: 'Trzy wyceny na stole, widok z góry. Kwoty wybijają się po kolei, każda większa: 390 000 zł → 540 000 zł → 710 000 zł. Przy każdej kartka lekko podskakuje.', vo: '„Trzy różne ceny. I żadnej pewności.”', sfx: '3 × tąpnięcie (low hit) na kwoty.', trans: 'Cięcie' },
    ],
  },
  {
    n: '03', world: 'old', title: 'Wykonawca: wyceny po nocach', tc: '0:26–0:38',
    vo: 'Po dwunastu godzinach na budowie siada do wycen. Po nocach liczy od zera to, co powinno wynikać wprost z projektu.',
    music: 'Tykanie zegara jako rytm. Dron niżej, ciemniej.',
    shots: [
      { id: '03A', type: 'PLAN AMERYKAŃSKI', tc: '0:26–0:32', anim: 'Ciemna kuchnia. Wykonawca (stolarz, czapka) siedzi pod lampą nad zeszytem z kalkulatorem, obok zwinięty projekt. Pociera oczy, coś skreśla. Na zegarze 1:12, sekundnik tyka.', vo: '„Po dwunastu godzinach na budowie siada do wycen.”', sfx: 'Tykanie zegara, klikanie kalkulatora, skrobanie długopisu.', trans: 'Panorama w prawo → 03B' },
      { id: '03B', type: 'DETAL', tc: '0:32–0:35', anim: 'Uchylone drzwi do pokoju. W pasku światła śpi dziecko (to samo pojawi się w 09C). Delikatne „z…” nad łóżkiem.', vo: '„Po nocach liczy od zera…”', sfx: 'Cichy oddech dziecka.', trans: 'Cięcie' },
      { id: '03C', type: 'DETAL EKRANU', tc: '0:35–0:38', anim: 'Telefon w dłoni, 01:14. Wysłana wiadomość z plikiem „Wycena.pdf”, pod nią „Wyświetlono”. Odpowiedź nie przychodzi, kursor nie miga. Ekran gaśnie.', vo: '„…to, co powinno wynikać wprost z projektu.”', sfx: 'Dźwięk „wysłano”, potem cisza.', trans: 'Cięcie' },
    ],
  },
  {
    n: '04', world: 'old', title: 'Wykonawca: materiału nie ma', tc: '0:38–0:47',
    vo: 'Rano ekipa jest na placu. Materiał – nie. Bo nikt nikomu nie powiedział, kiedy będzie potrzebny.',
    music: 'Dron + tykanie przyspiesza, coraz bardziej nerwowe.',
    shots: [
      { id: '04A', type: 'PLAN OGÓLNY', tc: '0:38–0:43', anim: 'Mżawka, rano, w rogu kadru „07:00”. Ekipa trzech ludzi w kaskach stoi z kubkami kawy przy pustej palecie. Wykonawca rozgląda się, patrzy na drogę: nic nie jedzie.', vo: '„Rano ekipa jest na placu. Materiał – nie.”', sfx: 'Mżawka, siorbanie kawy, daleki pies.', trans: 'Cięcie' },
      { id: '04B', type: 'PÓŁZBLIŻENIE', tc: '0:43–0:47', anim: 'Wykonawca z telefonem przy uchu. W dymku: „Dziś nie dojedzie…”. W tle ekipa, nad nią licznik kosztu przestoju rośnie: – 240 zł … – 1 240 zł.', vo: '„Bo nikt nikomu nie powiedział, kiedy będzie potrzebny.”', sfx: 'Sygnał telefonu, „klik-klik” licznika.', trans: 'Cięcie' },
    ],
  },
  {
    n: '05', world: 'old', title: 'Hurtownia: klient wychodzi z niczym', tc: '0:47–0:58',
    vo: 'A w hurtowni sprzedawca pół godziny tłumaczy, czego trzeba do budowy. Bo nikt tego wcześniej nie policzył. Klient dziękuje… i wychodzi z niczym.',
    music: 'Ten sam motyw; na wyjściu klienta jedna wisząca, niska nuta.',
    shots: [
      { id: '05A', type: 'PLAN AMERYKAŃSKI', tc: '0:47–0:53', anim: 'Lada hurtowni, w tle regały. Sprzedawca w fartuchu gestykuluje, pokazuje próbki (pustak, płyta) i rysuje coś na kartce. Klient ma nad głową „?”. Wskazówki zegara przeskakują o pół godziny (+30 min).', vo: '„A w hurtowni sprzedawca pół godziny tłumaczy, czego trzeba do budowy. Bo nikt tego wcześniej nie policzył.”', sfx: 'Szum hali, przewijanie zegara (whoosh).', trans: 'Cięcie' },
      { id: '05B', type: 'PLAN OGÓLNY', tc: '0:53–0:58', anim: 'Klient (z offu: „Dziękuję, to ja się jeszcze zastanowię”) wychodzi szklanymi drzwiami, które powoli się zamykają. Sprzedawca zostaje sam z pustym blankietem „ZAMÓWIENIE”.', vo: '„Klient dziękuje… i wychodzi z niczym.”', sfx: 'Dzwonek nad drzwiami, trzask zamykanych drzwi.', trans: 'Cięcie do kafelków' },
    ],
  },
  {
    n: '06', world: 'turn', title: 'Zwrot: każdy osobno → logo', tc: '0:58–1:07',
    vo: 'Każdy z nich robi, co może. Tylko każdy osobno. [pauza 1 s] A gdyby wszyscy byli w jednym miejscu?',
    music: '0:58 motyw starego świata ostatni raz. ~1:02 CISZA (muzyka i deszcz urywają się). 1:03 jasny „ding” trójkąta, potem swell → nowy motyw.',
    shots: [
      { id: '06A', type: 'SPLIT 2×2', tc: '0:58–1:02', anim: 'Ekran dzieli się na 4 kafelki: para pod parasolem / wykonawca nocą / ekipa przy pustej palecie / sprzedawca przy ladzie. Każdy w swoim deszczu, osobno, żadnego połączenia.', vo: '„Każdy z nich robi, co może. Tylko każdy osobno.”', sfx: 'Deszcz w 4 kanałach (lekko przesunięte).', trans: '—' },
      { id: '06B', type: 'SPLIT 2×2', tc: '1:02–1:04', anim: 'Krople zatrzymują się w powietrzu (freeze). Kafelki przygasają. Na środku zapala się mały turkusowy trójkąt z logo, z lekką poświatą.', vo: '(cisza)', sfx: 'Cisza → jasny „ding”.', trans: '—' },
      { id: '06C', type: 'PRZEJŚCIE', tc: '1:04–1:07', anim: 'Trójkąt rośnie i rozlewa fiolet i turkus na cały kadr (wipe w kształcie trójkąta), zamrożone krople zamieniają się w świetliste kropki i znikają. Wjeżdża ciepła siatka papieru.', vo: '„A gdyby wszyscy byli w jednym miejscu?”', sfx: 'Swell / whoosh, start nowego motywu.', trans: 'Wipe trójkątem → nowy świat' },
    ],
  },
  {
    n: '07', world: 'new', title: 'Inwestor: wszystko widzą w aplikacji', tc: '1:07–1:18',
    vo: 'Teraz wiesz wszystko. Każdy etap widzisz w aplikacji, a ekspert Budoexpert pilnuje budowy razem z Tobą.',
    music: 'Nowy motyw: ciepłe pianino + plucki/smyczki, tempo umiarkowane, rośnie.',
    shots: [
      { id: '07A', type: 'PÓŁZBLIŻENIE', tc: '1:07–1:12', anim: 'LUSTRO 01B: ta sama para w tym samym układzie, ale wieczorem na kanapie, w ciepłym świetle lampy. On trzyma telefon, oboje się uśmiechają, ona znów opiera głowę o jego ramię, tym razem spokojnie.', vo: '„Teraz wiesz wszystko.”', sfx: 'Cichy „pop” powiadomienia.', trans: 'Najazd na telefon → 07B' },
      { id: '07B', type: 'DETAL EKRANU', tc: '1:12–1:18', anim: 'Ekran aplikacji, u góry logo Budoexpert. Zdjęcie z budowy, pasek postępu dojeżdża do 35%, „Fundamenty – gotowe” dostaje ✓ (pop). Wjeżdża wiadomość z awatarem eksperta: „Wszystko zgodnie z planem.”', vo: '„Każdy etap widzisz w aplikacji, a ekspert Budoexpert pilnuje budowy razem z Tobą.”', sfx: 'Pop ✓, miękki „ding” wiadomości.', trans: 'Cięcie' },
    ],
  },
  {
    n: '08', world: 'new', title: 'Inwestor: przejrzyste oferty', tc: '1:18–1:25',
    vo: 'Sprawdzone firmy. Przejrzyste oferty. I wreszcie pewność.',
    music: 'Trzy jasne akcenty (lustro trzech tąpnięć z 02B).',
    shots: [
      { id: '08A', type: 'DETAL EKRANU', tc: '1:18–1:22', anim: 'LUSTRO 02B: tablet z aplikacją Budoexpert, trzy karty ofert obok siebie, każda z odznaką „Zweryfikowana”, gwiazdkami, terminem i ceną dla tego samego projektu. Karty wjeżdżają po kolei, środkowa się podświetla.', vo: '„Sprawdzone firmy. Przejrzyste oferty.”', sfx: '3 × jasny akcent na karty.', trans: 'Odjazd → 08B' },
      { id: '08B', type: 'PLAN AMERYKAŃSKI', tc: '1:22–1:25', anim: 'LUSTRO 02A: ta sama kuchnia, ale w dzień i w słońcu. Na stole kawa i tablet zamiast stosu kartek. Para przybija piątkę i się śmieje.', vo: '„I wreszcie pewność.”', sfx: 'Klaśnięcie piątki, śmiech.', trans: 'Cięcie' },
    ],
  },
  {
    n: '09', world: 'new', title: 'Wykonawca: kosztorys gotowy, wieczór wolny', tc: '1:25–1:36',
    vo: 'Kosztorys jest gotowy, wprost z projektu. A zlecenia przychodzą same. Wieczór znowu należy do niego.',
    music: 'Motyw się rozwija, dochodzi lekki rytm.',
    shots: [
      { id: '09A', type: 'PLAN AMERYKAŃSKI', tc: '1:25–1:29', anim: 'Warsztat w dzień. Wykonawca z uśmiechem pracuje przy stole (strug, deska). Telefon leżący na stole wibruje.', vo: '„Kosztorys jest gotowy, wprost z projektu.”', sfx: 'Strug po drewnie, wibracja telefonu.', trans: 'Najazd na telefon → 09B' },
      { id: '09B', type: 'DETAL EKRANU', tc: '1:29–1:32', anim: 'Powiadomienie w aplikacji Budoexpert: „NOWE ZLECENIE · Zabudowa kuchni · Kosztorys gotowy – wg projektu”. Kciuk stuka „Akceptuj”, przycisk pulsuje turkusem.', vo: '„A zlecenia przychodzą same.”', sfx: 'Tap + potwierdzenie.', trans: 'Cięcie' },
      { id: '09C', type: 'PLAN OGÓLNY', tc: '1:32–1:36', anim: 'LUSTRO 03A/03B: ta sama kuchnia, ale o 19:00, w ciepłym świetle, rodzinna kolacja. Wykonawca bez czapki, obok śmiejące się dziecko (to samo co spało w 03B) i partnerka.', vo: '„Wieczór znowu należy do niego.”', sfx: 'Śmiech dziecka, sztućce.', trans: 'Cięcie' },
    ],
  },
  {
    n: '10', world: 'new', title: 'Wykonawca: materiał na czas', tc: '1:36–1:44',
    vo: 'Rano ekipa jest na placu. Materiał też. Bo każdy wie, kiedy będzie potrzebny.',
    music: 'Rytm pewny, „poranny”.',
    shots: [
      { id: '10A', type: 'PLAN OGÓLNY', tc: '1:36–1:40', anim: 'LUSTRO 04A: ten sam plac, słońce, w rogu „06:55”. Podjeżdża ciężarówka z logo Budoexpert, dźwig rozładowuje pełną paletę pustaków dokładnie tam, gdzie wcześniej stała pusta.', vo: '„Rano ekipa jest na placu. Materiał też.”', sfx: 'Silnik ciężarówki, syk hydrauliki, ptaki.', trans: 'Cięcie' },
      { id: '10B', type: 'PLAN OGÓLNY + INSET', tc: '1:40–1:44', anim: '„07:00”: ekipa od razu nosi pustaki. Wykonawca z telefonem, obok kadru inset ekranu: ✓ „Dostawa – dostarczona 06:58”, a pod spodem „Dziś: ściany parteru”.', vo: '„Bo każdy wie, kiedy będzie potrzebny.”', sfx: 'Odgłosy pracy, pop ✓.', trans: 'Cięcie' },
    ],
  },
  {
    n: '11', world: 'new', title: 'Hurtownia: gotowe zamówienie', tc: '1:44–1:51',
    vo: 'Hurtownia dostaje gotowe zamówienie. Bo wszystko zostało policzone wcześniej.',
    music: 'Motyw zmierza do kulminacji.',
    shots: [
      { id: '11A', type: 'DETAL EKRANU', tc: '1:44–1:48', anim: 'LUSTRO 05B: monitor na ladzie z panelem hurtowni Budoexpert. Wjeżdża „NOWE ZAMÓWIENIE – KOMPLETNE” z listą pozycji (pustak, cement, stal, wełna) i terminem dostawy. Kursor klika „Potwierdź”.', vo: '„Hurtownia dostaje gotowe zamówienie.”', sfx: 'Ding zamówienia, klik.', trans: 'Odjazd → 11B' },
      { id: '11B', type: 'PLAN AMERYKAŃSKI', tc: '1:48–1:51', anim: 'Ta sama lada co w 05A, uśmiechnięty sprzedawca. W tle wózek widłowy ładuje paletę na dostawę. Zegar na ścianie chodzi spokojnie, nic nie przeskakuje.', vo: '„Bo wszystko zostało policzone wcześniej.”', sfx: 'Piknięcie wózka, gwar hali (ciepły).', trans: 'Cięcie do kafelków' },
    ],
  },
  {
    n: '12', world: 'new', title: 'Finał: wszyscy w jednym miejscu + CTA', tc: '1:51–1:59',
    vo: 'Wszyscy. W jednym miejscu. Budoexpert. [na planszy] Nie czekaj. Zapisz się już dziś.',
    music: 'Kulminacja na „Budoexpert”, potem wybrzmienie pod planszą. Koniec na pełnym akordzie.',
    shots: [
      { id: '12A', type: 'SPLIT 2×2', tc: '1:51–1:54', anim: 'LUSTRO 06A: te same 4 kafelki (para, wykonawca, budowa, hurtownia), ale w kolorze i w słońcu. Turkusowe linie wychodzą z telefonów i łączą wszystkie kafelki.', vo: '„Wszyscy. W jednym miejscu.”', sfx: '4 × „plink” na połączenia.', trans: '—' },
      { id: '12B', type: 'GRAFIKA', tc: '1:54–1:56', anim: 'Kafelki zmniejszają się do węzłów sieci na fioletowym tle z siatką. Sieć zwija się do środka, gdzie zostaje logo Budoexpert (trójkąt + napis).', vo: '„Budoexpert.”', sfx: 'Whoosh + akord.', trans: '—' },
      { id: '12C', type: 'PLANSZA', tc: '1:56–1:59 (+2 s stop)', anim: 'Plansza końcowa na fiolecie z siatką: logo, „Nie czekaj. Zapisz się już dziś.”, pod spodem przycisk/pastylka „budoexpert.pl”, który delikatnie pulsuje. Na pętli targowej: 2 s stopu przed restartem.', vo: '„Nie czekaj. Zapisz się już dziś.”', sfx: 'Wybrzmienie akordu.', trans: 'Koniec / pętla' },
    ],
  },
];

export const CAST = [
  { who: 'Inwestorka', note: 'długie włosy; stary świat: szaro-zielony sweter → nowy: turkus', fig: 'her' },
  { who: 'Inwestor', note: 'krótkie włosy; szaro-granatowy → fioletowy sweter', fig: 'him' },
  { who: 'Wykonawca (stolarz)', note: 'czapka z daszkiem; ta sama osoba w 03, 04, 09, 10; szarobeżowa → musztardowa koszula', fig: 'pro' },
  { who: 'Sprzedawca w hurtowni', note: 'fartuch; szaro-zielony → ciemny fiolet', fig: 'seller' },
  { who: 'Ekipa (3 os.)', note: 'kaski; tło scen 04 i 10', fig: 'crew' },
  { who: 'Dziecko wykonawcy', note: 'śpi w 03B, śmieje się w 09C (lustro)', fig: 'kid' },
  { who: 'Ekspert Budoexpert', note: 'występuje TYLKO jako awatar w aplikacji (07B), turkusowe tło', fig: 'expert' },
];

export const RULES = [
  'W tekście lektora NIE pada słowo „chaos”.',
  'Bez liczb i obietnic ze starego landingu („0% ryzyka”, „do 15% oszczędności”, „najlepsza cena na rynku”, gwarancje). Kwoty na kartkach w 02B, 04B i 08A to elementy obrazu, nie obietnice.',
  'Pokazujemy efekt, nie mechanikę platformy: żadnych rachunków powierniczych, banków ani algorytmów.',
  'W nowym świecie na KAŻDYM ekranie telefonu, tabletu czy monitora widać u góry pasek z logo Budoexpert.',
  'W starym świecie zero brandingu. Pierwszy kolor marki pojawia się dopiero w 06B (trójkąt).',
  'Lustra: każde ujęcie nowego świata powtarza kadr i kompozycję swojego odpowiednika ze starego świata (01B↔07A, 02A↔08B, 02B↔08A, 03A/B↔09C, 04A↔10A, 05↔11, 06A↔12A). Montażysta może robić match-cuty.',
  'Nazwa marki wszędzie: Budoexpert. Font: Poppins.',
];
