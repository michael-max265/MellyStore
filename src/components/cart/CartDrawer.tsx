import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    freeShippingThreshold, 
    freeShippingRemaining, 
    formatPrice,
    setIsCheckoutOpen,
    showToast
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (code === 'MELLY10') {
      setAppliedPromo({ code: 'MELLY10', percent: 10 });
      showToast('Promo Code Applied', '10% discount deducted from order.');
      setPromoInput('');
    } else if (code === 'VIP20') {
      setAppliedPromo({ code: 'VIP20', percent: 20 });
      showToast('VIP Code Applied', '20% boutique discount applied.');
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try "MELLY10"');
    }
  };

  const discountAmount = appliedPromo ? (cartTotal * appliedPromo.percent) / 100 : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const shippingPercentage = Math.min(100, Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-backdrop-fade"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-stone-200 animate-drawer-slide">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-noir-900" />
              <h2 className="font-serif text-lg text-noir-950 font-normal">
                Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-noir-950 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#F4EFEA] px-6 py-3 border-b border-stone-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {freeShippingRemaining > 0 ? (
                <span className="text-stone-700 font-light">
                  Add <span className="font-semibold text-noir-950">{formatPrice(freeShippingRemaining)}</span> more for Complimentary Express Shipping
                </span>
              ) : (
                <span className="text-emerald-800 font-medium flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[1.5]" />
                  <span>Complimentary White-Glove Shipping Unlocked</span>
                </span>
              )}
              <span className="text-[10px] font-semibold text-stone-500">{shippingPercentage}%</span>
            </div>
            <div className="w-full bg-stone-300 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-melly-700 h-full transition-all duration-500 rounded-full"
                style={{ width: `${shippingPercentage}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item, itemIdx) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 p-3 bg-white rounded-xl border border-stone-200/80 shadow-sm animate-slide-up hover:-translate-y-0.5 transition-transform duration-300"
                  style={{ animationDelay: `${itemIdx * 0.06}s` }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-md shrink-0 bg-stone-100"
                  />
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-sm text-noir-950 font-normal leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                        <span>Size: <strong className="text-noir-800">{item.size}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          <span>{item.color.name}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                      {/* Quantity adjuster */}
                      <div className="flex items-center border border-stone-200 rounded text-xs bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-noir-900"
                        >
                          -
                        </button>
                        <span className="px-2 font-semibold text-noir-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-noir-900"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-semibold text-xs text-noir-950">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-serif text-lg text-noir-900">Your bag is empty</p>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Discover our latest Studio collection and elevate your wardrobe.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-noir-950 text-white text-xs uppercase tracking-luxury font-medium rounded hover:bg-melly-900 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer / Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-stone-200 space-y-4">
              
              {/* Promo Code Form */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded text-xs text-emerald-800">
                    <span className="flex items-center space-x-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code} ({appliedPromo.percent}% OFF)</span>
                    </span>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="text-stone-400 hover:text-stone-700 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promo code (e.g. MELLY10)"
                        className="w-full text-xs pl-8 pr-3 py-2 bg-[#FAF8F5] border border-stone-200 rounded focus:outline-none focus:border-noir-950 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-stone-300 hover:border-noir-950 text-noir-900 text-xs uppercase tracking-wider font-semibold rounded"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{promoError}</span>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-noir-950 font-medium">{formatPrice(cartTotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedPromo.percent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{freeShippingRemaining === 0 ? 'Complimentary' : 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-sm text-noir-950 font-semibold border-t border-stone-200 pt-2">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-noir-950 hover:bg-melly-900 text-white text-xs uppercase tracking-luxury font-medium rounded shadow-luxury hover:shadow-luxury-hover flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] animate-glow-pulse cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-stone-400">
                Guaranteed safe checkout with 256-Bit SSL Encryption.
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
