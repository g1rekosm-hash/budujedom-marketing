"""Muzyka, efekty i miks z lektorem dla „Dwa światy budowania”.

Czyta timeline.json (z voiceover.py), czasy efektów z bloku /*CUES*/ w film.html i nagrania vo/*.wav.
Uruchom: python3 soundtrack.py  →  mix.wav (48 kHz stereo)
         python3 soundtrack.py --no-vo  →  music.wav (sama muzyka + efekty, np. do podmiany lektora)
"""
import json
import re
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, lfilter, sosfilt

HERE = Path(__file__).resolve().parent
TL = json.loads((HERE / 'timeline.json').read_text())
CUES = json.loads(re.search(r'/\*CUES\*/(.*?)/\*END\*/', (HERE / 'film.html').read_text(), re.S).group(1))
S = {s['id']: s['start'] for s in TL['shots']}
D = {s['id']: s['dur'] for s in TL['shots']}
SR = 48000
DUR = TL['dur']
N = int(SR * DUR)
rng = np.random.default_rng(7)

# trzy szyny: muzyka i tło (ściszane pod lektorem), efekty, lektor
BUS = {k: np.zeros((2, N)) for k in ('music', 'amb', 'sfx', 'vo')}


def t_(d):
    return np.arange(int(SR * d)) / SR


