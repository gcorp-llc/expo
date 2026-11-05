export const faTranslations = {
  common: {
    appName: "کوتیک",
    platformName: "پلتفرم کاردیانی",
    home: "خانه",
    favorites: "علاقه‌مندی‌ها",
    addListing: "افزودن آگهی",
    messages: "پیام‌ها",
    shop: "فروشگاه",
    settings: "تنظیمات",
    search: "جستجو...",
    retry: "تلاش مجدد",
    error: "خطایی رخ داد",
    loading: "در حال بارگذاری...",
    offlineMode: "حالت آفلاین",
    save: "ذخیره",
    cancel: "انصراف",
    confirm: "تایید"
  },
  auth: {
    welcome: "به کاردیانی خوش آمدید",
    login: "ورود به حساب",
    logout: "خروج از حساب",
    phonePlaceholder: "شماره همراه (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)",
    otpPlaceholder: "کد تأیید",
    sendOtp: "ارسال کد تأیید",
    verifyOtp: "تأیید و ورود",
    guestContinue: "ورود به عنوان مهمان"
  },
  payment: {
    checkout: "تکمیل خرید",
    payWithStripe: "پرداخت با کارت / Stripe",
    success: "پرداخت با موفقیت انجام شد",
    failed: "پرداخت ناموفق بود"
  }
};

export const enTranslations = {
  common: {
    appName: "Kutik",
    platformName: "Cardiani Platform",
    home: "Home",
    favorites: "Favorites",
    addListing: "Add Listing",
    messages: "Messages",
    shop: "Shop",
    settings: "Settings",
    search: "Search...",
    retry: "Retry",
    error: "An error occurred",
    loading: "Loading...",
    offlineMode: "Offline Mode",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm"
  },
  auth: {
    welcome: "Welcome to Cardiani",
    login: "Login",
    logout: "Logout",
    phonePlaceholder: "Phone Number",
    otpPlaceholder: "Verification Code",
    sendOtp: "Send Code",
    verifyOtp: "Verify & Enter",
    guestContinue: "Continue as Guest"
  },
  payment: {
    checkout: "Checkout",
    payWithStripe: "Pay with Stripe",
    success: "Payment completed successfully",
    failed: "Payment failed"
  }
};

export const defaultLocale = 'fa';
export const supportedLocales = ['fa', 'en'] as const;
export type SupportedLocale = typeof supportedLocales[number];
