"""Syntezuje 25,6-sekundowy soundtrack (120 BPM) zsynchronizowany z promo budoexpert.
Uruchom: python3 soundtrack.py  →  soundtrack.wav
"""
import wave
import numpy as np

import sys
INTRO_ONLY = len(sys.argv) > 1 and sys.argv[1] == 'intro'   # python3 soundtrack.py intro → intro-test.wav
SR, DUR = 48000, (3.2 if INTRO_ONLY else 30.55)
N = int(SR * DUR)
rng = np.random.default_rng(3)
L = np.zeros(N); R = np.zeros(N)


def t_(d):
    return np.arange(int(SR * d)) / SR


# Events are written in the scenes' own timeline seconds and mapped to the final cut:
# scenes 2-3 (4.5-12.0) play 1.9 s earlier; from REWOLUCJA on (12.4+) everything plays 3.55 s later,
# because the feature-card scene now sits right after the questions. The old iris (12.0-12.4) is gone.
# App-scene events are written in real seconds with raw=True.
INTRO_PHASE = False


def add(sig, at, gain=1.0, pan=0.0, raw=False):
    if INTRO_ONLY and not INTRO_PHASE:
        return
    if not raw:
        if at >= 12.4:
            at += 3.55
        elif at >= 12.0:
            return
        elif at >= 4.5:
            at -= 1.9
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * gain * np.sqrt((1 - pan) / 2) * 1.414
    R[i:i + len(sig)] += sig * gain * np.sqrt((1 + pan) / 2) * 1.414


def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y


def kick(dur=0.45, f0=150, f1=42):
    t = t_(dur); f = f1 + (f0 - f1) * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) + 0.3 * np.exp(-t * 300) * rng.standard_normal(len(t))


def hat(dur=0.05, open_=False):
    t = t_(0.25 if open_ else dur); n = rng.standard_normal(len(t))
    n = n - lowpass(n, 7000)
    return n * np.exp(-t * (14 if open_ else 70)) * 0.5


def clap():
    t = t_(0.3); n = rng.standard_normal(len(t)); n = n - lowpass(n, 1200)
    env = np.exp(-t * 18) + sum(np.exp(-np.maximum(t - d, 0) * 90) * (t >= d) for d in (0.0, 0.011, 0.023)) * 0.6
    return n * env * 0.5


def bass(freq, dur):
    t = t_(dur); saw = 2 * ((t * freq) % 1) - 1
    s = lowpass(saw, 380) * 1.6 + 0.6 * np.sin(2 * np.pi * freq * t)
    return s * np.minimum(1, t * 200) * np.exp(-t * 3.5)


def whoosh(dur, up=True):
    t = t_(dur); n = rng.standard_normal(len(t)); p = t / dur
    env = (p ** 2.2 if up else (1 - p) ** 2) * np.sin(np.pi * np.clip(p * (1.0 if up else 1), 0, 1)) ** 0.3
    lo = lowpass(n, 900); hi = n - lowpass(n, 3000)
    mix = lo * (1 - p) + hi * p if up else lo * p + hi * (1 - p)
    return mix * env * 0.9


def tick(f=2400, dur=0.03):
    t = t_(dur); return np.sin(2 * np.pi * f * t) * np.exp(-t * 180)


def boing(f0=220, dur=0.35):
    t = t_(dur); f = f0 * (1 + 0.6 * np.exp(-t * 20))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def pluck(freq, dur=0.6):
    t = t_(dur)
    return (np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t) + 0.15 * np.sin(6 * np.pi * freq * t)) * np.exp(-t * 6)


def pad(freqs, dur):
    t = t_(dur); s = sum(np.sin(2 * np.pi * f * t + i) + 0.5 * np.sin(2 * np.pi * f * 1.004 * t) for i, f in enumerate(freqs))
    return s / len(freqs) * np.minimum(1, t / 0.4) * np.clip((dur - t) / 1.2, 0, 1)


BEAT = 0.5
note = lambda m: 440 * 2 ** ((m - 69) / 12)


def roll(dur):
    t = t_(dur); n = lowpass(rng.standard_normal(len(t)), 260)
    return n * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)) * np.minimum(1, t * 6) * np.clip((dur - t) * 4, 0, 1) * 3


def pop(f0=500, dur=0.25):
    t = t_(dur); f = f0 * (1 + 1.5 * np.exp(-t * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)


def engine(dur):
    t = t_(dur); saw = 2 * ((t * 38) % 1) - 1
    rumble = lowpass(saw, 220) * (0.7 + 0.3 * np.sin(2 * np.pi * 11 * t)) + lowpass(rng.standard_normal(len(t)), 300) * 0.6
    return rumble * np.minimum(1, t * 3) * np.clip((dur - t) * 2, 0, 1)


def hydraulic(dur, f0=180, f1=420):
    t = t_(dur); f = f0 + (f1 - f0) * t / dur
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / dur) * 0.5


