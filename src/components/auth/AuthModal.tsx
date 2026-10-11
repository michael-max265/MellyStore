import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Crown, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { UserProfile } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthOpen, 
    setIsAuthOpen, 
    authMode, 
    setAuthMode, 
    setUserProfile, 
    showToast 
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('08166612115');
  const [street, setStreet] = useState('Victoria Island');
  const [city, setCity] = useState('Lagos');
  const [state, setState] = useState('Lagos State');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      let matchedProfile: UserProfile | null = null;
      try {
        const existingUsers = JSON.parse(localStorage.getItem('melly_registered_users') || '[]');
        const match = existingUsers.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (match) {
          matchedProfile = match;
        }
      } catch {
        // ignore
      }

      if (!matchedProfile) {
        // Default / demo sign-in fallback if user signs in with any email
        matchedProfile = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email.trim().toLowerCase(),
          phone: '08166612115',
          tier: 'VIP Classic',
          points: 350,
          measurements: {
            bust: '34 in (86 cm)',
            waist: '26 in (66 cm)',
            hips: '36 in (91 cm)',
            height: '5 ft 9 in (175 cm)',
            recommendedSize: 'S'
          },
          address: {
            street: 'Victoria Island',
            city: 'Lagos',
            state: 'Lagos State',
            postalCode: '101241',
            country: 'Nigeria'
          }
        };

        // Also save for future
        try {
          const existing = JSON.parse(localStorage.getItem('melly_registered_users') || '[]');
          existing.push({ ...matchedProfile, password });
          localStorage.setItem('melly_registered_users', JSON.stringify(existing));
        } catch {
          // ignore
        }
      }

      setUserProfile(matchedProfile);
      setIsLoading(false);
      setIsAuthOpen(false);
      showToast('Welcome Back', `Signed in as ${matchedProfile.fullName}. VIP benefits unlocked!`, 'success');
    }, 350);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please complete all required fields (Name, Email, Password).');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newProfile: UserProfile = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '08166612115',
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
          street: street.trim() || 'Victoria Island',
          city: city.trim() || 'Lagos',
          state: state.trim() || 'Lagos State',
          postalCode: '101241',
          country: 'Nigeria'
        }
      };

      try {
        const existingUsers = JSON.parse(localStorage.getItem('melly_registered_users') || '[]');
        existingUsers.push({ ...newProfile, password });
        localStorage.setItem('melly_registered_users', JSON.stringify(existingUsers));
      } catch {
        // ignore
      }

      setUserProfile(newProfile);
      setIsLoading(false);
      setIsAuthOpen(false);
      showToast('Account Created', `Welcome to MellyStore VIP Club, ${newProfile.fullName}! +250 points awarded.`, 'success');
    }, 400);
  };

  // Quick Demo VIP Sign In helper
  const handleDemoSignIn = (name: string, demoEmail: string, tier: 'VIP Classic' | 'VIP Diamond') => {
    const demoProfile: UserProfile = {
      id: 'usr-vip-001',
      fullName: name,
      email: demoEmail,
      phone: '08166612115',
      tier,
      points: tier === 'VIP Diamond' ? 2450 : 500,
      measurements: {
        bust: '34 in (86 cm)',
        waist: '26 in (66 cm)',
        hips: '36 in (91 cm)',
        height: '5 ft 9 in (175 cm)',
        recommendedSize: 'S'
      },
      address: {
        street: 'Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        state: 'Lagos State',
        postalCode: '101241',
        country: 'Nigeria'
      }
    };
    setUserProfile(demoProfile);
    setIsAuthOpen(false);
    showToast('Signed In', `Welcome back, ${demoProfile.fullName}! (${tier})`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsAuthOpen(false)} 
      />

      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden z-10 border border-stone-200">
        
        {/* Header Hero */}
        <div className="bg-noir-950 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-champagne-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-champagne-300 mb-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium">MellyStore Lagos</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium tracking-wide">
            {authMode === 'signin' ? 'Sign In to VIP Portal' : 'Create VIP Account'}
          </h3>
          <p className="text-xs text-stone-300 font-light mt-1.5 leading-relaxed">
            {authMode === 'signin' 
              ? 'Access your bespoke Nigerian fittings, white-glove orders & VIP client privileges.' 
              : 'Join the MellyStore VIP Circle for bespoke size profiles and complimentary dispatch in Lagos.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-white/10 rounded-xl p-1 mt-6 border border-white/10">
            <button
              onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-noir-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-noir-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. adaeze@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-noir-950 focus:ring-1 focus:ring-noir-950 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-noir-950 focus:ring-1 focus:ring-noir-950 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-noir-950 hover:bg-melly-600 text-white rounded-xl text-xs uppercase tracking-luxury font-semibold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In to VIP Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Accounts */}
              <div className="pt-3 border-t border-stone-200">
                <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-2">
                  Instant One-Click VIP Demo Access:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('Adaeze Okafor', 'adaeze.okafor@mellystore.ng', 'VIP Diamond')}
                    className="text-left p-2.5 bg-white border border-amber-200/80 hover:border-amber-500 rounded-lg text-xs transition-all hover:bg-amber-50/40 cursor-pointer"
                  >
                    <div className="font-semibold text-stone-900 flex items-center space-x-1">
                      <Crown className="w-3 h-3 text-amber-500" />
                      <span>Adaeze Okafor</span>
                    </div>
                    <div className="text-[10px] text-stone-500">VIP Diamond (Lagos)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('Chioma Adebayo', 'chioma.adebayo@mellystore.ng', 'VIP Classic')}
                    className="text-left p-2.5 bg-white border border-stone-200 hover:border-stone-400 rounded-lg text-xs transition-all hover:bg-stone-50 cursor-pointer"
                  >
                    <div className="font-semibold text-stone-900">Chioma Adebayo</div>
                    <div className="text-[10px] text-stone-500">VIP Classic (Abuja)</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adaeze Okafor"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-noir-950 focus:ring-1 focus:ring-noir-950 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full pl-10 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-noir-950 focus:ring-1 focus:ring-noir-950 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Telephone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08166612115"
                      className="w-full pl-10 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-noir-950 focus:ring-1 focus:ring-noir-950 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Victoria Island"
                      className="w-full pl-10 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-noir-950 focus:ring-1 focus:ring-noir-950 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lagos"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-noir-950 focus:ring-1 focus:ring-noir-950 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 4 characters"
                    className="w-full pl-10 pr-10 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-noir-950 focus:ring-1 focus:ring-noir-950 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-noir-950 hover:bg-melly-600 text-white rounded-xl text-xs uppercase tracking-luxury font-semibold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Join VIP Club & Award +250 Pts'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Privacy footnote */}
          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-stone-500 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>MellyStore Lagos 256-bit Secure Private Client Authentication</span>
          </div>
        </div>

      </div>
    </div>
  );
};
