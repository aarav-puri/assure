// The Assure mark: a brushed-metal 3D "A" split into two leaning slabs,
// generated with ChatGPT. brand/logo-transparent.png is the transparent
// master, brand/logo-master.png the version on a dark background, and
// public/logo-mark.png a small transparent crop for navs and UI.

export function LogoMark({ size = 22, title, style }) {
  return (
    <img
      src="/logo-mark.png"
      width={size}
      height={size}
      alt={title || ''}
      aria-hidden={title ? undefined : true}
      style={{ display: 'block', flexShrink: 0, objectFit: 'contain', ...style }}
    />
  );
}

/** Mark plus wordmark, for navs. */
export default function Logo({ size = 22, gap = 9, fontSize = 17, color = 'currentColor' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap, color }}>
      <LogoMark size={size} />
      <span style={{ fontSize, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>Assure</span>
    </span>
  );
}
