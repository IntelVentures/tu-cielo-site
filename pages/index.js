// pages/index.js
import Head from 'next/head';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PrequalCTA from '../components/PrequalCTA';
import PrequalificationForm from '../components/PrequalificationForm';
import HowItWorks from '../components/HowItWorks';
import Contact from '../components/Contact';
import PrivacyModal from '../components/PrivacyModal';
import InsightsModal from '../components/InsightsModal';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showPrequalForm, setShowPrequalForm] = useState(false);

  // "Apply Now" in the header dispatches this event to open the prequal form
  useEffect(() => {
    const openPrequal = () => {
      setShowPrequalForm(true);
      setTimeout(() => {
        document.getElementById('prequal-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
    window.addEventListener('tc:open-prequal', openPrequal);
    return () => window.removeEventListener('tc:open-prequal', openPrequal);
  }, []);

  return (
    <Layout>
      <Head>
        {/* Primary SEO */}
        <title>TuCielo | Fast & Transparent HOA Financing Solutions</title>
        <meta name="description" content="TuCielo makes HOA financing simple, transparent, and accessible. Apply online, track progress, and fund community projects with ease." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.tucielofinancing.com/" />
        {/* Open Graph */}
        <meta property="og:title" content="TuCielo | HOA Financing Made Simple" />
        <meta property="og:description" content="Fast, transparent HOA financing for your community. Apply online today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tucielofinancing.com/" />
        <meta property="og:image" content="https://www.tucielofinancing.com/images/cloud_logo.jpg" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TuCielo | HOA Financing Made Simple" />
        <meta name="twitter:description" content="Fast, transparent HOA financing for your community." />
        <meta name="twitter:image" content="https://www.tucielofinancing.com/images/cloud_logo.jpg" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1975E3" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TuCielo",
              description: "Long-term, fixed-rate HOA financing for Florida communities — without special assessments, personal guarantees, or bank red tape.",
              url: "https://www.tucielofinancing.com/",
              logo: "https://www.tucielofinancing.com/images/cloud_logo.jpg",
              areaServed: {
                "@type": "State",
                name: "Florida",
                sameAs: "https://www.wikidata.org/wiki/Q812"
              },
              offers: {
                "@type": "Offer",
                description: "HOA loans from $1M to $10M+, fixed-rate terms up to 25 years, no personal guarantees."
              }
            }),
          }}
        />
      </Head>

      <Hero setShowInsightsModal={setShowInsightsModal} />
      <Features />

      <PrequalCTA onStart={() => {
        setShowPrequalForm(true);
        setTimeout(() => {
          document.getElementById("prequal-form")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }} />

      <div id="prequal-form">
        <PrequalificationForm
          showForm={showPrequalForm}
          setShowForm={setShowPrequalForm}
        />
      </div>

      <HowItWorks />
      <Contact setShowPrivacyModal={setShowPrivacyModal} />

      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
      {showInsightsModal && <InsightsModal onClose={() => setShowInsightsModal(false)} />}
    </Layout>
  );
}
