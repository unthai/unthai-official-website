import React from 'react';
import { Calendar } from 'lucide-react';

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || '';

/**
 * Reusable Calendly booking button.
 * Opens the configured Calendly link in a new tab.
 * Falls back gracefully if no URL is configured (renders nothing).
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'inline'} props.variant
 * @param {string}  [props.label]
 * @param {object}  [props.style]
 * @param {function} [props.onClick] - additional click handler
 */
const CalendlyButton = ({
  variant = 'primary',
  label = 'Book a Strategy Call',
  style: externalStyle,
  onClick: externalOnClick,
}) => {
  if (!CALENDLY_URL) return null;

  const handleClick = (e) => {
    if (externalOnClick) externalOnClick(e);
    if (!e.defaultPrevented) {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    }
  };

  // Track booking click
  const handleClickWithTracking = (e) => {
    if (window.gtag) {
      window.gtag('event', 'calendly_click', {
        event_category: 'conversion',
        event_label: variant,
      });
    }
    handleClick(e);
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  };

  const variants = {
    primary: {
      ...baseStyle,
      padding: '10px 20px',
      background: 'var(--color-accent)',
      color: 'var(--color-primary)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
    },
    secondary: {
      ...baseStyle,
      padding: '10px 20px',
      background: 'transparent',
      color: 'var(--color-accent)',
      border: '1px solid var(--color-accent)',
      borderRadius: 'var(--radius-sm)',
    },
    ghost: {
      ...baseStyle,
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.04)',
      color: 'var(--color-text-muted)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: 'var(--radius-sm)',
    },
    inline: {
      ...baseStyle,
      padding: '0',
      background: 'transparent',
      color: 'var(--color-accent)',
      border: 'none',
      fontSize: 'inherit',
      fontWeight: 600,
    },
  };

  const style = { ...variants[variant], ...externalStyle };

  return (
    <button
      type="button"
      onClick={handleClickWithTracking}
      style={style}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(246, 208, 39, 0.2)';
        }
        if (variant === 'secondary') {
          e.currentTarget.style.background = 'rgba(246, 208, 39, 0.1)';
        }
        if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--color-accent)';
          e.currentTarget.style.borderColor = 'rgba(246, 208, 39, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
        if (variant === 'secondary') {
          e.currentTarget.style.background = 'transparent';
        }
        if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--color-text-muted)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
        }
      }}
    >
      <Calendar size={16} />
      {label}
    </button>
  );
};

export default CalendlyButton;
export { CALENDLY_URL };
