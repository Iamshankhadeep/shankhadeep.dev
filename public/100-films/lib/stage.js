/* Stage — deterministic 60 fps film runtime.
 * Load this FIRST (before any animation library): it virtualises performance.now / Date.now /
 * requestAnimationFrame and seeds Math.random so that every frame is a pure function of its index.
 * Live mode: open the html, click to play (music is synthesised in-page).
 * Capture mode (?capture): tools/render.mjs drives window.__stage.seek(i) and screenshots each frame. */
(function () {
  'use strict';
  const Q = new URLSearchParams(location.search);
  const CAPTURE = Q.has('capture');
  const TAU = Math.PI * 2;

  // ───────────────────────── virtual time
  const real = {
    raf: window.requestAnimationFrame.bind(window), now: performance.now.bind(performance),
    setTimeout: window.setTimeout.bind(window)
  };
  let vt = 0, rafQ = [], rafId = 0;
  const EPOCH = 1767225600000;
  performance.now = () => vt;
  Date.now = () => EPOCH + vt;
  window.requestAnimationFrame = (cb) => { rafQ.push([++rafId, cb]); return rafId; };
  window.cancelAnimationFrame = (id) => { rafQ = rafQ.filter((x) => x[0] !== id); };
  function flushRAF() { const q = rafQ; rafQ = []; for (const x of q) { try { x[1](vt); } catch (e) { console.error(e); } } }

  function mulberry(seed) {
    let a = (seed >>> 0) || 1;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  let _rand = mulberry(0xC0FFEE);
  Math.random = () => _rand();

  // ───────────────────────── math / easing
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
  const lerp = (a, b, t) => a + (b - a) * t;
  const map = (x, a, b, c, d, cl) => { let u = (x - a) / (b - a); if (cl !== false) u = clamp01(u); return c + (d - c) * u; };
  const smoothstep = (a, b, x) => { const u = clamp01((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  const fract = (x) => x - Math.floor(x);
  const mod = (x, m) => ((x % m) + m) % m;
  const E = {
    linear: (t) => t,
    inQuad: (t) => t * t, outQuad: (t) => 1 - (1 - t) * (1 - t), inOutQuad: (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    inCubic: (t) => t * t * t, outCubic: (t) => 1 - Math.pow(1 - t, 3), inOutCubic: (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    inQuart: (t) => t * t * t * t, outQuart: (t) => 1 - Math.pow(1 - t, 4), inOutQuart: (t) => t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
    inQuint: (t) => t * t * t * t * t, outQuint: (t) => 1 - Math.pow(1 - t, 5), inOutQuint: (t) => t < .5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,
    inExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * t - 10), outExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    inOutExpo: (t) => t === 0 ? 0 : t === 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
    inSine: (t) => 1 - Math.cos(t * Math.PI / 2), outSine: (t) => Math.sin(t * Math.PI / 2), inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    inCirc: (t) => 1 - Math.sqrt(1 - t * t), outCirc: (t) => Math.sqrt(1 - Math.pow(t - 1, 2)),
    inOutCirc: (t) => t < .5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,
    inBack: (t) => 2.70158 * t * t * t - 1.70158 * t * t, outBack: (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
    inOutBack: (t) => { const c = 2.5949095; return t < .5 ? (Math.pow(2 * t, 2) * ((c + 1) * 2 * t - c)) / 2 : (Math.pow(2 * t - 2, 2) * ((c + 1) * (t * 2 - 2) + c) + 2) / 2; },
    outElastic: (t) => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * TAU / 3) + 1,
    outBounce: (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; },
    /** CSS-style cubic-bezier → easing fn */
    bezier(x1, y1, x2, y2) {
      const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
      return (x) => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x; for (let i = 0; i < 8; i++) { const f = ((ax * t + bx) * t + cx) * t - x, d = (3 * ax * t + 2 * bx) * t + cx; if (Math.abs(f) < 1e-6 || d === 0) break; t -= f / d; } return ((ay * t + by) * t + cy) * t; };
    }
  };
  E.swift = E.bezier(0.65, 0, 0.15, 1);      // confident in-out, the house curve
  E.glide = E.bezier(0.16, 1, 0.3, 1);       // long settle
  E.snap = E.bezier(0.85, 0, 0.1, 1);
  /** normalised, clamped, eased progress of t through [start, start+dur] */
  const prog = (t, start, dur, ease) => { const u = clamp01((t - start) / dur); return ease ? ease(u) : u; };
  /** 0→1→0 window: rises over `a` from t0, holds, falls over `b` ending at t1 */
  const win = (t, t0, t1, a, b, ease) => { const e = ease || E.inOutCubic; return Math.min(e(clamp01((t - t0) / (a || 1e-6))), e(clamp01((t1 - t) / (b == null ? a || 1e-6 : b)))); };

  // ───────────────────────── simplex noise (seeded)
  function makeNoise(seed) {
    const r = mulberry(seed || 1337), p = new Uint8Array(256); for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) { const j = (r() * (i + 1)) | 0, t = p[i]; p[i] = p[j]; p[j] = t; }
    const perm = new Uint8Array(512), pm12 = new Uint8Array(512); for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm12[i] = perm[i] % 12; }
    const g3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]);
    const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
    function n2(x, y) {
      const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s), t = (i + j) * G2, x0 = x - i + t, y0 = y - j + t;
      const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1, x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2, ii = i & 255, jj = j & 255;
      let n = 0, a = 0.5 - x0 * x0 - y0 * y0, g;
      if (a > 0) { g = pm12[ii + perm[jj]] * 3; a *= a; n += a * a * (g3[g] * x0 + g3[g + 1] * y0); }
      a = 0.5 - x1 * x1 - y1 * y1; if (a > 0) { g = pm12[ii + i1 + perm[jj + j1]] * 3; a *= a; n += a * a * (g3[g] * x1 + g3[g + 1] * y1); }
      a = 0.5 - x2 * x2 - y2 * y2; if (a > 0) { g = pm12[ii + 1 + perm[jj + 1]] * 3; a *= a; n += a * a * (g3[g] * x2 + g3[g + 1] * y2); }
      return 70 * n;
    }
    function n3(x, y, z) {
      const s = (x + y + z) / 3, i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s), t = (i + j + k) / 6, x0 = x - i + t, y0 = y - j + t, z0 = z - k + t;
      let i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) { if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; } else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; } }
      else { if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; } else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; } else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } }
      const x1 = x0 - i1 + 1 / 6, y1 = y0 - j1 + 1 / 6, z1 = z0 - k1 + 1 / 6, x2 = x0 - i2 + 1 / 3, y2 = y0 - j2 + 1 / 3, z2 = z0 - k2 + 1 / 3, x3 = x0 - .5, y3 = y0 - .5, z3 = z0 - .5;
      const ii = i & 255, jj = j & 255, kk = k & 255; let n = 0, a, g;
      a = 0.6 - x0 * x0 - y0 * y0 - z0 * z0; if (a > 0) { g = pm12[ii + perm[jj + perm[kk]]] * 3; a *= a; n += a * a * (g3[g] * x0 + g3[g + 1] * y0 + g3[g + 2] * z0); }
      a = 0.6 - x1 * x1 - y1 * y1 - z1 * z1; if (a > 0) { g = pm12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3; a *= a; n += a * a * (g3[g] * x1 + g3[g + 1] * y1 + g3[g + 2] * z1); }
      a = 0.6 - x2 * x2 - y2 * y2 - z2 * z2; if (a > 0) { g = pm12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3; a *= a; n += a * a * (g3[g] * x2 + g3[g + 1] * y2 + g3[g + 2] * z2); }
      a = 0.6 - x3 * x3 - y3 * y3 - z3 * z3; if (a > 0) { g = pm12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3; a *= a; n += a * a * (g3[g] * x3 + g3[g + 1] * y3 + g3[g + 2] * z3); }
      return 32 * n;
    }
    const fbm2 = (x, y, oct, lac, gain) => { let a = 0.5, f = 1, s = 0, n = 0; for (let i = 0; i < (oct || 4); i++) { s += a * n2(x * f, y * f); n += a; a *= gain || 0.5; f *= lac || 2; } return s / n; };
    const fbm3 = (x, y, z, oct, lac, gain) => { let a = 0.5, f = 1, s = 0, n = 0; for (let i = 0; i < (oct || 4); i++) { s += a * n3(x * f, y * f, z * f); n += a; a *= gain || 0.5; f *= lac || 2; } return s / n; };
    /** divergence-free 2D flow from the noise potential. returns [vx, vy] */
    const curl2 = (x, y, z) => { const e = 0.01, a = n3(x, y + e, z || 0), b = n3(x, y - e, z || 0), c = n3(x + e, y, z || 0), d = n3(x - e, y, z || 0); return [(a - b) / (2 * e), -(c - d) / (2 * e)]; };
    return { noise2: n2, noise3: n3, fbm2, fbm3, curl2 };
  }

  // ───────────────────────── colour (OKLab mixing)
  function parseColor(c) {
    if (Array.isArray(c)) return c;
    if (c[0] === '#') { let h = c.slice(1); if (h.length === 3 || h.length === 4) h = h.split('').map((x) => x + x).join(''); const n = parseInt(h.slice(0, 6), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255, h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1]; }
    const m = c.match(/[\d.]+/g).map(Number); return [m[0] / 255, m[1] / 255, m[2] / 255, m[3] == null ? 1 : m[3]];
  }
  const s2l = (v) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4), l2s = (v) => v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  function toOk(c) { const r = s2l(c[0]), g = s2l(c[1]), b = s2l(c[2]); const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b); return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]; }
  function fromOk(o) { const l = Math.pow(o[0] + 0.3963377774 * o[1] + 0.2158037573 * o[2], 3), m = Math.pow(o[0] - 0.1055613458 * o[1] - 0.0638541728 * o[2], 3), s = Math.pow(o[0] - 0.0894841775 * o[1] - 1.291485548 * o[2], 3); return [clamp01(l2s(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)), clamp01(l2s(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)), clamp01(l2s(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s))]; }
  const Color = {
    parse: parseColor,
    /** rgb array 0..1 (+alpha) → css string */
    css(c, a) { const al = a == null ? (c[3] == null ? 1 : c[3]) : a; return 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + (+al.toFixed(4)) + ')'; },
    /** perceptual mix; returns rgb array 0..1 */
    mixRGB(a, b, t) { const A = parseColor(a), B = parseColor(b), x = toOk(A), y = toOk(B), o = fromOk([lerp(x[0], y[0], t), lerp(x[1], y[1], t), lerp(x[2], y[2], t)]); o.push(lerp(A[3] == null ? 1 : A[3], B[3] == null ? 1 : B[3], t)); return o; },
    mix(a, b, t) { return Color.css(Color.mixRGB(a, b, t)); },
    /** ramp(['#000','#f80','#fff']) → fn(t) → css; .rgb(t) → array */
    ramp(stops) { const cs = stops.map(parseColor), n = cs.length - 1; const rgb = (t) => { const u = clamp01(t) * n, i = Math.min(n - 1, Math.floor(u)); return Color.mixRGB(cs[i], cs[i + 1], u - i); }; const f = (t) => Color.css(rgb(t)); f.rgb = rgb; return f; },
    alpha(c, a) { return Color.css(parseColor(c), a); }
  };

  // ───────────────────────── stage object
  const Stage = window.Stage = {
    W: 1920, H: 1080, fps: 60, duration: 0, capture: CAPTURE, TAU,
    clamp, clamp01, lerp, map, smoothstep, fract, mod, ease: E, prog, win, color: Color,
    rng: mulberry, makeNoise, real,
    el: null, music: null, opts: null, frameIndex: -1, time: 0
  };
  Object.assign(Stage, makeNoise(1337));
  window.__ASSETS = window.__ASSETS || {};

  /** deterministic per-index random in [0,1): hash(i, salt) */
  Stage.hash = function (i, salt) { let h = Math.imul((i | 0) ^ 0x9E3779B9, 0x85EBCA6B) ^ Math.imul(((salt | 0) + 1) ^ 0xC2B2AE35, 0x27D4EB2F); h ^= h >>> 15; h = Math.imul(h, 0x2C1B3C6D); h ^= h >>> 12; h = Math.imul(h, 0x297A2D39); h ^= h >>> 15; return (h >>> 0) / 4294967296; };

  // ── music-sync helpers (valid after create() resolved its score)
  function evIndex(ev, t) { let lo = 0, hi = ev.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (ev[m].t <= t) { r = m; lo = m + 1; } else hi = m - 1; } return r; }
  /** envelope 1→0 following the most recent note of a track: exp decay (seconds), scaled by velocity */
  Stage.hit = function (track, t, decay, useVel) { const ev = Stage.music && Stage.music.events[track]; if (!ev || !ev.length) return 0; const i = evIndex(ev, t); if (i < 0) return 0; return Math.exp(-(t - ev[i].t) / (decay || 0.25)) * (useVel === false ? 1 : Math.min(1, ev[i].vel)); };
  /** number of notes a track has played up to time t (use for step-wise changes) and the last event */
  Stage.count = function (track, t) { const ev = Stage.music && Stage.music.events[track]; return ev ? evIndex(ev, t) + 1 : 0; };
  Stage.lastEvent = function (track, t) { const ev = Stage.music && Stage.music.events[track]; if (!ev) return null; const i = evIndex(ev, t); return i < 0 ? null : ev[i]; };
  Stage.events = function (track) { return (Stage.music && Stage.music.events[track]) || []; };
  /** beat clock: {beat (float), n (int), phase 0..1, bar, barPhase} */
  Stage.beat = function (t) { const m = Stage.music, b = t * (m ? m.bpm : 120) / 60, meter = m ? m.meter : 4; return { beat: b, n: Math.floor(b), phase: fract(b), bar: Math.floor(b / meter), barPhase: fract(b / meter) }; };
  const curve = (name) => function (t) { const a = Stage.music && Stage.music.analysis[name]; if (!a) return 0; const x = clamp(t * 60, 0, a.length - 1), i = Math.floor(x), f = x - i; return a[i] * (1 - f) + (a[Math.min(a.length - 1, i + 1)]) * f; };
  /** audio loudness curves of the rendered music, 0..1 */
  Stage.level = curve('level'); Stage.low = curve('low'); Stage.mid = curve('mid'); Stage.high = curve('high');

  // ── dom helpers
  function css(el, s) { Object.assign(el.style, s); return el; }
  function div(parent, s, cls) { const d = document.createElement('div'); if (cls) d.className = cls; css(d, s || {}); (parent || Stage.el).appendChild(d); return d; }
  Stage.div = div; Stage.css = css;
  /** full-stage canvas. opts: {dpr=1, z, parent, alpha, blend} → canvas (W*dpr × H*dpr backing, W×H css) */
  Stage.canvasEl = function (o) {
    o = o || {}; const c = document.createElement('canvas'), d = o.dpr || 1;
    c.width = Math.round((o.width || Stage.W) * d); c.height = Math.round((o.height || Stage.H) * d);
    css(c, { position: 'absolute', left: 0, top: 0, width: (o.width || Stage.W) + 'px', height: (o.height || Stage.H) + 'px', display: 'block' });
    if (o.z != null) c.style.zIndex = o.z; if (o.blend) c.style.mixBlendMode = o.blend;
    (o.parent || Stage.el).appendChild(c); return c;
  };
  /** 2D canvas → ctx (already scaled so you draw in 1920×1080 units). ctx.canvas is the element. */
  Stage.canvas2d = function (o) { o = o || {}; const c = Stage.canvasEl(o), x = c.getContext('2d', { alpha: o.alpha !== false, desynchronized: false }); const d = o.dpr || 1; if (d !== 1) x.scale(d, d); x.dpr = d; return x; };
  /** offscreen 2D buffer (not attached) */
  Stage.buffer = function (w, h) { const c = document.createElement('canvas'); c.width = w || Stage.W; c.height = h || Stage.H; return c.getContext('2d'); };
  /** split an element's text into inline-block spans. by: 'chars' | 'words' | 'lines' (lines = <br>-separated). returns spans */
  Stage.split = function (el, by) {
    const text = el.textContent, out = []; el.textContent = ''; el.setAttribute('aria-label', text);
    const mk = (s, parent) => { const sp = document.createElement('span'); sp.textContent = s; sp.style.display = 'inline-block'; sp.style.whiteSpace = 'pre'; sp.style.willChange = 'transform'; parent.appendChild(sp); return sp; };
    text.split(/(\s+)/).forEach((w) => {
      if (!w) return; if (/^\s+$/.test(w)) { el.appendChild(document.createTextNode(' ')); return; }
      if (by === 'words') out.push(mk(w, el));
      else { const ws = document.createElement('span'); ws.style.display = 'inline-block'; ws.style.whiteSpace = 'nowrap'; el.appendChild(ws); for (const ch of Array.from(w)) out.push(mk(ch, ws)); }
    });
    return out;
  };
  /** image registered by an assets/img/<name>.js file → Promise<HTMLImageElement> */
  Stage.image = function (name) { return new Promise((res, rej) => { const src = window.__ASSETS[name] || name; const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('Stage.image: cannot load ' + name)); im.src = src; }); };

  // ───────────────────────── WebGL2 fragment-shader helper
  const GLSL_LIB = `
#define PI 3.14159265359
#define TAU 6.28318530718
float hash11(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}
float hash21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec2 hash22(vec2 p){vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yzx+33.33);return fract((p3.xx+p3.yz)*p3.zy);}
vec3 hash33(vec3 p3){p3=fract(p3*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yxz+33.33);return fract((p3.xxy+p3.yxx)*p3.zyx);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*f*(f*(f*6.-15.)+10.);return mix(mix(hash21(i),hash21(i+vec2(1,0)),u.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),u.x),u.y);}
vec3 _m289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 _m289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 _perm(vec4 x){return _m289(((x*34.)+10.)*x);}
float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=_m289(i);vec4 p=_perm(_perm(_perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=1.79284291400159-.85373472095314*vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*snoise(p);p=p*2.02+vec3(13.1,7.7,3.3);a*=.5;}return s;}
float fbm(vec2 p){float a=.5,s=0.;mat2 m=mat2(.8,-.6,.6,.8);for(int i=0;i<5;i++){s+=a*vnoise(p);p=m*p*2.03+17.3;a*=.5;}return s;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec3 palette(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(TAU*(c*t+d));}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
vec3 toSRGB(vec3 c){return pow(max(c,0.),vec3(1./2.2));}
vec3 dither(vec2 fragCoord,float frame){return vec3((hash21(fragCoord+fract(frame*.618)*91.7)-.5)/255.*1.5);}
float sdCircle(vec2 p,float r){return length(p)-r;}
float sdBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.))+min(max(d.x,d.y),0.);}
float sdSeg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.,1.));}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
`;
  Stage.GLSL = GLSL_LIB;
  /** Stage.shader({frag, uniforms?, feedback?, init?, display?, steps?, scale?, z?}) → {draw(t, uniforms), reset(), gl, canvas}
   *  frag: GLSL ES 3.00 body. Provided: uTime, uRes (px), uFrame, vUv (0..1), out fragColor, plus the helper lib
   *  (hash11/21/22/33, vnoise, snoise, fbm, rot, palette, aces, toSRGB, dither, sdCircle/Box/Seg, smin).
   *  feedback:true → frag writes a float state buffer and can read `uPrev`; `display` frag reads `uState` to paint. */
  Stage.shader = function (o) {
    const canvas = o.canvas || Stage.canvasEl({ z: o.z, dpr: o.dpr || 1, parent: o.parent });
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: !!o.alpha, premultipliedAlpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    if (!gl) throw new Error('Stage.shader: WebGL2 unavailable');
    const W = canvas.width, H = canvas.height;
    const VS = '#version 300 es\nin vec2 p;out vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    const HEAD = '#version 300 es\nprecision highp float;precision highp int;\nuniform float uTime;uniform vec2 uRes;uniform int uFrame;uniform int uStep;in vec2 vUv;out vec4 fragColor;\n';
    function compile(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const log = gl.getShaderInfoLog(s); const lines = src.split('\n').map((l, i) => (i + 1) + ': ' + l).join('\n'); throw new Error('Shader compile error:\n' + log + '\n' + lines.slice(0, 6000)); } return s; }
    function program(frag, extra) {
      const pr = gl.createProgram(); gl.attachShader(pr, compile(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, HEAD + (extra || '') + GLSL_LIB + '\n#line 1\n' + frag));
      gl.bindAttribLocation(pr, 0, 'p'); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error('Shader link error: ' + gl.getProgramInfoLog(pr));
      return { pr, loc: {} };
    }
    const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const texCache = new Map();
    function texFor(src) {
      let e = texCache.get(src);
      if (!e) { e = { tex: gl.createTexture(), up: false }; texCache.set(src, e); gl.bindTexture(gl.TEXTURE_2D, e.tex); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, o.wrap === 'repeat' ? gl.REPEAT : gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, o.wrap === 'repeat' ? gl.REPEAT : gl.CLAMP_TO_EDGE); }
      if (!e.up || src instanceof HTMLCanvasElement) { gl.bindTexture(gl.TEXTURE_2D, e.tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); e.up = true; }
      return e.tex;
    }
    function setUniforms(P, u, unit) {
      for (const k in u) {
        const v = u[k]; let l = P.loc[k]; if (l === undefined) l = P.loc[k] = gl.getUniformLocation(P.pr, k); if (l === null) continue;
        if (typeof v === 'number') gl.uniform1f(l, v);
        else if (typeof v === 'boolean') gl.uniform1i(l, v ? 1 : 0);
        else if (v && v.int != null) gl.uniform1i(l, v.int);
        else if (v instanceof WebGLTexture) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, v); gl.uniform1i(l, unit++); }
        else if (v instanceof HTMLImageElement || v instanceof HTMLCanvasElement || (window.ImageBitmap && v instanceof ImageBitmap)) { const tx = texFor(v); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tx); gl.uniform1i(l, unit++); }
        else if (v.v4) gl.uniform4fv(l, v.v4); else if (v.v3) gl.uniform3fv(l, v.v3); else if (v.v2) gl.uniform2fv(l, v.v2);   // uniform arrays: {v4: Float32Array}
        else if (v.length === 2) gl.uniform2fv(l, v); else if (v.length === 3) gl.uniform3fv(l, v); else if (v.length === 4) gl.uniform4fv(l, v);
        else if (v.length === 9) gl.uniformMatrix3fv(l, false, v); else if (v.length === 16) gl.uniformMatrix4fv(l, false, v); else gl.uniform1fv(l, v);
      }
      return unit;
    }
    const main = program(o.frag, o.feedback ? 'uniform sampler2D uPrev;\n' : '');
    let fb = null, disp = null, initP = null, frameNo = 0;
    if (o.feedback) {
      const flt = !!gl.getExtension('EXT_color_buffer_float'); gl.getExtension('OES_texture_float_linear');
      const sw = Math.round(W * (o.scale || 1)), sh = Math.round(H * (o.scale || 1));
      const mk = () => { const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, flt ? gl.RGBA16F : gl.RGBA8, sw, sh, 0, gl.RGBA, flt ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); const wr = o.wrap === 'repeat' ? gl.REPEAT : gl.CLAMP_TO_EDGE; gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wr); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wr); const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0); return { tex, f }; };
      fb = { a: mk(), b: mk(), w: sw, h: sh };
      disp = program(o.display || 'void main(){fragColor=texture(uState,vUv);}', 'uniform sampler2D uState;\n');
      if (o.init) initP = program(o.init, 'uniform sampler2D uPrev;\n');
    }
    function pass(P, target, w, h, t, u, prevTex, stateTex, step) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target); gl.viewport(0, 0, w, h); gl.useProgram(P.pr);
      let unit = 0;
      const base = { uTime: t, uRes: [w, h], uFrame: { int: frameNo }, uStep: { int: step || 0 } };
      if (prevTex) base.uPrev = prevTex; if (stateTex) base.uState = stateTex;
      unit = setUniforms(P, base, unit); if (u) setUniforms(P, u, unit);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    let seeded = false;
    const api = {
      gl, canvas,
      reset() { seeded = false; frameNo = 0; if (fb) { for (const x of [fb.a, fb.b]) { gl.bindFramebuffer(gl.FRAMEBUFFER, x.f); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); } } },
      /** draw one frame. uniforms: numbers, arrays(2,3,4,9,16), {int:n}, images/canvases (canvases re-upload each draw) */
      draw(t, u) {
        const un = Object.assign({}, o.uniforms, u);
        if (fb) {
          if (!seeded) { api.reset(); seeded = true; if (initP) { pass(initP, fb.a.f, fb.w, fb.h, t, un, fb.b.tex, null, 0); } }
          const steps = (u && u.steps) || o.steps || 1;
          for (let s = 0; s < steps; s++) { pass(main, fb.b.f, fb.w, fb.h, t, un, fb.a.tex, null, s); const tmp = fb.a; fb.a = fb.b; fb.b = tmp; }
          pass(disp, null, W, H, t, un, null, fb.a.tex, 0);
        } else pass(main, null, W, H, t, un, null, null, 0);
        frameNo++;
      }
    };
    return api;
  };

  /** three.js boilerplate. Stage.three({fov, near, far, antialias, alpha, bloom:{strength,radius,threshold}, toneMapping, exposure, z})
   *  → {renderer, scene, camera, composer, bloom, render()} */
  Stage.three = function (o) {
    o = o || {}; const T = window.THREE; if (!T) throw new Error('Stage.three: include lib/vendor/three.js first');
    const canvas = Stage.canvasEl({ z: o.z });
    const renderer = new T.WebGLRenderer({ canvas, antialias: o.antialias !== false, alpha: !!o.alpha, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    renderer.setPixelRatio(1); renderer.setSize(Stage.W, Stage.H, false);
    renderer.toneMapping = o.toneMapping == null ? T.ACESFilmicToneMapping : o.toneMapping; renderer.toneMappingExposure = o.exposure || 1;
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(o.fov || 40, Stage.W / Stage.H, o.near || 0.1, o.far || 200);
    camera.position.set(0, 0, 8);
    let composer = null, bloom = null;
    if (o.bloom || o.composer) {
      const rt = new T.WebGLRenderTarget(Stage.W, Stage.H, { type: T.HalfFloatType, samples: o.antialias === false ? 0 : 4 });
      composer = new T.EffectComposer(renderer, rt); composer.setPixelRatio(1); composer.setSize(Stage.W, Stage.H);
      composer.addPass(new T.RenderPass(scene, camera));
      if (o.bloom) { const b = o.bloom === true ? {} : o.bloom; bloom = new T.UnrealBloomPass(new T.Vector2(Stage.W, Stage.H), b.strength == null ? 0.6 : b.strength, b.radius == null ? 0.6 : b.radius, b.threshold == null ? 0.8 : b.threshold); composer.addPass(bloom); }
      composer.addPass(new T.OutputPass());
    }
    return { renderer, scene, camera, composer, bloom, canvas, render() { if (composer) composer.render(1 / 60); else renderer.render(scene, camera); } };
  };

  // ───────────────────────── overlays
  let ov = {};
  function buildOverlays(o) {
    const top = div(Stage.el, { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9000 });
    if (o.vignette) ov.vig = div(top, { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,' + o.vignette + ') 115%)' });
    // slate — the series signature
    if (o.slate !== false) {
      const s = Object.assign({ at: 0.7, hold: 3.0, pos: 'bl', color: 'rgba(255,255,255,0.92)', end: false, margin: 72 }, o.slate || {});
      const m = s.margin, box = div(top, { position: 'absolute', color: s.color, fontFamily: '"JetBrains Mono Variable","JetBrains Mono",monospace', fontSize: '15px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, lineHeight: 1.0, whiteSpace: 'nowrap' });
      if (s.pos[0] === 'b') box.style.bottom = m + 'px'; else box.style.top = m + 'px';
      if (s.pos[1] === 'l') box.style.left = (m + 8) + 'px'; else if (s.pos[1] === 'r') { box.style.right = (m + 8) + 'px'; box.style.textAlign = 'right'; } else { box.style.left = '0'; box.style.right = '0'; box.style.textAlign = 'center'; }
      if (s.shadow) box.style.textShadow = s.shadow;
      const mkLine = (html, st) => { const mask = div(box, Object.assign({ overflow: 'hidden', padding: '5px 0' }, st || {})); const inner = div(mask, { display: 'inline-block', willChange: 'transform' }); inner.innerHTML = html; return inner; };
      const num = String(o.no == null ? 0 : o.no).padStart(3, '0');
      const l1 = mkLine('<span style="opacity:.55">N&ordm;&thinsp;' + num + '</span><span style="display:inline-block;width:34px;height:1px;background:currentColor;opacity:.5;vertical-align:middle;margin:0 16px 3px 14px"></span><span>' + (o.title || '') + '</span>');
      const l2 = o.subtitle ? mkLine('<span style="opacity:.55;font-size:12px;letter-spacing:.26em">' + o.subtitle + '</span>') : null;
      ov.slate = { s, box, lines: l2 ? [l1, l2] : [l1] };
    }
    if (o.grain && !(CAPTURE && Q.has('nograin'))) {
      const n = 256, c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'), id = x.createImageData(n, n), r = mulberry(99);
      for (let i = 0; i < n * n; i++) { const v = 128 + ((r() + r() + r() - 1.5) / 1.5) * 110; id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
      x.putImageData(id, 0, 0);
      ov.grain = div(top, { position: 'absolute', left: '-256px', top: '-256px', width: (Stage.W + 512) + 'px', height: (Stage.H + 512) + 'px', backgroundImage: 'url(' + c.toDataURL() + ')', backgroundSize: (o.grainSize || 256) + 'px', mixBlendMode: 'overlay', opacity: o.grain, willChange: 'transform' });
    }
    const f = o.fade === false ? null : Object.assign({ in: 0.6, out: 0.9, color: '#000' }, o.fade || {});
    if (f) { ov.fadeCfg = f; ov.fade = div(top, { position: 'absolute', inset: 0, background: f.inColor || f.color, opacity: 1 }); }
  }
  function updateOverlays(t, i) {
    if (ov.grain) { const a = Stage.hash(i, 11) * 256, b = Stage.hash(i, 23) * 256; ov.grain.style.transform = 'translate(' + a.toFixed(0) + 'px,' + b.toFixed(0) + 'px)'; }
    if (ov.fade) { const f = ov.fadeCfg, D = Stage.duration; let a = 0, col = f.inColor || f.color; if (f.in > 0 && t < f.in) a = 1 - E.outCubic(t / f.in); if (f.out > 0 && t > D - f.out) { a = E.inOutSine(clamp01((t - (D - f.out)) / (f.out - 1 / 60))); col = f.outColor || f.color; } if (ov.fadeCol !== col) { ov.fade.style.background = col; ov.fadeCol = col; } ov.fade.style.opacity = a; }
    if (ov.slate) {
      const { s, lines } = ov.slate, D = Stage.duration;
      lines.forEach((ln, k) => {
        const d = k * 0.09; let v = win(t, s.at + d, s.at + s.hold + d, 0.9, 0.7, E.outExpo), dir = t < s.at + s.hold / 2 ? 1 : -1;
        if (s.end) { const e0 = D - (s.end === true ? 3.4 : s.end); const v2 = prog(t, e0 + d, 0.9, E.outExpo); if (t > e0) { v = v2; dir = 1; } }
        ln.style.transform = 'translateY(' + ((1 - v) * 115 * dir).toFixed(2) + '%)'; ln.style.opacity = v < 0.001 ? 0 : 1;
      });
    }
  }

  // ───────────────────────── run loop
  let opts = null, cur = -1, stats = { n: 0, sum: 0, max: 0 };
  function step(i) {
    cur = i; vt = i * 1000 / Stage.fps; const t = i / Stage.fps; Stage.frameIndex = i; Stage.time = t;
    const t0 = real.now();
    flushRAF();
    if (document.getAnimations) { const an = document.getAnimations(); for (let k = 0; k < an.length; k++) { const a = an[k]; if (a.playState !== 'paused') a.pause(); a.currentTime = t * 1000; } }
    opts.frame(t, i, Stage);
    updateOverlays(t, i);
    const dt = real.now() - t0; stats.n++; stats.sum += dt; if (dt > stats.max) stats.max = dt;
  }
  function reset() {
    _rand = mulberry(0xBADC0DE); rafQ = [];
    if (opts.reset) opts.reset(Stage);
    cur = -1;
  }
  function goto(i) {
    i = clamp(i, 0, Stage.frames - 1);
    if (opts.stateful) { if (i <= cur) reset(); for (let k = cur + 1; k <= i; k++) step(k); }
    else step(i);
  }

  function b64(u8) { let s = ''; const C = 0x8000; for (let i = 0; i < u8.length; i += C) s += String.fromCharCode.apply(null, u8.subarray(i, i + C)); return btoa(s); }

  /** Stage.create(options) — see GUIDE.md */
  Stage.create = async function (o) {
    opts = Stage.opts = Object.assign({ fps: 60, width: 1920, height: 1080, background: '#000', grain: 0.05, vignette: 0, stateful: false }, o);
    Stage.W = opts.width; Stage.H = opts.height; Stage.fps = opts.fps; Stage.duration = opts.duration; Stage.frames = Math.round(opts.duration * opts.fps);
    const ready = {}; ready.p = new Promise((res, rej) => { ready.res = res; ready.rej = rej; });
    window.__stage = {
      ready: ready.p, capture: CAPTURE,
      info: () => ({ no: opts.no, title: opts.title, duration: Stage.duration, fps: Stage.fps, frames: Stage.frames, width: Stage.W, height: Stage.H, hasAudio: !!Stage.music, poster: opts.poster == null ? Stage.duration * 0.45 : opts.poster, stateful: !!opts.stateful, bpm: Stage.music ? Stage.music.bpm : null }),
      seek: async (i, settle) => { goto(i); if (settle) await new Promise((r) => real.raf(() => real.raf(() => r()))); return true; },
      stats: () => ({ avg: stats.sum / Math.max(1, stats.n), max: stats.max, n: stats.n }),
      audioChunks: () => { if (!Stage.music) return 0; const w = window.Synth.wav(Stage.music); window.__wav = w; return Math.ceil(w.length / 3000000); },
      audioChunk: (k) => b64(window.__wav.subarray(k * 3000000, Math.min(window.__wav.length, (k + 1) * 3000000)))
    };
    try {
      // base page
      const st = document.createElement('style');
      st.textContent = 'html,body{margin:0;height:100%;background:#000;overflow:hidden}#stage{position:absolute;left:0;top:0;width:' + Stage.W + 'px;height:' + Stage.H + 'px;overflow:hidden;transform-origin:0 0;contain:strict;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;font-kerning:normal}#stage *{box-sizing:border-box}';
      document.head.appendChild(st);
      let el = document.getElementById('stage'); if (!el) { el = document.createElement('div'); el.id = 'stage'; document.body.appendChild(el); }
      el.style.background = opts.background; Stage.el = el;
      // fonts
      const fl = ['500 15px "JetBrains Mono Variable"'].concat(opts.fonts || []);
      await Promise.all(fl.map((f) => document.fonts.load(f, 'AaBbÀé019 №º').catch(() => null)));
      await document.fonts.ready;
      for (const f of (opts.fonts || [])) if (!document.fonts.check(f)) console.warn('Stage: font not available → ' + f);
      // music
      if (opts.music) {
        if (!window.Synth) throw new Error('Stage: include lib/synth.js to use music');
        const M = opts.music(window.Synth, Stage);
        if (M) { if (Math.abs(M.duration - opts.duration) > 1e-6) { M.duration = opts.duration; M.len = Math.round(opts.duration * window.Synth.SR); } Stage.music = M.render(); }
      }
      _rand = mulberry(0xC0FFEE);
      if (opts.setup) await opts.setup(Stage);
      buildOverlays(opts);
      _rand = mulberry(0xBADC0DE);
      if (CAPTURE) {
        // warm-up: the first WebGL frame of a page can come out blank (programs/textures still initialising), so draw
        // frame 0 twice and let the compositor present once before the renderer starts asking for frames
        // (two rounds: some WebGL set-ups also drop the first frame drawn after the canvas has first been presented)
        for (let round = 0; round < 2; round++) {
          try { step(0); step(0); } catch (e) { console.error(e); }
          await new Promise((r) => real.raf(() => real.raf(() => r())));
          if (opts.stateful) reset();
        }
        if (opts.stateful) { reset(); } else cur = -1;
        stats = { n: 0, sum: 0, max: 0 };
        ready.res(true); return Stage;
      }
      live(); ready.res(true);
    } catch (e) { console.error('Stage.create failed: ' + (e && e.stack || e)); ready.rej(e); throw e; }
    return Stage;
  };

  // ───────────────────────── live playback (browser)
  function live() {
    const el = Stage.el, D = Stage.duration;
    const fit = () => { const s = Math.min(innerWidth / Stage.W, innerHeight / Stage.H); el.style.transform = 'translate(' + ((innerWidth - Stage.W * s) / 2) + 'px,' + ((innerHeight - Stage.H * s) / 2) + 'px) scale(' + s + ')'; };
    fit(); addEventListener('resize', fit);
    const ui = document.createElement('div');
    ui.innerHTML = '<div id="st-veil" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:22px;background:rgba(0,0,0,.42);color:#fff;font:500 13px \'JetBrains Mono Variable\',monospace;letter-spacing:.24em;text-transform:uppercase;cursor:pointer;z-index:10;transition:opacity .4s">'
      + '<div style="width:74px;height:74px;border:1px solid rgba(255,255,255,.7);border-radius:50%;display:flex;align-items:center;justify-content:center"><div style="width:0;height:0;border-left:16px solid #fff;border-top:10px solid transparent;border-bottom:10px solid transparent;margin-left:5px"></div></div>'
      + '<div>N&ordm;&thinsp;' + String(opts.no || 0).padStart(3, '0') + ' &mdash; ' + (opts.title || '') + '</div><div style="opacity:.5;font-size:11px">click or space to play &middot; R restarts</div></div>'
      + '<div style="position:fixed;left:0;bottom:0;height:2px;width:100%;background:rgba(255,255,255,.08);z-index:11"><div id="st-bar" style="height:100%;width:0;background:rgba(255,255,255,.7)"></div></div>';
    document.body.appendChild(ui);
    const veil = ui.querySelector('#st-veil'), bar = ui.querySelector('#st-bar');
    let ac = null, src = null, playing = false, offset = 0, t0 = 0, buffer = null;
    const clock = () => playing ? (ac ? ac.currentTime - t0 : (real.now() - t0) / 1000) + offset : offset;
    function startAudio() {
      if (!Stage.music) { t0 = real.now(); return; }
      if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: Stage.music.sr }); buffer = ac.createBuffer(2, Stage.music.L.length, Stage.music.sr); buffer.copyToChannel(Stage.music.L, 0); buffer.copyToChannel(Stage.music.R, 1); }
      src = ac.createBufferSource(); src.buffer = buffer; src.connect(ac.destination); ac.resume(); t0 = ac.currentTime + 0.03; src.start(t0, offset);
    }
    function stopAudio() { if (src) { try { src.stop(); } catch (e) { } src = null; } }
    function play() { if (playing) return; if (offset >= D - 0.02) { offset = 0; restart(); } playing = true; startAudio(); veil.style.opacity = 0; veil.style.pointerEvents = 'none'; }
    function pause() { if (!playing) return; offset = clamp(clock(), 0, D); playing = false; stopAudio(); veil.style.opacity = 1; veil.style.pointerEvents = 'auto'; }
    function restart() { if (opts.stateful && !opts.reset) { location.reload(); return; } reset(); }
    addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); } else if (e.key === 'r' || e.key === 'R') { const was = playing; pause(); offset = 0; restart(); goto(0); if (was) play(); } });
    veil.addEventListener('click', play); el.addEventListener('click', () => playing ? pause() : play());
    // poster frame behind the veil
    try { if (!opts.stateful) goto(Math.round(window.__stage.info().poster * Stage.fps)); else goto(0); } catch (e) { console.error(e); }
    (function tick() {
      real.raf(tick); if (!playing) return;
      const tt = clock(); if (tt < 0) return;
      if (tt >= D) { offset = D; playing = false; stopAudio(); veil.style.opacity = 1; veil.style.pointerEvents = 'auto'; bar.style.width = '100%'; return; }
      const target = Math.min(Stage.frames - 1, Math.floor(tt * Stage.fps));
      if (opts.stateful) { if (target < cur) reset(); let n = 0; while (cur < target && n < 4) { step(cur + 1); n++; } }
      else if (target !== cur) step(target);
      bar.style.width = (tt / D * 100).toFixed(2) + '%';
    })();
  }
})();
