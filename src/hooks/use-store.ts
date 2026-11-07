import { I18nManager } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import i18n from "../../i18n";
import { zustandStorage } from "@/lib/storage";

export type Language = "en" | "fa";
export type ThemeMode = "light" | "dark" | "system";
export type AppFontFamily = "vazir" | "shabnam" | "sahel" | "system";
export type PrivacyValue = "everyone" | "friends" | "nobody";

export interface CartItem {
  id: string;
  quantity: number;
}

export interface CustomProduct {
  id: string;
  name: string;
  price: number;
  costPrice?: number;
  stockQuantity?: number;
  salesCount?: number;
  description: string;
  image: string;
  category: string;
  seller: string;
  oldPrice?: number;
  discountPercentage?: number;
  hasActiveSale?: boolean;
  saleEndDate?: string;
  rating?: number;
  reviews?: number;
}

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartItems: CartItem[];
  cart: string[]; // legacy getter array of product ids for backward compatibility
  addToCart: (id: string, quantity?: number) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotalCount: () => number;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;

  language: Language;
  setLanguage: (lang: Language) => void;

  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  selectedColorTheme: string;
  setSelectedColorTheme: (color: string) => void;

  fontFamily: AppFontFamily;
  setFontFamily: (font: AppFontFamily) => void;

  fontSizeLevel: number;
  setFontSizeLevel: (level: number) => void;

  isSearchVisible: boolean;
  setSearchVisible: (visible: boolean) => void;

  isSettingsVisible: boolean;
  setSettingsVisible: (visible: boolean) => void;

  isFilterVisible: boolean;
  setFilterVisible: (visible: boolean) => void;

  isThemeModalVisible: boolean;
  setThemeModalVisible: (visible: boolean) => void;

  isLanguageModalVisible: boolean;
  setLanguageModalVisible: (visible: boolean) => void;

  // Search
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // New settings
  privacy: {
    phoneNumber: PrivacyValue;
    lastSeen: PrivacyValue;
    profilePhoto: PrivacyValue;
    groups: PrivacyValue;
    calls: PrivacyValue;
  };
  setPrivacy: (key: keyof AppState["privacy"], value: PrivacyValue) => void;

  notifications: {
    orders: boolean;
    chat: boolean;
    discounts: boolean;
    system: boolean;
  };
  setNotification: (
    key: keyof AppState["notifications"],
    value: boolean,
  ) => void;

  shop: {
    name: string;
    logo: string;
    contact: string;
    location: string;
    website?: string;
    instagram?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    staff: Array<{
      id: string;
      name: string;
      role: string;
      phoneNumber: string;
      avatar: string;
      permissions: string[];
    }>;
  };
  updateShop: (info: Partial<AppState["shop"]>) => void;
  addStaff: (member: AppState["shop"]["staff"][0]) => void;
  updateStaff: (
    id: string,
    info: Partial<AppState["shop"]["staff"][0]>,
  ) => void;
  removeStaff: (id: string) => void;

  finance: {
    iban: string;
    balance: number;
    transactions: Array<{
      id: string;
      type: 'sales' | 'payouts' | 'fees' | 'topup' | 'installment';
      titleFa: string;
      titleEn: string;
      date: string;
      amount: number;
      positive: boolean;
    }>;
    installments: Array<{
      id: string;
      type: 'purchase' | 'sale';
      title: string;
      productName: string;
      totalAmount: number;
      downPayment: number;
      installmentAmount: number;
      totalCount: number;
      paidCount: number;
      frequency: string;
      firstDueDate: string;
      nextDueDate: string;
      schedule: Array<{
        number: number;
        amount: number;
        dueDate: string;
        paidDate?: string;
        isPaid: boolean;
        isDueSoon?: boolean;
        isOverdue?: boolean;
      }>;
    }>;
  };
  updateFinance: (info: Partial<AppState["finance"]>) => void;
  payInstallment: (installmentId: string, installmentNumber: number) => { success: boolean; message: string };
  rechargeWallet: (amount: number) => void;

  customProducts: CustomProduct[];
  addCustomProduct: (product: CustomProduct) => void;
  removeCustomProduct: (id: string) => void;

  // Auth State
  isAuthenticated: boolean;
  isGuest: boolean;
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatar?: string;
  } | null;
  setAuth: (
    auth: Partial<Pick<AppState, "isAuthenticated" | "isGuest" | "user">>,
  ) => void;
  hasEnteredDemoMode: boolean;
  enterDemoMode: () => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      cartItems: [
        { id: "p1", quantity: 2 },
        { id: "p2", quantity: 1 },
      ],
      get cart() {
        return (this as AppState).cartItems.map((item) => item.id);
      },
      addToCart: (id, quantity = 1) =>
        set((state) => {
          const existingIndex = state.cartItems.findIndex((item) => item.id === id);
          let newCartItems: CartItem[];
          if (existingIndex >= 0) {
            newCartItems = state.cartItems.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newCartItems = [...state.cartItems, { id, quantity }];
          }
          return {
            cartItems: newCartItems,
            cart: newCartItems.map((item) => item.id),
          };
        }),
      updateCartQuantity: (id, quantity) =>
        set((state) => {
          let newCartItems: CartItem[];
          if (quantity <= 0) {
            newCartItems = state.cartItems.filter((item) => item.id !== id);
          } else {
            newCartItems = state.cartItems.map((item) =>
              item.id === id ? { ...item, quantity } : item
            );
          }
          return {
            cartItems: newCartItems,
            cart: newCartItems.map((item) => item.id),
          };
        }),
      removeFromCart: (id) =>
        set((state) => {
          const newCartItems = state.cartItems.filter((item) => item.id !== id);
          return {
            cartItems: newCartItems,
            cart: newCartItems.map((item) => item.id),
          };
        }),
      clearCart: () => set({ cartItems: [], cart: [] }),
      getCartTotalCount: () => {
        // Handled via getter helper outside
        return 0;
      },
      favorites: ["p1", "p2", "p3"], // Initial mock favorites
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((fid) => fid !== id)
            : [...state.favorites, id],
        })),
      clearFavorites: () => set({ favorites: [] }),

      language: "fa", // Default to Persian as per request
      setLanguage: (lang) => {
        const isRTL = lang === "fa";
        i18n.changeLanguage(lang);
        if (I18nManager.isRTL !== isRTL) {
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);
          // Note: In a real app, you might need Updates.reloadAsync() here
        }
        set({ language: lang });
      },

      themeMode: "dark", // Default to Dark as per screenshot
      setThemeMode: (mode) => set({ themeMode: mode }),

      selectedColorTheme: "#7B4FA0", // Default active color: Banafsh Shaghayegi #7B4FA0
      setSelectedColorTheme: (color) => set({ selectedColorTheme: color }),

      fontFamily: "vazir",
      setFontFamily: (font) => set({ fontFamily: font }),

      fontSizeLevel: 9,
      setFontSizeLevel: (level) => set({ fontSizeLevel: level }),

      isSearchVisible: false,
      setSearchVisible: (visible) => set({ isSearchVisible: visible }),

      isSettingsVisible: false,
      setSettingsVisible: (visible) => set({ isSettingsVisible: visible }),

      isFilterVisible: false,
      setFilterVisible: (visible) => set({ isFilterVisible: visible }),

      isThemeModalVisible: false,
      setThemeModalVisible: (visible) => set({ isThemeModalVisible: visible }),

      isLanguageModalVisible: false,
      setLanguageModalVisible: (visible) =>
        set({ isLanguageModalVisible: visible }),

      // Search
      recentSearches: [],
      addRecentSearch: (query) =>
        set((state) => {
          if (!query.trim()) return state;
          const filtered = state.recentSearches.filter((s) => s !== query);
          return { recentSearches: [query, ...filtered].slice(0, 10) };
        }),
      removeRecentSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),

      // New settings initial state
      privacy: {
        phoneNumber: "everyone",
        lastSeen: "friends",
        profilePhoto: "everyone",
        groups: "everyone",
        calls: "everyone",
      },
      setPrivacy: (key, value) =>
        set((state) => ({
          privacy: { ...state.privacy, [key]: value },
        })),

      notifications: {
        orders: true,
        chat: true,
        discounts: false,
        system: true,
      },
      setNotification: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),

      shop: {
        name: "فروشگاه کوتیک",
        logo: "",
        contact: "۰۹۱۲۳۴۵۶۷۸۹",
        location: "تهران، خیابان ولیعصر",
        website: "https://kutik.ir",
        instagram: "kutik_shop",
        coordinates: {
          latitude: 35.6892,
          longitude: 51.389,
        },
        staff: [
          {
            id: "s1",
            name: "رضا علوی",
            role: "مدیر فروش",
            phoneNumber: "۰۹۱۲۱۱۱۱۱۱۱",
            avatar: "https://i.pravatar.cc/150?u=s1",
            permissions: ["products", "orders"],
          },
          {
            id: "s2",
            name: "سارا رضایی",
            role: "پشتیبان مشتریان",
            phoneNumber: "۰۹۱۲۲۲۲۲۲۲۲",
            avatar: "https://i.pravatar.cc/150?u=s2",
            permissions: ["chat"],
          },
        ],
      },
      updateShop: (info) =>
        set((state) => ({
          shop: { ...state.shop, ...info },
        })),
      addStaff: (member) =>
        set((state) => ({
          shop: { ...state.shop, staff: [...state.shop.staff, member] },
        })),
      updateStaff: (id, info) =>
        set((state) => ({
          shop: {
            ...state.shop,
            staff: state.shop.staff.map((s) =>
              s.id === id ? { ...s, ...info } : s,
            ),
          },
        })),
      removeStaff: (id) =>
        set((state) => ({
          shop: {
            ...state.shop,
            staff: state.shop.staff.filter((s) => s.id !== id),
          },
        })),

      finance: {
        iban: "IR123456789012345678901234",
        balance: 24500000,
        transactions: [
          { id: '1', type: 'sales', titleFa: 'واریز فروش سفارش #۱۰۴۸', titleEn: 'Sale Deposit #1048', date: '۱۴۰۳/۱۲/۰۵', amount: 4500000, positive: true },
          { id: '2', type: 'installment', titleFa: 'پرداخت قسط ۲ گوشی موبایل S24', titleEn: 'Installment #2 Galaxy S24', date: '۱۴۰۳/۱۲/۰۳', amount: 7500000, positive: false },
          { id: '3', type: 'payouts', titleFa: 'تسویه حساب به کارت بانک ملت', titleEn: 'Bank Settlement Payout', date: '۱۴۰۳/۱۱/۲۸', amount: 12000000, positive: false },
          { id: '4', type: 'fees', titleFa: 'کارمزد زیرساخت فروشگاهی (۲.۵٪)', titleEn: 'Platform Commission Fee', date: '۱۴۰۳/۱۱/۲۵', amount: 112500, positive: false },
          { id: '5', type: 'topup', titleFa: 'شارژ آنلاین کیف‌پول از درگاه شتاب', titleEn: 'Online Wallet Top-up', date: '۱۴۰۳/۱۱/۲۰', amount: 10000000, positive: true },
        ],
        installments: [
          {
            id: 'inst-buyer-1',
            type: 'purchase',
            title: 'خرید اقساطی گوشی سامسونگ S24 اولترا',
            productName: 'گوشی موبایل گلکسی S24 اولترا ۲۵۶ گیگ',
            totalAmount: 45000000,
            downPayment: 15000000,
            installmentAmount: 7500000,
            totalCount: 4,
            paidCount: 1,
            frequency: 'ماهانه',
            firstDueDate: '۱۴۰۳/۱۱/۱۵',
            nextDueDate: '۱۴۰۳/۱۲/۱۵',
            schedule: [
              { number: 1, amount: 7500000, dueDate: '۱۴۰۳/۱۱/۱۵', paidDate: '۱۴۰۳/۱۱/۱۴', isPaid: true },
              { number: 2, amount: 7500000, dueDate: '۱۴۰۳/۱۲/۱۵', isPaid: false, isDueSoon: true },
              { number: 3, amount: 7500000, dueDate: '۱۴۰۴/۰۱/۱۵', isPaid: false },
              { number: 4, amount: 7500000, dueDate: '۱۴۰۴/۰۲/۱۵', isPaid: false },
            ],
          },
          {
            id: 'inst-buyer-2',
            type: 'purchase',
            title: 'خرید اقساطی ساعت هوشمند اپل واچ اولترا ۲',
            productName: 'اپل واچ اولترا ۲ بدنه تیتانیوم',
            totalAmount: 32000000,
            downPayment: 8000000,
            installmentAmount: 8000000,
            totalCount: 3,
            paidCount: 2,
            frequency: 'ماهانه',
            firstDueDate: '۱۴۰۳/۱۰/۲۵',
            nextDueDate: '۱۴۰۳/۱۲/۲۵',
            schedule: [
              { number: 1, amount: 8000000, dueDate: '۱۴۰۳/۱۰/۲۵', paidDate: '۱۴۰۳/۱۰/۲۵', isPaid: true },
              { number: 2, amount: 8000000, dueDate: '۱۴۰۳/۱۱/۲۵', paidDate: '۱۴۰۳/۱۱/۲۴', isPaid: true },
              { number: 3, amount: 8000000, dueDate: '۱۴۰۳/۱۲/۲۵', isPaid: false },
            ],
          },
          {
            id: 'inst-seller-1',
            type: 'sale',
            title: 'فروش اقساطی لپ‌تاپ ایسوس TUF گیمینگ',
            productName: 'لپ‌تاپ گیمینگ ایسوس TUF Dash F15',
            totalAmount: 68000000,
            downPayment: 20000000,
            installmentAmount: 16000000,
            totalCount: 3,
            paidCount: 2,
            frequency: 'ماهانه',
            firstDueDate: '۱۴۰۳/۱۰/۰۱',
            nextDueDate: '۱۴۰۳/۱۲/۰۱',
            schedule: [
              { number: 1, amount: 16000000, dueDate: '۱۴۰۳/۱۰/۰۱', paidDate: '۱۴۰۳/۱۰/۰۱', isPaid: true },
              { number: 2, amount: 16000000, dueDate: '۱۴۰۳/۱۱/۰۱', paidDate: '۱۴۰۳/۱۱/۰۱', isPaid: true },
              { number: 3, amount: 16000000, dueDate: '۱۴۰۳/۱۲/۰۱', isPaid: false, isOverdue: true },
            ],
          },
        ],
      },
      updateFinance: (info) =>
        set((state) => ({
          finance: { ...state.finance, ...info },
        })),
      payInstallment: (installmentId, installmentNumber) => {
        let result = { success: false, message: '' };
        set((state) => {
          const inst = state.finance.installments.find((i) => i.id === installmentId);
          if (!inst) {
            result = { success: false, message: 'طرح اقساطی یافت نشد' };
            return state;
          }
          const item = inst.schedule.find((s) => s.number === installmentNumber);
          if (!item) {
            result = { success: false, message: 'قسط مورد نظر یافت نشد' };
            return state;
          }
          if (item.isPaid) {
            result = { success: false, message: 'این قسط قبلاً پرداخت شده است' };
            return state;
          }
          if (state.finance.balance < item.amount) {
            result = { success: false, message: 'موجودی کیف پول برای پرداخت این قسط کافی نیست' };
            return state;
          }

          const newBalance = state.finance.balance - item.amount;
          const updatedSchedule = inst.schedule.map((s) =>
            s.number === installmentNumber
              ? { ...s, isPaid: true, paidDate: 'امروز', isDueSoon: false, isOverdue: false }
              : s
          );
          const updatedPaidCount = updatedSchedule.filter((s) => s.isPaid).length;
          const nextPending = updatedSchedule.find((s) => !s.isPaid);

          const updatedInstallments = state.finance.installments.map((i) =>
            i.id === installmentId
              ? {
                  ...i,
                  paidCount: updatedPaidCount,
                  nextDueDate: nextPending ? nextPending.dueDate : 'تسویه کامل',
                  schedule: updatedSchedule,
                }
              : i
          );

          const newTransaction = {
            id: `tx-${Date.now()}`,
            type: 'installment' as const,
            titleFa: `پرداخت قسط ${installmentNumber} ${inst.title}`,
            titleEn: `Installment #${installmentNumber} ${inst.title}`,
            date: 'هم‌اکنون',
            amount: item.amount,
            positive: false,
          };

          result = { success: true, message: 'قسط با موفقیت از موجودی کیف پول پرداخت گردید' };
          return {
            finance: {
              ...state.finance,
              balance: newBalance,
              installments: updatedInstallments,
              transactions: [newTransaction, ...state.finance.transactions],
            },
          };
        });
        return result;
      },
      rechargeWallet: (amount) => {
        if (!amount || amount <= 0) return;
        set((state) => {
          const newTransaction = {
            id: `topup-${Date.now()}`,
            type: 'topup' as const,
            titleFa: 'شارژ حساب کیف‌پول کوتیک',
            titleEn: 'Kutik Wallet Recharge',
            date: 'هم‌اکنون',
            amount,
            positive: true,
          };
          return {
            finance: {
              ...state.finance,
              balance: state.finance.balance + amount,
              transactions: [newTransaction, ...state.finance.transactions],
            },
          };
        });
      },

      customProducts: [],
      addCustomProduct: (product) =>
        set((state) => ({
          customProducts: [product, ...state.customProducts],
        })),
      removeCustomProduct: (id) =>
        set((state) => ({
          customProducts: state.customProducts.filter((p) => p.id !== id),
        })),

      // Auth State Initial
      isAuthenticated: false,
      isGuest: false,
      hasEnteredDemoMode: false,
      user: null,
      setAuth: (auth) =>
        set((state) => {
          const newState = { ...state, ...auth };
          return newState;
        }),
      enterDemoMode: () => set({ hasEnteredDemoMode: true }),
      logout: () =>
        set({
          isAuthenticated: false,
          isGuest: false,
          user: null,
          hasEnteredDemoMode: false,
        }),
    }),
    {
      name: "cardiani-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        language: state.language,
        themeMode: state.themeMode,
        selectedColorTheme: state.selectedColorTheme,
        fontFamily: state.fontFamily,
        fontSizeLevel: state.fontSizeLevel,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
        hasEnteredDemoMode: state.hasEnteredDemoMode,
        user: state.user,
        favorites: state.favorites,
        cartItems: state.cartItems,
        cart: state.cartItems.map((item) => item.id),
        recentSearches: state.recentSearches,
        customProducts: state.customProducts,
      }),
    },
  ),
);
