import React from 'react';
import Seo, { SITE_URL } from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import LeadForm from '../components/LeadForm';
import Newsletter from '../components/Newsletter';

const HomeV1 = () => {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${SITE_URL}/#organization`,
                name: 'UNTH.AI',
                url: SITE_URL,
                logo: `${SITE_URL}/unthai-logo.png`,
                sameAs: [
                    'https://twitter.com/UnthaiHQ',
                    'https://www.linkedin.com/company/unthai',
                ],
                description: 'AI-powered creative and automation agency. Builds AI systems, agents, and content engines for businesses.',
            },
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                url: SITE_URL,
                name: 'UNTH.AI',
                publisher: { '@id': `${SITE_URL}/#organization` },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${SITE_URL}/blog?q={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                },
            },
        ],
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Seo
                title="UNTH.AI — AI-Powered Creative & Automation Agency"
                description="We build AI systems, automation workflows, and content engines that deliver real results for your business."
                path="/"
                jsonLd={jsonLd}
            />
            <Header />
            <main id="main-content" style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
                <Hero />
                <StatsBar />
                <Services showActions={false} showMainAction={true} />
                <HowItWorks />
                <Testimonials />
                <LeadForm />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
};

export default HomeV1;
