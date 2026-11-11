/* Synth — deterministic offline music engine (pure JS, runs in browser and Node).
 * Everything is rendered sample-by-sample into a stereo 48 kHz buffer: no WebAudio needed.
 * See GUIDE.md for the composer-facing API. */
(function (root) {
  'use strict';
  const SR = 48000, TAU = Math.PI * 2;

  // ───────────────────────── utilities
  function rng(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midi(n) {
    if (typeof n === 'number') return n;
    const m = /^([A-Ga-g])([#b]*)(-?\d+)$/.exec(String(n).trim());
    if (!m) throw new Error('Synth: bad note "' + n + '"');
    let v = NOTE[m[1].toUpperCase()];
    for (const c of m[2]) v += c === '#' ? 1 : -1;
    return v + 12 * (parseInt(m[3], 10) + 1);
  }
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const freq = (n) => mtof(midi(n));
  const SCALES = {
    major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10], lydian: [0, 2, 4, 6, 7, 9, 11], mixolydian: [0, 2, 4, 5, 7, 9, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10], harmonic: [0, 2, 3, 5, 7, 8, 11], melodic: [0, 2, 3, 5, 7, 9, 11],
    pentatonic: [0, 2, 4, 7, 9], minorPent: [0, 3, 5, 7, 10], blues: [0, 3, 5, 6, 7, 10],
    whole: [0, 2, 4, 6, 8, 10], hirajoshi: [0, 2, 3, 7, 8], insen: [0, 1, 5, 7, 10], yo: [0, 2, 5, 7, 9],
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  };
  /** scale('D3','dorian',2) → midi numbers across N octaves (inclusive of top root) */
  function scale(rootNote, name, octaves) {
    const r = midi(rootNote), s = SCALES[name || 'major'];
    if (!s) throw new Error('Synth: unknown scale ' + name);
    const out = [];
    for (let o = 0; o < (octaves || 1); o++) for (const d of s) out.push(r + d + 12 * o);
    out.push(r + 12 * (octaves || 1));
    return out;
  }
  const CHORDS = {
    '': [0, 4, 7], maj: [0, 4, 7], M: [0, 4, 7], m: [0, 3, 7], min: [0, 3, 7], dim: [0, 3, 6], aug: [0, 4, 8],
    sus2: [0, 2, 7], sus4: [0, 5, 7], '5': [0, 7], '6': [0, 4, 7, 9], m6: [0, 3, 7, 9], '69': [0, 4, 7, 9, 14],
    '7': [0, 4, 7, 10], maj7: [0, 4, 7, 11], M7: [0, 4, 7, 11], m7: [0, 3, 7, 10], mMaj7: [0, 3, 7, 11],
    dim7: [0, 3, 6, 9], m7b5: [0, 3, 6, 10], '7sus4': [0, 5, 7, 10],
    '9': [0, 4, 7, 10, 14], maj9: [0, 4, 7, 11, 14], M9: [0, 4, 7, 11, 14], m9: [0, 3, 7, 10, 14],
    add9: [0, 4, 7, 14], madd9: [0, 3, 7, 14], '11': [0, 7, 10, 14, 17], m11: [0, 3, 7, 10, 14, 17],
    'maj7#11': [0, 4, 7, 11, 18], '13': [0, 4, 10, 14, 21], maj13: [0, 4, 11, 14, 21]
  };
  /** chord('Dm9', 3) → midi numbers. Supports slash bass: 'Fmaj7/A'. */
  function chord(sym, octave) {
    const m = /^([A-G][#b]?)([^/]*)(?:\/([A-G][#b]?))?$/.exec(sym);
    if (!m) throw new Error('Synth: bad chord "' + sym + '"');
    const q = CHORDS[m[2]];
    if (!q) throw new Error('Synth: unknown chord quality "' + m[2] + '" in ' + sym);
    const o = octave == null ? 3 : octave;
    const r = midi(m[1] + o);
    const out = q.map((d) => r + d);
    if (m[3]) { let b = midi(m[3] + o); while (b >= r) b -= 12; out.unshift(b); }
    return out;
  }

  // ───────────────────────── DSP primitives
  function adsr(n, a, d, s, r, hold) {
    const e = new Float32Array(n);
    const aS = Math.max(1, Math.round(a * SR));
    const dC = Math.exp(-1 / (Math.max(0.002, d) * SR / 4.6));
    const rC = Math.exp(-1 / (Math.max(0.002, r) * SR / 4.6));
    let v = 0;
    for (let i = 0; i < n; i++) {
      if (i < hold) { if (i < aS) v = i / aS; else v = s + (v - s) * dC; }
      else v *= rC;
      e[i] = v;
    }
    const f = Math.min(96, n);
    for (let i = 0; i < f; i++) e[n - 1 - i] *= i / f;
    return e;
  }
  function blep(t, dt) {
    if (t < dt) { t /= dt; return t + t - t * t - 1; }
    if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
    return 0;
  }
  /** In-place TPT state-variable filter. cutoff: Hz number or fn(tSec). type: 'lp'|'hp'|'bp' */
  function svf(buf, type, cutoff, q, t0) {
    const n = buf.length, k = 1 / Math.max(0.3, q || 0.707);
    const isFn = typeof cutoff === 'function';
    let ic1 = 0, ic2 = 0, a1 = 0, a2 = 0, a3 = 0;
    const set = (fc) => {
      const g = Math.tan(Math.PI * clamp(fc, 16, SR * 0.46) / SR);
      a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2;
    };
    set(isFn ? cutoff(t0 || 0) : cutoff);
    for (let i = 0; i < n; i++) {
      if (isFn && (i & 63) === 0) set(cutoff((t0 || 0) + i / SR));
      const x = buf[i], v3 = x - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3;
      ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
      buf[i] = type === 'lp' ? v2 : type === 'hp' ? x - k * v1 - v2 : v1;
    }
    return buf;
  }
  function panGains(p) { const a = (clamp(p, -1, 1) + 1) * Math.PI / 4; return [Math.cos(a) * Math.SQRT2, Math.sin(a) * Math.SQRT2]; }

  // ───────────────────────── engines. Each renders one note additively into T.L/T.R
  // n = { i0, f, dur (sec), vel, p (params), rand }

  function engSub(T, n) {
    const p = n.p, hold = Math.max(1, Math.round(n.dur * SR));
    const len = Math.min(T.L.length - n.i0, hold + Math.round(p.R * 5 / 4.6 * SR) + 96);
    if (len <= 0) return;
    const env = adsr(len, p.A, p.D, p.S, p.R, hold);
    const V = Math.max(1, p.voices | 0), ph = new Float64Array(V), inc = new Float64Array(V), gl = new Float32Array(V), gr = new Float32Array(V);
    for (let k = 0; k < V; k++) {
      const u = V > 1 ? (k / (V - 1)) * 2 - 1 : 0;
      inc[k] = n.f * Math.pow(2, (p.detune * u + (V > 1 ? (n.rand() - 0.5) * 3 : 0)) / 1200) / SR;
      ph[k] = n.rand();
      const g = panGains(u * p.spread); gl[k] = g[0] / Math.SQRT2; gr[k] = g[1] / Math.SQRT2;
    }
    const norm = 1 / Math.sqrt(V), wave = p.wave, pw = p.pw || 0.5;
    const k = 2 - 2 * clamp(p.res, 0, 0.97);
    let a1 = 0, a2 = 0, a3 = 0, l1 = 0, l2 = 0, r1 = 0, r2 = 0, pm = 1, subPh = 0;
    const subInc = n.f * 0.5 / SR, fAs = Math.max(1, p.fA * SR), fDk = 4.6 / Math.max(0.005, p.fD * SR);
    const base = p.cutoff * Math.pow(n.f / 261.6, p.keytrack) * (0.55 + 0.45 * n.vel);
    const vib = p.vibrato, pe = p.pitchEnv;
    const L = T.L, R = T.R, i0 = n.i0, amp = n.vel * p.gain * norm, drive = p.drive;
    for (let i = 0; i < len; i++) {
      if ((i & 15) === 0) {
        const fe = i < fAs ? i / fAs : Math.exp(-(i - fAs) * fDk);
        let fc = base * Math.pow(2, p.envAmt * fe);
        if (p.lfo) fc *= Math.pow(2, p.lfo.depth * Math.sin(TAU * p.lfo.rate * (n.i0 + i) / SR));
        const g = Math.tan(Math.PI * clamp(fc, 20, SR * 0.45) / SR);
        a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2;
        pm = 1;
        if (vib) { const t = i / SR, d = clamp((t - (vib.delay || 0)) / 0.4, 0, 1); pm *= Math.pow(2, vib.depth * d * Math.sin(TAU * vib.rate * t) / 1200); }
        if (pe) pm *= Math.pow(2, pe.amt * Math.exp(-i / (pe.time * SR)) / 12);
      }
      let l = 0, r = 0;
      for (let v = 0; v < V; v++) {
        const dt = inc[v] * pm; let x = ph[v] + dt; if (x >= 1) x -= 1; ph[v] = x;
        let s;
        if (wave === 'saw') s = 2 * x - 1 - blep(x, dt);
        else if (wave === 'square') { let y = x + (1 - pw); if (y >= 1) y -= 1; s = (x < pw ? 1 : -1) + blep(x, dt) - blep(y, dt); }
        else if (wave === 'tri') s = 4 * Math.abs(x - 0.5) - 1;
        else s = Math.sin(TAU * x);
        l += s * gl[v]; r += s * gr[v];
      }
      if (p.sub) { subPh += subInc * pm; const s = Math.sin(TAU * subPh) * p.sub / norm; l += s * 0.7071; r += s * 0.7071; }
      if (p.noise) { const s = (n.rand() * 2 - 1) * p.noise / norm; l += s; r += s; }
      // filter (lowpass)
      let v3 = l - l2, v1 = a1 * l1 + a2 * v3, v2 = l2 + a2 * l1 + a3 * v3; l1 = 2 * v1 - l1; l2 = 2 * v2 - l2; l = v2;
      v3 = r - r2; v1 = a1 * r1 + a2 * v3; v2 = r2 + a2 * r1 + a3 * v3; r1 = 2 * v1 - r1; r2 = 2 * v2 - r2; r = v2;
      if (drive) { l = Math.tanh(l * drive * norm) / norm; r = Math.tanh(r * drive * norm) / norm; }
      const e = env[i] * amp;
      L[i0 + i] += l * e; R[i0 + i] += r * e;
    }
  }

  function engFM(T, n) {
    const p = n.p, hold = Math.max(1, Math.round(n.dur * SR));
    const len = Math.min(T.L.length - n.i0, hold + Math.round(p.R * 5 / 4.6 * SR) + 96);
    if (len <= 0) return;
    const env = adsr(len, p.A, p.D, p.S, p.R, hold);
    const det = Math.pow(2, p.detune / 1200);
    const wc1 = TAU * n.f / det / SR, wc2 = TAU * n.f * det / SR, wm = TAU * n.f * p.ratio / SR;
    const idx0 = p.index * (0.4 + 0.6 * n.vel), iK = Math.exp(-1 / (Math.max(0.005, p.indexDecay) * SR / 4.6)), iS = p.indexSustain;
    let pc1 = 0, pc2 = 0, pmod = 0, ie = 1, prev = 0;
    const tine = p.tine, wt = tine ? TAU * n.f * tine.ratio / SR : 0, tK = tine ? Math.exp(-1 / (tine.decay * SR / 4.6)) : 0;
    let pt = 0, te = 1;
    const L = T.L, R = T.R, i0 = n.i0, amp = n.vel * p.gain, fb = p.feedback || 0;
    const tineOk = tine && n.f * tine.ratio < SR * 0.45;
    for (let i = 0; i < len; i++) {
      ie = iS + (ie - iS) * iK;
      pmod += wm; const m = Math.sin(pmod + fb * prev); prev = m;
      const mm = m * idx0 * ie;
      pc1 += wc1; pc2 += wc2;
      let a = Math.sin(pc1 + mm), b = Math.sin(pc2 + mm);
      if (tineOk) { pt += wt; te *= tK; const s = Math.sin(pt) * tine.level * te; a += s; b += s; }
      const e = env[i] * amp;
      L[i0 + i] += (a * 0.75 + b * 0.25) * e; R[i0 + i] += (b * 0.75 + a * 0.25) * e;
    }
  }

  /** Bank of damped sine resonators: pianos, mallets, bells. */
  function engAdd(T, n) {
    const p = n.p, hold = Math.max(1, Math.round(n.dur * SR));
    const T60 = p.decay * Math.pow(261.6 / n.f, p.decayKey);
    const total = p.ring ? Math.round(T60 * SR) : hold + Math.round(p.R * 5 / 4.6 * SR);
    const len = Math.min(T.L.length - n.i0, total + 96);
    if (len <= 0) return;
    const L = T.L, R = T.R, i0 = n.i0;
    const parts = p.partials, np = parts ? parts.length : p.n;
    const tmpL = new Float32Array(len), tmpR = new Float32Array(len);
    const bright = 0.5 + 0.5 * n.vel;
    for (let s = 0; s < (p.strings || 1); s++) {
      const det = p.strings > 1 ? Math.pow(2, ((s / (p.strings - 1)) * 2 - 1) * p.detune / 1200) : 1;
      const g = panGains(p.strings > 1 ? ((s / (p.strings - 1)) * 2 - 1) * p.spread : 0);
      for (let k = 1; k <= np; k++) {
        let ratio, a, dm;
        if (parts) { ratio = parts[k - 1][0]; a = parts[k - 1][1]; dm = parts[k - 1][2] || 1; }
        else { ratio = k * Math.sqrt(1 + p.inharm * k * k); a = Math.pow(k, -p.rolloff * (1.6 - bright)); dm = 1 / (1 + p.tilt * (k - 1)); if (p.odd && k % 2 === 0) a *= p.odd; }
        const f = n.f * ratio * det; if (f > SR * 0.45) continue;
        const w = TAU * f / SR, r = Math.exp(-6.9078 / (T60 * dm * SR));
        const c1 = 2 * r * Math.cos(w), c2 = r * r;
        let y1 = 0, y2 = -a * Math.sin(w) / r; // so y[0]=a*sin(0)… starts from zero crossing
        y1 = 0; y2 = -(a * Math.sin(w));
        const gL = g[0] * 0.7071, gR = g[1] * 0.7071;
        for (let i = 0; i < len; i++) { const y = c1 * y1 - c2 * y2; y2 = y1; y1 = y; tmpL[i] += y * gL; tmpR[i] += y * gR; }
      }
    }
    const aS = Math.max(1, Math.round(p.A * SR)), rC = Math.exp(-1 / (Math.max(0.005, p.R) * SR / 4.6));
    let rel = 1; const amp = n.vel * p.gain / Math.sqrt(p.strings || 1);
    const nz = p.strike || 0, nK = Math.exp(-1 / (0.012 * SR)); let ne = 1, nl = 0;
    for (let i = 0; i < len; i++) {
      let e = i < aS ? i / aS : 1;
      if (!p.ring && i >= hold) { rel *= rC; e *= rel; }
      if (i > len - 96) e *= (len - i) / 96;
      let x = 0; if (nz) { ne *= nK; nl += 0.35 * ((n.rand() * 2 - 1) - nl); x = nl * nz * ne; }
      L[i0 + i] += (tmpL[i] + x) * e * amp; R[i0 + i] += (tmpR[i] + x) * e * amp;
    }
  }

  /** Karplus–Strong plucked string. */
  function engKS(T, n) {
    const p = n.p;
    const T60 = p.decay * Math.pow(261.6 / n.f, 0.5);
    const hold = Math.round(n.dur * SR);
    const len = Math.min(T.L.length - n.i0, (p.ring ? Math.round(T60 * SR) : hold + Math.round(0.25 * SR)) + 96);
    if (len <= 0) return;
    const D = SR / n.f - 0.5 - p.damp * 0.5, N = Math.ceil(D) + 4;
    if (D < 2) return;
    const buf = new Float32Array(N);
    let lp = 0; const bc = clamp(p.bright * (0.5 + 0.5 * n.vel), 0.02, 1);
    for (let i = 0; i < Math.ceil(D); i++) { lp += bc * ((n.rand() * 2 - 1) - lp); buf[i] = lp; }
    let mean = 0; for (let i = 0; i < Math.ceil(D); i++) mean += buf[i]; mean /= Math.ceil(D);
    for (let i = 0; i < Math.ceil(D); i++) buf[i] -= mean;
    const g = Math.pow(10, -3 / (n.f * T60)), s = p.damp;
    let w = Math.ceil(D), prev = 0, rel = 1;
    const rC = Math.exp(-1 / (0.06 * SR)), L = T.L, R = T.R, i0 = n.i0, amp = n.vel * p.gain * (1.4 / Math.sqrt(bc));
    const pg = panGains(p.pan || 0);
    for (let i = 0; i < len; i++) {
      let rp = w - D; if (rp < 0) rp += N;
      const ri = rp | 0, fr = rp - ri, x = buf[ri % N] * (1 - fr) + buf[(ri + 1) % N] * fr;
      const y = ((1 - s) * x + s * 0.5 * (x + prev)) * g; prev = x;
      buf[w % N] = y; w = (w + 1) % N;
      let e = 1; if (!p.ring && i >= hold) { rel *= rC; e = rel; }
      if (i > len - 96) e *= (len - i) / 96;
      L[i0 + i] += y * e * amp * pg[0]; R[i0 + i] += y * e * amp * pg[1];
    }
  }

  // ── drums & sfx (all mono-centre unless noted)
  function noiseBuf(len, rand) { const b = new Float32Array(len); for (let i = 0; i < len; i++) b[i] = rand() * 2 - 1; return b; }
  function addMono(T, i0, buf, gain, pan) {
    const g = panGains(pan || 0), L = T.L, R = T.R, n = Math.min(buf.length, L.length - i0);
    for (let i = 0; i < n; i++) { const v = buf[i] * gain; L[i0 + i] += v * g[0] * 0.7071; R[i0 + i] += v * g[1] * 0.7071; }
  }
  function fadeTail(b, m) { const n = b.length, f = Math.min(m || 128, n); for (let i = 0; i < f; i++) b[n - 1 - i] *= i / f; return b; }

  const DRUM = {
    kick(T, n) {
      const p = n.p, len = Math.round((p.decay * 1.6 + 0.05) * SR), b = new Float32Array(len);
      let ph = 0; const f1 = p.f1 * (n.f ? n.f / 261.6 : 1);
      for (let i = 0; i < len; i++) {
        const t = i / SR, f = f1 + (p.f0 - f1) * Math.exp(-t / p.sweep);
        ph += TAU * f / SR;
        let v = Math.sin(ph) * Math.exp(-t * 4.6 / p.decay);
        v = Math.tanh(v * p.drive) / Math.tanh(p.drive);
        b[i] = v * Math.min(1, i / 24);
      }
      if (p.click) { const c = svf(noiseBuf(Math.round(0.006 * SR), n.rand), 'hp', 2500, 0.7); for (let i = 0; i < c.length; i++) b[i] += c[i] * p.click * (1 - i / c.length); }
      addMono(T, n.i0, fadeTail(b), n.vel * p.gain, 0);
    },
    snare(T, n) {
      const p = n.p, len = Math.round((p.decay * 1.5 + 0.05) * SR), b = new Float32Array(len);
      const nz = svf(svf(noiseBuf(len, n.rand), 'hp', p.hp, 0.8), 'lp', 9500, 0.7);
      let ph1 = 0, ph2 = 0;
      for (let i = 0; i < len; i++) {
        const t = i / SR, sweep = 1 + 0.6 * Math.exp(-t / 0.012);
        ph1 += TAU * p.tone * sweep / SR; ph2 += TAU * p.tone * 1.78 * sweep / SR;
        const body = (Math.sin(ph1) + 0.5 * Math.sin(ph2)) * Math.exp(-t * 4.6 / (p.decay * 0.45)) * p.body;
        b[i] = body + nz[i] * Math.exp(-t * 4.6 / p.decay) * p.snap;
      }
      addMono(T, n.i0, fadeTail(b), n.vel * p.gain, p.pan);
    },
    clap(T, n) {
      const p = n.p, len = Math.round((p.decay * 1.5 + 0.06) * SR);
      const nz = svf(svf(noiseBuf(len, n.rand), 'bp', p.freq, 1.4), 'hp', 500, 0.7), b = new Float32Array(len);
      for (let i = 0; i < len; i++) {
        const t = i / SR; let e = 0;
        for (let k = 0; k < 3; k++) { const d = t - k * 0.011; if (d >= 0) e = Math.max(e, Math.exp(-d / 0.004) * 0.8); }
        const d = t - 0.033; if (d >= 0) e = Math.max(e, Math.exp(-d * 4.6 / p.decay));
        b[i] = nz[i] * e * 2.2;
      }
      addMono(T, n.i0, fadeTail(b), n.vel * p.gain, p.pan);
    },
    hat(T, n) {
      const p = n.p, dec = n.p.decay * (n.dur > 0 && p.useDur ? n.dur : 1), len = Math.round((dec * 1.6 + 0.02) * SR), b = new Float32Array(len);
      const fr = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0], ph = fr.map(() => n.rand());
      for (let i = 0; i < len; i++) {
        let s = 0;
        for (let k = 0; k < 6; k++) { ph[k] += fr[k] * p.tune * 6.0 / SR; if (ph[k] >= 1) ph[k] -= 1; s += ph[k] < 0.5 ? 1 : -1; }
        b[i] = s / 6 * p.metal + (n.rand() * 2 - 1) * (1 - p.metal);
      }
      svf(svf(b, 'hp', p.hp, 0.9), 'hp', p.hp * 0.8, 0.7);
      for (let i = 0; i < len; i++) b[i] *= Math.exp(-(i / SR) * 4.6 / dec) * Math.min(1, i / 20);
      addMono(T, n.i0, fadeTail(b), n.vel * p.gain * 1.6, p.pan);
    },
    rim(T, n) {
      const p = n.p, len = Math.round(0.06 * SR), b = new Float32Array(len); let a = 0, c = 0;
      for (let i = 0; i < len; i++) { const t = i / SR; a += TAU * p.tone / SR; c += TAU * p.tone * 0.42 / SR; b[i] = (Math.sin(a) * Math.exp(-t / 0.006) + 0.6 * Math.sin(c) * Math.exp(-t / 0.012)) + (n.rand() * 2 - 1) * 0.3 * Math.exp(-t / 0.002); }
      addMono(T, n.i0, fadeTail(b), n.vel * p.gain, p.pan);
    },
    tom(T, n) {
      const p = n.p, len = Math.round((p.decay * 1.6) * SR), b = new Float32Array(len); let ph = 0; const f = n.f || p.tone;
      for (let i = 0; i < len; i++) { const t = i / SR; ph += TAU * f * (1 + 0.5 * Math.exp(-t / 0.03)) / SR; b[i] = Math.sin(ph) * Math.exp(-t * 4.6 / p.decay) * Math.min(1, i / 24); }
      addMono(T, n.i0, fadeTail(b), n.vel * p.gain, p.pan);
    },
    shaker(T, n) {
      const p = n.p, len = Math.round((p.decay * 2 + 0.03) * SR), b = svf(noiseBuf(len, n.rand), 'hp', p.hp, 0.8);
      const aS = 0.012 * SR;
      for (let i = 0; i < len; i++) b[i] *= (i < aS ? i / aS : Math.exp(-((i - aS) / SR) * 4.6 / p.decay));
      addMono(T, n.i0, fadeTail(b), n.vel * p.gain, p.pan);
    },
    cymbal(T, n) {
      const p = n.p, dec = p.decay, len = Math.round(dec * 1.3 * SR), b = new Float32Array(len);
      const fr = [317, 451, 563, 789, 911, 1123, 1407], ph = fr.map(() => n.rand());
      for (let i = 0; i < len; i++) {
        let s = 0; for (let k = 0; k < 7; k++) { ph[k] += fr[k] * p.tune * 4.7 / SR; if (ph[k] >= 1) ph[k] -= 1; s += ph[k] < 0.5 ? 1 : -1; }
        b[i] = s / 7 * 0.5 + (n.rand() * 2 - 1) * 0.6;
      }
      svf(b, 'hp', p.hp, 0.8);
      for (let i = 0; i < len; i++) { const t = i / SR; b[i] *= (0.55 * Math.exp(-t * 4.6 / (dec * 0.25)) + 0.45 * Math.exp(-t * 4.6 / dec)) * Math.min(1, i / 40); }
      addMono(T, n.i0, fadeTail(b, 2000), n.vel * p.gain, p.pan);
    },
    perc(T, n) {
      const p = n.p, len = Math.round(p.decay * 1.6 * SR), b = new Float32Array(len); let a = 0, c = 0; const f = n.f || p.tone;
      for (let i = 0; i < len; i++) { const t = i / SR; a += TAU * f / SR; c += TAU * f * p.ratio / SR; b[i] = (Math.sin(a) + 0.5 * Math.sin(c)) * Math.exp(-t * 4.6 / p.decay) * Math.min(1, i / 12); }
      addMono(T, n.i0, fadeTail(b), n.vel * p.gain, p.pan);
    },
    tick(T, n) {
      const p = n.p, len = Math.round(0.03 * SR), b = new Float32Array(len); let a = 0; const f = n.f || p.tone;
      for (let i = 0; i < len; i++) { const t = i / SR; a += TAU * f / SR; b[i] = Math.sin(a) * Math.exp(-t / p.decay) + (n.rand() * 2 - 1) * 0.5 * Math.exp(-t / 0.0007); }
      addMono(T, n.i0, fadeTail(b), n.vel * p.gain, p.pan);
    },
    /** cinematic low boom */
    impact(T, n) {
      const p = n.p, dec = Math.max(0.4, n.dur || p.decay), len = Math.min(T.L.length - n.i0, Math.round(dec * 1.4 * SR)); if (len <= 0) return;
      const b = new Float32Array(len), nz = svf(noiseBuf(len, n.rand), 'lp', p.lp, 0.7); let ph = 0;
      for (let i = 0; i < len; i++) {
        const t = i / SR, f = p.f1 + (p.f0 - p.f1) * Math.exp(-t / 0.09); ph += TAU * f / SR;
        b[i] = Math.tanh(Math.sin(ph) * 2.2) * 0.8 * Math.exp(-t * 4.6 / dec) + nz[i] * 1.6 * Math.exp(-t * 4.6 / (dec * 0.5)) + (n.rand() * 2 - 1) * 0.5 * Math.exp(-t / 0.004);
        b[i] *= Math.min(1, i / 16);
      }
      addMono(T, n.i0, fadeTail(b, 2000), n.vel * p.gain, 0);
    },
    /** filtered-noise sweep. shape: 'rise' (builds to the end), 'fall', 'swell' (peaks at p.peak) */
    sweep(T, n) {
      const p = n.p, len = Math.min(T.L.length - n.i0, Math.round(n.dur * SR)); if (len <= 0) return;
      const dur = len / SR, shape = p.shape, pk = p.peak;
      const pos = (t) => shape === 'rise' ? t / dur : shape === 'fall' ? 1 - t / dur : (t / dur < pk ? t / dur / pk : 1 - (t / dur - pk) / (1 - pk));
      const fc = (t) => p.f0 * Math.pow(p.f1 / p.f0, Math.pow(clamp(pos(t), 0, 1), p.curve));
      const a = svf(noiseBuf(len, n.rand), 'bp', fc, p.q), b2 = svf(noiseBuf(len, n.rand), 'bp', fc, p.q);
      const L = T.L, R = T.R, g = n.vel * p.gain * 2.4;
      let tph = 0;
      for (let i = 0; i < len; i++) {
        const t = i / SR, u = clamp(pos(t), 0, 1), e = Math.pow(u, p.power) * Math.min(1, i / 200) * Math.min(1, (len - i) / (shape === 'rise' ? 300 : 2000));
        let tone = 0; if (p.tone) { tph += TAU * fc(t) * 0.5 / SR; tone = Math.sin(tph) * p.tone; }
        const pn = p.panSweep ? (t / dur * 2 - 1) * p.panSweep : 0, pg = panGains(pn);
        L[n.i0 + i] += (a[i] * 0.8 + b2[i] * 0.2 + tone) * e * g * pg[0] * 0.7071;
        R[n.i0 + i] += (b2[i] * 0.8 + a[i] * 0.2 + tone) * e * g * pg[1] * 0.7071;
      }
    },
    /** continuous noise bed: room tone / wind / vinyl. dur = length */
    bed(T, n) {
      const p = n.p, len = Math.min(T.L.length - n.i0, Math.round(n.dur * SR)); if (len <= 0) return;
      const wander = (seed) => { const r1 = n.rand() * 6, r2 = n.rand() * 6; return (t) => p.freq * Math.pow(2, p.wander * (0.6 * Math.sin(t * 0.37 + r1) + 0.4 * Math.sin(t * 0.83 + r2))); };
      const a = svf(noiseBuf(len, n.rand), p.type, p.wander ? wander() : p.freq, p.q), b = svf(noiseBuf(len, n.rand), p.type, p.wander ? wander() : p.freq, p.q);
      const f = Math.min(len / 2, Math.round((p.fade || 1) * SR)), g = n.vel * p.gain, L = T.L, R = T.R;
      let cr = 0;
      for (let i = 0; i < len; i++) {
        const e = Math.min(1, i / f, (len - i) / f) * g;
        let c = 0; if (p.crackle) { if (n.rand() < p.crackle / SR * 30) cr = (n.rand() * 2 - 1); c = cr; cr *= 0.35; }
        L[n.i0 + i] += (a[i] + c) * e; R[n.i0 + i] += (b[i] + c * 0.8) * e;
      }
    }
  };

  // ───────────────────────── instrument presets
  const SUB = { engine: 'sub', wave: 'saw', voices: 1, detune: 0, spread: 0, sub: 0, noise: 0, A: 0.005, D: 0.2, S: 0.7, R: 0.2, cutoff: 3000, res: 0.1, envAmt: 0, fA: 0.002, fD: 0.25, keytrack: 0.3, drive: 0, gain: 0.5 };
  const FM = { engine: 'fm', ratio: 1, index: 2, indexDecay: 0.4, indexSustain: 0.15, feedback: 0, detune: 3, A: 0.003, D: 1.2, S: 0.0, R: 0.3, gain: 0.5 };
  const ADD = { engine: 'add', n: 12, rolloff: 1.4, inharm: 0.0004, tilt: 0.35, decay: 3.5, decayKey: 0.5, strings: 2, detune: 2.5, spread: 0.35, A: 0.002, R: 0.18, strike: 0.25, ring: false, gain: 0.4 };
  const KS = { engine: 'ks', decay: 3, damp: 0.5, bright: 0.6, ring: true, gain: 0.5 };
  const PRESETS = {
    // ── subtractive
    pad: { ...SUB, voices: 7, detune: 14, spread: 0.9, A: 0.9, D: 1.5, S: 0.8, R: 1.6, cutoff: 1400, res: 0.05, gain: 0.34 },
    warmpad: { ...SUB, wave: 'tri', voices: 5, detune: 9, spread: 0.8, A: 1.2, D: 2, S: 0.9, R: 2.2, cutoff: 900, sub: 0.3, gain: 0.5 },
    strings: { ...SUB, voices: 5, detune: 11, spread: 0.8, A: 0.35, D: 1, S: 0.85, R: 0.7, cutoff: 2600, vibrato: { rate: 5.2, depth: 9, delay: 0.25 }, gain: 0.34 },
    glasspad: { ...SUB, wave: 'square', pw: 0.3, voices: 5, detune: 8, spread: 1, A: 0.6, D: 2, S: 0.6, R: 2.4, cutoff: 5200, res: 0.2, gain: 0.26 },
    lead: { ...SUB, voices: 3, detune: 7, spread: 0.5, A: 0.01, D: 0.3, S: 0.7, R: 0.25, cutoff: 3600, envAmt: 1.2, fD: 0.3, res: 0.2, gain: 0.36 },
    softlead: { ...SUB, wave: 'tri', voices: 2, detune: 5, spread: 0.4, A: 0.03, D: 0.4, S: 0.7, R: 0.4, cutoff: 2400, vibrato: { rate: 5, depth: 7, delay: 0.3 }, gain: 0.55 },
    square: { ...SUB, wave: 'square', A: 0.004, D: 0.2, S: 0.6, R: 0.12, cutoff: 3800, gain: 0.3 },
    sine: { ...SUB, wave: 'sine', A: 0.01, D: 0.3, S: 0.8, R: 0.3, cutoff: 18000, keytrack: 0, gain: 0.5 },
    tri: { ...SUB, wave: 'tri', A: 0.006, D: 0.3, S: 0.7, R: 0.25, cutoff: 6000, gain: 0.5 },
    stab: { ...SUB, voices: 5, detune: 12, spread: 0.8, A: 0.003, D: 0.22, S: 0.0, R: 0.2, cutoff: 900, envAmt: 2.8, fD: 0.16, res: 0.25, gain: 0.36 },
    arp: { ...SUB, wave: 'square', pw: 0.35, voices: 2, detune: 6, spread: 0.6, A: 0.002, D: 0.16, S: 0.0, R: 0.16, cutoff: 1200, envAmt: 2.4, fD: 0.12, res: 0.3, gain: 0.36 },
    bass: { ...SUB, wave: 'saw', A: 0.004, D: 0.25, S: 0.6, R: 0.1, cutoff: 420, envAmt: 2.2, fD: 0.18, res: 0.2, sub: 0.6, keytrack: 0.1, gain: 0.46 },
    sub: { ...SUB, wave: 'sine', A: 0.012, D: 0.3, S: 0.9, R: 0.14, cutoff: 800, keytrack: 0, drive: 1.3, gain: 0.7 },
    reese: { ...SUB, voices: 3, detune: 22, spread: 0.3, A: 0.02, D: 0.4, S: 0.9, R: 0.2, cutoff: 520, res: 0.3, sub: 0.4, keytrack: 0.1, gain: 0.5 },
    acid: { ...SUB, wave: 'saw', A: 0.002, D: 0.2, S: 0.2, R: 0.08, cutoff: 340, envAmt: 3.6, fD: 0.14, res: 0.82, keytrack: 0.2, drive: 1.6, gain: 0.42 },
    organ: { ...SUB, wave: 'sine', voices: 1, sub: 0.6, A: 0.01, D: 0.1, S: 1, R: 0.12, cutoff: 9000, keytrack: 0, gain: 0.4 },
    flute: { ...SUB, wave: 'tri', noise: 0.05, A: 0.07, D: 0.3, S: 0.8, R: 0.25, cutoff: 2600, vibrato: { rate: 4.6, depth: 10, delay: 0.3 }, gain: 0.55 },
    // ── FM
    epiano: { ...FM, ratio: 1, index: 1.5, indexDecay: 0.5, indexSustain: 0.12, D: 2.4, tine: { ratio: 14, level: 0.07, decay: 0.12 }, gain: 0.5 },
    bell: { ...FM, ratio: 3.5, index: 3.2, indexDecay: 1.6, indexSustain: 0.05, D: 3.2, R: 1.6, detune: 4, gain: 0.3 },
    glass: { ...FM, ratio: 2, index: 1.1, indexDecay: 0.25, indexSustain: 0.05, D: 1.8, R: 1.2, detune: 5, gain: 0.4 },
    celesta: { ...FM, ratio: 4, index: 0.9, indexDecay: 0.2, indexSustain: 0.0, D: 1.2, R: 0.8, detune: 2, gain: 0.42 },
    kalimba: { ...FM, ratio: 5.4, index: 1.4, indexDecay: 0.05, indexSustain: 0.0, D: 0.9, R: 0.5, detune: 2, gain: 0.5 },
    fmbass: { ...FM, ratio: 1, index: 3.4, indexDecay: 0.14, indexSustain: 0.2, feedback: 0.2, D: 0.5, S: 0.5, R: 0.1, detune: 1, gain: 0.55 },
    // ── additive / resonator
    piano: { ...ADD },
    felt: { ...ADD, n: 8, rolloff: 2.1, decay: 2.6, strike: 0.5, A: 0.006, gain: 0.55 },
    marimba: { ...ADD, partials: [[1, 1, 1], [3.93, 0.28, 0.25], [9.2, 0.07, 0.1]], strings: 1, decay: 0.9, decayKey: 0.8, ring: true, strike: 0.3, gain: 0.6 },
    vibes: { ...ADD, partials: [[1, 1, 1], [4, 0.3, 0.4], [10, 0.08, 0.15]], strings: 2, detune: 1.5, decay: 3.4, decayKey: 0.4, ring: true, strike: 0.1, gain: 0.45 },
    musicbox: { ...ADD, partials: [[1, 1, 1], [3.01, 0.45, 0.5], [6.27, 0.3, 0.25], [10.6, 0.12, 0.12]], strings: 1, decay: 1.6, decayKey: 0.6, ring: true, strike: 0.15, gain: 0.4 },
    chime: { ...ADD, partials: [[1, 1, 1], [2.76, 0.6, 0.7], [5.4, 0.4, 0.5], [8.93, 0.25, 0.3], [13.34, 0.1, 0.2]], strings: 2, detune: 3, decay: 4.5, decayKey: 0.3, ring: true, strike: 0.08, gain: 0.28 },
    // ── plucked string
    pluck: { ...KS },
    harp: { ...KS, decay: 4, damp: 0.35, bright: 0.45 },
    guitar: { ...KS, decay: 2.6, damp: 0.6, bright: 0.75 },
    koto: { ...KS, decay: 1.8, damp: 0.3, bright: 0.95 },
    // ── drums
    kick: { engine: 'kick', f0: 165, f1: 47, sweep: 0.045, decay: 0.34, click: 0.5, drive: 1.6, gain: 0.95 },
    kick808: { engine: 'kick', f0: 130, f1: 43, sweep: 0.07, decay: 0.95, click: 0.25, drive: 2.2, gain: 0.9 },
    softkick: { engine: 'kick', f0: 110, f1: 50, sweep: 0.05, decay: 0.28, click: 0.08, drive: 1.1, gain: 0.85 },
    snare: { engine: 'snare', tone: 190, decay: 0.2, hp: 1600, body: 0.7, snap: 0.9, pan: 0, gain: 0.6 },
    brush: { engine: 'snare', tone: 210, decay: 0.16, hp: 2600, body: 0.15, snap: 0.6, pan: 0, gain: 0.7 },
    clap: { engine: 'clap', freq: 1250, decay: 0.2, pan: 0, gain: 0.55 },
    hat: { engine: 'hat', decay: 0.045, hp: 7200, tune: 1, metal: 0.6, pan: 0.15, gain: 0.5 },
    ohat: { engine: 'hat', decay: 0.32, hp: 6500, tune: 1, metal: 0.6, pan: 0.15, gain: 0.4 },
    rim: { engine: 'rim', tone: 1750, pan: -0.15, gain: 0.5 },
    tom: { engine: 'tom', tone: 110, decay: 0.32, pan: 0, gain: 0.7 },
    shaker: { engine: 'shaker', decay: 0.05, hp: 5200, pan: -0.25, gain: 0.45 },
    crash: { engine: 'cymbal', decay: 2.2, hp: 3800, tune: 1, pan: 0, gain: 0.42 },
    ride: { engine: 'cymbal', decay: 0.7, hp: 5200, tune: 1.3, pan: 0.3, gain: 0.45 },
    woodblock: { engine: 'perc', tone: 880, ratio: 1.51, decay: 0.07, pan: 0.2, gain: 0.5 },
    conga: { engine: 'perc', tone: 220, ratio: 1.6, decay: 0.2, pan: -0.2, gain: 0.6 },
    tick: { engine: 'tick', tone: 2400, decay: 0.004, pan: 0, gain: 0.4 },
    // ── sfx
    impact: { engine: 'impact', f0: 95, f1: 34, lp: 260, decay: 1.8, gain: 0.9 },
    riser: { engine: 'sweep', shape: 'rise', f0: 250, f1: 9000, q: 1.2, curve: 1.6, power: 2, peak: 1, tone: 0, panSweep: 0, gain: 0.3 },
    fall: { engine: 'sweep', shape: 'fall', f0: 180, f1: 7000, q: 1.2, curve: 1.4, power: 1.6, peak: 0, tone: 0, panSweep: 0, gain: 0.3 },
    whoosh: { engine: 'sweep', shape: 'swell', f0: 220, f1: 5200, q: 0.9, curve: 1.2, power: 2.2, peak: 0.55, tone: 0, panSweep: 0.8, gain: 0.34 },
    air: { engine: 'bed', type: 'lp', freq: 900, q: 0.6, wander: 0, fade: 1.5, crackle: 0, gain: 0.05 },
    wind: { engine: 'bed', type: 'bp', freq: 520, q: 1.6, wander: 0.9, fade: 2, crackle: 0, gain: 0.16 },
    vinyl: { engine: 'bed', type: 'hp', freq: 3200, q: 0.6, wander: 0, fade: 0.5, crackle: 1, gain: 0.012 }
  };
  const ENGINES = { sub: engSub, fm: engFM, add: engAdd, ks: engKS, ...DRUM, hat: DRUM.hat };
  const UNPITCHED = new Set(['kick', 'snare', 'clap', 'hat', 'rim', 'shaker', 'cymbal', 'tick', 'impact', 'sweep', 'bed']);

  // ───────────────────────── track fx
  function fxDelay(L, R, time, fb, mix, ping, lp) {
    const n = L.length, d = Math.max(1, Math.round(time * SR)), bl = new Float32Array(n), br = new Float32Array(n);
    const a = 1 - Math.exp(-TAU * (lp || 4500) / SR); let sl = 0, sr = 0;
    for (let i = 0; i < n; i++) {
      const dl = i >= d ? bl[i - d] : 0, dr = i >= d ? br[i - d] : 0;
      const xl = ping ? (L[i] + R[i]) * 0.5 + dr * fb : L[i] + dl * fb;
      const xr = ping ? dl * fb : R[i] + dr * fb;
      sl += a * (xl - sl); sr += a * (xr - sr); bl[i] = sl; br[i] = sr;
      L[i] += dl * mix; R[i] += dr * mix;
    }
  }
  function fxChorus(L, R, rate, depthMs, mix) {
    const n = L.length, dl = Float32Array.from(L), dr = Float32Array.from(R), base = 0.014 * SR, dep = depthMs * 0.001 * SR;
    for (let i = 0; i < n; i++) {
      const ph = TAU * rate * i / SR;
      let p = i - (base + dep * Math.sin(ph)); if (p >= 1) { const k = p | 0, f = p - k; L[i] = L[i] * (1 - mix * 0.5) + (dl[k] * (1 - f) + dl[k + 1] * f) * mix; }
      p = i - (base + dep * Math.sin(ph + 1.9)); if (p >= 1) { const k = p | 0, f = p - k; R[i] = R[i] * (1 - mix * 0.5) + (dr[k] * (1 - f) + dr[k + 1] * f) * mix; }
    }
  }
  /** 8-line feedback delay network with input diffusion. Returns wet {L,R}. */
  function reverb(inL, inR, o) {
    const n = inL.length, size = o.size, T60 = o.decay;
    const base = [1423, 1637, 1811, 2053, 2281, 2539, 2801, 3089].map((v) => Math.max(16, Math.round(v * size)));
    const lines = base.map((l) => new Float32Array(l)), idx = new Int32Array(8), g = base.map((l) => Math.pow(10, -3 * l / (SR * T60)));
    const dampFc = 13000 * Math.pow(1500 / 13000, clamp(o.damp, 0, 1)), dc = 1 - Math.exp(-TAU * dampFc / SR), st = new Float32Array(8);
    const apL = [142, 107, 379, 277], apR = [151, 113, 389, 283];
    const mk = (ls) => ls.map((l) => ({ b: new Float32Array(Math.round(l * Math.max(0.5, size))), i: 0 }));
    const dL = mk(apL), dR = mk(apR), ag = 0.62;
    const pre = Math.round((o.predelay || 0) * SR);
    const oL = new Float32Array(n), oR = new Float32Array(n), s = new Float32Array(8);
    for (let i = 0; i < n; i++) {
      let xl = i >= pre ? inL[i - pre] : 0, xr = i >= pre ? inR[i - pre] : 0;
      for (let k = 0; k < 4; k++) {
        let a = dL[k], d = a.b[a.i], v = xl + d * ag; a.b[a.i] = v; xl = d - v * ag; if (++a.i >= a.b.length) a.i = 0;
        a = dR[k]; d = a.b[a.i]; v = xr + d * ag; a.b[a.i] = v; xr = d - v * ag; if (++a.i >= a.b.length) a.i = 0;
      }
      let sum = 0;
      for (let k = 0; k < 8; k++) { const y = lines[k][idx[k]]; st[k] += dc * (y - st[k]); s[k] = st[k] * g[k]; sum += s[k]; }
      sum *= 0.25;
      for (let k = 0; k < 8; k++) { lines[k][idx[k]] = s[k] - sum + ((k & 1) ? xr : xl) * 0.5; if (++idx[k] >= base[k]) idx[k] = 0; }
      oL[i] = (s[0] - s[2] + s[4] - s[6]) * 0.5; oR[i] = (s[1] - s[3] + s[5] - s[7]) * 0.5;
    }
    svf(oL, 'hp', o.lowcut || 160, 0.7); svf(oR, 'hp', o.lowcut || 160, 0.7);
    return { L: oL, R: oR };
  }

  // ───────────────────────── score
  function Score(o) {
    o = o || {};
    this.bpm = o.bpm || 100; this.duration = o.duration || 16; this.meter = o.meter || 4;
    this.swing = o.swing || 0; this.swingUnit = o.swingUnit || 0.5; this.seed = o.seed || 1;
    this.len = Math.round(this.duration * SR);
    this.tracks = []; this.byName = {};
    this._master = { reverb: { size: 1, decay: 2.4, damp: 0.45, predelay: 0.012, mix: 1, lowcut: 160 }, saturate: 0.25, fadeIn: 0.01, fadeOut: 1.2, loudness: -18, ceiling: -1 };
    this.rand = rng(this.seed * 7919 + 13);
  }
  Score.prototype.sec = function (beat) {
    if (this.swing) { const u = this.swingUnit, r = ((beat % (2 * u)) + 2 * u) % (2 * u); if (Math.abs(r - u) < 1e-6) beat += this.swing * u; }
    return beat * 60 / this.bpm;
  };
  Score.prototype.b = function (sec) { return sec * this.bpm / 60; };
  Score.prototype.bar = function (n) { return n * this.meter; };
  Object.defineProperty(Score.prototype, 'beats', { get() { return this.duration * this.bpm / 60; } });
  Score.prototype.master = function (o) {
    for (const k in o) { if (k === 'reverb') Object.assign(this._master.reverb, o.reverb); else this._master[k] = o[k]; }
    return this;
  };
  Score.prototype.track = function (name, o) {
    if (typeof name === 'object') { o = name; name = o.name || ('t' + this.tracks.length); }
    o = o || {};
    const inst = typeof o.inst === 'object' ? o.inst : PRESETS[o.inst || name];
    if (!inst) throw new Error('Synth: unknown instrument "' + (o.inst || name) + '". Available: ' + Object.keys(PRESETS).join(', '));
    const t = new Track(this, name, Object.assign({}, inst, o.params || {}), o);
    this.tracks.push(t); this.byName[name] = t;
    return t;
  };

  function Track(score, name, p, o) {
    this.score = score; this.name = name; this.p = p; this.o = Object.assign({ gain: 1, pan: 0, reverb: 0.15, humanize: 0 }, o);
    this.notes = [];
  }
  /** note(beat, pitch, durBeats=1, vel=0.8, paramOverrides) */
  Track.prototype.note = function (beat, pitch, dur, vel, ov) {
    if (Array.isArray(pitch)) { for (const q of pitch) this.note(beat, q, dur, vel, ov); return this; }
    this.notes.push({ beat, pitch, dur: dur == null ? 1 : dur, vel: vel == null ? 0.8 : vel, ov });
    return this;
  };
  /** hit(beat, vel=0.9, durBeats, paramOverrides) — for drums & sfx */
  Track.prototype.hit = function (beat, vel, dur, ov) { this.notes.push({ beat, pitch: null, dur: dur == null ? 1 : dur, vel: vel == null ? 0.9 : vel, ov }); return this; };
  /** chord(beat, 'Dm9' | [pitches], durBeats, vel, {strum: beats, octave}) */
  Track.prototype.chord = function (beat, c, dur, vel, o) {
    o = o || {}; const ps = typeof c === 'string' ? chord(c, o.octave) : c;
    ps.forEach((q, i) => this.note(beat + i * (o.strum || 0), q, (dur == null ? 1 : dur) - i * (o.strum || 0), (vel == null ? 0.7 : vel) * (1 - 0.04 * i), o.params));
    return this;
  };
  /** seq(startBeat, stepBeats, [pitch | [pitches] | null | '-'], {gate, vel, vels}) — '-' extends the previous note */
  Track.prototype.seq = function (start, step, arr, o) {
    o = o || {}; const gate = o.gate == null ? 0.9 : o.gate;
    for (let i = 0; i < arr.length; i++) {
      const q = arr[i]; if (q == null || q === '-' || q === '.') continue;
      let k = 1; while (arr[i + k] === '-') k++;
      const v = o.vels ? o.vels[i % o.vels.length] : (o.vel == null ? 0.8 : o.vel);
      this.note(start + i * step, q, step * (k - 1 + gate), v, o.params);
    }
    return this;
  };
  /** pattern(startBeat, stepBeats, 'x..x..X.o', {vel, pitch, repeat, dur}) — x hit, X accent, o ghost */
  Track.prototype.pattern = function (start, step, pat, o) {
    o = o || {}; const s = pat.replace(/[\s|]/g, ''), rep = o.repeat || 1, v0 = o.vel == null ? 0.8 : o.vel;
    for (let r = 0; r < rep; r++) for (let i = 0; i < s.length; i++) {
      const c = s[i]; if (c !== 'x' && c !== 'X' && c !== 'o') continue;
      const v = c === 'X' ? Math.min(1, v0 * 1.25) : c === 'o' ? v0 * 0.45 : v0;
      this.notes.push({ beat: start + (r * s.length + i) * step, pitch: o.pitch == null ? null : o.pitch, dur: o.dur == null ? step : o.dur, vel: v, ov: o.params });
    }
    return this;
  };
  /** arp(startBeat, pitches, stepBeats, lengthBeats, {mode:'up'|'down'|'updown'|'random', octaves, gate, vel, accent}) */
  Track.prototype.arp = function (start, pitches, step, length, o) {
    o = o || {}; let ps = (typeof pitches === 'string' ? chord(pitches, o.octave) : pitches).map(midi);
    const base = ps.slice(); for (let k = 1; k < (o.octaves || 1); k++) ps = ps.concat(base.map((m) => m + 12 * k));
    if (o.mode === 'down') ps.reverse(); else if (o.mode === 'updown') ps = ps.concat(ps.slice(1, -1).reverse());
    const n = Math.round(length / step), r = rng(this.score.seed * 31 + this.notes.length + 7);
    for (let i = 0; i < n; i++) {
      const q = o.mode === 'random' ? ps[(r() * ps.length) | 0] : ps[i % ps.length];
      const acc = o.accent && i % o.accent === 0 ? 1.2 : 1;
      this.note(start + i * step, q, step * (o.gate == null ? 0.8 : o.gate), Math.min(1, (o.vel == null ? 0.7 : o.vel) * acc), o.params);
    }
    return this;
  };

  Track.prototype._render = function () {
    const S = this.score, n = S.len, T = { L: new Float32Array(n), R: new Float32Array(n) }, o = this.o;
    const eng = ENGINES[this.p.engine], unp = UNPITCHED.has(this.p.engine);
    const rand = rng(S.seed * 101 + this.name.length * 17 + this.name.charCodeAt(0));
    const ev = [];
    const sorted = this.notes.slice().sort((a, b) => a.beat - b.beat);
    for (const nt of sorted) {
      let t = S.sec(nt.beat), vel = nt.vel;
      if (o.humanize) { t += (rand() - 0.5) * 2 * o.humanize * 0.02; vel *= 1 - o.humanize * 0.25 * rand(); }
      if (t < 0) t = 0; if (t >= S.duration) continue;
      const dur = Math.max(0.005, S.sec(nt.beat + nt.dur) - S.sec(nt.beat));
      const m = nt.pitch == null ? null : midi(nt.pitch);
      const p = nt.ov ? Object.assign({}, this.p, nt.ov) : this.p;
      eng(T, { i0: Math.round(t * SR), f: m == null ? 0 : mtof(m), dur, vel: clamp(vel, 0, 1.2), p, rand });
      ev.push({ t, dur, midi: m, vel: nt.vel });
    }
    this.events = ev;
    // insert fx
    if (o.drive) { const d = o.drive, k = 1 / Math.tanh(d); for (let i = 0; i < n; i++) { T.L[i] = Math.tanh(T.L[i] * d) * k; T.R[i] = Math.tanh(T.R[i] * d) * k; } }
    if (o.highpass) { svf(T.L, 'hp', o.highpass, o.q); svf(T.R, 'hp', o.highpass, o.q); }
    if (o.lowpass) { svf(T.L, 'lp', o.lowpass, o.q); svf(T.R, 'lp', o.lowpass, o.q); }
    if (o.chorus) { const c = o.chorus === true ? {} : o.chorus; fxChorus(T.L, T.R, c.rate || 0.6, c.depth || 3, c.mix == null ? 0.5 : c.mix); }
    if (o.delay) { const d = o.delay === true ? {} : o.delay; fxDelay(T.L, T.R, (d.time == null ? 0.75 : d.time) * 60 / S.bpm, d.fb == null ? 0.38 : d.fb, d.mix == null ? 0.3 : d.mix, d.ping !== false, d.lp); }
    // gain / pan / ducking
    const gFn = typeof o.gain === 'function', pFn = typeof o.pan === 'function';
    let duck = null;
    if (o.duck) {
      const src = S.byName[o.duck.by || 'kick']; duck = new Float32Array(n).fill(1);
      if (src && src.events) {
        const depth = o.duck.depth == null ? 0.6 : o.duck.depth, rel = (o.duck.release || 0.28) * SR;
        for (const e of src.events) { const i0 = Math.round(e.t * SR), m = Math.min(n, i0 + Math.round(rel * 3)); for (let i = Math.max(0, i0 - 96); i < m; i++) { const g = i < i0 ? 1 - depth * (1 - (i0 - i) / 96) : 1 - depth * Math.exp(-(i - i0) / (rel * 0.45)); if (g < duck[i]) duck[i] = g; } }
      }
    }
    let g = gFn ? o.gain(0) : o.gain, pg = panGains(pFn ? o.pan(0) : o.pan);
    for (let i = 0; i < n; i++) {
      if ((i & 63) === 0) { if (gFn) g = o.gain(i / SR); if (pFn) pg = panGains(o.pan(i / SR)); }
      const d = duck ? duck[i] : 1;
      T.L[i] *= g * pg[0] * d; T.R[i] *= g * pg[1] * d;
    }
    return T;
  };

  Score.prototype.render = function () {
    const n = this.len, L = new Float32Array(n), R = new Float32Array(n), rl = new Float32Array(n), rr = new Float32Array(n), M = this._master;
    const events = {};
    // tracks used as duck sources must render first
    const order = this.tracks.slice().sort((a, b) => (a.o.duck ? 1 : 0) - (b.o.duck ? 1 : 0));
    for (const t of order) {
      const T = t._render(), send = t.o.reverb || 0;
      events[t.name] = t.events;
      for (let i = 0; i < n; i++) { L[i] += T.L[i]; R[i] += T.R[i]; if (send) { rl[i] += T.L[i] * send; rr[i] += T.R[i] * send; } }
    }
    if (M.reverb && M.reverb.mix > 0) { const w = reverb(rl, rr, M.reverb); for (let i = 0; i < n; i++) { L[i] += w.L[i] * M.reverb.mix; R[i] += w.R[i] * M.reverb.mix; } }
    svf(L, 'hp', 24, 0.7); svf(R, 'hp', 24, 0.7);
    // loudness: gated RMS → target, then saturate + lookahead limit
    const win = 4800; let acc = 0, cnt = 0, peak = 0;
    for (let i = 0; i + win <= n; i += win) { let s = 0; for (let j = i; j < i + win; j++) s += L[j] * L[j] + R[j] * R[j]; s /= 2 * win; if (s > 1e-6) { acc += s; cnt++; } }
    for (let i = 0; i < n; i++) { const a = Math.max(Math.abs(L[i]), Math.abs(R[i])); if (a > peak) peak = a; }
    const ceil = Math.pow(10, M.ceiling / 20);
    if (cnt && peak > 0) {
      const rms = Math.sqrt(acc / cnt); let gain = Math.pow(10, M.loudness / 20) / rms;
      gain = Math.min(gain, ceil * 1.9 / peak); // never ask the limiter for more than ~5.5 dB
      const d = M.saturate ? 1 + M.saturate : 0;
      for (let i = 0; i < n; i++) {
        let l = L[i] * gain, r = R[i] * gain;
        if (d) { l = Math.tanh(l * d) / d * (1 + M.saturate * 0.35); r = Math.tanh(r * d) / d * (1 + M.saturate * 0.35); }
        L[i] = l; R[i] = r;
      }
      limit(L, R, ceil);
    }
    const fi = Math.round(M.fadeIn * SR), fo = Math.round(M.fadeOut * SR);
    for (let i = 0; i < fi && i < n; i++) { L[i] *= i / fi; R[i] *= i / fi; }
    for (let i = 0; i < fo && i < n; i++) { const g = i / fo, c = g * g * (3 - 2 * g); L[n - 1 - i] *= c; R[n - 1 - i] *= c; }
    for (let i = 0; i < n; i++) { if (L[i] !== L[i]) L[i] = 0; if (R[i] !== R[i]) R[i] = 0; }
    return { L, R, sr: SR, duration: this.duration, bpm: this.bpm, meter: this.meter, events, analysis: analyse(L, R) };
  };

  function limit(L, R, ceil) {
    const n = L.length, W = 240, g = new Float32Array(n);
    for (let i = 0; i < n; i++) { const a = Math.max(Math.abs(L[i]), Math.abs(R[i])); g[i] = a > ceil ? ceil / a : 1; }
    // sliding min over [i, i+W] (monotonic deque)
    const gm = new Float32Array(n), dq = new Int32Array(n); let h = 0, t = 0;
    for (let i = 0, j = 0; i < n; i++) {
      for (; j < n && j <= i + W; j++) { while (t > h && g[dq[t - 1]] >= g[j]) t--; dq[t++] = j; }
      while (dq[h] < i) h++;
      gm[i] = g[dq[h]];
    }
    // release smoothing then box average over the past W samples
    const c = 1 - Math.exp(-1 / (0.09 * SR)); let r = 1;
    for (let i = 0; i < n; i++) { r = Math.min(gm[i], r + (1 - r) * c); gm[i] = r; }
    let acc = 0;
    for (let i = 0; i < n; i++) { acc += gm[i]; if (i >= W) acc -= gm[i - W]; const k = acc / Math.min(i + 1, W); L[i] *= k; R[i] *= k; }
  }

  /** per-video-frame (60 Hz) loudness curves, each normalised 0..1 */
  function analyse(L, R) {
    const n = L.length, hop = SR / 60, frames = Math.ceil(n / hop);
    const mono = new Float32Array(n); for (let i = 0; i < n; i++) mono[i] = (L[i] + R[i]) * 0.5;
    const low = svf(Float32Array.from(mono), 'lp', 140, 0.7), high = svf(Float32Array.from(mono), 'hp', 3500, 0.7);
    const mid = svf(svf(Float32Array.from(mono), 'hp', 250, 0.7), 'lp', 2500, 0.7);
    const out = {};
    for (const [name, b] of [['level', mono], ['low', low], ['mid', mid], ['high', high]]) {
      const a = new Float32Array(frames); let mx = 1e-9;
      for (let f = 0; f < frames; f++) { const i0 = Math.round(f * hop), i1 = Math.min(n, Math.round((f + 1) * hop) + 400); let s = 0; for (let i = i0; i < i1; i++) s += b[i] * b[i]; a[f] = Math.sqrt(s / Math.max(1, i1 - i0)); if (a[f] > mx) mx = a[f]; }
      let e = 0; for (let f = 0; f < frames; f++) { const v = a[f] / mx; e = v > e ? v : e + (v - e) * 0.25; a[f] = e; }
      out[name] = a;
    }
    return out;
  }

  /** 32-bit float stereo WAV */
  function wav(res) {
    const n = res.L.length, buf = new ArrayBuffer(44 + n * 8), v = new DataView(buf);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 8, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true);
    v.setUint16(20, 3, true); v.setUint16(22, 2, true); v.setUint32(24, res.sr, true); v.setUint32(28, res.sr * 8, true);
    v.setUint16(32, 8, true); v.setUint16(34, 32, true); w(36, 'data'); v.setUint32(40, n * 8, true);
    const f = new Float32Array(buf, 44, n * 2);
    for (let i = 0; i < n; i++) { f[2 * i] = res.L[i]; f[2 * i + 1] = res.R[i]; }
    return new Uint8Array(buf);
  }

  const Synth = {
    SR, score: (o) => new Score(o), midi, freq, mtof, scale, chord, rng, wav,
    presets: PRESETS, instruments: Object.keys(PRESETS), scales: SCALES
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Synth;
  root.Synth = Synth;
})(typeof globalThis !== 'undefined' ? globalThis : this);
