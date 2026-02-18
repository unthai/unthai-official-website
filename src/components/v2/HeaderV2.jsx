import React from 'react';
import { motion } from 'framer-motion';

const HeaderV2 = () => {
    const navItems = ['SERVICES', 'PROJECTS', 'ABOUT', 'CONTACT'];

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 100,
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 'var(--v2-border)',
            background: 'rgba(11, 12, 21, 0.8)',
            backdropFilter: 'blur(10px)',
        }}>
            <div style={{
                fontFamily: 'var(--v2-font-heading)',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--v2-color-primary)',
                textShadow: 'var(--v2-glow-primary)',
                letterSpacing: '2px'
            }}>
                UNTH.AI
            </div>

            <nav style={{ display: 'flex', gap: '30px' }}>
                {navItems.map((item) => (
                    <motion.a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        whileHover={{
                            color: 'var(--v2-color-cta)',
                            textShadow: 'var(--v2-glow-cta)'
                        }}
                        style={{
                            fontFamily: 'var(--v2-font-body)',
                            fontSize: '14px',
                            color: 'var(--v2-color-text)',
                            textDecoration: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {`// ${item}`}
                    </motion.a>
                ))}
            </nav>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    background: 'transparent',
                    border: '1px solid var(--v2-color-primary)',
                    color: 'var(--v2-color-primary)',
                    padding: '10px 24px',
                    fontFamily: 'var(--v2-font-body)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: 'var(--v2-glow-primary)'
                }}
            >
                INITIATE_PROTOCOL
            </motion.button>
        </header>
    );
};

export default HeaderV2;
