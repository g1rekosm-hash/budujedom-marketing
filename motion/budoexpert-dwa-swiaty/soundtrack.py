"""Muzyka i efekty dla „Dwa światy budowania”.

Czyta timeline.json (z timeline.py) i czasy efektów z bloku /*CUES*/ w film.html.
Uruchom: python3 soundtrack.py  →  mix.wav (48 kHz stereo, -16 LUFS)
"""
import json
import re
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

# szyny: muzyka, tło (deszcz, zegar), efekty
BUS = {k: np.zeros((2, N)) for k in ('music', 'amb', 'sfx')}


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
    if name == 'whip':
        return whoosh(.38, True) * .9
    if name == 'zoomIn':
        return whoosh(.32, False) * .6
    if name == 'impact':
        return thud(70, .6) * .5 + np.pad(filt(noise(.3), 'highpass', 3000) * np.exp(-t_(.3) * 12) * .2, (0, int(SR * .3)))
    if name == 'brake':
        t = t_(.7); return filt(noise(.7), 'bandpass', [2500, 6000]) * np.exp(-t * 3) * .12
    if name == 'hydraulic':
        t = t_(d); return (np.sin(2 * np.pi * (180 + 60 * np.sin(t * 1.3)) * t) * .03 + filt(noise(d), 'bandpass', [300, 900]) * .05) * env(len(t), .2, .3)
    if name == 'thudSoft':
        return thud(65, .7) * .55
    raise KeyError(name)


sfx.plink = 0


# ---------- MUZYKA: 120 BPM, cięcia filmu lądują na bitach ----------
DES = {s['id']: s['design'] for s in TL['shots']}
BEAT = 60 / TL.get('bpm', 120); BAR = 4 * BEAT


def envelope(points):   # [(t, gain)] → krzywa
    xs = np.array([p[0] for p in points]); ys = np.array([p[1] for p in points])
    return np.interp(np.arange(N) / SR, xs, ys)


def kick(g=1.0):
    t = t_(.38); f = 48 + 110 * np.exp(-t * 30)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) + .25 * filt(noise(.38), 'lowpass', 2000) * np.exp(-t * 120)) * g


def clap(g=1.0):
    x = np.zeros(int(SR * .25))
    for k in range(3):
        c = filt(noise(.15), 'bandpass', [900, 3500]) * np.exp(-t_(.15) * (60 if k < 2 else 22)); i = int(SR * .011 * k); x[i:i + len(c)] += c
    return x * g


def hat(op=False, g=1.0):
    d = .22 if op else .05; t = t_(d); return filt(noise(d), 'highpass', 7000) * np.exp(-t * (14 if op else 80)) * g


def bass(f, d, g=1.0):
    t = t_(d); x = np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) + .15 * np.sign(np.sin(2 * np.pi * f * t))
    return filt(x, 'lowpass', 600) * env(len(t), .004, .06) * np.exp(-t * 1.2) * g


def snare(g=1.0):
    t = t_(.2); return (filt(noise(.2), 'bandpass', [1500, 6000]) * np.exp(-t * 22) + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .5) * g


S_INTRO, S_OLD, S_TURN, S_SIL, S_RISE, S_NEW, S_HIT, S_END = 0, S['01A'], S['06A'], S['06B'], S['06C'], S['07A'], S['12B'], S['12C']

# --- intro: jasne arpeggio pianina (marzenie), od 00B deszcz i molowy cień ---
for k in range(int((S_OLD - .01) / (BEAT / 2))):
    tn = k * BEAT / 2; dream = tn < S['00B']
    seq = ['C5', 'E5', 'G5', 'B5', 'G5', 'E5', 'D5', 'G5'] if dream else ['A4', 'C5', 'E5', 'G5', 'E5', 'C5', 'B4', 'E5']
    add('music', piano(hz(seq[k % 8]), 1.6, .55, .9), tn, 1.4, (-.3, .3)[k % 2])
for t0_, ch in [(0, ['C3', 'G3', 'E4']), (S['00B'], ['A2', 'E3', 'C4'])]:
    add('music', pad([hz(n) for n in ch], (S['00B'] if t0_ == 0 else S_OLD) - t0_ + .4, a=.4, r=.4, cut=1800), t0_, .35)

