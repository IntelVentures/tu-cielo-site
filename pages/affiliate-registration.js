// pages/affiliate-registration.js

import React, { useState, useEffect } from 'react';
import styles from '../styles/AffiliateForm.module.css';

export default function AffiliateRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    referralSource: '',
    interest: '',
  });

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const { firstName, lastName, email, phone, company } = formData;
    const isFormValid = firstName && lastName && email && phone && company;
    setIsValid(isFormValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!isValid) return;

  console.log('Form submitted:', formData);

  try {
    const response = await fetch('/api/affiliate-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success:', data);
      alert('Registration submitted successfully!');
    } else {
      console.error('❌ Submission error:', data.error);
      alert('There was a problem with your registration.');
    }
  } catch (err) {
    console.error('❌ Fetch failed:', err);
    alert('Network or server error.');
  }
};

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heroTitle}>Join the TuCielo Affiliate Program</h1>
      <p className={styles.heroSubtitle}>
        Help homeowners access financing while earning commission.
      </p>

      <form className={styles.registrationForm} onSubmit={handleSubmit}>
        <div className={styles.nameRow}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number*</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="company">Company or Brand Name*</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="website">Website or Social Media Link</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="referralSource">How did you hear about us?</label>
          <input
            type="text"
            id="referralSource"
            name="referralSource"
            value={formData.referralSource}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="interest">Why are you interested in the TuCielo affiliate program?</label>
          <textarea
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!isValid}
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
}

