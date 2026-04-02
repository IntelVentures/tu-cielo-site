import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import FAQ from "../components/faq.js";
import PrivacyModal from "../components/PrivacyModal";
import InsightsModal from "../components/InsightsModal";

export default function FAQPage() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);

  return (
    <Layout>
      <Head>
        {/* Basic SEO */}
        <title>HOA Financing FAQ | TuCielo</title>
        <meta
          name="description"
          content="Find answers to common questions about TuCielo’s HOA financing solutions. Learn how to apply, eligibility requirements, loan terms, and more."
        />
        <meta
          name="keywords"
          content="HOA financing FAQ, HOA loan questions, TuCielo HOA, community financing help"
        />
        <meta name="author" content="TuCielo" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="HOA Financing FAQ | TuCielo" />
        <meta
          property="og:description"
          content="Get answers to the most frequently asked questions about TuCielo HOA financing. Learn how we help communities fund their projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tucielofinancing.com/FAQ" />
        <meta
          property="og:image"
          content="https://www.tucielofinancing.com/images/cloud_logo.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HOA Financing FAQ | TuCielo" />
        <meta
          name="twitter:description"
          content="Get answers to the most frequently asked questions about TuCielo HOA financing. Learn how we help communities fund their projects."
        />
        <meta
          name="twitter:image"
          content="https://www.tucielofinancing.com/images/cloud_logo.jpg"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1975E3" />
      </Head>

      {/* Renders FAQ component */}
      <FAQ />

      {/* Modals */}
      {showPrivacyModal && (
        <PrivacyModal onClose={() => setShowPrivacyModal(false)} />
      )}
      {showInsightsModal && (
        <InsightsModal onClose={() => setShowInsightsModal(false)} />
      )}
    </Layout>
  );
}
