// components/HowItWorks.js
// IV2.0 pillars pattern: section → wrap → split header + individual step cards.
// No card wrapper around the entire section.
import styles from '../styles/HowItWorks.module.css';

const steps = [
  {
    num: '01',
    title: 'Consultation & Pre-Qualification',
    body: "A brief conversation with our team to understand your community's needs, project scope, and financial position. No credit pull, no commitment — just clarity.",
    tags: ['Free consultation', 'No credit check', 'Board-friendly'],
  },
  {
    num: '02',
    title: 'Customized Financing Proposal',
    body: "We design a loan structure tailored to your HOA — fixed rates, long terms, and flexible repayment aligned to your community's budget and project timeline.",
    tags: ['Fixed rates', 'Up to 25 years', 'No PG'],
  },
  {
    num: '03',
    title: 'Board Approval & Funding',
    body: 'Once your board approves, we move fast. From final application to funded — typically 30 to 45 days. No appraisals. No unit-level credit checks.',
    tags: ['30–45 days', 'No appraisals', 'Fast close'],
  },
];

export default function HowItWorks() {
  return (
    <section className={`tc-section ${styles.howSection}`} id="how-it-works">
      <div className="tc-wrap">

        {/* ── Split header (IV2.0 pillars-header pattern) ── */}
        <div className={`${styles.sectionHeader} reveal`}>
          <div className={styles.headerLeft}>
            <span className="tc-label">How It Works</span>
            <h2 className="tc-title">
              Three steps.<br />
              <em>One simple path.</em>
            </h2>
          </div>
          <p className={`tc-body-lg ${styles.headerDesc}`}>
            No appraisals. No unit-level credit checks. No red tape.
            Just a straightforward process designed for HOA boards.
          </p>
        </div>

        {/* ── Step cards — individual items, not a section wrapper ── */}
        <div className={`${styles.stepsGrid} stagger`}>
          {steps.map((step) => (
            <div className={`${styles.stepCard} tc-card`} key={step.num}>
              <span className={styles.stepNum} aria-hidden="true">{step.num}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
              <div className={styles.stepTags}>
                {step.tags.map((tag) => (
                  <span className={styles.tag} key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
