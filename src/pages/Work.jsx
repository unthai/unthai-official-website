import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Quote } from 'lucide-react';
import Seo, { SITE_URL } from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { CASE_STUDIES, CASE_STUDY_CATEGORIES } from '../data/caseStudies';
import { trackCtaClick } from '../lib/analytics';
import heroBg from '../assets/unthai-ai-automation-bg.webp';

const Work = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered =
    activeFilter === 'all'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((c) => c.serviceKey === activeFilter);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...CASE_STUDIES.map((cs, i) => ({
        '@type': 'CreativeWork',
        name: cs.title,
        description: cs.outcome,
        about: cs.service,
        author: { '@type': 'Organization', name: 'UNTH.AI', url: SITE_URL },
        url: `${SITE_URL}/work#${cs.id}`,
        position: i + 1,
      })),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/work` },
        ],
      },
    ],
  };

  return (
    <div style={{ background: 'var(--color-primary)', minHeight: '100vh', color: 'var(--color-text-main)' }}>
      <Seo
        title="Work — UNTH.AI"
        description="Real client results from AI agents, automation, content engines, and growth systems. See how we deliver measurable outcomes."
        path="/work"
        jsonLd={jsonLd}
      />
      <Header />

      {/* ── Hero ─────────────────────────────────── */}
      <section
        id="main-content"
        style={{
          position: 'relative',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingTop: '100px',
          paddingBottom: '48px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(5, 18, 36, 0.4), var(--color-primary) 90%)',
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'inline-block',
              background: 'rgba(246, 208, 39, 0.1)',
              color: 'var(--color-accent)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            CLIENT RESULTS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '20px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Systems That Deliver{' '}
            <span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'initial' }}>Real Results</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--color-text-muted)',
              maxWidth: '650px',
              margin: '0 auto',
            }}
          >
            Every case study below is a real deployment. We don't do theoretical — we build, deploy, and measure.
          </motion.p>
        </div>
      </section>

      {/* ── Case Studies ──────────────────────────── */}
      <section className="container" style={{ paddingBottom: '80px' }}>
        {/* Filter Bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '48px',
          }}
        >
          {CASE_STUDY_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${activeFilter === cat.key ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                background: activeFilter === cat.key ? 'rgba(246, 208, 39, 0.15)' : 'transparent',
                color: activeFilter === cat.key ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== cat.key) {
                  e.currentTarget.style.borderColor = 'rgba(246, 208, 39, 0.3)';
                  e.currentTarget.style.color = 'var(--color-accent)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== cat.key) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
            >
              {filtered.map((cs, index) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '60px 0' }}
            >
              No case studies in this category yet. Check back soon!
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {/* ── CTA Section ──────────────────────────── */}
      <section
        className="section-padding"
        style={{
          background: 'rgba(255,255,255,0.015)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 700, marginBottom: '16px' }}>
              Ready to Build Your Case Study?
            </h2>
            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '18px',
                marginBottom: '32px',
                lineHeight: 1.6,
              }}
            >
              The next results page could be yours. Let's talk about your goals and build a system that delivers
              measurable outcomes.
            </p>
            <Link
              to="/contact"
              onClick={() => trackCtaClick({ label: 'work_cta_start_project', location: 'work_page' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 36px',
                background: 'var(--color-accent)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '16px',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(246, 208, 39, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Start a Project <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

/* ── Case Study Card ──────────────────────────── */

const CaseStudyCard = ({ caseStudy: cs, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      id={cs.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(246, 208, 39, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {/* Header Row */}
      <div
        style={{
          padding: '32px 32px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'rgba(246,208,39,0.1)',
              border: '1px solid rgba(246,208,39,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <cs.icon size={24} color="var(--color-accent)" strokeWidth={1.5} />
          </div>
          <div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--color-accent)',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            >
              {cs.client} · {cs.industry}
            </div>
            <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 700, lineHeight: 1.2 }}>
              {cs.title}
            </h2>
          </div>
        </div>
        <div
          style={{
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(246,208,39,0.1)',
            border: '1px solid rgba(246,208,39,0.2)',
            color: 'var(--color-accent)',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {cs.service}
        </div>
      </div>

      {/* Results Bar */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          padding: '24px 32px',
          margin: '24px 32px 0',
          background: 'rgba(246, 208, 39, 0.03)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(246, 208, 39, 0.08)',
        }}
      >
        {cs.results.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BarChart3 size={16} color="var(--color-accent)" />
            <div>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-accent)' }}>
                {r.metric}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                {r.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Challenge */}
              <div>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  The Challenge
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '15px' }}>
                  {cs.challenge}
                </p>
              </div>

              {/* Solution */}
              <div>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  The Solution
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '15px' }}>
                  {cs.solution}
                </p>
              </div>

              {/* Outcome */}
              <div>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  The Outcome
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '15px' }}>
                  {cs.outcome}
                </p>
              </div>

              {/* Quote */}
              {cs.quote && (
                <div
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(246, 208, 39, 0.04)',
                    borderLeft: '3px solid var(--color-accent)',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                  }}
                >
                  <Quote size={16} color="var(--color-accent)" style={{ marginBottom: '8px', opacity: 0.6 }} />
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: 1.6, fontSize: '15px' }}>
                    "{cs.quote}"
                  </p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '8px', fontWeight: 500 }}>
                    — {cs.quoteName}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div
        style={{
          padding: '16px 32px',
          borderTop: expanded ? '1px solid rgba(255,255,255,0.04)' : 'none',
          marginTop: expanded ? '0' : '20px',
        }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--color-accent)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 0',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {expanded ? 'Show less' : 'Read full case study'}
          <span style={{ display: 'inline-block', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>▾</span>
        </button>
      </div>
    </motion.article>
  );
};

export default Work;
