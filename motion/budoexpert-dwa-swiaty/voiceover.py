"""Lektor + oś czasu dla filmu „Dwa światy budowania” (storyboard v3, październik 2026).

Syntezuje kwestie lektora polskim głosem Piper (pl_PL darkman, CC0) i na podstawie ich
prawdziwej długości układa montaż: każde ujęcie trwa tyle, ile w storyboardzie, chyba że
kwestia lektora potrzebuje więcej miejsca.

Uruchom:  python3 voiceover.py --model /ścieżka/pl_PL-darkman-medium.onnx
Wynik:    vo/*.wav (48 kHz mono), timeline.json (dla soundtrack.py) i timeline.js (dla film.html)

Własne nagranie lektora: podmień pliki vo/<id>.wav i uruchom z --keep-audio,
wtedy skrypt tylko przelicza oś czasu z długości plików.
"""
import argparse
import json
import subprocess
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
VO = HERE / 'vo'
SR = 48000

# Ujęcia: (id, domyślna długość z storyboardu w s)
SHOTS = [
    ('00A', 4), ('00B', 3),
    ('01A', 6), ('01B', 6),
    ('02A', 3), ('02B', 4),
    ('03A', 6), ('03B', 3), ('03C', 3),
    ('04A', 5), ('04B', 4),
    ('05A', 6), ('05B', 5),
    ('06A', 4), ('06B', 2), ('06C', 3),
    ('07A', 5), ('07B', 6),
    ('08A', 4), ('08B', 3),
    ('09A', 4), ('09B', 3), ('09C', 4),
    ('10A', 4), ('10B', 4),
    ('11A', 4), ('11B', 3),
    ('12A', 3), ('12B', 2), ('12C', 5),   # 12C = 3 s + 2 s stopu przed pętlą
]

OLD, NEW = 'old', 'new'
# Kwestie: (id, ujęcie, opóźnienie od początku ujęcia, części tekstu, styl)
# Liczba w częściach = pauza w sekundach („…” w skrypcie lektora).
LINES = [
    ('00', '00A', 0.9, ['Budowa domu miała być spełnieniem marzeń.'], OLD),
    ('01a', '01A', 0.6, ['To oszczędności całego życia.', 0.45, 'Kredyt na trzydzieści lat.'], OLD),
    ('01b', '01B', 0.4, ['A Ty stoisz przed własnym domem…', 0.55, 'i nie masz pojęcia, co się na nim dzieje.'], OLD),
    ('02a', '02A', 0.6, ['Trzy wyceny.'], OLD),
    ('02b', '02B', 0.5, ['Trzy różne ceny.', 0.5, 'I żadnej pewności.'], OLD),
    ('03a', '03A', 0.6, ['Po dwunastu godzinach na budowie siada do wycen.'], OLD),
    ('03b', '03B', 0.3, ['Po nocach liczy od zera…'], OLD),
    ('03c', '03C', 0.2, ['to, co powinno wynikać wprost z projektu.'], OLD),
    ('04a', '04A', 0.6, ['Rano ekipa jest na placu.', 0.45, 'Materiał –', 0.25, 'nie.'], OLD),
    ('04b', '04B', 0.3, ['Bo nikt nikomu nie powiedział, kiedy będzie potrzebny.'], OLD),
    ('05a', '05A', 0.5, ['A w hurtowni sprzedawca pół godziny tłumaczy, czego trzeba do budowy.', 0.35,
                         'Bo nikt tego wcześniej nie policzył.'], OLD),
    ('05b', '05B', 0.3, ['Klient dziękuje…', 0.6, 'i wychodzi z niczym.'], OLD),
    ('06a', '06A', 0.3, ['Każdy z nich robi, co może.', 0.4, 'Tylko każdy osobno.'], 'turn'),
    ('06c', '06C', 0.25, ['A gdyby wszyscy byli w jednym miejscu?'], 'turn'),
    ('07a', '07A', 0.6, ['Teraz wiesz wszystko.'], NEW),
    ('07b', '07B', 0.3, ['Każdy etap widzisz w aplikacji, a ekspert Budoekspert pilnuje budowy razem z Tobą.'], NEW),
    ('08a', '08A', 0.5, ['Sprawdzone firmy.', 0.3, 'Przejrzyste oferty.'], NEW),
    ('08b', '08B', 0.3, ['I wreszcie pewność.'], NEW),
    ('09a', '09A', 0.5, ['Kosztorys jest gotowy, wprost z projektu.'], NEW),
    ('09b', '09B', 0.3, ['A zlecenia przychodzą same.'], NEW),
    ('09c', '09C', 0.4, ['Wieczór znowu należy do niego.'], NEW),
    ('10a', '10A', 0.5, ['Rano ekipa jest na placu.', 0.35, 'Materiał też.'], NEW),
    ('10b', '10B', 0.3, ['Bo każdy wie, kiedy będzie potrzebny.'], NEW),
    ('11a', '11A', 0.5, ['Hurtownia dostaje gotowe zamówienie.'], NEW),
    ('11b', '11B', 0.3, ['Bo wszystko zostało policzone wcześniej.'], NEW),
    ('12a', '12A', 0.4, ['Wszyscy.', 0.35, 'W jednym miejscu.'], NEW),
    ('12b', '12B', 0.25, ['Budoekspert.'], NEW),
    ('12c', '12C', 0.35, ['Nie czekaj.', 0.3, 'Zapisz się już dziś.'], NEW),
]
# „ciszej, wolno, z ciężarem” vs „cieplej, z uśmiechem, lekko szybciej”
STYLE = {OLD: dict(length_scale=1.05, volume=0.82), 'turn': dict(length_scale=1.05, volume=0.9),
         NEW: dict(length_scale=0.98, volume=1.0)}
