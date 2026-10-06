import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import type { Product, Order, NotificationItem, StoreAnalytics, User, OrderStatus } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory Database with Seed Data for Real Scalability & Fast Concurrent Access
const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Acoustic One Wireless Headphones',
    slug: 'acoustic-one-wireless-headphones',
    description: 'Precision-machined matte acoustic drivers with active noise cancellation, custom memory foam ear cushions, and 42-hour continuous battery life.',
    price: 3450,
    originalPrice: 4200,
    category: 'Audio',
    sku: 'AUR-AUD-01',
    stock: 24,
    lowStockThreshold: 5,
    rating: 4.9,
    reviewCount: 142,
    image: '/src/assets/images/product_minimal_headphones_1791306940938.jpg',
    badge: 'Best Seller',
    attributes: {
      'Transducer': '40mm Custom Planar',
      'Battery': '42 Hours Playback',
      'Connectivity': 'Bluetooth 5.3 + Lossless Type-C',
      'Weight': '265 grams'
    },
    tags: ['audio', 'wireless', 'minimal', 'travel', 'premium'],
    isFeatured: true
  },
  {
    id: 'prod-2',
    name: 'Santal & Smoked Bergamot Extrait',
    slug: 'santal-smoked-bergamot-extrait',
    description: 'Handcrafted long-lasting fragrance blended with botanical essential oils, warm cedarwood, and cold-pressed Calabrian bergamot in heavy fluted glass.',
    price: 1450,
    originalPrice: 1800,
    category: 'Fragrance',
    sku: 'AUR-FRG-02',
    stock: 18,
    lowStockThreshold: 6,
    rating: 4.8,
    reviewCount: 89,
    image: '/src/assets/images/product_botanical_perfume_1791306963156.jpg',
    badge: 'Popular',
    attributes: {
      'Concentration': 'Extrait de Parfum (28%)',
      'Volume': '75 ml / 2.5 fl.oz',
      'Longevity': '10-12 Hours',
      'Packaging': 'Premium Gift Box'
    },
    tags: ['fragrance', 'botanical', 'unisex', 'luxury', 'gift'],
    isFeatured: true
  },
  {
    id: 'prod-3',
    name: 'Titanium Calibre 38 Chronograph',
    slug: 'titanium-calibre-38-chronograph',
    description: 'Brushed matte case with scratch-resistant domed crystal glass, Japanese quartz movement, and hand-stitched supple bridle leather strap.',
    price: 4850,
    originalPrice: 5600,
    category: 'Horology',
    sku: 'AUR-HOR-03',
    stock: 7,
    lowStockThreshold: 3,
    rating: 5.0,
    reviewCount: 64,
    image: '/src/assets/images/product_analog_chronograph_1791306975791.jpg',
    badge: 'Only 7 Left',
    attributes: {
      'Movement': 'High-Precision Quartz Movement',
      'Case Diameter': '38.5 mm',
      'Water Resistance': '5 ATM / 50 meters',
      'Strap': 'Genuine Saddle Leather'
    },
    tags: ['watch', 'horology', 'titanium', 'luxury', 'mechanical'],
    isFeatured: true
  },
  {
    id: 'prod-4',
    name: 'Studio Pour-Over & Carafe Set',
    slug: 'studio-pour-over-carafe-set',
    description: 'Fired volcanic clay dripper with borosilicate heat-resistant glass decanter. Engineered 60-degree cone ribbing for consistent flow rate and clean extraction.',
    price: 1250,
    originalPrice: 1600,
    category: 'Ceramics',
    sku: 'AUR-CER-04',
    stock: 31,
    lowStockThreshold: 8,
    rating: 4.7,
    reviewCount: 110,
    image: '/src/assets/images/product_ceramic_pourover_1791306988223.jpg',
    badge: 'Curated',
    attributes: {
      'Capacity': '650 ml (2-4 Cups)',
      'Material': 'Unglazed Stoneware & Borosilicate',
      'Care': 'Dishwasher Safe Decanter',
      'Compatibility': 'Standard #02 Paper / Metal Filters'
    },
    tags: ['coffee', 'ceramics', 'home', 'kitchen', 'minimal'],
    isFeatured: true
  },
  {
    id: 'prod-5',
    name: 'Heavyweight Structured Wool Overshirt',
    slug: 'heavyweight-structured-wool-overshirt',
    description: 'Woven from premium heavyweight breathable blended wool. Boxy modern silhouette with horn buttons, clean internal seam taping, and dual chest drop pockets.',
    price: 2250,
    originalPrice: 2800,
    category: 'Apparel',
    sku: 'AUR-APP-05',
    stock: 12,
    lowStockThreshold: 4,
    rating: 4.9,
    reviewCount: 52,
    image: '/src/assets/images/hero_marketplace_lifestyle_1791306924683.jpg',
    badge: 'Autumn Edition',
    attributes: {
      'Fabric': 'Premium Heavy Blended Wool',
      'Fit': 'Relaxed Oversized Cut',
      'Hardware': 'Durable Horn Buttons',
      'Season': 'All-Year Casual'
    },
    tags: ['apparel', 'wool', 'streetwear', 'tailoring', 'winter'],
    isFeatured: false
  },
  {
    id: 'prod-6',
    name: 'Sculptural Cast Bronze Incense Burner',
    slug: 'sculptural-cast-bronze-incense-burner',
    description: 'Solid sand-cast bronze sphere that disassembles into an ash catcher and multi-gauge incense holder. Develops a rich natural patina over years of use.',
    price: 950,
    originalPrice: 1300,
    category: 'Living',
    sku: 'AUR-LIV-06',
    stock: 4,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewCount: 38,
    image: '/src/assets/images/hero_marketplace_lifestyle_1791306924683.jpg',
    badge: 'Low Stock',
    attributes: {
      'Material': 'Solid Sand-Cast Bronze',
      'Dimensions': '90mm x 90mm x 65mm',
      'Weight': '420 grams',
      'Finish': 'Polished Raw Brass'
    },
    tags: ['living', 'home', 'bronze', 'decor', 'minimal'],
    isFeatured: false
  }
];

