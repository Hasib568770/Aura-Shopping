/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { StorefrontView } from './components/StorefrontView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductModal } from './components/ProductModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ToastAlert } from './components/ToastAlert';
import { Footer } from './components/Footer';
import type { Product } from './types';

function AppContent() {
  const {
    activeView,
    quickViewProduct,
    setQuickViewProduct,
    isCheckoutOpen,
    setIsCheckoutOpen
  } = useStore();

  const [directCheckoutItem, setDirectCheckoutItem] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);

  const handleOpenDirectCheckout = (product: Product, quantity: number) => {
    setDirectCheckoutItem({ product, quantity });
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setDirectCheckoutItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Top Bar Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'store' && (
          <StorefrontView onQuickView={(p) => setQuickViewProduct(p)} />
        )}

        {activeView === 'tracking' && (
          <OrderTrackingView />
        )}

        {activeView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Overlays & Modals */}
      <CartDrawer />

      {isCheckoutOpen && (
        <CheckoutModal
          directItem={directCheckoutItem}
          onClose={handleCloseCheckout}
        />
      )}

      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onDirectCheckout={handleOpenDirectCheckout}
        />
      )}

      <NotificationDrawer />
      <ToastAlert />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
