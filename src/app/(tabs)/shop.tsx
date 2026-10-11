import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useModalStore } from '@/hooks/use-modal-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify';
import { useRouter } from 'expo-router';
import { PRODUCTS } from '@/constants/mock-data';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PageBackground } from '@/components/ui/PageBackground';

const { width } = Dimensions.get('window');

type TabType = 'products' | 'stats' | 'finance' | 'messages';

interface StoreOption {
  id: string;
  name: string;
  specialty: string;
  role: string;
  avatar: string;
  cover: string;
  balance: string;
  monthlySales: string;
}

const DEMO_STORES: StoreOption[] = [
  {
    id: 'store-1',
    name: 'فروشگاه تخصصی کوتیک',
    specialty: 'مرکز تخصصی گجت‌های هوشمند و لوازم جانبی',
    role: 'مدیر کل و مالک',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80',
    balance: '۴۵,۰۰۰,۰۰۰ تومان',
    monthlySales: '۱۲۴ عدد',
  },
  {
    id: 'store-2',
    name: 'گالری پوشاک آریا',
    specialty: 'پوشاک مدرن و اکسسوری سبک زندگی',
    role: 'مدیر فروش ارشد',
    avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80',
    cover: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000&q=80',
    balance: '۲۸,۵۰۰,۰۰۰ تومان',
    monthlySales: '۸۹ عدد',
  },
  {
    id: 'store-3',
    name: 'دیجیتال پلاس پارس',
    specialty: 'تجهیزات گیمینگ و لپ‌تاپ‌های حرفه‌ای',
    role: 'کارمند پشتیبانی و فروش',
    avatar: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&q=80',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&q=80',
    balance: '۱۸,۲۰۰,۰۰۰ تومان',
    monthlySales: '۵۶ عدد',
  },
];

