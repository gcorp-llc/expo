import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify';
import { useRouter } from 'expo-router';

import { PRODUCTS } from '@/constants/mock-data';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type TabType = 'products' | 'stats' | 'finance' | 'messages';

export default function MyShopManageScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, shop } = useStore();
  const isRTL = language === 'fa';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('products');

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => colors.tint,
    labelColor: (opacity = 1) => colors.textSecondary,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: colors.tint
      }
  };

  const TabButton = ({ type, label, icon }: { type: TabType, label: string, icon: string }) => {
    const isActive = activeTab === type;
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
      <TouchableOpacity
        onPress={() => setActiveTab(type)}
        onPressIn={() => scale.value = withSpring(0.92)}
        onPressOut={() => scale.value = withSpring(1)}
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        <Animated.View
            style={[
                styles.tabButton,
                {
                    backgroundColor: isActive ? colors.tint : colors.card,
                    borderColor: colors.border
                },
                animatedStyle
            ]}
        >
            <Iconify icon={icon} size={22} color={isActive ? '#fff' : colors.textSecondary} />
            <Text style={[styles.tabLabel, { color: isActive ? '#fff' : colors.textSecondary }]}>{label}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const ProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/shop/product/${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={[styles.productMain, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Image source={{ uri: item.image }} style={styles.productImage} transition={300} />
        <View style={[styles.productInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.productSummary, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={[styles.productPrice, { color: colors.tint }]}>{item.price} تومان</Text>
        </View>
      </View>
      <View style={[styles.productFooter, { borderTopColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.footerStat}>
          <Iconify icon="solar:info-circle-broken" size={14} color={colors.textSecondary} />
          <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>۱۲۴</Text>
        </View>
        <View style={styles.footerStat}>
          <Iconify icon="solar:bag-heart-broken" size={14} color={colors.textSecondary} />
          <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>۴۵</Text>
        </View>
        <View style={styles.footerStat}>
          <Iconify icon="solar:chat-line-broken" size={14} color={colors.textSecondary} />
          <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>۱۲</Text>
        </View>
        <View style={styles.footerStat}>
          <Iconify icon="solar:star-bold" size={12} color="#fbbf24" />
          <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>۴.۸</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, paddingBottom: 12, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{isRTL ? "فروشگاه من" : "My Shop"}</Text>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/settings/shop-management')}
        >
          <Iconify icon="solar:settings-broken" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Shop Stats Overview */}
        <Animated.View entering={FadeInDown.duration(600)} style={[styles.overviewRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.overviewCard, { backgroundColor: colors.tint, shadowColor: colors.tint }]}>
                <Iconify icon="solar:wallet-money-bold" size={24} color="#fff" />
                <Text style={styles.overviewLabel}>{isRTL ? "موجودی" : "Balance"}</Text>
                <Text style={styles.overviewValue}>۴۵,۰۰۰,۰۰۰</Text>
            </View>
            <View style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Iconify icon="solar:graph-up-broken" size={24} color={colors.tint} />
                <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>{isRTL ? "فروش ماه" : "Monthly Sales"}</Text>
                <Text style={[styles.overviewValue, { color: colors.text }]}>۱۲۴</Text>
            </View>
        </Animated.View>

        {/* Profile Card Refined */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image
            source={{ uri: 'https://picsum.photos/800/400?grayscale&blur=2' }}
            style={styles.coverImage}
          />
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?u=kutik-shop' }}
              style={[styles.avatar, { borderColor: colors.card }]}
            />
          </View>
          <View style={styles.shopInfo}>
            <Text style={[styles.name, { color: colors.text }]}>{shop.name || (isRTL ? "فروشگاه کوتیک" : "KuTik Shop")}</Text>
            <Text style={[styles.specialty, { color: colors.tint }]}>{isRTL ? "مرکز تخصصی گجت‌های هوشمند" : "Smart Gadgets Center"}</Text>
            <View style={[styles.actionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push('/settings/shop-management')}
                >
                    <Text style={styles.primaryButtonText}>{isRTL ? "تنظیمات فروشگاه" : "Shop Settings"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Iconify icon="solar:share-broken" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Tab Selector - Professional Look */}
        <View style={[styles.tabsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TabButton type="products" label={isRTL ? "محصولات" : "Products"} icon="solar:box-broken" />
          <TabButton type="stats" label={isRTL ? "آمار" : "Stats"} icon="solar:graph-up-broken" />
          <TabButton type="finance" label={isRTL ? "فروش" : "Finance"} icon="solar:wallet-money-broken" />
          <TabButton type="messages" label={isRTL ? "پیام" : "Messages"} icon="solar:chat-line-broken" />
        </View>

        {/* Tab Content */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.tabContent}>
          {activeTab === 'products' && (
            <View style={styles.productsList}>
              {PRODUCTS.map((product, index) => (
                <Animated.View key={product.id} entering={FadeInDown.delay(index * 100)}>
                    <ProductCard item={product} />
                </Animated.View>
              ))}
            </View>
          )}

          {activeTab === 'stats' && (
            <View style={styles.statsContent}>
              <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                    {isRTL ? "روند فروش هفتگی" : "Weekly Sales Trend"}
                </Text>
                <LineChart
                    data={{
                    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
                    datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }]
                    }}
                    width={width - 72}
                    height={200}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
              </View>

              <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 20 }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                    {isRTL ? "توزیع رضایت" : "Rating Distribution"}
                </Text>
                <BarChart
                    data={{
                    labels: ["1★", "2★", "3★", "4★", "5★"],
                    datasets: [{ data: [2, 5, 10, 30, 53] }]
                    }}
                    width={width - 72}
                    height={200}
                    chartConfig={chartConfig}
                    yAxisLabel=""
                    yAxisSuffix=""
                    style={styles.chart}
                />
              </View>
            </View>
          )}

          {activeTab === 'finance' && (
            <View style={styles.financeList}>
              {[1, 2, 3, 4, 5].map((i, idx) => (
                <Animated.View key={i} entering={FadeInDown.delay(idx * 100)} style={[styles.financeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.financeHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.financeProduct, { color: colors.text }]}>{isRTL ? "محصول شماره " + i : "Product #" + i}</Text>
                    <Text style={[styles.financeAmount, { color: colors.tint }]}>۱,۲۰۰,۰۰۰ تومان</Text>
                  </View>
                  <View style={[styles.financeBuyer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={styles.buyerAvatarPlaceholder}><Text style={styles.avatarInitial}>A</Text></View>
                    <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                        <Text style={[styles.buyerName, { color: colors.text }]}>{isRTL ? "علی رضایی" : "Ali Rezai"}</Text>
                        <Text style={[styles.financeDate, { color: colors.textSecondary }]}>{isRTL ? "۲ ساعت پیش" : "2 hours ago"}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: colors.success + '15' }]}>
                        <Text style={[styles.statusText, { color: colors.success }]}>{isRTL ? "تکمیل شده" : "Completed"}</Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}

          {activeTab === 'messages' && (
            <View style={styles.messagesList}>
              {PRODUCTS.slice(0, 3).map((product, idx) => (
                <Animated.View key={product.id} entering={FadeInDown.delay(idx * 100)} style={[styles.messageCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                   <View style={[styles.messageHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Image source={{ uri: product.image }} style={styles.msgProductThumb} />
                    <View style={[styles.msgInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Text style={[styles.msgProductName, { color: colors.text }]}>{product.name}</Text>
                        <Text style={{ fontSize: 10, color: colors.textSecondary }}>12:30</Text>
                      </View>
                      <Text style={[styles.msgText, { color: colors.textSecondary }]} numberOfLines={2}>
                        {isRTL ? "سلام، آیا این محصول گارانتی دارد؟ من قصد خرید دارم..." : "Hi, does this product have a warranty? I'm interested..."}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.replyButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.replyButtonText, { color: colors.tint }]}>{isRTL ? "ارسال پاسخ" : "Send Reply"}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
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
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  overviewRow: {
    gap: 12,
    marginBottom: 20,
  },
  overviewCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  profileCard: {
    borderRadius: 32,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 100,
  },
  avatarWrapper: {
    marginTop: -40,
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
  },
  shopInfo: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionRow: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tabsContainer: {
    gap: 8,
    marginBottom: 20,
  },
  tabButton: {
    height: 75,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  tabContent: {
    minHeight: 300,
  },
  productsList: {
    gap: 16,
  },
  productCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  productMain: {
    padding: 14,
    gap: 14,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 18,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '800',
  },
  productSummary: {
    fontSize: 13,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
  },
  productFooter: {
    padding: 12,
    borderTopWidth: 1,
    justifyContent: 'space-around',
  },
  footerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerStatText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  chart: {
    borderRadius: 16,
    marginRight: -10,
  },
  statsContent: {
    paddingBottom: 20,
  },
  financeList: {
    gap: 12,
  },
  financeCard: {
    padding: 16,
    borderRadius: 24,
    gap: 12,
    borderWidth: 1,
  },
  financeHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeProduct: {
    fontSize: 15,
    fontWeight: '800',
  },
  financeAmount: {
    fontSize: 15,
    fontWeight: '900',
  },
  financeBuyer: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  buyerAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  buyerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  financeDate: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  messagesList: {
    gap: 12,
  },
  messageCard: {
    padding: 16,
    borderRadius: 24,
    gap: 14,
    borderWidth: 1,
  },
  messageHeader: {
    gap: 12,
    alignItems: 'flex-start',
  },
  msgProductThumb: {
    width: 54,
    height: 54,
    borderRadius: 12,
  },
  msgInfo: {
    flex: 1,
    gap: 2,
  },
  msgProductName: {
    fontSize: 14,
    fontWeight: '800',
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  replyButton: {
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  replyButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
