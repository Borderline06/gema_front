import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import About from '../pages/About';
import Pricing from '../pages/Pricing';
import Blog from '../pages/Blog';
import NotFound from '../pages/NotFound';

// Layout de las páginas públicas (navbar + footer fijos, contenido variable).
const PublicLayout = () => (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
        <Footer />
    </div>
);

export default PublicLayout;
