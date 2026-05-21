import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeV1 from './pages/HomeV1';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import { LanguageProvider } from './LanguageContext';

const About = React.lazy(() => import('./pages/About'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Contact = React.lazy(() => import('./pages/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const PageFallback = () => (
  <div style={{ minHeight: '100vh', background: 'var(--color-primary)' }} />
);

function App() {
  return (
    <LanguageProvider>
      <Router>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ScrollToTop />
        <CookieConsent />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomeV1 />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </LanguageProvider>
  );
}

export default App;
