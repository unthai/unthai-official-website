import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

const TESTIMONIALS = {
    en: [
        {
            quote: "UNTH.AI built us a full AI content pipeline in under two weeks. Our output tripled without adding headcount.",
            name: "James R.",
            role: "CEO, DTC Brand (UK)",
            initials: "JR"
        },
        {
            quote: "The AI agent they deployed handles 80% of our customer support tickets automatically. ROI was immediate.",
            name: "Sakura T.",
            role: "Head of Ops, E-commerce (JP)",
            initials: "ST"
        },
        {
            quote: "From first call to live system in 10 days. The team is fast, precise, and actually understands AI.",
            name: "Marc D.",
            role: "Founder, SaaS Startup (FR)",
            initials: "MD"
        }
    ],
    jp: [
        {
            quote: "UNTH.AIは2週間以内に完全なAIコンテンツパイプラインを構築しました。人員を増やさずに生産量が3倍になりました。",
            name: "ジェームズ R.",
            role: "CEO, DTCブランド（英国）",
            initials: "JR"
        },
        {
            quote: "彼らが導入したAIエージェントが、顧客サポートチケットの80%を自動処理します。ROIはすぐに現れました。",
            name: "サクラ T.",
            role: "オペレーション責任者、EC（日本）",
            initials: "ST"
        },
        {
            quote: "初回コールからライブシステムまで10日。チームは速く、正確で、AIを本当に理解しています。",
            name: "マルク D.",
            role: "創業者、SaaSスタートアップ（フランス）",
            initials: "MD"
        }
    ],
    ko: [
        {
            quote: "UNTH.AI는 2주 이내에 완전한 AI 콘텐츠 파이프라인을 구축했습니다. 인원 추가 없이 생산량이 3배가 됐습니다.",
            name: "제임스 R.",
            role: "CEO, DTC 브랜드 (영국)",
            initials: "JR"
        },
        {
            quote: "그들이 배포한 AI 에이전트가 고객 지원 티켓의 80%를 자동으로 처리합니다. ROI는 즉각적이었습니다.",
            name: "사쿠라 T.",
            role: "운영 책임자, 이커머스 (일본)",
            initials: "ST"
        },
        {
            quote: "첫 통화에서 라이브 시스템까지 10일. 팀은 빠르고, 정확하며, AI를 진정으로 이해합니다.",
            name: "마르크 D.",
            role: "창업자, SaaS 스타트업 (프랑스)",
            initials: "MD"
        }
    ],
    fr: [
        {
            quote: "UNTH.AI nous a construit un pipeline de contenu IA complet en moins de deux semaines. Notre production a triplé.",
            name: "James R.",
            role: "CEO, Marque DTC (UK)",
            initials: "JR"
        },
        {
            quote: "L'agent IA qu'ils ont déployé traite automatiquement 80% de nos tickets de support. Le ROI était immédiat.",
            name: "Sakura T.",
            role: "Directrice des Opérations, E-commerce (JP)",
            initials: "ST"
        },
        {
            quote: "Du premier appel au système en production en 10 jours. L'équipe est rapide, précise et comprend vraiment l'IA.",
            name: "Marc D.",
            role: "Fondateur, SaaS Startup (FR)",
            initials: "MD"
        }
    ],
    de: [
        {
            quote: "UNTH.AI hat uns in unter zwei Wochen eine vollständige KI-Content-Pipeline gebaut. Unser Output hat sich verdreifacht.",
            name: "James R.",
            role: "CEO, DTC-Marke (UK)",
            initials: "JR"
        },
        {
            quote: "Der von ihnen eingesetzte KI-Agent bearbeitet automatisch 80% unserer Support-Tickets. Der ROI war sofort spürbar.",
            name: "Sakura T.",
            role: "Head of Ops, E-Commerce (JP)",
            initials: "ST"
        },
        {
            quote: "Vom ersten Gespräch zum Live-System in 10 Tagen. Das Team ist schnell, präzise und versteht KI wirklich.",
            name: "Marc D.",
            role: "Gründer, SaaS-Startup (FR)",
            initials: "MD"
        }
    ],
    es: [
        {
            quote: "UNTH.AI nos construyó un pipeline de contenido IA completo en menos de dos semanas. Nuestra producción se triplicó.",
            name: "James R.",
            role: "CEO, Marca DTC (UK)",
            initials: "JR"
        },
        {
            quote: "El agente IA que desplegaron maneja automáticamente el 80% de nuestros tickets de soporte. El ROI fue inmediato.",
            name: "Sakura T.",
            role: "Jefa de Operaciones, E-commerce (JP)",
            initials: "ST"
        },
        {
            quote: "Del primer contacto al sistema en producción en 10 días. El equipo es rápido, preciso y realmente entiende la IA.",
            name: "Marc D.",
            role: "Fundador, SaaS Startup (FR)",
            initials: "MD"
        }
    ],
    th: [
        {
            quote: "UNTH.AI สร้าง AI content pipeline ให้เราภายในสองสัปดาห์ ผลผลิตเพิ่มขึ้นสามเท่าโดยไม่ต้องเพิ่มทีม",
            name: "James R.",
            role: "CEO, DTC Brand (UK)",
            initials: "JR"
        },
        {
            quote: "AI agent ที่พวกเขาติดตั้งจัดการตั๋วซัพพอร์ต 80% โดยอัตโนมัติ ROI เกิดขึ้นทันที",
            name: "Sakura T.",
            role: "หัวหน้าฝ่ายปฏิบัติการ, E-commerce (JP)",
            initials: "ST"
        },
        {
            quote: "จากการโทรครั้งแรกสู่ระบบสดในสิบวัน ทีมรวดเร็ว แม่นยำ และเข้าใจ AI จริงๆ",
            name: "Marc D.",
            role: "ผู้ก่อตั้ง, SaaS Startup (FR)",
            initials: "MD"
        }
    ]
};

