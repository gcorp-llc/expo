import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, Language, ThemeMode } from '@/hooks/use-store';
import { Iconify } from '@/components/ui/Iconify';
import { GuestRestrictionOverlay } from '@/components/ui/GuestRestrictionOverlay';
import { useRouter } from 'expo-router';
import { Option } from '@/components/ui/SelectionModal';
import { PageBackground } from '@/components/ui/PageBackground';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const {
    language,
    themeMode,
    setLanguageModalVisible,
    setThemeModalVisible,
    isGuest,
    hasEnteredDemoMode,
    logout,
  } = useStore();
  const isRTL = language === 'fa';
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalVisible(false);
    logout();
    router.replace('/auth/welcome');
  };

  const languages: Option[] = [
    { label: 'فارسی', value: 'fa', icon: 'solar:letter-broken' },
    { label: 'English', value: 'en', icon: 'solar:letter-broken' },
  ];

  const themes: Option[] = [
    { label: isRTL ? 'روشن' : 'Light', value: 'light', icon: 'solar:sun-broken' },
    { label: isRTL ? 'تاریک' : 'Dark', value: 'dark', icon: 'solar:moon-broken' },
    { label: isRTL ? 'پیش‌فرض سیستم' : 'System', value: 'system', icon: 'solar:settings-minimalistic-broken' },
  ];

  const SettingItem = ({ icon, label, value, onPress, destructive }: any) => (
    <TouchableOpacity
      style={[styles.item, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.itemLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[
          styles.iconContainer,
          {
            backgroundColor: destructive ? colors.destructive + '15' : colors.surface,
            borderColor: destructive ? colors.destructive + '30' : colors.border,
          }
        ]}>
          <Iconify icon={icon} size={22} color={destructive ? colors.destructive : colors.text} />
        </View>
        <Text style={[styles.label, { color: destructive ? colors.destructive : colors.text, marginHorizontal: 16 }]}>
          {label}
        </Text>
      </View>
      <View style={[styles.itemRight, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {value && <Text style={[styles.value, { color: colors.tint, [isRTL ? 'marginLeft' : 'marginRight']: 8 }]}>{value}</Text>}
        <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={18} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const getThemeLabel = (mode: ThemeMode) => {
    return themes.find(t => t.value === mode)?.label || mode;
  };

  const getLangLabel = (lang: Language) => {
    return languages.find(l => l.value === lang)?.label || lang;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />
      {isGuest && !hasEnteredDemoMode && (
        <GuestRestrictionOverlay
          icon={<Iconify icon="solar:settings-minimalistic-bold" width={42} height={42} color={colors.tint} />}
          title={isRTL ? 'تنظیمات' : 'Settings'}
          description={isRTL ? 'برای دسترسی به تنظیمات و مدیریت حساب خود، لطفاً ابتدا ثبت‌نام کنید.' : 'To access settings and manage your account, please sign up first.'}
        />
      )}
      <View style={[styles.header, { paddingTop: insets.top + 20, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isRTL ? 'تنظیمات' : 'Settings'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'حساب کاربری' : 'Account'}
          </Text>
          <SettingItem
            icon="solar:user-broken"
            label={isRTL ? 'ویرایش پروفایل' : 'Edit Profile'}
            onPress={() => router.push({ pathname: '/profile', params: { autoEdit: 'true' } })}
          />
          <SettingItem
            icon="solar:map-point-broken"
            label={isRTL ? 'نشانی‌ها' : 'Addresses'}
            onPress={() => router.push('/settings/addresses')}
          />
          <SettingItem icon="solar:lock-password-broken" label={isRTL ? 'امنیت' : 'Security'} onPress={() => router.push('/settings/privacy')} />
          <SettingItem icon="solar:bell-broken" label={isRTL ? 'اعلان‌ها' : 'Notifications'} onPress={() => router.push('/settings/notification-settings')} />
          <SettingItem icon="solar:chat-line-broken" label={isRTL ? 'تنظیمات پیام‌ها' : 'Message Settings'} onPress={() => router.push('/settings/message-settings')} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'کسب و کار' : 'Business'}
          </Text>
          <SettingItem icon="solar:shop-2-broken" label={isRTL ? 'فروشگاه من' : 'My Shop'} onPress={() => router.push('/shop/manage')} />
          <SettingItem icon="solar:wallet-money-broken" label={isRTL ? 'امور مالی' : 'Finance'} onPress={() => router.push('/settings/finance')} />
          <SettingItem icon="solar:settings-minimalistic-broken" label={isRTL ? 'تنظیمات فروشگاه' : 'Shop Settings'} onPress={() => router.push('/settings/shop-management')} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'تنظیمات ظاهری' : 'Appearance'}
          </Text>
          <SettingItem
            icon="solar:globus-broken"
            label={isRTL ? 'زبان' : 'Language'}
            value={getLangLabel(language)}
            onPress={() => router.push('/settings/language')}
          />
          <SettingItem
            icon="solar:moon-broken"
            label={isRTL ? 'حالت نمایش' : 'Theme'}
            value={getThemeLabel(themeMode)}
            onPress={() => router.push('/settings/theme')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'پشتیبانی' : 'Support'}
          </Text>
          <SettingItem icon="solar:help-broken" label={isRTL ? 'راهنما' : 'Help Center'} onPress={() => router.push('/settings/help')} />
          <SettingItem icon="solar:info-circle-broken" label={isRTL ? 'درباره کوتیک' : 'About Kutik'} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(500)} style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 12 }]}>
          <SettingItem icon="solar:logout-broken" label={isRTL ? 'خروج' : 'Logout'} destructive onPress={handleLogout} />
        </Animated.View>
      </ScrollView>

      {/* Modern Logout Modal */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={Platform.OS === 'ios' ? 40 : 80}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.warningIconContainer, { backgroundColor: colors.destructive + '15' }]}>
              <Iconify icon="solar:logout-broken" size={32} color={colors.destructive} />
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isRTL ? 'خروج از حساب' : 'Log Out'}
            </Text>

            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              {isRTL
                ? 'آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟'
                : 'Are you sure you want to log out of your account?'}
            </Text>

            <View style={[styles.modalActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border }]}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>
                  {isRTL ? 'انصراف' : 'Cancel'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.logoutBtn, { backgroundColor: colors.destructive }]}
                onPress={confirmLogout}
              >
                <Text style={styles.logoutBtnText}>
                  {isRTL ? 'خروج' : 'Log Out'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 20,
  },
  section: {
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 16,
    paddingHorizontal: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  item: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  itemLeft: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemRight: {
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  warningIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  modalActions: {
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  logoutBtn: {
    flex: 1.5,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
