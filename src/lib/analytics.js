/**
 * GA4 Conversion Event Tracking
 *
 * Thin wrapper around window.gtag for consistent event tracking
 * across the site. Safely no-ops when GA4 is not loaded
 * (e.g., user declined cookies, ad blocker, SSR).
 */

export function trackEvent(name, params = {}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, {
        event_category: params.category || 'engagement',
        event_label: params.label || '',
        value: params.value,
        ...params.extra,
      });
    }
  } catch {
    /* Silently ignore tracking errors */
  }
}

/**
 * Lead form submission.
 */
export function trackLeadSubmit({ method = 'webhook', formSource = 'lead_form' } = {}) {
  trackEvent('lead_submit', {
    category: 'conversion',
    label: formSource,
    extra: { method },
  });
}

/**
 * Newsletter signup.
 */
export function trackNewsletterSignup({ source = 'newsletter' } = {}) {
  trackEvent('newsletter_signup', {
    category: 'conversion',
    label: source,
  });
}

/**
 * CTA click — attached to any primary/secondary conversion link or button.
 */
export function trackCtaClick({ label = '', cta, location = '' } = {}) {
  trackEvent('cta_click', {
    category: 'engagement',
    label: label || cta || 'cta',
    extra: { location, cta: cta || label },
  });
}
