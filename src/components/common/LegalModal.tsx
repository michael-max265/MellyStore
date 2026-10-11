import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'about';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden z-10 border border-stone-200 flex flex-col max-h-[85vh]">
        
        {/* Header Hero */}
        <div className="bg-noir-950 p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] uppercase tracking-[0.25em] text-champagne-300 font-semibold block mb-1">
            MellyStore Lagos Studio
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            {type === 'privacy' && 'Privacy Policy & Data Protection'}
            {type === 'terms' && 'Terms of Service & Studio Protocol'}
            {type === 'about' && 'The MellyStore Lagos Heritage'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Official Boutique Documentation • Effective 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-stone-700 leading-relaxed font-normal">
          {type === 'privacy' && (
            <>
              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">1. Commitment to Client Confidentiality</h4>
                <p>
                  At MellyStore, client discretion is sacred. Whether you acquire bespoke silks online or receive private fitting concierge in our Victoria Island Studio, your contact details, sizing measurements, and transaction logs are encrypted using 256-bit SSL protocols.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">2. Information We Collect</h4>
                <p>
                  We collect strictly necessary data to fulfill your orders and fitting preferences: your name, contact telephone, delivery address, sizing measurements, and order history. We never sell or distribute your private client information to advertising brokerages.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">3. Secure Payment Gateway Protocol</h4>
                <p>
                  Card data is tokenized through PCI-DSS Level 1 certified gateways. MellyStore does not retain or store raw CVV codes or payment authorization credentials on boutique servers.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">4. Contacting the Data Protection Officer</h4>
                <p>
                  For data access, correction, or deletion requests, contact our Victoria Island Client Care Desk directly at <span className="font-mono font-medium text-noir-950">08166612115</span> or via our Studio Concierge desk.
                </p>
              </section>
            </>
          )}

          {type === 'terms' && (
            <>
              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">1. Boutique Standard & Authenticity</h4>
                <p>
                  Every garment bearing the MellyStore label is individually inspected for seam integrity and fabric grade prior to dispatch. Silks are certified Grade-6A pure mulberry natural fibers, and knitwear is certified Grade-A Mongolian cashmere.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">2. Shipping, Courier & Delivery</h4>
                <p>
                  Complimentary White-Glove dispatch is standard for orders in Lagos (same-day or next-day courier). Nationwide Nigerian deliveries are fulfilled within 2–4 business days via insured express couriers.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">3. 30-Day Studio Exchanges & Returns</h4>
                <p>
                  Garments in unworn condition with original silk care tags intact are eligible for complimentary exchange or store credit within 30 days of arrival. Bespoke couture pieces altered to custom measurements are final sale.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">4. Governing Law</h4>
                <p>
                  These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
                </p>
              </section>
            </>
          )}

          {type === 'about' && (
            <>
              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">Born in Lagos, Tailored for the World</h4>
                <p>
                  Founded by a Nigerian visionary woman and creative director, MellyStore was conceived to bridge authentic African luxury sensibilities with timeless architectural elegance.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">The Noble Fiber Philosophy</h4>
                <p>
                  We reject synthetic fast fashion. Every silhouette in our collection is crafted exclusively from certified 22-momme pure mulberry silks, Mongolian cashmere, European flax linens, and virgin wools that breathe effortlessly and drape with natural majesty.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-noir-950 uppercase tracking-wider">Victoria Island Flagship & Studio</h4>
                <p>
                  Our client fitting studio is situated in Victoria Island, Lagos. For private styling consultations and bespoke fittings, reach out to our client concierge team at <span className="font-mono font-medium text-noir-950">08166612115</span>.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>MellyStore Official Studio Registry</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-noir-950 hover:bg-melly-900 text-white uppercase tracking-wider font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
