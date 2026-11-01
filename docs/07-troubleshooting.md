# راهنمای جامع عیب‌یابی و رفع خطاهای رایج (Troubleshooting)

این سند راه‌حل‌های سریع برای خطاهای متداول در حین توسعه و بیلد را ارائه می‌دهد.

---

## ۱. تداخل بسته‌های مونو‌ریپو و رزولوشن سیم‌لینک‌ها (Metro & Monorepo)

- **علت:** موتور Metro گاهی بسته‌های اشتراکی در پوشه `packages/` را به درستی پیدا نمی‌کند.
- **راه‌حل:**
  در فایل `metro.config.js` مسیرهای `watchFolders` به صورت مطلق تنظیم شده‌اند. اگر کش مترو باعث بروز خطا شد:
  ```bash
  npx expo start -c
  ```

---

## ۲. خطاهای نیتیو ماژول‌ها در Expo Go (مانند MMKV یا Nitro Modules)

- **علت:** ماژول‌های C++ بومی مانند `react-native-mmkv` در کلاینت استاندارد Expo Go پشتیبانی نمی‌شوند.
- **راه‌حل:**
  کد پروژه در `src/lib/storage.ts` به گونه‌ای بازنویسی شده که در صورت عدم حضور کدهای نیتیو، به طور خودکار به `AsyncStorage` سوئیچ می‌کند. برای تست واقعی عملکرد نیتیو از دستور `pnpm run android` یا بیلد `preview` استفاده نمایید.

---

## ۳. خطای CocoaPods یا معماری پردازنده در macOS (M1/M2 Apple Silicon)

- **راه‌حل:**
  ```bash
  cd ios
  arch -x86_64 pod install --repo-update
  ```

---

## ۴. خطای عدم تطابق کش Gradle در اندروید

- **راه‌حل:**
  ```bash
  cd android
  ./gradlew clean
  ./gradlew --stop
  cd ..
  pnpm run android
  ```

---

## ۵. خطاهای بارگذاری سورس‌مپ در Sentry (Sourcemaps)

- در فایل `app.config.ts`، پلاگین `@sentry/react-native/expo` اضافه شده است.
- برای بیلد پروداکشن، متغیرهای `SENTRY_AUTH_TOKEN`، `SENTRY_ORG` و `SENTRY_PROJECT` را به بخش EAS Secrets اضافه کنید تا آپلود خودکار فایل‌های سورس‌مپ در هنگام کامپایل انجام شود.
