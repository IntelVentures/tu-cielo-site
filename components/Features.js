// components/Features.js
// IV2.0 pattern: section → wrap → content. No card wrapper around the section.
// Table and feature list are self-contained elements, not section wrappers.
import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/Features.module.css';
import InsightsModal from './InsightsModal';

export default function Features() {
  const [showInsightsModal, setShowInsightsModal] = useState(false);

  return (
    <section className={`tc-section tc-section-alt ${styles.featuresSection}`} id="why-tucielo">
      <div className="tc-wrap">

        {/* ── Section header — split layout like IV2.0 ── */}
        <div className={`${styles.sectionHeader} reveal`}>
          <div className={styles.headerLeft}>
            <span className="tc-label">Why TuCielo</span>
            <h2 className={`tc-title ${styles.headline}`}>
              HOA improvements without<br />
              special assessments?<br />
              <em>Yes, it&apos;s possible.</em>
            </h2>
          </div>
          <p className={`tc-body-lg ${styles.headerIntro}`}>
            Flexible, long-term financing for Florida communities — without
            the red tape of traditional banks. Your sky, your terms.
          </p>
        </div>

        {/* ── Two-column content ── */}
        <div className={`${styles.contentGrid} stagger`}>

          {/* Left — image + CTA */}
          <div className={styles.leftCol}>
            <div className={styles.imageWrapper}>
              <Image
                src="/before-after-building.jpg"
                alt="Before and after HOA building renovation"
                width={800}
                height={600}
                quality={85}
                style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
              />
            </div>
            <p className={styles.imageCaption}>
              Before your board makes any major funding decision, you need the
              facts. Download our guide and walk into your next board meeting
              informed and prepared to lead.
            </p>
            <button
              className={`tc-btn-outline ${styles.insightsBtn}`}
              onClick={() => setShowInsightsModal(true)}
            >
              10 Insights for Your HOA Loan
            </button>
          </div>

          {/* Right — feature list + comparison table */}
          <div className={styles.rightCol}>

            {/* Why HOAs struggle */}
            <div className={styles.problemBlock}>
              <h3 className={styles.blockTitle}>
                Why most Florida HOAs struggle to fund capital projects
              </h3>
              <ul className={styles.featureList}>
                <li>Bank loans require large reserves and perfect financials</li>
                <li>Special assessments are unpopular with residents</li>
                <li>Reserve studies reveal millions in needed repairs</li>
              </ul>
              <p className={styles.tucieloCallout}>
                TuCielo is built to solve exactly this.
              </p>
            </div>

            {/* Comparison table — a data element, not a section card */}
            <div className={styles.tableBlock}>
              <h3 className={styles.blockTitle}>Designed for HOAs, not just for banks</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.compTable}>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>TuCielo</th>
                      <th>Traditional Bank</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Loan Terms</td>
                      <td className={styles.tcCell}>Up to 25 years</td>
                      <td>Typically 5–10 years</td>
                    </tr>
                    <tr>
                      <td>Minimum Loan</td>
                      <td className={styles.tcCell}>$1,000,000+</td>
                      <td>Varies</td>
                    </tr>
                    <tr>
                      <td>Underwriting</td>
                      <td className={styles.tcCell}>Flexible, holistic</td>
                      <td>Strict financial criteria</td>
                    </tr>
                    <tr>
                      <td>Prepayment</td>
                      <td className={styles.tcCell}>Flexible options</td>
                      <td>Often penalties apply</td>
                    </tr>
                    <tr>
                      <td>No hammer clause</td>
                      <td className={`${styles.tcCell} ${styles.iconCell}`}>
                        <span className={styles.checkmark} aria-label="Yes">✓</span>
                      </td>
                      <td className={styles.iconCell}>
                        <span className={styles.cross} aria-label="No">✕</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className={styles.tableNote}>
                * Get your full program guideline by requesting a free estimate below.
              </p>
            </div>

          </div>
        </div>

      </div>

      {showInsightsModal && (
        <InsightsModal onClose={() => setShowInsightsModal(false)} />
      )}
    </section>
  );
}
