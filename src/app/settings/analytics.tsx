import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';
import { PRODUCTS } from '@/constants/mock-data';
import { PageBackground } from '@/components/ui/PageBackground';
import { SelectionModal } from '@/components/ui/SelectionModal';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
const StatBoxMemo = React.memo(({ label, value, trend, icon, color, index, isRTL, colors }: any) => (
  <Animated.View
    entering={FadeInDown.delay(100 * index).duration(500)}
    style={[styles.statBox, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}
  >
    <View style={[styles.statHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Iconify icon={icon} size={20} color={color} />
      </View>
      <View style={[styles.trendBadge, { backgroundColor: trend.startsWith('+') ? '#10b98120' : '#ef444420' }]}>
        <Text style={[styles.trendText, { color: trend.startsWith('+') ? '#10b981' : '#ef4444' }]}>{trend}</Text>
      </View>
    </View>
    <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
  </Animated.View>
));
StatBoxMemo.displayName = 'StatBoxMemo';

export default function AnalyticsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const [activeRange, setActiveRange] = useState('7d');
  const [isRangeModalVisible, setIsRangeModalVisible] = useState(false);

  const ranges = [
    { value: '24h', label: isRTL ? '۲۴ ساعت گذشته' : 'Last 24 Hours' },
    { value: '7d', label: isRTL ? '۷ روز گذشته' : 'Last 7 Days' },
    { value: '30d', label: isRTL ? '۳۰ روز گذشته' : 'Last 30 Days' },
    { value: '90d', label: isRTL ? '۳ ماه گذشته' : 'Last 3 months' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {/* Floating Header */}
      <View style={[styles.floatingHeader, { top: insets.top + 10, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <FloatingIconButton
          icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
          onPress={() => router.back()}
        />

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isRTL ? 'آمار فروشگاه' : 'Shop Analytics'}
        </Text>

        <FloatingIconButton
          icon="solar:calendar-minimalistic-broken"
          onPress={() => setIsRangeModalVisible(true)}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <StatBoxMemo
            index={0}
            label={isRTL ? 'بازدید کل' : 'Total Views'}
            value="12.5k"
            trend="+12%"
            icon="solar:eye-broken"
            color="#3b82f6"
            isRTL={isRTL}
            colors={colors}
          />
          <StatBoxMemo
            index={1}
            label={isRTL ? 'فروش کل' : 'Total Sales'}
            value="854"
            trend="+5%"
            icon="solar:cart-large-broken"
            color="#10b981"
            isRTL={isRTL}
            colors={colors}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'محصولات پرفروش' : 'Top Products'}
        </Text>

        {PRODUCTS.slice(0, 4).map((product, index) => (
          <Animated.View
            key={product.id}
            entering={FadeInUp.delay(300 + index * 100)}
          >
            <TouchableOpacity
              style={[styles.productStatCard, { backgroundColor: colors.surfaceStrong, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => router.push(`/product/${product.id}`)}
            >
              <Image source={{ uri: product.image }} style={styles.productThumb} />
              <View style={[styles.productInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>{product.name}</Text>
                <View style={[styles.productStatRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Iconify icon="solar:graph-up-broken" size={14} color="#10b981" />
                  <Text style={[styles.productStatValue, { color: '#10b981' }]}>120</Text>
                  <Text style={[styles.productStatLabel, { color: colors.textSecondary }]}>{isRTL ? 'فروش' : 'Sales'}</Text>
                </View>
              </View>
              <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <SelectionModal
        isVisible={isRangeModalVisible}
        onClose={() => setIsRangeModalVisible(false)}
        title={isRTL ? 'بازه زمانی' : 'Time Range'}
        options={ranges}
        selectedValue={activeRange}
        onSelect={(val) => setActiveRange(val)}
        isRTL={isRTL}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingHeader: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  statsGrid: { gap: 16, marginBottom: 32 },
  statBox: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  statHeader: { justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  trendBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  trendText: { fontSize: 11, fontWeight: '800' },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 20 },
  productStatCard: { padding: 12, borderRadius: 20, alignItems: 'center', marginBottom: 12, borderWidth: 1 },
  productThumb: { width: 50, height: 50, borderRadius: 12 },
  productInfo: { flex: 1, marginHorizontal: 16 },
  productName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  productStatRow: { alignItems: 'center', gap: 6 },
  productStatValue: { fontSize: 13, fontWeight: '800' },
  productStatLabel: { fontSize: 12 },
});