def add(bus, sig, at, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if i >= N or i < 0:
        return
    if sig.ndim == 1:
        sig = np.vstack([sig * np.sqrt((1 - pan) / 2) * 1.414, sig * np.sqrt((1 + pan) / 2) * 1.414])
    sig = sig[:, :N - i]
    BUS[bus][:, i:i + sig.shape[1]] += sig * gain


def filt(x, kind, f):
    sos = butter(2, f, btype=kind, fs=SR, output='sos')
    return sosfilt(sos, x)


def env(n, a=0.005, r=0.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def noise(d):
    return rng.standard_normal(int(SR * d))


def hz(note):   # 'A3', 'C#4'
    names = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    m = re.match(r'([A-G])(#|b)?(-?\d)', note)
    n = names[m.group(1)] + {'#': 1, 'b': -1, None: 0}[m.group(2)] + 12 * (int(m.group(3)) + 1)
    return 440 * 2 ** ((n - 69) / 12)


# ---------- instrumenty ----------
def piano(f, d=3.0, vel=1.0, bright=1.0):
    t = t_(d); x = np.zeros_like(t)
    for k in range(1, 8):
        fk = f * k * (1 + 0.0004 * k * k)
        if fk > SR / 2.2: break
        x += np.sin(2 * np.pi * fk * t) * (bright ** (k - 1)) / k ** 1.4 * np.exp(-t * (0.9 + 0.55 * k) * (f / 400) ** 0.3)
    x += filt(noise(d), 'lowpass', 2500) * np.exp(-t * 60) * 0.05
    return x * env(len(t), 0.004, 0.3) * vel * 0.5


def pluck(f, d=0.9, damp=0.996, vel=1.0):
    P = max(2, int(SR / f)); n = int(SR * d)
    exc = np.zeros(n); exc[:P] = filt(rng.uniform(-1, 1, P), 'lowpass', 3000)
    a = np.zeros(P + 2); a[0] = 1; a[P] = -damp / 2; a[P + 1] = -damp / 2
    y = lfilter([1], a, exc)
    return y * env(n, 0.001, 0.15) * vel * 0.6


def pad(freqs, d, a=0.8, r=1.2, cut=1400):
    t = t_(d); x = np.zeros_like(t)
    for f in freqs:
        for det in (-0.12, 0.0, 0.13):
            ph = rng.uniform(0, 1)
            x += (2 * ((f * (1 + det / 100 * 4) * t + ph) % 1) - 1)
    x = filt(x, 'lowpass', cut) / (len(freqs) * 3)
    return x * env(len(t), a, r)


def bell(f, d=2.5, partials=((1, 1), (2.76, .5), (5.4, .25), (8.9, .1))):
    t = t_(d)
    return sum(np.sin(2 * np.pi * f * k * t) * g * np.exp(-t * (1.6 + k * .9)) for k, g in partials) * env(len(t), 0.002, 0.1) * 0.4


def thud(f0=70, d=0.9):
    t = t_(d); ph = 2 * np.pi * np.cumsum(f0 * (1 + 1.2 * np.exp(-t * 20))) / SR
    return (np.sin(ph) * np.exp(-t * 6) + filt(noise(d), 'lowpass', 300) * np.exp(-t * 25) * 0.6) * 0.9


def click(f=4000, d=0.02):
    return filt(noise(d), 'bandpass', [f * .6, min(f * 1.6, 20000)]) * np.exp(-t_(d) * 300)


def whoosh(d=0.8, up=True):
    t = t_(d); x = noise(d); out = np.zeros_like(x); seg = int(SR * 0.02)
    for i in range(0, len(x), seg):
        p = i / len(x); fc = 300 + 4000 * (p if up else 1 - p)
        out[i:i + seg] = filt(x[i:i + seg + 200], 'bandpass', [fc * .7, fc * 1.4])[:len(x[i:i + seg])]
    return out * np.sin(np.pi * t / d) ** 2 * 0.6


def pop(f0=900, f1=480, d=0.12):
    t = t_(d); ph = 2 * np.pi * np.cumsum(np.linspace(f0, f1, len(t))) / SR
    return np.sin(ph) * np.exp(-t * 35) * 0.6


# ---------- efekty z bloku CUES ----------
def sfx(name, d):
    if name == 'pencil':
        x = filt(noise(d), 'bandpass', [1800, 6500]); t = t_(d)
        am = np.clip(np.sin(2 * np.pi * 3.1 * t) + 0.3 * np.sin(2 * np.pi * 7.3 * t), 0, None)
        return x * am * 0.12
    if name == 'pianoWarm':
        out = np.zeros(int(SR * 3.5))
        for k, n in enumerate(['C5', 'E5', 'G5']):
            p = piano(hz(n), 2.5, 0.5); i = int(SR * [0, .55, 1.15][k]); out[i:i + len(p)] += p[:len(out) - i]
        return out
    if name == 'drops':
        out = np.zeros(int(SR * d))
        for _ in range(55):
            tt = d * rng.uniform(0, 1) ** 0.6; i = int(tt * SR); p = np.sin(2 * np.pi * rng.uniform(1300, 2600) * t_(0.06)) * np.exp(-t_(0.06) * 70)
            out[i:i + len(p)] += p[:len(out) - i] * rng.uniform(.1, .3)
        return out
    if name == 'sigh':
        t = t_(1.4); return filt(noise(1.4), 'bandpass', [350, 1800]) * np.sin(np.pi * t / 1.4) ** 2 * 0.07
    if name == 'lampHum':
        t = t_(d); return (np.sin(2 * np.pi * 100 * t) + .4 * np.sin(2 * np.pi * 200 * t) + .2 * np.sign(np.sin(2 * np.pi * 100 * t))) * 0.012 * env(len(t), .3, .3)
    if name == 'hit':
        return thud(55, 1.2) * 0.5
    if name == 'calc':
        return click(3000, 0.03) * 0.5
    if name == 'scribble':
        t = t_(d); return filt(noise(d), 'bandpass', [1500, 4500]) * np.clip(np.sin(2 * np.pi * 7 * t), 0, None) * 0.1
    if name == 'childBreath':
        t = t_(d); return filt(noise(d), 'bandpass', [300, 1400]) * (np.sin(np.pi * t / 1.4) ** 2) * 0.035
    if name == 'sent':
        return np.concatenate([whoosh(0.25) * .4, pop(700, 1100, 0.1) * .5])
    if name == 'phoneTone':
        t = t_(d); return np.sin(2 * np.pi * 425 * t) * ((t % 0.6) < 0.35) * 0.08
    if name == 'counter':
        out = np.zeros(int(SR * (d + .1)))
        for k in range(2, 51, 2):
            i = int(np.sqrt(k / 50) * d * SR); c = click(2200, 0.03) * .35; out[i:i + len(c)] += c[:len(out) - i]
        return out
    if name == 'whoosh':
        return whoosh(0.8) * 0.8
    if name == 'bell':
        out = np.zeros(int(SR * 2.2))
        for k, at in enumerate([0, .12, .26]):
            b = bell(2100 * (1 + .02 * k), 1.6, ((1, 1), (1.62, .6), (2.5, .3))) * (1 - .25 * k); i = int(at * SR); out[i:i + len(b)] += b[:len(out) - i]
        return out * 0.5
    if name == 'doorShut':
        return thud(90, 0.6) * 0.6 + np.pad(click(1500, 0.08) * .3, (0, int(SR * .52)))
    if name == 'ding':
        return bell(1568, 3.5, ((1, 1), (2, .35), (3, .2), (4.2, .1))) * 1.3
    if name == 'swell':
        dd = D['06C'] + 0.15; t = t_(dd); rise = (t / dd) ** 2.2
        x = filt(noise(dd), 'highpass', 1500) * rise * 0.12
        x += pad([hz('C3'), hz('G3'), hz('C4'), hz('E4')], dd, a=dd * .8, r=0.05, cut=2500) * rise * 1.2
        return x
    if name == 'pop':
        return pop() * 0.8
    if name == 'popCheck':
        return pop(800, 520) * .7 + np.pad(pop(1200, 1600, 0.08) * .4, (int(SR * .07), 0))[:int(SR * .12)]
    if name == 'msgDing':
        a, b = bell(1318, 1.2) * .6, bell(1760, 1.2) * .6
        return np.pad(a, (0, int(SR * .12))) + np.pad(b, (int(SR * .12), 0))
    if name == 'bright':
        return bell(2093, 1.0) * 0.6
    if name == 'clap':
        x = np.zeros(int(SR * .3))
        for k in range(3):
            c = filt(noise(.12), 'bandpass', [900, 3200]) * np.exp(-t_(.12) * 45); i = int(SR * .008 * k); x[i:i + len(c)] += c
        return x * 0.6
    if name == 'plane':
        t = t_(d); return filt(noise(d), 'bandpass', [700, 3000]) * np.abs(np.sin(4.2 * t)) ** 3 * 0.12
    if name == 'buzz':
        t = t_(d); return np.sign(np.sin(2 * np.pi * 150 * t)) * ((t % 0.6) < 0.4) * 0.04
    if name == 'tap':
        return click(1800, 0.04) * 0.6
    if name == 'confirm':
        return np.pad(bell(1046, .6) * .5, (0, int(SR * .12))) + np.pad(bell(1568, .6) * .5, (int(SR * .12), 0))
    if name == 'clink':
        return bell(2600, .6, ((1, 1), (1.47, .7), (2.3, .4))) * .3
    if name == 'truck':
        t = t_(d); x = sum(np.sin(2 * np.pi * 42 * k * t + k) / k for k in range(1, 6)) * (1 + .3 * np.sin(2 * np.pi * 11 * t))
        x += filt(noise(d), 'lowpass', 400) * .4
        return x * 0.15 * np.minimum(1, (d - t) / .6 + .25) * env(len(t), .3, .3)
    if name == 'birds':
        out = np.zeros(int(SR * d))
        for _ in range(9):
            i = int(rng.uniform(0, d - .3) * SR); dd = .09; tt = t_(dd)
            f = np.linspace(rng.uniform(3000, 4200), rng.uniform(4500, 5500), len(tt))
            c = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / dd) * .06; out[i:i + len(c)] += c
        return out
    if name == 'hiss':
        t = t_(1.2); return filt(noise(1.2), 'highpass', 2500) * np.exp(-t * 2.5) * 0.15
    if name == 'click':
        return click(2500, 0.025) * 0.8
    if name == 'beep':
        t = t_(0.22); return np.sin(2 * np.pi * 1050 * t) * env(len(t), .005, .03) * 0.12
    if name == 'plink':
        return pluck(hz(['C6', 'E6', 'G6', 'C7'][sfx.plink % 4]), 0.8) * 0.5
    if name == 'chordHit':
        x = np.zeros(int(SR * 6))
        for n in ['C2', 'C3', 'G3', 'C4', 'E4', 'G4', 'C5']:
            p = piano(hz(n), 6, 0.55); x[:len(p)] += p
        x += pad([hz('C3'), hz('G3'), hz('E4'), hz('C5')], 6, a=.05, r=3.5, cut=2200) * 1.3
        th = thud(45, 2); x[:len(th)] += th * .5
        return x * 0.38
    raise KeyError(name)


sfx.plink = 0


# ---------- STARY ŚWIAT: deszcz, dron, pojedyncze nuty, tykanie ----------
def envelope(points):   # [(t, gain)] → krzywa z krótkimi przejściami
    xs = np.array([p[0] for p in points]); ys = np.array([p[1] for p in points])
    return np.interp(np.arange(N) / SR, xs, ys)


old_end = S['06B']   # w 06B wszystko się urywa: cisza
cut = lambda sid, g0, g1=None: [(S[sid] + .02, g0), (S[sid] + D[sid] - .02, g0 if g1 is None else g1)]
rainL, rainR = (filt(rng.standard_normal(N), 'bandpass', [700, 7000]) for _ in range(2))
mufL, mufR = (filt(filt(rng.standard_normal(N), 'lowpass', 900), 'highpass', 120) for _ in range(2))
bright_pts = [(0, 0), (S['00B'] + .4, 0), (S['00B'] + D['00B'], .55)] + cut('01A', .7) + cut('01B', .5) + cut('02A', 0) + cut('03C', 0) \
    + cut('04A', .3) + cut('04B', .25) + cut('05A', 0) + cut('05B', 0) + cut('06A', .65) + [(old_end - .01, .65), (old_end, 0), (DUR, 0)]
muf_pts = [(0, 0), (S['02A'] - .02, 0)] + cut('02A', .55) + cut('02B', .4) + cut('03A', .4) + cut('03B', .3) + cut('03C', .3) \
    + [(S['04A'], 0), (S['05A'] - .02, 0)] + cut('05A', .3) + cut('05B', .3) + [(S['06A'], 0), (DUR, 0)]
eb, em = envelope(bright_pts) * 0.06, envelope(muf_pts) * 0.11
BUS['amb'][0] += rainL * eb + mufL * em
BUS['amb'][1] += rainR * eb + mufR * em
# krople na parasolu w 01A–01B
for _ in range(260):
    tt = rng.uniform(S['01A'], S['02A']); p = np.sin(2 * np.pi * rng.uniform(500, 900) * t_(.04)) * np.exp(-t_(.04) * 90)
    add('amb', p, tt, rng.uniform(.02, .06), rng.uniform(-.6, .6))
# dron
dr_t = np.arange(N) / SR
drone = (np.sin(2 * np.pi * 55 * dr_t) + .6 * np.sin(2 * np.pi * 82.41 * dr_t + 1) + .25 * np.sin(2 * np.pi * 110.3 * dr_t)) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.11 * dr_t))
de = envelope([(0, 0), (S['00B'] + .8, 0), (S['01A'] + .5, .045), (S['03A'], .05), (S['05B'], .065), (S['06A'] + D['06A'] - .01, .06), (old_end, 0), (DUR, 0)])
BUS['music'] += drone * de
# pojedyncze, niskie nuty pianina w pauzach
for sid, off, n in [('01A', .2, 'A3'), ('01A', 3.4, 'E3'), ('01B', .1, 'C4'), ('01B', 3.2, 'B3'), ('02A', .1, 'A3'), ('02B', 3.0, 'E3'),
                    ('03A', .2, 'F3'), ('03B', .2, 'C4'), ('03C', .1, 'E3'), ('04A', .1, 'D4'), ('04B', .1, 'A3'), ('05A', .1, 'C4'),
                    ('05B', .1, 'E3'), ('05B', 2.4, 'A2')]:
    add('music', piano(hz(n), 3.5, .55, .6), S[sid] + off, .5, rng.uniform(-.3, .3))
