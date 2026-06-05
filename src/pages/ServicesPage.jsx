import React from 'react';
import { motion } from 'framer-motion';
import Seo, { SITE_URL } from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DetailedServices from '../components/DetailedServices';
import { useLanguage } from '../LanguageContext';
import heroBg from '../assets/unthai-ai-automation-bg.webp';

const ServicesPage = () => {
    const { t, language } = useLanguage();
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                serviceType: 'AI development, automation, and content engineering',
                provider: { '@type': 'Organization', name: 'UNTH.AI', url: SITE_URL },
                areaServed: 'Worldwide',
                url: `${SITE_URL}/services`,
                description: 'AI agents, workflow automation (n8n / custom), and content production systems built for measurable business outcomes.',
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
                    { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
                ],
            },
            {
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What does UNTH.AI build?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'We build production-grade AI systems: autonomous agents that own outcomes (sales follow-up, support resolution, ops monitoring), workflow automation pipelines on n8n and custom stacks, content engines that produce and publish at scale, and custom AI systems built on Claude, GPT, Gemini, and open-weight models.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How long does it take to deploy an AI agent or workflow?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Most automation workflows go live within 1-2 weeks. AI agents with custom tool access typically take 3-4 weeks depending on integration complexity. We ship incrementally — you see value before the full system is complete.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What kind of businesses do you work with?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'We work with SaaS companies, e-commerce brands, real estate agencies, hospitality groups, content publishers, and professional service firms across APAC, Europe, and North America. Our clients range from funded startups to established enterprises needing production-grade AI systems.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Do you build custom AI solutions or use existing platforms?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Both. We use n8n as our primary workflow engine (self-hosted for data privacy), pair it with custom Node.js/Python middleware where needed, and integrate with Claude, GPT, Gemini, and open-weight models. Every solution is tailored to the client\'s stack and data requirements.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How do you measure success?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'By outcomes, not activity. We define clear KPIs before building: hours saved per week, lead response time reduction, conversion rate lift, or revenue directly attributable to the system. Every deployment has a measurable ROI target.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Do you offer ongoing support after deployment?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. Every deployment includes a stabilisation period (2-4 weeks of active monitoring) followed by an optional retainer for ongoing optimisation, maintenance, and scaling. We treat our systems as living products, not handoffs.',
                        },
                    },
                ],
            },
        ],
    };
    return (
        <div style={{ background: 'var(--color-primary)', minHeight: '100vh', color: 'var(--color-text-main)' }}>
            <Seo
                title="Services"
                description="AI agents, workflow automation, and content engines built for measurable business outcomes."
                path="/services"
                lang={language}
                jsonLd={jsonLd}
            />
            <Header />

            {/* Hero Section */}
            <section style={{
                position: 'relative',
                minHeight: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                paddingTop: '100px',
                paddingBottom: '32px'
            }}>
                {/* Background Effect - Full Width Image with Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.4,
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(5, 18, 36, 0.4), var(--color-primary) 90%)',
                    zIndex: 0
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '1000px' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            fontSize: 'clamp(32px, 5vw, 56px)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '24px',
                            background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        {t('servicesPage.title')}<br />
                        <span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'initial' }}>{t('servicesPage.subtitle')}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(16px, 2vw, 20px)',
                            color: 'var(--color-text-muted)',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}
                    >
                        {t('servicesPage.description')}
                    </motion.p>
                </div>
            </section>

            {/* Services Section */}
            <main id="main-content">
                <DetailedServices />
            </main>

            <Footer />
        </div>
    );
};

export default ServicesPage;
