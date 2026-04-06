import styles from '../styles/ReferralForm.module.css';
import { useState } from 'react';

export default function ReferralRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    title: '',
    phone: '',
    email: '',
    referralCode: '',
    issue: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const isFormValid = Object.values(formData).every((value) => value.trim() !== '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmitStatus(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit referral');

      setSubmitStatus('success');
      setSubmitMessage('Thank you for submitting your referral code application! We\'ll be in touch soon.');
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        title: '',
        phone: '',
        email: '',
        referralCode: '',
        issue: '',
      });
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('There was a problem submitting the form. Please try again later.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heroTitle}>Referral Registration</h1>
      <p className={styles.heroSubtitle}>
        Share the benefits of TuCielo HOA Financing with others. Complete this form to refer a potential client.
      </p>

      <form className={styles.registrationForm} onSubmit={handleSubmit}>
        {submitStatus && (
          <div role="alert" style={{
            padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem',
            background: submitStatus === 'success' ? '#dcfce7' : '#fef2f2',
            color: submitStatus === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${submitStatus === 'success' ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {submitMessage}
          </div>
        )}
        <div className={styles.nameRow}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title">Title / Role</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="referralCode">Affiliate Referral Code</label>
          <input
            id="referralCode"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="issue">
            What is the main issue you would like to address with TuCielo HOA Financing Program?
          </label>
          <textarea
            id="issue"
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={!isFormValid}>
          Submit Referral
        </button>
      </form>
    </div>
  );
}
