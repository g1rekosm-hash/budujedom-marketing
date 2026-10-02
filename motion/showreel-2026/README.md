# BUDUJEDOM — Motion Showreel 2026

15 s · 1920×1080 · 60 fps · stereo. Całość jest napisana w kodzie: bez After Effects, bez timeline'u.

| Plik | Co to jest |
|---|---|
| `showreel.mp4` | gotowy render (H.264 + AAC) |
| `showreel.html` | silnik animacji: otwórz w przeglądarce, żeby odtworzyć na żywo (spacja = pauza, ←/→ = przewijanie) |
| `render.mjs` | renderuje HTML → MP4 klatka po klatce, z motion blurem (8 subklatek, migawka 180°) |
| `soundtrack.py` | syntezuje ścieżkę dźwiękową 120 BPM zsynchronizowaną z cięciami |
| `fonts/` | Archivo (zmienna szerokość i grubość) + Space Mono, lokalnie |

## Sceny
| Czas | Scena | Technika |
|---|---|---|
| 0.0–3.5 | Piłka → blueprint → dom z cegieł → przelot przez okno | squash & stretch, rysowanie linii, spring, whip-zoom |
| 3.5–5.0 | PROJEKTUJ / BUDUJ / ANIMUJ | typografia kinetyczna z maskami, wipe, iris |
| 5.0–7.0 | Koło → kwadrat → gwiazda → trójkąt → dom | morphing wielokątów, echo trails |
| 7.0–9.0 | TIMING TO WSZYSTKO. | flip kafli, halftone sterowany polem sił |
| 9.0–11.0 | 3D | własna projekcja perspektywiczna, cząsteczki, stripe wipe |
| 11.0–12.5 | 60 / 900 / 100% | liczniki-odometry |
| 12.5–15.0 | Logo BUDUJEDOM + claim | flash, burst cząsteczek, sprężynujące litery |

## Zmiana kolorów / fontu
Wszystko siedzi w obiekcie `CFG` na górze `showreel.html` (`CFG.C` to paleta, `CFG.font` to font).
Po zmianie wyrenderuj od nowa:

```bash
pip install numpy imageio-ffmpeg && npm i playwright
python3 soundtrack.py
FFMPEG=$(python3 -c "import imageio_ffmpeg as i;print(i.get_ffmpeg_exe())") node render.mjs --audio soundtrack.wav
# szybki podgląd wybranych klatek: node render.mjs --samples 1 --preview 1.2,4.1,9.5
```
