// src/contractor-proposal-tool.jsx
import React, { useState, useEffect } from 'react'; // ✅ Make sure useEffect is imported
import { Link } from 'react-router-dom';
import './contractor-proposal-tool.css';
import './App.css';

export default function ContractorProposalTool() {
  // ✅ Inject background effect after last useState
  useEffect(() => {
    document.body.style.backgroundImage = "url('/Fluffy_Clouds_Background.png')";
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.minHeight = '100vh';

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.minHeight = '';
    };
  }, []);

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen((prev) => !prev);
    };
  
 return (
  <div className="page-container">
    {/* HEADER */}
        <header className="siteHeader">
            <div className="tucieloHeaderTop">
              <Link to="/" className="logoTitle img" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/TuCielo-Header-Logo2.png" alt="Logo" />
              </Link>
    
              <div className="betaLabel img">
                <img src="BetaProgram_Sticker.png" alt="Beta Program" />
              </div>
    
              <div className="hamburger" onClick={() => setIsMobileMenuOpen(prev => !prev)}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
    
            <div className={`headerBottom ${isMobileMenuOpen ? 'menuOpen' : ''}`}>
              <div className="headerScrollContainer">
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    document.getElementById("application-section")?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Apply
                </button>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Contact Us
                </button>
                <Link to="/faq" className="headerButtonLink">FAQ</Link>
                <Link to="/blogposts" className="headerButtonLink">Blog</Link>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    setShowPrivacyModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Privacy Policy
                </button>
              </div>
            </div>
    
            {isMobileMenuOpen && (
              <div className="mobile-menu show">
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    document.getElementById("application-section")?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Apply
                </button>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Contact Us
                </button>
                <Link to="/faq" className="headerButtonLink">FAQ</Link>
                <Link to="/blogposts" className="headerButtonLink">Blog</Link>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    setShowPrivacyModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Privacy Policy
                </button>
              </div>
            )}
    
            {showPrivacyModal && (
              <div className="privacypolicy-modal-overlay" onClick={() => setShowPrivacyModal(false)}>
                <div className="privacypolicy-modal-content" onClick={e => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setShowPrivacyModal(false)}>X</button>
                  <div className="privacypolicy-modal-body">
                    <h2>Privacy Policy</h2>
                    <p>
                      At TuCielo, we are committed to protecting the privacy of our users and the confidentiality of the data we collect.
                      This document outlines how we collect, use, and protect your information when you use our website and submit an application
                      for HOA lending services, as well as the terms and conditions for using our services.
                    </p>
                    <h3>Information We Collect</h3>
                    <ul>
                      <li>Association name, address, and contact details</li>
                      <li>Financial documents (budgets, reserve studies, project bids)</li>
                      <li>Board member and CAM contact information</li>
                      <li>Any other information submitted through our application form</li>
                    </ul>
                    <h3>How We Use Your Information</h3>
                    <p>Your data is used exclusively for the purpose of evaluating and processing your HOA loan application. We do not sell or rent your personal information.</p>
                    <h3>Consent</h3>
                    <p>By submitting your information through our website, you consent to our use of your data in accordance with this policy. Consent is obtained explicitly via checkboxes on our application form.</p>
                    <h3>Data Retention</h3>
                    <p>We retain submitted documents for no more than 180 days unless an active loan application is in process. Files are automatically deleted thereafter.</p>
                    <h3>Data Security</h3>
                    <p>We use industry-standard encryption (HTTPS, AES-256) to protect all data transfers and storage. Access to uploaded files is restricted to authorized TuCielo personnel only.</p>
                    <h3>Your Rights</h3>
                    <p>You may request access, correction, or deletion of your data by contacting us at tucielofinancing.com.</p>
                    <h3>Updates</h3>
                    <p>This Privacy Policy may be updated periodically. Continued use of the site constitutes acceptance of the updated terms.</p>
    
                    <h2>Terms of Service</h2>
                    <h3>Acceptance of Terms</h3>
                    <p>By using this website and submitting information, you agree to these Terms of Service and our Privacy Policy.</p>
                    <h3>Use of Services</h3>
                    <p>You agree to use our services for lawful purposes only and to provide accurate, non-fraudulent information.</p>
                    <h3>Document Uploads</h3>
                    <p>You acknowledge that uploaded documents must be HOA-approved and free of viruses or malicious content. Only PDF, DOCX, XLS, and CSV formats are accepted. Maximum file size is 25MB.</p>
                    <h3>No Guarantee of Financing</h3>
                    <p>Submission of an application does not guarantee loan approval. TuCielo reserves the right to deny applications at our sole discretion.</p>
                    <h3>Intellectual Property</h3>
                    <p>All content on this website is the property of TuCielo and may not be reproduced without written consent.</p>
                    <h3>Limitation of Liability</h3>
                    <p>TuCielo shall not be liable for any indirect or consequential damages arising from the use of this site or our services.</p>
                    <h3>Governing Law</h3>
                    <p>These terms shall be governed by the laws of the State of Florida.</p>
                    <h3>Contact</h3>
                    <p>For questions regarding these Terms, contact us at tucielofinancing.com.</p>
                  </div>
                </div>
              </div>
            )}
          </header>

    {/* Main content */}
    <div className="calculator-wrapper">
      <TuCieloCalculator />
    </div>

   {/* FOOTER */}
      <footer className="site-footer">
        <p>© 2025 Tu Cielo. All rights reserved.</p>
        <br></br>
        <p>
          Disclaimer: TuCielo and any affiliated entities do not provide installation services and are not government agencies. All terms, conditions,
          and results are project-specific and may vary. Financing terms may change and are subject to TuCielo’s underwriting criteria without prior
          notice. Payment estimates are for budgeting purposes only and are based on total financed amounts. TuCielo financing is repaid through your
          HOA, and monthly payments may vary based on loan term, interest rate, fees, number of units, and other covenants agreed upon between the HOA
          and the lender. This website does not constitute an offer to lend. Please consult a TuCielo representative for personalized estimates.
        </p>
      </footer>
  </div>
);
}

