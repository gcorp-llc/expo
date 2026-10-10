import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ModernHeader } from '@/components/ui/ModernHeader';
import { ProductCard } from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { CATEGORIES } from '@/constants/mock-data';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';
import { SelectionModal, Option } from '@/components/ui/SelectionModal';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SUGGESTION_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_GAP = 10;

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: 'solar:smartphone-broken',
  Fashion: 'solar:bag-heart-broken',
  Home: 'solar:home-broken',
  Books: 'solar:book-broken',
  Beauty: 'solar:magic-stick-broken',
  Vehicles: 'solar:wheel-broken',
  'Real Estate': 'solar:city-broken',
  Sports: 'solar:basketball-broken',
  Gaming: 'solar:gamepad-broken',
  Services: 'solar:case-round-broken',
  All: 'solar:widget-2-broken',
};

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  All: 'همه',
  Electronics: 'الکترونیک',
  Fashion: 'مد و پوشاک',
  Home: 'خانه و آشپزخانه',
  Books: 'کتاب و هنر',
  Beauty: 'زیبایی و سلامت',
  Vehicles: 'خودرو و وسایل نقلیه',
  'Real Estate': 'املاک و مسکن',
  Sports: 'ورزش و سفر',
  Gaming: 'بازی و سرگرمی',
  Services: 'خدمات و کسب‌وکار',
};

