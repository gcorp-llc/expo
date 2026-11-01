import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { cardianiApi } from '@/lib/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

let currentPushToken: string | null = null;

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('[Push] Must use physical device for Push Notifications');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[Push] Permission not granted for push notifications.');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    currentPushToken = token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: 4, // AndroidImportance.HIGH
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#208AEF',
      });
    }

    // Register with Cardiani Backend
    await cardianiApi.registerPushDevice(token, Platform.OS);
    return token;
  } catch (error) {
    console.error('[Push] Failed to register token:', error);
    return null;
  }
}

export async function unregisterPushNotificationsAsync(): Promise<void> {
  if (currentPushToken) {
    try {
      await cardianiApi.unregisterPushDevice(currentPushToken);
      currentPushToken = null;
    } catch (err) {
      console.warn('[Push] Failed to unregister device token on backend:', err);
    }
  }
}
