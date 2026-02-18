import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeV1 from './pages/HomeV1';
import Blog from './pages/Blog';
import ServicesPage from './pages/ServicesPage';
import V2 from './pages/V2';
import About from './pages/About';
import Contact from './pages/Contact';

import { LanguageProvider } from './LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeV1 />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/v2" element={<V2 />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
