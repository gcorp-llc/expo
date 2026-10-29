import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, Switch } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore, CustomProduct } from '@/hooks/use-store';
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
  const { language, customProducts } = useStore();
  const showModal = useModalStore((state) => state.showModal);
  const isRTL = language === 'fa';
  const router = useRouter();

  const [activeStoreId, setActiveStoreId] = useState<string>('store-1');
  const [stores] = useState<StoreOption[]>(DEMO_STORES);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isStorePickerVisible, setIsStorePickerVisible] = useState(false);

  // Product Selection Filter State (From Card Action Chips)
  const [selectedProductFilter, setSelectedProductFilter] = useState<any | null>(null);

  // Advanced Product Filter Modal State
  const [isProductFilterModalOpen, setIsProductFilterModalOpen] = useState(false);
  const [productSortBy, setProductSortBy] = useState<'latest' | 'bestselling' | 'popular' | 'profitable' | 'discount'>('latest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock'>('all');
  const [onlyDiscountedFilter, setOnlyDiscountedFilter] = useState(false);
  const [featuredOnlyFilter, setFeaturedOnlyFilter] = useState(false);
  const [conditionFilter, setConditionFilter] = useState<'all' | 'new' | 'used'>('all');

  // Product Menu & Action Modals
  const [selectedProductForMenu, setSelectedProductForMenu] = useState<any | null>(null);
  const [isProductMenuVisible, setIsProductMenuVisible] = useState(false);

  // Specific Action Modals
  const [activeModalType, setActiveModalType] = useState<
    'edit' | 'discount' | 'coupon' | 'auction' | 'report' | null
  >(null);

  // Modals form inputs
  const [discountPercent, setDiscountPercent] = useState('20');
  const [couponCode, setCouponCode] = useState('KUTIK2025');
  const [couponAmount, setCouponAmount] = useState('15');
  const [auctionHours, setAuctionHours] = useState('24');
  const [auctionStartPrice, setAuctionStartPrice] = useState('100');

  // Edit Product state
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // Products extra state management
  const [deactivatedProductIds, setDeactivatedProductIds] = useState<string[]>([]);
  const [disabledCommentsProductIds, setDisabledCommentsProductIds] = useState<string[]>([]);

  // Time Period Filter Modal State (for Stats and Finance Tabs)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '3d' | '7d' | '15d' | '30d' | 'custom'>('7d');
  const [startDate, setStartDate] = useState(isRTL ? '۱۴۰۳/۱۲/۰۱' : '2025-02-01');
  const [endDate, setEndDate] = useState(isRTL ? '۱۴۰۳/۱۲/۱۵' : '2025-02-15');

  // Finance Tab Specific Filters
  const [financeTypeFilter, setFinanceTypeFilter] = useState<'all' | 'cash' | 'installments'>('all');
  const [installmentDueFilter, setInstallmentDueFilter] = useState<'all' | 'upcoming' | 'overdue'>('all');

  // Requests Tab Filter State
  const [requestFilter, setRequestFilter] = useState<'latest' | 'unanswered'>('latest');

  // Reply Box State
  const [replyingMsgId, setReplyingMsgId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sentReplies, setSentReplies] = useState<Record<string, string>>({});

  const currentStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  const allDisplayProducts = useMemo(() => {
    let prods = [...customProducts, ...PRODUCTS];

    // Filter by selected category
    if (selectedCategory !== 'all') {
      prods = prods.filter(p => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    // Price range
    if (priceMin) {
      const minVal = parseFloat(priceMin);
      if (!isNaN(minVal)) prods = prods.filter(p => p.price >= minVal);
    }
    if (priceMax) {
      const maxVal = parseFloat(priceMax);
      if (!isNaN(maxVal)) prods = prods.filter(p => p.price <= maxVal);
    }

    // Stock filter
    if (stockFilter === 'in_stock') {
      prods = prods.filter(p => (p.stockQuantity ?? 10) > 0);
    }

    // Only discounted
    if (onlyDiscountedFilter) {
      prods = prods.filter(p => p.hasActiveSale || p.discountPercentage || (p.oldPrice && p.oldPrice > p.price));
    }

    // Featured only
    if (featuredOnlyFilter) {
      prods = prods.filter(p => (p as any).isFeatured || (p as any).isPopular);
    }

    // Condition filter
    if (conditionFilter !== 'all') {
      prods = prods.filter(p => (p as any).condition === conditionFilter || (!(p as any).condition && conditionFilter === 'new'));
    }

    // Sorting
    return prods.sort((a, b) => {
      if (productSortBy === 'latest') return (b.id.localeCompare(a.id));
      if (productSortBy === 'bestselling') return ((b.salesCount || 0) - (a.salesCount || 0));
      if (productSortBy === 'popular') return (parseFloat(String(b.rating || '4.5')) - parseFloat(String(a.rating || '4.5')));
      if (productSortBy === 'profitable') return (b.price - a.price);
      if (productSortBy === 'discount') {
        const discA = a.discountPercentage || (a.oldPrice ? Math.round(((a.oldPrice - a.price) / a.oldPrice) * 100) : 0);
        const discB = b.discountPercentage || (b.oldPrice ? Math.round(((b.oldPrice - b.price) / b.oldPrice) * 100) : 0);
        return discB - discA;
      }
      return 0;
    });
  }, [customProducts, selectedCategory, priceMin, priceMax, stockFilter, onlyDiscountedFilter, featuredOnlyFilter, conditionFilter, productSortBy]);

  const handleResetProductFilters = () => {
    setProductSortBy('latest');
    setSelectedCategory('all');
    setPriceMin('');
    setPriceMax('');
    setStockFilter('all');
    setOnlyDiscountedFilter(false);
    setFeaturedOnlyFilter(false);
    setConditionFilter('all');
  };

  // Inventory & Stats calculation
  const stats = useMemo(() => {
    let totalStock = customProducts.reduce((acc, p) => acc + (p.stockQuantity || 10), 85);
    let salesCount = customProducts.reduce((acc, p) => acc + (p.salesCount || 0), 124);
    let totalRevenue = customProducts.reduce((acc, p) => acc + (p.price * (p.salesCount || 1)), 45000000);
    let totalCost = customProducts.reduce((acc, p) => acc + ((p.costPrice || p.price * 0.7) * (p.salesCount || 1)), 28000000);
    let netProfit = totalRevenue - totalCost;
    let activeDiscountsCount = allDisplayProducts.filter(p => p.hasActiveSale || p.discountPercentage).length;

    return {
      totalStock,
      salesCount,
      totalRevenue,
      netProfit,
      activeDiscountsCount,
    };
  }, [customProducts, allDisplayProducts]);

  const handleOpenProductMenu = (product: any) => {
    setSelectedProductForMenu(product);
    setIsProductMenuVisible(true);
  };

  const handleSelectMenuOption = (optionKey: string) => {
    setIsProductMenuVisible(false);
    const prod = selectedProductForMenu;
    if (!prod) return;

    switch (optionKey) {
      case 'edit':
        setEditTitle(prod.name);
        setEditPrice(String(prod.price));
        setEditStock(String(prod.stockQuantity || 10));
        setActiveModalType('edit');
        break;
      case 'discount':
        setDiscountPercent(String(prod.discountPercentage || 15));
        setActiveModalType('discount');
        break;
      case 'coupon':
        setCouponCode(`SAVE-${prod.name.slice(0, 3).toUpperCase()}`);
        setCouponAmount('10');
        setActiveModalType('coupon');
        break;
      case 'auction':
        setAuctionStartPrice(String(Math.round(prod.price * 0.5)));
        setAuctionHours('24');
        setActiveModalType('auction');
        break;
      case 'deactivate':
        const isDeactivated = deactivatedProductIds.includes(prod.id);
        if (isDeactivated) {
          setDeactivatedProductIds(prev => prev.filter(id => id !== prod.id));
        } else {
          setDeactivatedProductIds(prev => [...prev, prod.id]);
        }
        showModal({
          title: isDeactivated ? (isRTL ? 'محصول فعال شد' : 'Product Activated') : (isRTL ? 'محصول غیرفعال شد' : 'Product Deactivated'),
          message: isDeactivated
            ? (isRTL ? `محصول «${prod.name}» دوباره در فروشگاه فعال گردید.` : `Product "${prod.name}" has been reactivated.`)
            : (isRTL ? `محصول «${prod.name}» از دید خریداران پنهان و غیرفعال شد.` : `Product "${prod.name}" has been deactivated.`),
          icon: 'solar:check-circle-bold',
          buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
        });
        break;
      case 'comments':
        const isDisabledComms = disabledCommentsProductIds.includes(prod.id);
        if (isDisabledComms) {
          setDisabledCommentsProductIds(prev => prev.filter(id => id !== prod.id));
        } else {
          setDisabledCommentsProductIds(prev => [...prev, prod.id]);
        }
        showModal({
          title: isDisabledComms ? (isRTL ? 'نظرات فعال شدند' : 'Comments Enabled') : (isRTL ? 'کامنت‌ها بسته شدند' : 'Comments Closed'),
          message: isDisabledComms
            ? (isRTL ? `ثبت نظر برای محصول «${prod.name}» مجدداً امکان‌پذیر شد.` : `Comments enabled for "${prod.name}".`)
            : (isRTL ? `ارسال نظر جدید برای «${prod.name}» مسدود گردید.` : `Comments closed for "${prod.name}".`),
          icon: 'solar:chat-square-bold',
          buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
        });
        break;
      case 'report':
        setActiveModalType('report');
        break;
    }
  };

  const handleOpenProductFilteredTab = (product: any, targetTab: TabType) => {
    setSelectedProductFilter(product);
    setActiveTab(targetTab);
  };

  const handleMainTabPress = (tab: TabType) => {
    setSelectedProductFilter(null);
    setActiveTab(tab);
  };

  const handleSendReply = (msgId: string) => {
    if (!replyText.trim()) return;
    setSentReplies(prev => ({ ...prev, [msgId]: replyText.trim() }));
    setReplyingMsgId(null);
    setReplyText('');
    showModal({
      title: isRTL ? 'پاسخ ارسال شد' : 'Reply Sent',
      message: isRTL ? 'پاسخ شما با موفقیت برای خریدار ارسال گردید.' : 'Your reply has been sent to the customer.',
      icon: 'solar:check-circle-bold',
      buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
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
        onPress={() => handleMainTabPress(type)}
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

      {/* Item 12: Header with Back Button and Store Switcher Dropdown */}
      <View style={[styles.expandedHeaderArea, { paddingTop: insets.top + 8, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backHeaderBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={22} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsStorePickerVisible(true)}
          style={[
            styles.fullWidthStoreSelector,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              flex: 1,
            },
          ]}
          activeOpacity={0.85}
        >
          <View style={[styles.storeIconBox, { backgroundColor: colors.tint + '18' }]}>
            <Iconify icon="solar:bag-smile-bold-duotone" size={26} color={colors.tint} />
          </View>
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', gap: 2 }}>
            <Text style={[styles.storeSelectorSub, { color: colors.tint }]}>
              {isRTL ? 'فروشگاه فعال و انتخابی' : 'Active Selected Store'}
            </Text>
            <Text style={[styles.storeSelectorTitle, { color: colors.text }]} numberOfLines={1}>
              {currentStore.name}
            </Text>
          </View>
          <View style={[styles.dropdownChevron, { backgroundColor: colors.surface }]}>
            <Iconify icon="solar:alt-arrow-down-broken" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}>
        
        {/* 1. STORE NAME CARD */}
        <Animated.View entering={FadeInDown.duration(500)} style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image source={{ uri: currentStore.cover }} style={styles.coverImage} contentFit="cover" />

          <View style={styles.avatarWrapper}>
            <Image source={{ uri: currentStore.avatar }} style={[styles.avatar, { borderColor: colors.card }]} contentFit="cover" />
          </View>

          <View style={styles.shopInfo}>
            <Text style={[styles.name, { color: colors.text }]}>{currentStore.name}</Text>

            <View style={[styles.roleBadge, { backgroundColor: colors.tint + '18', borderColor: colors.tint + '40' }]}>
              <Iconify icon="solar:verified-check-bold" size={14} color={colors.tint} />
              <Text style={[styles.roleBadgeText, { color: colors.tint }]}>
                {isRTL ? `سمت من: ${currentStore.role}` : `My Role: ${currentStore.role}`}
              </Text>
            </View>

            <Text style={[styles.specialty, { color: colors.textSecondary }]}>{currentStore.specialty}</Text>

            <View style={[styles.actionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {/* Item 4: Navigate to dedicated Add Product Screen instead of Modal */}
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push('/shop/add-product')}
                activeOpacity={0.85}
              >
                <Iconify icon="solar:add-circle-bold" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>{isRTL ? 'افزودن محصول جدید' : 'Add Product'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push('/settings/shop-management')}
                activeOpacity={0.85}
              >
                <Iconify icon="solar:settings-minimalistic-broken" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* 2. INVENTORY, SALES, PROFIT & AUCTIONS STATS */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.statsGrid}>
          {/* Item 5: Live Stock ("انبار زنده") Card styled like other cards */}
          <View style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Iconify icon="solar:box-broken" size={22} color={colors.tint} />
              <Text style={[styles.statBadgeText, { color: colors.tint }]}>{isRTL ? 'انبار زنده' : 'Live Stock'}</Text>
            </View>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>{isRTL ? 'موجودی انبار' : 'Inventory Stock'}</Text>
            <Text style={[styles.overviewValue, { color: colors.text }]}>{stats.totalStock} {isRTL ? 'عدد' : 'pcs'}</Text>
          </View>

          <View style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Iconify icon="solar:graph-up-broken" size={22} color={colors.success} />
              <Text style={[styles.statBadgeText, { color: colors.success }]}>+۱۸٪</Text>
            </View>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>{isRTL ? 'تعداد فروش کل' : 'Total Sales'}</Text>
            <Text style={[styles.overviewValue, { color: colors.text }]}>{stats.salesCount} {isRTL ? 'سفارش' : 'orders'}</Text>
          </View>

          <View style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Iconify icon="solar:wallet-money-broken" size={22} color={colors.tint} />
              <Text style={[styles.statBadgeText, { color: colors.tint }]}>{isRTL ? 'سود خالص' : 'Profit'}</Text>
            </View>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>{isRTL ? 'سود حاصل از فروش' : 'Net Profit'}</Text>
            <Text style={[styles.overviewValue, { color: colors.tint }]}>
              {stats.netProfit > 1000 ? `$${(stats.netProfit/1000).toFixed(1)}k` : `$${stats.netProfit}`}
            </Text>
          </View>

          <View style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Iconify icon="solar:fire-broken" size={22} color={colors.warning} />
              <Text style={[styles.statBadgeText, { color: colors.warning }]}>{stats.activeDiscountsCount} {isRTL ? 'حراجی' : 'Active'}</Text>
            </View>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>{isRTL ? 'حراجی و تخفیف‌ها' : 'Discounts & Deals'}</Text>
            <Text style={[styles.overviewValue, { color: colors.text }]}>{stats.activeDiscountsCount} {isRTL ? 'محصول' : 'items'}</Text>
          </View>
        </Animated.View>

        {/* Selected Product Filter Banner */}
        {selectedProductFilter && (
          <View style={[styles.filterBanner, { backgroundColor: colors.tint + '18', borderColor: colors.tint + '40', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Image source={{ uri: selectedProductFilter.image }} style={styles.filterBannerThumb} />
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.filterBannerSub, { color: colors.tint }]}>
                {isRTL ? 'فیلتر شده بر اساس محصول:' : 'Filtered by Product:'}
              </Text>
              <Text style={[styles.filterBannerTitle, { color: colors.text }]} numberOfLines={1}>
                {selectedProductFilter.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedProductFilter(null)}
              style={[styles.clearFilterBtn, { backgroundColor: colors.card }]}
            >
              <Iconify icon="solar:close-circle-broken" size={20} color={colors.destructive} />
              <Text style={[styles.clearFilterText, { color: colors.destructive }]}>
                {isRTL ? 'حذف فیلتر' : 'Clear Filter'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

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
              {/* Filter Bar Header for Products Tab */}
              <View style={[styles.tabSubHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.tabSubHeaderTitle, { color: colors.text }]}>
                  {isRTL ? `محصولات فروشگاه (${allDisplayProducts.length})` : `Products (${allDisplayProducts.length})`}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.filterTriggerButton,
                    {
                      backgroundColor: (productSortBy !== 'latest' || selectedCategory !== 'all' || priceMin || priceMax || stockFilter !== 'all' || onlyDiscountedFilter || featuredOnlyFilter || conditionFilter !== 'all') ? colors.tint + '18' : colors.card,
                      borderColor: (productSortBy !== 'latest' || selectedCategory !== 'all' || priceMin || priceMax || stockFilter !== 'all' || onlyDiscountedFilter || featuredOnlyFilter || conditionFilter !== 'all') ? colors.tint : colors.border,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                  ]}
                  onPress={() => setIsProductFilterModalOpen(true)}
                  activeOpacity={0.8}
                >
                  <Iconify icon="solar:tuning-square-2-broken" size={20} color={colors.tint} />
                  <Text style={[styles.filterTriggerText, { color: colors.tint }]}>
                    {isRTL ? 'فیلتر محصولات' : 'Filter Products'}
                  </Text>
                  {(productSortBy !== 'latest' || selectedCategory !== 'all' || priceMin || priceMax || stockFilter !== 'all' || onlyDiscountedFilter || featuredOnlyFilter || conditionFilter !== 'all') && (
                    <View style={[styles.activeFilterDot, { backgroundColor: colors.tint }]} />
                  )}
                </TouchableOpacity>
              </View>

              {allDisplayProducts.length === 0 ? (
                <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Iconify icon="solar:box-minimalistic-broken" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>{isRTL ? 'محصولی یافت نشد' : 'No products found'}</Text>
                  <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                    {isRTL ? 'با این فیلترها محصولی پیدا نشد، می‌توانید فیلترها را بازنشانی کنید.' : 'Try adjusting your filters.'}
                  </Text>
                  <TouchableOpacity style={[styles.resetFilterBtn, { backgroundColor: colors.tint }]} onPress={handleResetProductFilters}>
                    <Text style={styles.resetFilterBtnText}>{isRTL ? 'بازنشانی فیلترها' : 'Reset Filters'}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                allDisplayProducts.map((product) => {
                const isDeactivated = deactivatedProductIds.includes(product.id);
                const isDisabledComms = disabledCommentsProductIds.includes(product.id);

                return (
                  <TouchableOpacity
                    key={product.id}
                    style={[
                      styles.largeProductCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        opacity: isDeactivated ? 0.6 : 1,
                      },
                    ]}
                    onPress={() => router.push(`/product/${product.id}`)}
                    activeOpacity={0.9}
                  >
                    {/* Card Top Row with Title & Menu Button */}
                    <View style={[styles.cardHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <Text style={[styles.largeProductName, { color: colors.text }]}>{product.name}</Text>
                        {isDeactivated && (
                          <View style={[styles.statusTag, { backgroundColor: colors.destructive + '20' }]}>
                            <Text style={[styles.statusTagText, { color: colors.destructive }]}>{isRTL ? 'غیرفعال' : 'Disabled'}</Text>
                          </View>
                        )}
                        {isDisabledComms && (
                          <View style={[styles.statusTag, { backgroundColor: colors.warning + '20' }]}>
                            <Text style={[styles.statusTagText, { color: colors.warning }]}>{isRTL ? 'کامنت بسته' : 'Comments Off'}</Text>
                          </View>
                        )}
                      </View>

                      <TouchableOpacity
                        style={styles.menuDotBtn}
                        onPress={() => handleOpenProductMenu(product)}
                        hitSlop={12}
                      >
                        <Iconify icon="solar:menu-dots-broken" size={22} color={colors.text} />
                      </TouchableOpacity>
                    </View>

                    {/* Main Image & Body */}
                    <View style={[styles.largeProductMain, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <Image source={{ uri: product.image }} style={styles.largeProductImage} contentFit="cover" transition={300} />

                      <View style={[styles.largeProductInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                        <Text style={[styles.productSummary, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
                          {product.description}
                        </Text>

                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                          <Text style={[styles.largeProductPrice, { color: colors.tint }]}>${product.price}</Text>
                          {product.oldPrice && (
                            <Text style={styles.oldPrice}>${product.oldPrice}</Text>
                          )}
                          {(product.hasActiveSale || product.discountPercentage) && (
                            <View style={[styles.saleBadge, { backgroundColor: colors.destructive + '18' }]}>
                              <Text style={[styles.saleBadgeText, { color: colors.destructive }]}>
                                {product.discountPercentage ? `%${product.discountPercentage} حراج` : 'حراجی'}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Interactive Card Actions */}
                    <View style={[styles.cardQuickActionsRow, { borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <TouchableOpacity
                        style={[styles.quickActionChip, { backgroundColor: colors.surface }]}
                        onPress={() => handleOpenProductFilteredTab(product, 'stats')}
                      >
                        <Iconify icon="solar:graph-up-broken" size={16} color={colors.tint} />
                        <Text style={[styles.quickActionText, { color: colors.text }]}>{isRTL ? 'آمار محصول' : 'Stats'}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.quickActionChip, { backgroundColor: colors.surface }]}
                        onPress={() => handleOpenProductFilteredTab(product, 'finance')}
                      >
                        <Iconify icon="solar:wallet-money-broken" size={16} color={colors.success} />
                        <Text style={[styles.quickActionText, { color: colors.text }]}>{isRTL ? 'فروش محصول' : 'Sales'}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.quickActionChip, { backgroundColor: colors.surface }]}
                        onPress={() => handleOpenProductFilteredTab(product, 'messages')}
                      >
                        <Iconify icon="solar:chat-line-broken" size={16} color={colors.warning} />
                        <Text style={[styles.quickActionText, { color: colors.text }]}>{isRTL ? 'پیام‌ها' : 'Messages'}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={[styles.largeProductFooter, { borderTopColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View style={styles.footerStat}>
                        <Iconify icon="solar:box-broken" size={15} color={colors.textSecondary} />
                        <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>
                          {isRTL ? `موجود: ${product.stockQuantity ?? 10}` : `Stock: ${product.stockQuantity ?? 10}`}
                        </Text>
                      </View>

                      <View style={styles.footerStat}>
                        <Iconify icon="solar:chat-line-broken" size={15} color={colors.textSecondary} />
                        <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>
                          {isRTL ? 'پیام‌ها: ۱۴' : 'Msgs: 14'}
                        </Text>
                        <View style={[styles.unreadCountBadge, { backgroundColor: colors.destructive }]}>
                          <Text style={styles.unreadCountText}>۳</Text>
                        </View>
                      </View>

                      <View style={styles.footerStat}>
                        <Iconify icon="solar:star-bold" size={13} color="#fbbf24" />
                        <Text style={[styles.footerStatText, { color: colors.textSecondary }]}>{product.rating || '۴.۸'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }))}
            </View>
          )}

          {activeTab === 'stats' && (
            <View style={styles.statsContent}>
              {/* Sub-header with Time Filter Trigger */}
              <View style={[styles.tabSubHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 12 }]}>
                <Text style={[styles.tabSubHeaderTitle, { color: colors.text }]}>
                  {isRTL ? 'تحلیل و آمار عملکرد' : 'Performance Analytics'}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.timeFilterTriggerButton,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                  ]}
                  onPress={() => setIsTimeModalOpen(true)}
                  activeOpacity={0.8}
                >
                  <Iconify icon="solar:clock-circle-broken" size={20} color={colors.tint} />
                  <Text style={[styles.timeFilterTriggerText, { color: colors.tint }]}>
                    {selectedPeriod === '1d' && (isRTL ? 'بازه: ۱ روز' : 'Period: 1 Day')}
                    {selectedPeriod === '3d' && (isRTL ? 'بازه: ۳ روز' : 'Period: 3 Days')}
                    {selectedPeriod === '7d' && (isRTL ? 'بازه: ۷ روز' : 'Period: 7 Days')}
                    {selectedPeriod === '15d' && (isRTL ? 'بازه: ۱۵ روز' : 'Period: 15 Days')}
                    {selectedPeriod === '30d' && (isRTL ? 'بازه: ۳۰ روز' : 'Period: 30 Days')}
                    {selectedPeriod === 'custom' && (isRTL ? 'بازه: سفارشی' : 'Period: Custom')}
                  </Text>
                  <Iconify icon="solar:alt-arrow-down-broken" size={16} color={colors.tint} />
                </TouchableOpacity>
              </View>

              <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {selectedProductFilter
                    ? (isRTL ? `روند فروش اختصاصی «${selectedProductFilter.name}»` : `Sales Trend: ${selectedProductFilter.name}`)
                    : (isRTL ? 'روند فروش کلی کل فروشگاه' : 'Overall Store Sales Trend')}
                </Text>
                <LineChart
                  data={{
                    labels: ['شنبه', '۱شنبه', '۲شنبه', '۳شنبه', '۴شنبه', '۵شنبه', 'جمعه'],
                    datasets: [{ data: selectedProductFilter ? [12, 19, 15, 30, 45, 20, 35] : [20, 45, 28, 80, 99, 43, 50] }],
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
                  {selectedProductFilter
                    ? (isRTL ? `رضایت خریداران «${selectedProductFilter.name}»` : `Rating: ${selectedProductFilter.name}`)
                    : (isRTL ? 'توزیع رضایت کلی خریداران' : 'Overall Rating Distribution')}
                </Text>
                <BarChart
                  data={{
                    labels: ['۱★', '۲★', '۳★', '۴★', '۵★'],
                    datasets: [{ data: selectedProductFilter ? [0, 1, 2, 8, 25] : [2, 5, 10, 30, 53] }],
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
              {/* Header with Time Period Filter Button */}
              <View style={[styles.tabSubHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 10 }]}>
                <Text style={[styles.tabSubHeaderTitle, { color: colors.text }]}>
                  {isRTL ? 'گزارشات و تراکنش‌های فروش' : 'Sales & Transactions'}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.timeFilterTriggerButton,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                  ]}
                  onPress={() => setIsTimeModalOpen(true)}
                  activeOpacity={0.8}
                >
                  <Iconify icon="solar:clock-circle-broken" size={20} color={colors.tint} />
                  <Text style={[styles.timeFilterTriggerText, { color: colors.tint }]}>
                    {selectedPeriod === '1d' && (isRTL ? 'بازه: ۱ روز' : '1 Day')}
                    {selectedPeriod === '3d' && (isRTL ? 'بازه: ۳ روز' : '3 Days')}
                    {selectedPeriod === '7d' && (isRTL ? 'بازه: ۷ روز' : '7 Days')}
                    {selectedPeriod === '15d' && (isRTL ? 'بازه: ۱۵ روز' : '15 Days')}
                    {selectedPeriod === '30d' && (isRTL ? 'بازه: ۳۰ روز' : '30 Days')}
                    {selectedPeriod === 'custom' && (isRTL ? 'بازه: سفارشی' : 'Custom')}
                  </Text>
                  <Iconify icon="solar:alt-arrow-down-broken" size={16} color={colors.tint} />
                </TouchableOpacity>
              </View>

              {/* Installments & Sales Filter Chips */}
              <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 12 }]}>
                {[
                  { id: 'all', label_fa: 'همه فروش‌ها', label_en: 'All Sales' },
                  { id: 'cash', label_fa: 'فروش نقدی', label_en: 'Cash Sales' },
                  { id: 'installments', label_fa: 'فروش اقساطی', label_en: 'Installment Sales' },
                ].map((ft) => {
                  const isSelected = financeTypeFilter === ft.id;
                  return (
                    <TouchableOpacity
                      key={ft.id}
                      onPress={() => setFinanceTypeFilter(ft.id as any)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSelected ? colors.tint : colors.surface,
                          borderColor: isSelected ? colors.tint : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.filterChipText, { color: isSelected ? '#fff' : colors.text }]}>
                        {isRTL ? ft.label_fa : ft.label_en}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Sub-chips for Installment Due Dates when Installments or All selected */}
              {financeTypeFilter === 'installments' && (
                <View style={[styles.installmentSubFilterRow, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: colors.textSecondary }}>
                    {isRTL ? 'سررسید اقساط:' : 'Due Dates:'}
                  </Text>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
                    {[
                      { id: 'all', label_fa: 'همه', label_en: 'All' },
                      { id: 'upcoming', label_fa: 'پیش‌رو (نزدیک)', label_en: 'Upcoming' },
                      { id: 'overdue', label_fa: 'معوقه / سررسیدشده', label_en: 'Overdue' },
                    ].map((due) => {
                      const isSelected = installmentDueFilter === due.id;
                      return (
                        <TouchableOpacity
                          key={due.id}
                          onPress={() => setInstallmentDueFilter(due.id as any)}
                          style={[
                            styles.dueSubChip,
                            {
                              backgroundColor: isSelected ? colors.tint + '20' : colors.surface,
                              borderColor: isSelected ? colors.tint : colors.border,
                            },
                          ]}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '800', color: isSelected ? colors.tint : colors.textSecondary }}>
                            {isRTL ? due.label_fa : due.label_en}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Transaction List */}
              {[
                { id: 1, isInstallment: false, buyer: 'علی محمدی', amount: '$240', date: '۲ ساعت پیش', status: 'تکمیل شده', due: null },
                { id: 2, isInstallment: true, buyer: 'مریم ابراهیمی', amount: '$650 (قسط ۲ از ۴)', date: 'امروز', status: 'اقساط فعال', due: 'سررسید: ۱۵ اسفند (۴ روز دیگر)', overdue: false },
                { id: 3, isInstallment: true, buyer: 'حسین رضایی', amount: '$1,200 (قسط ۳ از ۶)', date: 'دیروز', status: 'قسط معوقه', due: 'سررسید: ۲۸ بهمن (تاخیر دارد)', overdue: true },
                { id: 4, isInstallment: false, buyer: 'سارا احمدی', amount: '$180', date: '۳ روز پیش', status: 'تکمیل شده', due: null },
              ]
                .filter((item) => {
                  if (financeTypeFilter === 'cash' && item.isInstallment) return false;
                  if (financeTypeFilter === 'installments' && !item.isInstallment) return false;
                  if (financeTypeFilter === 'installments') {
                    if (installmentDueFilter === 'upcoming' && item.overdue) return false;
                    if (installmentDueFilter === 'overdue' && !item.overdue) return false;
                  }
                  return true;
                })
                .map((order) => (
                  <View key={order.id} style={[styles.financeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.financeHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.financeProduct, { color: colors.text }]}>
                          {selectedProductFilter
                            ? (isRTL ? `سفارش ${selectedProductFilter.name} (#${1024 + order.id})` : `Order ${selectedProductFilter.name} (#${1024 + order.id})`)
                            : (isRTL ? `فاکتور سفارش شماره ${1024 + order.id}` : `Order #${1024 + order.id}`)}
                        </Text>
                        {order.isInstallment && (
                          <View style={[styles.statusBadge, { backgroundColor: colors.tint + '18' }]}>
                            <Text style={[styles.statusText, { color: colors.tint }]}>{isRTL ? 'فروش اقساطی' : 'Installment'}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.financeAmount, { color: colors.tint }]}>{order.amount}</Text>
                    </View>

                    <View style={[styles.financeBuyer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <Image source={{ uri: `https://i.pravatar.cc/100?u=buyer-${order.id}` }} style={{ width: 34, height: 34, borderRadius: 17 }} />
                      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                        <Text style={[styles.buyerName, { color: colors.text }]}>{order.buyer}</Text>
                        <Text style={[styles.financeDate, { color: colors.textSecondary }]}>{order.date}</Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: order.overdue
                              ? colors.destructive + '18'
                              : order.isInstallment
                              ? colors.warning + '18'
                              : colors.success + '18',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            {
                              color: order.overdue ? colors.destructive : order.isInstallment ? colors.warning : colors.success,
                            },
                          ]}
                        >
                          {order.status}
                        </Text>
                      </View>
                    </View>

                    {/* Installment Due Date Alert Row */}
                    {order.isInstallment && order.due && (
                      <View
                        style={[
                          styles.dueDateAlertBox,
                          {
                            backgroundColor: order.overdue ? colors.destructive + '12' : colors.warning + '12',
                            borderColor: order.overdue ? colors.destructive + '30' : colors.warning + '30',
                            flexDirection: isRTL ? 'row-reverse' : 'row',
                          },
                        ]}
                      >
                        <Iconify
                          icon={order.overdue ? "solar:danger-bold" : "solar:calendar-mark-broken"}
                          size={16}
                          color={order.overdue ? colors.destructive : colors.warning}
                        />
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '800',
                            color: order.overdue ? colors.destructive : colors.warning,
                            flex: 1,
                            textAlign: isRTL ? 'right' : 'left',
                          }}
                        >
                          {order.due}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
            </View>
          )}

          {activeTab === 'messages' && (
            <View style={styles.messagesList}>
              {/* Header & Filter Chips for Requests Tab */}
              <View style={[styles.tabSubHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 10 }]}>
                <Text style={[styles.tabSubHeaderTitle, { color: colors.text }]}>
                  {isRTL ? 'درخواست‌ها و سوالات خریداران' : 'Buyer Requests & Inquiries'}
                </Text>
              </View>

              <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 12 }]}>
                {[
                  { id: 'latest', label_fa: 'آخرین درخواست‌ها', label_en: 'Latest Requests' },
                  { id: 'unanswered', label_fa: 'پاسخ داده نشده', label_en: 'Unanswered' },
                ].map((rf) => {
                  const isSelected = requestFilter === rf.id;
                  return (
                    <TouchableOpacity
                      key={rf.id}
                      onPress={() => setRequestFilter(rf.id as any)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSelected ? colors.tint : colors.surface,
                          borderColor: isSelected ? colors.tint : colors.border,
                          flexDirection: isRTL ? 'row-reverse' : 'row',
                          alignItems: 'center',
                          gap: 6,
                        },
                      ]}
                    >
                      <Text style={[styles.filterChipText, { color: isSelected ? '#fff' : colors.text }]}>
                        {isRTL ? rf.label_fa : rf.label_en}
                      </Text>
                      {rf.id === 'unanswered' && (
                        <View style={[styles.unreadCountBadge, { backgroundColor: isSelected ? '#fff' : colors.destructive }]}>
                          <Text style={[styles.unreadCountText, { color: isSelected ? colors.tint : '#fff' }]}>
                            {allDisplayProducts.slice(0, 3).filter(p => !sentReplies[`req-${p.id}`]).length}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Message Items Filtered */}
              {(() => {
                const targetProducts = selectedProductFilter ? [selectedProductFilter] : allDisplayProducts.slice(0, 3);
                const filteredProducts = targetProducts.filter((product) => {
                  const msgId = `req-${product.id}`;
                  const isAnswered = !!sentReplies[msgId];
                  if (requestFilter === 'unanswered' && isAnswered) return false;
                  return true;
                });

                if (filteredProducts.length === 0) {
                  return (
                    <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <Iconify icon="solar:chat-round-check-broken" size={48} color={colors.success} />
                      <Text style={[styles.emptyTitle, { color: colors.text }]}>
                        {isRTL ? 'همه درخواست‌ها پاسخ داده شده‌اند' : 'All inquiries replied!'}
                      </Text>
                      <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                        {isRTL ? 'هیچ درخواست پاسخ داده نشده‌ای در این لیست وجود ندارد.' : 'No pending unanswered inquiries found.'}
                      </Text>
                    </View>
                  );
                }

                return filteredProducts.map((product) => {
                  const msgId = `req-${product.id}`;
                  const isReplying = replyingMsgId === msgId;
                  const prevSent = sentReplies[msgId];

                  return (
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

                      {prevSent ? (
                        <View style={[styles.sentReplyBox, { backgroundColor: colors.tint + '15', borderColor: colors.tint + '30' }]}>
                          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                            <Iconify icon="solar:check-circle-bold" size={16} color={colors.tint} />
                            <Text style={[styles.sentReplyLabel, { color: colors.tint }]}>{isRTL ? 'پاسخ ارسال‌شده شما:' : 'Your Sent Reply:'}</Text>
                          </View>
                          <Text style={[styles.sentReplyText, { color: colors.text }]}>{prevSent}</Text>
                        </View>
                      ) : null}

                      {isReplying ? (
                        <View style={styles.replyBoxContainer}>
                          <TextInput
                            style={[
                              styles.replyInput,
                              {
                                color: colors.text,
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                textAlign: isRTL ? 'right' : 'left',
                              },
                            ]}
                            placeholder={isRTL ? 'پاسخ خود را بنویسید...' : 'Write your response...'}
                            placeholderTextColor={colors.textSecondary}
                            value={replyText}
                            onChangeText={setReplyText}
                            multiline
                          />
                          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                              style={[styles.cancelReplyBtn, { backgroundColor: colors.surface }]}
                              onPress={() => {
                                setReplyingMsgId(null);
                                setReplyText('');
                              }}
                            >
                              <Text style={[styles.cancelReplyText, { color: colors.textSecondary }]}>{isRTL ? 'انصراف' : 'Cancel'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.sendReplyBtn, { backgroundColor: colors.tint }]}
                              onPress={() => handleSendReply(msgId)}
                            >
                              <Iconify icon="solar:plain-bold" size={16} color="#fff" />
                              <Text style={styles.sendReplyText}>{isRTL ? 'ارسال پاسخ' : 'Send'}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[styles.replyButton, { backgroundColor: prevSent ? colors.surface : colors.tint }]}
                          onPress={() => {
                            setReplyingMsgId(msgId);
                            setReplyText(prevSent || '');
                          }}
                        >
                          <Text style={[styles.replyButtonText, { color: prevSent ? colors.text : '#fff' }]}>
                            {prevSent ? (isRTL ? 'ویرایش یا ارسال پاسخ مجدد' : 'Edit Reply') : (isRTL ? 'پاسخ به درخواست خریدار' : 'Reply to Inquiry')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                });
              })()}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Product Action Options Modal */}
      <Modal visible={isProductMenuVisible} transparent animationType="slide" onRequestClose={() => setIsProductMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsProductMenuVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedProductForMenu?.name || (isRTL ? 'مدیریت محصول' : 'Product Options')}
              </Text>
              <TouchableOpacity onPress={() => setIsProductMenuVisible(false)}>
                <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 8, paddingVertical: 10 }}>
              <TouchableOpacity
                style={[styles.menuOptionRow, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => handleSelectMenuOption('edit')}
              >
                <Iconify icon="solar:pen-2-broken" size={22} color={colors.tint} />
                <Text style={[styles.menuOptionText, { color: colors.text }]}>{isRTL ? 'ویرایش محصول' : 'Edit Product'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuOptionRow, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => handleSelectMenuOption('discount')}
              >
                <Iconify icon="solar:tag-bold" size={22} color={colors.warning} />
                <Text style={[styles.menuOptionText, { color: colors.text }]}>{isRTL ? 'اعمال تخفیف' : 'Apply Discount'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuOptionRow, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => handleSelectMenuOption('coupon')}
              >
                <Iconify icon="solar:ticket-broken" size={22} color={colors.success} />
                <Text style={[styles.menuOptionText, { color: colors.text }]}>{isRTL ? 'ایجاد کد تخفیف' : 'Create Discount Coupon'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuOptionRow, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => handleSelectMenuOption('auction')}
              >
                <Iconify icon="solar:fire-broken" size={22} color={colors.tint} />
                <Text style={[styles.menuOptionText, { color: colors.text }]}>{isRTL ? 'ایجاد حراجی زمانبندی' : 'Scheduled Auction'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuOptionRow, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => handleSelectMenuOption('deactivate')}
              >
                <Iconify icon="solar:eye-closed-broken" size={22} color={colors.destructive} />
                <Text style={[styles.menuOptionText, { color: colors.text }]}>
                  {deactivatedProductIds.includes(selectedProductForMenu?.id)
                    ? (isRTL ? 'فعال‌سازی مجدد محصول' : 'Reactivate Product')
                    : (isRTL ? 'غیرفعال کردن محصول' : 'Deactivate Product')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuOptionRow, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => handleSelectMenuOption('comments')}
              >
                <Iconify icon="solar:chat-square-bold" size={22} color={colors.textSecondary} />
                <Text style={[styles.menuOptionText, { color: colors.text }]}>
                  {disabledCommentsProductIds.includes(selectedProductForMenu?.id)
                    ? (isRTL ? 'باز کردن نظرات' : 'Enable Comments')
                    : (isRTL ? 'بستن کامنت‌ها' : 'Close Comments')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuOptionRow, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => handleSelectMenuOption('report')}
              >
                <Iconify icon="solar:graph-up-broken" size={22} color={colors.tint} />
                <Text style={[styles.menuOptionText, { color: colors.text }]}>{isRTL ? 'گزارش فروش محصول' : 'Product Sales Report'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Action Sub-Modals */}
      <Modal visible={activeModalType !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {activeModalType === 'edit' && (isRTL ? 'ویرایش محصول' : 'Edit Product')}
                {activeModalType === 'discount' && (isRTL ? 'اعمال تخفیف روی محصول' : 'Apply Discount')}
                {activeModalType === 'coupon' && (isRTL ? 'ایجاد کد تخفیف جدید' : 'Create Coupon')}
                {activeModalType === 'auction' && (isRTL ? 'ایجاد حراجی زمانبندی‌شده' : 'Scheduled Auction')}
                {activeModalType === 'report' && (isRTL ? 'گزارش فروش محصول' : 'Sales Report')}
              </Text>
              <TouchableOpacity onPress={() => setActiveModalType(null)}>
                <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 10 }}>
              {activeModalType === 'edit' && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.textSecondary }]}>{isRTL ? 'عنوان محصول' : 'Title'}</Text>
                    <TextInput style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: isRTL ? 'right' : 'left' }]} value={editTitle} onChangeText={setEditTitle} />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.textSecondary }]}>{isRTL ? 'قیمت فروش ($)' : 'Price'}</Text>
                    <TextInput style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: 'left' }]} keyboardType="numeric" value={editPrice} onChangeText={setEditPrice} />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.textSecondary }]}>{isRTL ? 'موجودی انبار' : 'Stock'}</Text>
                    <TextInput style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: 'left' }]} keyboardType="numeric" value={editStock} onChangeText={setEditStock} />
                  </View>
                </>
              )}

              {activeModalType === 'discount' && (
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>{isRTL ? 'درصد تخفیف (%)' : 'Discount (%)'}</Text>
                  <TextInput style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: 'left' }]} keyboardType="numeric" value={discountPercent} onChangeText={setDiscountPercent} />
                </View>
              )}

              {activeModalType === 'coupon' && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.textSecondary }]}>{isRTL ? 'کد تخفیف اختصاصی' : 'Coupon Code'}</Text>
                    <TextInput style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: 'left' }]} value={couponCode} onChangeText={setCouponCode} />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.textSecondary }]}>{isRTL ? 'مبلغ یا درصد تخفیف ($)' : 'Discount Amount'}</Text>
                    <TextInput style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: 'left' }]} keyboardType="numeric" value={couponAmount} onChangeText={setCouponAmount} />
                  </View>
                </>
              )}

              {activeModalType === 'auction' && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.textSecondary }]}>{isRTL ? 'قیمت پایه حراج ($)' : 'Starting Price ($)'}</Text>
                    <TextInput style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: 'left' }]} keyboardType="numeric" value={auctionStartPrice} onChangeText={setAuctionStartPrice} />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.textSecondary }]}>{isRTL ? 'مدت زمان حراجی (ساعت)' : 'Auction Duration (Hours)'}</Text>
                    <TextInput style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: 'left' }]} keyboardType="numeric" value={auctionHours} onChangeText={setAuctionHours} />
                  </View>
                </>
              )}

              {activeModalType === 'report' && (
                <View style={{ gap: 10, paddingVertical: 6 }}>
                  <Text style={{ fontSize: 14, color: colors.text, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
                    {isRTL ? `آمار کل فروش برای «${selectedProductForMenu?.name}»:` : `Sales Summary:`}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                    • {isRTL ? 'تعداد کل سفارشات: ۴۲ عدد' : 'Total Orders: 42 pcs'}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                    • {isRTL ? 'درآمد کل حاصله: $۸,۴۰۰' : 'Total Revenue: $8,400'}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                    • {isRTL ? 'نرخ بازگشت مشتری: ۹۴٪' : 'Repeat Customer Rate: 94%'}
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.addStoreBtn, { backgroundColor: colors.tint }]}
              onPress={() => {
                setActiveModalType(null);
                showModal({
                  title: isRTL ? 'تغییرات ثبت شد' : 'Changes Saved',
                  message: isRTL ? 'تنظیمات محصول با موفقیت بروزرسانی گردید.' : 'Product updated successfully.',
                  icon: 'solar:check-circle-bold',
                  buttons: [{ text: isRTL ? 'عالی' : 'Great', style: 'primary' }]
                });
              }}
            >
              <Text style={styles.addStoreBtnText}>{isRTL ? 'ثبت و اعمال تغییرات' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Period Picker Slide Modal (for Stats & Finance) */}
      <Modal visible={isTimeModalOpen} transparent animationType="slide" onRequestClose={() => setIsTimeModalOpen(false)}>
        <TouchableOpacity style={styles.cleanModalOverlay} activeOpacity={1} onPress={() => setIsTimeModalOpen(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                <Iconify icon="solar:clock-circle-broken" size={24} color={colors.tint} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {isRTL ? 'انتخاب بازه زمانی' : 'Select Time Period'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsTimeModalOpen(false)}>
                <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingVertical: 10 }}>
              {/* Preset Periods */}
              <View style={styles.filterSectionGroup}>
                <Text style={[styles.filterSectionLabel, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'بازه‌های آماده:' : 'Preset Durations:'}
                </Text>
                <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  {[
                    { id: '1d', label_fa: '۱ روز', label_en: '1 Day' },
                    { id: '3d', label_fa: '۳ روز', label_en: '3 Days' },
                    { id: '7d', label_fa: '۷ روز', label_en: '7 Days' },
                    { id: '15d', label_fa: '۱۵ روز', label_en: '15 Days' },
                    { id: '30d', label_fa: '۳۰ روز', label_en: '30 Days' },
                  ].map((p) => {
                    const isSelected = selectedPeriod === p.id;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        onPress={() => setSelectedPeriod(p.id as any)}
                        style={[
                          styles.filterChip,
                          {
                            backgroundColor: isSelected ? colors.tint : colors.surface,
                            borderColor: isSelected ? colors.tint : colors.border,
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                          },
                        ]}
                      >
                        <Text style={[styles.filterChipText, { color: isSelected ? '#fff' : colors.text }]}>
                          {isRTL ? p.label_fa : p.label_en}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Custom Date Range Picker */}
              <View style={styles.filterSectionGroup}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.filterSectionLabel, { color: colors.text }]}>
                    {isRTL ? 'انتخاب بازه تاریخ دلخواه (از تاریخ تا تاریخ):' : 'Custom Date Range:'}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.tint, fontWeight: '700' }}>
                    {isRTL ? 'تقویم شمسی' : 'Gregorian Calendar'}
                  </Text>
                </View>

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, marginTop: 4 }}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                      {isRTL ? 'از تاریخ:' : 'From Date:'}
                    </Text>
                    <TextInput
                      style={[
                        styles.formInput,
                        {
                          color: colors.text,
                          borderColor: selectedPeriod === 'custom' ? colors.tint : colors.border,
                          backgroundColor: colors.surface,
                          textAlign: isRTL ? 'right' : 'left',
                        },
                      ]}
                      value={startDate}
                      onChangeText={(t) => {
                        setStartDate(t);
                        setSelectedPeriod('custom');
                      }}
                      placeholder={isRTL ? '۱۴۰۳/۱۲/۰۱' : '2025-02-01'}
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                      {isRTL ? 'تا تاریخ:' : 'To Date:'}
                    </Text>
                    <TextInput
                      style={[
                        styles.formInput,
                        {
                          color: colors.text,
                          borderColor: selectedPeriod === 'custom' ? colors.tint : colors.border,
                          backgroundColor: colors.surface,
                          textAlign: isRTL ? 'right' : 'left',
                        },
                      ]}
                      value={endDate}
                      onChangeText={(t) => {
                        setEndDate(t);
                        setSelectedPeriod('custom');
                      }}
                      placeholder={isRTL ? '۱۴۰۳/۱۲/۱۵' : '2025-02-15'}
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.addStoreBtn, { backgroundColor: colors.tint, marginTop: 10 }]}
              onPress={() => setIsTimeModalOpen(false)}
            >
              <Text style={styles.addStoreBtnText}>{isRTL ? 'اعمال و تایید بازه زمانی' : 'Apply Time Period'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Product Filter Slide Modal */}
      <Modal visible={isProductFilterModalOpen} transparent animationType="slide" onRequestClose={() => setIsProductFilterModalOpen(false)}>
        <TouchableOpacity style={styles.cleanModalOverlay} activeOpacity={1} onPress={() => setIsProductFilterModalOpen(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border, maxHeight: '88%' }]}>
            <View style={[styles.modalHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                <Iconify icon="solar:tuning-square-2-broken" size={24} color={colors.tint} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {isRTL ? 'فیلتر و گروه‌بندی محصولات' : 'Product Filters'}
                </Text>
              </View>

              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity onPress={handleResetProductFilters}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: colors.tint }}>
                    {isRTL ? 'بازنشانی' : 'Reset'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsProductFilterModalOpen(false)}>
                  <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 18, paddingVertical: 10 }}>
              {/* 1. Display & Sort By (نمایش بر اساس) */}
              <View style={styles.filterSectionGroup}>
                <Text style={[styles.filterSectionLabel, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'نمایش و مرتب‌سازی بر اساس:' : 'Sort By:'}
                </Text>
                <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  {[
                    { id: 'latest', label_fa: 'آخرین‌ها', label_en: 'Latest' },
                    { id: 'bestselling', label_fa: 'پرفروش‌ترین‌ها', label_en: 'Best Sellers' },
                    { id: 'popular', label_fa: 'محبوب‌ترین‌ها', label_en: 'Most Popular' },
                    { id: 'profitable', label_fa: 'پر سود‌ترین‌ها', label_en: 'Most Profitable' },
                    { id: 'discount', label_fa: 'بیشترین تخفیف', label_en: 'Highest Discount' },
                  ].map((s) => {
                    const isSelected = productSortBy === s.id;
                    return (
                      <TouchableOpacity
                        key={s.id}
                        onPress={() => setProductSortBy(s.id as any)}
                        style={[
                          styles.filterChip,
                          {
                            backgroundColor: isSelected ? colors.tint : colors.surface,
                            borderColor: isSelected ? colors.tint : colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.filterChipText, { color: isSelected ? '#fff' : colors.text }]}>
                          {isRTL ? s.label_fa : s.label_en}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. Categories & Grouping (دسته بندی‌ها و گروه‌بندی‌ها) */}
              <View style={styles.filterSectionGroup}>
                <Text style={[styles.filterSectionLabel, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'دسته‌بندی و گروه محصولات:' : 'Category & Grouping:'}
                </Text>
                <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  {[
                    { id: 'all', label_fa: 'همه دسته‌ها', label_en: 'All Categories' },
                    { id: 'electronics', label_fa: 'گجت و الکترونیک', label_en: 'Electronics' },
                    { id: 'fashion', label_fa: 'پوشاک و مد', label_en: 'Fashion' },
                    { id: 'digital', label_fa: 'کالای دیجیتال', label_en: 'Digital Goods' },
                    { id: 'home', label_fa: 'خانه و سبک زندگی', label_en: 'Home & Living' },
                  ].map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => setSelectedCategory(cat.id)}
                        style={[
                          styles.filterChip,
                          {
                            backgroundColor: isSelected ? colors.tint : colors.surface,
                            borderColor: isSelected ? colors.tint : colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.filterChipText, { color: isSelected ? '#fff' : colors.text }]}>
                          {isRTL ? cat.label_fa : cat.label_en}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 3. Price Range (از فلان قیمت تا فلان قیمت) */}
              <View style={styles.filterSectionGroup}>
                <Text style={[styles.filterSectionLabel, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'محدوده قیمت ($):' : 'Price Range ($):'}
                </Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                      {isRTL ? 'از قیمت ($)' : 'Min Price ($)'}
                    </Text>
                    <TextInput
                      style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: 'left' }]}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      value={priceMin}
                      onChangeText={setPriceMin}
                    />
                  </View>

                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                      {isRTL ? 'تا قیمت ($)' : 'Max Price ($)'}
                    </Text>
                    <TextInput
                      style={[styles.formInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, textAlign: 'left' }]}
                      placeholder="10000"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      value={priceMax}
                      onChangeText={setPriceMax}
                    />
                  </View>
                </View>
              </View>

              {/* 4. Stock Filter (موجودی) */}
              <View style={styles.filterSectionGroup}>
                <Text style={[styles.filterSectionLabel, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'وضعیت موجودی:' : 'Stock Availability:'}
                </Text>
                <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  {[
                    { id: 'all', label_fa: 'همه کالاها', label_en: 'All Items' },
                    { id: 'in_stock', label_fa: 'فقط کالاهای موجود', label_en: 'In Stock Only' },
                  ].map((st) => {
                    const isSelected = stockFilter === st.id;
                    return (
                      <TouchableOpacity
                        key={st.id}
                        onPress={() => setStockFilter(st.id as any)}
                        style={[
                          styles.filterChip,
                          {
                            backgroundColor: isSelected ? colors.tint : colors.surface,
                            borderColor: isSelected ? colors.tint : colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.filterChipText, { color: isSelected ? '#fff' : colors.text }]}>
                          {isRTL ? st.label_fa : st.label_en}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 5. Customary Quick Toggles (سایر فیلترهای مرسوم) */}
              <View style={styles.filterSectionGroup}>
                <Text style={[styles.filterSectionLabel, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'سایر فیلترها:' : 'Other Filters:'}
                </Text>
                <View style={{ gap: 10 }}>
                  <TouchableOpacity
                    style={[styles.toggleFilterRow, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    onPress={() => setOnlyDiscountedFilter(!onlyDiscountedFilter)}
                  >
                    <Iconify
                      icon={onlyDiscountedFilter ? "solar:check-square-bold" : "solar:square-broken"}
                      size={22}
                      color={onlyDiscountedFilter ? colors.tint : colors.textSecondary}
                    />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                      {isRTL ? 'فقط کالاهای تخفیف‌دار و حراجی' : 'Discounted Items Only'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.toggleFilterRow, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    onPress={() => setFeaturedOnlyFilter(!featuredOnlyFilter)}
                  >
                    <Iconify
                      icon={featuredOnlyFilter ? "solar:check-square-bold" : "solar:square-broken"}
                      size={22}
                      color={featuredOnlyFilter ? colors.tint : colors.textSecondary}
                    />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                      {isRTL ? 'فقط محصولات ویژه و پیشنهادی' : 'Featured Products Only'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.addStoreBtn, { backgroundColor: colors.tint, marginTop: 10 }]}
              onPress={() => setIsProductFilterModalOpen(false)}
            >
              <Text style={styles.addStoreBtnText}>{isRTL ? 'اعمال فیلترها' : 'Apply Filters'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Item 6: Store Switcher Modal with transparent background overlay so it doesn't darken the screen image */}
      <Modal visible={isStorePickerVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.cleanModalOverlay} activeOpacity={1} onPress={() => setIsStorePickerVisible(false)}>
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
                router.push('/shop/create');
              }}
            >
              <Iconify icon="solar:add-circle-bold" size={20} color="#fff" />
              <Text style={styles.addStoreBtnText}>{isRTL ? 'معرفی و ثبت فروشگاه جدید' : 'Register New Store'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  expandedHeaderArea: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthStoreSelector: {
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 12,
  },
  storeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeSelectorSub: {
    fontSize: 10,
    fontWeight: '800',
  },
  storeSelectorTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  dropdownChevron: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewCard: {
    width: (width - 32 - 12) / 2,
    padding: 14,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statBadgeText: { fontSize: 10, fontWeight: '800' },
  overviewLabel: { fontSize: 11, fontWeight: '700' },
  overviewValue: { fontSize: 17, fontWeight: '900' },

  filterBanner: {
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
  },
  filterBannerThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  filterBannerSub: {
    fontSize: 11,
    fontWeight: '800',
  },
  filterBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  clearFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  clearFilterText: {
    fontSize: 11,
    fontWeight: '800',
  },

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
  productsList: { gap: 16 },

  largeProductCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  cardHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  largeProductName: {
    fontSize: 16,
    fontWeight: '900',
  },
  menuDotBtn: {
    padding: 4,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  largeProductMain: {
    gap: 12,
  },
  largeProductImage: {
    width: 96,
    height: 96,
    borderRadius: 18,
  },
  largeProductInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  largeProductPrice: {
    fontSize: 18,
    fontWeight: '900',
  },
  cardQuickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  quickActionChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '800',
  },

  saleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  saleBadgeText: { fontSize: 10, fontWeight: '800' },
  productSummary: { fontSize: 12, lineHeight: 17 },
  oldPrice: { fontSize: 13, textDecorationLine: 'line-through', color: '#888' },

  largeProductFooter: { paddingTop: 10, borderTopWidth: 1, justifyContent: 'space-around', alignItems: 'center' },
  footerStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerStatText: { fontSize: 12, fontWeight: '700' },
  unreadCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  unreadCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },

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
  messagesList: { gap: 12 },
  messageCard: { padding: 14, borderRadius: 20, gap: 12, borderWidth: 1 },
  messageHeader: { gap: 10, alignItems: 'flex-start' },
  msgProductThumb: { width: 50, height: 50, borderRadius: 12 },
  msgInfo: { flex: 1, gap: 2 },
  msgProductName: { fontSize: 13, fontWeight: '800' },
  msgText: { fontSize: 12, lineHeight: 17 },
  replyButton: { height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  replyButtonText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  sentReplyBox: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  sentReplyLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  sentReplyText: {
    fontSize: 12,
    fontWeight: '600',
  },

  replyBoxContainer: {
    gap: 8,
  },
  replyInput: {
    minHeight: 60,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    fontSize: 13,
  },
  cancelReplyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cancelReplyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sendReplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  sendReplyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  cleanModalOverlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, borderWidth: 1, maxHeight: '85%' },
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

  menuOptionRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  menuOptionText: {
    fontSize: 15,
    fontWeight: '700',
  },

  tabSubHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabSubHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  filterTriggerButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    position: 'relative',
  },
  filterTriggerText: {
    fontSize: 12,
    fontWeight: '800',
  },
  activeFilterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
  resetFilterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  resetFilterBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  filterSectionGroup: {
    gap: 8,
  },
  filterSectionLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  chipsWrap: {
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeFilterTriggerButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  timeFilterTriggerText: {
    fontSize: 12,
    fontWeight: '800',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  toggleFilterRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    gap: 10,
  },
  installmentSubFilterRow: {
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dueSubChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  dueDateAlertBox: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
});
