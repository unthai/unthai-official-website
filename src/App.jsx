import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeV1 from './pages/HomeV1';
import Blog from './pages/Blog';
import ServicesPage from './pages/ServicesPage';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomeV1 />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
