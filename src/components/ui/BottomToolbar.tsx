import React from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { Iconify } from '@/components/ui/Iconify';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface TabItemProps {
  focused: boolean;
  color: string;
  label: string;
  iconName: string;
  activeIconName: string;
  badge?: string;
  onPress: () => void;
}

const TabIconButton = React.memo(({
  focused,
  color,
  label,
  iconName,
  activeIconName,
  badge,
  onPress,
}: TabItemProps) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSequence(
        withTiming(1.18, { duration: 100 }),
        withSpring(1.12, { damping: 12, stiffness: 200 })
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
      { translateY: translateY.value },
    ],
  }));

  const currentIcon = focused ? activeIconName : iconName;

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Iconify
          icon={currentIcon}
          size={26}
          color={color}
        />
        {!!badge && (
          <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </Animated.View>
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? color : color },
          focused && styles.activeTabLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

TabIconButton.displayName = 'TabIconButton';

export const BottomToolbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { language, isAuthenticated, isGuest } = useStore();
  const isRTL = language === 'fa';

  // Only show BottomToolbar on main tab screens
  const isMainTab =
    pathname === '/' ||
    pathname === '/(tabs)' ||
    pathname === '/(tabs)/index' ||
    pathname === '/home' ||
    pathname === '/(tabs)/favorites' ||
    pathname === '/favorites' ||
    pathname === '/(tabs)/sell' ||
    pathname === '/sell' ||
    pathname === '/(tabs)/chat' ||
    pathname === '/chat' ||
    pathname === '/(tabs)/shop' ||
    pathname === '/shop';

  if (!isMainTab || (!isAuthenticated && !isGuest)) {
    return null;
  }

  const tabs = [
    {
      key: 'home',
      route: '/(tabs)',
      isMatch: pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index' || pathname === '/home',
      label: isRTL ? 'خانه' : 'Home',
      icon: 'solar:home-angle-broken',
      activeIcon: 'solar:home-angle-bold-duotone',
    },
    {
      key: 'favorites',
      route: '/(tabs)/favorites',
      isMatch: pathname === '/(tabs)/favorites' || pathname === '/favorites',
      label: isRTL ? 'علاقه‌مندی‌ها' : 'Favorites',
      icon: 'solar:heart-broken',
      activeIcon: 'solar:heart-bold-duotone',
    },
    {
      key: 'sell',
      route: '/(tabs)/sell',
      isMatch: pathname === '/(tabs)/sell' || pathname === '/sell',
      label: isRTL ? 'افزودن آگهی' : 'Sell',
      icon: 'solar:add-square-broken',
      activeIcon: 'solar:add-square-bold-duotone',
    },
    {
      key: 'chat',
      route: '/(tabs)/chat',
      isMatch: pathname === '/(tabs)/chat' || pathname === '/chat',
      label: isRTL ? 'پیام‌ها' : 'Messages',
      icon: 'solar:chat-line-broken',
      activeIcon: 'solar:chat-line-bold-duotone',
      badge: '2',
    },
    {
      key: 'shop',
      route: '/(tabs)/shop',
      isMatch: pathname === '/(tabs)/shop' || pathname === '/shop',
      label: isRTL ? 'فروشگاه' : 'Shop',
      icon: 'solar:bag-smile-outline',
      activeIcon: 'solar:bag-smile-bold-duotone',
      badge: '3',
    },
  ];

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View
        style={[
          styles.tabBar,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <BlurView
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          intensity={80}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: 28,
              overflow: 'hidden',
              backgroundColor:
                colorScheme === 'dark'
                  ? 'rgba(15, 23, 42, 0.75)'
                  : 'rgba(255, 255, 255, 0.82)',
            },
          ]}
        />
        <View style={styles.tabContent}>
          {tabs.map((tab) => {
            const focused = tab.isMatch;
            const color = focused ? colors.tint : colors.textSecondary;
            return (
              <TabIconButton
                key={tab.key}
                focused={focused}
                color={color}
                label={tab.label}
                iconName={tab.icon}
                activeIconName={tab.activeIcon}
                badge={tab.badge}
                onPress={() => router.push(tab.route as any)}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  tabBar: {
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
  tabContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
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
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  activeTabLabel: {
    fontWeight: '800',
  },
});
