import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryHighlights } from './components/home/CategoryHighlights';
import { LookbookSection } from './components/home/LookbookSection';
import { BrandValues } from './components/home/BrandValues';
import { FilterSidebar } from './components/product/FilterSidebar';
import { ProductGrid } from './components/product/ProductGrid';
import { RecentlyViewed } from './components/product/RecentlyViewed';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { SizeGuideModal } from './components/product/SizeGuideModal';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { OrderTrackerModal } from './components/orders/OrderTrackerModal';
import { InvoiceModal } from './components/orders/InvoiceModal';
import { CustomerProfileModal } from './components/profile/CustomerProfileModal';
import { AuthModal } from './components/auth/AuthModal';
import { ConciergeChatModal } from './components/concierge/ConciergeChatModal';
import { ToastContainer } from './components/common/ToastContainer';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { MessageCircle } from 'lucide-react';

const MainBoutique: React.FC = () => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { setIsConciergeOpen } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] font-sans antialiased text-noir-900 selection:bg-melly-200">
      
      {/* Top Announcements & Currency Bar */}
      <AnnouncementBar />

      {/* Main Luxury Navigation */}
      <Navbar onToggleFilters={() => setIsMobileFiltersOpen(true)} />

      <main className="flex-1">
        {/* Editorial Hero Banner */}
        <HeroBanner />

        {/* Visual Category Highlights Grid */}
        <CategoryHighlights />

        {/* Curated Outfit Lookbook ("Shop The Look") */}
        <LookbookSection />

        {/* Main Product Catalog Section */}
        <section id="catalog-section" className="py-16 md:py-24 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Catalog Section Heading */}
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-melly-600 block mb-2">
                Curated Luxury Silhouettes
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-noir-950 font-normal">
                The MellyStore Collection
              </h2>
              <p className="text-sm sm:text-base text-stone-700 font-normal mt-2 leading-relaxed">
                Discover silhouettes tailored from the finest natural mulberry silks, cashmeres, and virgin wools.
              </p>
            </div>

            {/* Catalog Layout: Sidebar Filters + Products Grid */}
            <div className="flex gap-8 items-start">
              <FilterSidebar 
                isOpenMobile={isMobileFiltersOpen} 
                onCloseMobile={() => setIsMobileFiltersOpen(false)} 
              />
              <ProductGrid 
                onOpenMobileFilters={() => setIsMobileFiltersOpen(true)} 
              />
            </div>

          </div>
        </section>

        {/* Recently Viewed Silhouettes Fitting History */}
        <RecentlyViewed />

        {/* Boutique Core Hallmarks & Natural Fiber Standards */}
        <BrandValues />
      </main>

      {/* Boutique Editorial Footer */}
      <Footer />

      {/* Floating Studio Advisory Desk */}
      <button
        onClick={() => setIsConciergeOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-6 z-30 bg-white/95 text-noir-950 hover:bg-noir-950 hover:text-white border border-stone-300 shadow-luxury hover:shadow-xl px-4 py-2.5 rounded-full flex items-center space-x-2.5 transition-all duration-300 text-[11px] uppercase tracking-luxury font-medium group backdrop-blur-md cursor-pointer"
        title="Private Client Stylist & Fitting Desk"
      >
        <MessageCircle className="w-4 h-4 text-stone-700 group-hover:text-white transition-colors stroke-[1.5]" />
        <span className="hidden sm:inline">Studio Client Stylist</span>
      </button>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomBar />

      {/* Interactive Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <SizeGuideModal />
      <CheckoutModal />
      <AdminDashboardModal />
      <OrderTrackerModal />
      <InvoiceModal />
      <CustomerProfileModal />
      <AuthModal />
      <ConciergeChatModal />
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainBoutique />
    </StoreProvider>
  );
}
