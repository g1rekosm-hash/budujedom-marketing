# budoexpert — promo (30,5 s)

1920×1080 · 60 fps · stereo · kolory z logo (fiolet `#6C0C79`, turkus `#20CFA3`) · font Poppins.
Styl: szkic architektoniczny na papierze milimetrowym.

Są dwie wersje z tego samego silnika i tym samym dźwiękiem:

- **video promo budoexpert v1** (`video-promo-budoexpert-v1.mp4`): pytania „Planujesz budowę domu?…”, cechy platformy, hub z 10 rolami, CTA z budoexpert.pl.
- **video promo budoexpert doodle** (`video-promo-budoexpert-doodle.mp4`, z `doodle.html`): ta sama historia i ten sam dźwięk co v1, ale w stylu odręcznego szkicu — białe / fioletowe tła, „gotujące się” podwójne kontury, serduszka, strzałki, iskierki, buźki i dopiski odręcznym fontem Caveat („Dobra energia!”, „Dobre rzeczy się budują”, „razem od A do Z”). Pytania co sekundę, karteczki z taśmą zamiast kart 3D, hub z 10 rolami na papierze, CTA z klikającym kursorem i konfetti, plansza końcowa z logo i budoexpert.pl.
- **video promo budoexpert problem** (`video-promo-budoexpert-problem.mp4`, render z `--query v=2`): w miejsce pytań „Stary świat” — ból każdej grupy (inwestor, wykonawca, hurtownia, architekt); karty z etykietami ról; hub z 6 rolami z formularza zapisu; na końcu „Dołącz poniżej ↓”, czyli prowadzi do banera pod filmem.

| Czas | Scena |
|---|---|
| 0.0–2.6 | Kula wtacza się i w trakcie toczenia zamienia w trójkąt, uderza w napis, logo jedzie do góry |
| 2.6–6.1 | „Platforma, która zmienia rynek budowlany.” — „zmienia” murowane z cegiełek |
| 6.1–10.5 | V1: pytania w stylu technicznym · V2: „Stary świat” — po jednym problemie każdej grupy |
| 10.5–13.1 | „Tworzymy nowy świat dla rynku budowlanego.” → REWOLUCJA |
| 13.1–18.55 | Karuzela 18 kart z paralaksą: zatrzymuje się na 5, resztę przelatuje coraz szybciej, dalsze karty giną we fioletowej mgle; odjazd kamery pokazuje rzędy kart, które zlatują się w logo |
| 18.55–19.05 | Fioletowe tło zwija się w koło huba |
| 19.05–25.0 | Hub (V1: 10 ról, V2: 6 ról), proste linie z impulsami, efekt 3D i „Wszyscy. W jednym miejscu. Jedna platforma.” |
| 25.0–30.55 | CTA: „Nie czekaj! Zapisz się już dziś.” + przycisk; V1: budoexpert.pl, V2: „Dołącz poniżej ↓” |

W kodzie (`promo.html`) sceny zachowują swoje dawne czasy, a tabela `SEGS` układa je w finalny montaż (karuzela kart ma czasy od 100 s w osi roboczej).

Efekty iskier i błysku są inspirowane komponentami [React Bits](https://github.com/DavidHDev/react-bits) (ClickSpark, ShinyText), napisane od nowa na canvasie, żeby renderowały się deterministycznie klatka po klatce.

| Plik | Co to jest |
|---|---|
| `video-promo-budoexpert-v1.mp4` | video promo budoexpert v1 |
| `video-promo-budoexpert-problem.mp4` | video promo budoexpert problem (wersja ze „starym światem”) |
| `video-promo-budoexpert-doodle.mp4` | video promo budoexpert doodle (styl odręczny) |
| `doodle.html` | silnik wersji doodle (osobny plik, czasy w sekundach filmu; font Caveat w `fonts/caveat-*`) |
| `promo.html` | silnik animacji (otwórz w przeglądarce: spacja = pauza, ←/→ = przewijanie) |
| `render.mjs` | render HTML → MP4 z motion blurem |
| `soundtrack.py` | syntezowana muzyka 120 BPM |

Teksty i kolory edytujesz w `promo.html` (paleta w `CFG.C`). Ponowny render:

```bash
python3 soundtrack.py
FFMPEG=$(python3 -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())") node render.mjs --audio soundtrack.wav --out video-promo-budoexpert-v1.mp4
node render.mjs --query v=2 --audio soundtrack.wav --out video-promo-budoexpert-problem.mp4
node render.mjs --page doodle.html --samples 6 --audio soundtrack.wav --out video-promo-budoexpert-doodle.mp4
```

`render.mjs` potrzebuje Playwrighta (`npm i playwright` albo symlink `node_modules` do globalnej instalacji).

## Projekt After Effects

W folderze `after-effects/` jest skrypt, który buduje z tego filmu natywny projekt `.aep` (instrukcja w `after-effects/README.md`). Uwaga: skrypt odpowiada pierwszej, 26-sekundowej wersji filmu (bez szybkiego intro, murowanego słowa, platformy 3D i adresu strony).

## Test intro (sama scena 1)

Wariant intro, w którym kula zamienia się w trójkąt w trakcie toczenia (przetacza się po rosnących rogach), uderza w napis i dociska do pełnego trójkąta: `intro-test.mp4` (3,2 s). Główny film się nie zmienia.

```bash
python3 soundtrack.py intro
node render.mjs --query only=intro --audio intro-test.wav --out intro-test.mp4
```
