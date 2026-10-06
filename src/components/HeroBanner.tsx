import React from 'react';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-zinc-900 text-white rounded-2xl mx-4 sm:mx-6 lg:mx-8 my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px]">
        {/* Left Column: Editorial Copy */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 z-10 flex flex-col justify-between h-full">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-mono">
              Autumn / Winter 2026 Collection
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-display text-white max-w-xl [text-wrap:balance] leading-[1.15]">
              Form follows precision. Curated objects for modern living.
            </h1>
            
            <p className="mt-5 text-sm sm:text-base text-zinc-300 max-w-lg leading-relaxed font-normal">
              An uncompromising catalog of studio acoustics, Swiss horology, botanical fragrances, and architectural homeware—engineered with transparent inventory and live express tracking.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center gap-6">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-zinc-950 bg-white rounded-lg hover:bg-zinc-100 transition-all shadow-sm"
            >
              <span>Explore The Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-300" />
                256-bit Secure Gateway
              </span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-zinc-300" />
                Live Real-Time Tracking
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: High Fidelity Architectural Showcase Image */}
        <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[360px] overflow-hidden">
          <img
            src="/src/assets/images/hero_marketplace_lifestyle_1791306924683.jpg"
            alt="AURA Architectural Lifestyle Space"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-zinc-900 lg:via-transparent lg:to-transparent" />
          
          <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded text-[11px] text-zinc-300 font-mono tabular-nums border border-zinc-800/80">
            AURA Studio Space No. 04 · San Francisco
          </div>
        </div>
      </div>
    </section>
  );
};
