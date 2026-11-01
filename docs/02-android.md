# راهنمای جامع بیلد و انتشار اندروید (Android Build & Release)

این سند مراحل ساخت، بیلد محلی، بیلد ابری و انتشار نسخه اندروید اپلیکیشن Cardiani را توضیح می‌دهد.

---

## ۱. اجرای محلی با Development Build

برای تست کتابخانه‌های نیتیو (مانند Stripe، دوربین و نوتیفیکیشن‌ها) باید از Dev Client استفاده شود:

```bash
# ایجاد و اجرای پروژه روی شبیه‌ساز یا گوشی متصل با USB
pnpm run android
```

---

## ۲. بیلد ابری فایل نصب APK (پیش‌نمایش داخلی - Preview)

برای ارسال مستقیم فایل `.apk` به تیم تست یا کارفرما بدون نیاز به گوگل پلی:

```bash
# بیلد با پروفایل preview
pnpm run build:android:preview
```
یا با دستور مستقیم:
```bash
eas build -p android --profile preview
```
پس از اتمام پردازش در سرور EAS، لینک مستقیم دانلود فایل APK به شما ارائه می‌شود که می‌توانید آن را روی گوشی سایدلود (Sideload) کنید.

---

## ۳. بیلد محلی فایل APK با استفاده از Gradle

اگر به سرویس‌های EAS دسترسی ندارید یا مایل به ساخت بیلد بدون اینترنت ابری هستید:

```bash
# ۱. تولید کدهای بومی اندروید
npx expo prebuild --platform android --clean

# ۲. ورود به دایرکتوری android و ساخت نسخه release
cd android
./gradlew assembleRelease
```

### مسیر خروجی فایل بیلد:
فایل نصبی شما در مسیر زیر تولید خواهد شد:
```text
android/app/build/outputs/apk/release/app-release.apk
```

---

## ۴. ساخت و نگهداری امن Keystore (امضای اپلیکیشن)

> **هشدار حیاتی:** در صورت گم شدن کلید Keystore یا فراموشی گذرواژه آن، امکان به‌روزرسانی اپلیکیشن در گوگل پلی استور برای همیشه از بین می‌رود و باید اپ را با نام پکیج جدید دوباره منتشر کنید!

### دستور ساخت یک Keystore جدید (جاوا keytool):
```bash
keytool -genkey -v -keystore cardiani-release-key.jks \
  -alias cardiani-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```
### نکات نگهداری:
1. فایل `cardiani-release-key.jks` را هرگز در گیت کامیت نکنید (در `.gitignore` قرار گیرد).
2. یک نسخه پشتیبان آفلاین در هارد اکسترنال یا مدیریت گذرواژه امن (مانند 1Password / Bitwarden) ذخیره کنید.

---

## ۵. بیلد خروجی انتشار (AAB) و بارگذاری در Google Play

برای انتشار نهایی در فروشگاه Google Play Store از فرمت استاندارد Android App Bundle (`.aab`) استفاده می‌شود:

```bash
pnpm run build:android:prod
```
یا:
```bash
eas build -p android --profile production
```

### مراحل انتشار در کنسول گوگل پلی:
1. ورود به **Google Play Console** و انتخاب اپلیکیشن `com.gcorp.cardiani`.
2. آپلود فایل `.aab` در کانال **Internal Testing** برای تست توسط اعضای تیم.
3. ارتقا به کانال **Closed Testing** و سپس **Production**.
4. تنظیم متغیرهای نوتیفیکیشن FCM (فایل `google-services.json`) در تنظیمات پروژه.
