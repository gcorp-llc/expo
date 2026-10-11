import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import { useModalStore } from '@/hooks/use-modal-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/hooks/use-store';
import { Iconify } from '@/components/ui/Iconify';
import { useRouter } from 'expo-router';

export default function MessageSettingsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const showModal = useModalStore((state) => state.showModal);
  const { language } = useStore();
  const isRTL = language === 'fa';

  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [newMessageAlerts, setNewMessageAlerts] = useState(true);
  const [showPreviews, setShowPreviews] = useState(true);
  const [unreadBadge, setUnreadBadge] = useState(true);

  const SettingRow = ({ label, description, icon, value, onValueChange }: any) => (
    <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.surfaceStrong }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.tint + '15' }]}>
        <Iconify icon={icon} size={22} color={colors.tint} />
      </View>
      <View style={[styles.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {description && <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>}
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
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.floatingHeaderBtn} activeOpacity={0.8}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'تنظیمات پیام‌ها' : 'Message Settings'}
          </Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'اعلان‌ها' : 'Notifications'}
        </Text>

        <SettingRow
          label={isRTL ? 'اعلان‌های درون‌برنامه‌ای' : 'In-App Notifications'}
          description={isRTL ? 'نمایش بنر هنگام دریافت پیام جدید در برنامه' : 'Show banners when new messages arrive'}
          icon="solar:bell-broken"
          value={inAppNotifications}
          onValueChange={setInAppNotifications}
        />

        <SettingRow
          label={isRTL ? 'اعلان پیام جدید' : 'New Message Alerts'}
          description={isRTL ? 'دریافت نوتیفیکیشن برای گفتگوها' : 'Receive push alerts for incoming chats'}
          icon="solar:chat-unread-broken"
          value={newMessageAlerts}
          onValueChange={setNewMessageAlerts}
        />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left', marginTop: 16 }]}>
          {isRTL ? 'رفتار گفتگوها' : 'Chat Behavior'}
        </Text>

        <SettingRow
          label={isRTL ? 'پیش‌نمایش پیام' : 'Message Preview'}
          description={isRTL ? 'نمایش بخشی از متن پیام در اعلان‌ها' : 'Show preview text in notification banner'}
          icon="solar:eye-broken"
          value={showPreviews}
          onValueChange={setShowPreviews}
        />

        <SettingRow
          label={isRTL ? 'نشانگر پیام‌های خوانده‌نشده' : 'Unread Message Badge'}
          description={isRTL ? 'نمایش تعداد پیام‌های جدید در آیکون تب' : 'Show unread counter badge on chat tab'}
          icon="solar:chat-square-check-broken"
          value={unreadBadge}
          onValueChange={setUnreadBadge}
        />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left', marginTop: 16 }]}>
          {isRTL ? 'مدیریت داده و حریم خصوصی' : 'Data & Privacy'}
        </Text>

        <TouchableOpacity
          style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.surfaceStrong }]}
          onPress={() => {
            showModal({
              title: isRTL ? 'پاک‌سازی تاریخچه محلی' : 'Clear Local Cache',
              message: isRTL ? 'آیا از پاک کردن کش محلی گفتگوها اطمینان دارید؟ این عمل قابل بازگشت نیست.' : 'Are you sure you want to clear local chat cache?',
              icon: 'solar:trash-bin-trash-broken',
              iconColor: colors.destructive,
              buttons: [
                { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
                {
                  text: isRTL ? 'پاک‌سازی' : 'Clear',
                  style: 'destructive',
                  onPress: () => {
                    showModal({
                      title: isRTL ? 'پاک‌سازی گردید' : 'Cleared',
                      message: isRTL ? 'کش محلی گفتگوها با موفقیت پاک‌سازی شد.' : 'Local cache cleared.',
                      icon: 'solar:check-circle-bold',
                      buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
                    });
                  }
                },
              ]
            });
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.destructive + '15' }]}>
            <Iconify icon="solar:trash-bin-trash-broken" size={22} color={colors.destructive} />
          </View>
          <View style={[styles.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.label, { color: colors.destructive }]}>
              {isRTL ? 'پاک‌سازی تاریخچه محلی گفتگوها' : 'Clear Local Chat Cache'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
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
  row: { padding: 16, borderRadius: 24, alignItems: 'center', marginBottom: 12, gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 2 },
  label: { fontSize: 15, fontWeight: '700' },
  description: { fontSize: 12 },
});
