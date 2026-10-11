import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  Lock,
  Building2,
  Copy,
  Check,
  Truck,
  Sparkles,
  LogIn,
  UserPlus,
  AlertCircle,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import type { Order, UserProfile } from '../../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    setIsTrackerOpen,
    setIsInvoiceOpen,
    setActiveInvoiceOrder,
    userProfile,
    setUserProfile,
    cart, 
    cartTotal, 
    formatPrice, 
    createOrder, 
    currency,
    showToast
  } = useStore();

  // Active step: 'account' | 'payment' | 'confirmation'
  const [step, setStep] = useState<'account' | 'payment' | 'confirmation'>('account');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Account creation / login mode
  const [accountMode, setAccountMode] = useState<'register' | 'login'>('register');
  const [accountForm, setAccountForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria'
  });
  const [accountError, setAccountError] = useState('');

  // Shipping Form State
  const [deliveryData, setDeliveryData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: 'Victoria Island',
    apartment: '',
    city: 'Lagos',
    state: 'Lagos State',
    postalCode: '101241',
    country: 'Nigeria',
  });

  const [shippingMethod] = useState<{ id: string; name: string; cost: number; estimatedDays: string }>({
    id: 'express',
    name: 'Complimentary White-Glove Express',
    cost: 0,
    estimatedDays: '1-2 business days'
  });

  // Payment Method: 'card' | 'bank_transfer' | 'apple_pay' | 'delivery'
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'apple_pay' | 'delivery'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '•••• •••• •••• 4242',
    nameOnCard: '',
    expiry: '09/28',
    cvc: '842'
  });
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  // Track modal open transitions
  const prevIsOpen = useRef(false);

  useEffect(() => {
    // Only run when modal transitions from closed to open
    if (isCheckoutOpen && !prevIsOpen.current) {
      if (!userProfile) {
        setStep('account');
      } else {
        setStep('payment');
        setDeliveryData({
          fullName: userProfile.fullName,
          email: userProfile.email,
          phone: userProfile.phone,
          address: userProfile.address?.street || 'Victoria Island',
          apartment: userProfile.address?.apartment || '',
          city: userProfile.address?.city || 'Lagos',
          state: userProfile.address?.state || 'Lagos State',
          postalCode: userProfile.address?.postalCode || '101241',
          country: userProfile.address?.country || 'Nigeria',
        });
        setCardData(prev => ({
          ...prev,
          nameOnCard: userProfile.fullName
        }));
      }
    }
    prevIsOpen.current = isCheckoutOpen;
  }, [isCheckoutOpen, userProfile]);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountRate, setPromoDiscountRate] = useState(0);
  const [promoError, setPromoError] = useState('');

  if (!isCheckoutOpen) return null;

  const discountAmount = cartTotal * promoDiscountRate;
  const shippingCost = shippingMethod.cost;
  const orderTotal = Math.max(0, cartTotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'MELLY10' || code === 'WELCOME10') {
      setAppliedPromo(code);
      setPromoDiscountRate(0.10); // 10% off
      showToast('Privilege Code Applied', `${code} applied! 10% discount deducted from your total.`, 'success');
      setPromoCodeInput('');
    } else if (code === 'VIP20') {
      setAppliedPromo(code);
      setPromoDiscountRate(0.20); // 20% off
      showToast('VIP Collector Code Applied', `${code} applied! 20% discount deducted.`, 'success');
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid or expired privilege code.');
    }
  };

  // Handle Account Creation
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError('');

    if (!accountForm.fullName.trim() || !accountForm.email.trim() || !accountForm.password.trim()) {
      setAccountError('Please fill in your name, email, and password.');
      return;
    }

    if (accountForm.password.length < 4) {
      setAccountError('Password must be at least 4 characters.');
      return;
    }

    const newProfile: UserProfile = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      fullName: accountForm.fullName.trim(),
      email: accountForm.email.trim().toLowerCase(),
      phone: accountForm.phone.trim() || '08166612115',
      tier: 'VIP Classic',
      points: 250,
      measurements: {
        bust: 'Standard',
        waist: 'Standard',
        hips: 'Standard',
        height: 'Standard',
        recommendedSize: 'M'
      },
      address: {
        street: accountForm.street.trim() || 'Victoria Island',
        city: accountForm.city.trim() || 'Lagos',
        state: accountForm.state.trim() || 'Lagos State',
        postalCode: '101241',
        country: accountForm.country.trim() || 'Nigeria'
      }
    };

    // Save account locally
    try {
      const existingAccounts = JSON.parse(localStorage.getItem('melly_registered_users') || '[]');
      existingAccounts.push({ ...newProfile, password: accountForm.password });
      localStorage.setItem('melly_registered_users', JSON.stringify(existingAccounts));
    } catch {
      // ignore
    }

    setUserProfile(newProfile);
    setDeliveryData({
      fullName: newProfile.fullName,
      email: newProfile.email,
      phone: newProfile.phone,
      address: newProfile.address.street,
      apartment: '',
      city: newProfile.address.city,
      state: newProfile.address.state,
      postalCode: newProfile.address.postalCode,
      country: newProfile.address.country,
    });
    setCardData(prev => ({ ...prev, nameOnCard: newProfile.fullName }));

    showToast('VIP Account Created', `Welcome, ${newProfile.fullName}! +250 points awarded.`);
    setStep('payment');
  };

  // Handle Account Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError('');

    if (!accountForm.email.trim()) {
      setAccountError('Please enter your email address.');
      return;
    }

    let foundProfile: UserProfile | null = null;
    try {
      const existingAccounts = JSON.parse(localStorage.getItem('melly_registered_users') || '[]');
      const match = existingAccounts.find((a: any) => a.email.toLowerCase() === accountForm.email.trim().toLowerCase());
      if (match) {
        foundProfile = match;
      }
    } catch {
      // ignore
    }

    if (!foundProfile) {
      foundProfile = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        fullName: accountForm.fullName.trim() || accountForm.email.split('@')[0],
        email: accountForm.email.trim().toLowerCase(),
        phone: accountForm.phone.trim() || '08166612115',
        tier: 'VIP Classic',
        points: 250,
        measurements: {
          bust: 'Standard',
          waist: 'Standard',
          hips: 'Standard',
          height: 'Standard',
          recommendedSize: 'M'
        },
        address: {
          street: 'Victoria Island',
          city: 'Lagos',
          state: 'Lagos State',
          postalCode: '101241',
          country: 'Nigeria'
        }
      };
    }

    setUserProfile(foundProfile);
    setDeliveryData({
      fullName: foundProfile.fullName,
      email: foundProfile.email,
      phone: foundProfile.phone,
      address: foundProfile.address.street,
      apartment: '',
      city: foundProfile.address.city,
      state: foundProfile.address.state,
      postalCode: foundProfile.address.postalCode,
      country: foundProfile.address.country,
    });
    setCardData(prev => ({ ...prev, nameOnCard: foundProfile!.fullName }));

    showToast('Signed In', `Welcome back, ${foundProfile.fullName}`);
    setStep('payment');
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText('0816661211');
    setCopiedAccount(true);
    showToast('Account Number Copied', '0816661211 (GTBank)');
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = createOrder({
        customer: { ...deliveryData },
        items: cart.map(c => ({
          productId: c.product.id,
          name: c.product.name,
          price: c.product.price,
          size: c.size,
          color: c.color.name,
          quantity: c.quantity,
          image: c.product.images[0]
        })),
        subtotal: cartTotal,
        discount: discountAmount,
        promoCodeApplied: appliedPromo || undefined,
        shippingMethod,
        tax: 0,
        total: orderTotal,
        paymentMethod: paymentMethod === 'card' 
          ? 'card' 
          : paymentMethod === 'bank_transfer'
          ? 'bank_transfer'
          : paymentMethod === 'apple_pay'
          ? 'apple_pay'
          : 'delivery',
        status: 'Confirmed'
      });

      setConfirmedOrder(newOrder);
      setIsProcessing(false);
      setStep('confirmation');

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4B07B', '#B08E7E', '#1C1917']
        });
      } catch {
        // Safe fallback
      }
    }, 1200);
  };

  const handleOpenInvoice = () => {
    if (confirmedOrder) {
      setActiveInvoiceOrder(confirmedOrder);
      setIsInvoiceOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => {
          if (step !== 'confirmation') setIsCheckoutOpen(false);
        }} 
      />

      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden z-10 border border-stone-200 max-h-[94vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-xl sm:text-2xl text-noir-950 font-normal tracking-wide">
              MELLY<span className="text-melly-600 font-light">STORE</span>
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-xs uppercase tracking-luxury text-stone-500 font-medium">
              {step === 'confirmation' 
                ? 'Order Confirmed' 
                : step === 'account' 
                ? 'Step 1: VIP Client Account (Required)' 
                : 'Step 2: Make Payment'}
            </span>
          </div>

          {step !== 'confirmation' && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-noir-950 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {step === 'confirmation' && confirmedOrder ? (
            
            /* ─────────────────────────────────────────────────────────────
                CONFIRMATION VIEW
               ───────────────────────────────────────────────────────────── */
            <div className="text-center max-w-xl mx-auto py-8 space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-melly-700 font-semibold">
                  Thank you for choosing MellyStore
                </span>
                <h2 className="font-serif text-3xl text-noir-950 font-normal mt-1">
                  Your Studio Order is Confirmed
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-2">
                  An order confirmation and tracking docket have been dispatched to <strong className="text-noir-800">{confirmedOrder.customer.email}</strong>.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-white p-6 rounded-xl border border-stone-200/90 text-left space-y-4 shadow-sm text-xs">
                <div className="flex justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Order Reference</span>
                    <span className="font-serif text-base font-semibold text-noir-950">{confirmedOrder.orderNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Tracking Code</span>
                    <span className="font-mono text-xs font-semibold text-melly-800">{confirmedOrder.trackingNumber}</span>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-2">Purchased Items</span>
                  <div className="space-y-2">
                    {confirmedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded" />
                          <div>
                            <p className="font-serif text-noir-900 font-medium">{item.name}</p>
                            <p className="text-[10px] text-stone-500">Size: {item.size} • Color: {item.color} (x{item.quantity})</p>
                          </div>
                        </div>
                        <span className="font-semibold text-noir-950">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-3 flex justify-between font-semibold text-sm text-noir-950">
                  <span>Total Paid ({currency.code})</span>
                  <span>{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={handleOpenInvoice}
                  className="px-6 py-3 border border-stone-300 hover:border-noir-950 rounded-xl text-xs uppercase tracking-luxury font-medium text-noir-900 flex items-center justify-center space-x-2 transition-colors cursor-pointer bg-white"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Official Invoice</span>
                </button>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsTrackerOpen(true);
                  }}
                  className="px-6 py-3 border border-melly-600 hover:bg-melly-50 text-melly-900 rounded-xl text-xs uppercase tracking-luxury font-medium transition-colors cursor-pointer"
                >
                  Track Studio Order
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-8 py-3 bg-noir-950 hover:bg-melly-900 text-white rounded-xl text-xs uppercase tracking-luxury font-medium transition-colors cursor-pointer shadow-md"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          ) : (
            
            /* ─────────────────────────────────────────────────────────────
                CHECKOUT FORM & SUMMARY
               ───────────────────────────────────────────────────────────── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Form Steps */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Step Indicators */}
                <div className="flex items-center space-x-2 sm:space-x-4 text-[11px] font-semibold uppercase tracking-wider pb-4 border-b border-stone-200">
                  <span className={`flex items-center space-x-1.5 ${step === 'account' ? 'text-noir-950 font-bold' : userProfile ? 'text-emerald-700' : 'text-stone-400'}`}>
                    <span>1. Client Account</span>
                    {userProfile && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </span>
                  <span className="text-stone-300">›</span>
                  <span className={step === 'payment' ? 'text-noir-950 font-bold' : 'text-stone-400'}>
                    2. Payment Section
                  </span>
                </div>

                {/* ── MANDATORY STEP 1: CREATE ACCOUNT GATE ── */}
                {step === 'account' && (
                  <div className="space-y-5 animate-fade-in">
                    
                    {/* VIP Requirement Banner */}
                    <div className="bg-[#FAF4EE] border border-[#E8DACB] p-4 rounded-2xl flex items-start space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-melly-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Sparkles className="w-4 h-4 text-amber-200" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-noir-950">
                          Create an Account to Proceed to Payment
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                          To protect your order, enable live dispatch tracking, and verify delivery, all clients must create an account before making payment.
                        </p>
                      </div>
                    </div>

                    {/* Register / Sign In Switch */}
                    <div className="flex border border-stone-300 rounded-xl overflow-hidden bg-stone-100 p-1">
                      <button
                        type="button"
                        onClick={() => setAccountMode('register')}
                        className={`flex-1 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                          accountMode === 'register' ? 'bg-white text-noir-950 shadow-xs' : 'text-stone-600 hover:text-noir-900'
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create VIP Account</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountMode('login')}
                        className={`flex-1 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                          accountMode === 'login' ? 'bg-white text-noir-950 shadow-xs' : 'text-stone-600 hover:text-noir-900'
                        }`}
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Existing Client Sign In</span>
                      </button>
                    </div>

                    {accountError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{accountError}</span>
                      </div>
                    )}

                    {accountMode === 'register' ? (
                      /* Create Account Form */
                      <form onSubmit={handleCreateAccount} className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-noir-800 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Adanna Okonkwo"
                            value={accountForm.fullName}
                            onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
                            className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-noir-800 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="adanna@example.com"
                              value={accountForm.email}
                              onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:bg-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-noir-800 mb-1">
                              Phone / WhatsApp *
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="0803 123 4567"
                              value={accountForm.phone}
                              onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-noir-800 mb-1">
                            Account Password *
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Create a secure password (min 4 characters)"
                            value={accountForm.password}
                            onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                            className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-noir-800 mb-1">
                            Delivery Address (Street / Landmark)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                            value={accountForm.street}
                            onChange={(e) => setAccountForm({ ...accountForm, street: e.target.value })}
                            className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-noir-800 mb-1">City</label>
                            <input
                              type="text"
                              value={accountForm.city}
                              onChange={(e) => setAccountForm({ ...accountForm, city: e.target.value })}
                              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-noir-800 mb-1">Country</label>
                            <select
                              value={accountForm.country}
                              onChange={(e) => setAccountForm({ ...accountForm, country: e.target.value })}
                              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:outline-none"
                            >
                              <option value="Nigeria">Nigeria</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="Ghana">Ghana</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-4 bg-noir-950 hover:bg-melly-900 text-white text-xs uppercase tracking-luxury font-medium rounded-xl shadow-luxury flex items-center justify-center space-x-2 transition-all mt-4 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Create Account & Continue to Payment</span>
                        </button>
                      </form>
                    ) : (
                      /* Sign In Form */
                      <form onSubmit={handleLogin} className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-noir-800 mb-1">
                            Registered Email Address
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="adanna@example.com"
                            value={accountForm.email}
                            onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                            className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-noir-800 mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Enter your account password"
                            value={accountForm.password}
                            onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                            className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:bg-white focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-4 bg-noir-950 hover:bg-melly-900 text-white text-xs uppercase tracking-luxury font-medium rounded-xl shadow-luxury flex items-center justify-center space-x-2 transition-all mt-4 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Sign In & Continue to Payment</span>
                        </button>
                      </form>
                    )}

                  </div>
                )}

                {/* ── STEP 2: MAKE PAYMENT SECTION ── */}
                {step === 'payment' && (
                  <div className="space-y-5 animate-fade-in">
                    
                    {/* Logged in Client Pill */}
                    {userProfile && (
                      <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center justify-between text-xs shadow-xs">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-serif">
                            {userProfile.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-noir-950 flex items-center space-x-1.5">
                              <span>{userProfile.fullName}</span>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded">
                                {userProfile.tier}
                              </span>
                            </p>
                            <p className="text-[11px] text-stone-500">{userProfile.email} • {userProfile.phone}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep('account')}
                          className="text-[11px] text-melly-700 underline font-medium hover:text-noir-950 cursor-pointer"
                        >
                          Switch Account
                        </button>
                      </div>
                    )}

                    {/* Delivery Address Summary Box */}
                    <div className="bg-white border border-stone-200 p-4 rounded-2xl text-xs space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-noir-950 font-semibold">
                          <MapPin className="w-4 h-4 text-stone-600" />
                          <span>Delivering To:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(!isEditingAddress)}
                          className="text-[11px] text-melly-700 font-medium hover:underline flex items-center space-x-0.5 cursor-pointer"
                        >
                          <span>{isEditingAddress ? 'Done Editing' : 'Edit Address'}</span>
                          {isEditingAddress ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {!isEditingAddress ? (
                        <p className="text-stone-600 pl-6 leading-relaxed">
                          {deliveryData.address}, {deliveryData.city}, {deliveryData.state}, {deliveryData.country}
                        </p>
                      ) : (
                        <div className="pt-2 pl-6 space-y-2">
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={deliveryData.address}
                            onChange={e => setDeliveryData({ ...deliveryData, address: e.target.value })}
                            className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="City"
                              value={deliveryData.city}
                              onChange={e => setDeliveryData({ ...deliveryData, city: e.target.value })}
                              className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded"
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={deliveryData.state}
                              onChange={e => setDeliveryData({ ...deliveryData, state: e.target.value })}
                              className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-noir-950 mb-3">
                        Select Payment Method
                      </h4>

                      <div className="space-y-3">
                        
                        {/* Option 1: Credit / Debit Card (Powered by Paystack) */}
                        <label 
                          onClick={() => setPaymentMethod('card')}
                          className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                            paymentMethod === 'card' ? 'border-noir-950 bg-stone-50/70 shadow-xs' : 'border-stone-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <CreditCard className="w-4 h-4 text-noir-900" />
                              <div>
                                <span className="text-xs font-semibold text-noir-900 block">Debit / Credit Card (Paystack)</span>
                                <span className="text-[10px] text-stone-500">Instant Nigerian & International card processing</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Paystack Verified
                            </span>
                          </div>

                          {paymentMethod === 'card' && (
                            <div className="mt-3 space-y-2.5 border-t border-stone-200 pt-3">
                              <div className="flex items-center space-x-2 text-[10px] text-stone-500 pb-1">
                                <span className="px-1.5 py-0.5 bg-stone-100 rounded font-bold text-stone-700">VERVE</span>
                                <span className="px-1.5 py-0.5 bg-stone-100 rounded font-bold text-stone-700">MASTERCARD</span>
                                <span className="px-1.5 py-0.5 bg-stone-100 rounded font-bold text-stone-700">VISA</span>
                                <span className="text-emerald-700 font-medium">✓ Zero Processing Fees</span>
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Card Number</label>
                                <input
                                  type="text"
                                  value={cardData.cardNumber}
                                  onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                                  placeholder="5399 •••• •••• ••••"
                                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded font-mono"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Expiration</label>
                                  <input
                                    type="text"
                                    value={cardData.expiry}
                                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                    placeholder="MM / YY"
                                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">CVV</label>
                                  <input
                                    type="text"
                                    value={cardData.cvc}
                                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                                    placeholder="CVV"
                                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Cardholder Name</label>
                                <input
                                  type="text"
                                  value={cardData.nameOnCard}
                                  onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                                  placeholder="Name as printed on card"
                                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded"
                                />
                              </div>
                            </div>
                          )}
                        </label>

                        {/* Option 2: Direct Nigerian Bank Transfer */}
                        <label 
                          onClick={() => setPaymentMethod('bank_transfer')}
                          className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                            paymentMethod === 'bank_transfer' ? 'border-noir-950 bg-stone-50/70 shadow-xs' : 'border-stone-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <Building2 className="w-4 h-4 text-amber-700" />
                              <div>
                                <span className="text-xs font-semibold text-noir-900 block">Direct Bank Transfer</span>
                                <span className="text-[10px] text-stone-500">Instant Nigerian Bank Deposit (GTBank)</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                              Instant Transfer
                            </span>
                          </div>

                          {paymentMethod === 'bank_transfer' && (
                            <div className="mt-3 border-t border-stone-200 pt-3 space-y-3">
                              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-300 text-xs space-y-2">
                                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                                  <span className="text-stone-500">Bank Name:</span>
                                  <span className="font-semibold text-noir-950">Guaranty Trust Bank (GTBank)</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                                  <span className="text-stone-500">Account Number:</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono font-bold text-sm text-noir-950">0816661211</span>
                                    <button
                                      type="button"
                                      onClick={handleCopyBank}
                                      className="p-1 rounded bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 cursor-pointer"
                                      title="Copy Account Number"
                                    >
                                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                                  <span className="text-stone-500">Account Name:</span>
                                  <span className="font-semibold text-noir-950">MELLYSTORE BOUTIQUE LTD</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-stone-500">Amount Due:</span>
                                  <span className="font-bold text-melly-800 text-sm">{formatPrice(orderTotal)}</span>
                                </div>
                              </div>

                              <label className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer pt-1">
                                <input
                                  type="checkbox"
                                  checked={transferConfirmed}
                                  onChange={(e) => setTransferConfirmed(e.target.checked)}
                                  className="accent-noir-950 rounded cursor-pointer"
                                />
                                <span>I have sent the bank transfer payment</span>
                              </label>
                            </div>
                          )}
                        </label>

                        {/* Option 3: Apple Pay / Google Pay */}
                        <label 
                          onClick={() => setPaymentMethod('apple_pay')}
                          className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                            paymentMethod === 'apple_pay' ? 'border-noir-950 bg-stone-50/70 shadow-xs' : 'border-stone-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-noir-900">Apple Pay / Google Pay</span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">1-Click</span>
                          </div>
                        </label>

                        {/* Option 4: Pay on Delivery */}
                        <label 
                          onClick={() => setPaymentMethod('delivery')}
                          className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                            paymentMethod === 'delivery' ? 'border-noir-950 bg-stone-50/70 shadow-xs' : 'border-stone-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <Truck className="w-4 h-4 text-stone-700" />
                              <div>
                                <span className="text-xs font-semibold text-noir-900 block">Pay on Delivery</span>
                                <span className="text-[10px] text-stone-500">POS terminal or cash upon courier arrival</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">Lagos Only</span>
                          </div>
                        </label>

                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-stone-500 pt-1">
                      <Lock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Encrypted with 256-Bit SSL Studio Security Protocol</span>
                    </div>

                    {/* Authorize Payment CTA */}
                    <button
                      type="button"
                      onClick={handleCompleteOrder}
                      disabled={isProcessing}
                      className="w-full mt-2 py-4 bg-noir-950 hover:bg-melly-900 disabled:opacity-50 text-white text-xs uppercase tracking-luxury font-medium rounded-xl shadow-luxury flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      {isProcessing ? (
                        <span>Authorizing Secure Payment...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-amber-300 stroke-[1.5]" />
                          <span>Authorize Payment & Place Order • {formatPrice(orderTotal)}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-serif text-base text-noir-950 font-medium">
                    Bag Summary ({cart.length} items)
                  </h3>
                  {userProfile && (
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                      VIP Client Active
                    </span>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-14 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-serif font-medium text-noir-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-stone-500">Size: {item.size} • Color: {item.color.name}</p>
                        <p className="text-[11px] font-semibold text-noir-800 mt-1">
                          {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input Box */}
                <div className="border-t border-stone-100 pt-3">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs">
                      <div className="flex items-center space-x-2 text-emerald-800">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold">{appliedPromo} ({promoDiscountRate * 100}% OFF)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedPromo(null);
                          setPromoDiscountRate(0);
                        }}
                        className="text-stone-400 hover:text-stone-700 font-bold ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="space-y-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          placeholder="Privilege / Promo Code"
                          className="flex-1 uppercase font-mono text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:border-noir-950 focus:bg-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-noir-950 hover:bg-melly-900 text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[10px] text-red-600 font-medium pl-1">{promoError}</p>
                      )}
                      <p className="text-[10px] text-stone-600 pl-1">Try code <span className="font-mono font-semibold text-stone-800">MELLY10</span> for 10% off</p>
                    </form>
                  )}
                </div>

                <div className="border-t border-stone-100 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-noir-950 font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Privilege Discount ({appliedPromo})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-medium">Complimentary</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customs & Taxes</span>
                    <span className="text-emerald-700 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between text-sm text-noir-950 font-bold border-t border-stone-200 pt-2">
                    <span>Total Due</span>
                    <span>{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                {/* VIP Privilege callout */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                  <div className="flex items-center space-x-1.5 text-noir-900 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>MellyStore Studio Assurance</span>
                  </div>
                  <p>Orders are packaged in signature embossed cedar boxes with insured express delivery.</p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
