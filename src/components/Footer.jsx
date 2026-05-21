import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import logo from '../assets/unthai-logo.png';

const Footer = () => {
    const { t } = useLanguage();

    const navLinks = [
        { to: '/', label: t('nav.home') },
        { to: '/about', label: t('nav.about') },
        { to: '/services', label: t('nav.services') },
        { to: '/blog', label: t('nav.blog') },
        { to: '/contact', label: t('nav.contact') },
    ];

    return (
        <footer style={{
            background: '#020b16',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '48px 0 32px',
            marginTop: 'auto',
            color: 'var(--color-text-muted)',
            fontSize: '14px'
        }}>
            <div className="container">
                {/* Top row: brand left, nav right */}
                <div className="footer-top" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '24px',
                    marginBottom: '40px'
                }}>
                    {/* Brand */}
                    <div>
                        <Link to="/" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            fontSize: '20px', fontWeight: 700, color: 'var(--color-text-main)',
                            textDecoration: 'none', marginBottom: '8px'
                        }}>
                            <img src={logo} alt="UNTH.AI" style={{ height: '28px', width: 'auto' }} />
                            UNTH.AI
                        </Link>
                        <p style={{ maxWidth: '240px', lineHeight: 1.6 }}>
                            {t('footer.tagline')}
                        </p>
                    </div>

                    {/* Nav links — right-aligned */}
                    <nav className="footer-nav" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px 28px',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                style={{
                                    color: 'var(--color-text-muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-main)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom row: copyright only */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '24px',
                    textAlign: 'center'
                }}>
                    <p>&copy; {new Date().getFullYear()} UNTH.AI. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