const FloatingCategoryChip = React.memo(function FloatingCategoryChip({
  item,
  isSelected,
  isRTL,
  colors,
  onPress,
}: {
  item: { id: string; name: string };
  isSelected: boolean;
  isRTL: boolean;
  colors: (typeof Colors)['light'];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.floatingChip,
        {
          backgroundColor: isSelected ? colors.tint : colors.card,
          borderColor: isSelected ? colors.tint : colors.border,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
      <Iconify
        icon={CATEGORY_ICONS[item.name] || 'solar:box-broken'}
        size={18}
        color={isSelected ? '#fff' : colors.text}
      />
      <Text
        style={[
          styles.floatingChipText,
          { color: isSelected ? '#fff' : colors.text },
        ]}
      >
        {isRTL ? CATEGORY_TRANSLATIONS[item.name] || item.name : item.name}
      </Text>
    </TouchableOpacity>
  );
});

const CategoryItem = React.memo(function CategoryItem({
  item,
  isSelected,
  isRTL,
  colors,
  onPress,
}: {
  item: { id: string; name: string };
  isSelected: boolean;
  isRTL: boolean;
  colors: (typeof Colors)['light'];
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.categoryCard,
          {
            borderColor: isSelected ? colors.tint : colors.border,
            backgroundColor: isSelected ? colors.tint : colors.card,
            shadowColor: isSelected ? colors.tint : '#000',
            shadowOpacity: isSelected ? 0.25 : 0.06,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.categoryIconWrap}>
          <Iconify
            icon={CATEGORY_ICONS[item.name] || 'solar:box-broken'}
            size={28}
            color={isSelected ? '#fff' : colors.text}
          />
        </View>
        <Text
          style={[
            styles.categoryName,
            { color: isSelected ? '#fff' : colors.text },
          ]}
          numberOfLines={1}
        >
          {isRTL ? CATEGORY_TRANSLATIONS[item.name] || item.name : item.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { searchQuery, language } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const {
    data: products = [],
    isLoading: isProductsLoading,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const isLoading = isProductsLoading || isCategoryLoading;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const scrollY = useSharedValue(0);
  const isRTL = language === 'fa';

  const suggestionScrollRef = useRef<ScrollView>(null);
  const suggestionIndex = useRef(0);

  const categoryOptions: Option[] = useMemo(
    () => [
      { label: isRTL ? 'همه' : 'All', value: 'All', icon: 'solar:widget-2-broken' },
      ...CATEGORIES.map((cat) => ({
        label: isRTL ? CATEGORY_TRANSLATIONS[cat.name] || cat.name : cat.name,
        value: cat.name,
        icon: CATEGORY_ICONS[cat.name] || cat.icon || 'solar:box-broken',
      })),
    ],
    [isRTL]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (suggestionScrollRef.current && !isLoading && products.length > 0) {
        suggestionIndex.current = (suggestionIndex.current + 1) % Math.min(3, products.length);
        suggestionScrollRef.current.scrollTo({
          x: suggestionIndex.current * (SUGGESTION_WIDTH + Spacing.lg),
          animated: true,
        });
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [isLoading, products.length]);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory((prev) => {
      if (prev === category) return prev;
      setIsCategoryLoading(true);
      setTimeout(() => setIsCategoryLoading(false), 450);
      return category;
    });
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearchLoading(true);
      const timer = setTimeout(() => setIsSearchLoading(false), 400);
      return () => clearTimeout(timer);
    }
    setIsSearchLoading(false);
  }, [searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((product: any) => {
      const name = (product.name || '').toLowerCase();
      const matchesSearch = !q || name.includes(q);
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const showSkeletons = isLoading || isSearchLoading;
  const hotProducts = products.slice(0, 3);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconWrap, { backgroundColor: colors.secondaryBackground }]}>
        <Iconify icon="solar:box-minimalistic-broken" size={40} color={colors.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {isRTL ? 'محصولی یافت نشد' : 'No products found'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {isRTL
          ? 'دسته‌بندی یا جستجوی دیگری را امتحان کنید'
          : 'Try a different category or search'}
      </Text>
      {selectedCategory !== 'All' && (
        <TouchableOpacity
          style={[styles.emptyBtn, { backgroundColor: colors.tint }]}
          onPress={() => handleCategorySelect('All')}
        >
          <Text style={styles.emptyBtnText}>
            {isRTL ? 'نمایش همه محصولات' : 'Show all products'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ModernHeader scrollY={scrollY} />

        <AnimatedFlashList
          data={showSkeletons ? [1, 2, 3, 4] : filteredProducts}
          keyExtractor={(item: any) =>
            showSkeletons ? `skeleton-${item}` : String(item.id)
          }
          numColumns={2}
          contentContainerStyle={{
            paddingTop: insets.top + 145,
            paddingBottom: 175,
            paddingHorizontal: Spacing.sm,
            flexGrow: 1,
          }}
          {...({ estimatedItemSize: 280 } as any)}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          ListEmptyComponent={!showSkeletons ? <EmptyState /> : null}
          ListHeaderComponent={
            <View style={styles.headerContent}>
              {/* Categories */}
              <Animated.View
                entering={FadeInDown.duration(500).delay(80)}
                style={[
                  styles.sectionHeader,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t('categories')}
                </Text>
                <TouchableOpacity
                  onPress={() => setCategoryModalVisible(true)}
                  hitSlop={8}
                  style={styles.seeAllBtn}
                >
                  <Text style={{ color: colors.tint, fontWeight: '700', fontSize: 13 }}>
                    {t('see_all')}
                  </Text>
                  <Iconify
                    icon={isRTL ? 'solar:alt-arrow-left-linear' : 'solar:alt-arrow-right-linear'}
                    size={16}
                    color={colors.tint}
                  />
                </TouchableOpacity>
              </Animated.View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.categoriesContainer,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
              >
                {isLoading ? (
                  Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <View
                        key={`cat-skeleton-${i}`}
                        style={[
                          styles.categoryCard,
                          { borderColor: colors.border, backgroundColor: colors.card },
                        ]}
                      >
                        <Skeleton width={40} height={40} borderRadius={12} />
                        <Skeleton width={48} height={10} style={{ marginTop: 10 }} />
                      </View>
                    ))
                ) : (
                  <>
                    <CategoryItem
                      item={{ id: 'all', name: 'All' }}
                      isSelected={selectedCategory === 'All'}
                      isRTL={isRTL}
                      colors={colors}
                      onPress={() => handleCategorySelect('All')}
                    />
                    {CATEGORIES.map((cat, index) => (
                      <Animated.View
                        key={cat.id}
                        entering={FadeInRight.delay(index * 60).duration(400)}
                      >
                        <CategoryItem
                          item={cat}
                          isSelected={selectedCategory === cat.name}
                          isRTL={isRTL}
                          colors={colors}
                          onPress={() => handleCategorySelect(cat.name)}
                        />
                      </Animated.View>
                    ))}
                  </>
                )}
              </ScrollView>

              {/* Hot Suggestions */}
              <Animated.View
                entering={FadeInDown.duration(500).delay(200)}
                style={[
                  styles.sectionHeader,
                  {
                    marginTop: Spacing.xl,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  },
                ]}
              >
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                  <View style={[styles.hotDot, { backgroundColor: colors.destructive }]} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {t('hot_suggestions')}
                  </Text>
                </View>
              </Animated.View>

              <ScrollView
                ref={suggestionScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SUGGESTION_WIDTH + Spacing.lg}
                decelerationRate="fast"
                contentContainerStyle={[
                  styles.suggestionsContainer,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
              >
                {isLoading ? (
                  Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <View
                        key={`suggestion-skeleton-${i}`}
                        style={[
                          styles.suggestionCard,
                          { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                      >
                        <Skeleton width="100%" height="100%" borderRadius={20} />
                      </View>
                    ))
                ) : (
                  hotProducts.map((product: any, index: number) => (
                    <Animated.View
                      key={product.id}
                      entering={FadeInRight.delay(index * 120).duration(500)}
                    >
                      <TouchableOpacity
                        style={[styles.suggestionCard, { borderColor: colors.border }]}
                        onPress={() => router.push(`/product/${product.id}`)}
                        activeOpacity={0.92}
                      >
                        <Image
                          source={{
                            uri:
                              product.image ||
                              product.thumbnail ||
                              'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
                          }}
                          style={styles.suggestionImage}
                          contentFit="cover"
                          transition={350}
                        />
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.85)']}
                          locations={[0.3, 0.65, 1]}
                          style={StyleSheet.absoluteFill}
                        />
                        <View
                          style={[
                            styles.suggestionInfo,
                            { flexDirection: isRTL ? 'row-reverse' : 'row' },
                          ]}
                        >
                          <View
                            style={{
                              flex: 1,
                              alignItems: isRTL ? 'flex-end' : 'flex-start',
                            }}
                          >
                            <Text
                              style={styles.suggestionTitle}
                              numberOfLines={1}
                            >
                              {product.name}
                            </Text>
                            <Text style={[styles.suggestionPrice, { color: '#7dd3fc' }]}>
                              ${Number(product.price).toLocaleString()}
                            </Text>
                          </View>
                          <View
                            style={[styles.suggestionBtn, { backgroundColor: colors.tint }]}
                          >
                            <Iconify
                              icon={
                                isRTL
                                  ? 'solar:arrow-left-up-broken'
                                  : 'solar:arrow-right-up-broken'
                              }
                              size={18}
                              color="#fff"
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  ))
                )}
              </ScrollView>

              <Animated.View
                entering={FadeInDown.duration(500).delay(350)}
                style={[
                  styles.sectionHeader,
                  {
                    marginTop: Spacing.xl,
                    marginBottom: Spacing.md,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t('all_products')}
                </Text>
                {!showSkeletons && filteredProducts.length > 0 && (
                  <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '600' }}>
                    {filteredProducts.length} {isRTL ? 'مورد' : 'items'}
                  </Text>
                )}
              </Animated.View>
            </View>
          }
          renderItem={({ item, index }: { item: any; index: number }) =>
            showSkeletons ? (
              <View style={styles.skeletonContainer}>
                <View
                  style={[
                    styles.skeletonCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <Skeleton width="100%" height="100%" borderRadius={20} />
                </View>
                <Skeleton width="85%" height={14} style={{ marginTop: 12 }} />
                <Skeleton width="45%" height={14} style={{ marginTop: 8 }} />
              </View>
            ) : (
              <Animated.View
                entering={FadeInDown.delay((index % 4) * 70).duration(400)}
                style={{ flex: 1 }}
              >
                <ProductCard
                  product={item as any}
                  onPress={() => router.push(`/product/${item.id}`)}
                />
              </Animated.View>
            )
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
              progressViewOffset={insets.top + 145}
            />
          }
        />
      </View>

      {/* Floating Category Bar displayed above Footer Bar */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[
          styles.floatingCategoriesBar,
          {
            bottom: Platform.OS === 'ios' ? 102 : 92,
            backgroundColor: colors.surface,
            borderColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setCategoryModalVisible(true)}
          style={[styles.floatingCategoryMenuBtn, { backgroundColor: colors.tint + '18' }]}
        >
          <Iconify icon="solar:widget-2-broken" size={20} color={colors.tint} />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.floatingCategoriesScroll,
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <FloatingCategoryChip
            item={{ id: 'all', name: 'All' }}
            isSelected={selectedCategory === 'All'}
            isRTL={isRTL}
            colors={colors}
            onPress={() => handleCategorySelect('All')}
          />
          {CATEGORIES.map((cat) => (
            <FloatingCategoryChip
              key={cat.id}
              item={cat}
              isSelected={selectedCategory === cat.name}
              isRTL={isRTL}
              colors={colors}
              onPress={() => handleCategorySelect(cat.name)}
            />
          ))}
        </ScrollView>
      </Animated.View>

      <SelectionModal
        isVisible={isCategoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        options={categoryOptions}
        selectedValue={selectedCategory}
        onSelect={handleCategorySelect}
        title={isRTL ? 'انتخاب دسته‌بندی' : 'Select Category'}
        isRTL={isRTL}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContent: { marginBottom: Spacing.sm, paddingHorizontal: Spacing.xs },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  categoriesContainer: {
    paddingRight: Spacing.md,
    gap: 10,
    paddingBottom: 4,
  },
  categoryCard: {
    width: 90,
    height: 98,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    gap: 8,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  categoryIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: 'transparent',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  hotDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  suggestionsContainer: {
    paddingRight: Spacing.md,
    gap: Spacing.lg,
  },
  suggestionCard: {
    width: SUGGESTION_WIDTH,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  suggestionImage: { width: '100%', height: '100%' },
  suggestionInfo: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#fff',
  },
  suggestionPrice: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  suggestionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonContainer: {
    flex: 1,
    margin: CARD_GAP / 2,
    marginBottom: Spacing.md,
  },
  skeletonCard: {
    width: '100%',
    aspectRatio: 0.9,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  floatingCategoriesBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 52,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 90,
  },
  floatingCategoryMenuBtn: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCategoriesScroll: {
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 8,
  },
  floatingChip: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  floatingChipText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