# --- test intro: the ball tumbles into a triangle and slams the wordmark
if True:   # the tumbling-ball intro is the film's intro too
    INTRO_PHASE = True
    add(whoosh(0.6), 0.0, 0.5, pan=-0.6)
    add(roll(0.95), 0.0, 0.45, pan=-0.3)
    for i, tt in enumerate((0.42, 0.55, 0.66, 0.75, 0.83, 0.9)):   # corners knocking on the baseline as it tumbles
        add(kick(0.18, 220, 90), tt, 0.18 + i * 0.05); add(tick(500 + i * 60, 0.03), tt, 0.1)
    add(kick(0.6, 160, 40), 0.95, 1.0); add(clap(), 0.95, 0.6)
    add(pop(380, 0.3), 0.97, 0.35)
    for i in range(10):
        add(pluck(note([62, 65, 69, 72, 74, 77, 74, 72, 69, 74][i]), 0.35), 0.95 + i * 0.03, 0.08, pan=-0.5 + i * 0.1)
    for i in range(8):
        add(tick(2600 + i * 180, 0.03), 0.96 + i * 0.012, 0.08, pan=np.sin(i * 2.3) * 0.7)
    add(tick(3200, 0.04), 1.35, 0.2)
    rt = t_(0.6); add(np.sin(2 * np.pi * np.cumsum(1800 + 2400 * rt / .6) / SR) * np.sin(np.pi * rt / .6) * 0.15, 1.55, 0.4)
    add(pad([note(50), note(57), note(62), note(69)], 2.2), 0.95, 0.2)
    INTRO_PHASE = False

add(whoosh(0.5), 2.1, 0.35)                        # logo flies up

# --- groove 4.5 -> 21.5 (drops out under the REWOLUCJA build-up)
bass_line = [38, 38, 45, 43, 41, 41, 43, 45]
b = 4.5; k = 0
while b < 21.5:
    quiet = 13.6 <= b < 14.0
    if not quiet:
        add(kick(), b, 0.9)
        if k % 2 == 1:
            add(clap(), b, 0.5)
        add(bass(note(bass_line[k % 8]), 0.42), b + BEAT / 2, 0.35)
    for h in range(4):
        th = b + h * BEAT / 4
        if th < 21.5 and not quiet:
            add(hat(open_=(h == 2)), th, 0.16 if h != 2 else 0.1, pan=0.35 if h % 2 else -0.35)
    b += BEAT; k += 1

for i in range(2):
    add(pluck(note(69 + i * 3), 0.4), 4.55 + i * 0.1, 0.18)
# --- 2. "zmienia" is laid brick by brick, then sets
for i in range(26):                                # bricks landing (old-timeline seconds)
    tt = 5.1 + i * 0.85 / 26
    add(tick(700 + (i * 137) % 600, 0.035), tt + 0.18, 0.13, pan=-0.3 + (i % 7) * 0.1)
add(kick(0.5, 130, 40), 6.25, 0.8); add(clap(), 6.25, 0.35)
add(lowpass(rng.standard_normal(int(SR * 0.6)), 1200) * np.exp(-t_(0.6) * 6), 6.25, 0.35)   # dust
add(pluck(note(74), 0.5), 6.25, 0.2)
add(whoosh(0.5), 7.5, 0.55)                        # page scroll
for i, tq in enumerate((8.0, 9.0, 10.0, 11.0)):    # questions
    add(pop(520 + i * 80, 0.2), tq + 0.25, 0.3)
    add(pluck(note(74 + [0, 3, 5, 7][i]), 0.5), tq, 0.2)
add(whoosh(0.35), 11.7, 0.5)                       # iris
add(kick(0.6, 120, 35), 12.0, 0.7)
add(pad([note(50), note(57), note(62), note(66)], 1.8), 12.2, 0.2)
rt = t_(1.0); rs = np.sin(2 * np.pi * np.cumsum(200 + 1200 * (rt / 1.0) ** 2) / SR) * (rt / 1.0) ** 2
add(rs * 0.25 + whoosh(1.0) * 0.8, 13.0, 0.5)      # riser -> REWOLUCJA
it = t_(2.0); boom = np.sin(2 * np.pi * np.cumsum(32 + 90 * np.exp(-it * 6)) / SR) * np.exp(-it * 2)
add(boom * 1.2 + lowpass(rng.standard_normal(len(it)), 2500) * np.exp(-it * 5) * 0.6, 14.0, 1.0)
add(whoosh(0.5, up=False), 15.0, 0.5)              # collapse into hub
for i in range(10):                                # 10 roles pop in
    add(pop(420 + i * 40, 0.2), 16.3 + i * 0.11, 0.22, pan=np.cos(-np.pi / 2 + i * 2 * np.pi / 10) * 0.7)
