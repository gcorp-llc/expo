import React, { useState, useEffect, useRef } from 'react';
import { PageBackground } from '@/components/ui/PageBackground';
import { StyleSheet, View, RefreshControl, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native';
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
  FadeInRight
} from 'react-native-reanimated';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SUGGESTION_WIDTH = SCREEN_WIDTH * 0.85;

const CategoryItem = ({ item, isSelected, isRTL, colors, colorScheme, onPress }: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // eslint-disable-next-line react-hooks/immutability
  const handlePressIn = () => { scale.value = withSpring(0.9); };
  // eslint-disable-next-line react-hooks/immutability
  const handlePressOut = () => { scale.value = withSpring(1); };

  const icons: any = {
    'Electronics': 'solar:smartphone-broken',
    'Fashion': 'solar:bag-heart-broken',
    'Home': 'solar:home-broken',
    'Books': 'solar:book-broken',
    'Beauty': 'solar:magic-stick-broken',
    'All': 'solar:widget-2-broken'
  };

  const categoryTranslations: any = {
    'All': 'همه',
    'Electronics': 'الکترونیک',
    'Fashion': 'مد و فشن',
    'Home': 'خانه و آشپزخانه',
    'Books': 'کتاب‌ها',
    'Beauty': 'زیبایی و سلامت'
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.categoryCard,
        {
          borderColor: isSelected ? colors.tint : colors.border,
          backgroundColor: isSelected ? colors.tint : colors.card,
        },
        animatedStyle
      ]}>
        <Iconify icon={icons[item.name] || 'solar:box-broken'} size={26} color={isSelected ? '#fff' : colors.text} />
        <Text style={[styles.categoryName, { color: isSelected ? '#fff' : colors.text, marginTop: Spacing.sm }]}>
          {isRTL ? (categoryTranslations[item.name] || item.name) : item.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { searchQuery, language } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const { data: products = [], isLoading: isProductsLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const isLoading = isProductsLoading || isCategoryLoading;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const scrollY = useSharedValue(0);
  const isRTL = language === 'fa';
  const { isGuest } = useStore();

  const suggestionScrollRef = useRef<ScrollView>(null);
  const suggestionIndex = useRef(0);

  const categoryOptions: Option[] = [
    { label: isRTL ? 'همه' : 'All', value: 'All', icon: 'solar:widget-2-broken' },
    ...CATEGORIES.map(cat => ({
      label: isRTL ? (
        cat.name === 'Electronics' ? 'الکترونیک' :
        cat.name === 'Fashion' ? 'مد و فشن' :
        cat.name === 'Home' ? 'خانه و آشپزخانه' :
        cat.name === 'Books' ? 'کتاب‌ها' :
        cat.name === 'Beauty' ? 'زیبایی و سلامت' : cat.name
      ) : cat.name,
      value: cat.name,
      icon: (
        cat.name === 'Electronics' ? 'solar:smartphone-broken' :
        cat.name === 'Fashion' ? 'solar:bag-heart-broken' :
        cat.name === 'Home' ? 'solar:home-broken' :
        cat.name === 'Books' ? 'solar:book-broken' :
        cat.name === 'Beauty' ? 'solar:magic-stick-broken' : 'solar:box-broken'
      )
    }))
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (suggestionScrollRef.current && !isLoading) {
        suggestionIndex.current = (suggestionIndex.current + 1) % 3;
        suggestionScrollRef.current.scrollTo({
          x: suggestionIndex.current * (SUGGESTION_WIDTH + 16),
          animated: true,
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) return;
    setIsCategoryLoading(true);
    setSelectedCategory(category);
    setTimeout(() => setIsCategoryLoading(false), 600);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearchLoading(true);
      const timer = setTimeout(() => setIsSearchLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      setIsSearchLoading(false);
    }
  }, [searchQuery]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    // eslint-disable-next-line react-hooks/immutability
    scrollY.value = event.contentOffset.y;
  });

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const showSkeletons = isLoading || isSearchLoading;

  return (
    <>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ModernHeader
        scrollY={scrollY}
      />

      <AnimatedFlashList
        data={showSkeletons ? [1,2,3,4] : filteredProducts}
        keyExtractor={(item: any) => showSkeletons ? `skeleton-${item}` : item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow as any}
        contentContainerStyle={{
          paddingTop: insets.top + 145,
          paddingBottom: 120,
          paddingHorizontal: Spacing.sm,
        }}
        {...({ estimatedItemSize: 250, columnWrapperStyle: styles.productRow } as any)}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            {/* Categories */}
            <Animated.View entering={FadeInDown.duration(600).delay(100)} style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('categories')}
              </Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
                <Text style={{ color: colors.tint, fontWeight: '700', fontSize: 14 }}>{t('see_all')}</Text>
              </TouchableOpacity>
            </Animated.View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.categoriesContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <View key={`cat-skeleton-${i}`} style={[styles.categoryCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <Skeleton width={40} height={40} borderRadius={12} />
                    <Skeleton width={50} height={10} style={{ marginTop: Spacing.md }} />
                  </View>
                ))
              ) : (
                <>
                <CategoryItem
                  item={{ id: 'all', name: 'All' }}
                  isSelected={selectedCategory === 'All'}
                  isRTL={isRTL}
                  colors={colors}
                  colorScheme={colorScheme}
                  onPress={() => handleCategorySelect('All')}
                />
                {CATEGORIES.map((cat, index) => (
                  <Animated.View key={cat.id} entering={FadeInRight.delay(index * 100).duration(500)}>
                    <CategoryItem
                      item={cat}
                      isSelected={selectedCategory === cat.name}
                      isRTL={isRTL}
                      colors={colors}
                      colorScheme={colorScheme}
                      onPress={() => handleCategorySelect(cat.name)}
                    />
                  </Animated.View>
                ))}
                </>
              )}
            </ScrollView>

            {/* Hot Suggestions */}
            <Animated.View entering={FadeInDown.duration(600).delay(300)} style={[styles.sectionHeader, { marginTop: Spacing.xxl, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('hot_suggestions')}
              </Text>
            </Animated.View>

            <ScrollView
              ref={suggestionScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={SUGGESTION_WIDTH + Spacing.lg}
              decelerationRate="fast"
              contentContainerStyle={[styles.suggestionsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              {isLoading ? (
                Array(2).fill(0).map((_, i) => (
                  <View key={`suggestion-skeleton-${i}`} style={[styles.suggestionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Skeleton width="100%" height="100%" borderRadius={24} />
                  </View>
                ))
              ) : (
                products.slice(0,3).map((product, index) => (
                  <Animated.View key={product.id} entering={FadeInRight.delay(index * 200).duration(600)}>
                    <TouchableOpacity
                      style={[styles.suggestionCard, { borderColor: colors.border }]}
                      onPress={() => router.push(`/product/${product.id}`)}
                      activeOpacity={0.9}
                    >
                      <Image source={{ uri: (product as any).image }} style={styles.suggestionImage} contentFit="cover" transition={400} />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.9)']}
                        style={StyleSheet.absoluteFill}
                      />
                      <View style={[styles.suggestionInfo, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                          <Text style={[styles.suggestionTitle, { color: '#fff' }]} numberOfLines={1}>{product.name}</Text>
                          <Text style={[styles.suggestionPrice, { color: colors.tint }]}>${product.price}</Text>
                        </View>
                        <View style={[styles.suggestionBtn, { backgroundColor: colors.tint }]}>
                          <Iconify icon={isRTL ? "solar:arrow-left-up-broken" : "solar:arrow-right-up-broken"} size={20} color="#fff" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              )}
            </ScrollView>

            <Animated.View entering={FadeInDown.duration(600).delay(500)} style={[styles.sectionHeader, { marginTop: Spacing.xxl, marginBottom: Spacing.lg, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('all_products')}
              </Text>
            </Animated.View>
          </View>
        }
        renderItem={({ item, index }: { item: any; index: number }) => showSkeletons ? (
          <View style={styles.skeletonContainer}>
            <View style={[styles.skeletonCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Skeleton width="100%" height="100%" borderRadius={24} />
            </View>
            <Skeleton width="80%" height={16} style={{ marginTop: Spacing.md }} />
            <Skeleton width="40%" height={16} style={{ marginTop: Spacing.sm }} />
          </View>
        ) : (
          <Animated.View
            entering={FadeInDown.delay((index % 4) * 100).duration(500)}
            style={{ flex: 1 }}
          >
            <ProductCard product={item as any} onPress={() => router.push(`/product/${item.id}`)} />
          </Animated.View>
        )}
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
  headerContent: { marginBottom: Spacing.md, paddingHorizontal: Spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg, paddingHorizontal: Spacing.xs },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.6 },
  categoriesContainer: { paddingRight: Spacing.lg, gap: Spacing.md, height: 115 },
  categoryCard: { width: 95, height: 105, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, overflow: 'hidden' },
  categoryName: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  suggestionsContainer: { paddingRight: Spacing.lg, gap: Spacing.lg },
  suggestionCard: { width: SUGGESTION_WIDTH, height: 220, borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  suggestionImage: { width: '100%', height: '100%' },
  suggestionInfo: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  suggestionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
  suggestionPrice: { fontSize: 16, fontWeight: '900', marginTop: 2 },
  suggestionBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  skeletonContainer: { flex: 1, margin: Spacing.sm, marginBottom: Spacing.md },
  skeletonCard: { width: '100%', aspectRatio: 0.85, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  productRow: { justifyContent: 'space-between', paddingHorizontal: Spacing.xs },
});
