'use client';

import { useEffect, useRef } from 'react';

// Dot-grid voice visualizer for the claim assistant composer.
//
// recording:    columns of dots rise in a centred mountain that follows the
//               microphone level, and particles stream off the peak up-left
//               toward the text, as if the sound is turning into words.
// transcribing: the grid settles into a low, slow shimmer.
// idle:         the grid drains away and the canvas stops drawing.
//
// Reduced motion draws a still grid at a gentle height, with no particles.

const COL = 7;   // px between dot columns
const ROW = 6;   // px between dot rows

// Cheap stable noise in 0..1 so each dot twinkles without per-frame randomness.
const hash = (a, b, c) => {
  const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return x - Math.floor(x);
};

// `height` is the whole canvas (particles can rise through all of it);
// the dot grid only fills the bottom `gridHeight` pixels.
export default function VoiceWave({ analyser, mode, height = 96, gridHeight = 56 }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ levels: [], particles: [], t: 0 });
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bins = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    const s = stateRef.current;
    let raf = 0;
    let width = 0;
    let cols = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.floor(width / COL));
      if (s.levels.length !== cols) s.levels = new Array(cols).fill(0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Overall loudness and a per-column spectrum shape, both 0..1.
    const sample = () => {
      if (!analyser || !bins) return { loud: 0, shape: () => 0 };
      analyser.getByteFrequencyData(bins);
      const usable = Math.floor(bins.length * 0.6); // skip the mostly-empty top end
      let sum = 0;
      for (let i = 0; i < usable; i++) sum += bins[i];
      const loud = Math.min(1, (sum / usable / 255) * 2.4);
      // Mirror the spectrum around the centre so low frequencies form the peak.
      const shape = (c) => {
        const d = Math.abs(c / (cols - 1) - 0.5) * 2; // 0 at centre, 1 at edges
        const bin = Math.floor(d * (usable - 1));
        return bins[bin] / 255;
      };
      return { loud, shape };
    };

    const frame = () => {
      const m = modeRef.current;
      s.t += 1;
      ctx.clearRect(0, 0, width, height);

      const rows = Math.floor(Math.min(gridHeight, height) / ROW);
      const { loud, shape } = m === 'recording' && !reduce ? sample() : { loud: 0, shape: () => 0 };

      let alive = false;
      let peakX = width / 2;
      let peakH = 0;

      for (let c = 0; c < cols; c++) {
        const x = c * COL + COL / 2 + (width - cols * COL) / 2;
        const d = Math.abs(c / (cols - 1) - 0.5) * 2;
        const envelope = Math.exp(-d * d * 7.5); // mountain profile

        let target;
        if (reduce && m !== 'idle') target = 0.35 * envelope;
        else if (m === 'recording') target = envelope * (0.1 + loud * 1.2 + shape(c) * 0.3 * loud);
        else if (m === 'transcribing') target = envelope * (0.14 + 0.06 * Math.sin(s.t * 0.05 + c * 0.45));
        else target = 0;

        // Fast attack, slow release, so the shape breathes rather than flickers.
        const cur = s.levels[c];
        s.levels[c] = cur + (target - cur) * (target > cur ? 0.35 : 0.08);
        const level = Math.min(1, s.levels[c]);
        if (level > 0.005) alive = true;

        const lit = level * rows;
        if (lit > peakH) { peakH = lit; peakX = x; }

        for (let r = 0; r < rows; r++) {
          const y = height - r * ROW - ROW / 2;
          if (r < lit) {
            // Lit dots twinkle: a dithered mix of large bright beads, small
            // dots and pin-pricks, denser toward the base of each column.
            const depth = 1 - r / Math.max(lit, 1);
            const n = hash(c, r, Math.floor(s.t / 5));
            const size = n * 0.6 + depth * 0.5;
            const fade = Math.min(1, level * 4);
            if (size > 0.55) {
              ctx.fillStyle = `rgba(255,255,255,${(0.75 + 0.25 * n) * fade})`;
              ctx.beginPath();
              ctx.arc(x, y, 1.3 + (size - 0.55) * 3, 0, Math.PI * 2);
              ctx.fill();
            } else if (size > 0.25) {
              ctx.fillStyle = `rgba(255,255,255,${0.5 * fade})`;
              ctx.beginPath();
              ctx.arc(x, y, 0.9, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillStyle = `rgba(255,255,255,${0.3 * fade})`;
              ctx.fillRect(x - 0.5, y - 1.5, 1, 3); // the tiny vertical ticks in the grid
            }
          } else if (r < lit + 3 && level > 0.02) {
            // A faint fringe of pin-prick dots above the crest.
            ctx.fillStyle = `rgba(255,255,255,${0.16 * Math.min(1, level * 5)})`;
            ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
          } else if (r === 0) {
            // The resting baseline, always faintly visible while active.
            const n = hash(c, 0, Math.floor(s.t / 9));
            ctx.fillStyle = `rgba(255,255,255,${(m === 'idle' ? level : 0.14) * (n > 0.85 ? 4 : 1)})`;
            ctx.beginPath();
            ctx.arc(x, y, n > 0.85 ? 1.4 : 0.7, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Particles: spawned at the crest while speaking, streaming up and left.
      if (!reduce && m === 'recording' && loud > 0.12) {
        const n = Math.round(loud * 3);
        for (let i = 0; i < n; i++) {
          s.particles.push({
            x: peakX - Math.random() * 30,
            y: height - peakH * ROW + Math.random() * 6,
            vx: -(1.6 + Math.random() * 2.4),
            vy: -(0.5 + Math.random() * 0.9),
            life: 1,
          });
        }
      }
      s.particles = s.particles.filter((p) => p.life > 0 && p.x > -10 && p.y > -10);
      for (const p of s.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.985;
        p.life -= 0.012;
        const a = Math.max(0, p.life);
        // Short motion trail, then a bright head.
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (s.particles.length) alive = true;

      if (m !== 'idle' || alive) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [analyser, mode, height, gridHeight]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height, pointerEvents: 'none', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.35))' }}
    />
  );
}
