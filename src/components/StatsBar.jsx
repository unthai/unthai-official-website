import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../LanguageContext';

const useCountUp = (target, duration = 1800, started) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!started) return;
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            // ease-out
            setVal(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [started, target, duration]);
    return val;
};

const Stat = ({ value, suffix, label, started }) => {
    const count = useCountUp(value, 1600, started);
    return (
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <div style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 800,
                color: 'var(--color-accent)',
                letterSpacing: '-0.02em',
                lineHeight: 1
            }}>
                {count}{suffix}
            </div>
            <div style={{
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                marginTop: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
            }}>
                {label}
            </div>
        </div>
    );
};

const Divider = () => (
    <div className="stats-divider" style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
);

const StatsBar = () => {
    const { t } = useLanguage();
    const ref = useRef(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
        }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(246, 208, 39, 0.02)',
            padding: '40px 0'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <Stat value={50} suffix="+" label={t('hero.stats.clients')} started={started} />
                <Divider />
                <Stat value={200} suffix="+" label={t('hero.stats.projects')} started={started} />
                <Divider />
                <Stat value={6} suffix="" label="Languages Supported" started={started} />
                <Divider />
                <div style={{ textAlign: 'center', padding: '0 24px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1 }}>24/7</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {t('hero.stats.support')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsBar;
