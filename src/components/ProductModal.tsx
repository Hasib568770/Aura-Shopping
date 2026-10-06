import React, { useState } from 'react';
import { X, Check, Shield, Truck, RotateCcw, Plus, Minus, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatTaka } from '../utils/format';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onDirectCheckout: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onDirectCheckout
}) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const handleBuyNow = () => {
    onDirectCheckout(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 text-zinc-500 hover:text-zinc-900 bg-white/80 hover:bg-white rounded-full backdrop-blur-sm shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Image Left Side */}
        <div className="w-full md:w-1/2 bg-[#F4F4F2] relative min-h-[320px] md:min-h-full flex items-center justify-center p-6">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[460px] object-cover rounded-lg shadow-sm"
          />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-mono text-zinc-700 border border-zinc-200">
            SKU: {product.sku}
          </div>
        </div>

        {/* Contiguous Purchase Module Right Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Hierarchy kicker */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest font-mono">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>In Stock ({product.stock} units)</span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
              {product.name}
            </h2>

            {/* Price Row */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-mono tabular-nums text-2xl font-bold text-zinc-950">
                {formatTaka(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-mono tabular-nums text-sm text-zinc-400 line-through">
                  {formatTaka(product.originalPrice)}
                </span>
              )}
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Verified Authentic
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Technical Specification Matrix */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="mt-6 pt-6 border-t border-zinc-200">
                <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3">
                  Specifications & Materials
                </h4>
                <div className="space-y-2 text-xs text-zinc-600">
                  {Object.entries(product.attributes).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-zinc-100">
                      <span className="text-zinc-500">{key}</span>
                      <span className="font-medium text-zinc-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contiguous Actions Block */}
          <div className="mt-8 pt-6 border-t border-zinc-200">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-zinc-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1 text-xs font-mono tabular-nums font-semibold text-zinc-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                Total: {formatTaka(product.price * quantity)}
              </span>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={product.stock === 0}
                onClick={handleAdd}
                className="w-full py-3 px-4 text-xs font-semibold rounded-lg border border-zinc-900 text-zinc-900 hover:bg-zinc-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={product.stock === 0}
                onClick={handleBuyNow}
                className="w-full py-3 px-4 text-xs font-semibold rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
              >
                Direct Checkout
              </button>
            </div>

            {/* Guarantees Trust Row */}
            <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500 pt-2">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-zinc-400" />
                2-Year Warranty
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-zinc-400" />
                Express Courier Delivery
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-zinc-400" />
                30-Day Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
