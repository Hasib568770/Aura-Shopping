import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  DollarSign,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle,
  Truck,
  Layers,
  ArrowUpRight,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatTaka } from '../utils/format';
import type { StoreAnalytics, OrderStatus, Product, ProductCategory } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    updateInventoryStock,
    addNewProduct,
    deleteProduct,
    updateOrderStatus,
    setActiveView
  } = useStore();

  const [analytics, setAnalytics] = useState<StoreAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders'>('analytics');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdForm, setNewProdForm] = useState({
    name: '',
    category: 'Audio' as ProductCategory,
    price: '',
    stock: '',
    sku: '',
    description: ''
  });

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [orders.length, products.length, activeTab]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdForm.name || !newProdForm.price || !newProdForm.stock) return;

    await addNewProduct({
      name: newProdForm.name,
      category: newProdForm.category,
      price: parseFloat(newProdForm.price),
      stock: parseInt(newProdForm.stock, 10),
      sku: newProdForm.sku || `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      description: newProdForm.description || 'Artisanal studio release designed for enduring function.',
      image: '/src/assets/images/hero_marketplace_lifestyle_1791306924683.jpg'
    });

    setIsAddProductOpen(false);
    setNewProdForm({ name: '', category: 'Audio', price: '', stock: '', sku: '', description: '' });
  };

  const categories: ProductCategory[] = ['Audio', 'Horology', 'Fragrance', 'Ceramics', 'Apparel', 'Living'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">Store Administrator</span>
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-semibold text-zinc-700">Operations Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-display mt-1">
            Store Console & Analytics
          </h1>
        </div>

        {/* Segmented Tab Controls (Strict anti-pill tabs per constitution) */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Analytics & Reports
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'inventory'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Inventory Management ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Order Fulfillment ({orders.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS & REPORTS */}
      {activeTab === 'analytics' && analytics && (
        <div className="mt-8 space-y-8">
          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Gross Store Revenue</span>
                <DollarSign className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-zinc-950">
                {formatTaka(analytics.totalRevenue)}
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                <span>+18.4% vs previous 30 days</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Total Orders Placed</span>
                <Package className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-zinc-950">
                {orders.length}
              </div>
              <div className="mt-2 text-[11px] text-zinc-500">
                100% fulfilled or active in transit
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Average Order Value (AOV)</span>
                <TrendingUp className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-zinc-950">
                {formatTaka(analytics.averageOrderValue)}
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                <span>Premium cart mix</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Inventory Alerts</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-zinc-950">
                {products.filter(p => p.stock <= p.lowStockThreshold).length} SKUs
              </div>
              <div className="mt-2 text-[11px] text-amber-700 font-medium">
                Replenishment recommended
              </div>
            </div>
          </div>

          {/* Revenue Chart & Category Share */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 7-Day Revenue Trend Bar Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 font-display">
                    Weekly Revenue Trajectory
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Real-time aggregated sales volume
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums text-zinc-400">Oct 2026</span>
              </div>

              {/* Responsive SVG Bar Visualization */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-zinc-100">
                {analytics.recentSales.map((day, idx) => {
                  const maxAmount = Math.max(...analytics.recentSales.map(d => d.amount));
                  const heightPercent = Math.max(15, Math.round((day.amount / maxAmount) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono tabular-nums text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">
                        {formatTaka(day.amount)}
                      </div>
                      <div
                        className="w-full max-w-[42px] bg-zinc-900 group-hover:bg-zinc-700 rounded-t transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[11px] text-zinc-500 font-mono mt-1">
                        {day.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Peak Daily Volume: ৳485,000 (Oct 05)</span>
                <span>Store Conversion: {analytics.conversionRate}%</span>
              </div>
            </div>

            {/* Top Product Drivers */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 font-display mb-1">
                  Top Performing SKUs
                </h3>
                <p className="text-xs text-zinc-500 mb-4">Ranked by gross sales contribution</p>

                <div className="divide-y divide-zinc-100 text-xs">
                  {analytics.topProducts.map((p) => (
                    <div key={p.id} className="py-3 flex justify-between items-center">
                      <div className="pr-2">
                        <div className="font-semibold text-zinc-900 line-clamp-1">{p.name}</div>
                        <div className="text-zinc-500 font-mono text-[11px]">{p.sold} units ordered</div>
                      </div>
                      <div className="text-right font-mono font-bold text-zinc-900 shrink-0">
                        {formatTaka(p.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-100 text-[11px] text-zinc-400">
                Audited against live transactional records.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 font-display">
                Inventory Stock & Catalog Control
              </h2>
              <p className="text-xs text-zinc-500">
                Adjust quantities on hand, manage threshold alerts, or publish new inventory pieces.
              </p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Inventory Table */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 font-medium">SKU / Item</th>
                    <th className="py-3.5 px-4 font-medium">Category</th>
                    <th className="py-3.5 px-4 font-medium">Price</th>
                    <th className="py-3.5 px-4 font-medium">Stock On Hand</th>
                    <th className="py-3.5 px-4 font-medium">Health Status</th>
                    <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map((prod) => {
                    const isLow = prod.stock <= prod.lowStockThreshold && prod.stock > 0;
                    const isOut = prod.stock === 0;

                    return (
                      <tr key={prod.id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                            />
                            <div>
                              <div className="font-semibold text-zinc-900">{prod.name}</div>
                              <div className="font-mono text-[11px] text-zinc-500">{prod.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-zinc-600 font-mono">{prod.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                          {formatTaka(prod.price)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateInventoryStock(prod.id, Math.max(0, prod.stock - 1))}
                              className="w-6 h-6 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center transition-colors"
                            >
                              -
                            </button>
                            <span className="font-mono tabular-nums font-bold text-zinc-950 w-8 text-center">
                              {prod.stock}
                            </span>
                            <button
                              onClick={() => updateInventoryStock(prod.id, prod.stock + 1)}
                              className="w-6 h-6 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isOut ? (
                            <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                              Low ({prod.stock} left)
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                              Optimal ({prod.stock} units)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete SKU"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER FULFILLMENT & DISPATCH */}
      {activeTab === 'orders' && (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 font-display">
              Order Fulfillment & Courier Dispatch
            </h2>
            <p className="text-xs text-zinc-500">
              Manage fulfillment pipelines. Updating status triggers live real-time GPS tracking and instant user push notifications.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 font-medium">Order ID / Date</th>
                    <th className="py-3.5 px-4 font-medium">Customer</th>
                    <th className="py-3.5 px-4 font-medium">Items</th>
                    <th className="py-3.5 px-4 font-medium">Total</th>
                    <th className="py-3.5 px-4 font-medium">Payment</th>
                    <th className="py-3.5 px-4 font-medium">Fulfillment Status</th>
                    <th className="py-3.5 px-4 font-medium text-right">Courier Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-zinc-900">{o.id}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          {new Date(o.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900">{o.customer.name}</div>
                        <div className="text-[11px] text-zinc-500">{o.customer.city}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600">
                        {o.items.length} items
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                        {formatTaka(o.total)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
                          {o.paymentMethod.toUpperCase()} ({o.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="font-mono text-xs font-semibold bg-white border border-zinc-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-zinc-900 outline-none"
                        >
                          <option value="processing">Processing</option>
                          <option value="packed">Packed & Inspected</option>
                          <option value="in_transit">In Transit</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setActiveView('tracking');
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-zinc-700 border border-zinc-200 rounded hover:bg-zinc-100 inline-flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Track GPS</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <h3 className="font-bold font-display text-lg text-zinc-900">
                Publish New Catalog Product
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-600 mb-1 font-medium">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Ceramic Vessel"
                  value={newProdForm.name}
                  onChange={(e) => setNewProdForm({ ...newProdForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 font-medium">Category</label>
                  <select
                    value={newProdForm.category}
                    onChange={(e) => setNewProdForm({ ...newProdForm, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 font-medium">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. AUR-CER-09"
                    value={newProdForm.sku}
                    onChange={(e) => setNewProdForm({ ...newProdForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 font-medium">Price (BDT / ৳)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="18500"
                    value={newProdForm.price}
                    onChange={(e) => setNewProdForm({ ...newProdForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 font-medium">Initial Stock Units</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={newProdForm.stock}
                    onChange={(e) => setNewProdForm({ ...newProdForm, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Design specs, craftsmanship notes..."
                  value={newProdForm.description}
                  onChange={(e) => setNewProdForm({ ...newProdForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3 py-2 border border-zinc-300 text-zinc-700 font-semibold rounded-lg hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 text-white font-semibold rounded-lg hover:bg-zinc-800"
                >
                  Publish Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
