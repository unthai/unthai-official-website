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
                location: [
                    {
                        '@type': 'Place',
                        name: 'UNTH.AI Bangkok',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: 'Bangkok',
                            addressCountry: 'TH',
                        },
                    },
                    {
                        '@type': 'Place',
                        name: 'UNTH.AI Osaka',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: 'Osaka',
                            addressCountry: 'JP',
                        },
                    },
                ],
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
            {
                '@type': 'HowTo',
                name: 'How UNTH.AI delivers AI systems',
                description: 'From first call to live system in days — not months.',
                step: [
                    {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Discovery Call',
                        text: 'We map your business goals, pain points, and current stack in a focused 30-minute session.',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Custom AI Blueprint',
                        text: 'Our team designs a tailored system — agents, automations, content pipelines — built for your exact needs.',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Launch & Scale',
                        text: 'We build, deploy, and monitor. You get working systems, not PowerPoints. Iterate weekly.',
                    },
                ],
            },
            {
                '@type': 'ItemList',
                name: 'UNTH.AI Services',
                description: 'Production-grade AI systems: autonomous agents, workflow automation, content engines, voice AI, and growth systems.',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Autonomous AI Agents',
                        description: 'Agents that own outcomes — sales follow-up, support resolution, ops monitoring.',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Workflow Automation',
                        description: 'n8n pipelines connecting 15+ business apps into unified, error-tolerant workflows.',
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: 'AI Content Engines',
                        description: 'Production-scale content pipelines: images, video, voice, and scheduling.',
                    },
                    {
                        '@type': 'ListItem',
                        position: 4,
                        name: 'AI Voice Intelligence',
                        description: '24/7 multilingual voice agents for hospitality, bookings, and support.',
                    },
                    {
                        '@type': 'ListItem',
                        position: 5,
                        name: 'AI Growth Strategy',
                        description: 'Automated lead sourcing, enrichment, and multi-channel outreach.',
                    },
                ],
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
