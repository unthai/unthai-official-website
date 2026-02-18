import React from 'react';
import HeaderV2 from '../components/v2/HeaderV2';
import HeroV2 from '../components/v2/HeroV2';
import ServicesV2 from '../components/v2/ServicesV2';

const V2 = () => {
    return (
        <div className="theme-v2" style={{
            backgroundColor: 'var(--v2-color-bg)',
            color: 'var(--v2-color-text)',
            minHeight: '100vh',
            fontFamily: 'var(--v2-font-body)',
            overflowX: 'hidden'
        }}>
            <HeaderV2 />
            <HeroV2 />
            <ServicesV2 />
        </div>
    );
};

export default V2;
