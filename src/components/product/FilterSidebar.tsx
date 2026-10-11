import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { ProductCategory } from '../../types';

interface FilterSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { filters, setFilters, resetFilters, formatPrice } = useStore();

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All Collections', value: 'all' },
    { label: 'Silk Dresses', value: 'dresses' },
    { label: 'Co-Ords & Sets', value: 'co-ords' },
    { label: 'Tops & Blouses', value: 'tops' },
    { label: 'Trousers & Bottoms', value: 'bottoms' },
    { label: 'Coats & Blazers', value: 'outerwear' },
    { label: 'Evening Gowns', value: 'evening' },
    { label: 'Handbags & Accessories', value: 'accessories' },
    { label: 'Footwear & Mules', value: 'shoes' },
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

  const toggleSize = (size: string) => {
    setFilters(prev => {
      const exists = prev.selectedSizes.includes(size);
      return {
        ...prev,
        selectedSizes: exists
          ? prev.selectedSizes.filter(s => s !== size)
          : [...prev.selectedSizes, size]
      };
    });
  };

  const content = (
    <div className="space-y-8">
      
      {/* Category List */}
      <div>
        <h4 className="text-xs uppercase tracking-wider font-bold text-noir-950 mb-3">
          Category
        </h4>
        <div className="space-y-1.5">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilters(prev => ({ ...prev, category: cat.value }))}
              className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-all flex items-center justify-between ${
                filters.category === cat.value
                  ? 'bg-melly-100 text-melly-900 font-bold'
                  : 'text-stone-700 font-medium hover:text-noir-950 hover:bg-stone-100'
              }`}
            >
              <span>{cat.label}</span>
              {filters.category === cat.value && (
                <span className="w-1.5 h-1.5 rounded-full bg-melly-700"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs uppercase tracking-wider font-bold text-noir-950">
            Price Range
          </h4>
          <span className="text-xs text-melly-900 font-bold">
            Up to {formatPrice(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={1000}
          step={25}
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-noir-900"
        />
        <div className="flex justify-between text-xs text-stone-600 font-medium mt-1">
          <span>{formatPrice(50)}</span>
          <span>{formatPrice(1000)}</span>
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider font-bold text-noir-950 mb-3">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map(size => {
            const isSelected = filters.selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  isSelected
                    ? 'bg-noir-950 text-white border-noir-950 shadow-xs'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-noir-950 hover:text-noir-950'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
      <div className="pt-2 border-t border-stone-200">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs text-noir-950 font-semibold">In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-noir-950 focus:ring-0 cursor-pointer accent-noir-950"
          />
        </label>
      </div>

      {/* Reset Action */}
      <button
        onClick={resetFilters}
        className="w-full py-2.5 border border-stone-200 hover:border-stone-400 text-stone-600 hover:text-noir-900 text-xs uppercase tracking-luxury font-medium rounded flex items-center justify-center space-x-2 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset All Filters</span>
      </button>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8 border-r border-stone-200">
        <div className="sticky top-28">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
            <span className="font-serif text-lg text-noir-950">Refine Selection</span>
            <button
              onClick={resetFilters}
              className="text-[11px] text-melly-700 hover:text-melly-900 underline font-medium"
            >
              Reset
            </button>
          </div>
          {content}
        </div>
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#FAF8F5] h-full shadow-2xl p-6 overflow-y-auto z-10 animate-fade-in flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
                <span className="font-serif text-lg text-noir-950">Refine Selection</span>
                <button 
                  onClick={onCloseMobile}
                  className="p-1 rounded-full text-stone-500 hover:text-noir-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 mt-6 border-t border-stone-200">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-noir-950 text-white text-xs uppercase tracking-luxury font-semibold rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
