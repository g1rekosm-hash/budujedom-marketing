# budoexpert — promo (32 s)

1920×1080 · 60 fps · stereo · kolory z logo (fiolet `#6C0C79`, turkus `#20CFA3`) · font Poppins.
Styl: szkic architektoniczny na papierze milimetrowym.

| Czas | Scena |
|---|---|
| 0.0–2.6 | Kula wtacza się i w trakcie toczenia zamienia w trójkąt, uderza w napis, logo jedzie do góry |
| 2.6–6.1 | „Platforma, która zmienia rynek budowlany.” — „zmienia” murowane z cegiełek |
| 6.1–10.1 | Pytania w stylu technicznym (linijki, wymiary, lżejszy Poppins) |
| 10.1–17.35 | Aplikacja budoexpert (czat): wiadomość, odpowiedź, wgranie projektu PDF, model 3D domu, kosztorys stanu surowego liczony do 300 000 zł |
| 17.35–20.0 | „Tworzymy nowy świat dla rynku budowlanego.” → REWOLUCJA |
| 20.0–24.4 | Hub: koło z logo w rdzeniu, 10 ról w kółkach, połączenia jako skręcone podwójne helisy z pakietami danych |
| 24.4–26.9 | Platforma 3D z walcem i logo; „Wszyscy. W jednym miejscu. Jedna platforma.” |
| 26.9–31.95 | CTA: „Nie czekaj! Zapisz się już dziś.” + przycisk + budoexpert.pl + logo |

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
