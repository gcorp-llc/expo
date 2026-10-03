import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore, PrivacyValue } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
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

  const SettingRow = ({ label, value, onPress, type = 'arrow' }: any) => (
    <TouchableOpacity
      style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.surfaceStrong }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      {type === 'arrow' ? (
        <View style={[styles.right, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.value, { color: colors.tint }]}>{value}</Text>
          <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={18} color={colors.icon} />
        </View>
      ) : (
        <Switch value={value} onValueChange={onPress} trackColor={{ true: colors.tint }} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'حریم خصوصی' : 'Privacy'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'مشاهده‌پذیری' : 'Visibility'}
        </Text>
        <SettingRow
          label={isRTL ? 'شماره موبایل' : 'Phone Number'}
          value={getLabel('phoneNumber')}
          onPress={() => handleOpenModal('phoneNumber')}
        />
        <SettingRow
          label={isRTL ? 'آخرین بازدید' : 'Last Seen'}
          value={getLabel('lastSeen')}
          onPress={() => handleOpenModal('lastSeen')}
        />
        <SettingRow
          label={isRTL ? 'عکس پروفایل' : 'Profile Photo'}
          value={getLabel('profilePhoto')}
          onPress={() => handleOpenModal('profilePhoto')}
        />
        <SettingRow
          label={isRTL ? 'گروه‌ها' : 'Groups'}
          value={getLabel('groups')}
          onPress={() => handleOpenModal('groups')}
        />
        <SettingRow
          label={isRTL ? 'تماس‌ها' : 'Calls'}
          value={getLabel('calls')}
          onPress={() => handleOpenModal('calls')}
        />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left', marginTop: 24 }]}>
          {isRTL ? 'امنیت' : 'Security'}
        </Text>
        <SettingRow label={isRTL ? 'تایید دو مرحله‌ای' : 'Two-Step Verification'} value={isRTL ? 'غیرفعال' : 'Off'} />
        <SettingRow label={isRTL ? 'قفل با اثر انگشت' : 'Fingerprint Lock'} value={false} type="switch" />
      </ScrollView>

      <SelectionModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={privacyOptions}
        selectedValue={activeKey ? privacy[activeKey] : undefined}
        onSelect={handleSelect}
        title={isRTL ? 'انتخاب دسترسی' : 'Select Access'}
        isRTL={isRTL}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
  headerContent: { height: 60, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { paddingHorizontal: 16, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 15, fontWeight: '600' },
  right: { alignItems: 'center', gap: 8 },
  value: { fontSize: 14, fontWeight: '700' },
});
