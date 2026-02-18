import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../../lib/strapi';
import { useLanguage } from '../../LanguageContext';
import { motion } from 'framer-motion';
import { Brain, Radio, MessageSquare, Zap, Target, Mic } from 'lucide-react';

const ServicesV2 = () => {
    const { language } = useLanguage();
    const [servicesData, setServicesData] = useState([]);

    const iconMap = {
        'content': Brain,
        'assistants': Radio,
        'automation': Zap,
        'bulk': MessageSquare,
        'growth': Target,
        'voice': Mic,
        // Fallbacks
        'Content Engine': Brain,
        'Autonomous Agents': Radio,
        'Workflow Automation': Zap,
        'Creative Automation': MessageSquare,
        'AI Growth Strategy': Target,
        'Voice Intelligence': Mic
    };

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await fetchAPI('/services', { locale: language });
                if (data && data.data) {
                    setServicesData(data.data);
                }
            } catch (error) {
                console.error("Failed to load Services V2 data:", error);
            }
        };
        loadServices();
    }, [language]);

    // Fallback static data
    const staticServices = [
        { title: 'AI Content Engine', icon: <Brain size={32} /> },
        { title: 'Autonomous Agents', icon: <Radio size={32} /> },
        { title: 'Workflow Automation', icon: <Zap size={32} /> },
        { title: 'Creative Automation', icon: <MessageSquare size={32} /> },
        { title: 'AI Growth Strategy', icon: <Target size={32} /> },
        { title: 'Voice Intelligence', icon: <Mic size={32} /> },
    ];

    return (
        <section id="services" style={{ padding: '100px 5%' }}>
            <h2 style={{
                fontFamily: 'var(--v2-font-heading)',
                color: 'var(--v2-color-text)',
                fontSize: '48px',
                marginBottom: '60px',
                textAlign: 'right',
                textTransform: 'uppercase'
            }}>
                System Capabilities
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {(servicesData.length > 0 ? servicesData : staticServices).map((service, index) => {
                    let title, icon;

                    if (service.attributes) { // Strapi data
                        const attr = service.attributes;
                        title = attr.title;

                        const label = attr.label;
                        let IconComp = Brain;
                        if (iconMap[label]) IconComp = iconMap[label];
                        else {
                            const lowerLabel = label ? label.toLowerCase() : '';
                            if (lowerLabel.includes('content')) IconComp = Brain;
                            else if (lowerLabel.includes('agent')) IconComp = Radio;
                            else if (lowerLabel.includes('automation')) IconComp = Zap;
                            else if (lowerLabel.includes('creative') || lowerLabel.includes('bulk')) IconComp = MessageSquare;
                            else if (lowerLabel.includes('growth')) IconComp = Target;
                            else if (lowerLabel.includes('voice')) IconComp = Mic;
                        }
                        icon = <IconComp size={32} />;
                    } else { // Static data
                        title = service.title;
                        icon = service.icon;
                    }

                    return (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5, borderColor: 'var(--v2-color-primary)' }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: 'var(--v2-border)',
                                padding: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ color: 'var(--v2-color-primary)' }}>
                                {icon}
                            </div>

                            <h3 style={{
                                fontFamily: 'var(--v2-font-heading)',
                                fontSize: '20px',
                                color: 'var(--v2-color-text)'
                            }}>
                                {title}
                            </h3>

                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                padding: '10px',
                                fontFamily: 'var(--v2-font-body)',
                                fontSize: '12px',
                                color: 'var(--v2-color-text-muted)',
                                opacity: 0.5
                            }}>
                                {`0${index + 1}`}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default ServicesV2;
