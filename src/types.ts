export type ProductCategory = 'Audio' | 'Horology' | 'Fragrance' | 'Ceramics' | 'Apparel' | 'Living';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  attributes: Record<string, string>;
  tags: string[];
  isFeatured?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedAttributes?: Record<string, string>;
}

export type OrderStatus = 'processing' | 'packed' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'cod';
export type PaymentStatus = 'paid' | 'pending_cod' | 'refunded';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface CourierLocation {
  lat: number;
  lng: number;
  address: string;
  courierName: string;
  vehicleType: string;
  estimatedMinutesAway: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  date: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  estimatedDelivery: string;
  carrier: string;
  trackingTimeline: TrackingStep[];
  currentLocation?: CourierLocation;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'shipping' | 'inventory' | 'promotion';
  read: boolean;
  orderId?: string;
}

export interface StoreAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  lowStockCount: number;
  conversionRate: number;
  recentSales: { date: string; amount: number; orders: number }[];
  topProducts: { id: string; name: string; sold: number; revenue: number }[];
  categoryShare: { category: string; percentage: number; amount: number }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: {
    id: string;
    label: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
}
