# راهنمای راه‌اندازی محیط توسعه (Setup Guide)

## ۱. پیش‌نیازهای نرم‌افزاری

قبل از شروع کار با پروژه کاردیانی، مطمئن شوید ابزارهای زیر روی سیستم شما نصب هستند:

| ابزار | نسخه پیشنهادی | کاربرد |
|---|---|---|
| **Node.js** | `>= 22.0.0` (یا `>= 24.x`) | محیط اجرای جاوااسکریپت |
| **pnpm** | `>= 10.0.0` | پکیج منیجر اصلی پروژه |
| **JDK (Java)** | `17` (OpenJDK 17) | کامپایل کدهای جاوا/اندروید |
| **Android Studio** | آخرین نسخه پایدار | SDK Platform 34/35 و Emulator |
| **EAS CLI** | `>= 14.0.0` | کلاینت رسمی بیلد ابری Expo |

### نصب pnpm و EAS CLI

```bash
# نصب یا ارتقای pnpm
npm install -g pnpm

# نصب EAS CLI به صورت گلوبال
npm install -g eas-cli
```

## ۲. راه‌اندازی اولیه مخزن

```bash
# کلون پروژه و ورود به مسیر
git clone https://github.com/gcorp-llc/cardiani.git
cd cardiani

# نصب تمامی وابستگی‌های مونو‌ریپو
pnpm install

# کپی فایل متغیرهای محیطی نمونه
cp .env.example .env
```

## ۳. بررسی سلامت محیط

برای اطمینان از صحت تمامی پکیج‌ها و تنظیمات Expo:

```bash
# اعتبارسنجی پکیج‌ها با استاندارد Expo SDK 58
pnpm run doctor

# بررسی عدم مغایرت تایپ‌ها
pnpm run type-check

# اجرای تست‌های واحد
pnpm run test
```

## ۴. عیب‌یابی در نصب اولیه (Troubleshooting)

- **خطای خطوط باینری یا کاراکترهای نامعتبر در pnpm:** مطمئن شوید فایل `.npmrc` با فرمت متنی استاندارد UTF-8 ذخیره شده است.
- **تداخل کش pnpm:**
  ```bash
  pnpm store prune
  rm -rf node_modules
  pnpm install
  ```
