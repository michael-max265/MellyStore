import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, X, ArrowUpDown, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductGrid: React.FC<{ onOpenMobileFilters: () => void }> = ({ onOpenMobileFilters }) => {
  const { 
    filteredProducts, 
    filters, 
    setFilters, 
    resetFilters 
  } = useStore();

  // Key increments on every filter change → re-mounts grid → re-triggers stagger animations
  const [gridKey, setGridKey] = useState(0);
  const prevFiltersRef = useRef(filters);
  useEffect(() => {
    if (prevFiltersRef.current !== filters) {
      setGridKey(k => k + 1);
      prevFiltersRef.current = filters;
    }
  }, [filters]);

  const removeSizeFilter = (size: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.filter(s => s !== size)
    }));
  };

  const removeColorFilter = (color: string) => {
    setFilters(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.filter(c => c !== color)
    }));
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.searchQuery !== '' || 
    filters.selectedSizes.length > 0 || 
    filters.selectedColors.length > 0 || 
    filters.maxPrice < 1000 ||
    filters.inStockOnly;

  return (
    <div className="flex-1">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-200 gap-4">
        
        {/* Left: Product count & Mobile filter trigger */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center space-x-2 px-3.5 py-2 border border-stone-300 rounded-md text-xs uppercase tracking-luxury font-medium text-noir-900 hover:border-noir-950 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <p className="text-xs text-stone-500 tracking-wider uppercase font-medium">
            Showing <span className="text-noir-950 font-bold">{filteredProducts.length}</span> Pieces
          </p>
        </div>

        {/* Right: Sort By Dropdown */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-xs text-stone-500 uppercase tracking-wider hidden sm:inline">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="bg-transparent border border-stone-300 rounded px-2.5 py-1.5 text-xs text-noir-900 focus:outline-none focus:border-noir-950 font-medium cursor-pointer"
          >
            <option value="featured">Featured & Curated</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 mr-1">Active:</span>

          {filters.category !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-noir-800 text-xs rounded-full">
              <span className="capitalize">{filters.category}</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                className="hover:text-noir-950"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.searchQuery && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-noir-800 text-xs rounded-full">
              <span>"{filters.searchQuery}"</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="hover:text-noir-950"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.selectedSizes.map(size => (
            <span key={size} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-noir-800 text-xs rounded-full">
              <span>Size: {size}</span>
              <button onClick={() => removeSizeFilter(size)} className="hover:text-noir-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.selectedColors.map(color => (
            <span key={color} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-noir-800 text-xs rounded-full">
              <span>Color: {color}</span>
              <button onClick={() => removeColorFilter(color)} className="hover:text-noir-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.maxPrice < 1000 && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-noir-800 text-xs rounded-full">
              <span>Under ${filters.maxPrice}</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, maxPrice: 1000 }))}
                className="hover:text-noir-950"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-melly-800 hover:text-melly-950 underline ml-2 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product Card Grid */}
      {filteredProducts.length > 0 ? (
        <div key={gridKey}>
          {filters.category === 'all' && !filters.searchQuery ? (
            <>
              {/* Clothing Section */}
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts
                  .filter(p => !['shoes', 'accessories'].includes(p.category))
                  .map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
              </div>

              {/* Accessories & Footwear Section */}
              {filteredProducts.some(p => ['shoes', 'accessories'].includes(p.category)) && (
                <div className="mt-20 pt-12 border-t border-stone-200">
                  <div className="text-center mb-10">
                    <h3 className="font-serif text-2xl text-noir-950 font-normal">Accessories & Footwear</h3>
                    <p className="text-sm text-stone-500 font-medium mt-1">The finishing touches to elevate any silhouette.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                    {filteredProducts
                      .filter(p => ['shoes', 'accessories'].includes(p.category))
                      .map((product, idx) => (
                        <ProductCard key={product.id} product={product} index={idx} />
                      ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-white/60 rounded-2xl border border-stone-200/80 px-6">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto mb-4 border border-stone-200">
            <Search className="w-5 h-5 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-2xl text-noir-900 font-normal">No Silhouettes Found</h3>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mt-2 font-light">
            We couldn't find any pieces matching your current filters. Try loosening your criteria or resetting your search.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-6 py-2.5 bg-noir-950 text-white text-xs uppercase tracking-luxury font-medium rounded hover:bg-melly-900 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
