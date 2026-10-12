import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore, PrivacyValue } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import { SelectionModal, Option } from '@/components/ui/SelectionModal';

export default function PrivacyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, privacy, setPrivacy } = useStore();
  const isRTL = language === 'fa';

  const [modalVisible, setModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState<keyof typeof privacy | null>(null);
  const [showWorkHistory, setShowWorkHistory] = useState(true);
  const [fingerprintLock, setFingerprintLock] = useState(false);

  const privacyOptions: Option[] = [
    { label: isRTL ? 'همه' : 'Everyone', value: 'everyone', icon: 'solar:globus-broken' },
    { label: isRTL ? 'دوستان من' : 'My Friends', value: 'friends', icon: 'solar:user-broken' },
    { label: isRTL ? 'هیچ‌کس' : 'Nobody', value: 'nobody', icon: 'solar:lock-password-broken' },
  ];

  const getLabel = (key: keyof typeof privacy) => {
    const value = privacy[key];
    const option = privacyOptions.find(o => o.value === value);
    return option ? option.label : value;
  };

  const handleOpenModal = (key: keyof typeof privacy) => {
    setActiveKey(key);
    setModalVisible(true);
  };

  const handleSelect = (value: string) => {
    if (activeKey) {
      setPrivacy(activeKey, value as PrivacyValue);
    }
  };

  const SettingRow = ({ label, description, icon, value, onPress, type = 'arrow' }: any) => (
    <TouchableOpacity
      style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.surfaceStrong }]}
      onPress={type === 'arrow' ? onPress : undefined}
      activeOpacity={type === 'arrow' ? 0.7 : 1}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.tint + '15' }]}>
        <Iconify icon={icon} size={22} color={colors.tint} />
      </View>
      <View style={[styles.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {description && <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>}
      </View>
      {type === 'arrow' ? (
        <View style={[styles.right, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.value, { color: colors.tint }]}>{value}</Text>
          <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={18} color={colors.icon} />
        </View>
      ) : (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ true: colors.tint, false: 'rgba(128,128,128,0.2)' }}
          thumbColor={Platform.OS === 'ios' ? undefined : (value ? colors.tint : '#f4f3f4')}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <FloatingIconButton
            icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
            onPress={() => router.back()}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'حریم خصوصی' : 'Privacy'}
          </Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'مشاهده‌پذیری پروفایل' : 'Profile Visibility'}
        </Text>

        <SettingRow
          label={isRTL ? 'شماره موبایل' : 'Phone Number'}
          description={isRTL ? 'چه کسانی می‌توانند شماره شما را ببینند' : 'Who can see your phone number'}
          icon="solar:smartphone-broken"
          value={getLabel('phoneNumber')}
          onPress={() => handleOpenModal('phoneNumber')}
        />

        <SettingRow
          label={isRTL ? 'آخرین بازدید' : 'Last Seen'}
          description={isRTL ? 'نمایش زمان آخرین آنلاین بودن' : 'Display last active time'}
          icon="solar:clock-circle-broken"
          value={getLabel('lastSeen')}
          onPress={() => handleOpenModal('lastSeen')}
        />

        <SettingRow
          label={isRTL ? 'عکس پروفایل' : 'Profile Photo'}
          description={isRTL ? 'مشاهده‌پذیری تصویر حساب کاربری' : 'Profile avatar visibility'}
          icon="solar:user-circle-bold"
          value={getLabel('profilePhoto')}
          onPress={() => handleOpenModal('profilePhoto')}
        />

        {/* Item 10: Show Work History / نمایش سابقه کاری */}
        <SettingRow
          label={isRTL ? 'نمایش سابقه کاری' : 'Show Work History'}
          description={isRTL ? 'نمایش سابقه فعالیت شغلی و فروشگاهی در پروفایل عمومی' : 'Show career history on public profile'}
          icon="solar:case-round-broken"
          value={showWorkHistory}
          type="switch"
          onPress={setShowWorkHistory}
        />

        <SettingRow
          label={isRTL ? 'افزودن به گروه‌ها' : 'Groups'}
          description={isRTL ? 'چه کسانی می‌توانند شما را به گروه دعوت کنند' : 'Who can add you to groups'}
          icon="solar:users-group-rounded-bold"
          value={getLabel('groups')}
          onPress={() => handleOpenModal('groups')}
        />

        <SettingRow
          label={isRTL ? 'تماس‌ها' : 'Calls'}
          description={isRTL ? 'چه کسانی می‌توانند با شما تماس برقرار کنند' : 'Who can call you'}
          icon="solar:phone-calling-broken"
          value={getLabel('calls')}
          onPress={() => handleOpenModal('calls')}
        />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left', marginTop: 16 }]}>
          {isRTL ? 'امنیت حساب' : 'Account Security'}
        </Text>

        <SettingRow
          label={isRTL ? 'تایید دو مرحله‌ای' : 'Two-Step Verification'}
          description={isRTL ? 'محافظت از حساب با رمز عبور اضافی' : 'Protect account with extra password'}
          icon="solar:shield-check-broken"
          value={isRTL ? 'غیرفعال' : 'Off'}
        />

        <SettingRow
          label={isRTL ? 'قفل با اثر انگشت / چهره' : 'Biometric Lock'}
          description={isRTL ? 'ورود به برنامه با اثر انگشت یا شناسایی چهره' : 'Unlock app using fingerprint or face ID'}
          icon="solar:lock-password-broken"
          value={fingerprintLock}
          type="switch"
          onPress={setFingerprintLock}
        />
      </ScrollView>

      <SelectionModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={privacyOptions}
        selectedValue={activeKey ? privacy[activeKey] : undefined}
        onSelect={handleSelect}
        title={isRTL ? 'انتخاب دسترسی حریم خصوصی' : 'Select Access Level'}
        isRTL={isRTL}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: 'transparent', paddingHorizontal: 16 },
  headerContent: { height: 52, alignItems: 'center', justifyContent: 'space-between' },
  floatingHeaderBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { padding: 16, borderRadius: 24, alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 2 },
  label: { fontSize: 15, fontWeight: '700' },
  description: { fontSize: 12 },
  right: { alignItems: 'center', gap: 6 },
  value: { fontSize: 14, fontWeight: '700' },
});
