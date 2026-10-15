# 04. Design System — سیستم طراحی، رنگ‌ها و تایپوگرافی

سیستم بصری اپلیکیشن کوتیک بر پایه یک طراحی مدرن Glassmorphism با لبه‌های کاملاً گرد (Rounded Cards)، شعاع‌های منحنی نرم، افکت Blur و پشتیبانی کامل از RTL استوار است. تمامی مقادیر زیر مستقیماً از سورس اصلی (`src/constants/theme.ts` و `src/global.css`) استخراج شده‌اند.

---

## 🎨 پالت رنگی (Color Palette)

رنگ‌های برنامه در دو پوسته **Light** و **Dark** تعریف شده‌اند.

### ☀️ پوسته روشن (Light Theme)
- **پس‌زمینه اصلی (Background):** `#edf2f8` (OKLCH 0.96 0.01 250)
- **پس‌زمینه ثانویه (Secondary BG):** `#e0e5eb` (OKLCH 0.92 0.01 250)
- **متن اصلی (Text Primary):** `#262f38` (OKLCH 0.30 0.02 250)
- **متن ثانویه (Text Secondary):** `#5b646f` (OKLCH 0.50 0.02 250)
- **رنگ اصلی برند / Tint:** `#3a93e6` (OKLCH 0.65 0.15 250)
- **کارت‌ها (Card / Surface Strong):** `#ffffff`
- **کارت شیشه‌ای (Glass Surface):** `rgba(255, 255, 255, 0.85)`
- **خطوط مرزی (Border):** `#d9dfe5`
- **موفقیت (Success):** `#10B981`
- **هشدار (Warning):** `#F59E0B`
- **خطا / حذف (Destructive):** `#d74745` (OKLCH 0.60 0.18 25)

### 🌙 پوسته تاریک (Dark Theme)
- **پس‌زمینه اصلی (Background):** `#1a2029` (OKLCH 0.24 0.02 260)
- **پس‌زمینه ثانویه (Secondary BG):** `#2d333d` (OKLCH 0.32 0.02 260)
- **متن اصلی (Text Primary):** `#c6cedb` (OKLCH 0.85 0.02 260)
- **متن ثانویه (Text Secondary):** `#88909c` (OKLCH 0.65 0.02 260)
- **رنگ اصلی برند / Tint:** `#68b5f5` (OKLCH 0.75 0.12 245)
- **کارت‌ها (Card / Surface Strong):** `#212730`
- **کارت شیشه‌ای (Glass Surface):** `rgba(33, 39, 48, 0.85)`
- **خطوط مرزی (Border):** `rgba(52, 59, 69, 0.4)`
- **موفقیت (Success):** `#10B981`
- **هشدار (Warning):** `#FBBF24`
- **خطا / حذف (Destructive):** `#d74745`

---

## 🔤 تایپوگرافی (Typography)

- **فونت اصلی فارسی:** `Vazirmatn` (وزن‌های Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800)
- **سایزهای استاندارد متون:**
  - `Title Large`: 20px / Bold
  - `Title Medium (Header)`: 17px / Bold
  - `Body Large`: 15px / Regular & SemiBold
  - `Body Medium`: 13px / Regular
  - `Caption / Subtitle`: 11px / Regular
  - `Badge / Tag`: 10px / Bold

---

## 📐 فاصله، شعاع و سایه‌ها (Spacing, Radius & Shadows)

### فاصله‌ها (Spacing System)
- `xs`: 4dp
- `sm`: 8dp
- `md`: 12dp
- `lg`: 16dp
- `xl`: 24dp
- `xxl`: 32dp

### شعاع انحنا (Border Radii)
- **دکمه‌های FloatingIconButton:** `14dp`
- **ورودی‌ها و دکمه‌های اصلی:** `14dp`
- **کارت‌ها و آیتم‌های چت:** `16dp` تا `20dp`
- **کارت‌های بزرگ و بنرها:** `24dp`
- **Bottom Sheets:** `24dp` (گوشه‌های بالایی)

### سایه‌ها (Shadows)
- **سایه استاندارد کارت‌ها:** `offset: (0, 4), blur: 12dp, color: rgba(38, 47, 56, 0.08)` (Light) و `rgba(0,0,0,0.4)` (Dark)
- **سایه دکمه‌های Floating:** `offset: (0, 2), blur: 8dp, color: rgba(0,0,0,0.06)`

---

## 🌐 هدر Glassmorphism و RTL
- **ارتفاع هدر (ModernHeader):** 56dp (بدون احتساب Safe Area بالایی)
- **افکت شیشه‌ای:** `BlurRadius = 12dp` + Background Transparency 85% تا 90%
- **RTL:** تمامی المان‌ها و آیکن‌های فلش جهت‌دار (مانند فلش بازگشت) در RTL قرینه‌سازی می‌شوند (در فارسی فلش بازگشت به سمت راست اشاره می‌کند).
- **تأییدیه بررسی:** `SOURCE_VERIFIED`
