export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  seller: string;
  oldPrice?: number;
  discountPercentage?: number;
  saleEndDate?: string;
  hasActiveSale?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', icon: 'solar:smartphone-broken', color: '#5e81ac' },
  { id: '2', name: 'Fashion', icon: 'solar:bag-heart-broken', color: '#bf616a' },
  { id: '3', name: 'Home', icon: 'solar:home-broken', color: '#a3be8c' },
  { id: '4', name: 'Books', icon: 'solar:book-broken', color: '#d08770' },
  { id: '5', name: 'Beauty', icon: 'solar:magic-stick-broken', color: '#b48ead' },
  { id: '6', name: 'Vehicles', icon: 'solar:wheel-broken', color: '#ebcb8b' },
  { id: '7', name: 'Real Estate', icon: 'solar:city-broken', color: '#81a1c1' },
  { id: '8', name: 'Sports', icon: 'solar:basketball-broken', color: '#88c0d0' },
  { id: '9', name: 'Gaming', icon: 'solar:gamepad-broken', color: '#b48ead' },
  { id: '10', name: 'Services', icon: 'solar:case-round-broken', color: '#a3be8c' },
];

// Generate standard dynamic countdown end date so it doesn't expire immediately.
const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
const oneDayFromNow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString();

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro',
    price: 999,
    description: 'The latest iPhone with titanium design and A17 Pro chip.',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=400&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.8,
    reviews: 1250,
    seller: 'Apple Official',
    oldPrice: 1199,
    discountPercentage: 16,
    saleEndDate: twoDaysFromNow,
    hasActiveSale: true,
  },
  {
    id: 'p2',
    name: 'MacBook Air M2',
    price: 1199,
    description: 'Supercharged by M2, incredibly thin and fast.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.9,
    reviews: 850,
    seller: 'Apple Official',
  },
  {
    id: 'p3',
    name: 'Minimalist Leather Watch',
    price: 112,
    description: 'Elegant leather watch for any occasion.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
    category: 'Fashion',
    rating: 4.5,
    reviews: 328,
    seller: 'TimeKeepers',
    oldPrice: 150,
    discountPercentage: 25,
  },
  {
    id: 'p4',
    name: 'Wireless Noise Cancelling Headphones',
    price: 349,
    description: 'Industry-leading noise cancellation with premium sound.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.7,
    reviews: 2100,
    seller: 'AudioTech',
    saleEndDate: oneDayFromNow,
    hasActiveSale: true,
  },
  {
    id: 'p5',
    name: 'Ergonomic Office Chair',
    price: 299,
    description: 'Comfortable chair for long working hours.',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400&auto=format&fit=crop',
    category: 'Home',
    seller: 'HomeComfort',
    // No rating or reviews to demonstrate that state
  },
];

export const CART_ITEMS: CartItem[] = [
  { id: 'c1', productId: 'p1', quantity: 1 },
  { id: 'c2', productId: 'p3', quantity: 2 },
];

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatar?: string;
  online?: boolean;
  type: 'personal' | 'group' | 'channel';
  status: 'sent' | 'received' | 'read' | 'pending';
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  time: string;
  senderId: string;
  status: 'sent' | 'received' | 'read' | 'pending';
}

export const CHATS: Chat[] = [
  {
    id: '1',
    name: 'علی احمدی',
    lastMessage: 'سلام، محصولات جدید کی میرسن؟',
    time: '10:30',
    unreadCount: 2,
    avatar: 'https://i.pravatar.cc/150?u=1',
    online: true,
    type: 'personal',
    status: 'received',
  },
  {
    id: '2',
    name: 'گروه عمده فروشی',
    lastMessage: 'رضا: قیمت‌ها آپدیت شد.',
    time: 'Yesterday',
    unreadCount: 0,
    type: 'group',
    status: 'read',
  },
  {
    id: '3',
    name: 'کانال تخفیف‌های کوتیک',
    lastMessage: 'تخفیف ۵۰ درصدی برای محصولات چرمی!',
    time: '9:15',
    unreadCount: 5,
    type: 'channel',
    status: 'read',
  },
  {
    id: '4',
    name: 'سارا محمدی',
    lastMessage: 'ممنون، فردا ارسال میشه.',
    time: 'Monday',
    unreadCount: 0,
    avatar: 'https://i.pravatar.cc/150?u=4',
    online: false,
    type: 'personal',
    status: 'sent',
  },
];

export const MESSAGES: Message[] = [
  {
    id: 'm1',
    chatId: '1',
    text: 'سلام، محصولات جدید کی میرسن؟',
    time: '10:30',
    senderId: '1',
    status: 'read',
  },
  {
    id: 'm2',
    chatId: '1',
    text: 'سلام علی جان، احتمالا تا آخر هفته موجود میشن.',
    time: '10:32',
    senderId: 'me',
    status: 'read',
  }
];
