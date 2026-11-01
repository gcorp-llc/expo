# راهنمای اجرای وب، کانتینرسازی و استقرار Next.js (Web Deployment)

وب‌سایت و پنل مدیریت کاردیانی با استفاده از **Next.js 15 App Router** و طراحی واکنش‌گرا (RTL) پیاده‌سازی شده است.

---

## ۱. اجرای در محیط توسعه

```bash
# اجرای مستقیم اپلیکیشن وب
pnpm -F @cardiani/web dev

# یا در صورت ورود به پوشه web
cd apps/web
pnpm dev
```
آدرس دسترسی محلی: `http://localhost:3000`

---

## ۲. بیلد تولیدی (Production Build)

```bash
pnpm -F @cardiani/web build
pnpm -F @cardiani/web start
```

---

## ۳. کانتینرسازی با Docker (استقرار روی سرور لینوکس)

یک `Dockerfile` چندمرحله‌ای بهینه‌سازی‌شده برای پکیج‌های مونو‌ریپو آماده شده است:

```bash
# ساخت ایمیج داکر
docker build -t cardiani-web:latest -f apps/web/Dockerfile .

# اجرای کانتینر
docker run -d -p 3000:3000 --name cardiani-web-instance cardiani-web:latest
```

---

## ۴. استقرار روی سرویس‌های ابری (Vercel / Node)

### استقرار روی Vercel:
1. در تنظیمات Vercel، مسیر Root Directory را برابر با `apps/web` یا ریشه مخزن قرار دهید.
2. دستور Build را برابر با `pnpm -F @cardiani/web build` قرار دهید.
3. متغیرهای محیطی زیر را در بخش Settings > Environment Variables تعریف کنید:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ۵. امنیت و ملاحظات کش و سئو

- **کوکی‌های امن:** توکن‌های ورود کاربر در سمت سرور وب به صورت `httpOnly`، `SameSite=Strict` و در پروتکل `Secure` ذخیره شوند.
- **تگ‌های Open Graph و سئو:** متا‌تگ‌های فارسی و ساختار داده‌های معنایی در `src/app/layout.tsx` گنجانده شده‌اند.
