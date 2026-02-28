import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const PricingTierCard = ({ tier, index, isPopular = false }) => {
    const { t } = useLanguage();

    // Default deliverables and logic if string parsing is complex
    const deliverables = tier.deliverables ? tier.deliverables.split('+').map(d => d.trim()) : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            style={{
                background: isPopular ? 'rgba(246, 208, 39, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: isPopular ? '1px solid rgba(246, 208, 39, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                height: '100%'
            }}
        >
            {isPopular && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--color-accent)',
                    color: 'var(--color-primary)',
                    padding: '4px 16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                    letterSpacing: '0.1em'
                }}>
                    MOGUL CHOICE
                </div>
            )}

            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h3 style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: isPopular ? 'var(--color-accent)' : 'var(--color-text-main)',
                    marginBottom: '16px'
                }}>
                    {tier.name}
                </h3>
                <div style={{
                    fontSize: '40px',
                    fontWeight: 800,
                    color: 'var(--color-text-main)',
                    lineHeight: 1
                }}>
                    {tier.price}
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Deliverables
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {deliverables.map((item, i) => (
                        <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <Check size={18} color="var(--color-accent)" style={{ marginTop: '3px', flexShrink: 0 }} />
                            <span style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5 }}>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {tier.logic && (
                <div style={{
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h4 style={{ fontSize: '12px', color: 'var(--color-accent)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Strategic Logic
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{tier.logic}"
                    </p>
                </div>
            )}

            <button style={{
                marginTop: '32px',
                width: '100%',
                padding: '16px',
                background: isPopular ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.05)',
                color: isPopular ? 'var(--color-primary)' : 'var(--color-text-main)',
                border: isPopular ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
                onMouseEnter={(e) => {
                    if (!isPopular) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    } else {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isPopular) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    } else {
                        e.currentTarget.style.transform = 'none';
                    }
                }}
            >
                Get Started
            </button>

        </motion.div>
    );
};

export default PricingTierCard;
