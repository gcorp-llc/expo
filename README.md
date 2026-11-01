# پلتفرم یکپارچه کاردیانی (Cardiani Platform)

پروژه کاردیانی شامل اکوسیستم جامع اپلیکیشن موبایل (Android و iOS)، وب‌سایت و پنل مدیریت (Next.js 15) و پکیج‌های کلاینت اشتراکی است.

---

## ۱. ساختار مونو‌ریپو (Monorepo Architecture)

- **`apps/mobile` (یا ریشه پروژه موبایل):** اپلیکیشن موبایل کاردیانی با Expo SDK 58، React Native 0.88، NativeWind v5، Zustand، React Query، Stripe، Sentry و SecureStore.
- **`apps/web`:** وب‌سایت و داشبورد اداری بر بستر Next.js 15 App Router، React 19، Tailwind CSS و چیدمان فارسی (RTL).
- **`packages/shared`:** اسکیماهای اعتبارسنجی Zod، تایپ‌های کلاینت و کلاینت HTTP بدون وابستگی به DOM/RN.
- **`packages/i18n`:** واژه‌نامه‌های محلی‌سازی‌شده فارسی و انگلیسی.
- **`docs/`:** راهنماهای دقیق ۸ گانه استقرار، بیلد اندروید، بیلد iOS، داکر، پرداخت و انتشار.

---

## ۲. دستورهای شروع سریع (Quick Start)

### نصب پیش‌نیازها و پکیج‌ها
```bash
# نصب وابستگی‌های کل مخزن
pnpm install

# کپی فایل تنظیمات محیطی نمونه
cp .env.example .env
```

### اجرای اپلیکیشن موبایل (Expo)
```bash
# اجرای مترو سرور
pnpm start

# بیلد استاتیک وب با Expo Router
pnpm run web:export

# اجرای مستقیم روی شبیه‌ساز یا دستگاه متصل
pnpm run android
pnpm run ios
```

### اجرای وب‌سایت و پنل وب (Next.js)
```bash
pnpm -F @cardiani/web dev
```
سپس مرورگر را باز کرده و به نشانی `http://localhost:3000` مراجعه فرمایید.

---

## ۳. بررسی کیفیت، تست و سلامت پروژه

```bash
# اعتبارسنجی انواع داده‌ها با تایپ‌اسکریپت در کل مخزن
pnpm run type-check

# اجرای تست‌های واحد (Vitest)
pnpm run test

# بررسی هماهنگی پکیج‌ها با استاندارد رسمی Expo
pnpm run doctor

# بررسی ساختار کد
pnpm run lint
```

---

## ۴. دستورهای بیلد خروجی موبایل

| هدف | پلتفرم | دستور اجرا | نوع خروجی |
|---|---|---|---|
| تست داخلی | Android | `pnpm run build:android:preview` | فایل نصبی APK |
| انتشار نهایی | Android | `pnpm run build:android:prod` | بسته AAB برای گوگل پلی |
| تست شبیه‌ساز | iOS | `pnpm run build:ios:preview` | Simulator Build / Ad Hoc |
| انتشار نهایی | iOS | `pnpm run build:ios:prod` | بیلد App Store Connect |

---

## ۵. راهنماهای تفصیلی در پوشه `docs/`

برای مطالعه جزئیات بیشتر به مستندات مرتبط مراجعه فرمایید:
1. [`docs/00-overview.md`](docs/00-overview.md): نمای کلی معماری و جریان داده‌ها.
2. [`docs/01-setup.md`](docs/01-setup.md): پیش‌نیازهای نرم‌افزاری و راه‌اندازی محیط توسعه.
3. [`docs/02-android.md`](docs/02-android.md): راهنمای بیلد محلی Gradle و انتشار گوگل پلی و Keystore.
4. [`docs/03-ios.md`](docs/03-ios.md): راهنمای ساخت IPA، اکانت اپل، TestFlight و بیلد ابری بدون مک.
5. [`docs/04-web.md`](docs/04-web.md): استقرار Next.js، داکر، تنظیمات وب‌سرور و سئو.
6. [`docs/05-cardiani-integration.md`](docs/05-cardiani-integration.md): مشخصات API، پرداخت Stripe و پوش نوتیفیکیشن.
7. [`docs/06-release.md`](docs/06-release.md): چرخه انتشار، نگارش و به‌روزرسانی آنلاین OTA.
8. [`docs/07-troubleshooting.md`](docs/07-troubleshooting.md): عیب‌یابی خطاهای متداول مترو، گرادل و ماژول‌های نیتیو.
9. [`docs/08-manual-testing-checklist.md`](docs/08-manual-testing-checklist.md): چک‌لیست تست دستی روی دستگاه واقعی و موارد تست‌نشده.
