import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  CURRENCY_CONFIGS,
  type Product, 
  type CartItem, 
  type CurrencyCode, 
  type CurrencyConfig, 
  type FilterState, 
  type Order,
  type ProductColor,
  type UserProfile
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface StoreContextType {
  products: Product[];
  filteredProducts: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currency: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usdAmount: number) => string;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Cart
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  
  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Orders
  createOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'currency'>) => Order;
  
  // Modals & Panels
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isTrackerOpen: boolean;
  setIsTrackerOpen: (open: boolean) => void;
  isConciergeOpen: boolean;
  setIsConciergeOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  signOut: () => void;
  isInvoiceOpen: boolean;
  setIsInvoiceOpen: (open: boolean) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  recentlyViewed: string[];

  // Reviews
  addReview: (productId: string, reviewData: { author: string; rating: number; title: string; comment: string; fitFeedback?: 'True to size' | 'Runs slightly small' | 'Runs slightly large' }) => void;

  // Admin Actions
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  searchQuery: '',
  minPrice: 0,
  maxPrice: 1000,
  selectedSizes: [],
  selectedColors: [],
  sortBy: 'featured',
  inStockOnly: false
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or default
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('melly_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('melly_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('melly_wishlist');
      return saved ? JSON.parse(saved) : ['melly-01', 'melly-08'];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('melly_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'ord-init-1',
          orderNumber: 'MEL-98412',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          customer: {
            fullName: 'Lady Arabella Sterling',
            email: 'arabella@sterling-london.com',
            phone: '+44 20 7946 0912',
            address: '42 Mayfair Square',
            city: 'London',
            state: 'Greater London',
            postalCode: 'W1K 4PA',
            country: 'United Kingdom'
          },
          items: [
            {
              productId: 'melly-01',
              name: 'Aurelia Silk Slip Maxi Dress',
              price: 245,
              size: 'S',
              color: 'Champagne Gold',
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'
            }
          ],
          subtotal: 245,
          discount: 24.5,
          promoCodeApplied: 'WELCOME10',
          shippingMethod: {
            id: 'express',
            name: 'Complimentary White Glove Delivery',
            cost: 0,
            estimatedDays: '1-2 business days'
          },
          tax: 0,
          total: 220.5,
          currency: 'GBP',
          paymentMethod: 'apple_pay',
          status: 'Shipped',
          trackingNumber: 'TRK-MEL-8839201'
        }
      ];
    } catch {
      return [];
    }
  });

  // Currency
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('melly_currency') as CurrencyCode) || 'USD';
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Modal / Drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);

  const signOut = () => {
    setUserProfile(null);
    localStorage.removeItem('melly_user_profile');
    showToast('Signed Out', 'You have been safely signed out of your MellyStore account.', 'info');
  };

  // User Profile (VIP Client Portal)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('melly_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email === 'sophia.montgomery@example.com') {
          localStorage.removeItem('melly_user_profile');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('melly_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('melly_user_profile');
    }
  }, [userProfile]);

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('melly_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const setSelectedProduct = (prod: Product | null) => {
    setSelectedProductState(prod);
    if (prod) {
      setRecentlyViewed(prev => {
        const filtered = prev.filter(id => id !== prod.id);
        return [prod.id, ...filtered].slice(0, 8);
      });
    }
  };

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('melly_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('melly_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('melly_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('melly_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('melly_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('melly_currency', currencyCode);
  }, [currencyCode]);

  const currency = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.USD;

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCY_CONFIGS[code]) {
      setCurrencyCode(code);
    }
  };

  const formatPrice = (usdAmount: number): string => {
    const converted = usdAmount * currency.rate;
    if (currency.code === 'NGN') {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toLocaleString(currency.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Cart operations
  const addToCart = (product: Product, size: string, color: ProductColor, quantity = 1) => {
    if (!product.inStock || product.stockCount <= 0) {
      showToast('Piece Unavailable', `${product.name} is currently sold out in the Studio.`, 'error');
      return;
    }

    const cartItemId = `${product.id}-${size}-${color.name}`;
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === cartItemId);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > product.stockCount) {
          showToast('Studio Stock Limit', `Only ${product.stockCount} pieces available in this silhouette.`, 'info');
          return prevCart.map(item =>
            item.id === cartItemId ? { ...item, quantity: product.stockCount } : item
          );
        }
        return prevCart.map(item =>
          item.id === cartItemId ? { ...item, quantity: nextQty } : item
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          product,
          size,
          color,
          quantity: Math.min(quantity, product.stockCount)
        }
      ];
    });

    showToast('Added to Your Bag', `${product.name} (${size}, ${color.name})`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const freeShippingThreshold = 250; // USD
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - cartTotal);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', product?.name || 'Item', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist', product?.name || 'Item', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'currency'>): Order => {
    const id = `ord-${Date.now()}`;
    const orderNumber = `MEL-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `TRK-MEL-${Math.floor(1000000 + Math.random() * 9000000)}`;
    
    const newOrder: Order = {
      ...orderPayload,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
      trackingNumber,
      currency: currency.code
    };

    // Automatically decrement inventory stock
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const itemPurchased = orderPayload.items.find(i => i.productId === p.id);
        if (!itemPurchased) return p;
        const remaining = Math.max(0, p.stockCount - itemPurchased.quantity);
        return {
          ...p,
          stockCount: remaining,
          inStock: remaining > 0
        };
      })
    );

    // Award loyalty points to user profile
    if (userProfile) {
      setUserProfile(prev => prev ? {
        ...prev,
        points: prev.points + Math.round(orderPayload.total)
      } : null);
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSub = product.subtitle.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSub && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      // Price range
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      // Sizes
      if (filters.selectedSizes.length > 0) {
        const hasMatchingSize = product.sizes.some(s => filters.selectedSizes.includes(s));
        if (!hasMatchingSize) return false;
      }
      // Colors
      if (filters.selectedColors.length > 0) {
        const hasMatchingColor = product.colors.some(c => filters.selectedColors.includes(c.name));
        if (!hasMatchingColor) return false;
      }
      // Stock
      if (filters.inStockOnly && (!product.inStock || product.stockCount <= 0)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }
      if (filters.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // featured
      return (b.isBestSeller ? 2 : 0) + (b.isTrending ? 1 : 0) - ((a.isBestSeller ? 2 : 0) + (a.isTrending ? 1 : 0));
    });
  }, [products, filters]);

  // Admin Actions
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const id = `melly-${Date.now()}`;
    const newProd: Product = { ...productData, id };
    setProducts(prev => [newProd, ...prev]);
    showToast('Product Created', `${newProd.name} added to catalog.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product Updated', 'Changes saved successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product Deleted', 'Item removed from catalog.', 'info');
  };

  const addReview = (
    productId: string, 
    reviewData: { author: string; rating: number; title: string; comment: string; fitFeedback?: 'True to size' | 'Runs slightly small' | 'Runs slightly large' }
  ) => {
    const newRev = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      verified: true
    };

    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const currentReviews = p.reviews || [];
      const updatedReviews = [newRev, ...currentReviews];
      const avgRating = Number((updatedReviews.reduce((s, r) => s + r.rating, 0) / updatedReviews.length).toFixed(1));
      return {
        ...p,
        reviews: updatedReviews,
        rating: avgRating,
        reviewCount: updatedReviews.length
      };
    }));

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProductState(prev => {
        if (!prev) return null;
        const currentReviews = prev.reviews || [];
        const updatedReviews = [newRev, ...currentReviews];
        const avgRating = Number((updatedReviews.reduce((s, r) => s + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...prev,
          reviews: updatedReviews,
          rating: avgRating,
          reviewCount: updatedReviews.length
        };
      });
    }

    showToast('Review Published', 'Thank you for your boutique review!');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
    showToast('Order Status Updated', `Order set to ${status}.`);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        filteredProducts,
        cart,
        wishlist,
        orders,
        currency,
        setCurrency,
        formatPrice,
        filters,
        setFilters,
        resetFilters,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        freeShippingThreshold,
        freeShippingRemaining,
        toggleWishlist,
        isInWishlist,
        createOrder,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isTrackerOpen,
        setIsTrackerOpen,
        isConciergeOpen,
        setIsConciergeOpen,
        isProfileOpen,
        setIsProfileOpen,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        signOut,
        isInvoiceOpen,
        setIsInvoiceOpen,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
        userProfile,
        setUserProfile,
        selectedProduct,
        setSelectedProduct,
        recentlyViewed,
        addReview,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
