import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Pressable, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore, Language, ThemeMode } from '@/hooks/use-store';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

export const FloatingDrawer = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const {
    isSettingsVisible,
    setSettingsVisible,
    language,
    setLanguage,
    themeMode,
    setThemeMode
  } = useStore();

  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    translateY.value = withTiming(isSettingsVisible ? 0 : SCREEN_HEIGHT, {
      duration: isSettingsVisible ? 350 : 300,
      easing: isSettingsVisible ? Easing.out(Easing.quad) : Easing.in(Easing.quad),
    });
  }, [isSettingsVisible, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT, 0],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity,
    };
  });

  if (!isSettingsVisible) return null;

  const isRTL = language === 'fa';

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const t = {
    fa: {
      account: 'حساب کاربری',
      settings: 'تنظیمات و حریم خصوصی',
      help: 'راهنما',
      clinic: 'مدیریت فروشگاه',
      language: 'تغییر زبان',
      theme: 'حالت نمایش',
      management: 'مدیریت',
      posts: 'محصولات من',
      analytics: 'آمار و تحلیل‌ها',
      finance: 'امور مالی و کیف پول',
      logout: 'خروج از حساب',
      viewProfile: 'مشاهده پروفایل',
      editProfile: 'مشاهده و ویرایش پروفایل',
      userName: 'کاربر کوتیک',
      day: 'روز',
      night: 'شب',
      system: 'سیستم',
    },
    en: {
      account: 'Account',
      settings: 'Settings & Privacy',
      help: 'Help',
      clinic: 'Shop Management',
      language: 'Language',
      theme: 'Display Mode',
      management: 'Management',
      posts: 'My Products',
      analytics: 'Stats & Analytics',
      finance: 'Finance & Wallet',
      logout: 'Logout',
      viewProfile: 'View Profile',
      editProfile: 'View and Edit Profile',
      userName: 'KuTik User',
      day: 'Day',
      night: 'Night',
      system: 'System',
    }
  }[language];

  const MenuItem = ({ icon, label, value, onPress, color, badge }: any) => (
    <TouchableOpacity
      style={[styles.menuItem, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuItemLeft, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
        <View style={[styles.iconContainer, { backgroundColor: color || colors.surfaceStrong }]}>
          <Iconify icon={icon} size={20} color={color ? '#fff' : colors.text} />
        </View>
        <Text style={[styles.menuItemLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={[styles.menuItemRight, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: colors.tint, [isRTL ? 'marginRight' : 'marginLeft']: 8 }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        {value && <Text style={[styles.menuItemValue, { color: colors.textSecondary, [isRTL ? 'marginRight' : 'marginLeft']: 8 }]}>{value}</Text>}
        <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={18} color={colors.icon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setSettingsVisible(false)} />
      </Animated.View>

      <Animated.View style={[
        styles.drawer,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
        },
        animatedStyle
      ]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={[styles.headerTop, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
              <TouchableOpacity
                style={styles.themeIconButton}
                onPress={toggleTheme}
                accessibilityLabel="theme-toggle"
              >
                <Iconify
                  icon={themeMode === 'dark' ? "solar:moon-broken" : "solar:sun-broken"}
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>

              <View style={[styles.userInfo, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                <View style={[styles.userMeta, { [isRTL ? 'marginLeft' : 'marginRight']: 12, alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
                  <Text style={[styles.userName, { color: colors.text }]}>{t.userName}</Text>
                  <Text style={[styles.userStatus, { color: colors.textSecondary }]}>{t.editProfile}</Text>
                </View>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?u=zeteb' }}
                  style={styles.avatar}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: colors.tint + '20' }]}
              onPress={() => {
                setSettingsVisible(false);
                router.push('/profile');
              }}
            >
              <Text style={[styles.profileButtonText, { color: colors.tint }]}>{t.viewProfile}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'left' : 'right' }]}>{t.account}</Text>
            <MenuItem
              icon="solar:settings-minimalistic-broken"
              label={t.settings}
              onPress={() => { setSettingsVisible(false); router.push('/settings/privacy'); }}
            />
            <MenuItem
              icon="solar:help-broken"
              label={t.help}
              onPress={() => { setSettingsVisible(false); router.push('/settings/help'); }}
            />

            <TouchableOpacity
              style={[styles.clinicButton, { backgroundColor: colors.tint, flexDirection: isRTL ? 'row' : 'row-reverse' }]}
              onPress={() => { setSettingsVisible(false); router.push('/settings/shop-management'); }}
            >
              <Iconify icon="solar:shop-2-broken" size={20} color="#fff" />
              <Text style={styles.clinicButtonText}>{t.clinic}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
              <Iconify icon="solar:globus-broken" size={20} color={colors.icon} />
              <Text style={[styles.sectionTitle, { color: colors.textSecondary, [isRTL ? 'marginLeft' : 'marginRight']: 8, marginBottom: 0 }]}>{t.language}</Text>
            </View>
            <View style={[styles.toggleGroup, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
              <TouchableOpacity
                style={[styles.toggleItem, language === 'fa' && { backgroundColor: colors.tint }]}
                onPress={() => setLanguage('fa')}
                accessibilityLabel="lang-fa"
              >
                <Text style={[styles.toggleText, language === 'fa' && { color: '#fff' }]}>فارسی</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleItem, language === 'en' && { backgroundColor: colors.tint }]}
                onPress={() => setLanguage('en')}
                accessibilityLabel="lang-en"
              >
                <Text style={[styles.toggleText, language === 'en' && { color: '#fff' }]}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleItem}>
                <Text style={[styles.toggleText, { color: colors.textSecondary }]}>العربية</Text>
              </TouchableOpacity>
            </View>
          </View>


          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'left' : 'right' }]}>{t.management}</Text>
            <MenuItem
              icon="solar:widget-2-broken"
              label={t.posts}
              badge="12"
              onPress={() => { setSettingsVisible(false); router.push('/settings/my-products'); }}
            />
            <MenuItem
              icon="solar:fire-broken"
              label={t.analytics}
              onPress={() => { setSettingsVisible(false); router.push('/settings/analytics'); }}
            />
            <MenuItem
              icon="solar:lock-password-broken"
              label={t.finance}
              onPress={() => { setSettingsVisible(false); router.push('/settings/finance'); }}
            />
          </View>

          <TouchableOpacity style={[styles.logoutButton, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
            <Iconify icon="solar:logout-broken" size={20} color={colors.destructive} />
            <Text style={[styles.logoutText, { color: colors.destructive }]}>{t.logout}</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    overflow: 'hidden',
    zIndex: 2000,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  themeIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  userMeta: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 13,
  },
  profileButton: {
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 13,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  clinicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 16,
    marginTop: 16,
    gap: 10,
  },
  clinicButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: Platform.select({ ios: 'rgba(0,0,0,0.05)', default: 'rgba(0,0,0,0.03)' }),
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  toggleItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 10,
    gap: 6,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.1)',
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
