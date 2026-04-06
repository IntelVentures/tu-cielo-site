import Head from 'next/head';
import Layout from '../components/Layout';
import ContractorProposalTool from '../components/contractor-proposal-tool.jsx';

export default function CalculatorPage() {
  return (
    <Layout>
      <Head>
        {/* Basic SEO */}
        <title>HOA Loan Calculator | TuCielo</title>
        <meta
          name="description"
          content="Use TuCielo’s HOA loan calculator to estimate project financing costs, explore repayment options, and plan your community’s budget with confidence."
        />
        <meta
          name="keywords"
          content="HOA loan calculator, HOA financing tool, HOA proposal tool, community project funding, TuCielo"
        />
        <meta name="author" content="TuCielo" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="HOA Loan Calculator | TuCielo" />
        <meta
          property="og:description"
          content="Estimate HOA project financing with TuCielo’s interactive loan calculator. Get instant insights into costs and repayment options."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tucielofinancing.com/Calculator" />
        <meta
          property="og:image"
          content="https://www.tucielofinancing.com/images/cloud_logo.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HOA Loan Calculator | TuCielo" />
        <meta
          name="twitter:description"
          content="Estimate HOA project financing with TuCielo’s interactive loan calculator. Get instant insights into costs and repayment options."
        />
        <meta
          name="twitter:image"
          content="https://www.tucielofinancing.com/images/cloud_logo.jpg"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1975E3" />
      </Head>

      {/* Proposal tool */}
      <ContractorProposalTool />

    </Layout>
  );
}
