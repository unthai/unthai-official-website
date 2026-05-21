import React from 'react';
import { motion } from 'framer-motion';
import Seo, { SITE_URL } from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import heroBg from '../assets/unthai-ai-automation-bg.webp';

const Contact = () => {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url: `${SITE_URL}/contact`,
        about: { '@type': 'Organization', name: 'UNTH.AI', url: SITE_URL },
    };
    return (
        <div style={{ background: 'var(--color-primary)', minHeight: '100vh', color: 'var(--color-text-main)' }}>
            <Seo
                title="Contact"
                description="Start a project with UNTH.AI. Tell us what you need — AI agents, automation, or content systems."
                path="/contact"
                jsonLd={jsonLd}
            />
            <Header />

            {/* Hero Section */}
            <section id="main-content" style={{
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

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>
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
                        Let's Build Something<br />
                        <span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'initial' }}>Together</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(16px, 2vw, 20px)',
                            color: 'var(--color-text-muted)',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        Ready to leverage AI for your business? Tell us about your project and we'll get back to you within 24 hours.
                    </motion.p>
                </div>
            </section>

            {/* Lead Form Section */}
            <LeadForm />

            {/* Contact Info Section */}
            <section className="section-padding container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    {/* Email */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        style={{
                            padding: '32px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--color-surface)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '32px', marginBottom: '16px' }}>📧</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>Email Us</h3>
                        <a
                            href="mailto:hello@unth.ai"
                            style={{
                                color: 'var(--color-accent)',
                                textDecoration: 'none',
                                fontSize: '16px'
                            }}
                        >
                            hello@unth.ai
                        </a>
                    </motion.div>

                    {/* Locations */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        style={{
                            padding: '32px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--color-surface)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '32px', marginBottom: '16px' }}>📍</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#fff' }}>Our Offices</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div>
                                <span style={{ fontSize: '18px' }}>🇹🇭</span>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', margin: '2px 0 0' }}>Bangkok, Thailand</p>
                            </div>
                            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 auto' }} />
                            <div>
                                <span style={{ fontSize: '18px' }}>🇯🇵</span>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', margin: '2px 0 0' }}>Osaka, Japan</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Response Time */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        style={{
                            padding: '32px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--color-surface)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>Response Time</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>
                            Within 24 hours<br />
                            <span style={{ fontSize: '14px' }}>Usually faster</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
