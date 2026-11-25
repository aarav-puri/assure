'use client';

import { useEffect, useState } from 'react';
import { HamburgerMenu, CloseSquare } from 'iconsax-reactjs';
import { authClient } from '@/lib/auth/client';
import { LogoMark } from '@/components/Logo';

/** Signed-in user for marketing pages, or null. Never blocks rendering. */
export function useSessionUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let cancelled = false;
    authClient.getSession()
      .then(({ data }) => { if (!cancelled) setUser(data?.user ?? null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return user;
}

const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#privacy', label: 'Privacy' },
  { href: '/pricing', label: 'Pricing' },
];

export function SiteNav({ user, current }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const cta = user
    ? { href: '/app', label: 'Open dashboard' }
    : { href: '/login', label: 'Try Assure free' };

  return (
    <>
      <nav className={`site-nav${scrolled ? ' scrolled' : ''}`} aria-label="Main">
        <a href="/" className="brand" aria-label="Assure home">
          <LogoMark size={28} />
          <span>Assure</span>
        </a>
        <div className="nav-items">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-item" aria-current={current === l.label ? 'page' : undefined}>{l.label}</a>
          ))}
          {!user && <a href="/login" className="nav-item">Sign in</a>}
          <a href={cta.href} className="btn btn-ink btn-sm" style={{ marginLeft: 6 }}>{cta.label}</a>
        </div>
        <button className="nav-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <CloseSquare size={24} color="currentColor" /> : <HamburgerMenu size={24} color="currentColor" />}
        </button>
      </nav>

      {open && (
        <div className="mobile-sheet hide-desktop">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          {!user && <a href="/login" onClick={() => setOpen(false)}>Sign in</a>}
          <a href={cta.href} className="btn btn-ink" style={{ marginTop: 24, alignSelf: 'flex-start' }}>{cta.label}</a>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="tnum">© {new Date().getFullYear()} Assure</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/pricing">Pricing</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}
