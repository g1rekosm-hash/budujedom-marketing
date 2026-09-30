# budoexpert promo — projekt After Effects

`budoexpert-promo-build.jsx` buduje w After Effects cały film jako natywny, edytowalny projekt
i zapisuje go obok siebie jako **`budoexpert-promo.aep`**.

## Jak zbudować projekt (ok. 1 minuta)

1. Zainstaluj font **Poppins** (Regular, Medium, SemiBold, Bold, ExtraBold, Black):
   https://fonts.google.com/specimen/Poppins → „Get font” → „Download all”. Albo włącz go w Adobe Fonts.
2. Pobierz cały folder `motion/budoexpert-promo/` (skrypt sięga po `../soundtrack.wav` i `../budoexpert-promo.mp4`).
3. After Effects 2022 lub nowszy → **File › Scripts › Run Script File…** (Plik › Skrypty › Uruchom plik skryptu…)
   → wybierz `after-effects/budoexpert-promo-build.jsx`.
   Jeśli AE zablokuje zapis pliku: *Settings › Scripting & Expressions › Allow Scripts to Write Files and Access Network*.
4. Skrypt otworzy nowy projekt, zbuduje kompozycje i zapisze `budoexpert-promo.aep`. Na koniec pokaże podsumowanie
   (jeśli coś się nie udało, lista ostrzeżeń mówi, w której scenie).

## Struktura projektu

| Kompozycja | Co zawiera |
|---|---|
| `00_MAIN_budoexpert` | montaż: sceny, przejścia (przewinięcie strony, iris, zwinięcie do hubu, rozlanie w CTA), muzyka, referencja MP4 |
| `01_LOGO_kulka` | kulka toczy się (obrót liczony wyrażeniem z drogi), zmienia się w trójkąt (morfing ścieżki), uderza w napis |
| `02_PLATFORMA` | „Platforma, która zmienia rynek budowlany.” + adnotacje ołówkiem |
| `03_PYTANIA` | 4 pytania z ikonami rysowanymi przez Trim Paths |
| `04_REWOLUCJA` | globus z linii, „nowy świat”, uderzenie REWOLUCJA |
| `05_HUB_role` | hub budoexpert + 6 ról, impulsy energii |
| `06_CTA_zapisz_sie` | „Nie czekaj! Zapisz się już dziś.”, przycisk, kursor, konfetti |
| `elementy/_LOGO_KOLOR`, `_LOGO_BIALE`, `_SIATKA`, `_TABLICZKA` | elementy wielokrotnego użytku: zmiana w jednym miejscu działa wszędzie |

## Jak edytować

- **Kolory marki:** w `00_MAIN_budoexpert` zaznacz warstwę `KONTROLA_MARKI` → Effect Controls. Każdy kolor
  (Fiolet, Turkus, Atrament…) jest podpięty wyrażeniem do wszystkich kształtów i tekstów we wszystkich scenach.
- **Teksty:** otwórz scenę, kliknij dwukrotnie warstwę tekstową i wpisz nowy tekst. Animacje wejścia i wyjścia
  (animatory „Wejscie” / „Wyjscie”) działają dalej, bo liczą się po literach.
- **Czas animacji tekstu:** animator „Wejscie” → Expression Selector → Amount. Na górze wyrażenia są liczby
  `t0` (start, w sekundach czasu sceny), `st` (opóźnienie na literę) i `d` (czas trwania).
- **Timing reszty:** zwykłe klatki kluczowe. Easing jest już ustawiony (Graph Editor).
- **Logo:** `_LOGO_KOLOR` / `_LOGO_BIALE`. Jeśli masz logo w SVG/AI, wklej je tam zamiast warstw
  `trojkat` + `napis budoexpert`, a zmieni się w całym filmie.
- **Porównanie z oryginałem:** w `00_MAIN` włącz oko przy warstwie `REFERENCJA`.
- **Render:** Composition › Add to Adobe Media Encoder Queue › H.264, 1920×1080, 60 fps.

## Różnice względem wersji MP4

Projekt odtwarza film natywnymi narzędziami AE, więc kilka efektów jest uproszczonych:
- brak „drgania ołówka” (w MP4 linie delikatnie się trzęsą jak rysowane ręcznie; w AE można dodać efekt
  *Turbulent Displace* z posterizeTime na warstwach szkicu),
- impulsy energii w hubie nie mają doklejonego ogona (ogon daje motion blur włączony w projekcie),
- ziarno i winieta nie są dodane (wystarczy warstwa dopasowania z *Noise* i *CC Vignette*).
