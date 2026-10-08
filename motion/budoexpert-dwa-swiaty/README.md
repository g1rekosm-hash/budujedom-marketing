# Budoexpert — „Dwa światy budowania” (explainer 2D z lektorem)

Film według storyboardu v3 (październik 2026): najpierw cały stary świat (szaro, deszcz, każdy osobno), zwrot z turkusowym trójkątem, potem nowy świat w tych samych kadrach, ale w kolorach marki i w aplikacji Budoexpert.

1920×1080 · 25 kl/s · stereo · ok. 2:06 (z 2 s stopu na końcu pod pętlę targową) · font Poppins.

| Plik | Co to jest |
|---|---|
| `video-budoexpert-dwa-swiaty.mp4` | gotowy film z lektorem, muzyką i efektami |
| `film.html` | silnik animacji (canvas): otwórz w przeglądarce, spacja = pauza, ←/→ = ±1 s; `?t=63` zatrzymuje na danej sekundzie, `?subs=1` dodaje napisy |
| `voiceover.py` | syntezuje lektora (Piper, polski głos męski `pl_PL-darkman-medium`, licencja CC0) i liczy oś czasu → `vo/*.wav`, `timeline.json`, `timeline.js` |
| `soundtrack.py` | muzyka + efekty + miks z lektorem (ducking, -16 LUFS) → `mix.wav` |
| `render.mjs` | render HTML → MP4 klatka po klatce |

## Jak to działa
- Oś czasu wynika z lektora: każde ujęcie trwa tyle, ile w storyboardzie, chyba że kwestia potrzebuje więcej miejsca (wtedy ujęcie się wydłuża). Najdłuższe są 05A (dłuższa kwestia o hurtowni) i 06A (1 s ciszy po „osobno”).
- Czasy efektów dźwiękowych (tąpnięcia na kwotach, „ding” trójkąta, popy przy ✓ itd.) są w jednym miejscu: blok `/*CUES*/` w `film.html`. Czyta go zarówno animacja, jak i `soundtrack.py`.
- Zasady ze storyboardu: w starym świecie zero brandingu; w nowym świecie każdy ekran ma u góry fioletowy pasek z logo; brak słowa „chaos” i obietnic ze starego landingu (kwoty na kartkach to element obrazu).

## Ponowny render
```bash
pip install piper-tts numpy scipy && npm i playwright
# głos: vits-piper-pl_PL-darkman-medium z https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models
python3 voiceover.py --model pl_PL-darkman-medium.onnx
python3 soundtrack.py
node render.mjs --audio mix.wav --out video-budoexpert-dwa-swiaty.mp4
node render.mjs --preview 12.5,64,100   # szybki podgląd klatek do frames/
```

## Nagranie prawdziwego lektora
Syntetyczny głos to dobra wersja robocza, ale do emisji warto nagrać człowieka (skrypt jest na ostatnich stronach storyboardu).
Nagraj każdą kwestię jako osobny plik i zapisz pod tymi samymi nazwami w `vo/` (`00.wav`, `01a.wav`, `01b.wav`, … – lista w `voiceover.py`, tabela `LINES`), potem:

```bash
python3 voiceover.py --keep-audio   # przelicza oś czasu z długości nagrań
python3 soundtrack.py && node render.mjs --audio mix.wav
```
Animacja sama dopasuje długości ujęć do nowych nagrań.