TAIL = 0.45   # minimalny oddech po kwestii przed cięciem


def synth(voice, text, style):
    from piper import SynthesisConfig
    cfg = SynthesisConfig(length_scale=style['length_scale'], noise_scale=0.6, noise_w_scale=0.75)
    pcm = b''.join(c.audio_int16_bytes for c in voice.synthesize(text, cfg))
    x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    return x, voice.config.sample_rate


def trim(x, sr, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a, b = max(0, idx[0] - int(0.02 * sr)), min(len(x), idx[-1] + int(0.08 * sr))
    return x[a:b]


def write_wav(path, x, sr):
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def read_len(path):
    with wave.open(str(path)) as w:
        return w.getnframes() / w.getframerate()


def render_line(voice, parts, style):
    sr = voice.config.sample_rate
    chunks = []
    for p in parts:
        if isinstance(p, (int, float)):
            chunks.append(np.zeros(int(p * sr), np.float32))
        else:
            x, sr = synth(voice, p.replace('…', '.'), style)
            chunks.append(trim(x, sr))
    return np.concatenate(chunks) * style['volume'], sr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', help='plik .onnx głosu Piper (pl_PL)')
    ap.add_argument('--keep-audio', action='store_true', help='nie syntezuj, użyj istniejących vo/*.wav')
    a = ap.parse_args()
    VO.mkdir(exist_ok=True)

    if not a.keep_audio:
        from piper import PiperVoice
        voice = PiperVoice.load(a.model)
        for lid, _, _, parts, st in LINES:
            x, sr = render_line(voice, parts, STYLE[st])
            raw = VO / f'{lid}.raw.wav'
            write_wav(raw, x, sr)
            # 48 kHz, lekkie ocieplenie i kompresja (lektor „z offu”)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw,
                            '-af', 'highpass=f=75,equalizer=f=180:t=q:w=1:g=2.5,equalizer=f=3500:t=q:w=1.2:g=1.5,'
                                   'acompressor=threshold=-20dB:ratio=3:attack=5:release=120,aresample=48000:resampler=soxr',
                            '-ar', str(SR), '-ac', '1', str(VO / f'{lid}.wav')], check=True)
            raw.unlink()
            print(f'{lid}: {read_len(VO / f"{lid}.wav"):.2f} s')

    # oś czasu
    need = {}
    for lid, shot, off, _, _ in LINES:
        d = read_len(VO / f'{lid}.wav')
        need[shot] = max(need.get(shot, 0), off + d + TAIL)
    shots, t = [], 0.0
    for sid, dflt in SHOTS:
        d = max(dflt, need.get(sid, 0))
        if sid == '06A':
            d = max(d, need.get(sid, 0) + 0.55)   # „[pauza 1 s]” – reszta ciszy w 06B
        if sid == '12C':
            d = max(d, need.get(sid, 0) + 2.0)    # 2 s stopu przed pętlą
        d = round(d * 25) / 25                    # pełne klatki przy 25 kl/s
        shots.append({'id': sid, 'start': round(t, 3), 'dur': d})
        t += d
    start = {s['id']: s['start'] for s in shots}
    lines = [{'id': lid, 'shot': shot, 'at': round(start[shot] + off, 3), 'dur': round(read_len(VO / f'{lid}.wav'), 3),
              'text': ' '.join(p for p in parts if isinstance(p, str)).replace('Budoekspert', 'Budoexpert')}
             for lid, shot, off, parts, _ in LINES]
    tl = {'fps': 25, 'dur': round(t, 3), 'shots': shots, 'vo': lines}
    (HERE / 'timeline.json').write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    (HERE / 'timeline.js').write_text('// wygenerowane przez voiceover.py — nie edytuj ręcznie\nwindow.TL = '
                                      + json.dumps(tl, ensure_ascii=False) + ';\n')
    print(f'długość filmu: {t:.2f} s ({int(t // 60)}:{t % 60:05.2f})')
    for s in shots:
        print(f"  {s['id']}  {s['start']:7.2f}  +{s['dur']:.2f}")


if __name__ == '__main__':
    main()
