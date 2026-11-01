# راهنمای جامع بیلد و انتشار iOS (iOS Build & Release Guide)

این سند مراحل و پیش‌نیازهای بیلد و استقرار نسخه iOS اپلیکیشن Cardiani را توضیح می‌دهد.

---

## ۱. پیش‌نیازهای اجباری و حساب توسعه‌دهنده اپل

برای بیلد نسخه واقعی iOS موارد زیر الزامی است:
- **عضویت در Apple Developer Program:** نیاز به خرید اشتراک سالانه (۹۹ دلار در سال) در [developer.apple.com](https://developer.apple.com).
- **ثبت App ID و Bundle Identifier:** شناسه نهایی پروژه `com.gcorp.cardiani` در پنل اپل تعریف شده باشد.
- **گواهی‌ها (Certificates & Provisioning Profiles):** سرویس EAS Build قادر است گواهی‌های Distribution و Push Notification (APNs) را به صورت کاملاً خودکار بسازد و مدیریت کند.

---

## ۲. تفاوت‌های کلیدی iOS با اندروید

> **نکته بسیار مهم:** سیستم‌عامل iOS برخلاف اندروید هیچ فایلی به نام APK ندارد. پسوند خروجی پکیج نصب iOS برابر با `.ipa` است.

### روش‌های توزیع اپلیکیشن روی دستگاه‌های iOS:
1. **Ad Hoc (توزیع مستقیم):** فقط روی دستگاه‌هایی که شماره UDID سخت‌افزاری آن‌ها قبلاً در پنل اپل ثبت شده باشد نصب می‌شود.
2. **TestFlight (پیشنهادی برای تست):** نیازی به ثبت UDID تک‌تک دستگاه‌ها ندارد؛ بیلد در کنسول App Store Connect آپلود شده و تسترها با نصب اپلیکیشن TestFlight به آن دسترسی پیدا می‌کنند.
3. **App Store:** انتشار عمومی برای تمام کاربران دنیا پس از بررسی (Review) توسط تیم اپل.

---

## ۳. نحوه بیلد ابری با EAS بدون نیاز به سیستم‌عامل Mac

اگر سیستم مک در اختیار ندارید، EAS Cloud Build کدها را روی ماشین‌های مجازی macOS در سرورهای ابری Expo کامپایل و امضا می‌کند:

```bash
# بیلد نسخه شبیه‌ساز (برای تست در Mac Simulator)
eas build -p ios --profile development

# بیلد نسخه پیش‌نمایش قابل نصب روی گوشی (Ad Hoc / TestFlight)
pnpm run build:ios:preview

# بیلد نهایی برای انتشار در App Store Connect
pnpm run build:ios:prod
```

---

## ۴. بیلد محلی فقط با سیستم‌عامل macOS و Xcode

اگر به Mac دسترسی دارید و می‌خواهید به صورت محلی بیلد بگیرید:

```bash
# تولید دایرکتوری بومی ios و پادها
npx expo prebuild --platform ios --clean

# ورود به پوشه و نصب CocoaPods
cd ios
pod install

# باز کردن پروژه در Xcode و اجرای آرشیو
open cardiani.xcworkspace
```

---

## ۵. تنظیمات APNs و دسترسی‌های Info.plist

مجوزهای دوربین، گالری، ذخیره تصاویر و موقعیت مکانی با متن‌های دو زبانه (فارسی و انگلیسی) در فایل `app.config.ts` به صورت زیر تعریف شده‌اند:
- `NSCameraUsageDescription`
- `NSPhotoLibraryUsageDescription`
- `NSPhotoLibraryAddUsageDescription`
- `NSLocationWhenInUseUsageDescription`
- فعال‌سازی `UIBackgroundModes: ["remote-notification"]` برای دریافت پوش نوتیفیکیشن در پس‌زمینه.