export default function TabShopScreen() {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const showModal = useModalStore((state) => state.showModal);
  const isRTL = language === 'fa';
  const router = useRouter();

  const [activeStoreId, setActiveStoreId] = useState<string>('store-1');
  const [stores, setStores] = useState<StoreOption[]>(DEMO_STORES);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isStorePickerVisible, setIsStorePickerVisible] = useState(false);
  const [isAddStoreVisible, setIsAddStoreVisible] = useState(false);

  // New store form
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreSpecialty, setNewStoreSpecialty] = useState('');
  const [newStoreRole, setNewStoreRole] = useState('مالک فروشگاه');

  const currentStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  const handleCreateStore = () => {
    if (!newStoreName.trim()) {
      showModal({
        title: isRTL ? 'خطای ورودی' : 'Form Error',
        message: isRTL ? 'لطفاً نام فروشگاه جدید را وارد کنید.' : 'Please enter store name.',
        icon: 'solar:danger-circle-bold',
        iconColor: colors.destructive,
        buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
      });
      return;
    }

    const created: StoreOption = {
      id: `store-${Date.now()}`,
      name: newStoreName.trim(),
      specialty: newStoreSpecialty.trim() || (isRTL ? 'فروشگاه اینترنتی آنلاین' : 'Online Retail Store'),
      role: newStoreRole,
      avatar: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&q=80',
      cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80',
      balance: '۰ تومان',
      monthlySales: '۰ عدد',
    };

    setStores((prev) => [created, ...prev]);
    setActiveStoreId(created.id);
    setIsAddStoreVisible(false);
    setNewStoreName('');
    setNewStoreSpecialty('');

    showModal({
      title: isRTL ? 'فروشگاه جدید ثبت شد 🎉' : 'New Store Created 🎉',
      message: isRTL ? `فروشگاه «${created.name}» با موفقیت ایجاد شد و آماده مدیریت است.` : `Store "${created.name}" created successfully.`,
      icon: 'solar:shop-2-bold',
      iconColor: colors.tint,
      buttons: [{ text: isRTL ? 'مدیریت فروشگاه' : 'Manage Store', style: 'primary' }]
    });
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: () => colors.tint,
    labelColor: () => colors.textSecondary,
    strokeWidth: 2,
    barPercentage: 0.6,
    decimalPlaces: 0,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.tint,
    },
  };

  const TabButton = ({ type, label, icon }: { type: TabType; label: string; icon: string }) => {
    const isActive = activeTab === type;
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <TouchableOpacity
        onPress={() => setActiveTab(type)}
        onPressIn={() => (scale.value = withSpring(0.92))}
        onPressOut={() => (scale.value = withSpring(1))}
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            styles.tabButton,
            {
              backgroundColor: isActive ? colors.tint : colors.card,
              borderColor: colors.border,
            },
            animatedStyle,
          ]}
        >
          <Iconify icon={icon} size={22} color={isActive ? '#fff' : colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: isActive ? '#fff' : colors.textSecondary }]}>{label}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {/* Floating Transparent Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          onPress={() => setIsStorePickerVisible(true)}
          style={[styles.floatingHeaderBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, width: undefined, paddingHorizontal: 12 }]}
          activeOpacity={0.8}
        >
          <Iconify icon="solar:shop-2-broken" size={22} color={colors.tint} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>{isRTL ? 'فروشگاه من' : 'My Store'}</Text>
          <Iconify icon="solar:alt-arrow-down-broken" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
          <TouchableOpacity
            style={styles.floatingHeaderIconBtn}
            onPress={() => setIsAddStoreVisible(true)}
            activeOpacity={0.8}
          >
            <Iconify icon="solar:add-circle-broken" size={22} color={colors.tint} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.floatingHeaderIconBtn}
            onPress={() => router.push('/settings/shop-management')}
            activeOpacity={0.8}
          >
            <Iconify icon="solar:settings-broken" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}>
        
        {/* 1. STORE NAME CARD (PLACED AT TOP AS REQUESTED) */}
        <Animated.View entering={FadeInDown.duration(500)} style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image source={{ uri: currentStore.cover }} style={styles.coverImage} contentFit="cover" />

          <View style={styles.avatarWrapper}>
            <Image source={{ uri: currentStore.avatar }} style={[styles.avatar, { borderColor: colors.card }]} contentFit="cover" />
          </View>

          <View style={styles.shopInfo}>
            {/* Store Name */}
            <Text style={[styles.name, { color: colors.text }]}>{currentStore.name}</Text>

            {/* Role Badge in Store */}
            <View style={[styles.roleBadge, { backgroundColor: colors.tint + '18', borderColor: colors.tint + '40' }]}>
              <Iconify icon="solar:verified-check-bold" size={14} color={colors.tint} />
              <Text style={[styles.roleBadgeText, { color: colors.tint }]}>
                {isRTL ? `سمت من: ${currentStore.role}` : `My Role: ${currentStore.role}`}
              </Text>
            </View>

            {/* Specialty */}
            <Text style={[styles.specialty, { color: colors.textSecondary }]}>{currentStore.specialty}</Text>

            {/* Quick Action Buttons */}
            <View style={[styles.actionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push('/settings/shop-management')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>{isRTL ? 'مدیریت و تنظیمات فروشگاه' : 'Manage Store'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setIsStorePickerVisible(true)}
                activeOpacity={0.85}
              >
                <Iconify icon="solar:refresh-broken" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* 2. INVENTORY & MONTHLY SALES CARDS (PLACED UNDERNEATH STORE NAME CARD AS REQUESTED) */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={[styles.overviewRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.overviewCard, { backgroundColor: colors.tint, shadowColor: colors.tint }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Iconify icon="solar:wallet-money-bold" size={24} color="#fff" />
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '800' }}>{isRTL ? 'بروز' : 'Live'}</Text>
            </View>
            <Text style={styles.overviewLabel}>{isRTL ? 'موجودی انبار و کیف‌پول' : 'Inventory & Balance'}</Text>
            <Text style={styles.overviewValue}>{currentStore.balance}</Text>
          </View>

          <View style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Iconify icon="solar:graph-up-broken" size={24} color={colors.tint} />
              <Text style={{ fontSize: 10, color: colors.tint, fontWeight: '800' }}>+۱۲٪</Text>
            </View>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>{isRTL ? 'فروش این ماه' : 'Monthly Sales'}</Text>
            <Text style={[styles.overviewValue, { color: colors.text }]}>{currentStore.monthlySales}</Text>
          </View>
        </Animated.View>

        {/* Tab Selector */}
        <View style={[styles.tabsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TabButton type="products" label={isRTL ? 'محصولات' : 'Products'} icon="solar:box-broken" />
          <TabButton type="stats" label={isRTL ? 'آمار' : 'Stats'} icon="solar:graph-up-broken" />
          <TabButton type="finance" label={isRTL ? 'فروش' : 'Finance'} icon="solar:wallet-money-broken" />
          <TabButton type="messages" label={isRTL ? 'درخواست‌ها' : 'Requests'} icon="solar:chat-line-broken" />
        </View>

        {/* Tab Content */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.tabContent}>
          {activeTab === 'products' && (
            <View style={styles.productsList}>
              {PRODUCTS.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push(`/product/${product.id}`)}
                  activeOpacity={0.9}
                >
                  <View style={[styles.productMain, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Image source={{ uri: product.image }} style={styles.productImage} contentFit="cover" transition={300} />
                    <View style={[styles.productInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                      <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
                      <Text style={[styles.productSummary, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                        {product.description}
                      </Text>
                      <Text style={[styles.productPrice, { color: colors.tint }]}>${product.price}</Text>
                    </View>
                  </View>
                  <View style={[styles.productFooter, { borderTopColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={styles.footerStat}>
                      <Iconify icon="solar:eye-broken" size={14} color={colors.textSecondary} />
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
              ))}
            </View>
          )}

          {activeTab === 'stats' && (
            <View style={styles.statsContent}>
              <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'روند فروش هفتگی' : 'Weekly Sales Trend'}
                </Text>
                <LineChart
                  data={{
                    labels: ['شنبه', '۱شنبه', '۲شنبه', '۳شنبه', '۴شنبه', '۵شنبه', 'جمعه'],
                    datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }],
                  }}
                  width={width - 72}
                  height={190}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>

              <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'توزیع رضایت خریداران' : 'Rating Distribution'}
                </Text>
                <BarChart
                  data={{
                    labels: ['۱★', '۲★', '۳★', '۴★', '۵★'],
                    datasets: [{ data: [2, 5, 10, 30, 53] }],
                  }}
                  width={width - 72}
                  height={190}
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
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={[styles.financeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.financeHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.financeProduct, { color: colors.text }]}>{isRTL ? `فاکتور سفارش شماره ${۱۰۲۴ + i}` : `Order #${1024 + i}`}</Text>
                    <Text style={[styles.financeAmount, { color: colors.tint }]}>${(120 * i).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.financeBuyer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Image source={{ uri: `https://i.pravatar.cc/100?u=buyer-${i}` }} style={{ width: 34, height: 34, borderRadius: 17 }} />
                    <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                      <Text style={[styles.buyerName, { color: colors.text }]}>{isRTL ? 'خریدار تاییدشده' : 'Verified Buyer'}</Text>
                      <Text style={[styles.financeDate, { color: colors.textSecondary }]}>{isRTL ? '۲ ساعت پیش' : '2 hours ago'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: colors.success + '18' }]}>
                      <Text style={[styles.statusText, { color: colors.success }]}>{isRTL ? 'تکمیل شده' : 'Completed'}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'messages' && (
            <View style={styles.messagesList}>
              {PRODUCTS.slice(0, 3).map((product) => (
                <View key={product.id} style={[styles.messageCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.messageHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Image source={{ uri: product.image }} style={styles.msgProductThumb} />
                    <View style={[styles.msgInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Text style={[styles.msgProductName, { color: colors.text }]}>{product.name}</Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>12:30</Text>
                      </View>
                      <Text style={[styles.msgText, { color: colors.textSecondary }]} numberOfLines={2}>
                        {isRTL ? 'سلام، آیا این محصول موجود است و امکان ارسال فوری دارد؟' : 'Hi, is this product in stock for fast delivery?'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.replyButton, { backgroundColor: colors.tint }]}
                    onPress={() => router.push(`/chat/${product.id}`)}
                  >
                    <Text style={styles.replyButtonText}>{isRTL ? 'پاسخ به درخواست خریدار' : 'Reply to Inquiry'}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Multi-Store Switcher Modal */}
      <Modal visible={isStorePickerVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsStorePickerVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{isRTL ? 'مدیریت و سوییچ فروشگاه‌ها' : 'Switch Store'}</Text>
              <TouchableOpacity onPress={() => setIsStorePickerVisible(false)}>
                <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 10 }}>
              {stores.map((s) => {
                const isSelected = s.id === activeStoreId;
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => {
                      setActiveStoreId(s.id);
                      setIsStorePickerVisible(false);
                    }}
                    style={[
                      styles.storeOptionCard,
                      {
                        backgroundColor: isSelected ? colors.tint + '14' : colors.surface,
                        borderColor: isSelected ? colors.tint : colors.border,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                      },
                    ]}
                  >
                    <Image source={{ uri: s.avatar }} style={styles.storeOptionAvatar} />
                    <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', gap: 2 }}>
                      <Text style={[styles.storeOptionName, { color: colors.text }]}>{s.name}</Text>
                      <Text style={{ fontSize: 11, color: colors.tint, fontWeight: '700' }}>{s.role}</Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary }} numberOfLines={1}>{s.specialty}</Text>
                    </View>
                    {isSelected && <Iconify icon="solar:check-circle-bold" size={22} color={colors.tint} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={[styles.addStoreBtn, { backgroundColor: colors.tint }]}
              onPress={() => {
                setIsStorePickerVisible(false);
                setIsAddStoreVisible(true);
              }}
            >
              <Iconify icon="solar:add-circle-bold" size={20} color="#fff" />
              <Text style={styles.addStoreBtnText}>{isRTL ? 'معرفی و ثبت فروشگاه جدید' : 'Register New Store'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add New Store Modal */}
      <Modal visible={isAddStoreVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{isRTL ? 'معرفی و ثبت فروشگاه جدید' : 'Introduce New Store'}</Text>
              <TouchableOpacity onPress={() => setIsAddStoreVisible(false)}>
                <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingVertical: 10 }}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'نام فروشگاه' : 'Store Name'}
                </Text>
                <TextInput
                  style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder={isRTL ? 'مثال: گالری دیجیتال پارس' : 'e.g. Digital Gallery'}
                  placeholderTextColor={colors.textSecondary}
                  value={newStoreName}
                  onChangeText={setNewStoreName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'تخصص و حیطه حوزه کاری' : 'Specialty / Field'}
                </Text>
                <TextInput
                  style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder={isRTL ? 'مثال: مرکز تخصصی پوشاک و اکسسوری' : 'e.g. Fashion & Apparel'}
                  placeholderTextColor={colors.textSecondary}
                  value={newStoreSpecialty}
                  onChangeText={setNewStoreSpecialty}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'سمت شما در فروشگاه' : 'My Role in Store'}
                </Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, flexWrap: 'wrap' }}>
                  {['مدیر کل و مالک', 'مدیر فروشگاه', 'کارمند فروش و پشتیبانی'].map((r) => {
                    const isSelected = newStoreRole === r;
                    return (
                      <TouchableOpacity
                        key={r}
                        onPress={() => setNewStoreRole(r)}
                        style={[
                          styles.roleChip,
                          {
                            backgroundColor: isSelected ? colors.tint + '18' : colors.surface,
                            borderColor: isSelected ? colors.tint : colors.border,
                          },
                        ]}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '700', color: isSelected ? colors.tint : colors.text }}>{r}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.addStoreBtn, { backgroundColor: colors.tint }]}
              onPress={handleCreateStore}
            >
              <Text style={styles.addStoreBtnText}>{isRTL ? 'تایید و ثبت فروشگاه' : 'Create Store'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingHeaderBtn: {
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  floatingHeaderIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scrollContent: { padding: 16, gap: 16 },
  profileCard: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  coverImage: { width: '100%', height: 110 },
  avatarWrapper: {
    marginTop: -40,
    alignSelf: 'center',
  },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 4 },
  shopInfo: { padding: 18, paddingTop: 10, alignItems: 'center' },
  name: { fontSize: 20, fontWeight: '900', marginBottom: 6 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  roleBadgeText: { fontSize: 12, fontWeight: '800' },
  specialty: { fontSize: 13, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  actionRow: { width: '100%', gap: 10 },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  overviewRow: { gap: 12 },
  overviewCard: {
    flex: 1,
    padding: 18,
    borderRadius: 22,
    gap: 6,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
  overviewValue: { fontSize: 18, fontWeight: '900', color: '#fff' },
  tabsContainer: { gap: 8, marginTop: 4 },
  tabButton: {
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
  },
  tabLabel: { fontSize: 11, fontWeight: '800' },
  tabContent: { minHeight: 250 },
  productsList: { gap: 12 },
  productCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1 },
  productMain: { padding: 12, gap: 12 },
  productImage: { width: 80, height: 80, borderRadius: 16 },
  productInfo: { flex: 1, gap: 4 },
  productName: { fontSize: 15, fontWeight: '800' },
  productSummary: { fontSize: 12 },
  productPrice: { fontSize: 16, fontWeight: '900', marginTop: 2 },
  productFooter: { padding: 10, borderTopWidth: 1, justifyContent: 'space-around' },
  footerStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerStatText: { fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  chartContainer: { padding: 14, borderRadius: 20, borderWidth: 1 },
  chart: { borderRadius: 14 },
  statsContent: { paddingBottom: 10 },
  financeList: { gap: 10 },
  financeCard: { padding: 14, borderRadius: 20, gap: 10, borderWidth: 1 },
  financeHeader: { justifyContent: 'space-between', alignItems: 'center' },
  financeProduct: { fontSize: 14, fontWeight: '800' },
  financeAmount: { fontSize: 14, fontWeight: '900' },
  financeBuyer: { alignItems: 'center', gap: 10, paddingTop: 4 },
  buyerName: { fontSize: 13, fontWeight: '700' },
  financeDate: { fontSize: 11 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800' },
  messagesList: { gap: 10 },
  messageCard: { padding: 14, borderRadius: 20, gap: 10, borderWidth: 1 },
  messageHeader: { gap: 10, alignItems: 'flex-start' },
  msgProductThumb: { width: 50, height: 50, borderRadius: 12 },
  msgInfo: { flex: 1, gap: 2 },
  msgProductName: { fontSize: 13, fontWeight: '800' },
  msgText: { fontSize: 12, lineHeight: 17 },
  replyButton: { height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  replyButtonText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, borderWidth: 1, maxHeight: '80%' },
  modalHeaderRow: { justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: '900' },
  storeOptionCard: { padding: 12, borderRadius: 18, borderWidth: 1.5, alignItems: 'center', gap: 12 },
  storeOptionAvatar: { width: 48, height: 48, borderRadius: 24 },
  storeOptionName: { fontSize: 15, fontWeight: '800' },
  addStoreBtn: { height: 52, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 },
  addStoreBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  formGroup: { gap: 6 },
  formLabel: { fontSize: 12, fontWeight: '700' },
  formInput: { height: 50, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, fontSize: 14, fontWeight: '600' },
  roleChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
});
