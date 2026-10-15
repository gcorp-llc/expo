# 02. Screen Inventory — لیست کامل صفحات و Routeها

تمام ۵۳ مسیر (Route) شناسایی‌شده در پروژه Expo در این مستند فهرست شده‌اند. هر صفحه دارای یک کد شناسایی اختصاصی (Element ID Prefix) برای ردیابی دقیق در مستندات و تست‌های پذیرش نیتیو اندروید می‌باشد.

---

## 📱 جدول جامع صفحات برنامه

| # | عنوان صفحه | مسیر Expo Router | مسیر فایل سورس | کد ردیابی | وضعیت بررسی | مستند اختصاصی |
|---|---|---|---|---|---|---|
| 1 | ریشه / ورودی اصلی | `/` | `src/app/index.tsx` | `ROOT` | `SOURCE_VERIFIED` | [root.md](screens/root.md) |
| 2 | تب‌های اصلی (Layout) | `/(tabs)` | `src/app/(tabs)/_layout.tsx` | `TAB-NAV` | `SOURCE_VERIFIED` | [tabs-layout.md](screens/tabs-layout.md) |
| 3 | خانه / کشف (Feed) | `/(tabs)` | `src/app/(tabs)/index.tsx` | `HOME` | `SOURCE_VERIFIED` | [home.md](screens/home.md) |
| 4 | فروشگاه / بازار | `/(tabs)/shop` | `src/app/(tabs)/shop.tsx` | `SHOP-MAIN` | `SOURCE_VERIFIED` | [shop-main.md](screens/shop-main.md) |
| 5 | ثبت آگهی جدید | `/(tabs)/sell` | `src/app/(tabs)/sell.tsx` | `POST-ITEM` | `SOURCE_VERIFIED` | [sell-post.md](screens/sell-post.md) |
| 6 | لیست گفتگوها (Chat List) | `/(tabs)/chat` | `src/app/(tabs)/chat.tsx` | `CHAT-LIST` | `SOURCE_VERIFIED` | [chat-list.md](screens/chat-list.md) |
| 7 | نشان‌شده‌ها (علاقه‌مندی‌ها) | `/(tabs)/favorites` | `src/app/(tabs)/favorites.tsx` | `FAVORITES` | `SOURCE_VERIFIED` | [favorites.md](screens/favorites.md) |
| 8 | پروفایل کاربری تب | `/(tabs)/profile` | `src/app/(tabs)/profile.tsx` | `PROFILE-TAB` | `SOURCE_VERIFIED` | [profile-tab.md](screens/profile-tab.md) |
| 9 | تنظیمات اصلی | `/(tabs)/settings` | `src/app/(tabs)/settings.tsx` | `SETTINGS-TAB` | `SOURCE_VERIFIED` | [settings-tab.md](screens/settings-tab.md) |
| 10 | خوش‌آمدگویی (Auth) | `/auth/welcome` | `src/app/auth/welcome.tsx` | `AUTH-WELCOME` | `SOURCE_VERIFIED` | [auth-welcome.md](screens/auth-welcome.md) |
| 11 | ورود با تلفن همراه | `/auth/phone` | `src/app/auth/phone.tsx` | `AUTH-PHONE` | `SOURCE_VERIFIED` | [auth-phone.md](screens/auth-phone.md) |
| 12 | تأیید کد OTP | `/auth/verify` | `src/app/auth/verify.tsx` | `AUTH-VERIFY` | `SOURCE_VERIFIED` | [auth-verify.md](screens/auth-verify.md) |
| 13 | تکمیل پروفایل اولیه | `/auth/profile` | `src/app/auth/profile.tsx` | `AUTH-PROFILE` | `SOURCE_VERIFIED` | [auth-profile.md](screens/auth-profile.md) |
| 14 | گفتگو مستقیم (Direct Chat) | `/chat/[id]` | `src/app/chat/[id].tsx` | `DIRECT-CHAT` | `SOURCE_VERIFIED` | [direct-chat.md](screens/direct-chat.md) |
| 15 | نمایش کانال | `/chat/channel/[id]` | `src/app/chat/channel/[id].tsx` | `CHANNEL-VIEW` | `SOURCE_VERIFIED` | [channel-view.md](screens/channel-view.md) |
| 16 | ایجاد کانال - جزئیات | `/chat/channel/create-details` | `src/app/chat/channel/create-details.tsx` | `CREATE-CHANNEL-DETAILS` | `SOURCE_VERIFIED` | [create-channel-details.md](screens/create-channel-details.md) |
| 17 | ایجاد کانال - تنظیمات | `/chat/channel/create-settings` | `src/app/chat/channel/create-settings.tsx` | `CREATE-CHANNEL-SETTINGS` | `SOURCE_VERIFIED` | [create-channel-settings.md](screens/create-channel-settings.md) |
| 18 | نمایش گروه | `/chat/group/[id]` | `src/app/chat/group/[id].tsx` | `GROUP-VIEW` | `SOURCE_VERIFIED` | [group-view.md](screens/group-view.md) |
| 19 | ایجاد گروه - جزئیات | `/chat/group/create-details` | `src/app/chat/group/create-details.tsx` | `CREATE-GROUP-DETAILS` | `SOURCE_VERIFIED` | [create-group-details.md](screens/create-group-details.md) |
| 20 | ایجاد گروه - اعضا | `/chat/group/create-members` | `src/app/chat/group/create-members.tsx` | `CREATE-GROUP-MEMBERS` | `SOURCE_VERIFIED` | [create-group-members.md](screens/create-group-members.md) |
| 21 | تماس صوتی | `/chat/calls/voice` | `src/app/chat/calls/voice.tsx` | `VOICE-CALL` | `SOURCE_VERIFIED` | [voice-call.md](screens/voice-call.md) |
| 22 | تماس تصویری | `/chat/calls/video` | `src/app/chat/calls/video.tsx` | `VIDEO-CALL` | `SOURCE_VERIFIED` | [video-call.md](screens/video-call.md) |
| 23 | مخاطبین | `/chat/contacts` | `src/app/chat/contacts.tsx` | `CONTACTS` | `SOURCE_VERIFIED` | [contacts.md](screens/contacts.md) |
| 24 | سبد خرید | `/cart` | `src/app/cart.tsx` | `CART` | `SOURCE_VERIFIED` | [cart.md](screens/cart.md) |
| 25 | تسویه حساب / خرید | `/checkout` | `src/app/checkout.tsx` | `CHECKOUT` | `SOURCE_VERIFIED` | [checkout.md](screens/checkout.md) |
| 26 | اعلانات | `/notifications` | `src/app/notifications.tsx` | `NOTIFICATIONS` | `SOURCE_VERIFIED` | [notifications.md](screens/notifications.md) |
| 27 | جزئیات کالا (عمومی) | `/product/[id]` | `src/app/product/[id].tsx` | `PRODUCT-DETAIL` | `SOURCE_VERIFIED` | [product-detail.md](screens/product-detail.md) |
| 28 | پروفایل فروشگاه | `/shop/[id]` | `src/app/shop/[id].tsx` | `SHOP-VIEW` | `SOURCE_VERIFIED` | [shop-view.md](screens/shop-view.md) |
| 29 | ساخت فروشگاه | `/shop/create` | `src/app/shop/create.tsx` | `SHOP-CREATE` | `SOURCE_VERIFIED` | [shop-create.md](screens/shop-create.md) |
| 30 | مدیریت فروشگاه | `/shop/manage` | `src/app/shop/manage.tsx` | `SHOP-MANAGE` | `SOURCE_VERIFIED` | [shop-manage.md](screens/shop-manage.md) |
| 31 | افزودن محصول | `/shop/add-product` | `src/app/shop/add-product.tsx` | `SHOP-ADD-PRODUCT` | `SOURCE_VERIFIED` | [shop-add-product.md](screens/shop-add-product.md) |
| 32 | نظرات مشتریان | `/shop/reviews` | `src/app/shop/reviews.tsx` | `SHOP-REVIEWS` | `SOURCE_VERIFIED` | [shop-reviews.md](screens/shop-reviews.md) |
| 33 | محصول فروشگاهی | `/shop/product/[id]` | `src/app/shop/product/[id].tsx` | `SHOP-PRODUCT-DETAIL` | `SOURCE_VERIFIED` | [shop-product-detail.md](screens/shop-product-detail.md) |
| 34 | پروفایل اختصاصی | `/profile` | `src/app/profile.tsx` | `PROFILE-VIEW` | `SOURCE_VERIFIED` | [profile-view.md](screens/profile-view.md) |
| 35 | پروفایل کاربر دیگر | `/user/[id]` | `src/app/user/[id].tsx` | `USER-PROFILE` | `SOURCE_VERIFIED` | [user-profile.md](screens/user-profile.md) |
| 36 | لیست تنظیمات | `/settings` | `src/app/settings/index.tsx` | `SETTINGS-INDEX` | `SOURCE_VERIFIED` | [settings-index.md](screens/settings-index.md) |
| 37 | ویرایش پروفایل | `/settings/edit-profile` | `src/app/settings/edit-profile.tsx` | `EDIT-PROFILE` | `SOURCE_VERIFIED` | [edit-profile.md](screens/edit-profile.md) |
| 38 | تنظیمات فروشگاه | `/settings/shop-management` | `src/app/settings/shop-management.tsx` | `SHOP-SETTINGS` | `SOURCE_VERIFIED` | [shop-settings.md](screens/shop-settings.md) |
| 39 | محصولات من | `/settings/my-products` | `src/app/settings/my-products.tsx` | `MY-PRODUCTS` | `SOURCE_VERIFIED` | [my-products.md](screens/my-products.md) |
| 40 | سفارشات من | `/settings/orders` | `src/app/settings/orders.tsx` | `MY-ORDERS` | `SOURCE_VERIFIED` | [my-orders.md](screens/my-orders.md) |
| 41 | امور مالی و کیف پول | `/settings/finance` | `src/app/settings/finance.tsx` | `FINANCE` | `SOURCE_VERIFIED` | [finance.md](screens/finance.md) |
| 42 | آمار و گزارش‌ها | `/settings/analytics` | `src/app/settings/analytics.tsx` | `ANALYTICS` | `SOURCE_VERIFIED` | [analytics.md](screens/analytics.md) |
| 43 | آدرس‌های من | `/settings/addresses` | `src/app/settings/addresses.tsx` | `ADDRESSES` | `SOURCE_VERIFIED` | [addresses.md](screens/addresses.md) |
| 44 | کارمندان فروشگاه | `/settings/shop-staff` | `src/app/settings/shop-staff.tsx` | `SHOP-STAFF` | `SOURCE_VERIFIED` | [shop-staff.md](screens/shop-staff.md) |
| 45 | تنظیمات اعلان | `/settings/notification-settings` | `src/app/settings/notification-settings.tsx` | `NOTIF-SETTINGS` | `SOURCE_VERIFIED` | [notif-settings.md](screens/notif-settings.md) |
| 46 | تنظیمات پیام‌ها | `/settings/message-settings` | `src/app/settings/message-settings.tsx` | `MSG-SETTINGS` | `SOURCE_VERIFIED` | [msg-settings.md](screens/msg-settings.md) |
| 47 | انتخاب زبان | `/settings/language` | `src/app/settings/language.tsx` | `LANG-SETTINGS` | `SOURCE_VERIFIED` | [lang-settings.md](screens/lang-settings.md) |
| 48 | انتخاب پوسته | `/settings/theme` | `src/app/settings/theme.tsx` | `THEME-SETTINGS` | `SOURCE_VERIFIED` | [theme-settings.md](screens/theme-settings.md) |
| 49 | حریم خصوصی | `/settings/privacy` | `src/app/settings/privacy.tsx` | `PRIVACY-SETTINGS` | `SOURCE_VERIFIED` | [privacy-settings.md](screens/privacy-settings.md) |
| 50 | راهنما و پشتیبانی | `/settings/help` | `src/app/settings/help.tsx` | `HELP-SUPPORT` | `SOURCE_VERIFIED` | [help-support.md](screens/help-support.md) |
| 51 | مودال عمومی | `/modal` | `src/app/modal.tsx` | `GENERIC-MODAL` | `SOURCE_VERIFIED` | [generic-modal.md](screens/generic-modal.md) |
| 52 | لایاوت سیستم چت | `/chat/_layout` | `src/app/chat/_layout.tsx` | `CHAT-LAYOUT` | `SOURCE_VERIFIED` | [chat-layout.md](screens/chat-layout.md) |
| 53 | لایاوت عمومی ریشه | `/_layout` | `src/app/_layout.tsx` | `ROOT-LAYOUT` | `SOURCE_VERIFIED` | [root-layout.md](screens/root-layout.md) |
