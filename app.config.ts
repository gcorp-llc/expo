import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const isProd = process.env.APP_ENV === 'production';
  const isPreview = process.env.APP_ENV === 'preview';

  return {
    ...config,
    name: 'Kutik',
    slug: 'cardiani',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'cardiani',
    userInterfaceStyle: 'automatic',
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/00000000-0000-0000-0000-000000000000',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.gcorp.cardiani',
      icon: './assets/expo.icon',
      infoPlist: {
        NSCameraUsageDescription:
          'برای ثبت عکس مدارک، اسکن بارکد محصولات و تصویر پروفایل به دوربین نیاز است. (Cardiani needs camera access for documents, barcodes and profile pictures)',
        NSPhotoLibraryUsageDescription:
          'برای انتخاب تصاویر محصولات، رسیدها و تصویر نمایه به گالری دسترسی لازم است. (Cardiani needs photo library access for products, receipts, and profile images)',
        NSPhotoLibraryAddUsageDescription:
          'برای ذخیره تصاویر و رسیدهای پرداخت در گالری دستگاه به این دسترسی نیاز است. (Cardiani needs permission to save receipt images to your photo library)',
        NSLocationWhenInUseUsageDescription:
          'برای یافتن شعب نزدیک، موقعیت تحویل سفارشات و خدمات خودرویی به لوکیشن نیاز است. (Cardiani needs location access to find nearby services and delivery addresses)',
        UIBackgroundModes: ['remote-notification'],
      },
    },
    android: {
      package: 'com.gcorp.cardiani',
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      permissions: [
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.POST_NOTIFICATIONS',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        '@sentry/react-native/expo',
        {
          organization: process.env.SENTRY_ORG || 'gcorp-llc',
          project: process.env.SENTRY_PROJECT || 'cardiani-mobile',
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      ],
      'expo-secure-store',
      [
        '@stripe/stripe-react-native',
        {
          merchantIdentifier: 'merchant.cc.gcorp.cardiani',
          enableGooglePay: true,
        },
      ],
      'expo-localization',
      'expo-image',
      'expo-status-bar',
      'expo-web-browser',
      'expo-font',
      'expo-build-properties',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || '00000000-0000-0000-0000-000000000000',
      },
    },
  };
};
