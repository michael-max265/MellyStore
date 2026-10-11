import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { ProductCategory } from '../../types';

interface CategoryCard {
  category: ProductCategory;
  title: string;
  subtitle: string;
  image: string;
  spanCol: string;
}

export const CategoryHighlights: React.FC = () => {
  const { setFilters, userProfile, setIsAuthOpen, setAuthMode, showToast } = useStore();
  const sectionRef = useRef<HTMLElement>(null);

  const categories: CategoryCard[] = [
    {
      category: 'dresses',
      title: 'Silk & Slip Dresses',
      subtitle: 'Effortless Drapes & Evening Silhouettes',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      spanCol: 'md:col-span-4'
    },
    {
      category: 'co-ords',
      title: 'Knitwear & Co-Ords',
      subtitle: 'Mongolian Cashmere & Linen Sets',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      spanCol: 'md:col-span-4'
    },
    {
      category: 'outerwear',
      title: 'Tailored Coats & Blazers',
      subtitle: 'Italian Virgin Wool & Nappa Leather',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      spanCol: 'md:col-span-4'
    },
    {
      category: 'evening',
      title: 'Evening Gowns & Gala',
      subtitle: 'Sculptured Corsetry & Organza Tiers',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      spanCol: 'md:col-span-6'
    },
    {
      category: 'accessories',
      title: 'Artisanal Handbags & Shoes',
      subtitle: 'Hand-Woven Tuscan Leathers',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      spanCol: 'md:col-span-6'
    }
  ];

  const handleSelect = (category: ProductCategory) => {
    if (!userProfile) {
      setAuthMode('signin');
      setIsAuthOpen(true);
      showToast('Client Account Required', 'Please sign in or create an account to start shopping.', 'info');
      return;
    }
    setFilters(prev => ({ ...prev, category }));
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll-reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.08 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="reveal reveal-delay-1 text-xs uppercase tracking-[0.3em] font-semibold text-melly-600 block mb-2">
              Curated Edit
            </span>
            <h2 className="reveal reveal-delay-2 font-serif text-3xl sm:text-4xl text-noir-950 font-normal overflow-hidden">
              <span className="inline-block">Explore By Category</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-3 text-stone-700 text-xs sm:text-sm max-w-md mt-3 md:mt-0 font-normal">
            Each collection is produced in small, conscientious batches using certified organic and traceable fabrics.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
          {categories.map((card, i) => (
            <div
              key={card.title}
              onClick={() => handleSelect(card.category)}
              className={`
                reveal reveal-scale
                reveal-delay-${Math.min(i + 1, 6)}
                group relative overflow-hidden cursor-pointer
                bg-stone-200 h-[380px] sm:h-[420px]
                rounded-xl shadow-sm
                hover-lift
                ${card.spanCol}
              `}
            >
              {/* Image with ken-burns on hover */}
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.07]"
              />

              {/* Multi-stop gradient overlay — shifts on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)',
                }}
              />

              {/* Hover shimmer accent */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(214,192,151,0.12) 0%, transparent 60%)',
                }}
              />

              {/* Category label top-left — slides in on mount */}
              <div className="absolute top-4 left-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <span className="text-[10px] uppercase tracking-wider text-champagne-300 font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {card.subtitle}
                </span>
              </div>

              {/* Text content bottom — slides up on hover */}
              <div className="absolute bottom-0 inset-x-0 p-6 text-white flex items-end justify-between">
                <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-400 ease-out">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-normal leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-champagne-200 font-semibold mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    Shop the edit →
                  </p>
                </div>

                {/* Animated arrow button */}
                <div className="
                  w-10 h-10 rounded-full
                  bg-white/15 backdrop-blur-md
                  flex items-center justify-center text-white
                  border border-white/25
                  group-hover:bg-white group-hover:text-noir-950
                  transition-all duration-300
                  transform group-hover:scale-110 group-hover:rotate-12
                  shadow-lg
                ">
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
