import React, { useState, useEffect } from 'react';
import { Globe, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CURRENCY_CONFIGS, type CurrencyCode } from '../../types';

export const AnnouncementBar: React.FC = () => {
  const { currency, setCurrency } = useStore();
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const announcements = [
    'COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING ON ORDERS OVER $250',
    'THE AUTUMN/WINTER STUDIO CAPSULE IS NOW LIVE',
    'WELCOME PRIVILEGE: 10% OFF YOUR DEBUT ORDER WITH CODE MELLY10'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx(prev => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-noir-950 text-white/90 text-xs tracking-luxury border-b border-noir-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Left: Boutique Location Tag */}
        <div className="hidden md:flex items-center space-x-2 text-stone-400">
          <Globe className="w-3.5 h-3.5 text-stone-300 stroke-[1.5]" />
          <span className="font-light uppercase tracking-wider text-[11px]">Lagos, Nigeria</span>
        </div>

        {/* Center: Dynamic Announcement */}
        <div className="flex-1 text-center font-medium overflow-hidden px-1 sm:px-2 min-w-0">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 transition-all duration-700 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 hidden sm:inline-block shrink-0" />
            <span className="text-[10px] sm:text-xs tracking-wider uppercase text-stone-200 truncate">
              {announcements[announcementIdx]}
            </span>
            <ChevronRight className="w-3 h-3 text-stone-400 hidden sm:inline stroke-[1.5] shrink-0" />
          </div>
        </div>

        {/* Right: Currency Switcher */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <span className="text-stone-400 text-[10px] uppercase tracking-wider hidden sm:inline">Currency:</span>
          <select
            value={currency.code}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-noir-900 border border-noir-700 text-champagne-300 text-[10px] sm:text-[11px] rounded px-1.5 sm:px-2 py-0.5 focus:outline-none focus:border-champagne-400 cursor-pointer uppercase font-medium tracking-wider"
          >
            {(Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map(code => (
              <option key={code} value={code}>
                {code} ({CURRENCY_CONFIGS[code].symbol})
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
