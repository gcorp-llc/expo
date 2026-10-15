# 📄 تأیید کد OTP (Auth Verify)

## 📌 اطلاعات پایه
- **مسیر (Route):** `/auth/verify`
- **مسیر فایل سورس Expo:** `src/app/auth/verify.tsx`
- **پیشوند شناسه عناصر (Element ID Prefix):** `AUTH-VERIFY`
- **وضعیت بررسی:** `SOURCE_VERIFIED`
- **لینک مرجع بصری HTML:** [html-reference/index.html](../html-reference/index.html)

---

## 🎯 هدف صفحه
دریافت کد ۵ رقمی ارسال‌شده.

---

## 🧩 ساختار صفحه و المان‌های بصری
- `VERIFY-OTP-001: ۵ ورودی تک‌رقمی کد OTP`

---

## 🎨 آیکن‌ها و دارایی‌ها
- **آیکن‌های استفاده‌شده:** `solar:shield-check-broken`
- **رنگ‌های کلیدی:** Tint (`#3a93e6` / `#68b5f5`), Surface Strong (`#ffffff` / `#212730`), Border (`#d9dfe5`).

---

## 🛠️ راهنمای پیاده‌سازی در Jetpack Compose (Kotlin)
استفاده از Row شامل ۵ BasicTextField.
