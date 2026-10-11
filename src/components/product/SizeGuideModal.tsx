import React, { useState } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isSizeGuideOpen) return null;

  const sizeChart = [
    { size: 'XS', us: '0 - 2', uk: '4 - 6', eu: '32 - 34', bustIn: '31 - 32', waistIn: '24 - 25', hipIn: '34 - 35', bustCm: '79 - 82', waistCm: '61 - 64', hipCm: '86 - 89' },
    { size: 'S', us: '4 - 6', uk: '8 - 10', eu: '36 - 38', bustIn: '33 - 34', waistIn: '26 - 27', hipIn: '36 - 37', bustCm: '84 - 87', waistCm: '66 - 69', hipCm: '91 - 94' },
    { size: 'M', us: '8 - 10', uk: '12 - 14', eu: '40 - 42', bustIn: '35 - 36', waistIn: '28 - 29', hipIn: '38 - 39', bustCm: '89 - 92', waistCm: '71 - 74', hipCm: '96 - 99' },
    { size: 'L', us: '12 - 14', uk: '16 - 18', eu: '44 - 46', bustIn: '37 - 39', waistIn: '30 - 32', hipIn: '40 - 42', bustCm: '94 - 99', waistCm: '76 - 81', hipCm: '101 - 107' },
    { size: 'XL', us: '16', uk: '20', eu: '48', bustIn: '40 - 42', waistIn: '33 - 35', hipIn: '43 - 45', bustCm: '101 - 107', waistCm: '84 - 89', hipCm: '109 - 114' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsSizeGuideOpen(false)} 
      />

      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-2xl shadow-2xl p-6 sm:p-8 border border-stone-200 z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-melly-700" />
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-noir-950 font-normal">
                Boutique Size & Measurement Guide
              </h3>
              <p className="text-xs text-stone-500 font-light">
                Find your quintessential MellyStore silhouette fit.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-2 rounded-full text-stone-400 hover:text-noir-900 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between my-5">
          <span className="text-xs uppercase tracking-wider font-semibold text-noir-900">
            Conversion Chart
          </span>
          <div className="flex items-center bg-stone-200 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded-md transition-all ${
                unit === 'in' ? 'bg-noir-950 text-white shadow-sm' : 'text-stone-600'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-md transition-all ${
                unit === 'cm' ? 'bg-noir-950 text-white shadow-sm' : 'text-stone-600'
              }`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-stone-200 rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4EFEA] text-noir-900 uppercase tracking-wider text-[10px] border-b border-stone-200 font-semibold">
              <tr>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">US</th>
                <th className="py-3 px-3">UK / AU</th>
                <th className="py-3 px-3">EU / FR</th>
                <th className="py-3 px-3">Bust ({unit})</th>
                <th className="py-3 px-3">Waist ({unit})</th>
                <th className="py-3 px-3">Hips ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-noir-950">{row.size}</td>
                  <td className="py-3 px-3">{row.us}</td>
                  <td className="py-3 px-3">{row.uk}</td>
                  <td className="py-3 px-3">{row.eu}</td>
                  <td className="py-3 px-3">{unit === 'in' ? row.bustIn : row.bustCm}</td>
                  <td className="py-3 px-3">{unit === 'in' ? row.waistIn : row.waistCm}</td>
                  <td className="py-3 px-3">{unit === 'in' ? row.hipIn : row.hipCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tips */}
        <div className="mt-6 bg-[#F4EFEA] p-4 rounded-xl border border-stone-200 space-y-2">
          <div className="flex items-center space-x-2 text-melly-800 font-semibold text-xs">
            <HelpCircle className="w-4 h-4" />
            <span>How To Measure Your Body Accurately:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-stone-600 font-light">
            <div>
              <span className="font-semibold text-noir-900 block">1. Bust:</span>
              Measure around the fullest part of your chest, keeping tape horizontal.
            </div>
            <div>
              <span className="font-semibold text-noir-900 block">2. Waist:</span>
              Measure around the narrowest natural curve of your torso, above the belly button.
            </div>
            <div>
              <span className="font-semibold text-noir-900 block">3. Hips:</span>
              Stand with heels together and measure around the fullest curve of your hips and rear.
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-6 py-2.5 bg-noir-950 text-white text-xs uppercase tracking-luxury font-medium rounded hover:bg-melly-900 transition-colors"
          >
            Got It, Close
          </button>
        </div>

      </div>
    </div>
  );
};
