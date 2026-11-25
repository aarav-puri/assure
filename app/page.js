'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, SearchNormal1, Calendar, Element3, Lock1, ShieldTick, Trash, ScanBarcode, Send2 } from 'iconsax-reactjs';
import { PLANS } from '@/lib/plans';
import PlanCard from '@/components/PlanCard';
import MeshGradient from '@/components/MeshGradient';
import DashboardPreview, { SAMPLE_WARRANTIES, STATUS, addDays, useToday } from '@/components/DashboardPreview';
import { SiteNav, SiteFooter, useSessionUser } from '@/components/SiteChrome';
import { HeroHeadline, ScrollHighlight, SpotlightCard, NumberTicker, Typewriter, Float } from '@/components/motion';

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .reveal-line').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Feature vignettes: small, real pieces of the product ─────────────────── */

function CountdownVignette() {
  const today = useToday();
  return (
    <div className="reveal reveal-d1"><SpotlightCard className="paper" style={{ padding: 8 }}>
      {SAMPLE_WARRANTIES.map((w, i) => {
        const s = STATUS[w.status];
        return (
          <div key={w.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px 16px', padding: '20px 20px 22px', borderTop: i ? '1px solid var(--line)' : 0 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em' }}>{w.name}</div>
              <div className="tnum" style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 2 }}>Expires {addDays(w.days, today)}</div>
            </div>
            <div className="tnum" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1.1, color: w.status === 'expiring' ? 'var(--warn)' : 'var(--ink)' }}><NumberTicker target={w.days} /></div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>days left</div>
            </div>
            <div style={{ gridColumn: '1 / -1', height: 4, borderRadius: 2, background: 'var(--cream-deep)', overflow: 'hidden', marginTop: 10 }}>
              <div style={{ width: `${w.used}%`, height: '100%', borderRadius: 2, background: w.status === 'expiring' ? s.color : 'var(--accent)' }} />
            </div>
          </div>
        );
      })}
    </SpotlightCard></div>
  );
}

function ScanVignette() {
  const fields = [
    ['Product', 'MacBook Pro 14"'],
    ['Brand', 'Apple'],
    ['Purchased', 'Mar 17, 2026'],
    ['Price', '$1,999.00'],
    ['Retailer', 'Best Buy'],
  ];
  return (
    <div className="reveal reveal-d1 scan-grid">
      {/* the receipt */}
      <Float distance={7} duration={6}><div aria-hidden="true" style={{ background: '#fff', borderRadius: 6, padding: '22px 18px 26px', boxShadow: '0 30px 60px -30px rgba(0,0,0,0.9)', transform: 'rotate(-2.5deg)', fontSize: 12, color: '#4a4741', lineHeight: 1.7 }}>
        <div style={{ textAlign: 'center', fontWeight: 600, letterSpacing: '0.02em', color: '#161513', fontSize: 14 }}>BEST BUY</div>
        <div style={{ textAlign: 'center', marginBottom: 14, color: '#7c786f' }}>Store 0412 · 03/17/2026</div>
        <div className="tnum" style={{ display: 'flex', justifyContent: 'space-between' }}><span>APPLE MBP 14 M5</span><span>1,999.00</span></div>
        <div className="tnum" style={{ display: 'flex', justifyContent: 'space-between', color: '#7c786f' }}><span>SN C02XK1ZJMD6T</span></div>
        <div style={{ borderTop: '1px dashed rgba(0,0,0,0.2)', margin: '12px 0' }} />
        <div className="tnum" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#161513' }}><span>TOTAL</span><span>1,999.00</span></div>
      </div></Float>
      {/* what Assure fills in */}
      <SpotlightCard className="paper" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--accent)', fontWeight: 500, marginBottom: 14 }}>
          <ScanBarcode size={16} color="currentColor" /> Filled in from your receipt
        </div>
        {fields.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderTop: '1px solid var(--line)', fontSize: 14 }}>
            <span style={{ color: 'var(--ink-3)' }}>{k}</span>
            <span className="tnum" style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </SpotlightCard>
    </div>
  );
}

