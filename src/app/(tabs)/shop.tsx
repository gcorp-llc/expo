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

  // Product Filter State
  const [selectedProductFilter, setSelectedProductFilter] = useState<any | null>(null);

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

  // Reply Box State
  const [replyingMsgId, setReplyingMsgId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sentReplies, setSentReplies] = useState<Record<string, string>>({});

  const currentStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  const allDisplayProducts = useMemo(() => {
    return [...customProducts, ...PRODUCTS];
  }, [customProducts]);

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
              {allDisplayProducts.map((product) => {
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
              })}
            </View>
          )}

          {activeTab === 'stats' && (
            <View style={styles.statsContent}>
              <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                  {selectedProductFilter
                    ? (isRTL ? `روند فروش اختصاصی «${selectedProductFilter.name}»` : `Sales Trend: ${selectedProductFilter.name}`)
                    : (isRTL ? 'روند فروش کلی کل فروشگاه' : 'Overall Store Weekly Sales Trend')}
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
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={[styles.financeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.financeHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.financeProduct, { color: colors.text }]}>
                      {selectedProductFilter
                        ? (isRTL ? `سفارش ${selectedProductFilter.name} (#${1024 + i})` : `Order ${selectedProductFilter.name} (#${1024 + i})`)
                        : (isRTL ? `فاکتور سفارش شماره ${1024 + i}` : `Order #${1024 + i}`)}
                    </Text>
                    <Text style={[styles.financeAmount, { color: colors.tint }]}>
                      ${selectedProductFilter ? (selectedProductFilter.price * i).toFixed(2) : (120 * i).toFixed(2)}
                    </Text>
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
              {(selectedProductFilter ? [selectedProductFilter] : allDisplayProducts.slice(0, 3)).map((product) => {
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

                    {prevSent && (
                      <View style={[styles.sentReplyBox, { backgroundColor: colors.tint + '15', borderColor: colors.tint + '30' }]}>
                        <Text style={[styles.sentReplyLabel, { color: colors.tint }]}>{isRTL ? 'پاسخ ارسال‌شده شما:' : 'Your Sent Reply:'}</Text>
                        <Text style={[styles.sentReplyText, { color: colors.text }]}>{prevSent}</Text>
                      </View>
                    )}

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
                        style={[styles.replyButton, { backgroundColor: colors.tint }]}
                        onPress={() => {
                          setReplyingMsgId(msgId);
                          setReplyText('');
                        }}
                      >
                        <Text style={styles.replyButtonText}>{isRTL ? 'پاسخ به درخواست خریدار' : 'Reply to Inquiry'}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
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
});
