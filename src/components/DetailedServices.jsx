import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../lib/strapi';
import { useLanguage } from '../LanguageContext';
import { motion } from 'framer-motion';
import PricingTierCard from './PricingTierCard';

const DetailedServices = () => {
    const { language, t } = useLanguage();
    const [servicesData, setServicesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await fetchAPI('/services', {
                    locale: language,
                    populate: 'tiers' // Populate the new repeatable component
                });
                if (data && data.data) {
                    setServicesData(data.data);
                }
            } catch (error) {
                console.error("Failed to load detailed Services data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadServices();
    }, [language]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', color: 'var(--color-text-muted)' }}>
                Loading service configurations...
            </div>
        );
    }
    const fallbackData = t('detailedServicesFallback');
    const displayData = servicesData.length > 0 ? servicesData : fallbackData;

    return (
        <div style={{ padding: '80px 0', background: 'var(--color-primary)' }} className="container">
            {(!displayData || displayData.length === 0) && (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No complete services found. Please add tiered services in Strapi.
                </div>
            )}

            {displayData && displayData.map((service, sectionIndex) => {
                const attr = service.attributes || service;
                if (!attr || !attr.title) return null;

                const tiers = attr.tiers || [];

                return (
                    <div key={service.id || service.documentId || sectionIndex} style={{ marginBottom: '120px' }}>
                        {/* Section Header */}
                        <div style={{ marginBottom: '64px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 64px auto' }}>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                style={{
                                    fontSize: 'clamp(28px, 4vw, 42px)',
                                    fontWeight: 700,
                                    marginBottom: '24px',
                                    color: 'var(--color-text-main)'
                                }}
                            >
                                {attr.title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    fontSize: '18px',
                                    color: 'var(--color-text-muted)',
                                    lineHeight: '1.6'
                                }}
                            >
                                {attr.description}
                            </motion.p>
                        </div>

                        {/* Pricing Tiers Grid */}
                        {tiers.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '32px',
                                alignItems: 'stretch'
                            }}>
                                {tiers.map((tier, idx) => (
                                    <PricingTierCard
                                        key={tier.id || idx}
                                        tier={tier}
                                        index={idx}
                                        isPopular={idx === 1} // Typically the middle tier is highlighted
                                    />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                                Tiers not configured yet.
                            </div>
                        )}

                    </div>
                );
            })}
        </div>
    );
};

export default DetailedServices;
