import React, { useEffect, useState } from 'react';
import { Sparkles, Eye, Plus, Check } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatTaka } from '../utils/format';

interface PersonalizedRecommendationsProps {
  onQuickView: (product: Product) => void;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ onQuickView }) => {
  const { cart, addToCart } = useStore();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);

  const cartKey = cart.map(item => item.productId).sort().join(',');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`/api/recommendations?cartIds=${cartKey}`);
        const data = await res.json();
        if (data.success) {
          setRecommendations(data.recommendations);
        }
      } catch (err) {
        console.error('Failed to load personalized recommendations', err);
      }
    };

    fetchRecommendations();
  }, [cartKey]);

  if (recommendations.length === 0) return null;

  const handleQuickAdd = (p: Product) => {
    addToCart(p, 1);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <section className="my-14 border-t border-zinc-200/80 pt-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-zinc-800" />
            <span>Tailored Selections</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-zinc-950 mt-1">
            Recommended For Your Collection
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Algorithmic affinities calibrated to your taste, materials, and order history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((item) => (
          <div
            key={item.id}
            onClick={() => onQuickView(item)}
            className="group bg-white border border-zinc-200/80 rounded-xl overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] bg-[#F4F4F2] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 text-[10px] font-mono uppercase bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-zinc-700">
                {item.category}
              </div>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-zinc-600 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="font-mono tabular-nums text-sm font-bold text-zinc-950">
                  {formatTaka(item.price)}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAdd(item);
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    addedId === item.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}
                >
                  {addedId === item.id ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>Add</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
