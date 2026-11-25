'use client';

import { useEffect, useRef, useState } from 'react';
import { Add, SearchNormal1, Element3, RowVertical, ArrowDown2, Monitor, Home2, Headphone, MessageText1 } from 'iconsax-reactjs';
import { LogoMark } from '@/components/Logo';
import { DominoName } from '@/components/motion';

// A static, faithful rendering of the signed-in dashboard, drawn at a fixed
// design width and scaled to fit its container so it reads the same on every
// screen. Dates are relative to today so the countdowns are always believable.

const DESIGN_WIDTH = 1120;

// Dates are filled in after mount: the page is prerendered at build time, so
// computing them on the server would bake in the build date and mismatch.
export function useToday() {
  const [today, setToday] = useState(null);
  useEffect(() => { const d = new Date(); d.setHours(0, 0, 0, 0); setToday(d); }, []);
  return today;
}

function addDays(n, today) {
  if (!today) return '\u00a0';
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS = {
  active: { color: 'var(--ok)', label: 'Active' },
  expiring: { color: 'var(--warn)', label: 'Expiring' },
  expired: { color: 'var(--bad)', label: 'Expired' },
};

export const SAMPLE_WARRANTIES = [
  { name: 'Dyson V15 Detect', brand: 'Dyson', category: 'Appliances', Icon: Home2, days: 12, used: 97, status: 'expiring', price: '$749.99' },
  { name: 'MacBook Pro 14"', brand: 'Apple', category: 'Electronics', Icon: Monitor, days: 113, used: 69, status: 'active', price: '$1,999.00' },
  { name: 'Sony WH-1000XM5', brand: 'Sony', category: 'Electronics', Icon: Headphone, days: 353, used: 4, status: 'active', price: '$399.99' },
];

export function daysLabel(d) { return d < 0 ? `${Math.abs(d)}d ago` : `${d}d left`; }
export { addDays, STATUS };

function useFitScale(ref) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / DESIGN_WIDTH)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

const DESIGN_HEIGHT = 690;

export default function DashboardPreview() {
  const outer = useRef(null);
  const scale = useFitScale(outer);
  const today = useToday();

  const stats = [
    { label: 'Total', value: 24, color: 'var(--text)' },
    { label: 'Active', value: 19, color: 'var(--ok)' },
    { label: 'Expiring', value: 2, color: 'var(--warn)' },
    { label: 'Expired', value: 3, color: 'var(--bad)' },
  ];

  return (
    <div ref={outer} style={{ width: '100%', height: DESIGN_HEIGHT * scale, overflow: 'hidden' }} role="img" aria-label="The Assure dashboard, showing 24 warranties with countdowns to each expiry date">
      <div style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, position: 'relative', pointerEvents: 'none', userSelect: 'none' }}>
        {/* App nav */}
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <LogoMark size={24} />
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.03em' }}>Assure</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 999, padding: '4px 12px 4px 4px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(150deg, hsl(40,6%,96%), hsl(40,4%,62%))', color: '#0b0b0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>M</div>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Maya</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 28px 0' }}>
          {/* Greeting */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.035em' }}>Welcome back, <DominoName text="Maya" delay={1.2} /></div>
              <div className="tnum" style={{ fontSize: 14, color: 'var(--text-3)', marginTop: 4 }}>24 warranties tracked. 2 expiring soon.</div>
            </div>
            <div className="btn-primary"><Add size={16} color="currentColor" />Add warranty</div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 10 }}>{s.label}</div>
                <div className="tnum" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.04em', color: s.color, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: 11, color: 'var(--text-3)', lineHeight: 0 }}><SearchNormal1 size={16} color="currentColor" /></span>
              <div className="search-bar" style={{ color: 'var(--text-3)' }}>Search warranties</div>
            </div>
            <div className="search-bar" style={{ width: 190, paddingLeft: 16, color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Expiry, soonest first <ArrowDown2 size={14} color="currentColor" /></div>
            <div style={{ display: 'flex', gap: 4 }}>
              <div className="view-btn active"><Element3 size={16} color="currentColor" /></div>
              <div className="view-btn"><RowVertical size={16} color="currentColor" /></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {[['All', 24, true], ['Active', 19], ['Expiring', 2], ['Expired', 3]].map(([l, n, a]) => (
              <div key={l} className={`filter-pill${a ? ' active' : ''}`}>{l} <span className="tnum" style={{ opacity: 0.55, marginLeft: 4 }}>{n}</span></div>
            ))}
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {SAMPLE_WARRANTIES.map((w) => {
              const s = STATUS[w.status];
              return (
                <div key={w.name} className="warranty-card" style={{ padding: 0 }}>
                  <div style={{ padding: '18px 18px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <span className="tag"><w.Icon size={13} color="currentColor" />{w.category}</span>
                      <span className="status" style={{ color: s.color }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em' }}>{w.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2, marginBottom: 16 }}>{w.brand}</div>
                    <div className="progress-bar" style={{ marginBottom: 10 }}><div className="progress-fill" style={{ width: `${w.used}%`, background: s.color }} /></div>
                    <div className="tnum" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: 'var(--text-3)' }}>{addDays(w.days, today)}</span>
                      <span style={{ color: s.color, fontWeight: 500 }}>{daysLabel(w.days)}</span>
                    </div>
                  </div>
                  <div className="tnum" style={{ borderTop: '1px solid var(--border)', padding: '11px 18px', fontSize: 13, color: 'var(--text-3)' }}>{w.price}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Claim button */}
        <div style={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--text)', color: 'var(--bg)', borderRadius: 999, padding: '11px 18px', fontSize: 14, fontWeight: 500, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.6)' }}>
          <MessageText1 size={16} color="currentColor" />File a claim
        </div>
        {/* fade the bottom edge */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, background: 'linear-gradient(to bottom, rgba(11,11,10,0), var(--bg))' }} />
      </div>
    </div>
  );
}