for i in range(10):                                # energy pulses arriving at the core
    add(tick(1500 + i * 120, 0.06), 18.45 + i * 0.08, 0.13)
rt = t_(0.9); add(np.sin(2 * np.pi * np.cumsum(300 + 1500 * (rt / .9) ** 2) / SR) * (rt / .9) ** 2 * 0.3, 18.1, 0.5)
add(kick(0.8, 140, 34) * 1.2, 19.0, 1.0)           # powers combine
# --- the sheet tilts into a 3D platform, the pedestal rises
add(whoosh(0.9), 19.3, 0.45)
rt = t_(0.6); add(np.sin(2 * np.pi * np.cumsum(60 + 140 * (rt / .6)) / SR) * np.sin(np.pi * rt / .6) * 0.6, 19.65, 0.5)
add(pad([note(50), note(57), note(62), note(69), note(74)], 2.2), 19.6, 0.28)
for i, tt in enumerate((20.05, 20.25, 20.55)):
    add(pluck(note([74, 78, 81][i]), 0.6), tt, 0.22)
    add(kick(0.3, 180, 70), tt, 0.25)
add(whoosh(0.5), 21.5, 0.55)                       # platform -> CTA

# --- feature blocks stack into a house (real seconds 10.55-15.95), right after the questions
A0 = 10.55
add(pop(500, 0.25), 10.1, 0.3, raw=True); add(whoosh(0.45), 10.1, 0.4, raw=True)   # questions → blocks
add(pad([note(57), note(62), note(66), note(69)], 5.4), A0, 0.16, raw=True)
for i in range(7):                                 # each block falls and lands
    t0 = A0 + 0.45 + i * 0.36
    add(whoosh(0.22) * 0.5, t0, 0.2, pan=-0.5 + (i % 3) * 0.5, raw=True)
    add(kick(0.35, 120, 45), t0 + 0.26, 0.55, raw=True); add(tick(700 + i * 40, 0.04), t0 + 0.26, 0.2, raw=True)
    add(pluck(note([62, 64, 66, 69, 71, 74, 76][i]), 0.4), t0 + 0.27, 0.14, raw=True)
add(whoosh(0.3), A0 + 3.0, 0.4, raw=True)          # roof falls
add(kick(0.7, 140, 35), A0 + 3.3, 1.0, raw=True); add(clap(), A0 + 3.3, 0.5, raw=True)
add(pluck(note(74), 1.0) + pluck(note(78), 1.0) * .7 + pluck(note(81), 1.0) * .5, A0 + 3.32, 0.3, raw=True)
add(whoosh(0.4), A0 + 4.95, 0.5, raw=True)         # iris into REWOLUCJA

# --- CTA (+1.5 s)
add(kick(0.6, 150, 40), 22.0, 0.9); add(clap(), 22.0, 0.45)
for i in range(10):
    add(pop(600 + i * 40, 0.12), 22.0 + i * 0.035, 0.1)
b = 22.5; k = 0
while b < 27.0:
    add(kick(), b, 0.7)
    if k % 2 == 1:
        add(clap(), b, 0.35)
    add(hat(), b + 0.25, 0.12)
    add(bass(note([38, 45, 43, 41][k % 4]), 0.42), b + 0.25, 0.3)
    b += BEAT; k += 1
add(whoosh(0.8), 23.5, 0.15)                       # cursor glide
add(tick(1200, 0.03), 24.45, 0.6); add(tick(2400, 0.02), 24.45, 0.4)   # click
for i in range(14):                                # confetti sparkle
    add(pluck(note(81 + (i * 5) % 12), 0.25), 24.5 + i * 0.04, 0.07, pan=np.sin(i * 1.7) * 0.8)
add(pad([note(50), note(57), note(62), note(66), note(69)], 2.5), 24.9, 0.3)
for i in range(13):                                # typing budoexpert.pl
    add(tick(2200 + (i % 4) * 150, 0.015), 25.25 + i * 0.6 / 13, 0.09)
add(pluck(note(74), 1.4) + pluck(note(78), 1.4) * .7 + pluck(note(81), 1.4) * .5, 25.85, 0.35)

# --- simple reverb + master
ir_t = t_(1.1); ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 5.5); ir[0] = 0
def conv(x):
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
L = L + conv(L) * 0.035; R = R + conv(R) * 0.035
fade = np.clip((DUR - np.arange(N) / SR) / 0.8, 0, 1)
L *= fade; R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
L = np.tanh(L / peak * 1.4) / np.tanh(1.4); R = np.tanh(R / peak * 1.4) / np.tanh(1.4)
pcm = (np.stack([L, R], 1) * 0.89 * 32767).astype(np.int16)
with wave.open('intro-test.wav' if INTRO_ONLY else 'soundtrack.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('intro-test.wav' if INTRO_ONLY else 'soundtrack.wav', pcm.shape)
