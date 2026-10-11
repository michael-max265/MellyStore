import React from 'react';
import { X, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const InvoiceModal: React.FC = () => {
  const { 
    isInvoiceOpen, 
    setIsInvoiceOpen, 
    activeInvoiceOrder, 
    orders,
    formatPrice 
  } = useStore();

  const order = activeInvoiceOrder || orders[0];

  if (!isInvoiceOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in print:p-0 print:bg-white">
      <div 
        className="fixed inset-0 print:hidden" 
        onClick={() => setIsInvoiceOpen(false)} 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-stone-200 p-6 sm:p-10 text-noir-950 flex flex-col print:shadow-none print:border-none print:rounded-none">
        
        {/* Action Bar (Hidden on print) */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6 print:hidden">
          <div className="flex items-center space-x-2 text-stone-500 text-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="uppercase tracking-luxury font-medium">Official Studio Acquisition Receipt</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-noir-950 hover:bg-noir-900 text-white text-xs uppercase tracking-luxury font-medium rounded flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setIsInvoiceOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Letterhead */}
        <div className="flex justify-between items-start pb-6 border-b border-stone-200">
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-noir-950">MellyStore</h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mt-0.5">Luxury Fashion Studio</p>
            <p className="text-xs text-stone-600 mt-2">
              Victoria Island, Lagos<br />
              Nigeria<br />
              studio@mellystore.com
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-stone-100 border border-stone-200 text-noir-950 font-mono text-xs font-bold rounded">
              {order.orderNumber}
            </span>
            <p className="text-xs text-stone-500 mt-2">Date: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-xs text-stone-500">Tracking: <span className="font-mono">{order.trackingNumber}</span></p>
          </div>
        </div>

        {/* Client & Shipping Details */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-stone-200 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">Billed & Delivered To</span>
            <p className="font-semibold text-noir-950">{order.customer.fullName}</p>
            <p className="text-stone-600">{order.customer.address} {order.customer.apartment}</p>
            <p className="text-stone-600">{order.customer.city}, {order.customer.state} {order.customer.postalCode}</p>
            <p className="text-stone-600">{order.customer.country}</p>
            <p className="text-stone-500 mt-1">{order.customer.email}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">Dispatch Protocol</span>
            <p className="font-semibold text-noir-950">{order.shippingMethod.name}</p>
            <p className="text-stone-600">Estimated transit: {order.shippingMethod.estimatedDays}</p>
            <p className="text-stone-600 mt-2 uppercase font-medium">Payment: {order.paymentMethod.replace('_', ' ')}</p>
            <p className="text-emerald-700 font-semibold mt-1">Status: Paid in Full</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6 border-b border-stone-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-[10px] uppercase tracking-wider text-stone-400">
                <th className="text-left py-2">Item Silhouette</th>
                <th className="text-center py-2">Size</th>
                <th className="text-center py-2">Shade</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map((item, i) => (
                <tr key={i} className="py-2.5">
                  <td className="py-2.5 text-left font-medium text-noir-950">{item.name}</td>
                  <td className="py-2.5 text-center text-stone-600">{item.size}</td>
                  <td className="py-2.5 text-center text-stone-600">{item.color}</td>
                  <td className="py-2.5 text-center text-stone-600">{item.quantity}</td>
                  <td className="py-2.5 text-right text-stone-600">{formatPrice(item.price)}</td>
                  <td className="py-2.5 text-right font-medium text-noir-950">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="py-6 border-b border-stone-200 flex justify-end">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Privilege Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>White-Glove Shipping</span>
              <span>{order.shippingMethod.cost === 0 ? 'Complimentary' : formatPrice(order.shippingMethod.cost)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>VAT / Customs Duties</span>
              <span className="text-stone-400">Included</span>
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between font-serif text-base font-bold text-noir-950">
              <span>Total Settled</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Provenance Stamp */}
        <div className="pt-6 flex items-center justify-between text-stone-500 text-[11px]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Guaranteed Authentic MellyStore Natural Fiber Capsule</span>
          </div>
          <span className="italic">Lagos, Nigeria</span>
        </div>

      </div>
    </div>
  );
};
