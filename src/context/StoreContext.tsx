import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, Order, NotificationItem, User, OrderStatus, ProductCategory } from '../types';

interface StoreContextType {
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;
  
  // Orders & Tracking
  orders: Order[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<boolean>;
  
  // Notifications & Push
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationsAsRead: (id?: string) => Promise<void>;
  triggerNotification: (title: string, message: string, type?: NotificationItem['type'], orderId?: string) => Promise<void>;
  pushPermission: NotificationPermission;
  requestPushPermission: () => Promise<void>;
  activeToast: NotificationItem | null;
  dismissToast: () => void;
  
  // User & Auth
  currentUser: User;
  switchUserRole: (role: 'customer' | 'admin') => Promise<void>;
  
  // Modals & Navigation Views
  activeView: 'store' | 'tracking' | 'admin';
  setActiveView: (view: 'store' | 'tracking' | 'admin') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  // Inventory actions
  updateInventoryStock: (productId: string, newStock: number) => Promise<boolean>;
  addNewProduct: (productData: Partial<Product>) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-1',
    name: 'Nasrullah Hasib',
    email: 'nasrullahhasib27@gmail.com',
    role: 'customer',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home (Default)',
        address: '742 Evergreen Promenade, Suite 4B',
        city: 'San Francisco',
        postalCode: '94107',
        country: 'United States',
        isDefault: true
      }
    ]
  });

  const [activeView, setActiveView] = useState<'store' | 'tracking' | 'admin'>('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Initial load
  const loadProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        setActiveTrackingOrder(prev => {
          if (!prev && data.orders.length > 0) {
            const inProgress = data.orders.find((o: Order) => o.status !== 'delivered') || data.orders[0];
            return inProgress;
          }
          if (prev) {
            const updated = data.orders.find((o: Order) => o.id === prev.id);
            if (updated && (updated.status !== prev.status || updated.trackingTimeline.length !== prev.trackingTimeline.length)) {
              return updated;
            }
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    refreshOrders();
    loadNotifications();

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        setPushPermission(Notification.permission);
      } catch {
        // Silently ignore in restricted iframes
      }
    }
  }, [loadProducts, refreshOrders, loadNotifications]);

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === 'granted') {
          triggerNotification('Push Notifications Active', 'You will receive real-time updates on your deliveries and exclusive drops.');
        }
      } catch (err) {
        console.warn('Push permission unavailable in iframe', err);
      }
    }
  };

  const triggerNotification = async (title: string, message: string, type: NotificationItem['type'] = 'promotion', orderId?: string) => {
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type, orderId })
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => [data.notification, ...prev]);
        setActiveToast(data.notification);
        
        // Browser notification if permitted and in non-restricted context
        if (typeof window !== 'undefined' && 'Notification' in window) {
          try {
            if (Notification.permission === 'granted') {
              new Notification(title, {
                body: message,
                icon: '/favicon.ico'
              });
            }
          } catch {
            // Silently fallback to in-app toast
          }
        }
      }
    } catch (err) {
      console.error('Failed to send notification', err);
    }
  };

  const dismissToast = () => setActiveToast(null);

  const markNotificationsAsRead = async (id?: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setNotifications(prev => prev.map(n => (!id || n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Status Updater
  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
      });
      const data = await res.json();
      if (data.success) {
        await refreshOrders();
        await loadNotifications();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update status', err);
      return false;
    }
  };

  // Inventory actions
  const updateInventoryStock = async (productId: string, newStock: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/inventory/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => (p.id === productId ? { ...p, stock: newStock } : p)));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update stock', err);
      return false;
    }
  };

  const addNewProduct = async (productData: Partial<Product>): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => [data.product, ...prev]);
        triggerNotification('Product Published', `New catalog entry "${data.product.name}" is now live.`, 'inventory');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add product', err);
      return false;
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete product', err);
      return false;
    }
  };

  const switchUserRole = async (role: 'customer' | 'admin') => {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        if (role === 'admin') {
          setActiveView('admin');
        } else {
          setActiveView('store');
        }
      }
    } catch (err) {
      console.error('Failed to switch role', err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        refreshOrders,
        updateOrderStatus,
        notifications,
        unreadNotificationsCount: notifications.filter(n => !n.read).length,
        markNotificationsAsRead,
        triggerNotification,
        pushPermission,
        requestPushPermission,
        activeToast,
        dismissToast,
        currentUser,
        switchUserRole,
        activeView,
        setActiveView,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        quickViewProduct,
        setQuickViewProduct,
        updateInventoryStock,
        addNewProduct,
        deleteProduct
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
