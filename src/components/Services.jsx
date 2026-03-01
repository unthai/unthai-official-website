import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../lib/strapi';

import ServiceCard from './ServiceCard';
import { BrainCircuit, Bot, Workflow, Palette, TrendingUp, AudioWaveform } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const Services = ({ showActions = false, showMainAction = false }) => {
    const { t } = useLanguage();

    const [servicesData, setServicesData] = useState([]);
    const { language } = useLanguage();

    const iconMap = {
        'content': BrainCircuit,
        'assistants': Bot,
        'automation': Workflow,
        'bulk': Palette,
        'growth': TrendingUp,
        'voice': AudioWaveform,
        // Fallback or additional mappings
        'Content Engine': BrainCircuit,
        'AI Assistants': Bot,
        'Workflow Automation': Workflow,
        'Bulk Generation': Palette,
        'Growth Tools': TrendingUp,
        'Voice AI': AudioWaveform
    };

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await fetchAPI('/services', {
                    locale: language,
                    populate: 'features'
                });
                if (data && data.data) {
                    setServicesData(data.data);
                }
            } catch (error) {
                console.error("Failed to load Services data:", error);
            }
        };
        loadServices();
    }, [language]);

    // Use Strapi data if available, otherwise fall back to hardcoded list (mapping is tricky without exact keys)
    // For this migration, we'll try to use Strapi data primarily.

    const displayServices = servicesData.length > 0 ? servicesData : [
        { key: 'content', icon: BrainCircuit },
        { key: 'assistants', icon: Bot },
        { key: 'automation', icon: Workflow },
        { key: 'bulk', icon: Palette },
        { key: 'growth', icon: TrendingUp },
        { key: 'voice', icon: AudioWaveform },
    ];

    return (
        <div id="services" className="container section-padding">
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px' }}>{t('services.title')}</h2>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    {t('services.subtitle')}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
                {displayServices.map((item) => {
                    const isStrapi = !!item.id; // Strapi items have IDs
                    const attributes = isStrapi ? (item.attributes || item) : {};

                    // Determine key/icon
                    // If Strapi, we rely on 'label' to map to icon, or user 'key' field if we added one (we added 'label')
                    const label = isStrapi ? attributes.label : t(`services.items.${item.key}.label`);
                    // Try to match icon by label or key
                    const iconKey = isStrapi ? label : item.key;
                    // Simple heuristic matching for icons
                    let IconComponent = BrainCircuit; // Default
                    if (isStrapi) {
                        // Try exact match
                        if (iconMap[label]) IconComponent = iconMap[label];
                        // Try case insensitive
                        else {
                            const lowerLabel = label ? label.toLowerCase() : '';
                            if (lowerLabel.includes('content')) IconComponent = BrainCircuit;
                            else if (lowerLabel.includes('assistant')) IconComponent = Bot;
                            else if (lowerLabel.includes('automation')) IconComponent = Workflow;
                            else if (lowerLabel.includes('bulk')) IconComponent = Palette;
                            else if (lowerLabel.includes('growth')) IconComponent = TrendingUp;
                            else if (lowerLabel.includes('voice')) IconComponent = AudioWaveform;
                        }
                    } else {
                        IconComponent = item.icon;
                    }

                    const title = isStrapi ? attributes.title : t(`services.items.${item.key}.title`);
                    const description = isStrapi ? attributes.description : t(`services.items.${item.key}.description`);

                    // Features mapping
                    // Strapi: attributes.features is array of components { text: string }
                    // Local: t(...) returns array of strings
                    let features = [];
                    if (isStrapi && attributes.features) {
                        // In Strapi v5, attributes.features is an array of objects { text: string }
                        // Ensure we always have an array and extract the text
                        const featuresList = Array.isArray(attributes.features) ? attributes.features : [];
                        features = featuresList.map(f => f.text || f).filter(Boolean);
                    } else if (!isStrapi) {
                        features = Array.isArray(t(`services.items.${item.key}.features`))
                            ? t(`services.items.${item.key}.features`)
                            : [];
                    }

                    return (
                        <ServiceCard
                            key={isStrapi ? item.id : item.key}
                            showActions={showActions}
                            type="b2c"
                            label={label}
                            title={title}
                            description={description}
                            icon={IconComponent}
                            features={features}
                        />
                    );
                })}
            </div>

            {showMainAction && (
                <div style={{ marginTop: '56px', display: 'flex', justifyContent: 'center' }}>
                    <Link
                        to="/services"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px 48px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--color-text-main)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600,
                            fontSize: '16px',
                            textDecoration: 'none',
                            transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(246, 208, 39, 0.1)';
                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                            e.currentTarget.style.color = 'var(--color-accent)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.color = 'var(--color-text-main)';
                        }}
                    >
                        {t('services.readMore')}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Services;
