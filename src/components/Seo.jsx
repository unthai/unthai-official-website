import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://unth.ai';
const DEFAULT_OG = `${SITE_URL}/og-image.png`;
const DEFAULT_DESC = 'UNTH.AI builds AI systems, automation workflows, and content engines for businesses. Intelligent automation, AI agents, and creative tools.';

/** Language → hreflang ISO code mapping */
const HREFLANG_MAP = {
  en: 'en',
  jp: 'ja',
  ko: 'ko',
  fr: 'fr',
  de: 'de',
  es: 'es',
  th: 'th',
};

const HREFLANG_CODES = Object.values(HREFLANG_MAP);

/**
 * Reusable SEO head block. Wrap any page top-level.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.path]      e.g. "/about" → canonical = SITE_URL + path
 * @param {string} [props.image]     full URL or absolute path
 * @param {string} [props.type]      og:type (default "website")
 * @param {string} [props.lang]      current language code ("en", "jp", "ko", etc.) — default "en"
 * @param {object} [props.jsonLd]    schema.org object — serialized inline
 */
const Seo = ({
    title,
    description = DEFAULT_DESC,
    path = '/',
    image = DEFAULT_OG,
    type = 'website',
    lang = 'en',
    jsonLd,
}) => {
    const fullTitle = title.endsWith('UNTH.AI') ? title : `${title} — UNTH.AI`;
    const canonical = `${SITE_URL}${path}`;
    const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    const hreflangCode = HREFLANG_MAP[lang] || 'en';
    const LOCALE_MAP = { en: 'en_US', jp: 'ja_JP', ko: 'ko_KR', fr: 'fr_FR', de: 'de_DE', es: 'es_ES', th: 'th_TH' };
    const ogLocale = LOCALE_MAP[lang] || 'en_US';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:locale" content={ogLocale} />
            <meta property="og:site_name" content="UNTH.AI" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@UnthaiHQ" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Hreflang — alternate language links */}
            {HREFLANG_CODES.map((code) => (
                <link key={code} rel="alternate" hreflang={code} href={canonical} />
            ))}
            <link rel="alternate" hreflang="x-default" href={canonical} />

            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default Seo;
export { SITE_URL };
