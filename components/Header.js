// components/Header.js
// IV2.0 nav pattern: single row, logo+badge left, links right, one CTA.
// Transparent on load → frosted white on scroll.
// White logo visible on tinted header at top; becomes dark when header turns white.
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import PrivacyModal from './PrivacyModal';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollTo = (id) => {
    if (router.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
    setMenuOpen(false);
  };

  const openPrequal = () => {
    setMenuOpen(false);
    if (router.pathname === '/') {
      window.dispatchEvent(new CustomEvent('tc:open-prequal'));
    } else {
      router.push('/#prequal-form');
    }
  };

  const close = () => setMenuOpen(false);

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>

      <header className={`${styles.siteHeader} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.headerInner}>

          {/* ── Left: logo + beta sticker ── */}
          <div className={styles.logoArea}>
            <Link href="/" className={styles.logoLink} onClick={close} aria-label="TuCielo home">
              <Image
                src="/TuCielo-Header-Logo2.png"
                alt="TuCielo HOA Financing"
                width={160}
                height={54}
                priority
                quality={90}
                className={styles.logoImg}
              />
            </Link>
            <div className={styles.betaSticker}>
              <Image
                src="/BetaProgram_Sticker.png"
                alt="Beta Program"
                width={52}
                height={52}
                quality={85}
              />
            </div>
          </div>

          {/* ── Right: nav links + CTA ── */}
          <nav className={styles.navLinks} aria-label="Main navigation" id="main-nav">
            <Link href="/FAQ"        className={styles.navLink} onClick={close}>FAQ</Link>
            <Link href="/Blog"       className={styles.navLink} onClick={close}>Blog</Link>
            <button className={styles.navLink} onClick={() => scrollTo('contact-section')}>Contact</button>
            <button className={styles.navLink} onClick={() => { setShowPrivacyModal(true); close(); }}>Privacy</button>
            {/* Primary CTA */}
            <button className={styles.navCta} onClick={openPrequal}>
              Get Pre-Qualified
            </button>
          </nav>

          {/* ── Hamburger (mobile only) ── */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            type="button"
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>

        </div>
      </header>

      {/* ── Mobile nav drawer ── */}
      <nav
        id="mobile-nav"
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <Link href="/FAQ"        className={styles.mobileLink} onClick={close}>FAQ</Link>
        <Link href="/Blog"       className={styles.mobileLink} onClick={close}>Blog</Link>
        <button className={styles.mobileLink} onClick={() => scrollTo('contact-section')}>Contact</button>
        <button className={styles.mobileLink} onClick={() => { setShowPrivacyModal(true); close(); }}>Privacy Policy</button>
        <button className={styles.mobileCta} onClick={openPrequal}>get Pre-Qualified →</button>
      </nav>

      {showPrivacyModal && (
        <PrivacyModal isModalOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      )}
    </>
  );
}