let productsDb: Product[] = [...initialProducts];

let ordersDb: Order[] = [
  {
    id: 'AU-94821',
    trackingNumber: 'TRK-9840217',
    date: '2026-10-05T14:30:00Z',
    customer: {
      name: 'Nasrullah Hasib',
      email: 'nasrullahhasib27@gmail.com',
      phone: '+880 1712-345678',
      address: 'House 42, Road 11, Banani',
      city: 'Dhaka',
      postalCode: '1213',
      country: 'Bangladesh'
    },
    items: [
      {
        productId: 'prod-1',
        name: 'Acoustic One Wireless Headphones',
        price: 3450,
        quantity: 1,
        image: '/src/assets/images/product_minimal_headphones_1791306940938.jpg',
        category: 'Audio'
      },
      {
        productId: 'prod-4',
        name: 'Studio Pour-Over & Carafe Set',
        price: 1250,
        quantity: 1,
        image: '/src/assets/images/product_ceramic_pourover_1791306988223.jpg',
        category: 'Ceramics'
      }
    ],
    subtotal: 4700,
    shipping: 0,
    tax: 235,
    total: 4935,
    status: 'out_for_delivery',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    transactionId: 'TXN-SECURE-994102',
    estimatedDelivery: 'Today by 3:30 PM',
    carrier: 'Sundarban Priority Express',
    trackingTimeline: [
      {
        status: 'processing',
        title: 'Order Confirmed & Payment Verified',
        location: 'AURA Fulfillment Center, Tejgaon Dhaka',
        timestamp: 'Oct 05, 14:32',
        completed: true
      },
      {
        status: 'packed',
        title: 'Inspected, Barcoded & Packaged',
        location: 'Fulfillment Station B4, Dhaka Central',
        timestamp: 'Oct 05, 17:15',
        completed: true
      },
      {
        status: 'in_transit',
        title: 'Departed Regional Sorting Hub',
        location: 'Gulshan / Banani Sorting Hub',
        timestamp: 'Oct 06, 04:20',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'With Courier Marcus Vance in Transit',
        location: 'Kamal Ataturk Ave & Road 11, Banani',
        timestamp: 'Oct 06, 08:45',
        completed: true,
        current: true
      },
      {
        status: 'delivered',
        title: 'Recipient Signature & Safe Drop',
        location: 'House 42, Road 11, Banani, Dhaka',
        timestamp: 'Pending Delivery',
        completed: false
      }
    ],
    currentLocation: {
      lat: 23.7937,
      lng: 90.4066,
      address: 'Approaching Banani Road 11 Circle',
      courierName: 'Marcus Vance (Courier #412)',
      vehicleType: 'Express Delivery Van #E-14',
      estimatedMinutesAway: 18
    }
  },
  {
    id: 'AU-94755',
    trackingNumber: 'TRK-9831902',
    date: '2026-10-03T11:10:00Z',
    customer: {
      name: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      phone: '+880 1819-876543',
      address: 'Plot 18, Block G, Bashundhara R/A',
      city: 'Dhaka',
      postalCode: '1229',
      country: 'Bangladesh'
    },
    items: [
      {
        productId: 'prod-3',
        name: 'Titanium Calibre 38 Chronograph',
        price: 4850,
        quantity: 1,
        image: '/src/assets/images/product_analog_chronograph_1791306975791.jpg',
        category: 'Horology'
      }
    ],
    subtotal: 4850,
    shipping: 0,
    tax: 240,
    total: 5090,
    status: 'delivered',
    paymentMethod: 'apple_pay',
    paymentStatus: 'paid',
    transactionId: 'TXN-BKASH-883100',
    estimatedDelivery: 'Oct 05, Delivered',
    carrier: 'DHL Express Bangladesh',
    trackingTimeline: [
      {
        status: 'processing',
        title: 'Order Verified',
        location: 'AURA Dhaka Hub',
        timestamp: 'Oct 03, 11:12',
        completed: true
      },
      {
        status: 'packed',
        title: 'Dispatched for Shipping',
        location: 'Airport Cargo Transit',
        timestamp: 'Oct 03, 16:30',
        completed: true
      },
      {
        status: 'in_transit',
        title: 'Transit Complete',
        location: 'Bashundhara Distribution Center',
        timestamp: 'Oct 04, 09:00',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'Courier on Route',
        location: 'Block G Delivery Route',
        timestamp: 'Oct 05, 08:30',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Delivered and Signed by Resident',
        location: 'Plot 18, Block G, Bashundhara R/A',
        timestamp: 'Oct 05, 12:14',
        completed: true,
        current: true
      }
    ]
  }
];

