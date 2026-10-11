import React from 'react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomBar: React.FC = () => {
  const { 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen, 
    setIsProfileOpen, 
    setIsAuthOpen, 
    userProfile,
    setFilters
  } = useStore();

  const handleHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCatalog = () => {
    setFilters(prev => ({ ...prev, category: 'all' }));
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAccount = () => {
    if (userProfile) {
      setIsProfileOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      
      {/* Home */}
      <button
        onClick={handleHome}
        className="flex flex-col items-center justify-center p-1.5 text-stone-600 hover:text-noir-950 transition-colors"
      >
        <Home className="w-5 h-5 stroke-[1.5]" />
        <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">Home</span>
      </button>

      {/* Catalog */}
      <button
        onClick={handleCatalog}
        className="flex flex-col items-center justify-center p-1.5 text-stone-600 hover:text-noir-950 transition-colors"
      >
        <Compass className="w-5 h-5 stroke-[1.5]" />
        <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">Catalog</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => setIsWishlistOpen(true)}
        className="flex flex-col items-center justify-center p-1.5 text-stone-600 hover:text-noir-950 transition-colors relative"
      >
        <Heart className="w-5 h-5 stroke-[1.5]" />
        {wishlist.length > 0 && (
          <span className="absolute 0 top-0.5 right-2 w-3.5 h-3.5 bg-melly-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
        <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">Wishlist</span>
      </button>

      {/* Bag */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center p-1.5 text-stone-600 hover:text-noir-950 transition-colors relative"
      >
        <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
        {cartCount > 0 && (
          <span className="absolute 0 top-0.5 right-2 w-3.5 h-3.5 bg-noir-950 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-cart-badge">
            {cartCount}
          </span>
        )}
        <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">Bag</span>
      </button>

      {/* Account */}
      <button
        onClick={handleAccount}
        className="flex flex-col items-center justify-center p-1.5 text-stone-600 hover:text-noir-950 transition-colors relative"
      >
        <User className="w-5 h-5 stroke-[1.5]" />
        {userProfile && (
          <span className="absolute top-1 right-2.5 w-2 h-2 bg-emerald-500 rounded-full" />
        )}
        <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">
          {userProfile ? 'Account' : 'Sign In'}
        </span>
      </button>

    </div>
  );
};
