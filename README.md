# اپلیکیشن موبایل Cardiani (`apps/mobile`)

این پروژه اپلیکیشن موبایل پلتفرم Cardiani است که با استفاده از **Expo** و **React Native** توسعه یافته است.

---

## ۱. ویژگی‌ها و استقلال پروژه

اپلیکیشن موبایل Cardiani به‌گونه‌ای طراحی شده که:
1. **داخل Monorepo:** بدون تداخل با سایر بخش‌ها اجرا شود.
2. **به‌صورت کاملاً مستقل:** بدون نیاز به ریشه monorepo یا وابستگی‌های `workspace:*` قابلیت نصب (`pnpm install`)، اجرا و build دارد.
3. **قابلیت استخراج (Standalone Export):** به راحتی می‌توان این پوشه را به یک مخزن (Repository) مجزای گیت‌هاب منتقل کرد و در صورت نیاز مجدداً به monorepo ادغام نمود.

تایپ‌ها (`@cardiani/types`) و سرویس‌گیرنده‌ی API (`@cardiani/api-client`) در مسیر `apps/mobile/lib/` محلی‌سازی شده‌اند و از طریق path aliasهای تنظیم‌شده در `tsconfig.json` و `babel.config.js` فراخوانی می‌شوند.

---

## ۲. پیش‌نیازها و نصب

* **Node.js:** نسخه `>=24.20.0`
* **pnpm:** نسخه `>=10.0.0`
* **Expo CLI:** به همراه ابزار Expo Go یا شبیه‌ساز (Emulator/Simulator)

### راه اندازی مستقل

```powershell
# ورود به پوشه mobile
cd apps/mobile

# نصب وابستگی‌ها
pnpm install

# بررسی تایپ‌ها و کیفیت کد
pnpm run type-check
pnpm run lint
```

---

## ۳. نحوه اتصال به بک‌اند (Backend Connection)

فایل `.env.example` را به `.env` کپی کنید:

```powershell
Copy-Item .env.example .env
```

### نکات مهم آدرس‌دهی بک‌اند در موبایل:
* **دستگاه واقعی (Physical Device):** از آدرس `localhost` استفاده نکنید! آدرس IP شبکه محلی کامپیوتر خود را وارد کنید (مثلاً `http://192.168.1.100:8080/api/v1`).
* **شبیه‌ساز اندروید (Android Emulator):** برای اشاره به بک‌اند روی سیستم میزبان، از IP ویژه `10.0.2.2` استفاده کنید (مثلاً `http://10.0.2.2:8080/api/v1`).
* **شبیه‌ساز iOS (iOS Simulator):** می‌توانید از `http://localhost:8080/api/v1` استفاده کنید.

---

## ۴. اجرا و ساخت (Run & Build)

```powershell
# اجرای سرور توسعه Expo
pnpm start

# اجرا روی شبیه‌ساز اندروید
pnpm run android

# اجرا روی شبیه‌ساز iOS
pnpm run ios

# خروجی گرفتن ثابت (Expo Export Test)
npx expo export
```

---

## ۵. استخراج به مخزن مجزا (Standalone Repository Extraction)

برای انتقال اپلیکیشن موبایل به یک ریپوزیتوری کاملاً مستقل در GitHub، دستورات نیتیو PowerShell زیر را در ریشه monorepo اجرا کنید:

### روش ۱: استفاده از `git subtree` (پیش‌فرض)

```powershell
# ایجاد شاخه مستقل از پوشه apps/mobile
git subtree split --prefix=apps/mobile -b mobile-standalone

# ایجاد یک ریپوزیتوری جدید و push کردن شاخه
mkdir ..\cardiani-mobile-repo
cd ..\cardiani-mobile-repo
git init
git pull ..\cardiani-monorepo mobile-standalone
git remote add origin https://github.com/gcorp-llc/cardiani-mobile.git
git push -u origin main
```

### روش ۲: استفاده از `git filter-repo` (در صورت نیاز به تاریخچه کامل)

```powershell
# کپی پروژه به پوشه جدید
Copy-Item -Recurse -Force . ..\cardiani-mobile-standalone
cd ..\cardiani-mobile-standalone

# فیلتر کردن و نگه داشتن فقط مسیر apps/mobile
git filter-repo --subdirectory-filter apps/mobile
git remote add origin https://github.com/gcorp-llc/cardiani-mobile.dir.git
git push -u origin main
```

### بازگرداندن و به‌روزرسانی در Monorepo

در صورت اعمال تغییرات در ریپوی مجزا و نیاز به دریافت تغییرات در Monorepo:

```powershell
# دریافت تغییرات از ریپوی مجزا به پوشه apps/mobile
git subtree pull --prefix=apps/mobile https://github.com/gcorp-llc/cardiani-mobile.git main --squash
```

---

## ۶. چک‌لیست تست دستی پس از استخراج

پس از استخراج کد به ریپوزیتوری یا مسیر موقت جدید، مراحل زیر را برای اطمینان از سلامت پروژه بررسی کنید:

- [ ] اجرای `pnpm install` بدون خطا یا هشدار درباره `workspace:*` یا فایل‌های بیرون از پوشه.
- [ ] اجرای `pnpm run type-check` و عدم وجود خطای تایپ‌اسکریپت.
- [ ] اجرای `pnpm run lint` و عدم وجود خطای سبک کد.
- [ ] اجرای `npx expo export` و خروجی موفق در پوشه `dist`.
- [ ] تست اتصال API به بک‌اند با تنظیم متغیر `EXPO_PUBLIC_API_URL` روی IP محلی یا شبیه‌ساز.

---

## ۷. یادداشت درباره همگام‌سازی کدهای کپی‌شده (Code Drift Notice)

تایپ‌ها (`lib/types`) و سرویس‌گیرنده (`lib/api-client`) به‌صورت محلی در این ریپوزیتوری قرار گرفته‌اند.
> **هشدار:** در صورت تغییر در قراردادهای API یا مدل‌های داده‌ای بک‌اند/monorepo، حتماً فایل‌های موجود در `lib/types` و `lib/api-client` را به‌روزرسانی کنید تا از ناهماهنگی (Code Drift) بین کلاینت موبایل و بک‌اند جلوگیری شود.
