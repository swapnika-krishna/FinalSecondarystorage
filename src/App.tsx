import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Concepts } from './pages/Concepts';
import { ConceptDetail } from './pages/ConceptDetail';
import { Simulations } from './pages/Simulations';
import { Playground } from './pages/Playground';
import { Quiz } from './pages/Quiz';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concepts" element={<Concepts />} />
          <Route path="/concepts/:id" element={<ConceptDetail />} />
          <Route path="/simulations" element={<Simulations />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </Layout>
    </Router>
  );
}

