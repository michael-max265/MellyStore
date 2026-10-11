import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ShoppingBag, Eye, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { LOOKBOOK_ITEMS } from '../../data/products';
import { useStore } from '../../context/StoreContext';

export const LookbookSection: React.FC = () => {
  const { 
    products, 
    formatPrice, 
    setSelectedProduct, 
    addToCart, 
    showToast, 
    setIsConciergeOpen,
    userProfile,
    setIsAuthOpen,
    setAuthMode
  } = useStore();
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageKey, setImageKey] = useState(0); // forces re-mount = re-animate
  const sectionRef = useRef<HTMLElement>(null);

  const activeLook = LOOKBOOK_ITEMS[activeLookIndex];
  const featuredProducts = products.filter(p => activeLook.featuredProductIds.includes(p.id));

  const switchLook = (idx: number) => {
    if (idx === activeLookIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveLookIndex(idx);
      setImageKey(k => k + 1);
      setIsTransitioning(false);
    }, 220);
  };

  const prevLook = () => switchLook((activeLookIndex - 1 + LOOKBOOK_ITEMS.length) % LOOKBOOK_ITEMS.length);
  const nextLook = () => switchLook((activeLookIndex + 1) % LOOKBOOK_ITEMS.length);

  // Scroll-reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
      { threshold: 0.08 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="lookbook" ref={sectionRef} className="py-20 bg-[#F4EFEA] border-y border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="reveal inline-flex items-center space-x-1.5 text-stone-600 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-stone-500 stroke-[1.5]" />
            <span className="text-[11px] font-semibold uppercase tracking-luxury text-stone-700">Editorial Lookbook</span>
          </div>
          <h2 className="reveal reveal-delay-1 font-serif text-3xl sm:text-4xl text-noir-950 font-normal">
            Shop The Curated Look
          </h2>

          {/* Animated quote — crossfades on look change */}
          <div className="relative h-8 mt-2 overflow-hidden">
            <p
              key={`quote-${activeLookIndex}`}
              className="absolute inset-0 text-stone-700 text-sm sm:text-base font-normal italic animate-cross-fade"
            >
              {activeLook.quote}
            </p>
          </div>

          {/* Lookbook Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {LOOKBOOK_ITEMS.map((look, idx) => (
              <button
                key={look.id}
                onClick={() => switchLook(idx)}
                className={`
                  relative text-xs uppercase tracking-luxury px-5 py-2 rounded-full
                  transition-all duration-300
                  ${activeLookIndex === idx
                    ? 'bg-noir-950 text-white shadow-md scale-105'
                    : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200 hover:scale-105'
                  }
                `}
              >
                {look.title}
                {activeLookIndex === idx && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 border-l border-b border-noir-950 rotate-[-45deg] bg-noir-950 hidden" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Main Large Editorial Image */}
          <div className="reveal-left lg:col-span-7 relative rounded-2xl overflow-hidden shadow-luxury aspect-[4/5] max-h-[600px] border border-stone-200 group">

            {/* Crossfade image */}
            <img
              key={`img-${imageKey}`}
              src={activeLook.image}
              alt={activeLook.title}
              className={`
                w-full h-full object-cover object-center
                transition-transform duration-700 group-hover:scale-[1.03]
                animate-cross-fade
                ${isTransitioning ? 'opacity-0 scale-105' : ''}
              `}
              style={{ animationDuration: '0.6s' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

            {/* Navigation arrows */}
            <button
              onClick={prevLook}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-noir-950 hover:scale-110 z-10"
              aria-label="Previous look"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextLook}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-noir-950 hover:scale-110 z-10"
              aria-label="Next look"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
              {LOOKBOOK_ITEMS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => switchLook(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    activeLookIndex === idx
                      ? 'w-5 h-1.5 bg-white'
                      : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to look ${idx + 1}`}
                />
              ))}
            </div>

            {/* Caption — crossfades */}
            <div
              key={`caption-${imageKey}`}
              className="absolute bottom-6 left-6 right-6 text-white animate-cross-fade"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-champagne-300 font-semibold block">
                Look {activeLookIndex + 1} of {LOOKBOOK_ITEMS.length}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal mt-1">
                {activeLook.title}
              </h3>
              <p className="text-stone-300 text-xs mt-1">{activeLook.subtitle}</p>
            </div>
          </div>

          {/* Items In This Look */}
          <div className="reveal-right lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-300/80 pb-3">
              <h4 className="font-serif text-lg text-noir-950">Pieces in this Outfit</h4>
              <span className="text-xs text-stone-500 font-medium">{featuredProducts.length} Items</span>
            </div>

            <div className="space-y-3">
              {featuredProducts.map((prod, pIdx) => (
                <div
                  key={`${prod.id}-${imageKey}`}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-stone-200/80 shadow-sm
                    flex items-center justify-between gap-4
                    hover:shadow-luxury transition-all duration-300
                    group hover:-translate-y-0.5
                    animate-slide-up"
                  style={{ animationDelay: `${pIdx * 0.08 + 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative overflow-hidden rounded-md w-16 h-20 shrink-0">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                        onClick={() => setSelectedProduct(prod)}
                      />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-melly-700 font-bold">{prod.category}</p>
                      <h5
                        onClick={() => setSelectedProduct(prod)}
                        className="font-serif text-sm font-semibold text-noir-950 cursor-pointer hover:text-melly-800 transition-colors"
                      >
                        {prod.name}
                      </h5>
                      <p className="text-sm font-bold text-noir-950 mt-0.5">{formatPrice(prod.price)}</p>
                      <p className="text-xs text-stone-600 mt-1 font-medium">
                        Available in {prod.sizes.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 shrink-0">
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      title="Quick View"
                      className="p-2 border border-stone-200 hover:border-noir-900 rounded-full text-stone-600 hover:text-noir-950 transition-all hover:scale-110 active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (!userProfile) {
                          setAuthMode('signin');
                          setIsAuthOpen(true);
                          showToast('Account Required', 'Please sign in or create an account to start shopping.', 'info');
                          return;
                        }
                        addToCart(prod, prod.sizes[0], prod.colors[0], 1);
                      }}
                      title="Quick Add to Bag"
                      className="p-2 bg-noir-950 hover:bg-melly-900 text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 1-Click Bundle Action */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block">Complete Capsule Value</span>
                  <span className="font-serif text-lg font-bold text-noir-950">
                    {formatPrice(featuredProducts.reduce((sum, p) => sum + p.price, 0))}
                  </span>
                </div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Complimentary Courier</span>
                </span>
              </div>

              <button
                onClick={() => {
                  featuredProducts.forEach(prod => {
                    addToCart(prod, prod.sizes[0], prod.colors[0], 1);
                  });
                  showToast('Complete Outfit Added', `All ${featuredProducts.length} pieces from "${activeLook.title}" were placed in your bag.`);
                }}
                className="w-full py-3 bg-noir-950 hover:bg-melly-900 text-white text-xs uppercase tracking-luxury font-medium rounded-lg shadow-luxury transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Entire Look to Bag ({featuredProducts.length} Pieces)</span>
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={() => setIsConciergeOpen(true)}
                  className="text-[11px] text-stone-600 hover:text-noir-950 underline font-medium"
                >
                  Consult stylist Adaeze on this look’s sizing
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
