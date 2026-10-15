# 01. Project Overview — Kutik (کوتیک)

## 📌 معرفی پروژه
اپلیکیشن **کوتیک (Kutik / Cardiani)** یک پلتفرم فروشگاهی و ارتباطی ترکیبی (Social E-Commerce & Messaging) است که با استفاده از **React Native** و **Expo SDK 57** توسعه یافته است. این سیستم به کاربران اجازه می‌دهد به عنوان خریدار یا فروشنده، کالاهای جدید یا دست‌دوم را مرور کنند، فروشگاه اختصاصی خود را بسازند، محصولات جدید ثبت نمایند، سبد خرید را مدیریت کرده و به صورت مستقیم از طریق سیستم پیام‌رسان داخلی (چت فردی، گروهی و کانال‌ها) با خریداران و فروشندگان گفتگو و معامله کنند.

- **نام رسمی برنامه در رابط کاربری:** کوتیک (Kutik)
- **نام قبلی / شناسه پروژه:** Cardiani (`cardiani-mobile`)
- **زبان اصلی UI:** فارسی (RTL)
- **پشتیبانی از پلتفرم:** Android & iOS (تمرکز سند حاضر روی بازسازی نیتیو اندروید با Kotlin)

---

## 🏗️ معماری و فناوری‌های بکاررفته (Tech Stack)

| لایه / بخش | فناوری استفاده‌شده در Expo | معادل پیشنهادی در Native Android (Kotlin) |
| :--- | :--- | :--- |
| **زبان توسعه** | TypeScript (`tsconfig.json`) | Kotlin 2.x |
| **فریم‌ورک اصلی UI** | React Native 0.86 + Expo SDK 57 | Jetpack Compose + Material 3 |
| **ناوبری (Navigation)** | Expo Router (`expo-router/entry`) | Jetpack Navigation Compose |
| **استایل و دیزاین** | NativeWind (Tailwind CSS v4) | Compose Material3 Design Tokens |
| **مدیریت State** | Zustand (`zustand`) | ViewModel + StateFlow / SharedFlow |
| **ذخیره‌سازی محلی** | MMKV / AsyncStorage | Room Database + DataStore |
| **مدیریت فرم‌ها** | React Hook Form + Zod | Jetpack Compose Form State / Zod/Kotlin Validator |
| **آیکن‌ها** | Iconify (`@iconify-json/solar`) | Android VectorDrawables / Material Icons |
| **تصاویر و مدیا** | Expo Image (`expo-image`) | Coil 3.x for Compose |
| **افکت شیشه (Glassmorphism)**| Expo Blur (`expo-blur`) | `Modifier.blur()` / RenderEffect (Android 12+) |

---

## 📁 ساختار پوشه‌بندی پروژه اصلی Expo

```text
/
├── src/
│   ├── app/                      # ساختار Routeها و صفحات برنامه (Expo Router)
│   │   ├── (tabs)/               # تب‌های اصلی (Home, Shop, Sell, Chat, Favorites, Profile, Settings)
│   │   ├── auth/                 # جریان احراز هویت (Welcome, Phone, Verify, Profile Setup)
│   │   ├── chat/                 # سیستم پیام‌رسان (Direct, Group, Channel, Calls, Contacts)
│   │   ├── product/              # جزئیات محصول
│   │   ├── settings/             # زیرصفحات تنظیمات (ویرایش پروفایل، آدرس‌ها، سفارشات، مال و...)
│   │   ├── shop/                 # مدیریت و نمایش فروشگاه
│   │   ├── user/                 # پروفایل عمومی سایر کاربران
│   │   ├── _layout.tsx           # Layout اصلی برنامه و Root Providers
│   │   ├── cart.tsx              # سبد خرید
│   │   ├── checkout.tsx          # صفحه تسویه حساب
│   │   ├── notifications.tsx     # لیست اعلانات
│   │   └── modal.tsx             # مودال‌های عمومی
│   ├── components/               # کامپوننت‌های UI و آیکن‌ها
│   │   ├── icons/                # آیکن‌های SVG محلی استخراج‌شده از Solar
│   │   ├── messaging/            # کامپوننت‌های پیام‌رسان (Bubbles, Headers, Input, Panels)
│   │   ├── product-card/         # کارت‌های محصول و تخفیف‌ها
│   │   └── ui/                   # کامپوننت‌های پایه (ModernHeader, CustomModal, FloatingDrawer)
│   ├── constants/                # رنگ‌ها، تم‌ها، داده‌های نمونه (mock-data.ts, theme.ts)
│   ├── hooks/                    # Hookهای اختصاصی و Zustand Stores
│   ├── services/                 # سرویس‌های Mock Data و Messaging
│   └── types/                    # تعاریف Typeها
```

---

## 🔗 نقطه ورود و نحوه اجرای برنامه
- **نقطه ورود در Expo:** `src/app/_layout.tsx`
- **حالت عملکرد (Mock Mode):** برنامه به صورت کاملاً ایزوله همراه با Mock Data محلی درون `src/constants/mock-data.ts` و `src/services/MockDataGenerator.ts` اجرا می‌شود و نیازی به سرور بک‌اند فعال برای مشاهده طرح کامل ندارد.
- **تأییدیه بررسی:** `SOURCE_VERIFIED`
