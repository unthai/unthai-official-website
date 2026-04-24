import React, { useState, useEffect } from 'react';
import { fetchAPI, getMediaURL } from '../lib/strapi';

import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { ArrowRight, Bot, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

import heroBg from '../assets/unthai-ai-automation-bg.png';

const Hero = () => {
    const { t, language } = useLanguage();
    const [activeSegment, setActiveSegment] = useState(null);
    const [heroData, setHeroData] = useState(null);

    useEffect(() => {
        const loadHeroData = async () => {
            try {
                const data = await fetchAPI('/hero', {
                    locale: language,
                    populate: 'backgroundImage'
                });
                if (data && data.data) {
                    // Strapi v5 flattens attributes into the data object
                    const attr = data.data.attributes || data.data;
                    setHeroData(attr);
                }
            } catch (error) {
                console.error("Failed to load Hero data:", error);
            }
        };
        loadHeroData();
    }, [language]);

    // Fallback to local translations if API data is missing
    const headerTitle = heroData?.titleHeader || t('hero.titleHeader');
    const accentTitle = heroData?.titleAccent || t('hero.titleAccent');
    const subtitle = heroData?.subtitle || t('hero.subtitle');

    // Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) * 0.02; // Subtle factor
        const moveY = (clientY - window.innerHeight / 2) * 0.02;
        mouseX.set(moveX);
        mouseY.set(moveY);
    };

    return (
        <section
            onMouseMove={handleMouseMove}
            style={{ position: 'relative', width: '100%', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}
        >
            {/* Background Container */}
            <div style={{
                position: 'absolute',
                top: -20, left: -20, right: -20, bottom: -20, // Negative margins for parallax bleed
                zIndex: 0,
            }}>
                {/* Parallax Image */}
                <motion.img
                    src={heroBg}
                    alt="Background"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.8,
                        scale: 1.1, // Zoom in slightly to avoid edges
                        x: mouseX,
                        y: mouseY
                    }}
                />

                {/* Gradient Overlay (Data Void) */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(180deg, rgba(5, 18, 36, 0.3) 0%, rgba(5, 18, 36, 0.6) 50%, rgba(5, 18, 36, 0.9) 100%)',
                    mixBlendMode: 'multiply'
                }} />

                {/* Automation Scanline - Vertical */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: '1px',
                        height: '100%',
                        background: 'linear-gradient(180deg, transparent, var(--color-accent), transparent)',
                        opacity: 0.3,
                        boxShadow: '0 0 15px var(--color-accent)'
                    }}
                    animate={{ left: ['-10%', '110%'] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear", delay: 1 }}
                />

                {/* Automation Scanline - Horizontal (Slow) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        left: 0,
                        height: '1px',
                        width: '100%',
                        background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
                        opacity: 0.15
                    }}
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                />

                {/* Living Pulse Overlay */}
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(246, 208, 39, 0.03), transparent 70%)',
                        mixBlendMode: 'screen'
                    }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
                <motion.div
                    style={{ marginBottom: '64px', textAlign: 'center' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'rgba(246, 208, 39, 0.05)',
                        border: '1px solid rgba(246, 208, 39, 0.1)',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--color-accent)',
                        fontSize: '14px',
                        fontWeight: 500,
                        marginBottom: '24px'
                    }}>
                        <span style={{ width: '8px', height: '8px', background: 'var(--color-accent)', borderRadius: '50%' }}></span>
                        V11.0 SYSTEM ONLINE
                    </div>
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
                        {headerTitle}<br />
                        <span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'initial' }}>{accentTitle}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(18px, 2vw, 24px)',
                            color: 'var(--color-text-muted)',
                            maxWidth: '800px',
                            margin: '0 auto 40px'
                        }}
                    >
                        {subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link
                            to="/contact"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '16px 32px',
                                background: 'var(--color-accent)',
                                color: 'var(--color-primary)',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 700,
                                fontSize: '16px',
                                textDecoration: 'none',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(246, 208, 39, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Start a Project <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/services"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '16px 32px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--color-text-main)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 600,
                                fontSize: '16px',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            }}
                        >
                            Explore Services
                        </Link>
                    </motion.div>
                </motion.div>


            </div>
        </section >
    );
};

export default Hero;
