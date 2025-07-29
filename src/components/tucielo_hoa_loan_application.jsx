import React, { useState } from "react";
import './tucielo_hoa_loan_application.css';

export default function HOAApplicationForm({ onClose }) {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [step, setStep] = useState(0);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);


  const steps = [
    {
      title: "Association Information",
      fields: ["hoaName", "communityName", "units", "yearBuilt"]
    },
    {
      title: "Applicant Contact",
      fields: ["contactName", "position", "email", "phone"]
    },
    {
      title: "Project Information",
      fields: ["projectType", "projectCost"]
    },
    {
      title: "Financing Request",
      fields: ["loanAmount", "loanTerm"]
    },
    {
      title: "Financial Overview",
      fields: ["monthlyDues", "reserveBalance", "annualBudget", "delinquencyRate"]
    },
    {
      title: "Upload Documents",
      fields: ["reserveStudy", "annualBudgetFile"]
    }
  ];

  const currencyFields = ["projectCost", "loanAmount", "monthlyDues", "reserveBalance", "annualBudget"];
  const percentFields = ["delinquencyRate"];
  const numberOnlyFields = ["yearBuilt"];

  const formatCurrency = (input) => {
    const number = parseFloat(input);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(number);
  };

  const formatPercentage = (input) => {
    const cleaned = input.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return formData.delinquencyRate || '';
    if (cleaned === '') return '';
    if (cleaned.endsWith('.')) return cleaned;

    const number = parseFloat(cleaned);
    if (isNaN(number)) return '';
    return `${number}%`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (currencyFields.includes(name)) {
      const rawDigits = value.replace(/[^\d]/g, "");
      const formattedValue = formatCurrency(rawDigits);
      setFormData({ ...formData, [name]: formattedValue });
    } else if (percentFields.includes(name)) {
      const formattedValue = formatPercentage(value);
      setFormData({ ...formData, [name]: formattedValue });
    } else if (numberOnlyFields.includes(name)) {
      const digitsOnly = value.replace(/[^\d]/g, "");
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prev => ({ ...prev, [name]: files[0] }));
  };

  const isStepValid = () => {
    const requiredFields = steps[step].fields;
    return requiredFields.every(field => {
      if (field === "reserveStudy" || field === "annualBudgetFile") {
        return files[field];
      }
      return formData[field] && formData[field].toString().trim() !== "";
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted:", formData, files);

    // Send data to backend after PDF generation
    try {
      const formPayload = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      // Append files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formPayload.append(key, file);
        }
      });

      const response = await fetch("/api/submit-hoa-form", {
        method: "POST",
        body: formPayload,
      });

      const result = await response.json();

      if (result.success) {
        setSubmissionSuccess(true);
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("There was an error submitting the form.");
    }
  };

  return (
    <div className="hoa-modal">
      <div className="hoa-modal-content">
        <button className="hoa-close-button" onClick={onClose}>×</button>
        <div className="hoa-form-wrapper">
          <h2>First, some preliminary information</h2>
          {submissionSuccess ? (
            <div className="hoa-confirmation">
              <h2>🎉 Application Submitted!</h2>
              <p>Thank you for your submission. We’ll be in touch shortly.</p>
              <button className="hoa-nav-btn" onClick={onClose} style={{ marginTop: '1rem' }}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
            {step === 0 && (
              <div>
                <h3>Association Information</h3>
                <input type="text" name="hoaName" placeholder="HOA Legal Name" onChange={handleChange} value={formData.hoaName || ""} className="input" />
                <input type="text" name="communityName" placeholder="Community Name" onChange={handleChange} value={formData.communityName || ""} className="input" />
                <input type="text" name="units" placeholder="Number of Units" onChange={handleChange} value={formData.units || ""} className="input" />
                <input type="text" name="yearBuilt" placeholder="Year Built" onChange={handleChange} value={formData.yearBuilt || ""} className="input" />
              </div>
            )}

            {step === 1 && (
              <div>
                <h3>Applicant Contact</h3>
                <input type="text" name="contactName" placeholder="Name" onChange={handleChange} value={formData.contactName || ""} className="input" />
                <select
                  name="position"
                  onChange={handleChange}
                  value={formData.position || ""}
                  className="input"
                >
                  <option value="">Select a Title</option>
                  <option value="Board Member">Board Member</option>
                  <option value="Property Manager">Property Manager</option>
                  <option value="HOA President">HOA President</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Other">Other</option>
                </select>

                <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email || ""} className="input" />
                <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone || ""} className="input" />
              </div>
            )}

            {step === 2 && (
              <div>
                <h3>Project Information</h3>
                <select name="projectType" onChange={handleChange} value={formData.projectType || ""} className="input">
                  <option value="" disabled>Select Project Type</option>
                  <option>Roof Replacement</option>
                  <option>Paving / Asphalt</option>
                  <option>Pool / Common Area Renovation</option>
                  <option>Reserve Requirement</option>
                  <option>Building Repairs</option>
                  <option>Other</option>
                </select>
                <input type="text" name="projectCost" placeholder="Estimated Project Cost ($)" onChange={handleChange} value={formData.projectCost || ""} className="input" />
              </div>
            )}

            {step === 3 && (
              <div>
                <h3>Financing Request</h3>
                <input type="text" name="loanAmount" placeholder="Loan Amount Requested ($)" onChange={handleChange} value={formData.loanAmount || ""} className="input" />
                <select name="loanTerm" onChange={handleChange} value={formData.loanTerm || ""} className="input">
                  <option value="" disabled>Select Loan Term</option>
                  <option>10 years</option>
                  <option>15 years</option>
                  <option>20 years</option>
                  <option>25 years</option>
                </select>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3>Financial Overview</h3>
                <input type="text" name="monthlyDues" placeholder="Monthly Dues per Unit ($)" onChange={handleChange} value={formData.monthlyDues || ""} className="input" />
                <input type="text" name="reserveBalance" placeholder="Current Reserve Fund Balance ($)" onChange={handleChange} value={formData.reserveBalance || ""} className="input" />
                <input type="text" name="annualBudget" placeholder="Annual Operating Budget ($)" onChange={handleChange} value={formData.annualBudget || ""} className="input" />
                <input type="text" name="delinquencyRate" placeholder="Delinquency Rate (%)" onChange={handleChange} value={formData.delinquencyRate || ""} className="input" />
              </div>
            )}

            {step === 5 && (
              <div>
                <h3>Upload Documents</h3>
                <label>Reserve Study</label>
                <input type="file" name="reserveStudy" onChange={handleFileChange} className="input-file" />
                <label>Annual Budget</label>
                <input type="file" name="annualBudgetFile" onChange={handleFileChange} className="input-file" />
              </div>
            )}

           <div className="step-controls">
                {step === steps.length - 1 && (
                  <button
                    type="submit"
                    className="hoa-submit-btn"
                    disabled={!isStepValid()}
                    style={{ marginBottom: '1rem' }}
                  >
                    Submit Application
                  </button>
                )}
              
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                  {step > 0 && (
                    <button
                      type="button"
                      className="hoa-nav-btn"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </button>
                  )}
                  {step < steps.length - 1 && (
                    <button
                      type="button"
                      className="hoa-nav-btn"
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
