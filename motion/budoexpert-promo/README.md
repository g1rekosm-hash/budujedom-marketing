# budoexpert — promo (27,5 s)

1920×1080 · 60 fps · stereo · kolory z logo (fiolet `#6C0C79`, turkus `#20CFA3`) · font Poppins.
Styl: szkic architektoniczny na papierze milimetrowym.

| Czas | Scena |
|---|---|
| 0.0–4.5 | Turkusowa kula od razu wtacza się z lewej; kamera łapie ją i trzyma na środku kadru, kula zatrzymuje się w naszkicowanym trójkącie i zmienia w trójkąt, kamera odjeżdża i trójkąt dobija do napisu |
| 4.5–8.0 | „Platforma, która zmienia rynek budowlany.” — koparka przywozi w łyżce słowo „zmienia” i wysypuje je w puste miejsce w zdaniu |
| 8.0–12.0 | Planujesz budowę domu? / Jesteś w trakcie budowy? / Jesteś wykonawcą? / …albo sprzedawcą? |
| 12.0–15.5 | „Tworzymy nowy świat dla rynku budowlanego.” → REWOLUCJA |
| 15.5–19.3 | Hub: budoexpert w kole + 6 odnóg (inwestor, deweloper, architekt, wykonawca, sprzedawca, project manager), impulsy energii |
| 19.3–22.0 | Kartka przechyla się w 3D w platformę, środek wyrasta w cokół z logo; na środku „Wszyscy. W jednym miejscu. Jedna platforma.” |
| 22.0–27.5 | CTA: „Nie czekaj! Zapisz się już dziś.” + przycisk + budoexpert.pl + logo |

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

W folderze `after-effects/` jest skrypt, który buduje z tego filmu natywny projekt `.aep` (instrukcja w `after-effects/README.md`). Uwaga: skrypt odpowiada poprzedniej, 26-sekundowej wersji filmu (bez koparki, platformy 3D i adresu strony).
