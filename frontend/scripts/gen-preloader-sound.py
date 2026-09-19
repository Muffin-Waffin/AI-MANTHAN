#!/usr/bin/env python3
"""Synthesizes the preloader chime (public/media/preloader-chime.wav).

No external audio asset — a short, royalty-free procedural sound:
a rising "churn" sweep (0-1.5s) resolving into a soft two-note bell
(1.4-2.6s) as the wordmark settles. Re-run after editing the params
below to regenerate the WAV.
"""
import math
import struct
import wave

SR = 44100


def env_adsr(t, dur, attack, release):
    if t < attack:
        return t / attack
    if t > dur - release:
        return max(0.0, (dur - t) / release)
    return 1.0


def render():
    dur = 2.6
    n = int(SR * dur)
    samples = [0.0] * n

    # 1) rising sweep 180Hz -> 760Hz, 0 -> 1.5s ("churn" build-up)
    sweep_dur = 1.5
    for i in range(int(SR * sweep_dur)):
        t = i / SR
        freq = 180 + (760 - 180) * (t / sweep_dur) ** 1.6
        phase = 2 * math.pi * freq * t
        amp = env_adsr(t, sweep_dur, 0.25, 0.5) * 0.22
        val = amp * (math.sin(phase) + 0.35 * math.sin(2 * phase))
        samples[i] += val

    # 2) soft two-note bell, 1.4s -> end (wordmark settle)
    bell_notes = [(660.0, 1.40), (880.0, 1.65)]
    for freq, start in bell_notes:
        bell_dur = 0.9
        start_i = int(SR * start)
        for i in range(int(SR * bell_dur)):
            idx = start_i + i
            if idx >= n:
                break
            t = i / SR
            decay = math.exp(-3.2 * t)
            val = 0.16 * decay * (math.sin(2 * math.pi * freq * t) + 0.5 * math.sin(2 * math.pi * freq * 2 * t))
            samples[idx] += val

    # normalize + soft clip
    peak = max(1e-6, max(abs(s) for s in samples))
    scale = min(1.0, 0.92 / peak)
    frames = bytearray()
    for s in samples:
        v = max(-1.0, min(1.0, s * scale))
        frames += struct.pack('<h', int(v * 32767))

    with wave.open('public/media/preloader-chime.wav', 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(frames))


if __name__ == '__main__':
    render()
    print('wrote public/media/preloader-chime.wav')