# tykanie zegara 03–05, coraz szybsze
tt = S['03A']
while tt < S['06A']:
    period = 1.0 if tt < S['04A'] else .75 if tt < S['05A'] else .55
    add('amb', click(3200, .025), tt, .22, .3)
    tt += period
# 06A: motyw starego świata ostatni raz
for k, n in enumerate(['A3', 'C4', 'E4', 'D4', 'C4']):
    add('music', piano(hz(n), 3, .6, .7), S['06A'] + .2 + k * .62, .55)
# 4 kanały deszczu w 06A (lekko przesunięte)
for k, pan in enumerate([-.8, .8, -.4, .4]):
    seg = filt(rng.standard_normal(int(SR * D['06A'])), 'bandpass', [900 + 300 * k, 6000])
    add('amb', seg * env(len(seg), .3, .02), S['06A'] + .35 * k, .025, pan)

# ---------- NOWY ŚWIAT: ciepły motyw, rośnie scena po scenie ----------
BPM = 92; BEAT = 60 / BPM; BAR = 4 * BEAT
t0 = S['07A']; t_end = S['12B']
CHORDS = [['C3', 'G3', 'C4', 'E4'], ['B2', 'G3', 'D4', 'G4'], ['A2', 'E3', 'C4', 'E4'], ['F2', 'C4', 'F4', 'A4']]
ARP = [['C4', 'E4', 'G4', 'E4'], ['B3', 'D4', 'G4', 'D4'], ['A3', 'C4', 'E4', 'C4'], ['F3', 'A3', 'C4', 'A3']]
BASS = ['C2', 'B1', 'A1', 'F1']


