import React, { useState } from 'react';
import { Eye, Plus, Check } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatTaka } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useStore();
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock === 0;

  return (
    <article
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white border border-zinc-200/80 rounded-xl overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      {/* Product Image Stage (65-70% height) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F4F2] flex items-center justify-center">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-zinc-400">
            <span className="font-display font-semibold text-lg text-zinc-600">{product.name}</span>
            <span className="text-xs uppercase tracking-wider mt-1">{product.category}</span>
          </div>
        )}

        {/* Stock / Limited Tag (Quiet text, strictly anti-pill) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {product.badge && (
            <span className="text-[11px] font-medium tracking-tight text-zinc-800 bg-[#FBFBF9]/90 backdrop-blur-sm px-2 py-0.5 rounded border border-zinc-200/60">
              {product.badge}
            </span>
          )}
          {isLowStock && (
            <span className="text-[11px] font-medium text-amber-800 bg-amber-50/90 backdrop-blur-sm px-2 py-0.5 rounded border border-amber-200/60">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[11px] font-medium text-rose-800 bg-rose-50/90 backdrop-blur-sm px-2 py-0.5 rounded border border-rose-200/60">
              Sold Out
            </span>
          )}
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-zinc-900 text-xs font-semibold rounded-lg shadow-sm hover:bg-white flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect</span>
          </button>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors ${
              isOutOfStock
                ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Body & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span className="uppercase tracking-wider font-mono text-[11px]">{product.category}</span>
            <span className="font-mono tabular-nums">SKU: {product.sku}</span>
          </div>

          <h3 className="font-semibold text-zinc-900 text-base line-clamp-1 group-hover:text-zinc-600 transition-colors">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Rating Row */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono tabular-nums text-base font-bold text-zinc-950">
              {formatTaka(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono tabular-nums text-xs text-zinc-400 line-through">
                {formatTaka(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono tabular-nums">
            <span className="text-amber-500">★</span>
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-zinc-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </article>
  );
};
