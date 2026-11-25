'use client';

// Slow, soft mesh gradient with film grain. Adapted from the 21st.dev Shader
// Builder "Mesh drift" component (gradient-maru), recoloured to Assure's greyscale
// palette, cursor effect removed, and frozen to a single frame when the user
// prefers reduced motion. One WebGL canvas that fills its parent; if WebGL is
// unavailable the CSS fallback gradient behind it still shows.

import { useEffect, useRef } from 'react';

const VERT = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 u_colors[4];
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_grain;

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 srgbToLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 linearToSrgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }

vec3 shade(vec2 p, float t) {
  vec3 acc = srgbToLinear(u_colors[0]) * 0.2;
  float total = 0.2;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 c = vec2(
      sin(t * (0.21 + fi * 0.071) + fi * 2.4 + 1.0),
      cos(t * (0.17 + fi * 0.093) + fi * 1.7)) * 0.62;
    float w = exp(-dot(p - c, p - c) * 3.2);
    acc += srgbToLinear(u_colors[i]) * w;
    total += w;
  }
  return linearToSrgb(acc / total);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  p *= 1.15;
  p += 0.1 * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  vec3 col = shade(p, u_time);
  col += (grainHash(gl_FragCoord.xy) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

// Greyscale: a slow drift of charcoal and smoke over near-black.
const DEFAULT_COLORS = ['#080808', '#3a3a3a', '#1a1a1a', '#5c5c5c'];

export default function MeshGradient({ colors = DEFAULT_COLORS, grain = 0.07, speed = 0.35, className = '', style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    gl.uniform3fv(gl.getUniformLocation(program, 'u_colors'), new Float32Array(colors.slice(0, 4).flatMap(hex)));
    gl.uniform1f(gl.getUniformLocation(program, 'u_grain'), grain);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (now) => {
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 4.0 : 4.0 + ((now - start) / 1000) * speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const io = new IntersectionObserver(([e]) => { visible = e?.isIntersecting ?? true; if (visible) kick(); });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { draw(performance.now()); });
    ro.observe(canvas);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [colors, grain, speed]);

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background: `radial-gradient(60% 70% at 20% 20%, ${colors[1]}, transparent 70%), radial-gradient(50% 60% at 85% 30%, ${colors[2]}, transparent 70%), radial-gradient(60% 60% at 60% 90%, ${colors[3]}, transparent 70%), ${colors[0]}`,
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
