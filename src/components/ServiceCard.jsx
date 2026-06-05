import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { trackCtaClick } from '../lib/analytics';

const ServiceCard = ({ title, description, features, type = 'b2b', label, showActions = true, icon: Icon }) => {
    const isB2B = type === 'b2b';

    return (
        <motion.div
            whileHover={{ y: -6, boxShadow: '0 8px 32px rgba(246,208,39,0.10)' }}
            transition={{ duration: 0.22 }}
            style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(246,208,39,0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Subtle top accent line */}
            <div style={{
                position: 'absolute', top: 0, left: '32px', right: '32px',
                height: '1px',
                background: 'linear-gradient(90deg, var(--color-accent), transparent)',
                opacity: 0.4
            }} />

            <div>
                {Icon && (
                    <div style={{
                        marginBottom: '24px',
                        width: '52px', height: '52px',
                        borderRadius: '12px',
                        background: 'rgba(246,208,39,0.1)',
                        border: '1px solid rgba(246,208,39,0.18)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Icon size={26} color="var(--color-accent)" strokeWidth={1.5} />
                    </div>
                )}
                <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: isB2B ? 'rgba(5, 18, 36, 0.5)' : 'rgba(246, 208, 39, 0.1)',
                    color: isB2B ? 'var(--color-text-muted)' : 'var(--color-accent)',
                    border: `1px solid ${isB2B ? 'var(--color-surface)' : 'rgba(246, 208, 39, 0.2)'}`,
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '16px'
                }}>
                    {label || (isB2B ? 'RECURRING RETAINER' : 'ONE-SHOT OFFER')}
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{description}</p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--color-accent)', marginTop: '4px' }}>→</span>
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{feature}</span>
                    </li>
                ))}
            </ul>

            {showActions && (
                <Link to="/services" onClick={() => trackCtaClick({ label: 'service_card_read_more', location: 'service_card' })} style={{
                    marginTop: 'auto',
                    textAlign: 'center',
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--color-text-main)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    transition: 'all var(--transition-fast)',
                    textDecoration: 'none',
                    display: 'block'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(246, 208, 39, 0.1)';
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                        e.currentTarget.style.color = 'var(--color-accent)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = 'var(--color-text-main)';
                    }}
                >
                    Read More
                </Link>
            )}
        </motion.div>
    );
};

export default ServiceCard;
