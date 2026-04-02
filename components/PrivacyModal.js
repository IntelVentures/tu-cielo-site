// components/PrivacyModal.js
import { useEffect } from 'react';
import styles from '../styles/PrivacyModal.module.css';

export default function PrivacyModal({ onClose }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Privacy Policy">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>

        {/* Header bar */}
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Privacy & Terms</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.body}>

          <h3 className={styles.sectionTitle}>Privacy Policy</h3>
          <p>
            At TuCielo, we are committed to protecting the privacy of our users
            and the confidentiality of the data we collect. This document outlines
            how we collect, use, and protect your information when you use our
            website and submit an application for HOA lending services.
          </p>

          <h4>Information We Collect</h4>
          <ul>
            <li>Association name, address, and contact details</li>
            <li>Financial documents (budgets, reserve studies, project bids)</li>
            <li>Board member and CAM contact information</li>
            <li>Any other information submitted through our application form</li>
          </ul>

          <h4>How We Use Your Information</h4>
          <p>
            Your data is used exclusively for the purpose of evaluating and
            processing your HOA loan application. We do not sell or rent your
            personal information.
          </p>

          <h4>Consent</h4>
          <p>
            By submitting your information through our website, you consent to
            our use of your data in accordance with this policy.
          </p>

          <h4>Data Retention</h4>
          <p>
            We retain submitted documents for no more than 180 days unless an
            active loan application is in process. Files are automatically
            deleted thereafter.
          </p>

          <h4>Data Security</h4>
          <p>
            We use industry-standard encryption (HTTPS, AES-256) to protect all
            data transfers and storage. Access to uploaded files is restricted
            to authorised TuCielo personnel only.
          </p>

          <h4>Your Rights</h4>
          <p>
            You may request access, correction, or deletion of your data by
            contacting us at tucielofinancing.com.
          </p>

          <h4>Updates</h4>
          <p>
            This Privacy Policy may be updated periodically. Continued use of
            the site constitutes acceptance of the updated terms.
          </p>

          <div className={styles.divider} />

          <h3 className={styles.sectionTitle}>Terms of Service</h3>

          <h4>Acceptance of Terms</h4>
          <p>
            By using this website and submitting information, you agree to these
            Terms of Service and our Privacy Policy.
          </p>

          <h4>Use of Services</h4>
          <p>
            You agree to use our services for lawful purposes only and to
            provide accurate, non-fraudulent information.
          </p>

          <h4>Document Uploads</h4>
          <p>
            Uploaded documents must be HOA-approved and free of viruses or
            malicious content. Only PDF, DOCX, XLS, and CSV formats are
            accepted. Maximum file size is 25 MB.
          </p>

          <h4>No Guarantee of Financing</h4>
          <p>
            Submission of an application does not guarantee loan approval.
            TuCielo reserves the right to deny applications at our sole
            discretion.
          </p>

          <h4>Intellectual Property</h4>
          <p>
            All content on this website is the property of TuCielo and may not
            be reproduced without written consent.
          </p>

          <h4>Limitation of Liability</h4>
          <p>
            TuCielo shall not be liable for any indirect or consequential
            damages arising from the use of this site or our services.
          </p>

          <h4>Governing Law</h4>
          <p>These terms shall be governed by the laws of the State of Florida.</p>

          <h4>Contact</h4>
          <p>For questions, contact us at tucielofinancing.com.</p>
        </div>

      </div>
    </div>
  );
}
