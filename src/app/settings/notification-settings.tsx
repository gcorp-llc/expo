import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, notifications, setNotification } = useStore();
  const isRTL = language === 'fa';

  const SettingRow = ({ label, description, icon, value, onValueChange }: any) => (
    <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.surfaceStrong }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.tint + '15' }]}>
        <Iconify icon={icon} size={22} color={colors.tint} />
      </View>
      <View style={[styles.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.tint, false: 'rgba(128,128,128,0.2)' }}
        thumbColor={Platform.OS === 'ios' ? undefined : (value ? colors.tint : '#f4f3f4')}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'تنظیمات اعلان‌ها' : 'Notification Settings'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'اعلان‌های برنامه' : 'App Notifications'}
        </Text>

        <SettingRow
          label={isRTL ? 'سفارشات جدید' : 'New Orders'}
          description={isRTL ? 'اطلاع‌رسانی هنگام ثبت سفارش جدید' : 'Notify when a new order is placed'}
          icon="solar:bag-heart-broken"
          value={notifications.orders}
          onValueChange={(val: boolean) => setNotification('orders', val)}
        />

        <SettingRow
          label={isRTL ? 'پیام‌های چت' : 'Chat Messages'}
          description={isRTL ? 'اطلاع‌رسانی پیام‌های دریافتی از کاربران' : 'Notify when you receive a message'}
          icon="solar:chat-line-broken"
          value={notifications.chat}
          onValueChange={(val: boolean) => setNotification('chat', val)}
        />

        <SettingRow
          label={isRTL ? 'تخفیف‌ها و جشنواره‌ها' : 'Discounts & Promos'}
          description={isRTL ? 'اطلاع از جشنواره‌های فروش و کدهای تخفیف' : 'Get notified about sales and coupons'}
          icon="solar:fire-broken"
          value={notifications.discounts}
          onValueChange={(val: boolean) => setNotification('discounts', val)}
        />

        <SettingRow
          label={isRTL ? 'به‌روزرسانی‌های سیستم' : 'System Updates'}
          description={isRTL ? 'اطلاع از نسخه‌های جدید و تغییرات فنی' : 'Notify about new versions and changes'}
          icon="solar:refresh-broken"
          value={notifications.system}
          onValueChange={(val: boolean) => setNotification('system', val)}
        />
      </ScrollView>
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
  row: { padding: 16, borderRadius: 24, alignItems: 'center', marginBottom: 12, gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 2 },
  label: { fontSize: 15, fontWeight: '700' },
  description: { fontSize: 12 },
});
