// components/blogposts.js
import React, { useState } from 'react';
import styles from '../styles/BlogPosts.module.css';

export default function BlogPosts() {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [userId] = useState(() => {
    if (typeof window === 'undefined') return 'anon';
    let id = localStorage.getItem('tc_user_id');
    if (!id) { id = Math.random().toString(36).slice(2, 9); localStorage.setItem('tc_user_id', id); }
    return id;
  });

  const handleSubmit = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments(prev => [...prev, { id: Date.now(), text, userId }]);
    setCommentText('');
  };

  return (
    <section className={styles.blogSection}>
      <div className={styles.blogWrap}>

        {/* Article header */}
        <header className={styles.articleHeader}>
          <p className={styles.blogLabel}>Blog</p>
          <h1 className={styles.articleTitle}>
            The Florida HOA Financing Crisis: Why Traditional Banks Are Failing
            Communities When They Need Capital Most
          </h1>
          <p className={styles.articleMeta}>TuCielo Research · 2025</p>
        </header>

        {/* Article body */}
        <article className={styles.articleBody}>
          <p>
            <em>
              I have spent months analyzing the unprecedented challenges facing
              Florida&apos;s condominium communities. What I&apos;ve discovered
              reveals a fundamental breakdown in how traditional lenders approach
              HOA financing in our post-Surfside reality.
            </em>
          </p>

          <h2>The Numbers Tell a Devastating Story</h2>
          <p>The financial pressure on Florida HOAs has reached crisis levels, and the data is staggering:</p>

          <h3>Skyrocketing Costs</h3>
          <ul>
            <li>Median monthly HOA fees surged 68% in just three years — from $232 in 2022 to $390 in April 2025</li>
            <li>Tampa leads with a 17.2% year-over-year increase, followed by Orlando at 16.7%</li>
            <li>Miami commands the highest fees at $835 monthly</li>
          </ul>

          <h3>Assessment Shock</h3>
          <ul>
            <li>Special assessments now range from $500 to over $400,000 per unit</li>
            <li>Individual owners report assessment bills exceeding $10,000 in a single year</li>
            <li>Structural repairs alone can cost $15,000 to $75,000 per unit</li>
          </ul>

          <h3>Market Displacement</h3>
          <ul>
            <li>Buildings over 30 years old have lost 22% of their value in just two years</li>
            <li>Over 1,400 Florida condo associations are blacklisted from Fannie Mae financing</li>
            <li>Condo inventory has reached 9.7 months of supply, compared to 5.3 months for single-family homes</li>
          </ul>

          <p>These aren&apos;t just statistics — they represent families being displaced from their homes and communities being torn apart by financial impossibility.</p>

          <h2>The Post-Surfside Regulatory Reality</h2>
          <p>
            The tragic Champlain Towers South collapse exposed decades of deferred maintenance and inadequate financial planning.
            Florida&apos;s response was swift and comprehensive.
          </p>
          <h3>New Mandates Include</h3>
          <ul>
            <li>Milestone structural inspections for buildings 25–30+ years old</li>
            <li>Structural Integrity Reserve Studies (SIRS) every 10 years</li>
            <li>Full reserve funding with no more waivers</li>
            <li>Compliance deadlines that initially seemed impossible to meet</li>
          </ul>
          <p>
            While these regulations are absolutely necessary for public safety, they&apos;ve created an immediate financial reckoning.
            Associations that deferred maintenance for decades now face compressed timelines to fund millions in repairs —
            exactly when traditional financing has become unavailable.
          </p>

          <h2>Why Traditional Banks Are Retreating</h2>
          <h3>Risk Model Mismatch</h3>
          <ul>
            <li><strong>Personal guarantees required:</strong> Banks want board members to personally guarantee million-dollar loans</li>
            <li><strong>Perfect metrics demanded:</strong> Many banks cap approvals at 7% delinquency</li>
            <li><strong>Short-term thinking:</strong> Banks offer 2–5 year terms, creating refinancing risk</li>
          </ul>

          <h3>Compliance Cost Confusion</h3>
          <p>Banks see post-Surfside compliance requirements as additional risk factors rather than necessary investments in long-term viability.</p>

          <h3>Operational Inflexibility</h3>
          <p>Traditional banks require extensive banking relationships, perfect documentation, and 90–120 day approval timelines. Communities facing compliance deadlines can&apos;t wait four months for a &quot;maybe.&quot;</p>

          <h2>The Hidden Cost of Inaction</h2>
          <p><strong>Special Assessment Shock:</strong> A $2 million repair project in a 100-unit building means $20,000 per unit immediately.</p>
          <p><strong>Community Displacement:</strong> Unable to pay massive assessments, long-term residents are forced to sell at depressed prices, destroying the social fabric that makes communities valuable.</p>
          <p><strong>Property Value Destruction:</strong> Buildings with identified structural issues and pending massive assessments become unsaleable, creating a downward spiral that hurts everyone.</p>

          <h2>A Different Approach: Assessment Lien Financing</h2>
          <h3>Security That Makes Sense</h3>
          <p>Instead of personal guarantees, we secure loans with assessment lien rights — the association&apos;s legal ability to levy payments on unit owners. This creates predictable cash flow without personal risk to board members.</p>

          <h3>Crisis-Ready Underwriting</h3>
          <p>We evaluate factors that actually matter for HOA success: community stability, long-term viability of the property, compliance readiness, and professional management quality.</p>

          <h3>Realistic Terms</h3>
          <p>Our 25-year amortization schedules turn crushing special assessments into manageable monthly payments. A $20,000 per unit assessment becomes approximately $208 per month — the difference between displacement and stability.</p>

          <h2>The Path Forward</h2>
          <p>
            Florida&apos;s HOA financing crisis will only deepen as compliance deadlines approach and traditional banks continue their retreat.
            Communities need lenders who understand that post-Surfside regulations aren&apos;t risks to avoid — they&apos;re necessary investments in long-term viability.
          </p>
          <p>
            At TuCielo, we&apos;re building the financing infrastructure that Florida HOAs need to navigate this crisis while preserving the communities that millions call home.
            Because every 78-year-old facing a $47,000 assessment deserves better than displacement from the home they&apos;ve loved for decades.
          </p>
        </article>

        {/* Comments */}
        <div className={styles.comments}>
          <h3 className={styles.commentsTitle}>Leave a Comment</h3>
          <textarea
            className={styles.commentTextarea}
            placeholder="Write your comment here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
          />
          <button className={styles.commentSubmit} onClick={handleSubmit}>
            Submit Comment
          </button>
          <div className={styles.commentList}>
            {comments.length === 0
              ? <p className={styles.noComments}>No comments yet. Be the first!</p>
              : comments.map(({ id, text, userId: cUid }) => (
                  <div key={id} className={styles.commentItem}>
                    <span>{text}</span>
                    {cUid === userId && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setComments(prev => prev.filter(c => c.id !== id))}
                        aria-label="Delete comment"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
            }
          </div>
        </div>

      </div>
    </section>
  );
}
