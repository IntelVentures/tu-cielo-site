// components/tucielo_hoa_loan_application.js
import { useState } from "react";
import styles from "../styles/tucielo_hoa_loan_application.module.css";

export default function TuCieloHOALoanApplication({ onClose }) {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [step, setStep] = useState(0);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const steps = [
    { title: "Association Information", fields: ["hoaName", "communityName", "units", "yearBuilt"] },
    { title: "Applicant Contact", fields: ["contactName", "position", "email", "phone"] },
    { title: "Project Information", fields: ["projectType", "projectCost"] },
    { title: "Financing Request", fields: ["loanAmount", "loanTerm"] },
    { title: "Financial Overview", fields: ["monthlyDues", "reserveBalance", "annualBudget", "delinquencyRate"] },
    { title: "Upload Documents", fields: ["reserveStudy", "annualBudgetFile"] },
  ];

  const currencyFields = ["projectCost", "loanAmount", "monthlyDues", "reserveBalance", "annualBudget"];
  const percentFields = ["delinquencyRate"];
  const numberOnlyFields = ["yearBuilt", "units"];

  const labels = {
    hoaName: "HOA Name",
    communityName: "Community Name",
    units: "Number of Units",
    yearBuilt: "Year Built",
    contactName: "Contact Name",
    position: "Position / Title",
    email: "Email",
    phone: "Phone",
    projectType: "Project Type",
    projectCost: "Estimated Project Cost",
    loanAmount: "Requested Loan Amount",
    loanTerm: "Desired Loan Term",
    monthlyDues: "Monthly HOA Dues",
    reserveBalance: "Reserve Balance",
    annualBudget: "Annual Budget",
    delinquencyRate: "Delinquency Rate (%)",
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      currencyFields.includes(name) ||
      percentFields.includes(name) ||
      numberOnlyFields.includes(name)
    ) {
      const digits = value.replace(/[^\d]/g, "");
      setFormData({ ...formData, [name]: digits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    const file = fileList[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setSubmitError(`File "${file.name}" exceeds the 25 MB limit. Please upload a smaller file.`);
      e.target.value = "";
      return;
    }
    setSubmitError(null);
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const isStepValid = () => {
    const requiredFields = steps[step].fields;
    return requiredFields.every((field) => {
      if (field === "reserveStudy" || field === "annualBudgetFile") return files[field];
      if (!formData[field]) return false;
      if (field === "email") return /\S+@\S+\.\S+/.test(formData[field]);
      if (field === "phone") return /^[0-9\-\+\(\)\s]{7,}$/.test(formData[field]);
      return true;
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let reserveStudyPayload = null;
      if (files.reserveStudy) {
        reserveStudyPayload = {
          name: files.reserveStudy.name,
          mimeType: files.reserveStudy.type,
          data: await toBase64(files.reserveStudy),
        };
      }

      let annualBudgetPayload = null;
      if (files.annualBudgetFile) {
        annualBudgetPayload = {
          name: files.annualBudgetFile.name,
          mimeType: files.annualBudgetFile.type,
          data: await toBase64(files.annualBudgetFile),
        };
      }

      const payload = {
        ...formData,
        sheetName: "HOALoanApps",
        reserveStudy: reserveStudyPayload,
        annualBudgetFile: annualBudgetPayload,
      };

      const response = await fetch("/api/submit-hoa-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.result === "success") {
        setSubmissionSuccess(true);
      } else {
        setSubmitError(result.message || "Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.hoaModal} role="dialog" aria-modal="true">
      <div className={styles.hoaModalContent}>
        <button className={styles.hoaCloseButton} onClick={onClose}>×</button>

        <div className={styles.hoaFormWrapper}>
          {submissionSuccess ? (
            <div className={styles.hoaConfirmation}>
              <h2>🎉 We will be contacting you soon!</h2>
              <p>If you have any questions please contact us at hello@tucielofinancing.com</p>
              <button className={styles.hoaNavBtn} onClick={onClose}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3>{steps[step].title}</h3>

              {submitError && (
                <div role="alert" style={{
                  padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem',
                  background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca',
                }}>
                  {submitError}
                </div>
              )}

              {steps[step].fields.map((field) => {
                if (field === "position") {
                  return (
                    <select
                      key={field}
                      name={field}
                      className={styles.input}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select a Title</option>
                      <option>Board Member</option>
                      <option>Property Manager</option>
                      <option>HOA President</option>
                      <option>Treasurer</option>
                      <option>Secretary</option>
                      <option>Other</option>
                    </select>
                  );
                }

                if (field === "projectType") {
                  return (
                    <select
                      key={field}
                      name={field}
                      className={styles.input}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select Project Type</option>
                      <option>Roof Replacement</option>
                      <option>Paving / Asphalt</option>
                      <option>Pool / Common Area Renovation</option>
                      <option>Reserve Requirement</option>
                      <option>Building Repairs</option>
                      <option>Other</option>
                    </select>
                  );
                }

                if (field === "loanTerm") {
                  return (
                    <select
                      key={field}
                      name={field}
                      className={styles.input}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Loan Term</option>
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years</option>
                      <option value="25">25 Years</option>
                    </select>
                  );
                }

                if (field === "reserveStudy" || field === "annualBudgetFile") {
                  return (
                    <input
                      key={field}
                      type="file"
                      name={field}
                      className={styles.inputFile}
                      onChange={handleFileChange}
                    />
                  );
                }

                return (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    className={styles.input}
                    placeholder={labels[field]}
                    value={
                      currencyFields.includes(field)
                        ? formatCurrency(formData[field])
                        : percentFields.includes(field)
                        ? formData[field] ? `${formData[field]}%` : ""
                        : formData[field] || ""
                    }
                    onChange={handleChange}
                  />
                );
              })}

              <div className={styles.stepControls}>
                {step === steps.length - 1 && (
                  <button
                    type="submit"
                    className={styles.hoaSubmitBtn}
                    disabled={!isStepValid() || isSubmitting}
                  >
                    {isSubmitting ? "Submitting…" : "Submit Application"}
                  </button>
                )}

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                  {step > 0 && (
                    <button type="button" className={styles.hoaNavBtn} onClick={() => setStep(step - 1)}>
                      Back
                    </button>
                  )}
                  {step < steps.length - 1 && (
                    <button
                      type="button"
                      className={styles.hoaNavBtn}
                      onClick={() => isStepValid() && setStep(step + 1)}
                      disabled={!isStepValid()}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
