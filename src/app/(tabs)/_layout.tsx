import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore, Language, ThemeMode } from '@/hooks/use-store';
import { SelectionModal, Option } from '@/components/ui/SelectionModal';
import { HapticTab } from '@/components/haptic-tab';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { Iconify } from '@/components/ui/Iconify';

interface TabIconProps {
  focused: boolean;
  color: string;
  iconName: string;
  activeIconName?: string;
  badge?: string;
}

/**
 * A professional Animated Tab Icon with Haptic-like spring animation
 */
const TabIcon = React.memo(({
  focused,
  color,
  iconName,
  activeIconName,
  badge,
}: TabIconProps) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withSpring(1.15, { damping: 12, stiffness: 200 })
      );
      translateY.value = withSpring(-2, { damping: 15 });
    } else {
      scale.value = withSpring(1);
      translateY.value = withSpring(0);
    }
  }, [focused, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
  }));

  const currentIcon = focused && activeIconName ? activeIconName : iconName;

  return (
    <View style={styles.tabItem}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Iconify
          icon={currentIcon}
          size={28}
          color={color}
        />

        {!!badge && (
          <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
});
TabIcon.displayName = 'TabIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const {
    language,
    setLanguage,
    themeMode,
    setThemeMode,
    isThemeModalVisible,
    setThemeModalVisible,
    isLanguageModalVisible,
    setLanguageModalVisible,
  } = useStore();

  const isRTL = language === 'fa';

  const languages = useMemo<Option[]>(() => [
    { label: 'فارسی', value: 'fa', icon: 'solar:globus-broken' },
    { label: 'English', value: 'en', icon: 'solar:globus-broken' },
  ], []);

  const themes = useMemo<Option[]>(() => [
    { label: isRTL ? 'روشن' : 'Light', value: 'light', icon: 'solar:sun-broken' },
    { label: isRTL ? 'تاریک' : 'Dark', value: 'dark', icon: 'solar:moon-broken' },
    { label: isRTL ? 'سیستم' : 'System', value: 'system', icon: 'solar:settings-minimalistic-broken' },
  ], [isRTL]);

  const screenOptions = useMemo(() => ({
    headerShown: false,
    tabBarActiveTintColor: colors.tint,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarShowLabel: true,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarStyle: [
      styles.tabBar,
      {
        borderColor: colors.border,
        backgroundColor: colors.surface,
      },
    ],
    tabBarItemStyle: styles.tabBarItem,
    tabBarButton: (props: any) => (
      <HapticTab {...props} android_ripple={null} activeOpacity={1} />
    ),
    tabBarBackground: () => (
      <BlurView
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        intensity={80}
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: 28,
            overflow: 'hidden',
            backgroundColor: colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.82)',
          },
        ]}
      />
    ),
  }), [colors, colorScheme]);

  return (
    <>
      <Tabs screenOptions={screenOptions as any}>
        <Tabs.Screen
          name="index"
          options={{
            title: isRTL ? 'خانه' : 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                focused={focused} 
                color={String(color)}
                iconName="solar:home-angle-broken"
                activeIconName="solar:home-angle-bold-duotone"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: isRTL ? 'علاقه‌مندی' : 'Wishlist',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                focused={focused} 
                color={String(color)}
                iconName="solar:heart-broken" 
                activeIconName="solar:heart-bold-duotone"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="sell"
          options={{
            title: isRTL ? 'ثبت آگهی' : 'Sell',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                focused={focused} 
                color={String(color)}
                iconName="solar:add-square-broken" 
                activeIconName="solar:add-square-bold-duotone"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            title: isRTL ? 'پیام‌ها' : 'Messages',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                color={String(color)}
                iconName="solar:chat-line-broken"
                activeIconName="solar:chat-line-bold-duotone"
                badge="2"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: isRTL ? 'تنظیمات' : 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                focused={focused} 
                color={String(color)}
                iconName="solar:settings-minimalistic-broken"
                activeIconName="solar:settings-minimalistic-bold-duotone"
              />
            ),
          }}
        />
      </Tabs>

      <SelectionModal
        isVisible={isLanguageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        options={languages}
        selectedValue={language}
        onSelect={(val) => setLanguage(val as Language)}
        title={isRTL ? 'انتخاب زبان' : 'Select Language'}
        isRTL={isRTL}
      />

      <SelectionModal
        isVisible={isThemeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        options={themes}
        selectedValue={themeMode}
        onSelect={(val) => setThemeMode(val as ThemeMode)}
        title={isRTL ? 'انتخاب تم' : 'Select Theme'}
        isRTL={isRTL}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    height: 72,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  tabBarItem: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
});