def level(t):   # intensywność 0..1 w zależności od sceny
    for sid, v in [('12A', 1.0), ('11A', .85), ('10A', .75), ('09A', .6), ('08A', .45), ('07B', .32), ('07A', .22)]:
        if t >= S[sid]:
            return v
    return 0


bar = 0
while t0 + bar * BAR < t_end:
    tb = t0 + bar * BAR; c = bar % 4; lv = level(tb)
    for n in CHORDS[c]:
        add('music', piano(hz(n), BAR + 1.5, .32 + .15 * lv, .75), tb + rng.uniform(0, .02), .55, rng.uniform(-.2, .2))
    for b in range(8 if lv >= .45 else 4):
        tn = tb + b * (BEAT / 2 if lv >= .45 else BEAT)
        if tn >= t_end: break
        n = ARP[c][b % 4]; up = 12 if (lv >= .75 and b % 4 == 2) else 0
        add('music', pluck(hz(n) * 2 ** (up / 12), .7, .995, .35 + .3 * lv), tn, .5, (-.35, .35)[b % 2])
    if lv >= .45:
        add('music', pad([hz(n) for n in CHORDS[c]], BAR + .6, a=.6, r=.8, cut=1300 + 900 * lv), tb, .1 + .14 * lv)
    if lv >= .6:
        add('music', pluck(hz(BASS[c]), BAR, .999, .9), tb, .55)
        add('music', pluck(hz(BASS[c]), BAR / 2, .999, .7), tb + 2.5 * BEAT, .4)
        for b in range(8):
            tn = tb + b * BEAT / 2
            if tn >= t_end: break
            sh = filt(noise(.06), 'highpass', 6000) * np.exp(-t_(.06) * 60)
            add('music', sh, tn, .05 + (.03 if b % 2 else 0), .4)
            if b in (0, 4):
                add('music', thud(60, .4), tn, .18 * lv)
    bar += 1
