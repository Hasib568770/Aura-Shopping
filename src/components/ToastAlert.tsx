import React from 'react';
import { Truck, Check, Bell, X, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastAlert: React.FC = () => {
  const { activeToast, dismissToast, setActiveView, orders, setActiveTrackingOrder } = useStore();

  if (!activeToast) return null;

  const handleToastClick = () => {
    if (activeToast.orderId) {
      const match = orders.find(o => o.id === activeToast.orderId);
      if (match) {
        setActiveTrackingOrder(match);
        setActiveView('tracking');
      }
    }
    dismissToast();
  };

  return (
    <aside
      aria-label="Notification alert"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-zinc-950 text-white rounded-xl shadow-2xl p-4 border border-zinc-800 animate-in slide-in-from-bottom-5 duration-300 flex items-start gap-3"
    >
      <div className="p-2 bg-zinc-800 rounded-lg text-emerald-400 shrink-0">
        {activeToast.type === 'shipping' ? (
          <Truck className="w-4 h-4" />
        ) : (
          <Package className="w-4 h-4" />
        )}
      </div>

      <div className="flex-1 cursor-pointer" onClick={handleToastClick}>
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-zinc-100 font-display">
            {activeToast.title}
          </h4>
          <span className="text-[10px] text-zinc-500 font-mono">
            {activeToast.timestamp}
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
          {activeToast.message}
        </p>
        {activeToast.orderId && (
          <span className="inline-block mt-2 text-[10px] text-emerald-400 font-semibold underline">
            Tap to view live tracking →
          </span>
        )}
      </div>

      <button
        onClick={dismissToast}
        className="text-zinc-500 hover:text-zinc-300 p-1 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
