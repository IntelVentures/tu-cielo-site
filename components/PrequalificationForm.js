import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/PrequalificationForm.module.css";

export default function PrequalificationForm({ showForm, setShowForm }) {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [couponStatus, setCouponStatus] = useState(null); // 'valid' | 'invalid' | 'checking' | null
  const [couponContractor, setCouponContractor] = useState("");
  const modalRef = useRef(null);
  const submitBtnRef = useRef(null);

  const currencyFields = ["estimated_amount", "annual_budget", "outstanding_loans"];
  const numericFields = ["units_count", "delinquency_rate", "outstanding_loans"];

  // Pre-fill coupon from ?ref= query param
  useEffect(() => {
    const ref = router.query.ref;
    if (ref && !formData.coupon_code) {
      setFormData((prev) => ({ ...prev, coupon_code: ref }));
      validateCoupon(ref);
    }
  }, [router.query.ref]);

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  const validateCoupon = async (code) => {
    if (!code || !code.trim()) {
      setCouponStatus(null);
      setCouponContractor("");
      return;
    }
    setCouponStatus("checking");
    try {
      const res = await fetch(`/api/validate-coupon?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponStatus("valid");
        setCouponContractor(data.contractor_name || "");
      } else {
        setCouponStatus("invalid");
        setCouponContractor("");
      }
    } catch {
      setCouponStatus(null);
      setCouponContractor("");
    }
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
    if (name === "coupon_code") {
      validateCoupon(value);
    }
  };

  const isValid = () =>
    ["hoa_name", "contact_first_name", "contact_last_name", "contact_title",
      "hoa_email", "contact_phone", "estimated_amount", "units_count",
      "delinquency_rate", "disputes", "annual_budget",
      "professionally_managed", "project_description", "sirs_report"]
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

    // Block submission if coupon is invalid
    if (formData.coupon_code && couponStatus === "invalid") {
      setSubmitError("The referral code entered is not valid. Please check and try again, or remove it to submit without one.");
      setIsSubmitting(false);
      return;
    }

    try {
      const cleanedPayload = {
        hoa_name: formData.hoa_name || "",
        association_name: formData.association_name || "",
        contact_first_name: formData.contact_first_name || "",
        contact_last_name: formData.contact_last_name || "",
        contact_title: formData.contact_title || "",
        hoa_email: formData.hoa_email || "",
        contact_phone: formData.contact_phone || "",
        property_address: formData.property_address || "",
        city: formData.city || "",
        state: formData.state || "",
        zip: formData.zip || "",
        estimated_amount: formData.estimated_amount?.replace(/[^\d.]/g, "") || "",
        units_count: formData.units_count || "",
        delinquency_rate: formData.delinquency_rate || "",
        annual_budget: formData.annual_budget?.replace(/[^\d.]/g, "") || "",
        outstanding_loans: formData.outstanding_loans?.replace(/[^\d.]/g, "") || "",
        disputes: formData.disputes || "",
        professionally_managed: formData.professionally_managed || "",
        project_description: formData.project_description || "",
        sirs_report: formData.sirs_report || "",
        coupon_code: formData.coupon_code || "",
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
        setCouponStatus(null);
        setCouponContractor("");
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

              {/* ── Referral Code (optional) ── */}
              <label className={styles.fieldLabel} htmlFor="coupon_code">
                Referral Code (if you have one)
              </label>
              <input id="coupon_code" name="coupon_code" placeholder="e.g., JOHN-SMITH" className={styles.input} value={formData.coupon_code || ""} onChange={handleChange} onBlur={handleBlur} style={{ textTransform: "uppercase" }} />
              {couponStatus === "checking" && (
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "-0.8rem", marginBottom: "1rem" }}>Verifying code...</p>
              )}
              {couponStatus === "valid" && (
                <p style={{ fontSize: "0.85rem", color: "#166534", marginTop: "-0.8rem", marginBottom: "1rem" }}>
                  Referred by {couponContractor}
                </p>
              )}
              {couponStatus === "invalid" && (
                <p role="alert" style={{ fontSize: "0.85rem", color: "#991b1b", marginTop: "-0.8rem", marginBottom: "1rem" }}>
                  This referral code is not valid. You can still submit without one.
                </p>
              )}

              {/* ── Association Information ── */}
              <label className={styles.fieldLabel} htmlFor="hoa_name">
                Association Name <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="hoa_name" name="hoa_name" placeholder="e.g., Sunset Hills HOA" className={styles.input} value={formData.hoa_name || ""} onChange={handleChange} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="association_name">
                Legal Association Name (if different)
              </label>
              <input id="association_name" name="association_name" placeholder="e.g., Sunset Hills Condominium Association, Inc." className={styles.input} value={formData.association_name || ""} onChange={handleChange} />

              {/* ── Contact Person ── */}
              <div className={styles.row} style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <label className={styles.fieldLabel} htmlFor="contact_first_name">First Name <span aria-hidden="true" className={styles.required}>*</span></label>
                  <input id="contact_first_name" name="contact_first_name" placeholder="First name" className={styles.input} value={formData.contact_first_name || ""} onChange={handleChange} required aria-required="true" />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="contact_last_name">Last Name <span aria-hidden="true" className={styles.required}>*</span></label>
                  <input id="contact_last_name" name="contact_last_name" placeholder="Last name" className={styles.input} value={formData.contact_last_name || ""} onChange={handleChange} required aria-required="true" />
                </div>
              </div>

              <label className={styles.fieldLabel} htmlFor="contact_title">
                Title / Position <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="contact_title" name="contact_title" placeholder="e.g., Board President" className={styles.input} value={formData.contact_title || ""} onChange={handleChange} required aria-required="true" />

              <div className={styles.row} style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <label className={styles.fieldLabel} htmlFor="hoa_email">Email <span aria-hidden="true" className={styles.required}>*</span></label>
                  <input id="hoa_email" name="hoa_email" type="email" placeholder="you@example.com" className={styles.input} value={formData.hoa_email || ""} onChange={handleChange} required aria-required="true" autoComplete="email" />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="contact_phone">Phone <span aria-hidden="true" className={styles.required}>*</span></label>
                  <input id="contact_phone" name="contact_phone" type="tel" placeholder="(555) 555-5555" className={styles.input} value={formData.contact_phone || ""} onChange={handleChange} required aria-required="true" autoComplete="tel" />
                </div>
              </div>

              {/* ── Property Location (optional) ── */}
              <label className={styles.fieldLabel} htmlFor="property_address">
                Property Address
              </label>
              <input id="property_address" name="property_address" placeholder="Street address" className={styles.input} value={formData.property_address || ""} onChange={handleChange} />

              <div className={styles.row}>
                <div>
                  <label className={styles.fieldLabel} htmlFor="city">City</label>
                  <input id="city" name="city" placeholder="e.g., Miami" className={styles.input} value={formData.city || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="state">State</label>
                  <input id="state" name="state" placeholder="FL" maxLength={2} className={styles.input} value={formData.state || ""} onChange={handleChange} style={{ textTransform: "uppercase" }} />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="zip">ZIP Code</label>
                  <input id="zip" name="zip" placeholder="33101" className={styles.input} value={formData.zip || ""} onChange={handleChange} />
                </div>
              </div>

              {/* ── Financial & Project Details ── */}
              <label className={styles.fieldLabel} htmlFor="estimated_amount">
                Estimated Initial Project Size <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="estimated_amount" name="estimated_amount" placeholder="e.g., $500,000" className={styles.input} value={formData.estimated_amount || ""} onChange={handleChange} onBlur={handleBlur} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="units_count">
                Number of Units in Association <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="units_count" name="units_count" type="number" min="1" placeholder="e.g., 120" className={styles.input} value={formData.units_count || ""} onChange={handleChange} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="delinquency_rate">
                Percentage of Delinquency <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="delinquency_rate" name="delinquency_rate" placeholder="e.g., 5" className={styles.input} value={formData.delinquency_rate || ""} onChange={handleChange} required aria-required="true" />

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

              <label className={styles.fieldLabel} htmlFor="annual_budget">
                Association Annual Budget <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <input id="annual_budget" name="annual_budget" placeholder="e.g., $1,200,000" className={styles.input} value={formData.annual_budget || ""} onChange={handleChange} onBlur={handleBlur} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="outstanding_loans">
                Outstanding Loans Amount (if any)
              </label>
              <input id="outstanding_loans" name="outstanding_loans" placeholder="e.g., $0" className={styles.input} value={formData.outstanding_loans || ""} onChange={handleChange} onBlur={handleBlur} />

              <label className={styles.fieldLabel} htmlFor="professionally_managed">
                Professionally Managed? <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <select id="professionally_managed" name="professionally_managed" className={styles.input} value={formData.professionally_managed || ""} onChange={handleChange} required aria-required="true">
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <label className={styles.fieldLabel} htmlFor="project_description">
                Project Status <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <textarea id="project_description" name="project_description" placeholder="e.g., bid for work, special assessment approved, etc." className={`${styles.input} ${styles.textarea}`} value={formData.project_description || ""} onChange={handleChange} required aria-required="true" />

              <label className={styles.fieldLabel} htmlFor="sirs_report">
                SIRS / 30-year / Milestone Report? <span aria-hidden="true" className={styles.required}>*</span>
              </label>
              <select id="sirs_report" name="sirs_report" className={styles.input} value={formData.sirs_report || ""} onChange={handleChange} required aria-required="true">
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="In Progress">In Progress</option>
              </select>

              {/* Honeypot — hidden from humans */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                <label htmlFor="_hp">Leave blank</label>
                <input id="_hp" name="_hp" type="text" tabIndex={-1} autoComplete="off" value={formData._hp || ""} onChange={handleChange} />
              </div>

              <p className={styles.requiredNote}>
                <span aria-hidden="true" className={styles.required}>*</span> Indicates a required field
              </p>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className={styles.submitBtn} style={{ background: "#64748b", flex: "0 0 auto", width: "auto", padding: "14px 24px" }} onClick={() => setShowForm(false)}>Cancel</button>
                <button ref={submitBtnRef} type="submit" className={styles.submitBtn} style={{ flex: 1, marginTop: 0 }} disabled={!isValid() || isSubmitting} aria-disabled={!isValid() || isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Prequalification"}
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
            <p>We will review your prequalification and contact you within 24-48 hours.</p>
            <button className={styles.closeBtn} onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
