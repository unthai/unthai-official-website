import React from 'react';
import { motion } from 'framer-motion';

const HeroV2 = () => {
    return (
        <section style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '0 5%',
        }}>
            {/* Background Grid */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                opacity: 0.2,
                zIndex: 0
            }} />

            {/* Content */}
            <div style={{ zIndex: 10, maxWidth: '1200px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span style={{
                        color: 'var(--v2-color-cta)',
                        fontFamily: 'var(--v2-font-body)',
                        letterSpacing: '1px'
                    }}>
                        [ SYSTEM ACTIVE ]
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                        fontFamily: 'var(--v2-font-heading)',
                        fontSize: 'clamp(48px, 8vw, 96px)',
                        lineHeight: 0.9,
                        color: 'var(--v2-color-text)',
                        textTransform: 'uppercase'
                    }}
                >
                    Digital <br />
                    <span style={{
                        color: 'transparent',
                        WebkitTextStroke: '2px var(--v2-color-secondary)',
                        textShadow: 'var(--v2-glow-primary)'
                    }}>
                        Intelligence
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{
                        maxWidth: '600px',
                        fontFamily: 'var(--v2-font-body)',
                        color: 'var(--v2-color-text-muted)',
                        lineHeight: 1.6,
                        fontSize: '18px'
                    }}
                >
                    We architect autonomous systems that blur the line between human creativity and machine precision/
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    style={{ marginTop: '30px' }}
                >
                    <button style={{
                        background: 'var(--v2-color-cta)',
                        color: '#000',
                        padding: '16px 48px',
                        fontFamily: 'var(--v2-font-heading)',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: 'var(--v2-glow-cta)'
                    }}>
                        DEPLOY AGENTS
                    </button>
                </motion.div>
            </div>

            {/* Decorative Circles */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    right: '10%',
                    top: '30%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    border: '2px solid var(--v2-color-primary)',
                    boxShadow: 'var(--v2-glow-primary)',
                    zIndex: 1
                }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                style={{
                    position: 'absolute',
                    right: '25%',
                    bottom: '20%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    border: '2px solid var(--v2-color-secondary)',
                    boxShadow: 'var(--v2-glow-secondary)', // Note: variable might need defining or inline
                    zIndex: 1
                }}
            />
        </section>
    );
};

export default HeroV2;
