import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Newsletter from '../components/Newsletter';
import LeadForm from '../components/LeadForm';

const HomeV1 = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
                <Hero />
                <Services showActions={false} showMainAction={true} />
                <Newsletter />
                <LeadForm />
            </main>
            <Footer />
        </div>
    );
};

export default HomeV1;
