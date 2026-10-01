# budoexpert — promo (25,6 s)

1920×1080 · 60 fps · stereo · kolory z logo (fiolet `#6C0C79`, turkus `#20CFA3`) · font Poppins.
Styl: szkic architektoniczny na papierze milimetrowym.

| Czas | Scena |
|---|---|
| 0.0–2.6 | Turkusowa kula wystrzeliwuje z lewej, wpada w naszkicowany trójkąt, zgniata się i zmienia w trójkąt, który uderza w napis; iskry przy uderzeniu (ClickSpark) i błysk po logo (ShinyText), logo jedzie do góry |
| 2.6–6.1 | „Platforma, która zmienia rynek budowlany.” — koparka przywozi w łyżce słowo „zmienia” i wysypuje je w puste miejsce w zdaniu |
| 6.1–10.1 | Planujesz budowę domu? / Jesteś w trakcie budowy? / Jesteś wykonawcą? / …albo sprzedawcą? |
| 10.1–13.6 | „Tworzymy nowy świat dla rynku budowlanego.” → REWOLUCJA |
| 13.6–17.4 | Hub: budoexpert w kole + 6 odnóg, impulsy energii |
| 17.4–20.1 | Kartka przechyla się w 3D w platformę z cokołem; na środku „Wszyscy. W jednym miejscu. Jedna platforma.” |
| 20.1–25.6 | CTA: „Nie czekaj! Zapisz się już dziś.” + przycisk + budoexpert.pl + logo |

W kodzie (`promo.html`) sceny 2–6 zachowują swoje dawne czasy; `mapT()` przesuwa je o 1,9 s po skróconym intro.

Efekty iskier i błysku są inspirowane komponentami [React Bits](https://github.com/DavidHDev/react-bits) (ClickSpark, ShinyText), napisane od nowa na canvasie, żeby renderowały się deterministycznie klatka po klatce.

| Plik | Co to jest |
|---|---|
| `budoexpert-promo.mp4` | gotowy render |
| `promo.html` | silnik animacji (otwórz w przeglądarce: spacja = pauza, ←/→ = przewijanie) |
| `render.mjs` | render HTML → MP4 z motion blurem |
| `soundtrack.py` | syntezowana muzyka 120 BPM |

Teksty i kolory edytujesz w `promo.html` (paleta w `CFG.C`). Ponowny render:

```bash
python3 soundtrack.py
FFMPEG=$(python3 -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())") node render.mjs --audio soundtrack.wav
```

## Projekt After Effects

W folderze `after-effects/` jest skrypt, który buduje z tego filmu natywny projekt `.aep` (instrukcja w `after-effects/README.md`). Uwaga: skrypt odpowiada pierwszej, 26-sekundowej wersji filmu (bez szybkiego intro, koparki, platformy 3D i adresu strony).
