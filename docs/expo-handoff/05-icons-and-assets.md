# 05. Icons and Assets — آیکن‌ها و دارایی‌های تصویری

اپلیکیشن از مجموعه‌آیکن‌های **Solar Icon Set** (`@iconify-json/solar`) استفاده می‌کند. در کد پروژه، این آیکن‌ها به صورت کامپوننت‌های محلی SVG در مسیر `src/components/icons/` رندر می‌شوند.

---

## 🎨 جدول آیکن‌های کلیدی و معادل Native Android

| نام کامپوننت React Native | آیکن اصلی Solar Icon set | محل استفاده در برنامه | سایز استاندارد | معادل پیشنهادی Android Vector / Material Icon |
| :--- | :--- | :--- | :--- | :--- |
| `BagSmileOutlineIcon` | `solar:bag-smile-outline` | تب فروشگاه (غیرفعال) | 24dp | `ic_bag_smile_outline.xml` |
| `BagSmileBoldDuotoneIcon` | `solar:bag-smile-bold-duotone` | تب فروشگاه (فعال) | 24dp | `ic_bag_smile_bold.xml` |
| `HomeBrokenIcon` | `solar:home-broken` | تب خانه (غیرفعال) | 24dp | `ic_home_broken.xml` |
| `HomeBoldIcon` | `solar:home-bold` | تب خانه (فعال) | 24dp | `ic_home_bold.xml` |
| `ChatLineBrokenIcon` | `solar:chat-line-broken` | تب چت (غیرفعال) | 24dp | `ic_chat_line.xml` |
| `ChatLineBoldDuotoneIcon` | `solar:chat-line-bold-duotone` | تب چت (فعال) | 24dp | `ic_chat_line_bold.xml` |
| `AddSquareBrokenIcon` | `solar:add-square-broken` | تب ثبت آگهی / دکمه‌ها | 24dp | `ic_add_square.xml` |
| `SettingsBrokenIcon` | `solar:settings-broken` | تب تنظیمات | 24dp | `ic_settings.xml` |
| `AltArrowLeftBrokenIcon` | `solar:alt-arrow-left-broken` | دکمه بازگشت (RTL) | 20dp | `ic_arrow_back_rtl.xml` |
| `MagniferBrokenIcon` | `solar:magnifer-broken` | دکمه و ورودی جستجو | 20dp | `ic_search.xml` |
| `FilterBrokenIcon` | `solar:filter-broken` | دکمه فیلتر | 20dp | `ic_filter.xml` |
| `HeartBrokenIcon` | `solar:heart-broken` | دکمه لایک / علاقه‌مندی | 20dp | `ic_favorite_border.xml` |
| `HeartBoldIcon` | `solar:heart-bold` | دکمه لایک فعال | 20dp | `ic_favorite_filled.xml` |
| `CartLargeBrokenIcon` | `solar:cart-large-broken` | سبد خرید | 22dp | `ic_shopping_cart.xml` |
| `BellBrokenIcon` | `solar:bell-broken` | اعلانات | 22dp | `ic_notifications.xml` |
| `CameraMinimalisticBrokenIcon` | `solar:camera-minimalistic-broken` | انتخاب عکس پروفایل/کاور | 24dp | `ic_camera.xml` |
| `GalleryWideLineDuotoneIcon` | `solar:gallery-wide-line-duotone` | انتخاب عکس از گالری | 24dp | `ic_gallery.xml` |

---

## 🖼️ تصاویر و دارایی‌های گرافیکی (Assets Inventory)

دارایی‌های تصویری پروژه در مسیر `assets/` قرار دارند:

1. **آیکن‌های برنامه (App Icons):**
   - `assets/images/icon.png` (1024x1024) — آیکن اصلی برنامه
   - `assets/images/android-icon-foreground.png` — آیکن Adaptable اندروید
   - `assets/images/android-icon-background.png` — پس‌زمینه آیکن Adaptable
   - `assets/images/splash-icon.png` — تصویر صفحه Splash Screen

2. **تصاویر تب‌ها (Fallback Tab Icons):**
   - `assets/images/tabIcons/home.png`
   - `assets/images/tabIcons/explore.png`

---

## 🛠️ روش پیاده‌سازی آیکن‌ها در Kotlin / Jetpack Compose

۱. **استفاده از فایل‌های VectorDrawable (`.xml`):**
   تمامی فایل‌های SVG آیکن‌های Solar موجود در `src/components/icons/` قابل تبدیل مستقیم به XMLهای `res/drawable/` توسط Android Studio SVG Importer می‌باشند.
۲. **فراخوانی در Compose:**
   ```kotlin
   Icon(
       painter = painterResource(id = R.drawable.ic_bag_smile_bold),
       contentDescription = "Shop Tab",
       tint = MaterialTheme.colorScheme.primary,
       modifier = Modifier.size(24.dp)
   )
   ```
- **تأییدیه بررسی:** `SOURCE_VERIFIED`
