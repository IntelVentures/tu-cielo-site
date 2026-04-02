import React from 'react';
import Image from 'next/image';
import styles from '../styles/EstimateSection.module.css'; // optional if you want a separate CSS module

export default function EstimateSection() {
  return (
    <section className={styles.estimateWrapper}>
      <div className={styles.paymentEstimateSection}>
        <div className={styles.paymentBreakdownWrapper}>
          <div className={styles.paymentBreakdown}>
            <h2>What Could Your Association Payment Look Like?</h2>
            <Image
              src="/Free_Custom_Estimate_no_background.png"
              alt="Free custom HOA financing estimate calculator"
              width={400}
              height={300}
              className={styles.estimateImage}
              quality={85}
            />
            <div style={{ textAlign: "center" }}>
              <button className={styles.ctaButton} disabled>
                Get Your FREE Custom Estimate
              </button>
            </div>
            <p className={styles.paymentNote}>
              No hammer clause | DSCR included | Fixed-rate periods up to 12.5 years
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

