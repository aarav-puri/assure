'use client';

import { TickCircle } from 'iconsax-reactjs';
import { SpotlightCard } from '@/components/motion';

/**
 * One plan tile. Used by the landing page and the pricing page, and reads
 * everything from lib/plans.js so the two can never show different numbers.
 *
 * `available` is false for a plan nobody can buy yet; it shows a disabled
 * "Coming soon" button instead of a call to action that goes nowhere.
 */
export default function PlanCard({ plan, available = true, current = false, href = '/login', cta = 'Get started' }) {
  const isFree = plan.key === 'free';

  return (
    <SpotlightCard style={{
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{plan.name}</div>
        {(current || !available) && (
          <span style={{
            fontSize: 13, fontWeight: 500, padding: '3px 10px', borderRadius: 999,
            background: current ? 'var(--accent-soft)' : 'var(--cream-deep)',
            color: current ? 'var(--accent)' : 'var(--ink-3)',
          }}>
            {current ? 'Your plan' : 'Coming soon'}
          </span>
        )}
      </div>

      <div className="tnum" style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 48, fontWeight: 500, letterSpacing: '-0.05em', color: 'var(--ink)', lineHeight: 1 }}>{plan.price}</span>
        {plan.interval && <span style={{ fontSize: 15, color: 'var(--ink-3)' }}>per {plan.interval}</span>}
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 28 }}>
        {isFree || !available ? '\u00a0' : 'Billed monthly.'}
      </div>

      {available ? (
        <a href={href} className="btn btn-ink" style={{ width: '100%', marginBottom: 28 }}>{cta}</a>
      ) : (
        <div className="btn btn-line" aria-disabled="true" style={{ width: '100%', marginBottom: 28, color: 'var(--ink-3)', cursor: 'default' }}>Coming soon</div>
      )}

      <ul style={{ listStyle: 'none', display: 'grid', gap: 12, borderTop: '1px solid var(--line)', paddingTop: 24 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.45 }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0, lineHeight: 0, marginTop: 1 }}><TickCircle size={18} color="currentColor" /></span>
            <span className="tnum">{f}</span>
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
}