# --- stary świat: słodko-gorzki groove Am–F–C–G, lekki beat ---
OLD_CH = [['A2', 'E3', 'A3', 'C4', 'E4'], ['F2', 'C3', 'A3', 'C4', 'F4'], ['C3', 'G3', 'C4', 'E4', 'G4'], ['G2', 'D3', 'B3', 'D4', 'G4']]
OLD_ARP = [['A3', 'C4', 'E4', 'C4'], ['F3', 'A3', 'C4', 'A3'], ['G3', 'C4', 'E4', 'C4'], ['G3', 'B3', 'D4', 'B3']]
nb = int(np.ceil((S_SIL - S_OLD) / BAR))
for b in range(nb):
    tb = S_OLD + b * BAR; c = b % 4; ch = OLD_CH[c]
    hot = 1.0 if tb >= S['05A'] else .8 if tb >= S['03A'] else .6
    turn = tb >= S_TURN
    for n in ch[1:]: add('music', piano(hz(n), BAR + .8, .26, .65), tb + rng.uniform(0, .015), .5, rng.uniform(-.2, .2))
    add('music', pad([hz(n) for n in ch[1:]], BAR + .3, a=.25, r=.4, cut=1400), tb, .07)
    for k in range(8):
        tn = tb + k * BEAT / 2
        if tn >= S_SIL - .02: break
        add('music', pluck(hz(OLD_ARP[c][k % 4]) * (2 if k in (3, 7) else 1), .5, .993, .4 * hot), tn, .45, (-.35, .35)[k % 2])
        if not turn:
            if k in (0, 5): add('music', kick(.55 * hot), tn)
            if k == 4: add('music', clap(.35 * hot), tn, 1, .1)
            add('music', hat(False, .12 + (.06 if k % 2 else 0)), tn, 1, .35)
            if tb >= S['03A']: add('amb', click(3400 if k % 2 else 2600, .02), tn, .14, -.3)   # tykanie zegara w rytmie
        if k in (0, 3, 6): add('music', bass(hz(ch[0]), BEAT * 1.2, .5 * (0.6 if turn else 1)), tn)
# deszcz: lżejszy niż wcześniej
cut = lambda sid, g0: [(S[sid] + .02, g0), (S[sid] + D[sid] - .02, g0)]
rainL, rainR = (filt(rng.standard_normal(N), 'bandpass', [900, 7000]) for _ in range(2))
pts = [(0, 0), (S['00B'] + .3, 0), (S_OLD, .35)] + cut('01A', .4) + cut('01B', .3) + cut('02A', .12) + cut('02B', .08) + cut('03A', .1) + cut('03B', .1) + cut('03C', .05) \
    + cut('04A', .22) + cut('04B', .2) + cut('05A', .06) + cut('05B', .1) + cut('06A', .3) + [(S_SIL - .01, .3), (S_SIL, 0), (DUR, 0)]
er = envelope(pts) * .05; BUS['amb'][0] += rainL * er; BUS['amb'][1] += rainR * er

# --- zwrot: 06B cisza (tylko „ding”), 06C werbel i riser ---
dur_r = S_NEW - S_RISE; k = 0; tn = S_RISE
while tn < S_NEW - .01:
    prog = (tn - S_RISE) / dur_r; step = BEAT / 2 if prog < .4 else BEAT / 4 if prog < .8 else BEAT / 8
    add('music', snare(.15 + .5 * prog), tn, 1, 0); tn += step
t = t_(dur_r); add('music', filt(noise(dur_r), 'highpass', 2000) * (t / dur_r) ** 2 * .12, S_RISE)
add('music', pad([hz('C3'), hz('G3'), hz('C4'), hz('E4')], dur_r, a=dur_r * .9, r=.05, cut=2600) * ((t / dur_r) ** 1.5), S_RISE, .5)

# --- nowy świat: pogodny groove C–G–Am–F ---
NEW_CH = [['C3', 'G3', 'C4', 'E4', 'G4'], ['G2', 'D3', 'G3', 'B3', 'D4'], ['A2', 'E3', 'A3', 'C4', 'E4'], ['F2', 'C3', 'F3', 'A3', 'C4']]
NEW_ARP = [['C5', 'G4', 'E5', 'G4'], ['B4', 'G4', 'D5', 'G4'], ['C5', 'A4', 'E5', 'A4'], ['C5', 'A4', 'F5', 'A4']]
MEL = ['E5', None, 'G5', 'E5', 'D5', None, 'C5', None, 'D5', None, 'B4', 'D5', 'G5', None, None, None,
       'E5', None, 'C5', 'E5', 'A5', None, 'G5', None, 'F5', None, 'A5', 'G5', 'F5', 'E5', 'C5', None]


def lvl(t):
    for sid, v in [('12A', 5), ('11A', 4), ('10A', 3.5), ('09A', 3), ('08A', 2), ('07B', 1)]:
        if t >= S[sid]: return v
    return 0


