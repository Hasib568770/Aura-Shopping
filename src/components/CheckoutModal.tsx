import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, Check, ArrowRight, Truck, Smartphone, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatTaka } from '../utils/format';
import type { PaymentMethod, CustomerDetails } from '../types';

interface CheckoutModalProps {
  directItem?: {
    product: any;
    quantity: number;
  } | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ directItem, onClose }) => {
  const {
    cart,
    clearCart,
    currentUser,
    refreshOrders,
    setActiveTrackingOrder,
    setActiveView,
    triggerNotification
  } = useStore();

  const checkoutItems = directItem
    ? [{ productId: directItem.product.id, name: directItem.product.name, price: directItem.product.price, quantity: directItem.quantity, image: directItem.product.image }]
    : cart.map(item => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      }));

  const subtotal = checkoutItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const shipping = subtotal >= 2000 ? 0 : 80;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  // Form states
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: currentUser.name || 'Nasrullah Hasib',
    email: currentUser.email || 'nasrullahhasib27@gmail.com',
    phone: '+880 1712-345678',
    address: currentUser.addresses[0]?.address || 'House 42, Road 11, Banani',
    city: currentUser.addresses[0]?.city || 'Dhaka',
    postalCode: currentUser.addresses[0]?.postalCode || '1213',
    country: 'Bangladesh'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardHolder, setCardHolder] = useState(customer.name);
  const [mobileWalletNumber, setMobileWalletNumber] = useState('01712345678');
  const [mobileWalletType, setMobileWalletType] = useState<'bKash' | 'Nagad'>('bKash');

  const [isProcessing, setIsProcessing] = useState(false);
  const [show3DSChallenge, setShow3DSChallenge] = useState(false);
  const [challengeOtp, setChallengeOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardExpiry(val);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (checkoutItems.length === 0) {
      setErrorMsg('No items in checkout.');
      return;
    }

    if (!customer.name || !customer.address || !customer.city) {
      setErrorMsg('Please complete all delivery address fields.');
      return;
    }

    // 3D Secure Simulation trigger for Credit Card
    if (paymentMethod === 'card' && !show3DSChallenge) {
      setShow3DSChallenge(true);
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Call secure payment gateway endpoint
      const payRes = await fetch('/api/checkout/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'BDT',
          method: paymentMethod,
          cardDetails: paymentMethod === 'card' ? {
            number: cardNumber,
            expiry: cardExpiry,
            cvv: cardCvv,
            holder: cardHolder
          } : undefined,
          customer
        })
      });

      const payData = await payRes.json();
      if (!payData.success) {
        throw new Error(payData.error || 'Payment gateway declined transaction.');
      }

      // Step 2: Place order in database & decrement inventory
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutItems,
          customer,
          paymentMethod,
          paymentDetails: payData
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to generate order confirmation.');
      }

      if (!directItem) {
        clearCart();
      }

      await refreshOrders();
      setOrderComplete(orderData.order);
      setShow3DSChallenge(false);

      triggerNotification(
        `Order ${orderData.order.id} Placed!`,
        `Payment of ${formatTaka(total)} confirmed. Tracking #${orderData.order.trackingNumber} is now live.`,
        'order',
        orderData.order.id
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrackCreatedOrder = () => {
    if (orderComplete) {
      setActiveTrackingOrder(orderComplete);
      setActiveView('tracking');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-zinc-900" />
            <h2 className="text-base font-bold text-zinc-900 font-display">
              AURA Secure Checkout (BDT)
            </h2>
            <span className="text-[11px] font-mono text-zinc-500 bg-zinc-200/60 px-2 py-0.5 rounded">
              256-Bit Encrypted
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {orderComplete ? (
            /* Order Success Screen */
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <h3 className="text-2xl font-bold font-display text-zinc-950">
                Payment Authorized & Order Confirmed
              </h3>

              <p className="mt-2 text-sm text-zinc-600 max-w-md">
                Order <span className="font-mono font-semibold text-zinc-900">{orderComplete.id}</span> has been confirmed. A receipt and real-time tracking link have been dispatched.
              </p>

              <div className="my-6 p-4 bg-zinc-50 rounded-xl border border-zinc-200 w-full max-w-md text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tracking Number:</span>
                  <span className="font-mono font-bold text-zinc-900">{orderComplete.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Carrier:</span>
                  <span className="font-medium text-zinc-900">{orderComplete.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Charged:</span>
                  <span className="font-mono font-bold text-zinc-900">{formatTaka(orderComplete.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Estimated Delivery:</span>
                  <span className="font-medium text-emerald-700">{orderComplete.estimatedDelivery}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                  type="button"
                  onClick={handleTrackCreatedOrder}
                  className="flex-1 py-3 px-4 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  <span>Launch Live GPS Tracking</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  Back to Store
                </button>
              </div>
            </div>
          ) : show3DSChallenge ? (
            /* 3D Secure 2.0 Challenge Simulation Modal */
            <div className="py-6 max-w-md mx-auto text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-zinc-900">
                3D Secure Identity Verification
              </h3>
              <p className="mt-2 text-xs text-zinc-600">
                Your bank has requested authentication for this transaction of{' '}
                <span className="font-mono font-bold text-zinc-900">{formatTaka(total)}</span>. Enter the simulated test passcode sent to <span className="font-medium text-zinc-900">+880 1712-***678</span>.
              </p>

              <div className="mt-5 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-left">
                <div className="text-[11px] text-zinc-500 mb-1">Test Verification Code:</div>
                <div className="font-mono text-sm font-bold text-zinc-800 tracking-widest bg-zinc-200/80 p-2 rounded text-center">
                  849201
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    value={challengeOtp}
                    onChange={(e) => setChallengeOtp(e.target.value)}
                    placeholder="849201"
                    maxLength={6}
                    className="w-full text-center font-mono tracking-widest text-base font-bold px-3 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-900 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShow3DSChallenge(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={(e) => {
                    handlePay(e);
                  }}
                  className="flex-1 py-2.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Verifying...' : 'Authorize Transaction'}
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePay} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Order Items Preview */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <div className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                  Order Summary ({checkoutItems.length} items)
                </div>
                <div className="divide-y divide-zinc-200/60 max-h-36 overflow-y-auto">
                  {checkoutItems.map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src={it.image} alt={it.name} className="w-8 h-8 rounded object-cover" />
                        <div>
                          <div className="font-medium text-zinc-900 line-clamp-1">{it.name}</div>
                          <div className="text-zinc-500">Qty: {it.quantity}</div>
                        </div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-zinc-900">
                        {formatTaka(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-200 flex justify-between text-xs font-bold text-zinc-950">
                  <span>Grand Total (Inc. 5% VAT & Shipping)</span>
                  <span className="font-mono text-sm">{formatTaka(total)}</span>
                </div>
              </div>

              {/* Customer Delivery Details */}
              <div>
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
                  1. Delivery Destination (Bangladesh)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-600 mb-1">Recipient Full Name</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 mb-1">Phone Number for Courier</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-600 mb-1">Street Address / House & Road</label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 mb-1">City / District</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Method */}
              <div>
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
                  2. Payment Gateway
                </h3>

                {/* Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-100 rounded-xl mb-4 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card Vault</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>bKash / Nagad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {/* Card Fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs">
                    <div className="flex items-center justify-between text-zinc-500 mb-1">
                      <span>Card Details</span>
                      <span className="font-mono text-[11px] text-zinc-400">Visa · Mastercard · Amex</span>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-mono tracking-wider focus:ring-1 focus:ring-zinc-900 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-mono text-center focus:ring-1 focus:ring-zinc-900 outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.substring(0, 4))}
                          placeholder="CVC / CVV"
                          maxLength={4}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-mono text-center focus:ring-1 focus:ring-zinc-900 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Name on card"
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-1 focus:ring-zinc-900 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Mobile Wallet (bKash / Nagad) */}
                {paymentMethod === 'apple_pay' && (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setMobileWalletType('bKash')}
                        className={`flex-1 py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                          mobileWalletType === 'bKash'
                            ? 'bg-[#E2136E] text-white border-[#E2136E]'
                            : 'bg-white text-zinc-700 border-zinc-300'
                        }`}
                      >
                        bKash Gateway
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileWalletType('Nagad')}
                        className={`flex-1 py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                          mobileWalletType === 'Nagad'
                            ? 'bg-[#F7931E] text-white border-[#F7931E]'
                            : 'bg-white text-zinc-700 border-zinc-300'
                        }`}
                      >
                        Nagad Gateway
                      </button>
                    </div>

                    <div>
                      <label className="block text-zinc-600 mb-1">{mobileWalletType} Account Number</label>
                      <input
                        type="tel"
                        value={mobileWalletNumber}
                        onChange={(e) => setMobileWalletNumber(e.target.value)}
                        placeholder="017xxxxxxxx"
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-mono tracking-wider focus:ring-1 focus:ring-zinc-900 outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      An OTP prompt will be simulated to complete direct merchant deduction.
                    </p>
                  </div>
                )}

                {/* Cash on Delivery */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-2">
                    <div className="font-semibold text-zinc-900">Cash on Delivery Verification</div>
                    <p className="text-zinc-600">
                      Payment of <span className="font-mono font-bold">{formatTaka(total)}</span> will be collected by Sundarban Priority Courier upon physical package delivery and inspection.
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Exact change or contactless mobile payment (bKash/Nagad) supported by courier.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isProcessing
                      ? 'Securely Communicating with Vault...'
                      : `Authorize & Pay ${formatTaka(total)}`}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
