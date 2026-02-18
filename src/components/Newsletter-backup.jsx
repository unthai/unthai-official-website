import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        const webhookUrl = import.meta.env.VITE_N8N_NEWSLETTER_WEBHOOK_URL;

        if (!webhookUrl) {
            console.warn('Newsletter Webhook URL not configured');
            setTimeout(() => {
                setStatus('success');
                setEmail('');
                setTimeout(() => setStatus('idle'), 3000);
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
                    email,
                    timestamp: new Date().toISOString(),
                    source: 'unthai_newsletter_v1'
                }),
            });

            if (response.ok) {
                setStatus('success');
                setEmail('');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Newsletter submission error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
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
                    <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px' }}>Stay in touch</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>
                        Get the latest AI insights and project updates delivered to your inbox.
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
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '20px 24px',
                            color: 'var(--color-text-main)',
                            fontSize: '18px',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-accent)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={status === 'submitting'}
                        type="submit"
                        style={{
                            padding: '20px 40px',
                            background: 'var(--color-accent)',
                            color: 'var(--color-primary)',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '18px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'opacity 0.2s',
                            opacity: status === 'submitting' ? 0.7 : 1
                        }}
                    >
                        {status === 'idle' && 'Subscribe'}
                        {status === 'submitting' && 'Joining...'}
                        {status === 'success' && 'Thank you for your subscription'}
                        {status === 'error' && 'Error. Try again.'}
                    </motion.button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
