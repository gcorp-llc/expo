import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated as RNAnimated } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function OrdersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const orders = [
    { id: '1001', date: '۱۴۰۲/۱۰/۱۲', status: isRTL ? 'ارسال شده' : 'Shipped', amount: '۴۵۰,۰۰۰ تومان', items: 2 },
    { id: '1002', date: '۱۴۰۲/۱۰/۱۵', status: isRTL ? 'در حال پردازش' : 'Processing', amount: '۱۲۰,۰۰۰ تومان', items: 1 },
    { id: '1003', date: '۱۴۰۲/۱۰/۲۰', status: isRTL ? 'تحویل شده' : 'Delivered', amount: '۸۹۰,۰۰۰ تومان', items: 3 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.surfaceStrong }]}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'سفارشات' : 'Orders'}
          </Text>
          <View style={{ width: 45 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {orders.map((order, index) => (
          <Animated.View
            key={order.id}
            entering={FadeInDown.delay(index * 100)}
            style={[styles.orderCard, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}
          >
            <View style={[styles.orderHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.statusBadge, { backgroundColor: colors.tint + '15' }]}>
                <Text style={[styles.statusText, { color: colors.tint }]}>{order.status}</Text>
              </View>
              <Text style={[styles.orderId, { color: colors.textSecondary }]}>#{order.id}</Text>
            </View>

            <View style={[styles.orderInfo, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
               <View style={styles.infoGroup}>
                 <Text style={[styles.infoLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'تاریخ' : 'Date'}</Text>
                 <Text style={[styles.infoValue, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{order.date}</Text>
               </View>
               <View style={styles.infoGroup}>
                 <Text style={[styles.infoLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'تعداد' : 'Items'}</Text>
                 <Text style={[styles.infoValue, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{order.items}</Text>
               </View>
               <View style={styles.infoGroup}>
                 <Text style={[styles.infoLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'مبلغ کل' : 'Total'}</Text>
                 <Text style={[styles.infoValue, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{order.amount}</Text>
               </View>
            </View>

            <TouchableOpacity style={[styles.detailsBtn, { backgroundColor: colors.tint }]}>
               <Text style={styles.detailsBtnText}>{isRTL ? 'مشاهده جزئیات' : 'View Details'}</Text>
               <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  headerContent: { height: 60, alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  scrollContent: { padding: 20, gap: 16 },
  orderCard: { padding: 20, borderRadius: 28, borderWidth: 1, gap: 16 },
  orderHeader: { justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '800' },
  orderId: { fontSize: 14, fontWeight: '700' },
  orderInfo: { justifyContent: 'space-between' },
  infoGroup: { gap: 4 },
  infoLabel: { fontSize: 12, fontWeight: '600' },
  infoValue: { fontSize: 14, fontWeight: '800' },
  detailsBtn: { height: 50, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  detailsBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
