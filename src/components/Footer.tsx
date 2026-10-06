import React from 'react';
import { Shield, Truck, RotateCcw, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveView, switchUserRole, currentUser } = useStore();

  return (
    <footer className="bg-white border-t border-zinc-200 mt-20 text-zinc-600">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/80 text-zinc-900">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-zinc-900">Complimentary Priority Delivery</div>
            <div className="text-zinc-500 text-[11px]">Free delivery across Bangladesh on orders over ৳2,000 with live GPS tracking.</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/80 text-zinc-900">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-zinc-900">256-bit Encrypted Vault Gateway</div>
            <div className="text-zinc-500 text-[11px]">PCI-DSS compliant tokenization with 3D Secure verification.</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/80 text-zinc-900">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-zinc-900">30-Day Effortless Returns</div>
            <div className="text-zinc-500 text-[11px]">Prepaid return dispatch slips included with every delivery box.</div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-lg font-bold font-display text-zinc-950 tracking-tight">
            AURA COMMERCE
          </span>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm">
            High-performance omnichannel commerce platform engineered with real-time order tracking, live inventory control, and secure payment processing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-600">
          <button onClick={() => setActiveView('store')} className="hover:text-zinc-950 transition-colors">
            Storefront
          </button>
          <button onClick={() => setActiveView('tracking')} className="hover:text-zinc-950 transition-colors">
            Order Tracking
          </button>
          <button onClick={() => setActiveView('admin')} className="hover:text-zinc-950 transition-colors">
            Store Console
          </button>
          <button
            onClick={() => switchUserRole(currentUser.role === 'admin' ? 'customer' : 'admin')}
            className="hover:text-zinc-950 transition-colors text-zinc-900 underline"
          >
            {currentUser.role === 'admin' ? 'Customer Mode' : 'Admin Mode'}
          </button>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400">
        <div>© 2026 AURA Commerce Inc. All rights reserved.</div>
        <div className="mt-2 sm:mt-0 font-mono">Platform Version 2026.1 · Express Node.js & React</div>
      </div>
    </footer>
  );
};