function TuCieloCalculator() {
  const [units, setUnits] = useState(50);
  const [cost, setCost] = useState(1000000);
  const [term, setTerm] = useState(25);
  const [showTable, setShowTable] = useState(false);
  const [showFees, setShowFees] = useState(false);

  const rate = 0.0999;
  const monthlyRate = rate / 12;
  const totalPayments = term * 12;

  const originationFee = cost * 0.05;
  const tempMonthlyPayment = (cost * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
  const debtServiceReserve = tempMonthlyPayment * 10;
  const totalLoan = cost + originationFee + debtServiceReserve;

  const monthlyPayment = (totalLoan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
  const perUnitPayment = monthlyPayment / units;

  const generateAmortization = () => {
    let balance = totalLoan;
    const schedule = [];
    for (let i = 1; i <= totalPayments; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal,
        interest,
        balance: balance > 0 ? balance : 0
      });
    }
    return schedule;
  };

  const formatNumber = (num) =>
    num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const amortizationTable = generateAmortization();
 
  return (
     <div className="contractor-proposal-tool" style={{ marginTop: 30 }}>
          
      <label>Number of Units</label>
      <input
        type="number"
        value={units}
        min={1}
        onChange={(e) => setUnits(Number(e.target.value))}
        className="input"
      />

      <label>Cost of Project or Reserves to Finance: ${cost.toLocaleString()}</label>
      <input
        type="range"
        min={1000000}
        max={10000000}
        step={50000}
        value={cost}
        onChange={(e) => setCost(Number(e.target.value))}
      />

      <label>Select Loan Term</label>
      <select
        value={term}
        onChange={(e) => setTerm(Number(e.target.value))}
        className="input"
      >
        <option value={10}>10 Years</option>
        <option value={15}>15 Years</option>
        <option value={20}>20 Years</option>
        <option value={25}>25 Years</option>
      </select>

      <div>
        <p><strong>Interest Rate:</strong> {(rate * 100).toFixed(2)}%</p>
        <p><strong>Term:</strong> {term} Years</p>

        <button onClick={() => setShowFees(!showFees)} style={{ marginBottom: 10 }}>
          {showFees ? "Hide Fees and Total Financed Amount" : "Show Fees and Total Financed Amount"}
        </button>

        {showFees && (
          <div>
            <p><strong>Origination Fee:</strong> ${formatNumber(originationFee)}</p>
            <p><strong>Debt Service Coverage Reserve:</strong> ${formatNumber(debtServiceReserve)}</p>
            <p><strong>Total Financed Amount:</strong> ${formatNumber(totalLoan)}</p>
          </div>
        )}

        <p><strong>Total Monthly Payment Association:</strong> ${formatNumber(monthlyPayment)}</p>
        <p className="text-xl"><strong>Monthly Payment Per Unit:</strong> ${formatNumber(perUnitPayment)}</p>
      </div>

      <button onClick={() => setShowTable(!showTable)} style={{ marginTop: 15 }}>
        {showTable ? "Hide Amortization Table" : "Show Amortization Table"}
      </button>

      {showTable && (
        <div className="overflow-auto" style={{ maxHeight: 300, marginTop: 15 }}>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationTable.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>${formatNumber(item.payment)}</td>
                  <td>${formatNumber(item.principal)}</td>
                  <td>${formatNumber(item.interest)}</td>
                  <td>${formatNumber(item.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="info-section">
        <h3>Before You Begin</h3>
        <p>Please gather the following information:</p>
        <ul>
          <li>1. HOA legal entity name</li>
          <li>2. Number of units</li>
          <li>3. Year built of condominium</li>
          <li>4. Contact Info</li>
          <li>5. Type of project</li>
          <li>6. Cost of improvement/Reserves</li>
          <li>7. Loan amount needed</li>
          <li>8. Average monthly dues per Unit</li>
          <li>9. Current reserve fund balance</li>
          <li>10. Annual Operating Budget</li>
          <li>11. Delinquency Rate Percentage</li>
          <li>12. Reserves studies PDF (500MB max)</li>
          <li>13. Annual Budget PDF (500MB max)</li>
        </ul>
      </section>

      <button
        className="back-to-main"
        onClick={() => window.location.href = '/'}
      >
        Back to TuCielo
      </button>     
    
    {/* ESTIMATE SECTION */}
      <section className="estimate-wrapper">
        <div className="payment-estimate-section">
          <h2>What Could Your Association Payment Look Like?</h2>
          <div className="payment-breakdown-wrapper">
            <div className="payment-breakdown">

              <img
                src="/Free_Custom_Estimate_no_background.png"
                alt="Free Custom Estimate"
                className="estimate-image"
              />

              {/* Static Button – now non-functional */}
              <div style={{ textAlign: "center" }}>
                <button className="cta-button" disabled>
                  Get Your FREE Custom Estimate
                </button>
              </div>

              <p className="payment-note">
                No hammer clause | DSCR included | Fixed-rate periods up to 12.5 years
              </p>

            </div>
          </div>
        </div>
      </section>
  
    </div>

    
  );
}
