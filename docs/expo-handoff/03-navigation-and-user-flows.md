# 03. Navigation and User Flows — ساختار ناوبری و جریان‌های کاربر

این مستند ساختار ناوبری، پشته صفحات (Navigation Stack)، رفتارهای دکمه بازگشت (Back Navigation)، تب‌ها و جریان‌های کاری اصلی کاربر را با استفاده از نمودارهای **Mermaid** توضیح می‌دهد.

---

## 🗺️ ساختار کلی ناوبری (Screen Hierarchy)

پروژه از **Expo Router** (مبتنی بر React Navigation Stack & Tabs) استفاده می‌کند.

```mermaid
flowchart TD
    Root["/ (Root Layout)"] --> AuthFlow["/auth/welcome"]
    Root --> MainTabs["/(tabs) Bottom Navigation"]

    subgraph AuthFlow ["جریان ورود / احراز هویت"]
        Welcome["/auth/welcome"] --> Phone["/auth/phone"]
        Phone --> Verify["/auth/verify"]
        Verify --> ProfileSetup["/auth/profile"]
        ProfileSetup --> MainTabs
    end

    subgraph MainTabs ["تب‌های اصلی سیستم"]
        HomeTab["/(tabs) - خانه"]
        ShopTab["/(tabs)/shop - فروشگاه"]
        SellTab["/(tabs)/sell - ثبت آگهی"]
        ChatTab["/(tabs)/chat - پیام‌ها"]
        FavoritesTab["/(tabs)/favorites - نشان‌شده‌ها"]
        ProfileTab["/(tabs)/profile - پروفایل"]
        SettingsTab["/(tabs)/settings - تنظیمات"]
    end

    HomeTab --> ProductDetail["/product/[id]"]
    ShopTab --> ShopDetail["/shop/[id]"]
    ShopTab --> Cart["/cart"]
    Cart --> Checkout["/checkout"]

    ChatTab --> DirectChat["/chat/[id]"]
    ChatTab --> ChannelView["/chat/channel/[id]"]
    ChatTab --> GroupView["/chat/group/[id]"]
    DirectChat --> VoiceCall["/chat/calls/voice"]
    DirectChat --> VideoCall["/chat/calls/video"]

    SettingsTab --> EditProfile["/settings/edit-profile"]
    SettingsTab --> Orders["/settings/orders"]
    SettingsTab --> Finance["/settings/finance"]
    SettingsTab --> ShopManage["/settings/shop-management"]
```

---

## 🛒 جریان خرید و پرداخت (E-Commerce Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as کاربر
    participant Home as صفحه خانه / فروشگاه
    participant Product as جزئیات کالا
    participant Cart as سبد خرید
    participant Checkout as تسویه حساب
    participant Order as ثبت نهایی سفارش

    User->>Home: انتخاب کالا
    Home->>Product: انتقال به /product/[id]
    User->>Product: کلیک روی "افزودن به سبد خرید"
    Product->>Cart: به روزرسانی Cart Store و انتقال به /cart
    User->>Cart: بررسی اقلام و کلیک روی "ادامه خرید"
    Cart->>Checkout: انتقال به /checkout
    User->>Checkout: انتخاب آدرس و روش پرداخت
    Checkout->>Order: تایید و پرداخت سفارش
```

---

## 💬 جریان گفتگو و پیام‌رسانی (Messaging Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as کاربر
    participant ChatList as تب پیام‌ها (/chat)
    participant Direct as گفتگو مستقیم (/chat/[id])
    participant Call as تماس تصویری / صوتی

    User->>ChatList: انتخاب گفتگو از لیست
    ChatList->>Direct: باز شدن صفحه چت
    User->>Direct: ارسال پیام متنی / آوا / عکس
    User->>Direct: کلیک روی آیکن تماس
    Direct->>Call: انتقال به /chat/calls/video یا /chat/calls/voice
```

---

## 🔙 رفتار دکمه بازگشت (Back Stack & Hardware Back)
- **در Android:** فشار دادن دکمه Hardware Back یا Swipe Back روی صفحات فرزند، کاربر را به صفحه قبلی Stack برمی‌گرداند.
- **در تب‌های اصلی (`/(tabs)`):** فشار دادن دکمه Back در سایر تب‌ها، کاربر را به تب اصلی (`خانه / (tabs)`) هدایت کرده و در تب خانه، برنامه را مینیمایز می‌کند.
- **در مودال‌ها و BottomSheetها:** دکمه Back ابتدا مودال یا Sheet باز را می‌بندد.
