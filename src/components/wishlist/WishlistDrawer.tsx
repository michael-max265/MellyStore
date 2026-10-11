import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    products, 
    toggleWishlist, 
    formatPrice, 
    addToCart,
    setSelectedProduct 
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleMoveToBag = (product: any) => {
    addToCart(product, product.sizes[0], product.colors[0], 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-backdrop-fade"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-stone-200 animate-drawer-slide">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-700 fill-rose-100" />
              <h2 className="font-serif text-lg text-noir-950 font-normal">
                Saved Silhouettes ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-noir-950 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length > 0 ? (
              wishlistProducts.map((prod) => (
                <div 
                  key={prod.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setSelectedProduct(prod);
                    }}
                    className="w-20 h-26 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setSelectedProduct(prod);
                          }}
                          className="font-serif text-sm text-noir-950 font-medium hover:text-melly-800 cursor-pointer line-clamp-1"
                        >
                          {prod.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{prod.subtitle}</p>
                      <p className="text-xs font-semibold text-noir-950 mt-1">
                        {formatPrice(prod.price)}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">
                        Available in {prod.sizes.join(', ')}
                      </span>
                      <button
                        onClick={() => handleMoveToBag(prod)}
                        className="px-3 py-1.5 bg-noir-950 hover:bg-melly-900 text-white text-[10px] uppercase tracking-wider font-semibold rounded flex items-center space-x-1 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move To Bag</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-serif text-lg text-noir-900">Your wishlist is empty</p>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Tap the heart icon on any piece to save it for your next fitting.
                  </p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-2.5 bg-noir-950 text-white text-xs uppercase tracking-luxury font-medium rounded hover:bg-melly-900 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