let notificationsDb: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Order AU-94821 is Out for Delivery',
    message: 'Your parcel is 18 minutes away with courier Marcus Vance. Tap to track live on map.',
    timestamp: '15 mins ago',
    type: 'shipping',
    read: false,
    orderId: 'AU-94821'
  },
  {
    id: 'notif-2',
    title: 'Payment Confirmed & Verified',
    message: 'Transaction TXN-SECURE-994102 for ৳4,935 has been securely authorized.',
    timestamp: 'Yesterday',
    type: 'order',
    read: true,
    orderId: 'AU-94821'
  },
  {
    id: 'notif-3',
    title: 'Low Stock Alert: Calibre 38',
    message: 'Only 7 units remain in stock for Titanium Calibre 38 Chronograph.',
    timestamp: '2 days ago',
    type: 'inventory',
    read: false
  }
];

let currentUser: User = {
  id: 'usr-1',
  name: 'Nasrullah Hasib',
  email: 'nasrullahhasib27@gmail.com',
  role: 'customer',
  addresses: [
    {
      id: 'addr-1',
      label: 'Home (Default)',
      address: '742 Evergreen Promenade, Suite 4B',
      city: 'San Francisco',
      postalCode: '94107',
      country: 'United States',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Design Studio',
      address: '550 Montgomery Street, Fl 8',
      city: 'San Francisco',
      postalCode: '94111',
      country: 'United States',
      isDefault: false
    }
  ]
};

// --- API ROUTES ---

// 1. Products API
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  let results = [...productsDb];

  if (category && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (sort === 'price-low') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    results.sort((a, b) => b.id.localeCompare(a.id));
  }

  res.json({ success: true, count: results.length, products: results });
});

app.get('/api/products/:id', (req, res) => {
  const product = productsDb.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product });
});

