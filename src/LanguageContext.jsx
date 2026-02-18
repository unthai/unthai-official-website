import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as localTranslations } from './translations';
import { fetchAPI } from './lib/strapi';


const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('unthai_lang') || 'en';
    });

    const [translations, setTranslations] = useState(localTranslations);

    useEffect(() => {
        localStorage.setItem('unthai_lang', language);
        document.documentElement.lang = language;

        const loadTranslations = async () => {
            try {
                // Fetch global translations
                const globalData = await fetchAPI('/global-content', { locale: language });

                // Fetch other content types if needed for global context, or rely on components fetching their own data
                // For now, we'll try to merge what we can, but a better approach might be to just fetch "global" texts here
                // and let pages fetch their own content.

                // However, to keep the t() function working as is for now, we might want to load everything.
                // But loading everything via API is heavy.
                // Strategy: Use local translations as base, and overwrite with Strapi data if available.
                // For this demo, let's focus on the 'Global Content' being dynamic first.

                if (globalData && globalData.data && globalData.data.attributes) {
                    const attrs = globalData.data.attributes;
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
                }
            } catch (error) {
                console.error("Failed to load Strapi translations:", error);
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
