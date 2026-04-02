// components/InsightsModal.js
// Lead capture modal: "10 HOA Loan Insights" guide download.
// IV2.0 pattern: blue header bar + frosted white body.
import { useState, useEffect } from "react";
import styles from "../styles/InsightsModal.module.css";

export default function InsightsModal({ onClose }) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = agreedToPrivacy && formData.name.trim() && formData.email.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          privacy: "Agreed",
        }),
      });

      const result = await response.json();

      if (result.result === "success") {
        // Trigger PDF download then close
        const link = document.createElement("a");
        link.href = "/TuCielo_HOA_Lending_Guide.pdf";
        link.download = "TuCielo_HOA_Lending_Guide.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onClose();
      } else {
        alert("Error submitting form. Please try again.");
      }
    } catch {
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Get Your 10 HOA Loan Insights"
    >
      <div className={styles.panel}>

        {/* ── Blue header bar ── */}
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Your Free HOA Loan Guide</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* ── Form body ── */}
        <div className={styles.body}>
          <p className={styles.eyebrow}>Free Resource</p>
          <h3 className={styles.headline}>10 Insights for Your HOA Loan</h3>
          <p className={styles.subtext}>
            Enter your details and we&apos;ll deliver our comprehensive HOA lending guide.
            No commitment, instant PDF download.
          </p>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="insights-name">
              Full Name
            </label>
            <input
              id="insights-name"
              className={styles.input}
              type="text"
              name="name"
              placeholder="Jane Smith"
              value={formData.name}
              onChange={handleInputChange}
              autoComplete="name"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="insights-email">
              Email Address
            </label>
            <input
              id="insights-email"
              className={styles.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
            />
          </div>

          <label className={styles.privacyRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={agreedToPrivacy}
              onChange={(e) => setAgreedToPrivacy(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <button
                type="button"
                className={styles.privacyLink}
                onClick={(e) => e.stopPropagation()}
              >
                Privacy &amp; Data Policy
              </button>
            </span>
          </label>

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!canSubmit}
            type="button"
          >
            Get My Free Guide →
          </button>

          <p className={styles.trust}>Free · No commitment · Instant PDF download</p>
        </div>
      </div>
    </div>
  );
}