function ClaimVignette() {
  const today = useToday();
  const bubble = (mine) => ({
    maxWidth: '84%', padding: '12px 15px', borderRadius: 16, fontSize: 14.5, lineHeight: 1.5,
    alignSelf: mine ? 'flex-end' : 'flex-start',
    background: mine ? 'var(--ink)' : 'var(--cream-deep)',
    color: mine ? 'var(--cream)' : 'var(--ink)',
    borderBottomRightRadius: mine ? 6 : 16,
    borderBottomLeftRadius: mine ? 16 : 6,
  });
  return (
    <div className="reveal reveal-d1"><SpotlightCard className="paper" style={{ padding: 0 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Dyson V15 Detect</div>
          <div className="tnum" style={{ fontSize: 13, color: 'var(--ink-3)' }}>Covered until {addDays(12, today)}</div>
        </div>
        <span className="status" style={{ color: 'var(--warn)' }}>12 days left</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20 }}>
        <div style={bubble(true)}><Typewriter text="The battery dies after five minutes. Is that covered?" /></div>
        <div style={bubble(false)}>
          Most likely. A battery failing under normal use is a defect, and your warranty runs for 12 more days. Before you contact Dyson, gather:
          <div style={{ marginTop: 8, display: 'grid', gap: 4 }}>
            <span>· Your receipt, which is already saved</span>
            <span>· The serial number from under the bin</span>
            <span>· A short video showing the cutout</span>
          </div>
        </div>
        <div style={bubble(true)}>Can you write the claim email?</div>
      </div>
      <div style={{ margin: '0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--line)', borderRadius: 999, padding: '8px 8px 8px 16px', fontSize: 14, color: 'var(--ink-3)' }}>
        Ask about this warranty
        <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: 'var(--cream)', display: 'grid', placeItems: 'center' }}><Send2 size={16} color="currentColor" /></span>
      </div>
    </SpotlightCard></div>
  );
}

/* Brushed-metal products floating around the headline (generated with ChatGPT).
   The image's black background is dropped with a screen blend, and it drifts
   slightly as the page scrolls. */
function HeroArt() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollY, [0, 700], [1, reduce ? 1 : 0.35]);
  return (
    <motion.div className="hero-art" style={{ y, opacity }} aria-hidden="true">
      <motion.img
        src="/art/hero.jpg"
        alt=""
        width={1536}
        height={1024}
        initial={reduce ? false : { opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

/* The logo as a lit sculpture under a spotlight (generated with ChatGPT).
   It rises a little and settles as the section scrolls into view. */
function ClosingArt() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 90, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.94, 1]);
  return (
    <div ref={ref} className="closing-art" aria-hidden="true">
      <motion.img src="/art/closing.jpg" alt="" width={1536} height={1024} style={{ y, scale }} />
    </div>
  );
}