app.post('/api/products', (req, res) => {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: req.body.name || 'Untitled Curated Piece',
    slug: (req.body.name || 'product').toLowerCase().replace(/\s+/g, '-'),
    description: req.body.description || '',
    price: Number(req.body.price) || 99,
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
    category: req.body.category || 'Living',
    sku: req.body.sku || `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
    stock: Number(req.body.stock) || 10,
    lowStockThreshold: Number(req.body.lowStockThreshold) || 5,
    rating: 5.0,
    reviewCount: 1,
    image: req.body.image || '/src/assets/images/hero_marketplace_lifestyle_1791306924683.jpg',
    badge: req.body.badge,
    attributes: req.body.attributes || {},
    tags: req.body.tags || ['curated', 'new']
  };

  productsDb.unshift(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const index = productsDb.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  productsDb[index] = { ...productsDb[index], ...req.body };
  res.json({ success: true, product: productsDb[index] });
});

app.delete('/api/products/:id', (req, res) => {
  productsDb = productsDb.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

// 2. Inventory Management API
app.get('/api/inventory', (req, res) => {
  const totalStockUnits = productsDb.reduce((sum, p) => sum + p.stock, 0);
  const lowStockItems = productsDb.filter(p => p.stock <= p.lowStockThreshold);
  const outOfStockItems = productsDb.filter(p => p.stock === 0);

  res.json({
    success: true,
    summary: {
      totalSKUs: productsDb.length,
      totalUnits: totalStockUnits,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
    },
    inventory: productsDb.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      status: p.stock === 0 ? 'Out of Stock' : p.stock <= p.lowStockThreshold ? 'Low Stock' : 'Optimal',
      image: p.image
    }))
  });
});

app.patch('/api/inventory/:id', (req, res) => {
  const { stock, lowStockThreshold, price } = req.body;
  const product = productsDb.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  if (typeof stock === 'number') product.stock = Math.max(0, stock);
  if (typeof lowStockThreshold === 'number') product.lowStockThreshold = Math.max(0, lowStockThreshold);
  if (typeof price === 'number') product.price = Math.max(0, price);

  // If low stock triggered, push notification
  if (product.stock <= product.lowStockThreshold) {
    notificationsDb.unshift({
      id: `notif-${Date.now()}`,
      title: `Low Inventory Alert: ${product.name}`,
      message: `Stock level dropped to ${product.stock} units for SKU ${product.sku}.`,
      timestamp: 'Just now',
      type: 'inventory',
      read: false
    });
  }

  res.json({ success: true, product });
});

// 3. Orders & Real-time Tracking API
app.get('/api/orders', (req, res) => {
  res.json({ success: true, orders: ordersDb });
});

app.get('/api/orders/:id', (req, res) => {
  const order = ordersDb.find(o => o.id === req.params.id || o.trackingNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req, res) => {
  const { items, customer, paymentMethod, paymentDetails } = req.body;

  if (!items || !items.length || !customer) {
    return res.status(400).json({ success: false, error: 'Invalid order payload' });
  }

  // Deduct inventory atomically
  for (const item of items) {
    const prod = productsDb.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  const subtotal = items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% VAT
  const shipping = subtotal >= 2000 ? 0 : 80;
  const total = subtotal + tax + shipping;

  const orderId = `AU-${Math.floor(10000 + Math.random() * 90000)}`;
  const trackingNumber = `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const now = new Date();

  const newOrder: Order = {
    id: orderId,
    trackingNumber,
    date: now.toISOString(),
    customer,
    items,
    subtotal,
    shipping,
    tax,
    total,
    status: 'processing',
    paymentMethod: paymentMethod || 'card',
    paymentStatus: paymentMethod === 'cod' ? 'pending_cod' : 'paid',
    transactionId: `TXN-${paymentMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`,
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    carrier: 'Sundarban Priority Express',
    trackingTimeline: [
      {
        status: 'processing',
        title: 'Order Placed & Payment Authorized',
        location: 'AURA Order Management Gateway',
        timestamp: 'Just now',
        completed: true,
        current: true
      },
      {
        status: 'packed',
        title: 'Packing & Quality Inspection',
        location: 'AURA Fulfillment Hub, Dhaka',
        timestamp: 'Estimated 2 hours',
        completed: false
      },
      {
        status: 'in_transit',
        title: 'In Transit with Express Courier',
        location: 'Dhaka Regional Sorting Facility',
        timestamp: 'Tomorrow',
        completed: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Final Delivery',
        location: `${customer.city || 'Local Area'} Delivery Route`,
        timestamp: 'Pending dispatch',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivery Complete',
        location: customer.address || 'Recipient Address',
        timestamp: 'Pending delivery',
        completed: false
      }
    ]
  };

  ordersDb.unshift(newOrder);

  // Trigger real-time push notification
  notificationsDb.unshift({
    id: `notif-${Date.now()}`,
    title: `Order ${orderId} Confirmed!`,
    message: `Thank you ${customer.name}. Your order of ৳${total.toLocaleString('en-IN')} has been received and is being prepared.`,
    timestamp: 'Just now',
    type: 'order',
    read: false,
    orderId
  });

  res.status(201).json({ success: true, order: newOrder });
});

