import { I18nManager } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import i18n from "../../i18n";
import { zustandStorage } from "@/lib/storage";

export type Language = "en" | "fa";
export type ThemeMode = "light" | "dark" | "system";
export type PrivacyValue = "everyone" | "friends" | "nobody";

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: string[]; // array of product ids
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;

  language: Language;
  setLanguage: (lang: Language) => void;

  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

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
  };
  updateFinance: (info: Partial<AppState["finance"]>) => void;

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
      cart: [],
      addToCart: (id) => set((state) => ({ cart: [...state.cart, id] })),
      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((item) => item !== id) })),
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
        balance: 450000,
      },
      updateFinance: (info) =>
        set((state) => ({
          finance: { ...state.finance, ...info },
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
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
        hasEnteredDemoMode: state.hasEnteredDemoMode,
        user: state.user,
        favorites: state.favorites,
        cart: state.cart,
        recentSearches: state.recentSearches,
      }),
    },
  ),
);
