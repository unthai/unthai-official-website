import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'unthai_consent';
const GA_ID = 'G-Q5X2PE3YNV';

function injectGtag() {
  if (window.__unthaiGtagLoaded) return;
  window.__unthaiGtagLoaded = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
}

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* SSR/private mode */ }
    if (stored === 'granted') {
      injectGtag();
    } else if (stored === null) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try { localStorage.setItem(STORAGE_KEY, 'granted'); } catch (e) { /* ignore */ }
    injectGtag();
    setVisible(false);
  };

  const handleDecline = () => {
    try { localStorage.setItem(STORAGE_KEY, 'denied'); } catch (e) { /* ignore */ }
    setVisible(false);
  };

  if (!visible) return null;

  const wrapStyle = {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    background: 'var(--color-primary, #051224)',
    color: '#fff',
    padding: '16px 20px',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.35)',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    fontSize: '14px',
    lineHeight: 1.5,
  };

  const textStyle = {
    flex: '1 1 320px',
    maxWidth: '720px',
  };

  const btnRowStyle = {
    display: 'flex',
    gap: '10px',
    flexShrink: 0,
  };

  const acceptBtn = {
    background: 'var(--color-accent, #00D4FF)',
    color: '#051224',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
  };

  const declineBtn = {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '10px 18px',
    borderRadius: '6px',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '14px',
  };

  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie consent" style={wrapStyle}>
      <div style={textStyle}>
        We use cookies and Google Analytics to understand how visitors use the site.
        Accept to help us improve, decline to keep your visit private.
      </div>
      <div style={btnRowStyle}>
        <button type="button" onClick={handleDecline} style={declineBtn}>Decline</button>
        <button type="button" onClick={handleAccept} style={acceptBtn}>Accept</button>
      </div>
    </div>
  );
};

export default CookieConsent;
