# budoexpert — promo (30,5 s)

1920×1080 · 60 fps · stereo · kolory z logo (fiolet `#6C0C79`, turkus `#20CFA3`) · font Poppins.
Styl: szkic architektoniczny na papierze milimetrowym.

| Czas | Scena |
|---|---|
| 0.0–2.6 | Kula wtacza się i w trakcie toczenia zamienia w trójkąt, uderza w napis, logo jedzie do góry |
| 2.6–6.1 | „Platforma, która zmienia rynek budowlany.” — „zmienia” murowane z cegiełek |
| 6.1–10.1 | Pytania w stylu technicznym (linijki, wymiary, lżejszy Poppins) |
| 10.1–15.95 | Cechy jako klocki spadające w ścianę domu (cały proces, finansowanie, baza projektów, eksperci, wykonawcy, architekci, niższe ceny), dach z trójkąta z napisem „budoexpert”, podpis „Wszystko, czego potrzebujesz do budowy domu.”, przejście irysem w REWOLUCJA |
| 15.95–18.6 | „Tworzymy nowy świat dla rynku budowlanego.” → REWOLUCJA |
| 18.6–23.0 | Hub: koło z logo w rdzeniu, 10 ról w kółkach, proste linie z impulsami jak w wersji 1, potem efekt 3D i „Wszyscy. W jednym miejscu.” |
| 23.0–25.5 | Platforma 3D z walcem i logo; „Wszyscy. W jednym miejscu. Jedna platforma.” |
| 25.5–30.55 | CTA: „Nie czekaj! Zapisz się już dziś.” + przycisk + budoexpert.pl + logo |

W kodzie (`promo.html`) sceny zachowują swoje dawne czasy, a tabela `SEGS` układa je w finalny montaż (scena z aplikacją ma czasy od 100 s w osi roboczej).

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

W folderze `after-effects/` jest skrypt, który buduje z tego filmu natywny projekt `.aep` (instrukcja w `after-effects/README.md`). Uwaga: skrypt odpowiada pierwszej, 26-sekundowej wersji filmu (bez szybkiego intro, murowanego słowa, platformy 3D i adresu strony).

## Test intro (sama scena 1)

Wariant intro, w którym kula zamienia się w trójkąt w trakcie toczenia (przetacza się po rosnących rogach), uderza w napis i dociska do pełnego trójkąta: `intro-test.mp4` (3,2 s). Główny film się nie zmienia.

```bash
python3 soundtrack.py intro
node render.mjs --query only=intro --audio intro-test.wav --out intro-test.mp4
```
