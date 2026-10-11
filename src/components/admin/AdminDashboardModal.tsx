import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Plus, 
  Trash2,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  LogOut,
  Save,
  CheckCircle2,
  Search,
  Filter,
  Smartphone
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { ProductCategory } from '../../types';

export const AdminDashboardModal: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    orders, 
    formatPrice, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus,
    setIsInvoiceOpen,
    setActiveInvoiceOrder,
    showToast
  } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('melly_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [enteredCode, setEnteredCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  // Stored PIN (default 8166 or 2026)
  const [storedPin, setStoredPin] = useState(() => {
    try {
      return localStorage.getItem('melly_admin_pin') || '8166';
    } catch {
      return '8166';
    }
  });

  // Change PIN state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'new-product' | 'security'>('analytics');

  // Search & Filters in Inventory / Orders
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    subtitle: '',
    category: 'dresses' as ProductCategory,
    price: 250,
    originalPrice: 295,
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    description: '',
    composition: '100% Mulberry Silk Crepe',
    stockCount: 10,
    sizes: 'XS, S, M, L',
    colorName: 'Champagne Nude',
    colorHex: '#D4B07B',
  });

  const handleCloseAdmin = () => {
    setIsAuthenticated(false);
    setEnteredCode('');
    setAuthError('');
    try {
      sessionStorage.removeItem('melly_admin_auth');
    } catch {
      // ignore
    }
    setIsAdminOpen(false);
  };

  useEffect(() => {
    // Whenever modal opens, ensure clean auth state
    if (isAdminOpen) {
      setEnteredCode('');
      setAuthError('');
    }
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  // Keypad & Authentication Handlers
  const handleVerifyCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = enteredCode.trim();

    // Check against configured pin, or fallback master pins 8166 / 2026
    if (cleanCode === storedPin || cleanCode === '8166' || cleanCode === '2026') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('melly_admin_auth', 'true');
      } catch {
        // storage disabled fallback
      }
      setEnteredCode('');
      setAuthError('');
      setFailedAttempts(0);
      showToast('Admin Terminal Unlocked', 'Welcome, Founder & Administrator');
    } else {
      setIsShaking(true);
      setFailedAttempts(prev => prev + 1);
      setAuthError('Invalid Security Code. Access Restricted.');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (enteredCode.length < 8) {
      const next = enteredCode + val;
      setEnteredCode(next);
      setAuthError('');
      // Auto-submit on 4 digits if matching
      if (next.length === 4 && (next === storedPin || next === '8166' || next === '2026')) {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem('melly_admin_auth', 'true');
        } catch {
          // ignore
        }
        setEnteredCode('');
        showToast('Admin Terminal Unlocked', 'Access Granted');
      }
    }
  };

  const handleKeypadBackspace = () => {
    setEnteredCode(prev => prev.slice(0, -1));
    setAuthError('');
  };

  const handleKeypadClear = () => {
    setEnteredCode('');
    setAuthError('');
  };

  const handleLockSession = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('melly_admin_auth');
    } catch {
      // ignore
    }
    setEnteredCode('');
    showToast('Terminal Locked', 'Admin session ended securely');
  };

  // Change PIN handler
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinInput !== storedPin && currentPinInput !== '8166' && currentPinInput !== '2026') {
      setPinChangeMsg({ type: 'error', text: 'Current security code is incorrect.' });
      return;
    }
    if (newPinInput.length < 4) {
      setPinChangeMsg({ type: 'error', text: 'New code must be at least 4 digits.' });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeMsg({ type: 'error', text: 'New code and confirmation do not match.' });
      return;
    }

    try {
      localStorage.setItem('melly_admin_pin', newPinInput);
      setStoredPin(newPinInput);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setPinChangeMsg({ type: 'success', text: 'Security code successfully updated!' });
      showToast('Security PIN Updated', 'Your new administrative code is active');
    } catch {
      setPinChangeMsg({ type: 'error', text: 'Failed to save security code.' });
    }
  };

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name.trim()) return;

    addProduct({
      name: newProd.name,
      subtitle: newProd.subtitle || 'Handcrafted Studio Capsule Piece',
      category: newProd.category,
      price: Number(newProd.price),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
      rating: 5.0,
      reviewCount: 1,
      images: [newProd.imageUrl],
      description: newProd.description || 'Exclusive boutique garment meticulously created with fine artisanal tailoring.',
      details: ['Handcrafted with fine stitching', 'Traceable sustainable origin'],
      composition: newProd.composition,
      careInstructions: ['Dry clean or delicate hand wash'],
      sizes: newProd.sizes.split(',').map(s => s.trim()),
      colors: [{ name: newProd.colorName, hex: newProd.colorHex }],
      inStock: true,
      stockCount: Number(newProd.stockCount),
      isNew: true
    });

    showToast('Silhouette Published', `${newProd.name} added to catalog`);
    setActiveTab('products');
  };

  // Filtered lists
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      
      {/* Background click */}
      <div 
        className="fixed inset-0" 
        onClick={handleCloseAdmin} 
      />

      {/* ─────────────────────────────────────────────────────────────
          1. SECURITY GATE / LOCK SCREEN (If not authenticated)
         ───────────────────────────────────────────────────────────── */}
      {!isAuthenticated ? (
        <div className={`relative w-full max-w-md bg-[#191715] text-stone-100 rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#3E3832] p-8 ${isShaking ? 'animate-bounce' : 'animate-elastic-in'}`}>
          
          {/* Close button */}
          <button
            onClick={handleCloseAdmin}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors cursor-pointer"
            title="Return to Boutique"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Luxury Lock Emblem */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8C7355] to-[#4A3B2C] p-0.5 shadow-lg mb-4 flex items-center justify-center">
              <div className="w-full h-full bg-[#201D1A] rounded-2xl flex items-center justify-center">
                <Lock className="w-7 h-7 text-amber-300 stroke-[1.75]" />
              </div>
            </div>
            
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-amber-400/90 block mb-1">
              Restricted Terminal
            </span>
            <h3 className="font-serif text-2xl text-white font-normal">
              Admin & Founder Gate
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs leading-relaxed">
              Enter your administrative security PIN to access boutique operations, inventory, and orders.
            </p>
          </div>

          {/* PIN Input & Visibility */}
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                maxLength={8}
                value={enteredCode}
                onChange={e => {
                  setEnteredCode(e.target.value);
                  setAuthError('');
                }}
                placeholder="Enter Security PIN"
                autoFocus
                className="w-full text-center tracking-[0.5em] text-xl font-mono py-3.5 px-4 bg-[#262320] border border-[#443D36] rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-400/80 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                title={showCode ? 'Hide PIN' : 'Show PIN'}
              >
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="flex items-center justify-center space-x-1.5 text-rose-400 text-xs bg-rose-950/40 border border-rose-900/60 py-2 px-3 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{authError} ({failedAttempts} failed)</span>
              </div>
            )}

            {/* Numeric Keypad for fast touchscreen / mouse access */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="py-3 bg-[#262320] hover:bg-[#34302C] active:scale-95 text-white font-mono text-base font-medium rounded-xl transition-all border border-[#3A342E]"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="py-3 bg-[#221F1C] hover:bg-[#2C2825] text-stone-400 text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors border border-[#332E28]"
              >
                CLR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-3 bg-[#262320] hover:bg-[#34302C] active:scale-95 text-white font-mono text-base font-medium rounded-xl transition-all border border-[#3A342E]"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="py-3 bg-[#221F1C] hover:bg-[#2C2825] text-stone-400 text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors border border-[#332E28]"
              >
                DEL
              </button>
            </div>

            {/* Verify CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#8C7355] to-[#A08563] hover:from-[#9D8262] hover:to-[#B39672] text-white text-xs uppercase tracking-luxury font-semibold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Terminal</span>
            </button>
          </form>

          {/* Secure Hint & Founder reminder */}
          <div className="mt-6 pt-4 border-t border-[#332E28] flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
              <span>Default Code: <strong>8166</strong></span>
            </span>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="text-stone-400 hover:text-white underline underline-offset-2"
            >
              Exit to Shop
            </button>
          </div>

        </div>
      ) : (

        /* ─────────────────────────────────────────────────────────────
            2. AUTHENTICATED ADMIN DASHBOARD
           ───────────────────────────────────────────────────────────── */
        <div className="relative w-full max-w-6xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden z-10 border border-stone-300 max-h-[94vh] flex flex-col animate-elastic-in">
          
          {/* Executive Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-noir-950 flex items-center justify-center text-amber-300">
                <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-xl sm:text-2xl text-noir-950 font-normal">
                    MellyStore Studio Portal
                  </h3>
                  <span className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Founder Authenticated</span>
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Lagos Executive Terminal • Direct Atelier Control
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleLockSession}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-noir-900 bg-white text-noir-800 text-xs uppercase tracking-wider font-medium hover:bg-stone-50 transition-colors"
                title="Lock Terminal"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Lock Terminal</span>
              </button>
              <button
                onClick={handleCloseAdmin}
                className="p-2 rounded-full text-stone-400 hover:text-noir-950 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Lock & Exit Terminal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-[#F4EFEA] px-6 border-b border-stone-200 flex space-x-4 sm:space-x-6 text-xs uppercase tracking-wider font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'analytics' ? 'border-noir-950 text-noir-950 font-bold' : 'border-transparent text-stone-500 hover:text-noir-800'
              }`}
            >
              Overview & Revenue
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'orders' ? 'border-noir-950 text-noir-950 font-bold' : 'border-transparent text-stone-500 hover:text-noir-800'
              }`}
            >
              <span>Customer Orders</span>
              <span className="px-1.5 py-0.2 bg-noir-950 text-white rounded-full text-[10px]">
                {orders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'products' ? 'border-noir-950 text-noir-950 font-bold' : 'border-transparent text-stone-500 hover:text-noir-800'
              }`}
            >
              <span>Inventory</span>
              <span className="px-1.5 py-0.2 bg-stone-300 text-stone-800 rounded-full text-[10px]">
                {products.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('new-product')}
              className={`py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'new-product' ? 'border-noir-950 text-noir-950 font-bold' : 'border-transparent text-stone-500 hover:text-noir-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-melly-700" />
              <span>Add Silhouette</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'security' ? 'border-noir-950 text-noir-950 font-bold' : 'border-transparent text-stone-500 hover:text-noir-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>Security & PIN</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="overflow-y-auto p-6 flex-1 space-y-6">
            
            {/* ── TAB 1: OVERVIEW & REVENUE ── */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                    <div className="flex justify-between items-center text-stone-400">
                      <span className="text-[11px] uppercase tracking-wider font-semibold">Total Revenue</span>
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="font-serif text-2xl font-bold text-noir-950 mt-2">
                      {formatPrice(totalRevenue)}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium">↑ Real-time boutique intake</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                    <div className="flex justify-between items-center text-stone-400">
                      <span className="text-[11px] uppercase tracking-wider font-semibold">Orders Received</span>
                      <ShoppingBag className="w-4 h-4 text-melly-600" />
                    </div>
                    <p className="font-serif text-2xl font-bold text-noir-950 mt-2">
                      {orders.length}
                    </p>
                    <span className="text-[10px] text-stone-500">{totalItemsSold} total garments sold</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                    <div className="flex justify-between items-center text-stone-400">
                      <span className="text-[11px] uppercase tracking-wider font-semibold">Average Order (AOV)</span>
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="font-serif text-2xl font-bold text-noir-950 mt-2">
                      {formatPrice(avgOrderValue)}
                    </p>
                    <span className="text-[10px] text-stone-500">Per client consignment</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                    <div className="flex justify-between items-center text-stone-400">
                      <span className="text-[11px] uppercase tracking-wider font-semibold">Active Silhouettes</span>
                      <Package className="w-4 h-4 text-stone-600" />
                    </div>
                    <p className="font-serif text-2xl font-bold text-noir-950 mt-2">
                      {products.length}
                    </p>
                    <span className="text-[10px] text-stone-500">In Studio collection</span>
                  </div>

                </div>

                {/* Operations & Founder Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <h4 className="font-serif text-base text-noir-950 font-medium flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Boutique Security & Architecture</span>
                    </h4>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      All products and customer orders persist seamlessly in browser storage. Placed customer orders are tracked with unique consignment numbers, itemized official invoices, and client loyalty tiers.
                    </p>
                    <div className="pt-2 flex items-center space-x-4 text-xs font-mono text-stone-500">
                      <span>Security: <strong>Active Passcode Gate</strong></span>
                      <span>•</span>
                      <span>Location: <strong>Lagos, NG</strong></span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <h4 className="font-serif text-base text-noir-950 font-medium flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-melly-700" />
                      <span>Founder Hotline & Direct Desk</span>
                    </h4>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      Live client inquiries and WhatsApp messages are directed to <strong>08166612115</strong>. You can update store contact points or reconfigure your security code in the <em>Security & PIN</em> tab.
                    </p>
                    <button
                      onClick={() => setActiveTab('security')}
                      className="text-xs text-melly-800 hover:text-noir-950 underline font-medium"
                    >
                      Manage Security Settings →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: ORDERS MANAGEMENT ── */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                
                {/* Search & Filter bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                  <div className="relative flex-1 w-full sm:w-auto">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search order ref, client name, or tracking..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-noir-950"
                    />
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <Filter className="w-3.5 h-3.5 text-stone-500" />
                    <select
                      value={orderStatusFilter}
                      onChange={e => setOrderStatusFilter(e.target.value)}
                      className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 font-medium cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto border border-stone-200 rounded-xl bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F4EFEA] text-noir-900 uppercase tracking-wider text-[10px] border-b border-stone-200 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Order Ref</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Tracking Code</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-stone-400">
                            No orders found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-noir-950">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-noir-900">{ord.customer.fullName}</p>
                              <p className="text-[10px] text-stone-400">{ord.customer.city}, {ord.customer.country}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-medium text-stone-800">{ord.items.length} garments</p>
                              <p className="text-[10px] text-stone-400 truncate max-w-xs">
                                {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                              </p>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-noir-950">
                              {formatPrice(ord.total)}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[10px] text-melly-800">
                              {ord.trackingNumber}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                                className={`text-[11px] font-semibold uppercase tracking-wider rounded-md px-2 py-1 border cursor-pointer ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : ord.status === 'Shipped'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setActiveInvoiceOrder(ord);
                                  setIsInvoiceOpen(true);
                                }}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-noir-950 hover:text-white text-stone-700 transition-colors text-[11px] font-medium"
                                title="Print Official Invoice"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Invoice</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* ── TAB 3: INVENTORY CONTROLLER ── */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                
                {/* Search bar */}
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search inventory by title or category..."
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-noir-950"
                    />
                  </div>
                  <button
                    onClick={() => setActiveTab('new-product')}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-noir-950 text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-melly-900 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Piece</span>
                  </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(prod => (
                    <div key={prod.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex gap-3 hover:border-stone-400 transition-all">
                      <img src={prod.images[0]} alt={prod.name} className="w-16 h-22 object-cover rounded-lg bg-stone-100" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="font-serif text-sm font-medium text-noir-950 line-clamp-1">{prod.name}</h5>
                          <p className="text-[10px] uppercase tracking-wider text-melly-600 font-semibold">{prod.category}</p>
                          <div className="flex items-baseline space-x-2 mt-1">
                            <span className="text-xs font-bold text-noir-900">{formatPrice(prod.price)}</span>
                            {prod.originalPrice && (
                              <span className="text-[10px] text-stone-400 line-through">{formatPrice(prod.originalPrice)}</span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className={`text-[11px] font-medium ${prod.stockCount <= 3 ? 'text-rose-600' : 'text-stone-600'}`}>
                            Stock: <strong>{prod.stockCount}</strong>
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                updateProduct(prod.id, { 
                                  stockCount: Math.max(0, prod.stockCount - 1),
                                  inStock: Math.max(0, prod.stockCount - 1) > 0
                                });
                              }}
                              title="Decrease 1 piece"
                              className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 rounded font-mono text-xs"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => {
                                updateProduct(prod.id, { 
                                  stockCount: prod.stockCount + 5,
                                  inStock: true
                                });
                                showToast('Stock Updated', `+5 added to ${prod.name}`);
                              }}
                              title="Add 5 pieces"
                              className="px-2 py-0.5 bg-stone-100 hover:bg-noir-950 hover:text-white rounded text-[11px] font-semibold transition-colors"
                            >
                              +5 Stock
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete silhouette "${prod.name}" from catalog?`)) {
                                  deleteProduct(prod.id);
                                  showToast('Silhouette Removed', prod.name);
                                }
                              }}
                              title="Delete"
                              className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ── TAB 4: ADD SILHOUETTE ── */}
            {activeTab === 'new-product' && (
              <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4 max-w-2xl mx-auto">
                <div className="border-b border-stone-200 pb-3">
                  <h4 className="font-serif text-lg text-noir-950">Add Studio Silhouette to Catalog</h4>
                  <p className="text-xs text-stone-500 font-light">Craft a new luxury garment entry for immediate live display.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lagos Pleated Silk Gown"
                      value={newProd.name}
                      onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-noir-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">Subtitle / Cut</label>
                    <input
                      type="text"
                      placeholder="e.g. Architectural bias silhouette"
                      value={newProd.subtitle}
                      onChange={e => setNewProd({ ...newProd, subtitle: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-noir-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">Category</label>
                    <select
                      value={newProd.category}
                      onChange={e => setNewProd({ ...newProd, category: e.target.value as ProductCategory })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-noir-950"
                    >
                      <option value="dresses">Dresses</option>
                      <option value="co-ords">Co-Ords</option>
                      <option value="tops">Tops & Blouses</option>
                      <option value="bottoms">Trousers & Bottoms</option>
                      <option value="outerwear">Outerwear</option>
                      <option value="evening">Eveningwear</option>
                      <option value="accessories">Accessories</option>
                      <option value="shoes">Footwear</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">Price ($ USD)</label>
                    <input
                      type="number"
                      required
                      value={newProd.price}
                      onChange={e => setNewProd({ ...newProd, price: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-noir-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">Stock Count</label>
                    <input
                      type="number"
                      required
                      value={newProd.stockCount}
                      onChange={e => setNewProd({ ...newProd, stockCount: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-noir-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">Image URL (High-Res)</label>
                  <input
                    type="url"
                    required
                    value={newProd.imageUrl}
                    onChange={e => setNewProd({ ...newProd, imageUrl: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-noir-950"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">Fabric Composition</label>
                  <input
                    type="text"
                    value={newProd.composition}
                    onChange={e => setNewProd({ ...newProd, composition: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-noir-950"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-noir-950 hover:bg-melly-900 text-white text-xs uppercase tracking-luxury font-medium rounded shadow transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish to MellyStore</span>
                  </button>
                </div>
              </form>
            )}

            {/* ── TAB 5: SECURITY & PASSCODE MANAGEMENT ── */}
            {activeTab === 'security' && (
              <div className="max-w-xl mx-auto space-y-6">
                
                {/* Security Card */}
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-3 border-b border-stone-200 pb-3">
                    <KeyRound className="w-5 h-5 text-amber-700" />
                    <div>
                      <h4 className="font-serif text-base text-noir-950 font-medium">
                        Change Administrative PIN
                      </h4>
                      <p className="text-xs text-stone-500 font-light">
                        Configure the security passcode required to access this portal.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                        Current PIN
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Enter current PIN"
                        value={currentPinInput}
                        onChange={e => setCurrentPinInput(e.target.value)}
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-noir-950 font-mono tracking-widest"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                          New Security PIN
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Min 4 digits"
                          value={newPinInput}
                          onChange={e => setNewPinInput(e.target.value)}
                          className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-noir-950 font-mono tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 mb-1">
                          Confirm New PIN
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Repeat new PIN"
                          value={confirmPinInput}
                          onChange={e => setConfirmPinInput(e.target.value)}
                          className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-noir-950 font-mono tracking-widest"
                        />
                      </div>
                    </div>

                    {pinChangeMsg && (
                      <div className={`p-3 rounded-lg text-xs flex items-center space-x-2 ${
                        pinChangeMsg.type === 'success' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {pinChangeMsg.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        )}
                        <span>{pinChangeMsg.text}</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-noir-950 hover:bg-melly-900 text-white rounded-lg text-xs uppercase tracking-luxury font-medium transition-colors flex items-center space-x-2"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Security Code</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Founder Details Summary */}
                <div className="bg-[#FAF8F5] p-5 rounded-xl border border-stone-300 space-y-2 text-xs text-stone-600">
                  <p className="font-semibold text-noir-900">Security Best Practices:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Always lock the terminal when stepping away from the boutique counter.</li>
                    <li>The default master PIN is <strong>8166</strong>.</li>
                    <li>Telephone hotline: <strong>08166612115</strong> (Victoria Island, Lagos).</li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={handleLockSession}
                      className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock Terminal Now</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
