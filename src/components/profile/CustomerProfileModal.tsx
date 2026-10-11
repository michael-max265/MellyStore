import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Package, 
  Ruler, 
  MapPin, 
  Clock, 
  FileText, 
  Sparkles, 
  LogOut,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Order } from '../../types';

export const CustomerProfileModal: React.FC = () => {
  const { 
    isProfileOpen, 
    setIsProfileOpen, 
    userProfile, 
    setUserProfile, 
    orders, 
    formatPrice, 
    setIsTrackerOpen,
    setIsInvoiceOpen,
    setActiveInvoiceOrder,
    setIsAuthOpen,
    setAuthMode,
    signOut,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'measurements' | 'orders'>('overview');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(userProfile?.address || {
    street: 'Victoria Island',
    apartment: '',
    city: 'Lagos',
    state: 'Lagos State',
    postalCode: '101241',
    country: 'Nigeria'
  });

  const [measurementForm, setMeasurementForm] = useState(userProfile?.measurements || {
    bust: '34 in (86 cm)',
    waist: '26 in (66 cm)',
    hips: '36 in (91 cm)',
    height: '5 ft 9 in (175 cm)',
    recommendedSize: 'S'
  });

  React.useEffect(() => {
    if (userProfile?.address) {
      setAddressForm(userProfile.address);
    }
    if (userProfile?.measurements) {
      setMeasurementForm(userProfile.measurements);
    }
  }, [userProfile]);

  if (!isProfileOpen) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        address: { ...addressForm }
      });
      setIsEditingAddress(false);
      showToast('Address Updated', 'Your Studio delivery coordinates have been preserved.');
    }
  };

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        measurements: { ...measurementForm }
      });
      showToast('Fitting Profile Saved', 'Studio sizing recommendations updated to Size ' + measurementForm.recommendedSize);
    }
  };

  const handleTrackOrder = () => {
    setIsProfileOpen(false);
    setIsTrackerOpen(true);
  };

  const handleViewInvoice = (order: Order) => {
    setActiveInvoiceOrder(order);
    setIsInvoiceOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsProfileOpen(false)} 
      />

      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden z-10 border border-stone-200 flex flex-col max-h-[90vh]">
        
        {/* Header Hero */}
        <div className="bg-noir-950 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-champagne-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={() => setIsProfileOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-600 to-amber-400 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-noir-900 flex items-center justify-center text-champagne-300 font-serif text-xl font-bold">
                  {userProfile?.fullName.split(' ').map(n => n[0]).slice(0, 2).join('') || 'SM'}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">
                    {userProfile?.fullName || 'Valued Studio Client'}
                  </h2>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>{userProfile?.tier || 'VIP Diamond'}</span>
                  </span>
                </div>
                <p className="text-xs text-stone-300 font-light mt-0.5">
                  {userProfile?.email || 'client@mellystore.com'}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-stone-400">MellyStore VIP Points</span>
              <span className="font-serif text-xl text-champagne-300 font-semibold flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{userProfile?.points?.toLocaleString() || '2,450'} pts</span>
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-luxury font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-noir-950 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-luxury font-medium transition-all ${
                activeTab === 'measurements'
                  ? 'bg-white text-noir-950 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Measurements & Fit
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-luxury font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-noir-950 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* VIP Privilege Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center space-x-2 text-stone-900 mb-2">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span className="text-xs uppercase tracking-wider font-semibold">White-Glove Tier</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">Complimentary priority dispatch & bespoke archival garment packaging.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center space-x-2 text-stone-900 mb-2">
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Private Stylist</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">Direct concierge consultation with our MellyStore Studio team.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center space-x-2 text-stone-900 mb-2">
                    <Ruler className="w-4 h-4 text-amber-600" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Custom Fit</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">Tailored size recommendation: <strong>Size {userProfile?.measurements.recommendedSize || 'S'}</strong>.</p>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-stone-500" />
                    <h3 className="font-serif text-base text-noir-950 font-medium">Primary Studio Destination</h3>
                  </div>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs text-melly-700 hover:text-melly-900 font-medium underline"
                  >
                    {isEditingAddress ? 'Cancel' : 'Edit Address'}
                  </button>
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-medium text-stone-600 block mb-1">Street Address</label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded focus:border-noir-950 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-medium text-stone-600 block mb-1">Suite / Apartment</label>
                        <input
                          type="text"
                          value={addressForm.apartment}
                          onChange={e => setAddressForm({ ...addressForm, apartment: e.target.value })}
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded focus:border-noir-950 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-medium text-stone-600 block mb-1">City</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded focus:border-noir-950 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-medium text-stone-600 block mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={addressForm.postalCode}
                          onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded focus:border-noir-950 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-noir-950 text-white text-xs uppercase tracking-luxury font-medium rounded hover:bg-noir-900"
                    >
                      Save Address
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {userProfile?.address.street} {userProfile?.address.apartment && `, ${userProfile.address.apartment}`}<br />
                    {userProfile?.address.city}, {userProfile?.address.state} {userProfile?.address.postalCode}<br />
                    {userProfile?.address.country}
                  </p>
                )}
              </div>

              {/* Recent Order Snapshot */}
              {orders.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-stone-500" />
                      <h3 className="font-serif text-base text-noir-950 font-medium">Most Recent Acquisition</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-melly-700 hover:text-melly-900 font-medium underline"
                    >
                      View All ({orders.length})
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-semibold text-noir-950">{orders[0].orderNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                          {orders[0].status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        {orders[0].items.length} piece(s) • Total: <strong className="text-noir-950 font-serif">{formatPrice(orders[0].total)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleTrackOrder}
                        className="px-3 py-1.5 border border-stone-300 text-noir-950 hover:bg-stone-50 text-xs uppercase tracking-luxury rounded transition-colors"
                      >
                        Track Status
                      </button>
                      <button
                        onClick={() => handleViewInvoice(orders[0])}
                        className="px-3 py-1.5 bg-noir-950 text-white hover:bg-noir-900 text-xs uppercase tracking-luxury rounded transition-colors flex items-center space-x-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MEASUREMENTS */}
          {activeTab === 'measurements' && (
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 pb-4 border-b border-stone-100">
                <div className="p-2.5 rounded-full bg-stone-100 text-noir-950">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-noir-950 font-medium">Bespoke Fit & Silhouette Profile</h3>
                  <p className="text-xs text-stone-500">Save your precise measurements to guarantee ideal bias-cut and tailored drape.</p>
                </div>
              </div>

              <form onSubmit={handleSaveMeasurements} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-noir-900 block mb-1.5">Bust Measurement</label>
                    <input
                      type="text"
                      value={measurementForm.bust}
                      onChange={e => setMeasurementForm({ ...measurementForm, bust: e.target.value })}
                      placeholder='e.g. 34 in (86 cm)'
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:border-noir-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-noir-900 block mb-1.5">Natural Waist</label>
                    <input
                      type="text"
                      value={measurementForm.waist}
                      onChange={e => setMeasurementForm({ ...measurementForm, waist: e.target.value })}
                      placeholder='e.g. 26 in (66 cm)'
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:border-noir-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-noir-900 block mb-1.5">Full Hips</label>
                    <input
                      type="text"
                      value={measurementForm.hips}
                      onChange={e => setMeasurementForm({ ...measurementForm, hips: e.target.value })}
                      placeholder='e.g. 36 in (91 cm)'
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:border-noir-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-noir-900 block mb-1.5">Height</label>
                    <input
                      type="text"
                      value={measurementForm.height}
                      onChange={e => setMeasurementForm({ ...measurementForm, height: e.target.value })}
                      placeholder='e.g. 5 ft 9 in (175 cm)'
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:border-noir-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-noir-900 block mb-1.5">Preferred Standard Size</label>
                  <select
                    value={measurementForm.recommendedSize}
                    onChange={e => setMeasurementForm({ ...measurementForm, recommendedSize: e.target.value })}
                    className="w-full sm:w-48 text-xs p-2.5 bg-stone-50 border border-stone-300 rounded focus:border-noir-950 focus:outline-none font-medium"
                  >
                    <option value="XS">XS (FR 34 / US 2)</option>
                    <option value="S">S (FR 36 / US 4)</option>
                    <option value="M">M (FR 38 / US 6)</option>
                    <option value="L">L (FR 40 / US 8)</option>
                    <option value="XL">XL (FR 42 / US 10)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-noir-950 text-white text-xs uppercase tracking-luxury font-semibold rounded hover:bg-noir-900 transition-colors shadow-sm"
                  >
                    Update Silhouette Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-stone-200 text-center">
                  <Package className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-serif text-noir-950">No Acquisitions on Record</p>
                  <p className="text-xs text-stone-500 mt-1">Explore our current capsule to debut your personal collection.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-noir-950">{order.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {order.status}
                        </span>
                        <span className="text-xs text-stone-400">• {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="mt-2 space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-xs text-stone-700">
                            {item.quantity}× {item.name} <span className="text-stone-400">({item.size}, {item.color})</span>
                          </p>
                        ))}
                      </div>

                      <p className="text-xs font-serif font-bold text-noir-950 mt-2">
                        Total: {formatPrice(order.total)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={handleTrackOrder}
                        className="px-3 py-1.5 border border-stone-300 text-noir-950 hover:bg-stone-50 text-xs uppercase tracking-luxury rounded transition-colors flex items-center space-x-1"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Timeline</span>
                      </button>
                      <button
                        onClick={() => handleViewInvoice(order)}
                        className="px-3 py-1.5 bg-noir-950 text-white hover:bg-noir-900 text-xs uppercase tracking-luxury rounded transition-colors flex items-center space-x-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100/80 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Client Privilege ID: {userProfile?.id || 'MEL-VIP-GUEST'}</span>
          {userProfile ? (
            <button
              onClick={() => {
                signOut();
                setIsProfileOpen(false);
              }}
              className="text-stone-600 hover:text-rose-700 flex items-center space-x-1.5 font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsProfileOpen(false);
                setAuthMode('signin');
                setIsAuthOpen(true);
              }}
              className="px-3 py-1 bg-noir-950 text-white hover:bg-melly-600 rounded text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            >
              Sign In to VIP Portal
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
