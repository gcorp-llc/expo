import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/hooks/use-store';
import { Iconify } from '@/components/ui/Iconify';
import { useRouter } from 'expo-router';
import { PageBackground } from '@/components/ui/PageBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function MessageSettingsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [newMessageAlerts, setNewMessageAlerts] = useState(true);
  const [showPreviews, setShowPreviews] = useState(true);
  const [unreadBadge, setUnreadBadge] = useState(true);

  const SettingSwitchItem = ({ icon, title, description, value, onValueChange }: any) => (
    <View style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Iconify icon={icon} size={22} color={colors.text} />
      </View>
      <View style={[styles.textContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.titleText, { color: colors.text }]}>{title}</Text>
        {description && <Text style={[styles.descText, { color: colors.textSecondary }]}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.tint }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      <View style={[styles.header, { paddingTop: insets.top + 16, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Iconify
            icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isRTL ? 'تنظیمات پیام‌ها' : 'Message Settings'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeader, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'اعلان‌ها' : 'Notifications'}
          </Text>
          <SettingSwitchItem
            icon="solar:bell-broken"
            title={isRTL ? 'اعلان‌های درون‌برنامه‌ای' : 'In-App Notifications'}
            description={isRTL ? 'نمایش بنر هنگام دریافت پیام جدید در برنامه' : 'Show banners when new messages arrive'}
            value={inAppNotifications}
            onValueChange={setInAppNotifications}
          />
          <SettingSwitchItem
            icon="solar:chat-round-line-bold"
            title={isRTL ? 'اعلان پیام جدید' : 'New Message Alerts'}
            description={isRTL ? 'دریافت نوتیفیکیشن برای گفتگوها' : 'Receive push alerts for incoming chats'}
            value={newMessageAlerts}
            onValueChange={setNewMessageAlerts}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeader, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'رفتار گفتگوها' : 'Chat Behavior'}
          </Text>
          <SettingSwitchItem
            icon="solar:eye-broken"
            title={isRTL ? 'پیش‌نمایش پیام' : 'Message Preview'}
            description={isRTL ? 'نمایش بخشی از متن پیام در اعلان‌ها' : 'Show preview text in notification banner'}
            value={showPreviews}
            onValueChange={setShowPreviews}
          />
          <SettingSwitchItem
            icon="solar:chat-square-bold"
            title={isRTL ? 'نشانگر پیام‌های خوانده‌نشده' : 'Unread Message Badge'}
            description={isRTL ? 'نمایش تعداد پیام‌های جدید در آیکون تب' : 'Show unread counter badge on chat tab'}
            value={unreadBadge}
            onValueChange={setUnreadBadge}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeader, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'مدیریت داده و حریم خصوصی' : 'Data & Privacy'}
          </Text>

          <TouchableOpacity
            style={[styles.actionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            onPress={() => {
              Alert.alert(
                isRTL ? 'پاک‌سازی تاریخچه محلی' : 'Clear Local Cache',
                isRTL ? 'آیا از پاک کردن کش محلی گفتگوها اطمینان دارید؟' : 'Are you sure you want to clear local chat cache?',
                [
                  { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
                  { text: isRTL ? 'پاک‌سازی' : 'Clear', style: 'destructive', onPress: () => {} },
                ]
              );
            }}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.destructive + '15', borderColor: colors.destructive + '30' }]}>
              <Iconify icon="solar:trash-bin-trash-broken" size={22} color={colors.destructive} />
            </View>
            <View style={[styles.textContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.titleText, { color: colors.destructive }]}>
                {isRTL ? 'پاک‌سازی تاریخچه محلی گفتگوها' : 'Clear Local Chat Cache'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    gap: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  settingRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionRow: {
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  descText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
