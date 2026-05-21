import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
    return (
        <div style={{ background: 'var(--color-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--color-text-main)' }}>
            <Helmet>
                <title>404 — Page Not Found — UNTH.AI</title>
                <meta name="robots" content="noindex,follow" />
            </Helmet>
            <Header />
            <main id="main-content" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--header-height)' }}>
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{
                            fontSize: '120px',
                            fontWeight: 800,
                            lineHeight: 1,
                            background: 'linear-gradient(180deg, rgba(246,208,39,0.8) 0%, rgba(246,208,39,0.2) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '24px'
                        }}>
                            404
                        </div>
                        <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: '16px' }}>
                            Page Not Found
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px' }}>
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                        <Link
                            to="/"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 32px',
                                background: 'var(--color-accent)',
                                color: 'var(--color-primary)',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 700,
                                fontSize: '16px',
                                textDecoration: 'none'
                            }}
                        >
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
