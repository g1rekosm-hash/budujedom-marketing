# budoexpert — promo (26 s)

1920×1080 · 60 fps · stereo · kolory z logo (fiolet `#6C0C79`, turkus `#20CFA3`) · font Poppins.
Styl: szkic architektoniczny na papierze milimetrowym.

| Czas | Scena |
|---|---|
| 0.0–4.5 | Turkusowa kulka toczy się z lewej, zamienia w trójkąt i dobija do napisu — szkic logo wypełnia się kolorem |
| 4.5–8.0 | „Platforma, która zmienia rynek budowlany.” |
| 8.0–12.0 | Planujesz budowę domu? / Jesteś w trakcie budowy? / Jesteś wykonawcą? / …albo sprzedawcą? |
| 12.0–15.5 | „Tworzymy nowy świat dla rynku budowlanego.” → REWOLUCJA |
| 15.5–20.5 | Hub: budoexpert w kole + 6 odnóg (inwestor, deweloper, architekt, wykonawca, sprzedawca, project manager) |
| 20.5–26.0 | CTA: „Nie czekaj! Zapisz się już dziś.” + przycisk + logo |

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

W folderze `after-effects/` jest skrypt, który buduje z tego filmu natywny projekt `.aep` (instrukcja w `after-effects/README.md`).
