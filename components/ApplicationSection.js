// components/ApplicationSection.js
import { useState } from "react";
import TuCieloHOALoanApplication from "./tucielo_hoa_loan_application";
import styles from "../styles/ApplicationSection.module.css";

export default function ApplicationSection({ id }) {
  const [showApplicationFormModal, setShowApplicationFormModal] = useState(false);

  return (
    <section id={id} className={styles.applicationSection}>
      <div className={styles.paymentEstimateSection}>
        <h2>Click Below to Submit Your Application</h2>

        <div style={{ textAlign: "center" }}>
          <div className={styles.tooltipContainer}>
            <button
              type="button"
              className={styles.ctaButton}
              onClick={() => setShowApplicationFormModal(true)}
              aria-describedby="application-tooltip"
            >
              <strong>Start Application</strong>
            </button>

            <div id="application-tooltip" className={styles.tooltipText}>
              <p>Before starting please gather the following information:</p>
              <ul>
                <li>1. HOA legal entity name</li>
                <li>2. Number of units</li>
                <li>3. Year built of condominium</li>
                <li>4. Contact info</li>
                <li>5. Type of project</li>
                <li>6. Cost of improvement / Reserves</li>
                <li>7. Loan amount needed</li>
                <li>8. Average monthly dues per unit</li>
                <li>9. Current reserve fund balance</li>
                <li>10. Annual operating budget</li>
                <li>11. Delinquency rate percentage</li>
                <li>12. Reserves studies PDF (max 500&nbsp;MB)</li>
                <li>13. Annual budget PDF (max 500&nbsp;MB)</li>
              </ul>
            </div>
          </div>
        </div>

        <p className={styles.paymentNote}>
          No hammer clause &nbsp;|&nbsp; DSCR included &nbsp;|&nbsp; Fixed-rate periods up to 12.5 years
        </p>
      </div>

      {showApplicationFormModal && (
        <TuCieloHOALoanApplication
          onClose={() => setShowApplicationFormModal(false)}
        />
      )}
    </section>
  );
}
