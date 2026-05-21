import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as localTranslations } from './translations';
import { fetchAPI } from './lib/strapi';


const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => localStorage.getItem('lang') || 'en');

    const [translations, setTranslations] = useState(localTranslations);

    useEffect(() => {
        // Update document lang and persist choice
        document.documentElement.lang = language;
        localStorage.setItem('lang', language);

        // Update meta title + description
        const lang = localTranslations[language];
        if (lang?.meta?.title) {
            document.title = lang.meta.title;
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = lang.meta.description || '';

            // OG tags
            const setOg = (prop, val) => {
                let el = document.querySelector(`meta[property="${prop}"]`);
                if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
                el.content = val;
            };
            setOg('og:title', lang.meta.title);
            setOg('og:description', lang.meta.description || '');
            setOg('og:url', window.location.href);
            setOg('og:type', 'website');
            setOg('og:image', 'https://unth.ai/og-image.png');
        }

        const loadTranslations = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            try {
                // Fetch global translations
                console.log("Fetching Strapi translations (v5)...");
                const globalData = await fetchAPI('/global-content', { locale: language }, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (globalData && globalData.data) {
                    console.log("Strapi global data received:", globalData.data);
                    const attrs = globalData.data.attributes || globalData.data;
                    setTranslations(prev => ({
                        ...prev,
                        [language]: {
                            ...prev[language],
                            // Map Strapi Global Content to translation structure
                            nav: {
                                ...prev[language].nav,
                                home: attrs.navHome || prev[language].nav.home,
                                about: attrs.navAbout || prev[language].nav.about,
                                services: attrs.navServices || prev[language].nav.services,
                                blog: attrs.navBlog || prev[language].nav.blog,
                                contact: attrs.navContact || prev[language].nav.contact,
                                getStarted: attrs.navGetStarted || prev[language].nav.getStarted,
                            },
                            footer: {
                                ...prev[language].footer,
                                rights: attrs.footerRights || prev[language].footer.rights,
                                tagline: attrs.footerTagline || prev[language].footer.tagline,
                            }
                        }
                    }));
                } else {
                    console.warn("Strapi global data empty or malformed:", globalData);
                }
            } catch (error) {
                console.error("Failed to load Strapi translations:", error);
                // Fallback is already set to localTranslations in state initialization
            }
        };
        loadTranslations();
    }, [language]);

    const t = (path) => {
        const keys = path.split('.');
        let result = translations[language];

        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                return path; // Fallback to path name
            }
        }
        return result;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
