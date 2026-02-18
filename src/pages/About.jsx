import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../lib/strapi';

import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageContext';
import aboutBg from '../assets/unthai-ai-automation-bg.png';

const About = () => {
    const { t, language } = useLanguage();
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        const loadAbout = async () => {
            try {
                const data = await fetchAPI('/about-page', {
                    locale: language,
                    populate: 'values'
                });
                if (data && data.data && data.data.attributes) {
                    setAboutData(data.data.attributes);
                }
            } catch (error) {
                console.error("Failed to load About data:", error);
            }
        };
        loadAbout();
    }, [language]);

    // Fallback logic
    const heroTitle = aboutData?.heroTitle || t('about.hero.title');
    const heroSubtitle = aboutData?.heroSubtitle || t('about.hero.subtitle');
    const heroDesc = aboutData?.heroDescription || t('about.hero.description');

    // Mission & Name sections mappings
    const missionTitle = t('about.mission.title');
    const missionText = aboutData?.missionText || t('about.mission.text');
    const missionMarketLabel = t('about.mission.market');
    const missionMarketText = aboutData?.missionMarket || t('about.mission.marketText');

    const whoTitle = t('about.who.title');
    const whoText = aboutData?.whoWeAreText || t('about.who.text');

    // Values
    let values = [];
    if (aboutData && aboutData.values) {
        values = aboutData.values.map(v => ({ title: v.title, desc: v.description }));
    } else {
        values = t('about.values.items');
    }

    // Map icons and keys for values
    const valueIcons = ['⚡', '🔄', '🎯'];

    return (
        <div style={{ background: 'var(--color-primary)', minHeight: '100vh', color: 'var(--color-text-main)' }}>
            <Header />

            {/* 1. Hero: The UNTHAI Mandate */}
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
                    backgroundImage: `url(${aboutBg})`,
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

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '1400px' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            fontSize: 'clamp(32px, 5vw, 64px)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '24px',
                            background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 30px rgba(255,255,255,0.1)'
                        }}
                    >
                        {heroTitle}<br />
                        <span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'initial' }}>{heroSubtitle}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(18px, 2vw, 24px)',
                            color: 'var(--color-text-muted)',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}
                    >
                        {t('about.hero.description')}
                    </motion.p>
                </div>
            </section>

            {/* 2. The Core Identity */}
            <section className="section-padding container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginBottom: '24px'
                }}>
                    {/* Block 1: The Name */}
                    <div style={{
                        padding: '40px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--color-surface)',
                        borderRadius: 'var(--radius-lg)',
                        height: '100%'
                    }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '24px', color: 'var(--color-accent)' }}>{t('about.name.title')}</h2>
                        <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>UNTHAI =</h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li style={{ fontSize: '18px' }}>
                                <strong style={{ color: '#fff' }}>"{t('about.name.thai.bold')}"</strong> <span style={{ color: 'var(--color-text-muted)' }}>{t('about.name.thai.text')}</span>
                            </li>
                            <li style={{ fontSize: '18px' }}>
                                <strong style={{ color: '#fff' }}>"{t('about.name.untie.bold')}"</strong> <span style={{ color: 'var(--color-text-muted)' }}>{t('about.name.untie.text')}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Block 2: The Mission */}
                    <div style={{
                        padding: '40px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--color-surface)',
                        borderRadius: 'var(--radius-lg)',
                        height: '100%'
                    }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '24px', color: 'var(--color-accent)' }}>{missionTitle}</h2>
                        <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                            {missionText}
                        </p>
                        <div style={{ marginTop: '24px', fontSize: '16px', color: 'var(--color-text-muted)' }}>
                            <span style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: 600 }}>{missionMarketLabel}</span>
                            {missionMarketText}
                        </div>
                    </div>
                </div>

                {/* Block 3: Who We Are (Full Width) */}
                <div style={{
                    padding: '40px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    width: '100%'
                }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '24px', color: 'var(--color-accent)' }}>{whoTitle}</h2>
                    <p style={{ fontSize: '20px', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                        {whoText}
                    </p>
                </div>
            </section>

            {/* 3. Our Value Hierarchy (Moved into full-width dark section) */}
            <section className="section-padding" style={{ background: '#030b17' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '40px', marginBottom: '16px' }}>{t('about.values.title')}</h2>
                        <p style={{ fontSize: '18px', color: 'var(--color-text-muted)' }}>{t('about.values.subtitle')}</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px'
                    }}>
                        {values.map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                style={{
                                    padding: '40px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid var(--color-surface)',
                                    borderRadius: 'var(--radius-lg)',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '40px', marginBottom: '24px' }}>
                                    {valueIcons[index % valueIcons.length]}
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>{item.title}</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
