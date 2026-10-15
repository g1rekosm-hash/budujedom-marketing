"""Oś czasu filmu „Dwa światy budowania” (wersja 3: szybsza, cięcia na bitach 120 BPM).

Każde ujęcie ma długość na ekranie (dur, wielokrotność 0,5 s = jednego bitu) i długość projektową (design),
w której napisana jest jego animacja w scenes-*.js. Ujęcie gra design/dur razy szybciej niż je zaprojektowano.
Uruchom po zmianie:  python3 timeline.py  →  timeline.json (dla soundtrack.py) i timeline.js (dla film.html)
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
FPS, BPM = 25, 120
SHOTS = [   # (id, na ekranie, projektowo)
    ('00A', 3.0, 3.6), ('00B', 2.5, 3.4),
    ('01A', 3.0, 4.6), ('01B', 3.5, 5.0),
    ('02A', 2.0, 3.2), ('02B', 3.0, 4.0),
    ('03A', 3.0, 4.4), ('03B', 2.0, 3.0), ('03C', 2.5, 3.6),
    ('04A', 3.0, 4.4), ('04B', 3.0, 4.2),
    ('05A', 3.0, 4.8), ('05B', 3.0, 4.4),
    ('06A', 3.0, 4.4), ('06B', 1.5, 2.0), ('06C', 2.5, 3.2),
    ('07A', 3.0, 4.0), ('07B', 4.0, 5.4),
    ('08A', 3.5, 4.4), ('08B', 2.5, 3.0),
    ('09A', 3.0, 3.8), ('09B', 2.5, 3.4), ('09C', 3.0, 3.8),
    ('10A', 5.0, 5.0), ('10B', 3.0, 4.0),
    ('11A', 3.5, 4.4), ('11B', 2.5, 3.4),
    ('12A', 3.0, 3.6), ('12B', 2.0, 2.6), ('12C', 5.0, 5.2),
]

shots, t = [], 0.0
for sid, d, dd in SHOTS:
    shots.append({'id': sid, 'start': round(t, 3), 'dur': d, 'design': dd})
    t += d
tl = {'fps': FPS, 'bpm': BPM, 'dur': round(t, 3), 'shots': shots}
(HERE / 'timeline.json').write_text(json.dumps(tl, indent=1))
(HERE / 'timeline.js').write_text('// wygenerowane przez timeline.py — nie edytuj ręcznie\nwindow.TL = ' + json.dumps(tl) + ';\n')
print(f'{t:.2f} s ({int(t // 60)}:{t % 60:05.2f})')
