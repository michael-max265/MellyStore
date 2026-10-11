import React, { useEffect, useRef } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setFilters, userProfile, setIsAuthOpen, setAuthMode, showToast } = useStore();
  const sectionRef = useRef<HTMLElement>(null);

  const handleExplore = () => {
    if (!userProfile) {
      setAuthMode('signin');
      setIsAuthOpen(true);
      showToast('Client Account Required', 'Please sign in or create an account to start shopping our curated collection.', 'info');
      return;
    }
    setFilters(prev => ({ ...prev, category: 'all' }));
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll-reveal on children
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const pressNames = [
    'BELLA NAIJA STYLE',
    'TW MAGAZINE',
    'GUARDIAN LIFE',
    'ARISE MAGAZINE',
    'VANGUARD ALLURE',
    'THISDAY STYLE'
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#F7F3EE] via-[#FAF8F5] to-[#FAF8F5] border-b border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Editorial Headline & Story */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">

            {/* Collection badge */}
            <div
              className="reveal animate-fade-in inline-flex items-center space-x-2 bg-stone-100/90 border border-stone-200/90 px-3.5 py-1.5 rounded-full"
              style={{ animationDelay: '0.1s' }}
            >
              <Compass className="w-3.5 h-3.5 text-melly-800" />
              <span className="text-[11px] font-semibold tracking-luxury uppercase text-stone-900">
                MellyStore Studio Collection 2026
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1
                className="reveal animate-slide-up font-serif text-3xl sm:text-5xl lg:text-6xl text-noir-950 font-normal leading-[1.14] tracking-tight"
                style={{ animationDelay: '0.18s' }}
              >
                Quiet luxury,{' '}
                <br />
                <span className="italic font-normal text-noir-900">
                  timeless elegance.
                </span>
              </h1>

              <p
                className="reveal animate-fade-in text-stone-700 text-xs sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal"
                style={{ animationDelay: '0.3s' }}
              >
                MellyStore curates heirloom-grade silhouettes crafted from certified
                Grade-6A mulberry silks, softest Mongolian cashmeres, and tailored Italian
                wools. Made for the discerning woman.
              </p>
            </div>

            {/* CTAs */}
            <div
              className="reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
              style={{ animationDelay: '0.4s' }}
            >
              <button
                onClick={handleExplore}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-noir-950 hover:bg-melly-900 text-white text-xs uppercase tracking-luxury font-medium transition-all shadow-luxury hover:shadow-luxury-hover flex items-center justify-center space-x-3 group hover:scale-[1.02] active:scale-95"
                style={{ transition: 'background-color 0.25s ease, transform 0.25s ease' }}
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>

              <a
                href="#lookbook"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-stone-300 hover:border-noir-900 text-noir-900 hover:text-noir-950 text-xs uppercase tracking-luxury font-medium transition-all text-center hover:scale-[1.02] active:scale-95 bg-white/70"
                style={{ transition: 'all 0.25s ease' }}
              >
                Editorial Lookbook
              </a>
            </div>

            {/* Hallmarks */}
            <div
              className="reveal grid grid-cols-3 gap-2 sm:gap-4 pt-5 sm:pt-6 border-t border-stone-200/80 text-center lg:text-left"
              style={{ animationDelay: '0.5s' }}
            >
              {[
                { value: '100%', label: 'Grade 6A Silks' },
                { value: 'Limited', label: 'Studio Runs' },
                { value: 'Express', label: 'White-Glove Courier' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="group cursor-default"
                  style={{ animationDelay: `${0.55 + i * 0.1}s` }}
                >
                  <p
                    className="font-serif text-lg sm:text-2xl text-noir-900 font-medium transition-colors"
                  >
                    {stat.value}
                  </p>
                  <p className="text-[9px] sm:text-[11px] uppercase tracking-wider text-stone-500 mt-0.5 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Editorial Hero Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Main Portrait Frame */}
              <div
                className="reveal animate-slide-in-right relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] max-h-[460px] sm:max-h-[580px] w-full border-4 border-white"
                style={{ animationDelay: '0.25s' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85"
                  alt="MellyStore Luxury Collection"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-amber-200">Curated Capsule</span>
                  <p className="font-serif text-xl sm:text-2xl font-normal mt-1">The Paloma Ribbed Cashmere Set</p>
                  <p className="text-xs text-stone-200 mt-0.5 font-light">Pure Grade-A Cashmere in Warm Alabaster</p>
                </div>
              </div>

              {/* Floating Accent Card */}
              <div
                className="hidden sm:block absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-luxury border border-stone-200/80 max-w-[210px] animate-fade-in cursor-pointer hover:-translate-y-1 transition-transform"
                style={{ animationDelay: '0.7s' }}
                onClick={handleExplore}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=200&q=80"
                    alt="Aurelia Slip Dress"
                    className="w-12 h-14 object-cover rounded-md"
                  />
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-melly-700 font-semibold block">Iconic Edit</span>
                    <p className="text-xs font-serif font-medium text-noir-900 leading-tight">Aurelia Silk Slip</p>
                    <p className="text-[11px] font-semibold text-noir-800 mt-0.5">$245</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div
                className="hidden sm:block absolute -top-4 -right-4 bg-noir-950 text-stone-100 px-4 py-2 rounded-full text-[10px] tracking-luxury uppercase font-semibold shadow-lg border border-stone-700 animate-fade-in"
                style={{ animationDelay: '0.8s' }}
              >
                MellyStore Studio Runway 2026
              </div>

            </div>
          </div>

        </div>

        {/* Editorial Press Bar — Grounding the brand as a real luxury house */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-stone-200">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-center text-stone-600 font-semibold mb-3 sm:mb-4">
            Featured In Renowned Fashion & Culture Editorials
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-12 text-[11px] sm:text-sm font-serif tracking-[0.12em] sm:tracking-[0.14em] text-stone-700 uppercase font-medium">
            {pressNames.map((name, i) => (
              <span key={i} className="hover:text-noir-950 transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
