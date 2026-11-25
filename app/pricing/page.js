'use client';

import { PLANS } from '@/lib/plans';
import PlanCard from '@/components/PlanCard';
import MeshGradient from '@/components/MeshGradient';
import { SiteNav, SiteFooter, useSessionUser } from '@/components/SiteChrome';
import { WordReveal } from '@/components/motion';

export default function PricingPage() {
  const user = useSessionUser();

  const faqs = [
    { q: 'What counts as a scan?', a: 'Each time Assure reads a receipt photo and fills in the warranty details for you.' },
    { q: 'What is a claim session?', a: `One conversation with the claim assistant about a single product, up to ${PLANS.free.limits.claimMessages} messages. Follow-up questions in the same conversation don’t use another session.` },
    { q: 'Is the Free plan really free?', a: 'Yes. It isn’t a trial and it doesn’t expire. Your receipt scans and claim sessions reset on the 1st of each month.' },
    { q: 'When does Assure+ launch?', a: 'It isn’t available to buy yet. Until then, the Free plan is the only plan.' },
  ];

  return (
    <div className="site">
      <SiteNav user={user} current="Pricing" />

      <header className="hero-shell" style={{ paddingBottom: 24 }}>
        <MeshGradient className="hero-gradient" />
        <div className="wrap hero-copy">
          <h1 className="display" style={{ fontSize: 'clamp(42px, 6vw, 76px)' }}><WordReveal text="Pricing" /></h1>
        </div>
      </header>

      <main className="wrap" style={{ paddingBottom: 120 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 760, margin: '48px auto 0' }}>
          <PlanCard plan={PLANS.free} current={!!user} href={user ? '/app' : '/login'} cta={user ? 'Open dashboard' : 'Get started free'} />
          <PlanCard plan={PLANS.plus} available={false} />
        </div>

        <div style={{ maxWidth: 760, margin: '96px auto 0', borderTop: '1px solid var(--line)' }}>
          {faqs.map(({ q, a }) => (
            <div key={q} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '8px 40px', padding: '28px 0', borderBottom: '1px solid var(--line)' }} className="faq-row">
              <h2 className="h3" style={{ fontSize: 17 }}>{q}</h2>
              <p className="body" style={{ color: 'var(--ink-2)' }}>{a}</p>
            </div>
          ))}
        </div>
      </main>

      <style>{`@media (max-width: 640px) { .faq-row { grid-template-columns: 1fr !important; } }`}</style>
      <SiteFooter />
    </div>
  );
}
