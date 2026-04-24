import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const socialLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'inherit',
    transition: 'color 0.2s'
};

const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const Footer = () => {
    const { t } = useLanguage();

    const navLinks = [
        { to: '/', label: t('nav.home') },
        { to: '/about', label: t('nav.about') },
        { to: '/services', label: t('nav.services') },
        { to: '/blog', label: t('nav.blog') },
        { to: '/contact', label: t('nav.contact') },
    ];

    const socialLinks = [
        { href: 'https://www.instagram.com/unth.ai/', icon: <Instagram size={18} strokeWidth={1.5} />, label: 'Instagram' },
        { href: 'https://www.youtube.com/@UnthaiTV', icon: <Youtube size={18} strokeWidth={1.5} />, label: 'YouTube' },
        { href: 'https://www.facebook.com/UnthaiHQ/', icon: <Facebook size={18} strokeWidth={1.5} />, label: 'Facebook' },
        { href: 'https://www.linkedin.com/company/unth-ai/', icon: <Linkedin size={18} strokeWidth={1.5} />, label: 'LinkedIn' },
        { href: 'https://x.com/UnthaiHQ', icon: <XIcon />, label: 'X' },
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
                {/* Top row: brand + nav + social */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '32px',
                    marginBottom: '40px'
                }}>
                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ display: 'block', fontSize: '20px', fontWeight: 700, color: 'var(--color-text-main)', textDecoration: 'none', marginBottom: '8px' }}>
                            UNTH.AI
                        </Link>
                        <p style={{ maxWidth: '240px', lineHeight: 1.6 }}>
                            AI-powered creative and automation agency.
                        </p>
                    </div>

                    {/* Nav links */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {navLinks.map(({ to, label }) => (
                            <Link key={to} to={to} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-main)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Social */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {socialLinks.map(({ href, icon, label }) => (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                                style={socialLinkStyle}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom row: copyright */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <p>&copy; {new Date().getFullYear()} UNTH.AI. {t('footer.rights')}</p>
                    <p>Bangkok, Thailand — Serving Globally</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
