import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import Blog from "../components/blogposts.js";
import PrivacyModal from "../components/PrivacyModal";
import InsightsModal from "../components/InsightsModal";

export default function BlogPage() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);

  return (
    <Layout>
      <Head>
        {/* Basic SEO */}
        <title>HOA Financing Insights & Resources | TuCielo Blog</title>
        <meta
          name="description"
          content="Stay informed with TuCielo’s HOA financing blog. Explore guides, case studies, and insights to help your community fund and manage projects."
        />
        <meta
          name="keywords"
          content="HOA financing blog, HOA insights, community project funding, HOA resources, TuCielo articles"
        />
        <meta name="author" content="TuCielo" />

        {/* Open Graph / Facebook */}
        <meta
          property="og:title"
          content="HOA Financing Insights & Resources | TuCielo Blog"
        />
        <meta
          property="og:description"
          content="Stay informed with TuCielo’s HOA financing blog. Explore guides, case studies, and insights to help your community fund and manage projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tucielofinancing.com/Blog" />
        <meta
          property="og:image"
          content="https://www.tucielofinancing.com/images/cloud_logo.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="HOA Financing Insights & Resources | TuCielo Blog"
        />
        <meta
          name="twitter:description"
          content="Stay informed with TuCielo’s HOA financing blog. Explore guides, case studies, and insights to help your community fund and manage projects."
        />
        <meta
          name="twitter:image"
          content="https://www.tucielofinancing.com/images/cloud_logo.jpg"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1975E3" />
      </Head>

      {/* Blog component */}
      <Blog />

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



