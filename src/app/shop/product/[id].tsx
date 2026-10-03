import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify';
import { PRODUCTS } from '@/constants/mock-data';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function OwnerProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => colors.tint,
    labelColor: (opacity = 1) => colors.textSecondary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const StatItem = ({ label, value, icon, color }: any) => (
    <View style={[styles.statItem, { backgroundColor: colors.surfaceStrong }]}>
      <Iconify icon={icon} size={20} color={color} />
      <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.surfaceStrong }]}>
          <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{isRTL ? "مدیریت محصول" : "Manage Product"}</Text>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surfaceStrong }]}>
          <Iconify icon="solar:pen-new-square-broken" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Overview */}
        <View style={[styles.productCard, { backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={[styles.productInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
            <Text style={[styles.productPrice, { color: colors.tint }]}>{product.price} تومان</Text>
            <View style={[styles.stockBadge, { backgroundColor: colors.tint + '15' }]}>
              <Text style={[styles.stockText, { color: colors.tint }]}>{isRTL ? "موجودی: ۲۴ عدد" : "Stock: 24 units"}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={[styles.statsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <StatItem
            label={isRTL ? "فروش کل" : "Total Sales"}
            value="۱۵۶"
            icon="solar:bag-heart-broken"
            color="#10b981"
          />
          <StatItem
            label={isRTL ? "بازدید" : "Views"}
            value="۱.۲k"
            icon="solar:info-circle-broken"
            color="#3b82f6"
          />
        </View>

        <View style={styles.divider} />

        {/* Reports Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? "گزارش فروش" : "Sales Report"}
          </Text>
          <LineChart
            data={{
              labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
              datasets: [{ data: [5, 12, 8, 25, 18, 10, 15] }]
            }}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? "وضعیت نظرات" : "Reviews Status"}
          </Text>
          <BarChart
            data={{
              labels: ["1★", "2★", "3★", "4★", "5★"],
              datasets: [{ data: [1, 2, 4, 15, 38] }]
            }}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix=""
            style={styles.chart}
          />
        </View>

        {/* Recent Reviews */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
              {isRTL ? "آخرین نظرات" : "Recent Reviews"}
            </Text>
            <TouchableOpacity>
              <Text style={{ color: colors.tint, fontWeight: '700' }}>{isRTL ? "مشاهده همه" : "View All"}</Text>
            </TouchableOpacity>
          </View>

          {[1, 2].map(i => (
            <View key={i} style={[styles.reviewCard, { backgroundColor: colors.card }]}>
              <View style={[styles.reviewHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Image source={{ uri: `https://i.pravatar.cc/100?u=${i}` }} style={styles.reviewerAvatar} />
                <View style={{ flex: 1, [isRTL ? 'marginRight' : 'marginLeft']: 12, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                  <Text style={[styles.reviewerName, { color: colors.text }]}>{isRTL ? "کاربر تستی" : "Test User"}</Text>
                  <View style={[styles.starsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Iconify key={s} icon="solar:star-broken" size={10} color="#fbbf24" />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={[styles.reviewText, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? "محصول با کیفیتی بود، پیشنهاد می‌کنم." : "Quality product, I recommend it."}
              </Text>
              <TouchableOpacity style={[styles.replyBtn, { backgroundColor: colors.surfaceStrong }]}>
                <Text style={[styles.replyBtnText, { color: colors.tint }]}>{isRTL ? "پاسخ به نظر" : "Reply to Review"}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  productCard: {
    padding: 16,
    borderRadius: 24,
    gap: 16,
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  productName: {
    fontSize: 17,
    fontWeight: '800',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.1)',
    marginVertical: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 16,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    gap: 12,
  },
  reviewHeader: {
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  starsRow: {
    gap: 2,
  },
  reviewText: {
    fontSize: 13,
    lineHeight: 20,
  },
  replyBtn: {
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
