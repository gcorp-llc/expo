import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { StateStorage } from 'zustand/middleware';
import * as Sentry from '@sentry/react-native';

const isWeb = Platform.OS === 'web';

/**
 * Environment detection (Fail-Safe Approach)
 * Explicitly detect Expo Go / StoreClient to avoid trying to load C++ native modules like MMKV/NitroModules in Expo Go.
 */
const isExpoGo =
  Constants.appOwnership === 'expo' ||
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  (Constants.executionEnvironment as string) === 'storeClient';

const isDefinitiveNativeBuild =
  !isExpoGo &&
  (Constants.executionEnvironment === ExecutionEnvironment.Bare ||
    Constants.executionEnvironment === ExecutionEnvironment.Standalone);

/**
 * Universal storage provider selector.
 * Fallback safely to AsyncStorage when running in Expo Go or web environment.
 */
const getStorageProvider = () => {
  // 1. Web Environment (including SSR)
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

  // 2. Definitive Native Custom Build (Expo Dev Client / EAS Standalone, non-Expo Go) -> Try MMKV
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
      console.warn('[Storage] MMKV unavailable in current environment, falling back to AsyncStorage.');
    }
  }

  // 3. Fallback / Expo Go / Default Storage via AsyncStorage
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
