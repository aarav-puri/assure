'use client';

/**
 * Motion pieces ported from the Lumen project, recoloured to Assure's
 * monochrome palette. Everything settles to its final state when the visitor
 * prefers reduced motion.
 */
import { useEffect, useId, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

/* ---------- Hero headline: letters rise out of a blur, then a band of light
   moves through the last line, like light across brushed metal ---------- */

export function HeroHeadline({ lines }) {
  const reduce = useReducedMotion();
  const head = lines.slice(0, -1);
  const last = lines[lines.length - 1];
  let n = 0;
  const letters = (text) => text.split('').map((ch, ci) => {
    const i = n++;
    return (
      <motion.span
        key={ci}
        style={{ display: 'inline-block', whiteSpace: 'pre' }}
        initial={reduce ? false : { opacity: 0, y: '0.45em', filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.1 + i * 0.028, ease: EASE }}
      >
        {ch}
      </motion.span>
    );
  });
  const lastDelay = 0.1 + n * 0.028 + head.join('').length * 0;
  return (
    <span aria-label={lines.join(' ')} style={{ display: 'block' }}>
      {head.map((l, li) => <span key={li} aria-hidden="true" style={{ display: 'block' }}>{letters(l)}</span>)}
      <span aria-hidden="true" style={{ display: 'block' }}>
        <motion.span
          className="shine-text"
          initial={reduce ? false : { opacity: 0, y: '0.3em', filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: lastDelay, ease: EASE }}
        >
          {last}
        </motion.span>
      </span>
    </span>
  );
}

/* ---------- A name whose letters tip up one after another like dominoes,
   then settle into a polished highlight with a slow sweep of light ---------- */

export function DominoName({ text, delay = 0.35, step = 0.07 }) {
  const reduce = useReducedMotion();
  const [settled, setSettled] = useState(reduce);
  useEffect(() => {
    if (reduce) { setSettled(true); return; }
    setSettled(false);
    const total = (delay + text.length * step + 0.7) * 1000;
    const t = setTimeout(() => setSettled(true), total);
    return () => clearTimeout(t);
  }, [text, delay, step, reduce]);

  // Once every letter has landed, swap to one span so the highlight can run
  // across the whole name as a single gradient.
  if (settled) return <span className="shine-text shine-bright" aria-label={text}>{text}</span>;

  return (
    <span aria-label={text} style={{ display: 'inline-block', perspective: '600px' }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="domino-letter"
          style={{ display: 'inline-block', whiteSpace: 'pre', transformOrigin: '50% 100%' }}
          initial={{ rotateX: -95, opacity: 0, y: '0.08em' }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          transition={{ delay: delay + i * step, type: 'spring', stiffness: 260, damping: 14, mass: 0.7 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ---------- Words rise out of a blur one after another (on load) ---------- */

export function WordReveal({ text, delay = 0.1, step = 0.06 }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <span aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          initial={reduce ? false : { opacity: 0, y: '0.4em', filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: delay + i * step, ease: EASE }}
        >
          {w}{i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  );
}

/* ---------- Text that starts faint and lights up word by word as you scroll ---------- */

function ScrollWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

export function ScrollHighlight({ text, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.5'] });
  const words = text.split(' ');
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <ScrollWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w + (i < words.length - 1 ? ' ' : '')}
        </ScrollWord>
      ))}
    </span>
  );
}

/* ---------- Fade up out of a blur when scrolled into view ---------- */

export function Reveal({ children, index = 0, className, style }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 32, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- A card that tilts toward the cursor, with a light that follows it,
   a lit edge, and a slow light travelling round its border ---------- */

const TILT = 5; // degrees at the card's edge
const SPRING = { stiffness: 180, damping: 18, mass: 0.6 };

export function SpotlightCard({ children, className = '', style, lift = true, orbit = true, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const id = useId();
  // A stable per-card offset so the border lights do not all move in step.
  const offset = -([...id].reduce((n, c) => n + c.charCodeAt(0), 0) % 9);

  const rx = useSpring(0, SPRING);
  const ry = useSpring(0, SPRING);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    if (reduce || e.pointerType !== 'mouse') return;
    // Larger cards tilt less, so wide panels stay calm.
    const k = Math.min(1, 420 / Math.max(r.width, r.height));
    ry.set(((x / r.width) * 2 - 1) * TILT * k);
    rx.set(-((y / r.height) * 2 - 1) * TILT * k);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100, ...style }}
      whileHover={reduce || !lift ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`spotlight ${className}`}
      {...rest}
    >
      {children}
      <div aria-hidden="true" className="spotlight-fill" />
      {orbit && <div aria-hidden="true" className="spotlight-orbit" style={{ animationDelay: `${offset}s` }} />}
      <div aria-hidden="true" className="spotlight-edge" />
    </motion.div>
  );
}

/* ---------- Numbers that count up when they come into view ---------- */

export function NumberTicker({ target, from = 0, duration = 1.6, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(from);
  const text = useTransform(count, (v) => Math.round(v).toLocaleString('en-US'));
  useEffect(() => {
    if (!inView) return;
    if (reduce) { count.set(target); return; }
    const c = animate(count, target, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView, reduce, target, duration, count]);
  return <motion.span ref={ref} className={className} style={style}>{text}</motion.span>;
}

/* ---------- Typing text ---------- */

export function Typewriter({ text, onDone, speed = 38, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(text.length); onDone?.(); return; }
    let i = 0;
    let t;
    const tick = () => {
      i++;
      setN(i);
      if (i < text.length) t = setTimeout(tick, speed);
      else onDone?.();
    };
    t = setTimeout(tick, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {!reduce && n < text.length && <span aria-hidden="true" className="caret" />}
    </span>
  );
}

/* ---------- Gentle float ---------- */

export function Float({ children, className = '', style, distance = 8, duration = 5, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      animate={reduce ? undefined : { y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
