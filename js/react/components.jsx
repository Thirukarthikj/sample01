import React, { useState, useEffect, useRef } from 'react';

/**
 * Bobby Packaging - React Component Library
 * Modular, human-developed React 18 components for packaging catalog,
 * hero sliders, specification filters, and wholesale quotation modals.
 */

// 1. Navigation Header
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 shadow-md py-3' : 'bg-white/85 py-4 shadow-sm'
    } backdrop-blur-md border-b border-sky-100`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="index.html" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105 border border-sky-100">
            <img src="images/logobg.png" alt="Bobby Packaging Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="brand-title font-display text-xl font-bold tracking-tight text-slate-900 transition-colors">Bobby Packaging</span>
            <span className="brand-tagline text-[10px] tracking-wider uppercase font-semibold text-sky-600 hidden sm:block">Sivakasi, Tamil Nadu</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
          <a href="index.html" className="nav-link font-semibold text-[15px] transition-colors py-1 text-sky-600 border-b-2 border-sky-500">Home</a>
          <a href="about.html" className="nav-link font-medium text-[15px] transition-colors py-1 text-slate-700 hover:text-sky-600">About Us</a>
          <a href="products.html" className="nav-link font-medium text-[15px] transition-colors py-1 text-slate-700 hover:text-sky-600">Primary Bags</a>
          <a href="films.html" className="nav-link font-medium text-[15px] transition-colors py-1 text-slate-700 hover:text-sky-600">Specialty Films</a>
          <a href="gallery.html" className="nav-link font-medium text-[15px] transition-colors py-1 text-slate-700 hover:text-sky-600">Machinery & Works</a>
          <a href="contact.html" className="nav-link font-medium text-[15px] transition-colors py-1 text-slate-700 hover:text-sky-600">Contact</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="#enquiryModal" className="open-enquiry-modal bg-[#002140] hover:bg-sky-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2 group">
            <i className="ri-whatsapp-fill text-[#25D366] text-lg"></i>
            <span>WhatsApp Enquiry</span>
          </a>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-slate-800 p-2 text-2xl focus:outline-none cursor-pointer" aria-label="Toggle navigation">
          <i className="ri-menu-line"></i>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-sky-100 px-6 py-6 shadow-xl transition-all duration-300">
          <div className="flex flex-col gap-3 text-center">
            <a href="index.html" className="text-sm font-semibold text-sky-600 py-2">Home</a>
            <a href="about.html" className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2">About Us</a>
            <a href="products.html" className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2">Primary Bags</a>
            <a href="films.html" className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2">Specialty Films</a>
            <a href="gallery.html" className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2">Machinery & Works</a>
            <a href="contact.html" className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2">Contact</a>
            <div className="pt-4 border-t border-sky-100 flex flex-col gap-3">
              <a href="#enquiryModal" className="open-enquiry-modal w-full bg-[#002140] hover:bg-sky-900 text-white text-sm font-semibold py-3 rounded-full cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                <i className="ri-whatsapp-fill text-[#25D366] text-lg"></i>
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// 2. Hero Carousel Component
export function HeroCarousel({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const timer = useRef(null);

  const startAutoplay = () => {
    stopAutoplay();
    timer.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (timer.current) clearInterval(timer.current);
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-slate-50" onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, idx) => (
          <div key={idx} className="w-full flex-shrink-0 min-h-[600px] relative flex items-center text-gray-800">
            {slide.content}
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
              idx === current ? 'w-8 bg-primary' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// 3. Wholesale Enquiry Modal Component
export function EnquiryModal({ isOpen, onClose, defaultProduct = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: defaultProduct,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full relative z-10 text-left font-sans">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div>
            <h3 className="text-xl font-bold font-display text-primary">Request Wholesale Quote</h3>
            {defaultProduct && (
              <p className="text-xs text-gray-500 mt-0.5">Enquiry for: {defaultProduct}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl p-1 cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name or Business Name"
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary-light focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 87540 02737"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary-light focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary-light focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Product / Bag Type *</label>
              <input
                type="text"
                required
                value={formData.requirement}
                onChange={e => setFormData({ ...formData, requirement: e.target.value })}
                placeholder="e.g. LD Bread Covers, HM Bags, LD Rolls, PET Pouches"
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary-light focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Dimensions, Microns & Quantity</label>
              <textarea
                rows="3"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about target bag dimensions, thickness in microns, estimated order quantity..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary-light focus:outline-none resize-none"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-secondary hover:bg-secondary-dark text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2">
              <i className="ri-whatsapp-line text-lg"></i>
              <span>Send Enquiry</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <i className="ri-checkbox-circle-fill text-5xl text-green-500 mx-auto mb-3 block"></i>
            <h4 className="text-xl font-bold font-display text-primary mb-1">Enquiry Sent!</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">Our packaging specialists in Sivakasi will contact you with pricing and specifications.</p>
            <button onClick={onClose} className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// 4. Back to Top Button
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-40 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg border border-sky-100 transition-all cursor-pointer"
      aria-label="Back to top"
    >
      <i className="ri-arrow-up-line text-lg"></i>
    </button>
  );
}