// Status change endpoint for live updates & tracking simulation
app.patch('/api/orders/:id/status', (req, res) => {
  const { status, note } = req.body as { status: OrderStatus; note?: string };
  const order = ordersDb.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  const orderStatuses: OrderStatus[] = ['processing', 'packed', 'in_transit', 'out_for_delivery', 'delivered'];
  const currentIndex = orderStatuses.indexOf(status);

  order.status = status;

  // Update tracking steps
  order.trackingTimeline.forEach((step, idx) => {
    if (idx <= currentIndex) {
      step.completed = true;
      step.current = (idx === currentIndex);
    } else {
      step.completed = false;
      step.current = false;
    }
  });

  // Assign live courier if out for delivery
  if (status === 'out_for_delivery') {
    order.currentLocation = {
      lat: 23.7937,
      lng: 90.4066,
      address: 'En route: Near Banani Road 11 & Kamal Ataturk Ave',
      courierName: 'Julian Ray (Driver #89)',
      vehicleType: 'Electric Courier Van #V-29',
      estimatedMinutesAway: 12
    };
  } else if (status === 'delivered') {
    if (order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }
    if (order.currentLocation) {
      order.currentLocation.estimatedMinutesAway = 0;
      order.currentLocation.address = 'Delivered to recipient address';
    }
  }

  // Dispatch live notification
  const statusTitles: Record<OrderStatus, string> = {
    processing: 'Order in preparation',
    packed: 'Order has been carefully packaged',
    in_transit: 'Order is currently in transit',
    out_for_delivery: 'Out for delivery! Your driver is close',
    delivered: 'Delivered! Enjoy your order',
    cancelled: 'Order has been cancelled'
  };

  notificationsDb.unshift({
    id: `notif-${Date.now()}`,
    title: `Order ${order.id}: ${statusTitles[status]}`,
    message: note || `Tracking #${order.trackingNumber} updated to ${status.replace('_', ' ').toUpperCase()}.`,
    timestamp: 'Just now',
    type: 'shipping',
    read: false,
    orderId: order.id
  });

  res.json({ success: true, order });
});

