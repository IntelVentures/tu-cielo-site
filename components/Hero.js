// components/Hero.js
import styles from "../styles/Hero.module.css";

export default function Hero({ setShowInsightsModal }) {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.heroSection} id="home" aria-label="Hero">

      {/* Atmospheric sky-glow — sits behind content */}
      <div className={styles.heroGlow} aria-hidden="true" />

      <div className={styles.heroInner}>

        {/* ── Left: copy column ── */}
        <div className={styles.heroLeft}>

          <p className={styles.heroEyebrow}>Florida HOA Financing</p>

          <h1 className={styles.heroHeadline}>
            Your Community<br />
            Deserves <span className={styles.heroAccent}>Better Financing.</span>
          </h1>

          <p className={styles.heroSub}>
            Long-term, fixed-rate capital for Florida HOAs — without special
            assessments, personal guarantees, or bank red tape.
          </p>

          <div className={styles.heroCTAs}>
            <button
              className={styles.ctaPrimary}
              onClick={() => scrollToSection("prequal-form")}
            >
              Get Free Estimate
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => setShowInsightsModal && setShowInsightsModal(true)}
            >
              10 HOA Loan Insights →
            </button>
          </div>

          <p className={styles.heroTrust}>
            Free · No commitment · Estimate delivered in 48 hrs
          </p>

        </div>

        {/* ── Right: stats card grid ── */}
        <div className={styles.heroRight} aria-label="Key loan metrics">
          <div className={styles.statsGrid}>

            <div className={styles.statCard}>
              <span className={styles.statValue}>$1M – $10M+</span>
              <span className={styles.statLabel}>Loan Range</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statValue}>25 Years</span>
              <span className={styles.statLabel}>Fixed Terms</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statValue}>30–45 Days</span>
              <span className={styles.statLabel}>Approval Time</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statValue}>No PG</span>
              <span className={styles.statLabel}>Personal Guarantees</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