# przed finałem: krótkie wyciszenie groove'u
i0, i1 = int((t_end - .05) * SR), int(t_end * SR)
BUS['music'][:, i0:i1] *= np.linspace(1, 0, i1 - i0)
# finał: akord kończący na planszy
for n in ['C3', 'G3', 'C4', 'E4', 'G4']:
    add('music', piano(hz(n), 4.5, .35, .7), S['12C'] + .75, .45)

# ---------- efekty ----------
for sid, lst in CUES.items():
    for c in lst:
        at, name = S[sid] + c[0], c[1]
        d = c[2] if len(c) > 2 else 1.0
        if name == 'plink':
            sfx.plink += 1
        add('sfx', sfx(name, d), at, 1.0, {'calc': .3, 'bell': .5, 'doorShut': .5, 'truck': -.4, 'birds': .3}.get(name, 0))

# ---------- lektor ----------
NO_VO = '--no-vo' in sys.argv
if not NO_VO:
    for line in TL['vo']:
        with wave.open(str(HERE / 'vo' / f"{line['id']}.wav")) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
        add('vo', x, line['at'], 0.95)

# ducking: muzyka i tło cichną pod lektorem
v = np.abs(BUS['vo'][0])
e = lfilter([1 - np.exp(-1 / (SR * .25))], [1, -np.exp(-1 / (SR * .25))], v)
duck = 1 - 0.55 * np.clip(e / 0.06, 0, 1)
mix = (BUS['music'] * 0.9 + BUS['amb']) * duck + BUS['sfx'] * 0.8 + BUS['vo']
mix[:, -int(SR * .4):] *= np.linspace(1, 0, int(SR * .4))
peak = np.max(np.abs(mix))
mix = np.tanh(mix / peak * 1.25) / np.tanh(1.25) * 0.93
out = HERE / ('music.wav' if NO_VO else 'mix.wav')
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
print(out, f'{DUR:.2f} s, peak przed limiterem {peak:.2f}')
# głośność pod internet/targi: -16 LUFS
import subprocess, shutil
tmp = out.with_suffix('.tmp.wav'); shutil.move(out, tmp)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(tmp), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), str(out)], check=True)
tmp.unlink()
