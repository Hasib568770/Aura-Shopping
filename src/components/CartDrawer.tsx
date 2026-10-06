import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatTaka } from '../utils/format';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotalCount,
    setIsCheckoutOpen
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2000; // ৳2,000
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/50 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-zinc-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h2 className="text-lg font-bold text-zinc-900 font-display">
                Shopping Bag
              </h2>
              <span className="font-mono tabular-nums text-xs bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-medium">
                {cartTotalCount} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200/80 text-xs text-zinc-700">
            {amountNeededForFreeShipping > 0 ? (
              <p>
                Add <span className="font-semibold font-mono text-zinc-900">{formatTaka(amountNeededForFreeShipping)}</span> more to unlock complimentary priority delivery.
              </p>
            ) : (
              <p className="text-emerald-700 font-medium">
                ✓ You have unlocked complimentary priority shipping!
              </p>
            )}
            <div className="mt-2 w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 transition-all duration-300 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="p-6 flex-1 overflow-y-auto divide-y divide-zinc-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-zinc-300 mb-3 stroke-[1.5]" />
                <p className="text-zinc-900 font-semibold text-sm">Your bag is currently empty</p>
                <p className="text-zinc-500 text-xs mt-1 max-w-xs">
                  Discover precision audio, artisanal ceramics, and limited horology editions.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="py-4 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-zinc-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">
                        SKU: {item.product.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-zinc-200 rounded-md bg-zinc-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-semibold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-mono tabular-nums text-sm font-bold text-zinc-900">
                          {formatTaka(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-zinc-50">
              <div className="space-y-2 text-xs text-zinc-600 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-medium text-zinc-900">
                    {formatTaka(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Priority Delivery</span>
                  <span className="font-mono tabular-nums font-medium text-zinc-900">
                    {cartSubtotal >= freeShippingThreshold ? 'FREE (৳0)' : '৳80'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-bold text-zinc-900">
                  <span>Total</span>
                  <span className="font-mono tabular-nums text-base">
                    {formatTaka(cartSubtotal + (cartSubtotal >= freeShippingThreshold ? 0 : 80))}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>256-bit SSL encrypted checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
