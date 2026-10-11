export type ProductCategory = 
  | 'all'
  | 'dresses'
  | 'co-ords'
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'evening'
  | 'accessories'
  | 'shoes';

export interface ProductColor {
  name: string;
  hex: string;
  bgClass?: string;
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  fitFeedback?: 'True to size' | 'Runs slightly small' | 'Runs slightly large';
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number; // Base USD
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  details: string[];
  composition: string;
  careInstructions: string[];
  sizes: string[];
  colors: ProductColor[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  reviews?: Review[];
}

export interface CartItem {
  id: string; // unique item composite key: `${product.id}-${size}-${color}`
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // conversion from USD
  locale: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCodeApplied?: string;
  shippingMethod: {
    id: string;
    name: string;
    cost: number;
    estimatedDays: string;
  };
  tax: number;
  total: number;
  currency: CurrencyCode;
  paymentMethod: 'card' | 'apple_pay' | 'klarna' | 'bank_transfer' | 'delivery';
  status: 'Confirmed' | 'Preparing' | 'Shipped' | 'Delivered';
  trackingNumber: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tier: 'VIP Classic' | 'VIP Gold' | 'VIP Diamond';
  points: number;
  measurements: {
    bust: string;
    waist: string;
    hips: string;
    height: string;
    recommendedSize: string;
  };
  address: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface FilterState {
  category: ProductCategory;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  selectedSizes: string[];
  selectedColors: string[];
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  inStockOnly: boolean;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'fr-FR' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, locale: 'en-GB' },
  NGN: { code: 'NGN', symbol: '₦', rate: 1550, locale: 'en-NG' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.36, locale: 'en-CA' }
};