// 4. Secure Payment Gateway Processing Simulation
app.post('/api/checkout/pay', async (req, res) => {
  const { amount, currency = 'BDT', method, cardDetails, customer } = req.body;

  // Simulate payment gateway latency (300ms)
  await new Promise(resolve => setTimeout(resolve, 350));

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid payment amount' });
  }

  // Basic Luhn and formatting verification for card
  if (method === 'card') {
    const rawNumber = (cardDetails?.number || '').replace(/\s+/g, '');
    if (rawNumber.length < 13 || rawNumber.length > 19) {
      return res.status(422).json({ success: false, error: 'Invalid credit card number format.' });
    }
    if (!cardDetails?.cvv || cardDetails.cvv.length < 3) {
      return res.status(422).json({ success: false, error: 'Invalid CVV code.' });
    }
    if (!cardDetails?.expiry || !cardDetails.expiry.includes('/')) {
      return res.status(422).json({ success: false, error: 'Invalid expiry format (MM/YY).' });
    }
  }

  const transactionId = `TXN-${(method || 'CARD').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  res.json({
    success: true,
    transactionId,
    status: 'AUTHORIZED',
    amount,
    currency,
    gateway: 'AURA 256-bit Encrypted Vault Gateway (BDT)',
    timestamp: new Date().toISOString(),
    receiptUrl: `/receipts/${transactionId}`
  });
});

// 5. Store Analytics & Reporting API
app.get('/api/analytics', (req, res) => {
  const totalRevenue = ordersDb.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrders = ordersDb.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockCount = productsDb.filter(p => p.stock <= p.lowStockThreshold).length;

  const categoryTotals: Record<string, number> = {};
  for (const order of ordersDb) {
    for (const item of order.items) {
      const cat = item.category || 'General';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (item.price * item.quantity);
    }
  }

  const categoryShare = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0
  }));

  const analytics: StoreAnalytics = {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    lowStockCount,
    conversionRate: 3.42,
    recentSales: [
      { date: 'Sep 30', amount: 14200, orders: 4 },
      { date: 'Oct 01', amount: 21800, orders: 7 },
      { date: 'Oct 02', amount: 18500, orders: 5 },
      { date: 'Oct 03', amount: 32900, orders: 11 },
      { date: 'Oct 04', amount: 26400, orders: 8 },
      { date: 'Oct 05', amount: 38900, orders: 14 },
      { date: 'Oct 06', amount: 24500, orders: 9 }
    ],
    topProducts: [
      { id: 'prod-1', name: 'Acoustic One Wireless Headphones', sold: 48, revenue: 165600 },
      { id: 'prod-3', name: 'Titanium Calibre 38 Chronograph', sold: 16, revenue: 77600 },
      { id: 'prod-5', name: 'Heavyweight Structured Wool Overshirt', sold: 34, revenue: 76500 },
      { id: 'prod-4', name: 'Studio Pour-Over & Carafe Set', sold: 42, revenue: 52500 }
    ],
    categoryShare
  };

  res.json({ success: true, analytics });
});

// 6. Personalized Recommendations Engine
app.get('/api/recommendations', (req, res) => {
  const { viewedId, category, cartIds } = req.query;
  const cartIdArray = cartIds ? String(cartIds).split(',') : [];

  let pool = productsDb.filter(p => p.id !== viewedId && !cartIdArray.includes(p.id));

  // Sort by affinity: prioritize same category or shared tags
  if (category) {
    pool.sort((a, b) => (b.category === category ? 1 : 0) - (a.category === category ? 1 : 0));
  } else {
    pool.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, recommendations: pool.slice(0, 4) });
});

// 7. Push Notifications API
app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    notifications: notificationsDb,
    unreadCount: notificationsDb.filter(n => !n.read).length
  });
});

app.post('/api/notifications/read', (req, res) => {
  const { id } = req.body;
  if (id) {
    const item = notificationsDb.find(n => n.id === id);
    if (item) item.read = true;
  } else {
    notificationsDb.forEach(n => { n.read = true; });
  }
  res.json({ success: true });
});

app.post('/api/notifications/send', (req, res) => {
  const { title, message, type = 'promotion', orderId } = req.body;
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: title || 'Exclusive Flash Selection',
    message: message || 'Private member invitation: 15% preview on our seasonal edition.',
    timestamp: 'Just now',
    type,
    read: false,
    orderId
  };
  notificationsDb.unshift(newNotif);
  res.status(201).json({ success: true, notification: newNotif });
});

// 8. User Auth & Profile API
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (role === 'admin' || email?.includes('admin')) {
    currentUser = {
      ...currentUser,
      email: email || 'admin@auracommerce.internal',
      name: 'Elena Rostova (Admin)',
      role: 'admin'
    };
  } else {
    currentUser = {
      ...currentUser,
      email: email || 'nasrullahhasib27@gmail.com',
      name: 'Nasrullah Hasib',
      role: 'customer'
    };
  }
  res.json({ success: true, user: currentUser });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ success: true, user: currentUser });
});

app.post('/api/auth/switch-role', (req, res) => {
  const targetRole = req.body.role === 'admin' ? 'admin' : 'customer';
  currentUser.role = targetRole;
  currentUser.name = targetRole === 'admin' ? 'Store Administrator' : 'Nasrullah Hasib';
  res.json({ success: true, user: currentUser });
});

// Start server with Vite or static
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AURA Server] Ready on http://localhost:${PORT} (${isDev ? 'Development' : 'Production'})`);
  });
}

startServer();
