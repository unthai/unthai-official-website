// TODO: add Cloudflare Turnstile widget — needs sitekey, see https://www.cloudflare.com/products/turnstile/
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import './LeadForm.css';

import { fetchAPI } from '../lib/strapi';

const RATE_LIMIT_KEY = 'unthai_lead_last_submit';
const RATE_LIMIT_MS = 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LeadForm = () => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        interests: [],
        message: ''
    });
    const [honeypot, setHoneypot] = useState('');
    const [errors, setErrors] = useState({});
    const [leadFormData, setLeadFormData] = useState(null);

    useEffect(() => {
        const loadLeadFormData = async () => {
            try {
                const data = await fetchAPI('/lead-form', {
                    locale: language
                });
                if (data && data.data) {
                    const attr = data.data.attributes || data.data;
                    setLeadFormData(attr);
                }
            } catch (error) {
                console.error("Failed to load LeadForm data:", error);
            }
        };
        loadLeadFormData();
    }, [language]);

    // Data with Fallback
    const title = leadFormData?.title || t('leadForm.title');
    const subtitle = leadFormData?.subtitle || t('leadForm.subtitle');
    const nameLabel = leadFormData?.nameLabel || t('leadForm.name');
    const emailLabel = leadFormData?.emailLabel || t('leadForm.email');
    const interestLabel = leadFormData?.interestLabel || t('leadForm.interestLabel');
    const messageLabel = leadFormData?.messageLabel || "Message";
    const buttonLabel = leadFormData?.buttonLabel || t('leadForm.button');
    const successMessage = leadFormData?.successMessage || t('leadForm.success');
    const errorMessage = leadFormData?.errorMessage || t('leadForm.error');
    const sendingMessage = leadFormData?.sendingMessage || t('leadForm.sending');

    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Honeypot: bots fill hidden field — silently fake success.
        if (honeypot !== '') {
            setStatus('success');
            setFormData({ name: '', email: '', interests: [], message: '' });
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        // Client-side rate limit (60s window via localStorage).
        try {
            const last = typeof window !== 'undefined' ? window.localStorage.getItem(RATE_LIMIT_KEY) : null;
            if (last && Date.now() - parseInt(last, 10) < RATE_LIMIT_MS) {
                setErrors({ form: 'Please wait a minute before submitting again.' });
                return;
            }
        } catch (_) { /* localStorage unavailable, skip */ }

        // Required field validation + trim.
        const name = (formData.name || '').trim();
        const email = (formData.email || '').trim();
        const message = (formData.message || '').trim();
        const nextErrors = {};
        if (!name) nextErrors.name = 'Name is required.';
        if (!email) nextErrors.email = 'Email is required.';
        else if (!EMAIL_PATTERN.test(email)) nextErrors.email = 'Please enter a valid email address.';
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        setErrors({});

        const trimmed = { ...formData, name, email, message };
        setStatus('submitting');

        // Get webhook URL from env or fallback
        const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

        const markSubmitted = () => {
            try {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
                }
            } catch (_) { /* ignore */ }
        };

        if (!webhookUrl) {
            console.warn('Webhook URL not configured');
            // Simulate success for demo purposes if no URL
            setTimeout(() => {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
                setFormData({ name: '', email: '', interests: [], message: '' });
                markSubmitted();
            }, 1000);
            return;
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...trimmed,
                    timestamp: new Date().toISOString(),
                    source: 'unthai_v1_website'
                }),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', interests: [], message: '' });
                markSubmitted();
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const interests = [
        t('services.items.content.title'),
        t('services.items.assistants.title'),
        t('services.items.automation.title'),
        t('services.items.bulk.title'),
        t('services.items.growth.title'),
        t('services.items.voice.title'),
        t("leadForm.interest.other"),
        t("leadForm.interest.notSure"),
        t("leadForm.interest.coffee")
    ];

    const toggleInterest = (interest) => {
        const newInterests = formData.interests.includes(interest)
            ? formData.interests.filter(i => i !== interest)
            : [...formData.interests, interest];
        setFormData({ ...formData, interests: newInterests });
    };

    return (
        <section id="contact" className="section-padding container">
            <div className="lead-form-container">
                <div className="lead-form-header">
                    <h2 className="lead-form-title">{title}</h2>
                    <p className="lead-form-subtitle">
                        {subtitle}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="lead-form" noValidate>
                    {/* Honeypot — hidden from humans, irresistible to bots */}
                    <input
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
                    />

                    {/* Name & Email Row */}
                    <div className="lead-form-row">
                        <div className="lead-form-field">
                            <label className="lead-form-label">{nameLabel}</label>
                            <input
                                type="text"
                                required
                                className="lead-form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={nameLabel}
                                aria-invalid={errors.name ? 'true' : 'false'}
                            />
                            {errors.name && (
                                <p className="lead-form-error" role="alert" style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>{errors.name}</p>
                            )}
                        </div>
                        <div className="lead-form-field">
                            <label className="lead-form-label">{emailLabel}</label>
                            <input
                                type="email"
                                required
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                className="lead-form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder={emailLabel}
                                aria-invalid={errors.email ? 'true' : 'false'}
                            />
                            {errors.email && (
                                <p className="lead-form-error" role="alert" style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {errors.form && (
                        <p className="lead-form-error" role="alert" style={{ color: '#ff6b6b', fontSize: '0.875rem' }}>{errors.form}</p>
                    )}

                    {/* Interests */}
                    <div className="lead-form-field">
                        <label className="lead-form-label">{interestLabel}</label>
                        <div className="lead-form-interests">
                            {interests.map((interest) => (
                                <label
                                    key={interest}
                                    className={`lead-form-interest-item ${formData.interests.includes(interest) ? 'selected' : ''}`}
                                    onClick={() => toggleInterest(interest)}
                                >
                                    <div className="lead-form-checkbox">
                                        {formData.interests.includes(interest) && (
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M10 3L4.5 8.5L2 6" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        value={interest}
                                        checked={formData.interests.includes(interest)}
                                        onChange={() => { }}
                                        style={{ display: 'none' }}
                                    />
                                    <span className="lead-form-interest-text">
                                        {interest}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="lead-form-field">
                        <label className="lead-form-label">{messageLabel}</label>
                        <textarea
                            rows="4"
                            className="lead-form-textarea"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us about your project..."
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={status === 'submitting'}
                        type="submit"
                        className="lead-form-submit"
                    >
                        {status === 'idle' && <>{buttonLabel} <Send size={18} /></>}
                        {status === 'submitting' && sendingMessage}
                        {status === 'success' && successMessage}
                        {status === 'error' && errorMessage}
                    </motion.button>
                </form>
            </div>
        </section>
    );
};

export default LeadForm;