const SECTION_TITLE = {
    en: 'What Clients Say',
    jp: 'クライアントの声',
    ko: '고객 후기',
    fr: 'Ce que disent nos clients',
    de: 'Was Kunden sagen',
    es: 'Lo que dicen los clientes',
    th: 'ลูกค้าพูดว่าอะไร'
};

const SECTION_SUBTITLE = {
    en: 'Real results from real businesses — not case studies, not projections.',
    jp: '実際のビジネスからの実際の結果。',
    ko: '실제 비즈니스의 실제 결과 — 사례 연구가 아닌, 실제 성과.',
    fr: 'De vrais résultats pour de vraies entreprises — pas des études de cas.',
    de: 'Echte Ergebnisse von echten Unternehmen — keine Fallstudien.',
    es: 'Resultados reales de empresas reales — no estudios de caso.',
    th: 'ผลลัพธ์จริงจากธุรกิจจริง — ไม่ใช่แค่ case study'
};

const TestimonialCard = ({ testimonial, index }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <motion.div
            ref={ref}
            className="testimonial-card"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-md)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                flex: 1,
                minWidth: '260px'
            }}
        >
            {/* Quote mark */}
            <span style={{
                position: 'absolute',
                top: '20px',
                right: '24px',
                fontSize: '64px',
                lineHeight: 1,
                color: 'rgba(246,208,39,0.08)',
                fontFamily: 'Georgia, serif',
                userSelect: 'none'
            }}>"</span>

            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: 'var(--color-accent)', fontSize: '14px' }}>★</span>
                ))}
            </div>

            <p style={{
                color: 'rgba(255,255,255,0.82)',
                lineHeight: 1.7,
                fontSize: '15px',
                fontStyle: 'italic',
                flex: 1
            }}>
                "{testimonial.quote}"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Avatar */}
                <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-accent) 0%, rgba(246,208,39,0.4) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    flexShrink: 0
                }}>
                    {testimonial.initials}
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-main)' }}>
                        {testimonial.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {testimonial.role}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Testimonials = () => {
    const { language } = useLanguage();
    const testimonials = TESTIMONIALS[language] || TESTIMONIALS.en;
    const title = SECTION_TITLE[language] || SECTION_TITLE.en;
    const subtitle = SECTION_SUBTITLE[language] || SECTION_SUBTITLE.en;

    return (
        <section style={{ padding: '80px 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, marginBottom: '12px' }}>
                        {title}
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>{subtitle}</p>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} testimonial={t} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
