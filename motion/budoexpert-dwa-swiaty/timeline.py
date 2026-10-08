"""Oś czasu filmu „Dwa światy budowania” (wersja bez lektora).

Długości ujęć są dobrane pod czas czytania napisów w kadrze.
Uruchom po zmianie:  python3 timeline.py  →  timeline.json (dla soundtrack.py) i timeline.js (dla film.html)
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
FPS = 25
SHOTS = [
    ('00A', 3.6), ('00B', 3.4),                  # marzenie zmyte deszczem
    ('01A', 4.6), ('01B', 5.0),                  # inwestor: nie wiedzą, co się dzieje
    ('02A', 3.2), ('02B', 4.0),                  # trzy wyceny
    ('03A', 4.4), ('03B', 3.0), ('03C', 3.6),    # wykonawca po nocach
    ('04A', 4.4), ('04B', 4.2),                  # materiału nie ma
    ('05A', 4.8), ('05B', 4.4),                  # hurtownia
    ('06A', 4.4), ('06B', 2.0), ('06C', 3.2),    # zwrot
    ('07A', 4.0), ('07B', 5.4),                  # nowy świat: inwestor
    ('08A', 4.4), ('08B', 3.0),
    ('09A', 3.8), ('09B', 3.4), ('09C', 3.8),
    ('10A', 4.4), ('10B', 4.0),
    ('11A', 4.4), ('11B', 3.4),
    ('12A', 3.6), ('12B', 2.6), ('12C', 5.2),    # finał + 2 s stopu pod pętlę
]

shots, t = [], 0.0
for sid, d in SHOTS:
    d = round(d * FPS) / FPS
    shots.append({'id': sid, 'start': round(t, 3), 'dur': d})
    t += d
tl = {'fps': FPS, 'dur': round(t, 3), 'shots': shots}
(HERE / 'timeline.json').write_text(json.dumps(tl, indent=1))
(HERE / 'timeline.js').write_text('// wygenerowane przez timeline.py — nie edytuj ręcznie\nwindow.TL = ' + json.dumps(tl) + ';\n')
print(f'{t:.2f} s ({int(t // 60)}:{t % 60:05.2f})')
