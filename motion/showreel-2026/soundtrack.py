"""Syntezuje 15-sekundowy soundtrack (120 BPM) zsynchronizowany z cięciami showreelu.
Uruchom: python3 soundtrack.py  →  soundtrack.wav
"""
import wave
import numpy as np

SR, DUR = 48000, 15.0
N = int(SR * DUR)
rng = np.random.default_rng(3)
L = np.zeros(N); R = np.zeros(N)


def t_(d):
    return np.arange(int(SR * d)) / SR


def add(sig, at, gain=1.0, pan=0.0):
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

# --- intro: bouncing ball
add(boing(330), 0.5, 0.35)
add(kick(0.6, 120, 38), 1.0, 0.9)
add(whoosh(0.9), 0.1, 0.25)
add(whoosh(0.5), 1.0, 0.2)
for i in range(22):  # bricks landing
    add(tick(1800 + (i % 5) * 220, 0.02), 2.12 + i * 0.037, 0.12, pan=np.sin(i))

# --- groove 1.5 → 12.25
bass_line = [38, 38, 41, 36, 38, 38, 43, 41]  # D minor-ish
b = 1.5; k = 0
while b < 12.25:
    add(kick(), b, 0.95)
    if k % 2 == 1:
        add(clap(), b, 0.55)
    for h in range(4):
        th = b + h * BEAT / 4
        if th < 12.25:
            add(hat(open_=(h == 2)), th, 0.18 if h != 2 else 0.12, pan=0.35 if h % 2 else -0.35)
    add(bass(note(bass_line[k % 8]), 0.42), b + BEAT / 2, 0.38)
    b += BEAT; k += 1

# --- transitions
add(whoosh(0.4), 3.12, 0.55)                      # zoom into window
add(kick(0.5, 200, 50), 3.5, 0.6)
for i, tw in enumerate((3.5, 3.95, 4.25)):         # words
    add(pluck(note(74 + i * 3), 0.4), tw, 0.25, pan=-0.2 + i * 0.2)
add(whoosh(0.3), 4.7, 0.5)                          # iris
for i, tm in enumerate((5.0, 5.5, 5.75, 6.0, 6.5)):  # morphs
    add(pluck(note([62, 65, 69, 72, 74][i]), 0.5), tm, 0.3, pan=0.3 * (-1) ** i)
add(whoosh(0.25, up=False), 6.78, 0.3)
for i in range(16):                                 # tile flips
    add(tick(900 + i * 60, 0.025), 7.0 + i * 0.03, 0.09, pan=-0.8 + i * 0.1)
for i, tm in enumerate((7.5, 8.0, 8.5, 9.0)):       # metronome
    add(tick(1760 if i < 3 else 2640, 0.05), tm, 0.25)
add(kick(0.7, 90, 30), 9.0, 0.5)
add(whoosh(0.5), 10.5, 0.6)                          # stripe wipe
for i in range(40):                                  # odometers
    add(tick(3000 + (i % 3) * 400, 0.012), 11.25 + i * 0.02 * (1 + i / 40), 0.07, pan=((i % 3) - 1) * 0.6)

# --- riser → silence → impact
rt = t_(1.2); rs = np.sin(2 * np.pi * np.cumsum(200 + 1400 * (rt / 1.2) ** 2) / SR) * (rt / 1.2) ** 2
add(rs * 0.25 + whoosh(1.2) * 0.8, 11.05, 0.55)
L[int(12.28 * SR):int(12.5 * SR)] *= np.linspace(1, 0.0, int(12.5 * SR) - int(12.28 * SR))
R[int(12.28 * SR):int(12.5 * SR)] *= np.linspace(1, 0.0, int(12.5 * SR) - int(12.28 * SR))
it = t_(2.5); boom = np.sin(2 * np.pi * np.cumsum(30 + 90 * np.exp(-it * 6)) / SR) * np.exp(-it * 1.6)
noise = rng.standard_normal(len(it)); burst = lowpass(noise, 2500) * np.exp(-it * 5)
add(boom * 1.2 + burst * 0.6, 12.5, 1.0)
add(pad([note(50), note(57), note(62), note(65), note(69)], 2.5), 12.5, 0.35)
for i in range(9):                                   # letters landing
    add(pluck(note([62, 65, 69, 72, 74, 77, 81, 84, 86][i]), 0.5), 12.87 + i * 0.045, 0.14, pan=-0.6 + i * 0.15)
for i in range(37):                                  # typewriter
    add(tick(2200 + (i % 4) * 150, 0.015), 13.55 + i * 0.75 / 37, 0.06)

# --- simple reverb + master
ir_t = t_(1.1); ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 5.5); ir[0] = 0
def conv(x):
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
L = L + conv(L) * 0.035; R = R + conv(R) * 0.035
fade = np.clip((DUR - np.arange(N) / SR) / 0.35, 0, 1)
L *= fade; R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
L = np.tanh(L / peak * 1.4) / np.tanh(1.4); R = np.tanh(R / peak * 1.4) / np.tanh(1.4)
pcm = (np.stack([L, R], 1) * 0.89 * 32767).astype(np.int16)
with wave.open('soundtrack.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('soundtrack.wav', pcm.shape)
