import React from 'react';
import { ShoppingBag, Bell, Compass, ShieldCheck, Menu, X, PackageCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartTotalCount,
    setIsCartOpen,
    unreadNotificationsCount,
    setIsNotificationDrawerOpen,
    currentUser,
    switchUserRole
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView('store')}
            className="text-xl font-bold tracking-tight text-zinc-900 font-display hover:opacity-80 transition-opacity text-left"
          >
            AURA
          </button>
        </div>

        {/* Zone 2: Clean text navigation links (desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <button
            onClick={() => setActiveView('store')}
            className={`hover:text-zinc-950 transition-colors whitespace-nowrap ${
              activeView === 'store' ? 'text-zinc-950 font-semibold' : ''
            }`}
          >
            Storefront
          </button>

          <button
            onClick={() => {
              setActiveView('tracking');
            }}
            className={`flex items-center gap-1.5 hover:text-zinc-950 transition-colors whitespace-nowrap ${
              activeView === 'tracking' ? 'text-zinc-950 font-semibold' : ''
            }`}
          >
            <PackageCheck className="w-4 h-4 text-zinc-500" />
            <span>Live Order Tracking</span>
          </button>

          <button
            onClick={() => {
              setActiveView('admin');
            }}
            className={`flex items-center gap-1.5 hover:text-zinc-950 transition-colors whitespace-nowrap ${
              activeView === 'admin' ? 'text-zinc-950 font-semibold' : ''
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-zinc-500" />
            <span>Store Console</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Button */}
          <button
            type="button"
            onClick={() => setIsNotificationDrawerOpen(true)}
            aria-label="Notifications"
            className="relative p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-[#FBFBF9]" />
            )}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping bag"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono tabular-nums bg-zinc-800 px-1.5 py-0.5 rounded text-[11px] text-zinc-200">
              {cartTotalCount}
            </span>
          </button>

          {/* Quick Role Switcher Pill-free */}
          <button
            onClick={() => switchUserRole(currentUser.role === 'admin' ? 'customer' : 'admin')}
            title="Switch Customer / Admin Mode"
            className="hidden lg:flex items-center text-xs text-zinc-500 hover:text-zinc-900 font-medium transition-colors border-l border-zinc-200 pl-3"
          >
            {currentUser.role === 'admin' ? 'Exit Admin' : 'Admin Login'}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-700 hover:text-zinc-900 rounded-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-[#FBFBF9] px-4 pt-3 pb-4 space-y-2 text-sm font-medium">
          <button
            onClick={() => {
              setActiveView('store');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-zinc-800 hover:text-zinc-950"
          >
            Storefront
          </button>
          <button
            onClick={() => {
              setActiveView('tracking');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-zinc-800 hover:text-zinc-950"
          >
            Live Order Tracking
          </button>
          <button
            onClick={() => {
              setActiveView('admin');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-zinc-800 hover:text-zinc-950"
          >
            Store Console & Inventory
          </button>
          <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
            <span>Logged in as {currentUser.name}</span>
            <button
              onClick={() => {
                switchUserRole(currentUser.role === 'admin' ? 'customer' : 'admin');
                setMobileMenuOpen(false);
              }}
              className="text-zinc-900 font-semibold underline"
            >
              {currentUser.role === 'admin' ? 'Switch to Customer' : 'Switch to Admin'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
