# راهنمای اتصال به بک‌اند پلتفرم کاردیانی (Cardiani Integration)

این سند قراردادهای فنی ارتباط اپلیکیشن‌های موبایل و وب با بک‌اند Cardiani را مستند می‌کند.

---

## ۱. چرخه احراز هویت (Authentication Flow)

احراز هویت کاربران بر پایه ارسال شماره تماس و کد تأیید یکبار مصرف (OTP) است:

```text
User ────( Phone Number )───► POST /api/v1/auth/otp/send
User ◄───( SMS / Code )────── Backend

User ────( Phone + Code )───► POST /api/v1/auth/otp/verify
User ◄───( AccessToken + RefreshToken + User Profile )
```

- **ذخیره‌سازی توکن در موبایل:** توکن به صورت امن درون Keychain / Keystore دستگاه از طریق `expo-secure-store` ذخیره می‌شود.
- **تلاش خودکار برای Refresh:** در صورتی که پاسخ درخواست با کد وضعیت HTTP `401 Unauthorized` برگردد، کلاینت در `src/lib/api.ts` به صورت خودکار با متد `POST /api/v1/auth/refresh` توکن جدید دریافت کرده و درخواست را مجدداً ارسال می‌کند.

---

## ۲. فهرست Endpointهای اصلی کلاینت

| متد | مسیر | شرح |
|---|---|---|
| `POST` | `/api/v1/auth/otp/send` | ارسال کد پیامکی تأیید |
| `POST` | `/api/v1/auth/otp/verify` | اعتبارسنجی کد پیامک و تحویل توکن JWT |
| `POST` | `/api/v1/auth/refresh` | تمدید اعتبار `access_token` با `refresh_token` |
| `GET` | `/api/v1/products` | دریافت لیست محصولات بازار و فروشگاه |
| `POST` | `/api/v1/payments/create-intent` | ایجاد امن سفارش پرداخت Stripe و صدور `client_secret` |
| `POST` | `/api/v1/devices/register` | ثبت توکن Push Notification (FCM/APNs) کاربر |
| `POST` | `/api/v1/devices/unregister` | حذف توکن پوش پس از خروج کاربر از حساب |

---

## ۳. جریان امن پرداخت بین‌المللی Stripe

> **قانون امنیتی غیرقابل تغییر:** هیچ‌گاه نباید سفارش پرداخت یا توکن‌های محرمانه Stripe (Stripe Secret Key) در کلاینت یا اپلیکیشن ایجاد شوند!

1. کاربر در صفحه تسویه حساب (Checkout) دکمه «پرداخت با Stripe» را لمس می‌کند.
2. اپلیکیشن درخواست `POST /api/v1/payments/create-intent` را به همراه شناسه سفارش ارسال می‌کند.
3. سرور Cardiani مقدار مبلغ و اطلاعات مشتری را بررسی کرده و از طریق API استرایپ یک شیء `PaymentIntent` ایجاد نموده و تنها فیلد `client_secret` را به اپلیکیشن بازمی‌گرداند.
4. اپلیکیشن موبایل با فراخوانی متد `presentPaymentSheet()` از کتابخانه `@stripe/stripe-react-native`، رابط کاربری رسمی استرایپ را نمایش می‌دهد.
5. پس از پرداخت موفق، استرایپ از طریق دیپ‌لینک `cardiani://stripe-redirect` کاربر را به صفحه نتیجه در اپلیکیشن هدایت می‌کند.