nb = int(np.ceil((S_HIT - S_NEW) / BAR))
for b in range(nb):
    tb = S_NEW + b * BAR; c = b % 4; ch = NEW_CH[c]; L = lvl(tb); last = tb + BAR > S['12A'] - .01 and tb < S['12A']
    if b == 0: add('music', filt(noise(1.5), 'highpass', 5000) * np.exp(-t_(1.5) * 3) * .25, tb)   # crash na wejściu
    if abs(tb - S['12A']) < BAR / 2: add('music', filt(noise(1.8), 'highpass', 4500) * np.exp(-t_(1.8) * 2.5) * .3, S['12A'])
    add('music', pad([hz(n) for n in ch[1:]], BAR + .2, a=.05, r=.3, cut=2200 + 400 * L) * (.5 + .5 * np.abs(np.sin(np.pi * t_(BAR + .2) / BEAT))), tb, .09 + .02 * L)
    for k in range(16):
        tn = tb + k * BEAT / 4
        if tn >= S_HIT - .02: break
        beat, eighth = k % 4 == 0, k % 2 == 0
        if beat: add('music', kick(.8), tn)
        if k in (4, 12): add('music', clap(.45), tn, 1, .05)
        if eighth and not beat: add('music', hat(True, .1 + .02 * L), tn, 1, .3)
        if L >= 3 and not eighth: add('music', hat(False, .07), tn, 1, -.3)
        if eighth: add('music', bass(hz(ch[0]) * (2 if (k // 2) % 2 else 1), BEAT * .45, .55), tn)
        arp_step = 1 if L >= 3.5 else 2
        if k % arp_step == 0: add('music', pluck(hz(NEW_ARP[c][(k // arp_step) % 4]), .45, .994, .32 + .04 * L), tn, .45, (-.4, .4)[(k // arp_step) % 2])
        if L >= 3.5 and k in (2, 6, 10, 14):   # house'owe pianino na słabe części
            for n in ch[2:]: add('music', piano(hz(n) * 2, .5, .3, 1.0), tn, .35, .15)
        if L >= 2 and eighth:
            m = MEL[(b % 4) * 8 + k // 2]
            if m: add('music', bell(hz(m), .9, ((1, 1), (2, .3), (3, .12))) * .55, tn, .5, -.1)
    if last:   # wbicie przed 12A: werbel
        for q in range(8): add('music', snare(.2 + .06 * q), tb + BAR / 2 + q * BEAT / 4)
i0, i1 = int((S_HIT - .04) * SR), int(S_HIT * SR)
BUS['music'][:, i0:i1] *= np.linspace(1, 0, i1 - i0); BUS['music'][:, i1:] = 0
# outro na planszy: delikatne arpeggio i akord końcowy
for k in range(int((DUR - S_END - 1.0) / (BEAT / 2))):
    tn = S_END + .25 + k * BEAT / 2
    add('music', pluck(hz(['C5', 'G4', 'E5', 'G4', 'C6', 'G4', 'E5', 'D5'][k % 8]), .6, .995, .45 * (1 - k * BEAT / 2 / (DUR - S_END))), tn, .4, (-.3, .3)[k % 2])
for n in ['C3', 'G3', 'C4', 'E4', 'G4']: add('music', piano(hz(n), 4.0, .38, .75), S_END + .75, .45)

# ---------- efekty (czasy CUES są w czasie projektowym ujęcia → przeliczone na ekranowy) ----------
for sid, lst in CUES.items():
    k = D[sid] / DES[sid]
    for c in lst:
        at, name = S[sid] + c[0] * k, c[1]
        d = (c[2] if len(c) > 2 else 1.0) * k
        if name == 'plink':
            sfx.plink += 1
        add('sfx', sfx(name, d), at, 1.0, {'calc': .3, 'bell': .5, 'doorShut': .5, 'truck': -.4, 'birds': .3, 'whip': 0}.get(name, 0))

mix = BUS['music'] * 0.45 + BUS['amb'] + BUS['sfx'] * 0.75
mix[:, -int(SR * .4):] *= np.linspace(1, 0, int(SR * .4))
peak = np.max(np.abs(mix))
mix = np.tanh(mix / peak * 1.25) / np.tanh(1.25) * 0.93
out = HERE / 'mix.wav'
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
print(out, f'{DUR:.2f} s, peak przed limiterem {peak:.2f}')
# głośność pod internet/targi: -16 LUFS
import subprocess, shutil
tmp = out.with_suffix('.tmp.wav'); shutil.move(out, tmp)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(tmp), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), str(out)], check=True)
tmp.unlink()
