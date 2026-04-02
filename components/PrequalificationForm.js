import { useState, useRef, useEffect } from "react";
import styles from "../styles/PrequalificationForm.module.css";

export default function PrequalificationForm({ showForm, setShowForm }) {
  const [formData, setFormData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const modalRef = useRef(null);
  const submitBtnRef = useRef(null);

  const currencyFields = ["projectSize", "annualBudget", "outstandingLoans"];
  const numericFields = ["units", "delinquency", "outstandingLoans"];

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmitError(null);
    if (numericFields.includes(name)) {
      setFormData({ ...formData, [name]: value.replace(/[^\d.]/g, "") });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (currencyFields.includes(name) && value) {
      setFormData({ ...formData, [name]: formatCurrency(value.replace(/[^\d.]/g, "")) });
    }
  };

  const isValid = () =>
    ["associationName", "contactName", "title", "email", "phone", "date",
      "projectSize", "units", "delinquency", "disputes", "annualBudget",
      "professionallyManaged", "projectStatus", "sirsReport"]
      .every((f) => formData[f]);

  useEffect(() => {
    if (showSuccessModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showSuccessModal]);

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setTimeout(() => submitBtnRef.current?.focus(), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const cleanedPayload = {
        ...formData,
        projectSize: formData.projectSize?.replace(/[^\d.]/g, "") || "",
        annualBudget: formData.annualBudget?.replace(/[^\d.]/g, "") || "",
        outstandingLoans: formData.outstandingLoans?.replace(/[^\d.]/g, "") || "",
        sheetName: "Prequalifications",
      };
      const response = await fetch("/api/submit-hoa-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedPayload),
      });
      const result = await response.json();
      if (result.result === "success") {
        setFormData({});
        setShowSuccessModal(true);
        setShowForm(false);
      } else {
        setSubmitError("Submission failed. Please try again or contact us directly.");
      }
    } catch {
      setSubmitError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className={styles.prequalSection}>
        <div className={styles.prequalContainer}>
          <div style={{ maxHeight: showForm ? "9999px" : "0", overflow: "hidden", transition: "max-height 0.6s ease" }}>
            <form onSubmit={handleSubmit} className={styles.formGrid} noValidate>
              <h2 className={styles.title}>HOA Prequalification</h2>

              {submitError && (
                <div role="alert" className={styles.errorBanner}>
                  {submitError}
                </div>
              )}

              <label className={styles.fieldLabel} htmlFor="associationName">
                Association Name <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="associationName" name="associationName" placeholder="e.g., Sunset Hills HOA" className={styles.input} value={formData.associationName || ""} onChange={handleChange} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="contactName">
                Association Contact Name <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="contactName" name="contactName" placeholder="Full name" className={styles.input} value={formData.contactName || ""} onChange={handleChange} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="title">
                Title / Position <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="title" name="title" placeholder="e.g., Board President" className={styles.input} value={formData.title || ""} onChange={handleChange} required aria-required="true" />

              <div className={styles.row}>
                <div>
                  <label className={styles.fieldLabel} htmlFor="email">Email <span aria-hidden="true" className={styles.required}>*</span></label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" className={styles.input} value={formData.email || ""} onChange={handleChange} required aria-required="true" autoComplete="email" />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="phone">Phone <span aria-hidden="true" className={styles.required}>*</span></label>
                  <input id="phone" name="phone" type="tel" placeholder="(555) 555-5555" className={styles.input} value={formData.phone || ""} onChange={handleChange} required aria-required="true" autoComplete="tel" />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="date">Date <span aria-hidden="true" className={styles.required}>*</span></label>
                  <input id="date" name="date" type="date" className={styles.input} value={formData.date || ""} onChange={handleChange} required aria-required="true" />
                </div>
              </div>

              <label className={styles.fieldLabel} htmlFor="projectSize">
                Estimated Initial Project Size <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="projectSize" name="projectSize" placeholder="e.g., $500,000" className={styles.input} value={formData.projectSize || ""} onChange={handleChange} onBlur={handleBlur} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="units">
                Number of Units in Association <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="units" name="units" type="number" min="1" placeholder="e.g., 120" className={styles.input} value={formData.units || ""} onChange={handleChange} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="delinquency">
                Percentage of Delinquency <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="delinquency" name="delinquency" placeholder="e.g., 5" className={styles.input} value={formData.delinquency || ""} onChange={handleChange} required aria-required="true" />

              <fieldset className={styles.radioGroup}>
                <legend className={styles.radioTitle}>
                  Any open protest, dispute, lawsuits, or bankruptcy? <span aria-hidden="true" className={styles.required}>*</span>
                </legend>
                {["None", "Protest", "Dispute", "Lawsuit", "Bankruptcy"].map((option) => (
                  <label key={option} className={styles.radioOption}>
                    <input type="radio" name="disputes" value={option} checked={formData.disputes === option} onChange={handleChange} required />
                    {option}
                  </label>
                ))}
              </fieldset>

              <label className={styles.fieldLabel} htmlFor="annualBudget">
                Association Annual Budget <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="annualBudget" name="annualBudget" placeholder="e.g., $1,200,000" className={styles.input} value={formData.annualBudget || ""} onChange={handleChange} onBlur={handleBlur} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="outstandingLoans">
                Outstanding Loans Amount (if any)
              </label>
              <input id="outstandingLoans" name="outstandingLoans" placeholder="e.g., $0" className={styles.input} value={formData.outstandingLoans || ""} onChange={handleChange} onBlur={handleBlur} />

              <label className={styles.fieldLabel} htmlFor="professionallyManaged">
                Professionally Managed? <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <select id="professionallyManaged" name="professionallyManaged" className={styles.input} value={formData.professionallyManaged || ""} onChange={handleChange} required aria-required="true">
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <label className={styles.fieldLabel} htmlFor="projectStatus">
                Project Status <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <textarea id="projectStatus" name="projectStatus" placeholder="e.g., bid for work, special assessment approved, etc." className={`${styles.input} ${styles.textarea}`} value={formData.projectStatus || ""} onChange={handleChange} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="sirsReport">
                SIRS / 30-year / Milestone Report? <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <select id="sirsReport" name="sirsReport" className={styles.input} value={formData.sirsReport || ""} onChange={handleChange} required aria-required="true">
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="In Progress">In Progress</option>
              </select>

              <p className={styles.requiredNote}>
                <span aria-hidden="true" className={styles.required}>*</span> Indicates a required field
              </p>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className={styles.submitBtn} style={{ background: "#64748b", flex: "0 0 auto", width: "auto", padding: "14px 24px" }} onClick={() => setShowForm(false)}>Cancel</button>
                <button ref={submitBtnRef} type="submit" className={styles.submitBtn} style={{ flex: 1, marginTop: 0 }} disabled={!isValid() || isSubmitting} aria-disabled={!isValid() || isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit Prequalification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {showSuccessModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="success-modal-title" tabIndex={-1} ref={modalRef} onKeyDown={(e) => { if (e.key === "Escape") handleCloseModal(); }}>
          <div className={styles.modal}>
            <h3 id="success-modal-title">Thank You</h3>
            <p>We will review your prequalification and contact you within 24–48 hours.</p>
            <button className={styles.closeBtn} onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}