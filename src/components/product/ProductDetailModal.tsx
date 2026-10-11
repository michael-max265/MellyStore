import React, { useState, useCallback } from 'react';
import { 
  X, 
  Heart, 
  Star, 
  ShoppingBag, 
  Ruler, 
  Check, 
  Truck, 
  RotateCcw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product, ProductColor } from '../../types';

interface ProductDetailContentProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product, onClose }) => {
  const selectedProduct = product;
  const { 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsSizeGuideOpen,
    products,
    addReview,
    setSelectedProduct,
    userProfile,
    setIsAuthOpen,
    setAuthMode,
    showToast
  } = useStore();

  const activeImageIdx = 0;
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[0]);
  const selectedColor: ProductColor = selectedProduct.colors[0];
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [bagAnimating, setBagAnimating] = useState(false);
  const [bagJustAdded, setBagJustAdded] = useState(false);

  // Zoom state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  // Review Form State
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    title: '',
    comment: '',
    fitFeedback: 'True to size' as 'True to size' | 'Runs slightly small' | 'Runs slightly large'
  });

  const inWishlist = isInWishlist(selectedProduct.id);

  // Complete The Look recommendation pairings
  const stylingPairings = products
    .filter(p => p.id !== selectedProduct.id && (p.category === 'accessories' || p.category === 'shoes' || p.category === 'outerwear'))
    .slice(0, 2);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author.trim() || !newReview.comment.trim()) return;
    addReview(selectedProduct.id, {
      author: newReview.author,
      rating: newReview.rating,
      title: newReview.title || 'Exceptional Studio Piece',
      comment: newReview.comment,
      fitFeedback: newReview.fitFeedback
    });
    setIsWritingReview(false);
    setNewReview({ author: '', rating: 5, title: '', comment: '', fitFeedback: 'True to size' });
  };

  const handleAddToCart = () => {
    if (!userProfile) {
      setAuthMode('signin');
      setIsAuthOpen(true);
      showToast('Account Required', 'Please sign in or create an account to start shopping.', 'info');
      return;
    }
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setBagAnimating(true);
    setBagJustAdded(true);
    setTimeout(() => setBagAnimating(false), 600);
    setTimeout(() => setBagJustAdded(false), 1600);
  };

  const handleWishlistToggle = useCallback(() => {
    setHeartAnimating(true);
    toggleWishlist(selectedProduct.id);
    setTimeout(() => setHeartAnimating(false), 600);
  }, [toggleWishlist, selectedProduct.id]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in" style={{ animationDuration: '0.25s' }}>
      
      {/* Background click to dismiss */}
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden z-10 border border-stone-200 max-h-[92vh] flex flex-col animate-elastic-in">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-noir-800 hover:text-noir-950 hover:bg-white transition-all shadow-sm"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-8 lg:p-10 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Primary Large Image with Interactive Studio Zoom Lens */}
              <div 
                className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-100 shadow-md cursor-crosshair group select-none"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
              >
                <div className="relative w-full h-full">
                  <img
                    src={activeImageIdx === 0 && selectedColor.image ? selectedColor.image : selectedProduct.images[activeImageIdx]}
                    alt={`${selectedProduct.name} in ${selectedColor.name}`}
                    style={{
                      transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                      transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                      transition: isZooming ? 'none' : 'transform 0.3s ease-out'
                    }}
                    className="w-full h-full object-cover object-top will-change-transform"
                  />

                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  {selectedProduct.isNew && (
                    <span className="bg-noir-950 text-white text-[10px] tracking-luxury uppercase font-semibold px-3 py-1 rounded">
                      New Season
                    </span>
                  )}
                  {selectedProduct.isBestSeller && (
                    <span className="bg-melly-600 text-white text-[10px] tracking-luxury uppercase font-semibold px-3 py-1 rounded">
                      Studio Favorite
                    </span>
                  )}
                </div>

                {/* Zoom Hint */}
                <div className="absolute bottom-3 right-3 bg-noir-950/70 backdrop-blur-md text-white text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity">
                  Hover to inspect fabric
                </div>
              </div>



            </div>

            {/* Right: Info & Purchase Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Breadcrumb / Category */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-melly-600">
                    MellyStore • {selectedProduct.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-noir-900">{selectedProduct.rating}</span>
                    <span className="text-xs text-stone-600 font-medium">({selectedProduct.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl sm:text-3xl text-noir-950 font-semibold mt-2">
                  {selectedProduct.name}
                </h1>
                
                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                  {selectedProduct.subtitle}
                </p>

                {/* Price — animated reveal */}
                <div className="flex items-baseline space-x-3 mt-4 animate-price-reveal">
                  <span className="font-serif text-2xl font-bold text-noir-950">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-stone-500 line-through font-normal">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded font-semibold animate-breathe">
                    Taxes Included
                  </span>
                </div>

                {/* Stock alert */}
                {selectedProduct.stockCount < 10 && (
                  <p className="text-xs text-amber-800 bg-amber-50/80 border border-amber-200/60 rounded px-3 py-1.5 mt-3 inline-flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                    <span>Only {selectedProduct.stockCount} pieces remaining in Studio inventory</span>
                  </p>
                )}

                <div className="my-6 border-t border-stone-200"></div>



                {/* Size Selector */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-noir-900">
                      Size: <span className="font-normal text-stone-600">{selectedSize}</span>
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-melly-700 hover:text-melly-900 font-medium flex items-center space-x-1 underline"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {selectedProduct.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-medium rounded border transition-all ${
                          selectedSize === size
                            ? 'bg-noir-950 text-white border-noir-950 shadow-sm'
                            : 'bg-white text-noir-800 border-stone-300 hover:border-noir-950'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & CTA Row */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    {/* Quantity selector */}
                    <div className="flex items-center border border-stone-300 rounded-md bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2.5 sm:py-3 text-sm text-stone-600 hover:text-noir-950"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-semibold text-noir-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2.5 sm:py-3 text-sm text-stone-600 hover:text-noir-950"
                      >
                        +
                      </button>
                    </div>

                    {/* Wishlist Heart on Mobile (inline with quantity) */}
                    <button
                      onClick={handleWishlistToggle}
                      className={`sm:hidden p-2.5 rounded-md border border-stone-300 hover:border-rose-400 bg-white text-noir-800 transition-all hover:scale-110 active:scale-90 ${
                        heartAnimating ? 'animate-heart-pop' : ''
                      }`}
                      aria-label="Wishlist toggle"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-300 ${
                          inWishlist
                            ? 'fill-rose-600 text-rose-600 drop-shadow-[0_0_8px_rgba(225,29,72,0.6)]'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Add to Bag Button — full width on mobile */}
                  {selectedProduct.inStock ? (
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 py-3.5 px-4 sm:px-6 text-white text-xs uppercase tracking-luxury font-medium rounded shadow-luxury hover:shadow-luxury-hover flex items-center justify-center space-x-2 transition-all active:scale-95 hover:scale-[1.02] cursor-pointer ${
                        bagJustAdded
                          ? 'bg-emerald-700 animate-cart-badge'
                          : `bg-noir-950 hover:bg-melly-900 ${bagAnimating ? 'animate-cart-badge' : ''}`
                      }`}
                      style={{ transition: 'background-color 0.3s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      {bagJustAdded ? (
                        <><Check className="w-4 h-4" /><span>Added to Bag!</span></>
                      ) : (
                        <><ShoppingBag className="w-4 h-4" /><span>Add To Bag • {formatPrice(selectedProduct.price * quantity)}</span></>
                      )}
                    </button>
                  ) : (
                    <div className="flex-1 py-3.5 px-6 bg-stone-200 text-stone-600 text-xs uppercase tracking-luxury font-semibold rounded text-center flex items-center justify-center shadow-xs">
                      Sold Out • Waitlist Priority
                    </div>
                  )}

                  {/* Wishlist Heart — desktop only */}
                  <button
                    onClick={handleWishlistToggle}
                    className={`hidden sm:block p-3.5 rounded-md border border-stone-300 hover:border-rose-400 bg-white text-noir-800 transition-all hover:scale-110 active:scale-90 ${
                      heartAnimating ? 'animate-heart-pop' : ''
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ${
                        inWishlist
                          ? 'fill-rose-600 text-rose-600 drop-shadow-[0_0_8px_rgba(225,29,72,0.6)]'
                          : ''
                      }`}
                    />
                  </button>

                </div>

                {/* Boutique Perks */}
                <div className="mt-6 pt-6 border-t border-stone-200 grid grid-cols-2 gap-4 text-[11px] text-stone-600">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-melly-700 shrink-0" />
                    <span>Complimentary express delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-melly-700 shrink-0" />
                    <span>30-day Studio return privilege</span>
                  </div>
                </div>

              </div>

              {/* Tabs / Accordion for Details & Care */}
              <div className="mt-8 border-t border-stone-200 pt-6">
                <div className="flex space-x-6 border-b border-stone-200 pb-2 text-xs uppercase tracking-wider font-bold">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 transition-colors relative ${
                      activeTab === 'details' ? 'text-noir-950 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-melly-700' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Details & Fit
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 transition-colors relative ${
                      activeTab === 'care' ? 'text-noir-950 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-melly-700' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Fabric & Care
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 transition-colors relative ${
                      activeTab === 'reviews' ? 'text-noir-950 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-melly-700' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Reviews ({selectedProduct.reviews?.length || 0})
                  </button>
                </div>

                <div className="pt-4 text-sm text-stone-700 leading-relaxed font-normal">
                  {activeTab === 'details' && (
                    <div className="space-y-3">
                      <p>{selectedProduct.description}</p>
                      <ul className="list-disc pl-4 space-y-1 text-noir-900 font-medium">
                        {selectedProduct.details.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'care' && (
                    <div className="space-y-3">
                      <p><span className="font-semibold text-noir-900">Composition:</span> {selectedProduct.composition}</p>
                      <div className="space-y-1">
                        <span className="font-semibold text-noir-900 block">Care Instructions:</span>
                        <ul className="list-disc pl-4 space-y-1">
                          {selectedProduct.careInstructions.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {/* Write Review Trigger / Form */}
                      {!isWritingReview ? (
                        <div className="flex justify-between items-center bg-[#F4EFEA] p-3 rounded-lg border border-stone-200">
                          <div>
                            <p className="font-semibold text-noir-900 text-xs">Own this Studio piece?</p>
                            <p className="text-[10px] text-stone-500">Share your styling and fit experience with the MellyStore community.</p>
                          </div>
                          <button
                            onClick={() => setIsWritingReview(true)}
                            className="px-3.5 py-1.5 bg-noir-950 hover:bg-melly-900 text-white rounded text-[11px] uppercase tracking-wider font-semibold transition-colors"
                          >
                            Write a Review
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-xl border border-stone-300 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-serif text-sm font-semibold text-noir-950">Studio Client Review</h5>
                            <button
                              type="button"
                              onClick={() => setIsWritingReview(false)}
                              className="text-stone-400 hover:text-noir-900 text-xs"
                            >
                              Cancel
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-600 mb-1">Your Name</label>
                              <input
                                type="text"
                                required
                                value={newReview.author}
                                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                                placeholder="e.g. Vivienne C."
                                className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded focus:border-noir-950 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-600 mb-1">Fit Feedback</label>
                              <select
                                value={newReview.fitFeedback}
                                onChange={(e) => setNewReview({ ...newReview, fitFeedback: e.target.value as any })}
                                className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded focus:border-noir-950 focus:outline-none"
                              >
                                <option value="True to size">True to size</option>
                                <option value="Runs slightly small">Runs slightly small</option>
                                <option value="Runs slightly large">Runs slightly large</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-600 mb-1">Star Rating</label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setNewReview({ ...newReview, rating: star })}
                                  className="p-1 focus:outline-none"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      star <= newReview.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-stone-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-600 mb-1">Review Title</label>
                            <input
                              type="text"
                              value={newReview.title}
                              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                              placeholder="e.g. Flawless silk drape and fit"
                              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded focus:border-noir-950 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-stone-600 mb-1">Your Comments</label>
                            <textarea
                              required
                              rows={3}
                              value={newReview.comment}
                              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              placeholder="Describe the fabric feel, length, and how you styled it..."
                              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded focus:border-noir-950 focus:outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-noir-950 text-white rounded text-xs uppercase tracking-luxury font-medium hover:bg-melly-900 transition-colors"
                          >
                            Submit Studio Review
                          </button>
                        </form>
                      )}

                      {/* Reviews List */}
                      {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                        selectedProduct.reviews.map(rev => (
                          <div key={rev.id} className="border-b border-stone-200/80 pb-3">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-noir-900">{rev.author}</span>
                              <span className="text-[10px] text-stone-400">{rev.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 my-1">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                              {rev.fitFeedback && (
                                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded ml-2 font-medium">
                                  Fit: {rev.fitFeedback}
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-noir-800 text-[11px]">{rev.title}</p>
                            <p className="text-stone-500 text-xs mt-0.5">{rev.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-400 italic">No reviews yet for this silhouette. Be the first to review!</p>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Complete The Look / Styling Pairings */}
              {stylingPairings.length > 0 && (
                <div className="mt-8 pt-6 border-t border-stone-200">
                  <span className="text-[10px] uppercase tracking-widest text-melly-700 font-semibold block mb-1">
                    Studio Styling Edit
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-noir-950 mb-3">
                    Pairs Elegantly With
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {stylingPairings.map((pair) => (
                      <div
                        key={pair.id}
                        className="bg-white p-2.5 rounded-lg border border-stone-200 flex items-center justify-between gap-2 shadow-xs group"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={pair.images[0]}
                            alt={pair.name}
                            className="w-10 h-12 object-cover rounded cursor-pointer group-hover:opacity-90"
                            onClick={() => setSelectedProduct(pair)}
                          />
                          <div>
                            <p 
                              onClick={() => setSelectedProduct(pair)}
                              className="font-serif text-[11px] font-medium text-noir-900 line-clamp-1 cursor-pointer hover:text-melly-800"
                            >
                              {pair.name}
                            </p>
                            <p className="text-[10px] font-semibold text-noir-800">{formatPrice(pair.price)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(pair, pair.sizes[0], pair.colors[0], 1)}
                          title="Add Pair to Bag"
                          className="p-1.5 bg-stone-100 hover:bg-noir-950 hover:text-white rounded text-stone-700 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useStore();

  if (!selectedProduct) return null;

  return (
    <ProductDetailContent
      key={selectedProduct.id}
      product={selectedProduct}
      onClose={() => setSelectedProduct(null)}
    />
  );
};
