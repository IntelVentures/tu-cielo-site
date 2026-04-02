// components/faq.js
import React, { useState } from "react";
import styles from "../styles/FAQ.module.css";

const FAQS = [
  {
    q: "What types of projects are eligible?",
    a: "We finance a wide range of capital improvements including roofing, paving, elevators, HVAC systems, pool renovations, and more.",
  },
  {
    q: "Can we finance reserve shortfalls?",
    a: "Yes. Our financing can cover reserve shortfalls identified in your reserve study or any upcoming capital needs your community faces.",
  },
  {
    q: "How long does the process take?",
    a: "Most communities receive funding within 30 to 45 days from initial consultation to closing — far faster than traditional bank timelines.",
  },
  {
    q: "Is personal homeowner credit required?",
    a: "No. We do not require individual homeowner credit checks or personal guarantees from board members.",
  },
  {
    q: "What loan amounts are available?",
    a: "We offer financing from $1M to $10M+, with 25-year fixed-rate terms to keep monthly payments predictable for your community.",
  },
  {
    q: "How is the loan secured?",
    a: "Loans are secured with assessment lien rights — the association's legal ability to levy payments on unit owners — not personal guarantees.",
  },
  {
    q: "Are there prepayment penalties?",
    a: "We offer flexible terms. Ask your TuCielo advisor about prepayment options during your initial consultation.",
  },
  {
    q: "What documents do we need to apply?",
    a: "Typically: current reserve study, recent financial statements, board meeting minutes, and the association's governing documents. Our team guides you through every step.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={styles.faqSection} id="faq">
      <div className={styles.faqWrap}>

        {/* Section header */}
        <div className={styles.faqHeader}>
          <p className={styles.faqLabel}>FAQ</p>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <p className={styles.faqSub}>
            Everything you need to know about HOA financing with TuCielo.
          </p>
        </div>

        {/* Accordion */}
        <div className={styles.accordion}>
          {FAQS.map((item, i) => (
            <div
              key={i}
              className={`${styles.accordionItem} ${openIndex === i ? styles.open : ""}`}
            >
              <button
                className={styles.accordionQuestion}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span>{item.q}</span>
                <span className={styles.accordionIcon} aria-hidden="true">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className={styles.accordionAnswer}>
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
