
import type { ExpoConfig } from 'expo/config';

const plugins: ExpoConfig['plugins'] = [
  'expo-router',

  [
    'expo-splash-screen',
    {
      backgroundColor: '#208AEF',
      image: './assets/images/splash-icon.png',
      imageWidth: 76
    }
  ],

  'expo-secure-store',

  [
    'expo-camera',
    {
      cameraPermission:
        'برای ثبت عکس مدارک، اسکن بارکد محصولات و تصویر پروفایل به دوربین نیاز است.'
    }
  ],

  [
    'expo-image-picker',
    {
      photosPermission:
        'برای انتخاب تصاویر محصولات، رسیدها و تصویر نمایه به گالری دسترسی لازم است.',
      cameraPermission:
        'برای ثبت تصویر محصولات و مدارک به دوربین نیاز است.'
    }
  ],

  [
    'expo-location',
    {
      locationWhenInUsePermission:
        'برای یافتن شعب نزدیک، موقعیت تحویل سفارشات و خدمات خودرویی به موقعیت مکانی نیاز است.'
    }
  ],

  [
    'expo-notifications',
    {
      defaultChannel: 'default'
    }
  ],

  [
    '@stripe/stripe-react-native',
    {
      merchantIdentifier: 'merchant.cc.gcorp.cardiani',
      enableGooglePay: true
    }
  ]
];

// Sentry فقط زمانی در تنظیمات Native فعال می‌شود
// که مقادیر واقعی سازمان و پروژه تعریف شده باشند.
if (process.env.SENTRY_ORG && process.env.SENTRY_PROJECT) {
  plugins.push([
    '@sentry/react-native/expo',
    {
      organization: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT
    }
  ]);
}

const config: ExpoConfig = {
  name: 'Kutik',
  slug: 'cardiani',
  version: '1.0.0',

  orientation: 'portrait',
  scheme: 'cardiani',

  userInterfaceStyle: 'automatic',

  platforms: ['android', 'ios', 'web'],

  icon: './assets/images/icon.png',

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.gcorp.cardiani',

    infoPlist: {
      NSCameraUsageDescription:
        'برای ثبت عکس مدارک، اسکن بارکد محصولات و تصویر پروفایل به دوربین نیاز است.',

      NSPhotoLibraryUsageDescription:
        'برای انتخاب تصاویر محصولات، رسیدها و تصویر نمایه به گالری دسترسی لازم است.',

      NSPhotoLibraryAddUsageDescription:
        'برای ذخیره تصاویر و رسیدهای پرداخت در گالری دستگاه به این دسترسی نیاز است.',

      NSLocationWhenInUseUsageDescription:
        'برای یافتن شعب نزدیک و موقعیت تحویل سفارشات به موقعیت مکانی نیاز است.'
    }
  },

  android: {
    package: 'com.gcorp.cardiani',

    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage:
        './assets/images/android-icon-foreground.png',
      backgroundImage:
        './assets/images/android-icon-background.png',
      monochromeImage:
        './assets/images/android-icon-monochrome.png'
    },

    predictiveBackGestureEnabled: false
  },

  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png'
  },

  plugins,

  experiments: {
    typedRoutes: true
  },

  extra: {
    eas: process.env.EAS_PROJECT_ID
      ? {
          projectId: process.env.EAS_PROJECT_ID
        }
      : undefined
  }
};

export default config;
