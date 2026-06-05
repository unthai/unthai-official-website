import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './Header.css';
import logo from '../assets/unthai-logo.png';
import CalendlyButton from './CalendlyButton';
import { trackCtaClick } from '../lib/analytics';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'jp', flag: '🇯🇵', label: '日本語' },
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'th', flag: '🇹🇭', label: 'ภาษาไทย' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const langRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close language dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const selectLang = (code) => {
    setLanguage(code);
    setIsLangOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src={logo} alt="UNTHAI Logo" style={{ height: '32px', width: 'auto' }} />
          <span>UNTH.AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link to="/" className={`nav-link${location.pathname === '/' ? ' nav-link-active' : ''}`}>{t('nav.home')}</Link>
          <Link to="/about" className={`nav-link${location.pathname === '/about' ? ' nav-link-active' : ''}`}>{t('nav.about')}</Link>
          <Link to="/work" className={`nav-link${location.pathname === '/work' ? ' nav-link-active' : ''}`}>{t('nav.work')}</Link>
          <Link to="/services" className={`nav-link${location.pathname === '/services' ? ' nav-link-active' : ''}`}>{t('nav.services')}</Link>
          <Link to="/blog" className={`nav-link${location.pathname === '/blog' ? ' nav-link-active' : ''}`}>{t('nav.blog')}</Link>
          <Link to="/contact" className={`nav-link${location.pathname === '/contact' ? ' nav-link-active' : ''}`}>{t('nav.contact')}</Link>
        </nav>

        {/* Desktop CTA + Language Selector */}
        <div className="header-actions cta-desktop">
          <div className="lang-dropdown" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="lang-toggle-btn"
              aria-label="Select language"
              aria-expanded={isLangOpen}
            >
              <span className="lang-flag">{currentLang.flag}</span>
              <span className="lang-code">{currentLang.code.toUpperCase()}</span>
              <span className={`lang-chevron ${isLangOpen ? 'open' : ''}`}>▾</span>
            </button>
            {isLangOpen && (
              <ul className="lang-dropdown-menu" role="listbox">
                {LANGUAGES.map(lang => (
                  <li key={lang.code}>
                    <button
                      role="option"
                      aria-selected={language === lang.code}
                      onClick={() => selectLang(lang.code)}
                      className={`lang-option ${language === lang.code ? 'active' : ''}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <CalendlyButton variant="ghost" label="Book a Call" />
          <Link to="/contact" className="cta-button" onClick={() => trackCtaClick({ label: 'header_get_started', location: 'header' })}>{t('nav.getStarted')}</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>

      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          <Link to="/" className="mobile-nav-link">{t('nav.home')}</Link>
          <Link to="/about" className="mobile-nav-link">{t('nav.about')}</Link>
          <Link to="/work" className="mobile-nav-link">{t('nav.work')}</Link>
          <Link to="/services" className="mobile-nav-link">{t('nav.services')}</Link>
          <Link to="/blog" className="mobile-nav-link">{t('nav.blog')}</Link>
          <Link to="/contact" className="mobile-nav-link">{t('nav.contact')}</Link>

          <div className="mobile-lang-switcher">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`mobile-lang-btn ${language === lang.code ? 'active' : ''}`}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{ padding: '16px 20px 0' }}>
            <CalendlyButton variant="primary" label="Book a Call" />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
