import React from 'react';
import { PageBackground } from '@/components/ui/PageBackground';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';

const NOTIFICATIONS = [
  { id: '1', title: 'سفارش جدید', body: 'شما یک سفارش جدید برای محصول "آیفون ۱۵" دارید.', time: '۱۰ دقیقه پیش', type: 'order', icon: 'solar:bag-heart-broken' },
  { id: '2', title: 'تخفیف ویژه', body: 'جشنواره تخفیف‌های پاییزی کوتیک شروع شد!', time: '۲ ساعت پیش', type: 'promo', icon: 'solar:fire-broken' },
  { id: '3', title: 'پیام جدید', body: 'علی احمدی برای شما پیام فرستاد.', time: '۵ ساعت پیش', type: 'chat', icon: 'solar:chat-line-broken' },
  { id: '4', title: 'به‌روزرسانی', body: 'نسخه جدید اپلیکیشن کوتیک منتشر شد.', time: 'دیروز', type: 'system', icon: 'solar:refresh-broken' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surfaceStrong, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.tint + '20' }]}>
        <Iconify icon={item.icon} size={24} color={colors.tint} />
      </View>
      <View style={[styles.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
        </View>
        <Text style={[styles.body, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>{item.body}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'اعلان‌ها' : 'Notifications'}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/settings/notification-settings')}
          >
            <Iconify icon="solar:settings-broken" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  listContent: { padding: 16, gap: 12 },
  card: { padding: 16, borderRadius: 14, gap: 12, alignItems: 'center', borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 4 },
  row: { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  title: { fontSize: 15, fontWeight: '700' },
  time: { fontSize: 11 },
  body: { fontSize: 13, lineHeight: 18 },
});
