import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { StateStorage } from 'zustand/middleware';
import * as Sentry from '@sentry/react-native';

const isWeb = Platform.OS === 'web';

/**
 * Environment detection (Fail-Safe Approach)
 * به جای جستجو برای Expo Go، با قطعیت به دنبال بیلد واقعی می‌گردیم.
 * ExecutionEnvironment.Bare: بیلدهای توسعه (Development Builds / expo-dev-client)
 * ExecutionEnvironment.Standalone: بیلدهای نهایی پروداکشن (EAS Builds)
 */
const isDefinitiveNativeBuild =
  Constants.executionEnvironment === ExecutionEnvironment.Bare ||
  Constants.executionEnvironment === ExecutionEnvironment.Standalone;

/**
 * Universal storage provider selector.
 * پیش‌فرض امن: همیشه روی AsyncStorage باش، مگر اینکه کاملا مطمئن باشی بیلد نیتیو است.
 */
const getStorageProvider = () => {
  // ۱. محیط وب (شامل پشتیبانی از SSR)
  if (isWeb) {
    if (typeof window !== 'undefined' && window.localStorage) {
      return {
        getItem: (name: string) => window.localStorage.getItem(name),
        setItem: (name: string, value: string) => window.localStorage.setItem(name, value),
        removeItem: (name: string) => window.localStorage.removeItem(name),
      };
    }
    // SSR Fallback
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  // ۲. اگر با قطعیت ۱۰۰٪ در یک بیلد نیتیو واقعی هستیم -> تلاش برای استفاده از MMKV
  if (isDefinitiveNativeBuild) {
    try {
      const { MMKV } = require('react-native-mmkv');
      const storage = new MMKV({ id: 'cardiani-secure-instance' });

      return {
        getItem: (name: string) => storage.getString(name) ?? null,
        setItem: (name: string, value: string) => storage.set(name, value),
        removeItem: (name: string) => storage.delete(name),
      };
    } catch (error) {
      console.error('[Storage] MMKV init failed in native build, safely falling back to AsyncStorage:', error);
      Sentry.captureException(error);
      // در صورت هرگونه خطا، روند کد به بخش پیش‌فرض (شماره ۳) منتقل می‌شود
    }
  }

  // ۳. پیش‌فرض امن و قطعی (Fallback / Expo Go / Unknown Environment)
  // اگر در اکسپو گو باشیم، یا نتوانیم محیط را تشخیص دهیم، یا MMKV خطا بدهد، اینجا اجرا می‌شود.
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return {
      getItem: async (name: string) => await AsyncStorage.getItem(name),
      setItem: async (name: string, value: string) => await AsyncStorage.setItem(name, value),
      removeItem: async (name: string) => await AsyncStorage.removeItem(name),
    };
  } catch (error) {
    console.error('[Storage] Fatal Error: AsyncStorage also failed to load:', error);
    Sentry.captureException(error);
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
};

const provider = getStorageProvider();

/**
 * Standardized Zustand StateStorage adapter.
 */
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    try {
      return provider.setItem(name, value);
    } catch (error) {
      console.error(`[Storage] Error setting item "${name}":`, error);
      Sentry.captureException(error);
    }
  },
  getItem: (name) => {
    try {
      return provider.getItem(name);
    } catch (error) {
      console.error(`[Storage] Error getting item "${name}":`, error);
      Sentry.captureException(error);
      return null;
    }
  },
  removeItem: (name) => {
    try {
      return provider.removeItem(name);
    } catch (error) {
      console.error(`[Storage] Error removing item "${name}":`, error);
      Sentry.captureException(error);
    }
  },
};