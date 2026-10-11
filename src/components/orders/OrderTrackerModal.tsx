import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Home, Package, ShieldCheck, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Order } from '../../types';

export const OrderTrackerModal: React.FC = () => {
  const { isTrackerOpen, setIsTrackerOpen, orders, formatPrice, setIsInvoiceOpen, setActiveInvoiceOrder } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(orders[0] || null);
  const [searchError, setSearchError] = useState(false);

  if (!isTrackerOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(false);
    const term = searchTerm.trim().toUpperCase();
    if (!term) return;

    const found = orders.find(
      o => o.orderNumber.toUpperCase() === term || 
           o.trackingNumber.toUpperCase() === term || 
           o.customer.email.toUpperCase() === term
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchError(true);
    }
  };

  const getStepStatus = (stepName: 'confirmed' | 'preparing' | 'shipped' | 'delivered', currentStatus: Order['status']) => {
    const sequence = ['Confirmed', 'Preparing', 'Shipped', 'Delivered'];
    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(
      stepName === 'confirmed' ? 'Confirmed' : 
      stepName === 'preparing' ? 'Preparing' : 
      stepName === 'shipped' ? 'Shipped' : 'Delivered'
    );

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  const currentOrder = searchedOrder || orders[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsTrackerOpen(false)} 
      />

      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden z-10 border border-stone-200 p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center space-x-2.5">
            <Package className="w-5 h-5 text-melly-700" />
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-noir-950 font-normal">
                Track Your Studio Consignment
              </h3>
              <p className="text-xs text-stone-500 font-light">
                Monitor your garment's journey from our MellyStore Studio to your residence.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTrackerOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-noir-950 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Order # (e.g. MEL-98412) or Tracking Code"
              className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-noir-950 uppercase text-noir-900"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-noir-950 hover:bg-melly-900 text-white text-xs uppercase tracking-luxury font-medium rounded-lg transition-colors"
          >
            Track
          </button>
        </form>

        {searchError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 mb-4">
            Consignment reference not found. Try searching with reference <strong>MEL-98412</strong>.
          </div>
        )}

        {currentOrder ? (
          <div className="space-y-6">
            
            {/* Reference Header Card */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Order Reference</span>
                <span className="font-serif text-lg font-bold text-noir-950">{currentOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Consignment Code</span>
                <span className="font-mono text-xs font-semibold text-melly-800">{currentOrder.trackingNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Status</span>
                <span className="inline-block px-2.5 py-1 bg-melly-100 text-melly-900 rounded-full text-xs font-semibold">
                  {currentOrder.status}
                </span>
              </div>
            </div>

            {/* Visual Timeline Steps */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <h4 className="font-serif text-sm font-semibold text-noir-900 uppercase tracking-wider mb-6">
                Delivery Progression
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                
                {/* Step 1: Confirmed */}
                <div className="relative">
                  <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    getStepStatus('confirmed', currentOrder.status) === 'completed' || getStepStatus('confirmed', currentOrder.status) === 'current'
                      ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-500'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-semibold text-noir-900">Order Placed & Verified</h5>
                    <p className="text-[11px] text-stone-500 font-light mt-0.5">Payment authorized and sent to Studio dispatch.</p>
                  </div>
                </div>

                {/* Step 2: Preparing */}
                <div className="relative">
                  <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    getStepStatus('preparing', currentOrder.status) === 'completed'
                      ? 'bg-emerald-600 text-white' 
                      : getStepStatus('preparing', currentOrder.status) === 'current'
                      ? 'bg-melly-700 text-white ring-4 ring-melly-100'
                      : 'bg-stone-200 text-stone-500'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-semibold text-noir-900">Studio Quality Inspection & Boxing</h5>
                    <p className="text-[11px] text-stone-500 font-light mt-0.5">Garment steamed, checked by master tailor, and encased in champagne box.</p>
                  </div>
                </div>

                {/* Step 3: Shipped */}
                <div className="relative">
                  <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    getStepStatus('shipped', currentOrder.status) === 'completed'
                      ? 'bg-emerald-600 text-white' 
                      : getStepStatus('shipped', currentOrder.status) === 'current'
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-stone-200 text-stone-500'
                  }`}>
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-semibold text-noir-900">White-Glove Courier in Transit</h5>
                    <p className="text-[11px] text-stone-500 font-light mt-0.5">Insured international express carriage with signature confirmation.</p>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className="relative">
                  <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    getStepStatus('delivered', currentOrder.status) === 'completed'
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-stone-200 text-stone-500'
                  }`}>
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-semibold text-noir-900">Delivered to Doorstep</h5>
                    <p className="text-[11px] text-stone-500 font-light mt-0.5">Destination: {currentOrder.customer.address}, {currentOrder.customer.city}, {currentOrder.customer.country}.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Items inside parcel & Invoice Action */}
            <div className="bg-[#F4EFEA] p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-melly-700" />
                <span className="text-stone-700">Client: <strong>{currentOrder.customer.fullName}</strong> ({currentOrder.items.length} garments)</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-noir-900">{formatPrice(currentOrder.total)}</span>
                <button
                  onClick={() => {
                    setActiveInvoiceOrder(currentOrder);
                    setIsInvoiceOpen(true);
                  }}
                  className="px-3 py-1 bg-noir-950 hover:bg-noir-900 text-white rounded text-[11px] uppercase tracking-luxury flex items-center space-x-1 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <p className="text-center text-xs text-stone-500 py-8">No order loaded yet.</p>
        )}

      </div>
    </div>
  );
};
