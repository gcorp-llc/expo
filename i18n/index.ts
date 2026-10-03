import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "chat": "Chat",
      "sell": "Sell",
      "favorites": "Favorites",
      "settings": "Settings",
      "home": "Home",
      "search": "Search...",
      "my_shop": "My Shop",
      "products": "Products",
      "stats": "Stats",
      "finance": "Finance",
      "messages": "Messages",
      "categories": "Categories",
      "see_all": "See All",
      "hot_suggestions": "Hot Suggestions",
      "all_products": "All Products"
    }
  },
  fa: {
    translation: {
      "welcome": "خوش آمدید",
      "chat": "پیام",
      "sell": "فروش",
      "favorites": "علاقه‌مندی‌ها",
      "settings": "تنظیمات",
      "home": "خانه",
      "search": "جستجو...",
      "my_shop": "فروشگاه من",
      "products": "محصولات",
      "stats": "آمار",
      "finance": "امور مالی",
      "messages": "پیام‌ها",
      "categories": "دسته‌بندی‌ها",
      "see_all": "مشاهده همه",
      "hot_suggestions": "پیشنهادات داغ",
      "all_products": "همه محصولات"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fa',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
