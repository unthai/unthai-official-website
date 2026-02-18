import React from 'react';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer style={{
            background: '#020b16',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '40px 0',
            marginTop: 'auto',
            color: 'var(--color-text-muted)',
            fontSize: '14px'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <p>&copy; {new Date().getFullYear()} UNTH.AI. {t('footer.rights')}</p>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <a href="https://www.instagram.com/unth.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                        <Instagram size={20} strokeWidth={1.5} />
                    </a>
                    <a href="https://www.youtube.com/@UnthaiTV" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                        <Youtube size={20} strokeWidth={1.5} />
                    </a>
                    <a href="https://www.facebook.com/UnthaiHQ/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                        <Facebook size={20} strokeWidth={1.5} />
                    </a>
                    <a href="https://x.com/UnthaiHQ" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
