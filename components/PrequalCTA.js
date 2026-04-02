// components/PrequalCTA.js
// CTA band — a contained panel within a section (IV2.0 FinalCTA pattern).
// The panel IS the CTA element, not a wrapper around the section content.
import styles from '../styles/PrequalCTA.module.css';

export default function PrequalCTA({ onStart }) {
  return (
    <section className={`tc-section-sm ${styles.ctaSection}`} id="prequal-cta">
      <div className="tc-wrap">
        <div className={`${styles.ctaPanel} reveal`}>

          {/* Left — copy */}
          <div className={styles.ctaCopy}>
            <span className={styles.eyebrow}>Your first step starts here</span>
            <h2 className={styles.headline}>
              Is your HOA ready<br />for financing?
            </h2>
            <p className={styles.subtext}>
              Find out in minutes. Our prequalification gives your board a clear
              picture of what&apos;s possible — no commitment, no credit pull, no red tape.
            </p>
            <p className={styles.disclaimer}>
              No credit check &nbsp;·&nbsp; No obligation &nbsp;·&nbsp; Response within 24–48 hrs
            </p>
          </div>

          {/* Right — steps + CTA */}
          <div className={styles.ctaAction}>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNum}>1</div>
                <p className={styles.stepLabel}>Complete the short form</p>
              </div>
              <div className={styles.stepLine} aria-hidden="true" />
              <div className={styles.step}>
                <div className={styles.stepNum}>2</div>
                <p className={styles.stepLabel}>We review your association</p>
              </div>
              <div className={styles.stepLine} aria-hidden="true" />
              <div className={styles.step}>
                <div className={styles.stepNum}>3</div>
                <p className={styles.stepLabel}>Get your financing options</p>
              </div>
            </div>
            <button className={`tc-btn-primary ${styles.ctaBtn}`} onClick={onStart}>
              Start Your Prequalification →
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
