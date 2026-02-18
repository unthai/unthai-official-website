import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Services from '../components/Services';
import { useLanguage } from '../LanguageContext';
import heroBg from '../assets/unthai-ai-automation-bg.png';

const ServicesPage = () => {
    const { t } = useLanguage();
    return (
        <div style={{ background: 'var(--color-primary)', minHeight: '100vh', color: 'var(--color-text-main)' }}>
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
            <main>
                <Services showActions={false} />
            </main>

            <Footer />
        </div>
    );
};

export default ServicesPage;
