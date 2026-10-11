import React, { useState, useRef } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import type { Product, ProductColor } from '../../types';
import { useStore } from '../../context/StoreContext';

export const ProductCard: React.FC<{ product: Product; index?: number }> = ({
  product,
  index = 0,
}) => {
  const {
    formatPrice,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
    addToCart,
    userProfile,
    setIsAuthOpen,
    setAuthMode,
    showToast
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const selectedColor: ProductColor = product.colors[0];
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [bagAnimating, setBagAnimating] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const bagBtnRef = useRef<HTMLButtonElement>(null);

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Stagger class based on card index
  const staggerClass = `stagger-${Math.min(index + 1, 12)}`;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartAnimating(true);
    toggleWishlist(product.id);
    setTimeout(() => setHeartAnimating(false), 600);
  };

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile) {
      setAuthMode('signin');
      setIsAuthOpen(true);
      showToast('Account Required', 'Please sign in or create an account to start shopping.', 'info');
      return;
    }
    addToCart(product, size, selectedColor, 1);
    setShowQuickSizes(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleBagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile) {
      setAuthMode('signin');
      setIsAuthOpen(true);
      showToast('Account Required', 'Please sign in or create an account to start shopping.', 'info');
      return;
    }
    setBagAnimating(true);
    setTimeout(() => setBagAnimating(false), 600);
    if (product.sizes.length === 1) {
      addToCart(product, product.sizes[0], selectedColor, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
    } else {
      setShowQuickSizes(true);
    }
  };

  return (
    <div
      className={`group relative flex flex-col bg-transparent animate-slide-up ${staggerClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* Product Image Frame */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-100 cursor-pointer shadow-sm group-hover:shadow-luxury transition-all duration-500"
      >
        {/* Product Image */}
        <div className="relative w-full h-full">
          <img
            src={selectedColor.image || product.images[0]}
            alt={`${product.name} in ${selectedColor.name}`}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />

        </div>

        {/* Gradient shimmer overlay on hover */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(135deg, transparent 60%, rgba(214,192,151,0.08) 100%)',
          }}
        />

        {/* Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {!product.inStock && (
            <span className="bg-rose-700/95 backdrop-blur-sm text-white text-[9px] uppercase tracking-luxury font-semibold px-2.5 py-1 rounded shadow-xs">
              Sold Out
            </span>
          )}
          {product.isNew && product.inStock && (
            <span className="bg-noir-950/95 backdrop-blur-sm text-white text-[9px] uppercase tracking-luxury font-medium px-2.5 py-1 rounded shadow-xs">
              New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#8C7355]/95 backdrop-blur-sm text-white text-[9px] uppercase tracking-luxury font-medium px-2.5 py-1 rounded shadow-xs">
              Studio Icon
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-900/90 backdrop-blur-sm text-white text-[9px] uppercase tracking-wider font-medium px-2 py-0.5 rounded shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart — animated pop */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white transition-all shadow-sm z-10 ${
            heartAnimating ? 'animate-heart-pop' : ''
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              inWishlist
                ? 'fill-rose-600 text-rose-600 drop-shadow-[0_0_6px_rgba(225,29,72,0.5)]'
                : 'text-noir-700 hover:text-rose-400'
            }`}
          />
        </button>

        {/* Bottom Hover Actions */}
        <div className="absolute bottom-0 inset-x-0 p-3 z-10 transition-all duration-300 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          {showQuickSizes ? (
            <div className="bg-white/95 backdrop-blur-md p-2 rounded-lg shadow-lg border border-stone-200 animate-elastic-in">
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1 text-center">
                Select Size
              </p>
              <div className="flex justify-center gap-1.5 flex-wrap">
                {product.sizes.map((size, si) => (
                  <button
                    key={size}
                    onClick={(e) => handleQuickAdd(size, e)}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-noir-950 hover:text-white text-noir-800 text-[11px] font-medium rounded transition-all hover:scale-110 active:scale-95"
                    style={{ animationDelay: `${si * 0.04}s` }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProduct(product);
                }}
                className="flex-1 py-2.5 bg-white/90 backdrop-blur-md hover:bg-white text-noir-950 text-[11px] uppercase tracking-luxury font-medium rounded shadow-md flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </button>

              {product.inStock ? (
                <button
                  ref={bagBtnRef}
                  onClick={handleBagClick}
                  className={`p-2.5 text-white rounded shadow-md transition-all active:scale-95 ${
                    justAdded
                      ? 'bg-emerald-600 animate-cart-badge'
                      : `bg-noir-950 hover:bg-melly-900 ${bagAnimating ? 'animate-cart-badge' : 'hover:scale-110'}`
                  }`}
                  title="Add to bag"
                >
                  {justAdded ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <span className="px-3 py-2.5 bg-stone-200/90 backdrop-blur-md text-stone-600 text-[10px] uppercase font-bold tracking-wider rounded shadow-xs flex items-center justify-center">
                  Sold Out
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Underneath */}
      <div className="pt-3.5 pb-2 flex flex-col flex-1">



        {/* Title */}
        <h3
          onClick={() => setSelectedProduct(product)}
          className="font-serif text-sm sm:text-base font-semibold text-noir-950 hover:text-melly-700 cursor-pointer transition-colors duration-200 line-clamp-1 group/title"
        >
          {product.name}
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-stone-600 font-normal line-clamp-1 mt-0.5">
          {product.subtitle}
        </p>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/50">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm sm:text-base font-bold text-noir-950 transition-all group-hover:text-melly-800">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-500 line-through font-normal">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-stone-600">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-[1.5]" />
            <span className="text-xs font-semibold text-noir-950">{product.rating}</span>
            <span className="text-xs text-stone-600 font-medium">({product.reviewCount})</span>
          </div>
        </div>

      </div>
    </div>
  );
};
