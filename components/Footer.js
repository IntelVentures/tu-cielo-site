// components/Footer.js
// Clean deep-navy footer — IV2.0 footer pattern adapted to TuCielo.
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className={styles.footer}>
      <div className="tc-wrap">

        <div className={styles.footerTop}>
          {/* Brand */}
          <div className={styles.brand}>
            <span className={styles.brandName}>TuCielo</span>
            <p className={styles.brandTagline}>HOA Financing for Florida Communities</p>
          </div>

          {/* Nav */}
          <nav className={styles.footerNav} aria-label="Footer navigation">
            <button onClick={() => scrollTo('why-tucielo')} className={styles.navLink}>Why TuCielo</button>
            <button onClick={() => scrollTo('how-it-works')} className={styles.navLink}>How It Works</button>
            <button onClick={() => scrollTo('prequal-cta')} className={styles.navLink}>Get Pre-Qualified</button>
            <button onClick={() => scrollTo('contact-section')} className={styles.navLink}>Contact</button>
          </nav>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© {new Date().getFullYear()} TuCielo. All rights reserved.</p>
        </div>

        <p className={styles.disclaimer}>
          Disclaimer: TuCielo and any affiliated entities do not provide installation services and are not
          government agencies. All terms, conditions, and results are project-specific and may vary.
          Financing terms may change and are subject to TuCielo&apos;s underwriting criteria without prior notice.
          Payment estimates are for budgeting purposes only. TuCielo financing is repaid through your HOA;
          monthly payments may vary based on loan term, interest rate, fees, number of units, and other
          covenants agreed upon between the HOA and the lender. This website does not constitute an offer
          to lend. Please consult a TuCielo representative for personalized estimates.
        </p>

      </div>
    </footer>
  );
}
