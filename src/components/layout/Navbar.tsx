import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  SlidersHorizontal,
  User,
  BookOpen,
  ShieldCheck,
  LogIn,
  LogOut,
  UserPlus,
  Sparkles,
  Crown,
  Package,
  ChevronRight,
  Ruler
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { ProductCategory } from '../../types';

export const Navbar: React.FC<{ onToggleFilters?: () => void }> = ({ onToggleFilters }) => {
  const { 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen,
    setIsAdminOpen, 
    setIsTrackerOpen,
    setIsConciergeOpen,
    setIsProfileOpen,
    setIsAuthOpen,
    setAuthMode,
    userProfile,
    signOut,
    filters, 
    setFilters 
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUserMouseEnter = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current);
      userMenuTimeoutRef.current = null;
    }
    setIsUserMenuOpen(true);
  };

  const handleUserMouseLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 250);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (userMenuTimeoutRef.current) {
        clearTimeout(userMenuTimeoutRef.current);
      }
    };
  }, []);

  // Add scroll shadow on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All Collections', value: 'all' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Co-Ords', value: 'co-ords' },
    { label: 'Tops & Blouses', value: 'tops' },
    { label: 'Trousers & Bottoms', value: 'bottoms' },
    { label: 'Outerwear', value: 'outerwear' },
    { label: 'Eveningwear', value: 'evening' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Footwear', value: 'shoes' },
  ];

  const handleCategoryClick = (category: ProductCategory) => {
    setFilters(prev => ({ ...prev, category }));
    setIsMobileMenuOpen(false);
    // Smooth scroll to catalog
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/70 transition-all duration-300 ${isScrolled ? 'shadow-[0_4px_24px_-6px_rgba(115,82,69,0.15)]' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top Row: Search | Logo | Actions ── */}
        <div className="flex items-center justify-between h-16">

          {/* Mobile: hamburger + filter */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-noir-800 hover:text-noir-950 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            {onToggleFilters && (
              <button
                onClick={onToggleFilters}
                className="p-2 text-noir-800 hover:text-noir-950 focus:outline-none"
                aria-label="Filter products"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Desktop Left: Search */}
          <div className="hidden lg:flex items-center w-56">
            <div className="relative w-full">
              {isSearchOpen ? (
                <div className="flex items-center bg-white border border-stone-300 rounded-full px-3 py-1.5 shadow-sm animate-fade-in w-full">
                  <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Search silks, blazers..."
                    autoFocus
                    className="w-full text-xs bg-transparent focus:outline-none text-noir-900 placeholder:text-stone-400"
                  />
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, searchQuery: '' }));
                      setIsSearchOpen(false);
                    }}
                    className="text-stone-400 hover:text-noir-800 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center space-x-2 text-xs text-stone-500 hover:text-noir-950 transition-colors border border-stone-200 hover:border-stone-300 rounded-full px-3 py-1.5 w-full"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span className="truncate">Search silks, blazers…</span>
                </button>
              )}
            </div>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-1 text-center lg:flex-initial">
            <a href="#" className="inline-block group text-center focus:outline-none">
              <span className="block font-serif text-2xl sm:text-3xl tracking-[0.16em] font-bold text-noir-950 uppercase group-hover:text-melly-700 transition-colors">
                MELLY<span className="text-melly-600 font-medium">STORE</span>
              </span>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-stone-500 font-medium -mt-0.5">
                LUXURY WOMENSWEAR
              </span>
            </a>
          </div>

          {/* Right: Wishlist, Bag, Admin */}
          <div className="flex items-center space-x-4 sm:space-x-5">

            {/* Mobile search icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 text-noir-800 hover:text-melly-600 transition-colors lg:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* VIP Client Profile with Hover & Click Dropdown */}
            <div 
              ref={userMenuRef}
              className="relative"
              onMouseEnter={handleUserMouseEnter}
              onMouseLeave={handleUserMouseLeave}
            >
              <button
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className={`p-1.5 rounded-full transition-all flex items-center justify-center relative cursor-pointer ${
                  isUserMenuOpen 
                    ? 'text-melly-700 bg-melly-50' 
                    : userProfile 
                      ? 'text-noir-950 hover:text-melly-600 hover:bg-stone-100' 
                      : 'text-noir-800 hover:text-melly-600 hover:bg-stone-100'
                }`}
                aria-label="Client Account"
                aria-expanded={isUserMenuOpen}
                title={userProfile ? `Signed in as ${userProfile.fullName}` : "Sign In / VIP Account"}
              >
                <User className="w-5 h-5 stroke-[1.75]" />
                {userProfile && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Hover Dropdown Menu */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200/90 py-3.5 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={handleUserMouseEnter}
                  onMouseLeave={handleUserMouseLeave}
                >
                  {userProfile ? (
                    <div className="space-y-3">
                      {/* Profile Header */}
                      <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-600 to-amber-400 p-0.5 shrink-0 shadow-sm">
                          <div className="w-full h-full rounded-full bg-noir-900 flex items-center justify-center text-champagne-300 font-serif text-sm font-bold">
                            {userProfile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('') || 'AO'}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-sm font-semibold text-noir-950 truncate">
                            {userProfile.fullName}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">
                            {userProfile.email}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <Crown className="w-2.5 h-2.5 text-amber-600" />
                              <span>{userProfile.tier || 'VIP Client'}</span>
                            </span>
                            <span className="text-[10px] text-stone-500 font-medium">
                              {userProfile.points ? `${userProfile.points} pts` : '250 pts'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation links */}
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsProfileOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-stone-700 hover:text-noir-950 hover:bg-stone-50 rounded-lg transition-colors group cursor-pointer text-left"
                        >
                          <span className="flex items-center space-x-2.5">
                            <Ruler className="w-4 h-4 text-stone-400 group-hover:text-melly-600 transition-colors" />
                            <span>VIP Fitting Profile & Sizes</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500" />
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsTrackerOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-2 text-xs text-stone-700 hover:text-noir-950 hover:bg-stone-50 rounded-lg transition-colors group cursor-pointer text-left"
                        >
                          <span className="flex items-center space-x-2.5">
                            <Package className="w-4 h-4 text-stone-400 group-hover:text-melly-600 transition-colors" />
                            <span>Orders & Dispatch Tracking</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500" />
                        </button>
                      </div>

                      {/* Sign Out Action */}
                      <div className="pt-2 border-t border-stone-100">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="flex items-center space-x-2">
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </span>
                          <span className="text-[10px] text-stone-400 font-normal">End Session</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Logged out intro */}
                      <div className="pb-2 border-b border-stone-100">
                        <div className="flex items-center space-x-2 text-noir-950 mb-1">
                          <Crown className="w-4 h-4 text-amber-600" />
                          <h4 className="font-serif text-sm font-semibold tracking-wide">MellyStore VIP Club</h4>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug">
                          Sign in to access your bespoke Nigerian fittings, orders & VIP benefits.
                        </p>
                      </div>

                      {/* Primary Sign In Button */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setAuthMode('signin');
                            setIsAuthOpen(true);
                          }}
                          className="w-full py-2.5 px-4 bg-noir-950 hover:bg-melly-600 text-white text-xs uppercase tracking-luxury font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Sign In</span>
                        </button>

                        {/* Secondary Create Account Button */}
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setAuthMode('signup');
                            setIsAuthOpen(true);
                          }}
                          className="w-full py-2 px-4 border border-stone-300 hover:border-noir-950 text-noir-900 hover:bg-stone-50 text-xs uppercase tracking-luxury font-medium rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-stone-600" />
                          <span>Create VIP Account</span>
                        </button>
                      </div>

                      {/* Benefits preview footer */}
                      <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-stone-200/60 text-[10px] text-stone-600 space-y-1">
                        <div className="font-medium text-stone-800">VIP Privileges:</div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          <span>Victoria Island, Lagos Priority Dispatch</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          <span>Bespoke Fit Profiles & Saved Measurements</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-1 text-noir-800 hover:text-melly-600 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-melly-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1 text-noir-800 hover:text-melly-600 transition-colors relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-noir-950 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-cart-badge">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin */}
            <button
              onClick={() => setIsAdminOpen(true)}
              title="Store Owner Portal"
              className="hidden sm:inline-flex items-center space-x-1 text-[11px] uppercase tracking-wider text-stone-500 hover:text-noir-900 border border-stone-300 hover:border-stone-400 rounded px-2 py-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-melly-600" />
              <span>Admin</span>
            </button>
          </div>

        </div>

        {/* ── Desktop Secondary Bar: All categories + utility links ── */}
        <div className="hidden lg:flex items-center justify-center gap-6 py-2 border-t border-stone-200 text-[11px] uppercase tracking-widest font-medium text-stone-600">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className={`hover:text-noir-950 transition-colors whitespace-nowrap relative group/navitem py-0.5 ${
                filters.category === cat.value ? 'text-noir-950 font-bold' : ''
              }`}
            >
              {cat.label}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-melly-600 rounded-full transition-all duration-300 ease-out ${
                  filters.category === cat.value
                    ? 'w-full'
                    : 'w-0 group-hover/navitem:w-full bg-stone-400'
                }`}
              />
            </button>
          ))}

          <span className="text-stone-300 select-none">|</span>

          <a
            href="#lookbook"
            className="flex items-center space-x-1 text-stone-600 hover:text-noir-950 transition-colors"
          >
            <BookOpen className="w-3 h-3 stroke-[1.5]" />
            <span>Lookbook</span>
          </a>

          <button
            onClick={() => setIsTrackerOpen(true)}
            className="hover:text-noir-950 transition-colors text-stone-600"
          >
            Track Order
          </button>

          <button
            onClick={() => setIsConciergeOpen(true)}
            className="text-melly-700 hover:text-melly-900 transition-colors font-semibold"
          >
            Stylist Concierge
          </button>
        </div>

      </div>
      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-stone-300 px-6 py-6 space-y-4 animate-fade-in shadow-xl">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-luxury text-stone-400 font-semibold">Collections</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`text-left text-xs uppercase tracking-wider py-2 px-3 rounded ${
                    filters.category === cat.value
                      ? 'bg-melly-100 text-melly-900 font-semibold'
                      : 'text-noir-700 hover:bg-stone-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* VIP Client Account section in mobile menu */}
          <div className="pt-3 border-t border-stone-200">
            {userProfile ? (
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-noir-950 text-champagne-300 flex items-center justify-center font-bold text-xs">
                      {userProfile.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-noir-950">{userProfile.fullName}</p>
                      <p className="text-[10px] text-amber-700 font-medium">{userProfile.tier || 'VIP Client'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut();
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center space-x-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
                <div className="flex space-x-2 pt-1 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsProfileOpen(true);
                    }}
                    className="flex-1 py-1.5 text-center text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium"
                  >
                    VIP Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsTrackerOpen(true);
                    }}
                    className="flex-1 py-1.5 text-center text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium"
                  >
                    Orders
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthMode('signin');
                    setIsAuthOpen(true);
                  }}
                  className="flex-1 py-2 bg-noir-950 text-white rounded-lg text-xs uppercase tracking-wider font-semibold text-center flex items-center justify-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthMode('signup');
                    setIsAuthOpen(true);
                  }}
                  className="flex-1 py-2 border border-stone-300 text-noir-900 rounded-lg text-xs uppercase tracking-wider font-semibold text-center flex items-center justify-center space-x-1.5 bg-white"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <a
                href="#lookbook"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs uppercase tracking-wider text-noir-800 font-medium flex items-center space-x-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-500 stroke-[1.5]" />
                <span>Shop Lookbook</span>
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsTrackerOpen(true);
                }}
                className="text-xs text-stone-600 hover:text-noir-950 font-medium"
              >
                Track Order
              </button>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsConciergeOpen(true);
                }}
                className="text-xs text-melly-900 font-semibold flex items-center space-x-1"
              >
                <span>Chat with Adaeze (Stylist)</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="text-xs text-stone-500 flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Store Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
