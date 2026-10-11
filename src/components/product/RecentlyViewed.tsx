import React from 'react';
import { Clock, Eye, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const RecentlyViewed: React.FC = () => {
  const { recentlyViewed, products, setSelectedProduct, addToCart, formatPrice } = useStore();

  const recentProducts = products.filter(p => recentlyViewed.includes(p.id));

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-stone-600 stroke-[1.5]" />
            <h3 className="font-serif text-xl text-noir-950 font-normal">
              Recently Viewed Silhouettes
            </h3>
          </div>
          <span className="text-xs text-stone-600 font-medium">Your wardrobe browsing history</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {recentProducts.slice(0, 6).map((prod) => (
            <div 
              key={prod.id}
              className="group relative bg-[#FAF8F5] p-2 rounded-lg border border-stone-200/80 shadow-xs hover:shadow-md transition-all"
            >
              <div 
                className="aspect-[3/4] w-full overflow-hidden rounded bg-stone-100 cursor-pointer relative"
                onClick={() => setSelectedProduct(prod)}
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(prod);
                    }}
                    title="Inspect"
                    className="p-1.5 bg-white text-noir-900 rounded-full hover:bg-stone-100 shadow"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod, prod.sizes[0], prod.colors[0], 1);
                    }}
                    title="Add to Bag"
                    className="p-1.5 bg-noir-950 text-white rounded-full hover:bg-melly-900 shadow"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2 text-left">
                <p 
                  onClick={() => setSelectedProduct(prod)}
                  className="font-serif text-xs font-semibold text-noir-950 truncate cursor-pointer hover:text-melly-800"
                >
                  {prod.name}
                </p>
                <p className="text-xs font-bold text-noir-950 mt-0.5">
                  {formatPrice(prod.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
