import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, User, Navigation, ArrowLeft, RefreshCw, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatTaka } from '../utils/format';
import type { OrderStatus, Order } from '../types';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    updateOrderStatus,
    setActiveView,
    triggerNotification
  } = useStore();

  const [isUpdating, setIsUpdating] = useState(false);

  // If no active tracking order selected, fallback to the latest
  const order: Order | undefined = activeTrackingOrder || orders[0];

  const handleAdvanceStatus = async () => {
    if (!order) return;
    setIsUpdating(true);

    const stages: OrderStatus[] = ['processing', 'packed', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentIdx = stages.indexOf(order.status);
    const nextIdx = (currentIdx + 1) % stages.length;
    const nextStatus = stages[nextIdx];

    await updateOrderStatus(order.id, nextStatus);
    setIsUpdating(false);
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold font-display text-zinc-900">No Orders Placed Yet</h2>
        <p className="text-zinc-500 text-xs mt-1">
          Explore our catalog to place your first order with real-time express tracking.
        </p>
        <button
          onClick={() => setActiveView('store')}
          className="mt-6 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const isDelivered = order.status === 'delivered';
  const isOutForDelivery = order.status === 'out_for_delivery';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Bar with back to store & order selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('store')}
            className="p-2 text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 font-display">
                Order Tracking
              </h1>
              <span className="font-mono text-xs font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200">
                {order.id}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tracking Number: <span className="font-mono font-medium text-zinc-700">{order.trackingNumber}</span> · {order.carrier}
            </p>
          </div>
        </div>

        {/* Order Switcher if multiple exist */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Select Order:</span>
            <select
              value={order.id}
              onChange={(e) => {
                const found = orders.find(o => o.id === e.target.value);
                if (found) setActiveTrackingOrder(found);
              }}
              className="text-xs font-mono font-semibold bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-zinc-900 outline-none"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.id} ({o.status.replace('_', ' ')}) - {formatTaka(o.total)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Progress & Map Route Simulation */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status Highlight Banner */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Estimated Delivery Arrival
                </span>
                <div className="text-xl sm:text-2xl font-bold font-display text-zinc-900 mt-1">
                  {order.estimatedDelivery}
                </div>
                <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    Status: <strong className="capitalize text-zinc-800">{order.status.replace('_', ' ')}</strong>
                  </span>
                </div>
              </div>

              {/* Simulation Action: Interactive Live Demo Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleAdvanceStatus}
                  className="px-3.5 py-2 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 flex items-center gap-2 shadow-sm transition-all"
                  title="Simulate Next Shipping Stage"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                  <span>Advance Status (Simulate Live Courier)</span>
                </button>
              </div>
            </div>

            {/* Step Progress Line */}
            <div className="pt-6">
              <div className="relative">
                {/* Horizontal Bar for desktop */}
                <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-zinc-200 z-0" />
                <div
                  className="hidden sm:block absolute top-4 left-6 h-0.5 bg-zinc-900 transition-all duration-500 z-0"
                  style={{
                    width:
                      order.status === 'processing' ? '0%' :
                      order.status === 'packed' ? '25%' :
                      order.status === 'in_transit' ? '50%' :
                      order.status === 'out_for_delivery' ? '75%' : '100%'
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {order.trackingTimeline.map((step, idx) => (
                    <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          step.completed
                            ? 'bg-zinc-900 text-white'
                            : step.current
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                            : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${step.completed || step.current ? 'text-zinc-900' : 'text-zinc-400'}`}>
                          {step.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          {step.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Route Simulation Map Container */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="text-sm font-bold text-zinc-900 font-display">
                  Live Dispatch Telemetry & Radar
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                GPS Feed: Active
              </span>
            </div>

            {/* Simulated Vector Map Canvas */}
            <div className="relative aspect-[16/9] w-full bg-[#18181B] rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800">
              {/* Map grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#27272A_1px,transparent_1px)] [background-size:24px_24px] opacity-80" />
              
              {/* Route Path (SVG Vector) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 340" fill="none">
                <path
                  d="M 60 280 C 140 240, 180 180, 260 160 S 420 190, 520 80"
                  stroke="#3F3F46"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <path
                  d="M 60 280 C 140 240, 180 180, 260 160 S 420 190, 520 80"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray="600"
                  strokeDashoffset={isDelivered ? "0" : isOutForDelivery ? "120" : "320"}
                  className="transition-all duration-1000 ease-out"
                />

                {/* Origin Warehouse marker */}
                <circle cx="60" cy="280" r="8" fill="#52525B" />
                <circle cx="60" cy="280" r="4" fill="#FFFFFF" />
                <text x="75" y="285" fill="#A1A1AA" fontSize="11" fontFamily="sans-serif">
                  Oakland Hub
                </text>

                {/* Transit Waypoint */}
                <circle cx="260" cy="160" r="6" fill="#3F3F46" />
                <text x="275" y="165" fill="#71717A" fontSize="10" fontFamily="sans-serif">
                  SF Sort Facility
                </text>

                {/* Destination marker */}
                <circle cx="520" cy="80" r="8" fill="#E11D48" />
                <circle cx="520" cy="80" r="4" fill="#FFFFFF" />
                <text x="440" y="70" fill="#FDA4AF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  Destination (742 Evergreen)
                </text>

                {/* Active Courier Moving Point */}
                {!isDelivered && (
                  <g transform={`translate(${isOutForDelivery ? 430 : 210}, ${isOutForDelivery ? 115 : 190})`}>
                    <circle cx="0" cy="0" r="14" fill="#10B981" fillOpacity="0.25" className="animate-ping" />
                    <circle cx="0" cy="0" r="8" fill="#10B981" />
                    <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                  </g>
                )}
              </svg>

              {/* Courier telemetry overlay */}
              {order.currentLocation && (
                <div className="absolute bottom-3 left-3 right-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 rounded-lg p-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-100">
                        {order.currentLocation.courierName}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {order.currentLocation.vehicleType} · {order.currentLocation.address}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-emerald-400 font-bold text-sm">
                      {isDelivered
                        ? 'Package Delivered'
                        : `${order.currentLocation.estimatedMinutesAway} mins away`}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Coordinates: {order.currentLocation.lat.toFixed(4)}, {order.currentLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Manifest & Delivery Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Destination Details */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>Delivery Information</span>
            </h3>

            <div className="text-xs text-zinc-600 space-y-2">
              <div className="font-semibold text-zinc-900">{order.customer.name}</div>
              <div>{order.customer.address}</div>
              <div>{order.customer.city}, {order.customer.postalCode}</div>
              <div className="font-mono text-zinc-500">{order.customer.phone}</div>
              <div className="pt-2 text-zinc-500">{order.customer.email}</div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Payment Method:</span>
              <span className="font-semibold text-zinc-900 uppercase">
                {order.paymentMethod.replace('_', ' ')} ({order.paymentStatus})
              </span>
            </div>
          </div>

          {/* Package Contents */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-zinc-500" />
              <span>Items In This Shipment ({order.items.length})</span>
            </h3>

            <div className="divide-y divide-zinc-100">
              {order.items.map((item, i) => (
                <div key={i} className="py-3 flex items-center gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-zinc-900 line-clamp-1">{item.name}</div>
                    <div className="text-zinc-500 font-mono text-[11px]">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-mono font-bold text-zinc-900">
                    {formatTaka(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatTaka(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono">{order.shipping === 0 ? 'FREE (৳0)' : formatTaka(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (VAT)</span>
                <span className="font-mono">{formatTaka(order.tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 font-bold text-zinc-900 text-sm">
                <span>Total</span>
                <span className="font-mono">{formatTaka(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
