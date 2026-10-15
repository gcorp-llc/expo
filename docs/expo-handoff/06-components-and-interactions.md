# 06. Components and Interactions — کامپوننت‌های قابل استفاده مجدد و تعاملات

این مستند تمام کامپوننت‌های اصلی رابط کاربری، ورودی‌های آن‌ها (Props)، رفتارهای تعاملی (Interactions) و Stateهای مربوطه را شرح می‌دهد.

---

## 🧩 فهرست کامپوننت‌های کلیدی سیستم

### ۱. `ModernHeader` (`src/components/ui/ModernHeader.tsx`)
- **توصیف:** هدر اصلی شیشه‌ای (Glassmorphism) برنامه‌های اندروید و iOS.
- **ویژگی‌ها:**
  - پشتیبانی از دکمه بازگشت خودکار در صورت وجود تاریخچه
  - دکمه‌های اکشن سمت چپ و راست (Left/Right Actions)
  - عنوان مرکزی با فونت ۱۷px Bold
  - پس‌زمینه شفاف با Blur
- **Props اصلی:** `title`, `showBackButton`, `rightElement`, `leftElement`, `transparent`

### ۲. `FloatingIconButton` (`src/components/ui/FloatingIconButton.tsx`)
- **توصیف:** دکمه مربعی با گوشه‌های گرد که در هدرها و اکشن بارها استفاده می‌شود.
- **مشخصات بصری:** سایز `42x42dp`، شعاع انحنا `14dp`، پس‌زمینه کارت، بوردور باریک، بازخورد لمسی (Haptic Feedback).
- **Props اصلی:** `icon`, `onPress`, `badgeCount`, `disabled`

### ۳. `ProductCard` (`src/components/product-card/ProductCard.tsx`)
- **توصیف:** کارت نمایش محصول در شبکه‌های ۲ ستونه خانه و فروشگاه.
- **ویژگی‌ها:**
  - تصویر کالا با نسبت ابعاد ۱:۱ و گوشه‌های گرد
  - نشان تخفیف (Discount Badge)
  - نشان لایک / علاقه‌مندی (Favorite Button)
  - تایمر معکوس فروش ویژه (Sale Countdown)
  - قیمت اصلی و قیمت با تخفیف
- **Props اصلی:** `product`, `onPress`, `onFavoriteToggle`

### ۴. `ChatItem` (`src/components/telegram/ChatItem.tsx`)
- **توصیف:** آیتم نمایش گفتگو در لیست چت‌ها.
- **ویژگی‌ها:**
  - آواتار دایره‌ای کاربری/گروهی با نشانگر آنلاین بودن سبز
  - عنوان چت و زمان آخرین پیام
  - پیش‌نمایش آخرین پیام (با پشتیبانی از نشان‌دادن وضعیت ارسال/خواندن)
  - نشانگر تعداد پیام‌های خوانده‌نشده (Unread Badge)
- **Props اصلی:** `chat`, `onPress`

### ۵. `CustomModal` (`src/components/ui/CustomModal.tsx`)
- **توصیف:** سیستم مودال و Alert سفارشی جایگزین `Alert.alert` نیتیو.
- **ویژگی‌ها:**
  - انیمیشن ورود و خروج نرم (FadeIn/FadeOut ۲۵۰ میلی‌ثانیه)
  - عنوان، متن پیام، دکمه تایید و دکمه انصراف
  - دکمه‌های اختصاصی خطرناک (Destructive Button) با رنگ قرمز
- **مدیریت State:** با استفاده از Zustand Store محلی (`useModalStore`) کنترل می‌شود.

### ۶. `SelectionModal` (`src/components/ui/SelectionModal.tsx`)
- **توصیف:** مودال انتخابی دارای ۲ گزینه استاندارد: دوربین (`solar:camera-minimalistic-broken`) و گالری (`solar:gallery-wide-line-duotone`).
- **ویژگی‌ها:** بدون دکمه لغو صریح؛ کلیک روی لایه خاکستری بیرونی مودال را می‌بندد.

### ۷. `ShareBottomSheet` (`src/components/ui/ShareBottomSheet.tsx`)
- **توصیف:** کشوی اشتراک‌گذاری محصول، فروشگاه یا پروفایل.
- **ویژگی‌ها:** امکان کپی لینک، ارسال مستقیم به چت‌های اخیر، و اشتراک‌گذاری نیتیو.

---

## ⚡ تعاملات و انیمیشن‌ها (Interactions)
- **بازخورد لمسی (Haptics):** در هنگام کلیک روی دکمه‌های اصلی و لایک محصولات، متد `expo-haptics` (نوع `Selection` یا `ImpactLight`) فراخوانی می‌شود.
- **انیمیشن انتقال صفحات:** تمام انیمیشن‌های تغییر صفحه از نوع Slide horizontal / Fade نرم با زمان‌بندی ۲۰۰ تا ۳۰۰ میلی‌ثانیه هستند.
- **تأییدیه بررسی:** `SOURCE_VERIFIED`
