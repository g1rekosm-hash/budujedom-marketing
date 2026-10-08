# Budoexpert — „Dwa światy budowania” (explainer 2.5D, bez lektora)

Film według storyboardu v3 (październik 2026): najpierw cały stary świat (szaro, deszcz, każdy osobno), zwrot z turkusowym trójkątem, potem nowy świat w tych samych kadrach, ale w kolorach marki i w aplikacji Budoexpert. Historię niosą obraz, kinetyczna typografia i muzyka.

1920×1080 · 25 kl/s · stereo · 1:58 (z 2 s stopu na końcu pod pętlę targową) · font Poppins.

## Styl (wersja 2)
- **Głębia:** każde ujęcie to 4–6 warstw z paralaksą i ruchem kamery (dryf + lekki „handheld”), rozmycie głębi ostrości dla pierwszego planu i tła, mgła między planami.
- **Światło:** wolumetryczne stożki lamp z kurzem, promienie słońca przez okna, kontra (rim light) na postaciach, cieniowane bryły i cienie kontaktowe, bloom, color grading (chłodny stary świat, ciepły nowy), winieta i ziarno.
- **Pogoda i optyka:** deszcz w trzech planach, rozbryzgi i kałuże z odbiciami, krople na obiektywie, bokeh, flara.
- **UI w 3D:** telefony, tablet i monitor obracają się w perspektywie, a karty interfejsu wylatują z ekranów z cieniami.
- **Napisy zamiast lektora:** słowa wjeżdżają z rozmycia; w starym świecie chłodny biały, w nowym fiolet z turkusowym markerem na słowach kluczowych.

| Plik | Co to jest |
|---|---|
| `video-budoexpert-dwa-swiaty.mp4` | gotowy film z muzyką i efektami |
| `film.html` | montaż, przejścia i postprodukcja; otwórz w przeglądarce (spacja = pauza, ←/→ = ±1 s, `?t=63` = stop na danej sekundzie) |
| `engine.js` | silnik 2.5D: warstwy z głębią ostrości, światło, atmosfera, postacie, perspektywa urządzeń, typografia |
| `scenes-old.js`, `scenes-new.js` | ujęcia 00–06 (stary świat i zwrot) oraz 07–12 (nowy świat i finał) |
| `timeline.py` | długości ujęć → `timeline.json` / `timeline.js` |
| `soundtrack.py` | muzyka i efekty zsynchronizowane z obrazem → `mix.wav` (-16 LUFS) |
| `render.mjs` | render HTML → MP4 klatka po klatce |

Czasy efektów dźwiękowych są w jednym miejscu: blok `/*CUES*/` w `film.html` (czyta go animacja i `soundtrack.py`).
Zasady ze storyboardu: w starym świecie zero brandingu; w nowym każdy ekran ma u góry fioletowy pasek z logo; bez słowa „chaos” i bez obietnic ze starego landingu (kwoty na kartkach to element obrazu).

## Ponowny render
```bash
pip install numpy scipy && npm i playwright
python3 timeline.py          # tylko po zmianie długości ujęć
python3 soundtrack.py
node render.mjs --audio mix.wav --out video-budoexpert-dwa-swiaty.mp4 --crf 20
node render.mjs --preview 12.5,64,100   # szybki podgląd klatek do frames/
```

Poprzednia wersja (płaski styl 1:1 ze storyboardem, z syntetycznym lektorem) jest w historii gita (commit `2dc6489`).
