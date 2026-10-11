import React, { useEffect, useRef } from 'react';
import { Feather, Award, Truck, RefreshCw } from 'lucide-react';

export const BrandValues: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const values = [
    {
      icon: Feather,
      title: 'Noble Natural Fibers',
      desc: 'Certified 22-momme mulberry silks from Como and pure grade-A Mongolian cashmere.',
      accent: 'text-amber-800 bg-amber-50 border border-amber-200/60',
    },
    {
      icon: Award,
      title: 'Studio Tailoring',
      desc: 'Small-batch production, hand-finished French seams, and rigorous architectural drape testing.',
      accent: 'text-melly-800 bg-melly-50 border border-melly-200/60',
    },
    {
      icon: Truck,
      title: 'Complimentary Express',
      desc: 'Dispatched in signature keepsake champagne boxes with bespoke cedar garment protection.',
      accent: 'text-stone-800 bg-stone-100 border border-stone-200',
    },
    {
      icon: RefreshCw,
      title: '30-Day Studio Returns',
      desc: 'Enjoy effortless door-to-door courier collection and complimentary boutique exchanges.',
      accent: 'text-noir-800 bg-[#F4EFEA] border border-stone-200',
    }
  ];

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
      { threshold: 0.15 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal, .reveal-scale');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-stone-200 bg-[#FAF8F5] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="reveal text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-melly-600 block mb-1">
            Our Hallmarks
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-noir-950 font-normal">
            The MellyStore Promise
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className={`
                  reveal-scale reveal-delay-${i + 1}
                  group flex flex-col items-start space-y-3 p-6 rounded-2xl
                  bg-white border border-stone-100
                  transition-all duration-400
                  hover:shadow-luxury hover:-translate-y-1
                  cursor-default
                `}
                style={{ transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease' }}
              >
                {/* Icon container with pop animation on reveal */}
                <div
                  className={`
                    ${v.accent}
                    p-3.5 rounded-xl shrink-0
                    reveal-scale reveal-delay-${i + 1}
                    group-hover:scale-110
                    transition-transform duration-300
                  `}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Animated underline bar */}
                <div className="w-8 h-0.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-melly-500 rounded-full transition-all duration-500 group-hover:w-full"
                    style={{ width: '0%', transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-noir-950 tracking-wider uppercase group-hover:text-melly-800 transition-colors duration-200">
                    {v.title}
                  </h4>
                  <p className="text-xs text-stone-600 font-normal mt-1.5 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
