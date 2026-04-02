// components/Contact.js
// IV2.0 pattern: section → wrap → two-column. No card wrapper around the section.
import { useState } from 'react';
import styles from '../styles/Contact.module.css';

export default function Contact({ setShowPrivacyModal }) {
  const [formData, setFormData] = useState({
    name: '', community: '', city: '', role: '', budget: '', email: '', phone: '',
  });
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please enter both Name and Email.');
      return;
    }
    const payload = { ...formData, budget: Number(formData.budget) || 0, agreedToPrivacy, sheetName: 'Contact' };
    try {
      const res = await fetch('/api/submitContactForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let data = {};
      try { data = await res.json(); } catch { /* ignore */ }
      if (!res.ok) throw new Error(data.error || 'Network error');
      alert('Thank you! Your information has been submitted.');
      setFormData({ name: '', community: '', city: '', role: '', budget: '', email: '', phone: '' });
      setAgreedToPrivacy(false);
    } catch {
      alert('Error submitting form. Please try again later.');
    }
  };

  return (
    <section className={`tc-section ${styles.contactSection}`} id="contact-section">
      <div className="tc-wrap">

        {/* ── Two-column: copy left, form right ── */}
        <div className={styles.contactGrid}>

          {/* Left — section intro, no card */}
          <div className={`${styles.contactIntro} reveal`}>
            <span className="tc-label">Get In Touch</span>
            <h2 className="tc-title">
              Let&apos;s talk about<br />
              <em>your community&apos;s needs.</em>
            </h2>
            <p className={`tc-body-lg ${styles.introText}`}>
              Tell us about your HOA and what you&apos;re looking to fund.
              Our team will reach out within 24–48 hours with options
              tailored to your community — no obligation, no pressure.
            </p>
            <ul className={styles.trustList}>
              <li>No credit check on individual homeowners</li>
              <li>Free consultation for all board members</li>
              <li>Serving Florida HOAs statewide</li>
              <li>$1M – $10M+ loan range</li>
            </ul>
          </div>

          {/* Right — form, clean, no card wrapper */}
          <div className={`${styles.formWrapper} reveal`}>
            <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="ct-name" className={styles.label}>Full Name *</label>
                  <input id="ct-name" type="text" name="name" placeholder="Jane Smith"
                    value={formData.name} onChange={handleChange} required className={styles.input} />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="ct-role" className={styles.label}>Your Title</label>
                  <input id="ct-role" type="text" name="role" placeholder="Board President"
                    value={formData.role} onChange={handleChange} className={styles.input} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="ct-community" className={styles.label}>HOA / Community Name</label>
                <input id="ct-community" type="text" name="community" placeholder="Sunset Palms HOA"
                  value={formData.community} onChange={handleChange} className={styles.input} />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="ct-city" className={styles.label}>City</label>
                  <input id="ct-city" type="text" name="city" placeholder="Miami"
                    value={formData.city} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="ct-budget" className={styles.label}>Amount Requested ($)</label>
                  <input id="ct-budget" type="number" name="budget" placeholder="1,500,000"
                    value={formData.budget} onChange={handleChange} min="0" step="any" className={styles.input} />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="ct-email" className={styles.label}>Email *</label>
                  <input id="ct-email" type="email" name="email" placeholder="jane@sunsetpalms.org"
                    value={formData.email} onChange={handleChange} required className={styles.input} />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="ct-phone" className={styles.label}>Phone</label>
                  <input id="ct-phone" type="tel" name="phone" placeholder="(305) 555-0100"
                    value={formData.phone} onChange={handleChange} className={styles.input} />
                </div>
              </div>

              <div className={styles.privacyRow}>
                <label className={styles.privacyLabel}>
                  <input type="checkbox" checked={agreedToPrivacy}
                    onChange={() => setAgreedToPrivacy(!agreedToPrivacy)} required className={styles.checkbox} />
                  <span>
                    I agree to TuCielo&apos;s{' '}
                    <button type="button" className={styles.privacyLink} onClick={() => setShowPrivacyModal(true)}>
                      Privacy &amp; Data Management Policy
                    </button>
                  </span>
                </label>
              </div>

              <button type="submit" className={`tc-btn-primary ${styles.submitBtn}`}>
                Submit →
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
