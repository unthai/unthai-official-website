import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './Header.css';
import logo from '../assets/unthai-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'jp' : 'en');
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src={logo} alt="UNTHAI Logo" style={{ height: '32px', width: 'auto' }} />
          <span>UNTH.AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link to="/" className="nav-link">{t('nav.home')}</Link>
          <Link to="/about" className="nav-link">{t('nav.about')}</Link>
          <Link to="/services" className="nav-link">{t('nav.services')}</Link>
          <Link to="/blog" className="nav-link">{t('nav.blog')}</Link>
        </nav>

        {/* Desktop Language Selector */}
        <div className="language-selector-container cta-desktop">
          <button
            onClick={toggleLanguage}
            className="lang-toggle-btn"
            aria-label="Switch language"
          >
            <span className={language === 'en' ? 'active' : ''}>EN</span>
            <span className="divider">|</span>
            <span className={language === 'jp' ? 'active' : ''}>JP</span>
          </button>
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
          <Link to="/services" className="mobile-nav-link">{t('nav.services')}</Link>
          <Link to="/blog" className="mobile-nav-link">{t('nav.blog')}</Link>

          <div className="mobile-lang-switcher">
            <button
              onClick={() => setLanguage('en')}
              className={`mobile-lang-btn ${language === 'en' ? 'active' : ''}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('jp')}
              className={`mobile-lang-btn ${language === 'jp' ? 'active' : ''}`}
            >
              日本語
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
