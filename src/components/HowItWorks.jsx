import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

const STEPS_EN = [
    {
        number: '01',
        title: 'Discovery Call',
        description: 'We map your business goals, pain points, and current stack in a focused 30-min session.'
    },
    {
        number: '02',
        title: 'Custom AI Blueprint',
        description: 'Our team designs a tailored system — agents, automations, content pipelines — built for your exact needs.'
    },
    {
        number: '03',
        title: 'Launch & Scale',
        description: 'We build, deploy, and monitor. You get working systems, not PowerPoints. Iterate weekly.'
    }
];

const STEPS = {
    en: STEPS_EN,
    jp: [
        { number: '01', title: 'ディスカバリーコール', description: '30分のセッションで、ビジネス目標、課題、現在のスタックをマッピングします。' },
        { number: '02', title: 'AIブループリント作成', description: 'エージェント、自動化、コンテンツパイプラインを含む、カスタムシステムを設計します。' },
        { number: '03', title: 'ローンチ＆スケール', description: 'ビルド、デプロイ、モニタリングを実施。PowerPointではなく、機能するシステムを提供します。' }
    ],
    ko: [
        { number: '01', title: '디스커버리 콜', description: '30분 세션에서 비즈니스 목표, 문제점, 현재 스택을 파악합니다.' },
        { number: '02', title: 'AI 블루프린트', description: '에이전트, 자동화, 콘텐츠 파이프라인을 포함한 맞춤형 시스템을 설계합니다.' },
        { number: '03', title: '런치 & 스케일', description: '빌드, 배포, 모니터링을 수행합니다. PPT가 아닌 실제 작동하는 시스템을 제공합니다.' }
    ],
    fr: [
        { number: '01', title: 'Appel de découverte', description: 'Nous cartographions vos objectifs, points de douleur et stack actuel en 30 minutes.' },
        { number: '02', title: 'Blueprint IA sur mesure', description: 'Notre équipe conçoit un système personnalisé — agents, automatisations, pipelines de contenu.' },
        { number: '03', title: 'Lancement & Scale', description: 'Nous construisons, déployons et monitons. Vous obtenez des systèmes fonctionnels, pas des slides.' }
    ],
    de: [
        { number: '01', title: 'Discovery-Call', description: 'Wir erfassen Ihre Geschäftsziele, Schmerzpunkte und den aktuellen Tech-Stack in 30 Minuten.' },
        { number: '02', title: 'KI-Blueprint', description: 'Unser Team entwirft ein maßgeschneidertes System — Agents, Automatisierungen, Content-Pipelines.' },
        { number: '03', title: 'Launch & Scale', description: 'Wir bauen, deployen und überwachen. Sie erhalten funktionierende Systeme, keine Präsentationen.' }
    ],
    es: [
        { number: '01', title: 'Llamada de descubrimiento', description: 'Mapeamos sus objetivos, puntos de dolor y stack actual en una sesión de 30 minutos.' },
        { number: '02', title: 'Blueprint de IA', description: 'Nuestro equipo diseña un sistema personalizado — agentes, automatizaciones, pipelines de contenido.' },
        { number: '03', title: 'Lanzamiento y escala', description: 'Construimos, desplegamos y monitorizamos. Obtienes sistemas funcionales, no presentaciones.' }
    ],
    th: [
        { number: '01', title: 'ค้นพบความต้องการ', description: 'เราวิเคราะห์เป้าหมายธุรกิจ ปัญหา และระบบปัจจุบันของคุณใน 30 นาที' },
        { number: '02', title: 'ออกแบบ AI Blueprint', description: 'ทีมของเราออกแบบระบบที่กำหนดเอง — agents อัตโนมัติ และ pipeline คอนเทนต์' },
        { number: '03', title: 'เปิดตัวและขยาย', description: 'เราสร้าง ติดตั้ง และดูแลระบบ คุณได้รับระบบที่ทำงานได้จริง ไม่ใช่แค่สไลด์' }
    ]
};

const SECTION_TITLE = {
    en: 'How It Works', jp: '仕組み', ko: '작동 방식',
    fr: 'Comment ça marche', de: 'So funktioniert es', es: 'Cómo funciona',
    th: 'วิธีการทำงาน'
};

const SECTION_SUBTITLE = {
    en: 'From first call to live system in days — not months.',
    jp: '最初の通話から数日でライブシステムへ。',
    ko: '첫 통화부터 며칠 안에 라이브 시스템까지.',
    fr: 'Du premier appel au système en production en quelques jours.',
    de: 'Vom ersten Gespräch zum Live-System in Tagen — nicht Monaten.',
    es: 'Del primer contacto al sistema en producción en días, no meses.',
    th: 'จากการโทรครั้งแรกสู่ระบบสดใช้งานได้ภายในไม่กี่วัน'
};

const Step = ({ step, index }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            className="hiw-step"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '32px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-md)',
                flex: 1,
                minWidth: '220px'
            }}
        >
            {/* Accent top border */}
            <div style={{
                position: 'absolute', top: 0, left: '32px', right: '32px',
                height: '2px',
                background: 'linear-gradient(90deg, var(--color-accent), transparent)'
            }} />

            <span style={{
                fontSize: '48px',
                fontWeight: 900,
                color: 'rgba(246,208,39,0.12)',
                lineHeight: 1,
                letterSpacing: '-0.04em'
            }}>
                {step.number}
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {step.title}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.65, fontSize: '15px' }}>
                {step.description}
            </p>
        </motion.div>
    );
};

const HowItWorks = () => {
    const { language } = useLanguage();
    const steps = STEPS[language] || STEPS.en;
    const title = SECTION_TITLE[language] || SECTION_TITLE.en;
    const subtitle = SECTION_SUBTITLE[language] || SECTION_SUBTITLE.en;

    return (
        <section style={{
            padding: '80px 0',
            background: 'rgba(255,255,255,0.015)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.04)'
        }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, marginBottom: '12px' }}>
                        {title}
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>{subtitle}</p>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                    {steps.map((step, i) => (
                        <React.Fragment key={step.number}>
                            <Step step={step} index={i} />
                            {i < steps.length - 1 && (
                                <div className="hiw-arrow" style={{
                                    display: 'flex', alignItems: 'center', color: 'rgba(246,208,39,0.3)',
                                    fontSize: '24px', flexShrink: 0, alignSelf: 'center'
                                }}>→</div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