const CLOSING_COLORS = ['#080808', '#2c2c2c', '#4a4a4a', '#141414'];

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const user = useSessionUser();
  useReveal();
  const startHref = user ? '/app' : '/login';
  const startLabel = user ? 'Open dashboard' : 'Try Assure free';

  return (
    <div className="site">
      <SiteNav user={user} />

      {/* HERO */}
      <header className="hero-shell">
        <MeshGradient className="hero-gradient" />
        <HeroArt />
        <div className="wrap">
          <div className="hero-copy">
            <h1 className="display"><HeroHeadline lines={['Know what’s', 'still covered.']} /></h1>
            <p className="lede" style={{ maxWidth: 560, margin: '26px auto 0' }}>
              Assure keeps every warranty you own in one place, counts down to each expiry date, and helps you file a claim before coverage runs out.
            </p>
            <div className="hero-actions">
              <a href="#features" className="link-arrow">See how it works <ArrowRight size={16} color="currentColor" /></a>
              <a href={startHref} className="btn btn-ink">{startLabel}</a>
            </div>
          </div>

          <div className="frame reveal" style={{ marginTop: 72 }}>
            <div className="breathe" aria-hidden="true" />
            <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
            <div className="frame-screen"><DashboardPreview /></div>
          </div>
        </div>
      </header>

      <main className="rails">
        {/* FEATURE 1 */}
        <section id="features" className="band" style={{ borderTop: 0, scrollMarginTop: 60 }}>
          <div className="wrap feature">
            <div className="feature-copy reveal">
              <div className="kicker">Expiry countdown</div>
              <h2 className="h2">See what runs out next.</h2>
              <p className="lede">
                <ScrollHighlight text="Every warranty shows the days it has left and how much of its coverage is gone. Your dashboard sorts by what expires soonest, and anything inside 30 days is flagged so it doesn’t slip past." />
              </p>
            </div>
            <CountdownVignette />
          </div>
        </section>

        {/* FEATURE 2 */}
        <section className="band reveal-line">
          <div className="wrap feature flip">
            <div className="feature-copy reveal">
              <div className="kicker">Receipt scan</div>
              <h2 className="h2">Snap the receipt. Skip the typing.</h2>
              <p className="lede">
                <ScrollHighlight text="Take a photo of your receipt and Assure reads the product, brand, purchase date, price, retailer and serial number for you. The receipt stays attached to the warranty, ready when you need proof of purchase." />
              </p>
            </div>
            <ScanVignette />
          </div>
        </section>

        {/* FEATURE 3 */}
        <section className="band reveal-line">
          <div className="wrap feature">
            <div className="feature-copy reveal">
              <div className="kicker">Claim assistant</div>
              <h2 className="h2">Get help when something breaks.</h2>
              <p className="lede">
                <ScrollHighlight text="Open a conversation about any product and the claim assistant already knows its dates, retailer and serial number. It tells you whether the problem is likely covered, what to gather, and drafts the letter to send." />
              </p>
            </div>
            <ClaimVignette />
          </div>
        </section>

        {/* SMALL FACTS */}
        <section className="band-tight">
          <div className="wrap">
            <div className="facts reveal">
              {[
                { Icon: SearchNormal1, title: 'Find any warranty', body: 'Search by product, brand, category or retailer.' },
                { Icon: Calendar, title: 'Set the length in a tap', body: 'Add one, two, three or five years from the purchase date, or pick an exact expiry.' },
                { Icon: Element3, title: 'Cards or a list', body: 'Browse as cards or a compact list, filtered by active, expiring or expired.' },
              ].map(({ Icon, title, body }) => (
                <div key={title} className="fact">
                  <div className="icon"><Icon size={24} color="currentColor" /></div>
                  <h3 className="h3">{title}</h3>
                  <p className="body">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRIVACY */}
        <section id="privacy" className="band reveal-line" style={{ scrollMarginTop: 60 }}>
          <div className="wrap">
            <div className="section-head center reveal">
              <h2 className="h2">Your records stay yours.</h2>
              <p className="lede" style={{ marginTop: 20 }}>
                Warranties and receipts are visible only to your account. Assure never sells your data, and you decide what stays.
              </p>
            </div>
            <div className="reveal reveal-d1" style={{ display: 'flex', justifyContent: 'center', gap: '20px 48px', flexWrap: 'wrap', marginTop: 48 }}>
              {[
                { Icon: Lock1, text: 'Receipts stored privately' },
                { Icon: ShieldTick, text: 'Never sold or shared' },
                { Icon: Trash, text: 'Delete anything, anytime' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 500 }}>
                  <span style={{ color: 'var(--accent)', lineHeight: 0 }}><Icon size={20} color="currentColor" /></span>{text}
                </div>
              ))}
            </div>
            <p className="reveal" style={{ textAlign: 'center', marginTop: 28 }}>
              <a href="/privacy" className="link-arrow" style={{ fontSize: 15 }}>Read the privacy policy <ArrowRight size={16} color="currentColor" /></a>
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="band reveal-line" style={{ scrollMarginTop: 60 }}>
          <div className="wrap">
            <div className="section-head center reveal">
              <h2 className="h2">Pricing</h2>
            </div>
            <div className="reveal reveal-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 760, margin: '56px auto 0' }}>
              <PlanCard plan={PLANS.free} href={startHref} cta={user ? 'Open dashboard' : 'Get started free'} />
              <PlanCard plan={PLANS.plus} available={false} />
            </div>
          </div>
        </section>
      </main>

      {/* CLOSING */}
      <section className="closing" style={{ position: 'relative', isolation: 'isolate', borderTop: '1px solid var(--line)' }}>
        <MeshGradient style={{ position: 'absolute', inset: 0, zIndex: -2 }} colors={CLOSING_COLORS} />
        <ClosingArt />
        <div className="wrap reveal closing-copy" style={{ textAlign: 'center' }}>
          <h2 className="h2">Put every warranty<br />in one place.</h2>
          <div className="hero-actions">
            <a href={startHref} className="btn btn-ink">{startLabel}</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
