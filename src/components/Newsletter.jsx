import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

import { fetchAPI } from '../lib/strapi';

const Newsletter = () => {
    const { t, language } = useLanguage();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error, already_subscribed
    const [errorMessage, setErrorMessage] = useState('');
    const [newsletterData, setNewsletterData] = useState(null);

    useEffect(() => {
        const loadNewsletterData = async () => {
            try {
                const data = await fetchAPI('/newsletter', {
                    locale: language
                });
                if (data && data.data) {
                    const attr = data.data.attributes || data.data;
                    setNewsletterData(attr);
                }
            } catch (error) {
                console.error("Failed to load Newsletter data:", error);
            }
        };
        loadNewsletterData();
    }, [language]);

    // Data with Fallback
    const title = newsletterData?.title || t('newsletter.title');
    const subtitle = newsletterData?.subtitle || t('newsletter.subtitle');
    const placeholder = newsletterData?.placeholder || t('newsletter.placeholder');
    const buttonLabel = newsletterData?.buttonLabel || t('newsletter.button');
    const privacyText = newsletterData?.privacyText || t('newsletter.privacy');

    // Enhanced email validation
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!email || !isValidEmail(email)) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address');
            setTimeout(() => {
                setStatus('idle');
                setErrorMessage('');
            }, 3000);
            return;
        }

        setStatus('submitting');

        const webhookUrl = import.meta.env.VITE_N8N_NEWSLETTER_WEBHOOK_URL;

        if (!webhookUrl) {
            console.warn('Newsletter Webhook URL not configured');
            setStatus('error');
            setErrorMessage('Service temporarily unavailable');
            setTimeout(() => {
                setStatus('idle');
                setErrorMessage('');
            }, 3000);
            return;
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    timestamp: new Date().toISOString(),
                    source: 'unthai_newsletter_v1',
                    page: window.location.pathname,
                    referrer: document.referrer || 'direct'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Check if already subscribed
                if (data.alreadySubscribed) {
                    setStatus('already_subscribed');
                } else {
                    setStatus('success');
                }
                setEmail('');

                // Track conversion (if you have analytics)
                if (window.gtag) {
                    window.gtag('event', 'newsletter_signup', {
                        event_category: 'engagement',
                        event_label: 'newsletter'
                    });
                }

                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Something went wrong. Please try again.');
                setTimeout(() => {
                    setStatus('idle');
                    setErrorMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error('Newsletter submission error:', error);
            setStatus('error');
            setErrorMessage('Network error. Please check your connection.');
            setTimeout(() => {
                setStatus('idle');
                setErrorMessage('');
            }, 5000);
        }
    };

    const getButtonContent = () => {
        switch (status) {
            case 'idle':
                return t('newsletter.button');
            case 'submitting':
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            border: '2px solid var(--color-primary)',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite'
                        }}></span>
                        {t('newsletter.joining')}
                    </span>
                );
            case 'success':
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} />
                        {t('newsletter.subscribed')}
                    </span>
                );
            case 'already_subscribed':
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} />
                        {t('newsletter.alreadySubscribed')}
                    </span>
                );
            case 'error':
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={18} />
                        {t('newsletter.tryAgain')}
                    </span>
                );
            default:
                return t('newsletter.button');
        }
    };

    return (
        <>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <section className="section-padding" style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(246, 208, 39, 0.03) 0%, rgba(5, 18, 36, 0.1) 100%)',
                borderTop: '1px solid rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.03)'
            }}>
                <div className="container" style={{
                    textAlign: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: 'var(--color-accent)'
                        }}>
                            <Mail size={40} strokeWidth={1.5} />
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px' }}>
                            {title}
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>
                            {subtitle}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{
                        display: 'flex',
                        gap: '12px',
                        maxWidth: '800px',
                        margin: '0 auto',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <input
                            type="email"
                            required
                            placeholder={placeholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'submitting'}
                            style={{
                                flex: 1,
                                minWidth: '280px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: `1px solid ${status === 'error' ? '#ff4444' : 'rgba(255, 255, 255, 0.1)'}`,
                                borderRadius: 'var(--radius-sm)',
                                padding: '20px 24px',
                                color: 'var(--color-text-main)',
                                fontSize: '18px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                opacity: status === 'submitting' ? 0.7 : 1
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--color-accent)';
                                e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = status === 'error' ? '#ff4444' : 'rgba(255, 255, 255, 0.1)';
                                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                            }}
                        />
                        <motion.button
                            whileHover={status === 'idle' ? { scale: 1.02 } : {}}
                            whileTap={status === 'idle' ? { scale: 0.98 } : {}}
                            disabled={status === 'submitting'}
                            type="submit"
                            style={{
                                padding: '20px 40px',
                                background: status === 'success' || status === 'already_subscribed' ? '#4CAF50' :
                                    status === 'error' ? '#ff4444' : 'var(--color-accent)',
                                color: 'var(--color-primary)',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '18px',
                                fontWeight: 700,
                                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.3s',
                                opacity: status === 'submitting' ? 0.7 : 1,
                                minWidth: '180px'
                            }}
                        >
                            {getButtonContent()}
                        </motion.button>
                    </form>

                    {/* Error Message */}
                    {status === 'error' && errorMessage && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: '16px',
                                color: '#ff6b6b',
                                fontSize: '14px'
                            }}
                        >
                            {errorMessage}
                        </motion.p>
                    )}

                    {/* Success Message */}
                    {(status === 'success' || status === 'already_subscribed') && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: '16px',
                                color: '#4CAF50',
                                fontSize: '14px'
                            }}
                        >
                            {status === 'already_subscribed'
                                ? t('newsletter.alreadySubscribed')
                                : t('newsletter.success')}
                        </motion.p>
                    )}

                    {/* Privacy Notice */}
                    <p style={{
                        marginTop: '24px',
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                        opacity: 0.7
                    }}>
                        {t('newsletter.privacy')}
                    </p>
                </div>
            </section>
        </>
    );
};

export default Newsletter;
