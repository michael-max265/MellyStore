import React, { useState } from 'react';
import { 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { LegalModal } from '../common/LegalModal';

export const Footer: React.FC = () => {
  const { 
    setIsAdminOpen, 
    setIsSizeGuideOpen, 
    setIsTrackerOpen, 
    setIsConciergeOpen, 
    showToast 
  } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'about' | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    showToast('Welcome to MellyStore VIP', 'Enjoy 10% off with promo code: MELLY10');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-noir-950 text-white/80 pt-16 pb-12 border-t border-noir-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & VIP Section */}
        <div className="border-b border-noir-800/80 pb-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-semibold flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                <span>MellyStore VIP</span>
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Join our VIP Collector’s Circle
              </h3>
              <p className="text-xs text-stone-400 font-light max-w-md leading-relaxed">
                Receive private invitations to preview limited capsule collections, runway presentations, and complimentary white-glove courier on your debut order.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="bg-noir-900 border border-stone-700 p-4 rounded-xl text-center space-y-1">
                  <p className="text-stone-200 font-serif text-sm">Welcome to MellyStore VIP</p>
                  <p className="text-xs text-stone-300">Use code <strong className="text-white bg-noir-800 px-2 py-0.5 rounded font-mono">MELLY10</strong> at checkout for 10% off.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5 stroke-[1.5]" />
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your private email address"
                      className="w-full text-xs pl-10 pr-4 py-3.5 bg-noir-900 border border-noir-800 rounded-md text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400 font-light"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-stone-100 hover:bg-white text-noir-950 text-xs uppercase tracking-luxury font-semibold rounded-md transition-colors flex items-center justify-center space-x-2 shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 text-xs font-normal text-stone-300">
          
          {/* Col 1: Brand Info & Physical Studios */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl tracking-[0.16em] font-semibold text-white block">
              MELLY<span className="text-stone-300 font-light">STORE</span>
            </span>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Contemporary female luxury Studio delivering natural mulberry silks, Mongolian cashmere knitwear, and architectural tailoring for the modern muse.
            </p>

            {/* Studio Flagship Locations */}
            <div className="pt-2 space-y-2 text-xs text-stone-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5 stroke-[1.5]" />
                <span><strong className="text-white">MellyStore Studio:</strong> Victoria Island, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-stone-400 shrink-0 stroke-[1.5]" />
                <span><strong className="text-white">Client Care Desk:</strong> 08166612115</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0 stroke-[1.5]" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM WAT</span>
              </div>
            </div>

            {/* Social & Concierge Desk Links */}
            <div className="flex items-center space-x-4 pt-2">
              <a href="https://instagram.com/mellystorelagos" className="text-stone-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://facebook.com/mellystorelagos" className="text-stone-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/2348166612115?text=Hello%20MellyStore%20I%20would%20like%20a%20styling%20consultation" 
                target="_blank" 
                rel="noreferrer"
                className="text-stone-400 hover:text-emerald-400 transition-colors flex items-center space-x-1"
                title="Boutique Concierge WhatsApp"
              >
                <MessageCircle className="w-4 h-4 stroke-[1.5]" />
                <span className="text-[11px]">WhatsApp Advisory</span>
              </a>
            </div>
          </div>

          {/* Col 2: The Collections */}
          <div className="space-y-3">
            <h4 className="text-white text-xs uppercase tracking-luxury font-semibold">Collections</h4>
            <ul className="space-y-2">
              <li><a href="#catalog-section" className="hover:text-white transition-colors">Silk Slip Dresses</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition-colors">Cashmere Co-Ords</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition-colors">Italian Tailored Blazers</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition-colors">Organza Evening Gowns</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition-colors">Hand-Woven Calfskin Bags</a></li>
            </ul>
          </div>

          {/* Col 3: Client Services */}
          <div className="space-y-3">
            <h4 className="text-white text-xs uppercase tracking-luxury font-semibold">Client Care</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white transition-colors text-left">
                  Size & Fitting Guide
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">White-Glove Courier</a></li>
              <li><a href="#" className="hover:text-white transition-colors">30-Day Studio Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Garment Silk Care Protocol</a></li>
              <li>
                <button 
                  onClick={() => setIsTrackerOpen(true)} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Track Your Consignment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Boutique Studio */}
          <div className="space-y-3">
            <h4 className="text-white text-xs uppercase tracking-luxury font-semibold">Studio</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setLegalModalType('about')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Our Lagos Heritage
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Grade-6A Silk Standard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLegalModalType('terms')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Sustainable Traceability
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsConciergeOpen(true)} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Private Stylist Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-stone-400 hover:text-white transition-colors flex items-center space-x-1 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400 stroke-[1.5]" />
                  <span>Store Owner Portal</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Payment Methods & Accreditations */}
        <div className="pt-6 pb-6 border-t border-noir-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-stone-400 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Secure Payment:</span>
            <div className="flex items-center space-x-2 font-mono text-[10px] text-stone-400">
              <span className="px-2 py-1 bg-noir-900 border border-stone-800 rounded font-semibold text-white">VISA</span>
              <span className="px-2 py-1 bg-noir-900 border border-stone-800 rounded font-semibold text-white">MASTERCARD</span>
              <span className="px-2 py-1 bg-noir-900 border border-stone-800 rounded font-semibold text-white">AMEX</span>
              <span className="px-2 py-1 bg-noir-900 border border-stone-800 rounded font-semibold text-white">APPLE PAY</span>
              <span className="px-2 py-1 bg-noir-900 border border-stone-800 rounded font-semibold text-white">KLARNA</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-stone-400 font-light">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-300 stroke-[1.5]" />
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span>•</span>
            <span>Insured Courier</span>
            <span>•</span>
            <span>Lagos, Nigeria</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 border-t border-noir-800/50 text-[11px] text-stone-500 font-light text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} MellyStore Luxury Boutique Ltd. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <button 
              onClick={() => setLegalModalType('privacy')} 
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setLegalModalType('terms')} 
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setLegalModalType('about')} 
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Founder & Story
            </button>
          </div>
        </div>

      </div>

      {/* Legal & Brand Modals */}
      <LegalModal
        isOpen={legalModalType !== null}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || 'privacy'}
      />
    </footer>
  );
};
