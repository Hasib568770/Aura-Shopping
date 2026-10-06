import React from 'react';
import { X, Bell, CheckCheck, Truck, Package, Tag, AlertTriangle, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { NotificationItem } from '../types';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    markNotificationsAsRead,
    pushPermission,
    requestPushPermission,
    triggerNotification,
    setActiveView,
    orders,
    setActiveTrackingOrder
  } = useStore();

  if (!isNotificationDrawerOpen) return null;

  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationsAsRead(item.id);
    if (item.orderId) {
      const match = orders.find(o => o.id === item.orderId);
      if (match) {
        setActiveTrackingOrder(match);
        setActiveView('tracking');
        setIsNotificationDrawerOpen(false);
      }
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'shipping':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'order':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'inventory':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Tag className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/40 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsNotificationDrawerOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between border-l border-zinc-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-zinc-900" />
              <h2 className="text-base font-bold text-zinc-900 font-display">
                Push Notifications
              </h2>
            </div>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Browser Push Permission Banner */}
          <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-zinc-900">Browser Push Alerts</div>
              <div className="text-zinc-500 text-[11px]">
                {pushPermission === 'granted'
                  ? '✓ Active & Enabled'
                  : pushPermission === 'denied'
                  ? 'Disabled in browser settings'
                  : 'Receive real-time transit alerts'}
              </div>
            </div>
            {pushPermission !== 'granted' && (
              <button
                onClick={requestPushPermission}
                className="px-2.5 py-1 text-xs font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"
              >
                Enable
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="p-4 flex-1 overflow-y-auto divide-y divide-zinc-100">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`py-3.5 px-3 rounded-xl transition-colors cursor-pointer flex gap-3 ${
                    item.read ? 'hover:bg-zinc-50' : 'bg-zinc-50/80 hover:bg-zinc-100/90'
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg border border-zinc-200/80 shadow-xs shrink-0 self-start">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-semibold ${item.read ? 'text-zinc-700' : 'text-zinc-950'}`}>
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="mt-1 text-[10px] text-zinc-400 font-mono">
                      {item.timestamp}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-2">
            <button
              onClick={() => markNotificationsAsRead()}
              className="w-full py-2 px-3 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-zinc-500" />
              <span>Mark All as Read</span>
            </button>

            <button
              onClick={() => triggerNotification('Courier Update', 'Driver Marcus Vance is now 12 minutes away with parcel #AU-94821.', 'shipping', 'AU-94821')}
              className="w-full py-2 px-3 text-xs font-semibold text-zinc-900 bg-zinc-200/80 rounded-lg hover:bg-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Live Courier Push Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
