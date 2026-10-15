# 08. API, Data Models and State Management — مدل‌های داده و مدیریت State

این مستند مدل‌های ساختاریافته داده‌ها (Data Schemas)، Zustand Storeها، حافظه محلی و سرویس‌های برنامه را تشریح می‌کند.

---

## 🗄️ مدل‌های داده اصلی (TypeScript Data Interfaces)

### ۱. مدل محصول (`Product`)
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice?: number;
  stockQuantity?: number;
  salesCount?: number;
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
```

### ۲. مدل گفتگو (`Chat`)
```typescript
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
```

### ۳. مدل پیام (`Message`)
```typescript
export interface Message {
  id: string;
  chatId: string;
  text: string;
  time: string;
  senderId: string;
  status: 'sent' | 'received' | 'read' | 'pending';
  attachments?: Array<{ type: 'image' | 'voice' | 'file'; url: string }>;
}
```

### ۴. مدل پروفایل کاربری (`Profile`)
```typescript
export interface Profile {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  bio?: string;
  shopName?: string;
  hasShop: boolean;
  role: 'user' | 'seller' | 'admin';
}
```

---

## ⚡ مدیریت State و Zustand Storeها

پروژه از ۴ Store اصلی با Zustand بهره می‌برد:

1. **`useStore` (`src/hooks/use-store.ts`):**
   - **مسئولیت:** سبد خرید (`cart`), لیست نشان‌شده‌ها (`favorites`), فیلترها و لیست عمومی محصولات.
   - **اکشن‌ها:** `addToCart`, `removeFromCart`, `clearCart`, `toggleFavorite`.

2. **`useMessagingStore` (`src/hooks/use-messaging-store.ts`):**
   - **مسئولیت:** مدیریت چت‌های فعال، پیام‌ها، ارسال پیام جدید، وضعیت تایپ‌کردن و خوانده شدن پیام‌ها.

3. **`useProfileStore` (`src/hooks/use-profile-store.ts`):**
   - **مسئولیت:** اطلاعات پروفایل جاری، تنظیمات فروشگاه شخصی و آواتار.

4. **`useModalStore` (`src/hooks/use-modal-store.ts`):**
   - **مسئولیت:** کنترل نمایش سیستم مودال اختصاصی (`CustomModal`).

---

## 💾 ذخیره‌سازی محلی (Local Storage)
- **کلیدهای ذخیره‌سازی MMKV / AsyncStorage:**
  - `user_theme_preference`: ذخیره پوسته انتخاب‌شده (`light` / `dark`)
  - `user_language`: زبان انتخاب‌شده (`fa` / `en`)
  - `auth_token`: توکن احراز هویت (در صورت اتصال به بک‌اند واقعی)
  - `cart_cache`: کش محلی سبد خرید
- **تأییدیه بررسی:** `SOURCE_VERIFIED`
