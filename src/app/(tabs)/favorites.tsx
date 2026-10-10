import React, { useMemo, useCallback, useState } from 'react';
import { PageBackground } from '@/components/ui/PageBackground';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRODUCTS } from '@/constants/mock-data';
import { ProductCard } from '@/components/ui/ProductCard';
import { useStore } from '@/hooks/use-store';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify'; // ایمپورت کامپوننت شما
import Animated, { FadeInDown, useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function FavoritesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, favorites: favoriteIds, clearFavorites } = useStore();
  const isRTL = language === 'fa';

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const favorites = useMemo(() => PRODUCTS.filter(p => favoriteIds.includes(p.id)), [favoriteIds]);
  const specialOffers = useMemo(() => PRODUCTS.slice(4, 9), []);

  const handleNavigate = useCallback((id: string) => router.push(`/product/${id}`), [router]);

  const handleClearAll = () => {
    Alert.alert(
      isRTL ? 'حذف همه علاقه‌مندی‌ها' : 'Clear All Favorites',
      isRTL ? 'آیا از حذف تمام محصولات از لیست علاقه‌مندی‌ها اطمینان دارید؟' : 'Are you sure you want to remove all items from favorites?',
      [
        { text: isRTL ? 'انصراف' : 'Cancel', style: 'cancel' },
        { text: isRTL ? 'حذف' : 'Remove All', style: 'destructive', onPress: clearFavorites },
      ]
    );
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(scrollY.value, [0, 30], [0, 0.08], Extrapolate.CLAMP);
    return {
      shadowOpacity,
      elevation: scrollY.value > 10 ? 4 : 0,
    };
  });

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ProductCard product={item} style={{ width: CARD_WIDTH }} onPress={() => handleNavigate(item.id)} />
    ),
    [handleNavigate]
  );

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Animated.View
        entering={FadeInDown.duration(600).delay(100)}
        style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'پیشنهادات ویژه' : 'Special Offers'}
        </Text>
        <FlatList
          data={specialOffers}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.offersContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.offerCard} onPress={() => handleNavigate(item.id)} activeOpacity={0.85}>
              <Image source={{ uri: item.image }} style={styles.offerImage} contentFit="cover" />
              <View style={[styles.offerBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <Text style={styles.offerPrice}>${item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(200)}>
        <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left', paddingHorizontal: 4 }]}>
          {isRTL ? 'لیست من' : 'My List'}
        </Text>
      </Animated.View>
      {favorites.length === 0 && (
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.emptyContainer}>
          <Iconify icon="solar:heart-broken-bold" width={64} height={64} color={colors.icon} />
          <Text style={[styles.emptyText, { color: colors.textSecondary, textAlign: 'center' }]}>
            {isRTL ? 'لیست علاقه‌مندی‌های شما خالی است' : 'Your favorites list is empty'}
          </Text>
        </Animated.View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />
      <Animated.View
        style={[
          styles.header,
          headerAnimatedStyle,
          {
            paddingTop: insets.top + 12,
            backgroundColor: colors.background + 'EE',
            borderBottomColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'علاقه‌مندی‌ها' : 'Favorites'}
        </Text>
        {favorites.length > 0 && (
          <TouchableOpacity
            style={[
              styles.clearButtonFloating,
              {
                backgroundColor: colors.destructive + '15',
                borderColor: colors.destructive + '30',
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
            onPress={handleClearAll}
            activeOpacity={0.8}
          >
            <Iconify icon="solar:trash-bin-trash-broken" width={18} height={18} color={colors.destructive} />
            <Text style={[styles.clearButtonText, { color: colors.destructive }]}>
              {isRTL ? 'حذف همه' : 'Clear All'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <AnimatedFlatList
        data={favorites}
        keyExtractor={(item: any) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={[styles.productRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[styles.listContent, { paddingTop: insets.top + 75 }]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 20,
    paddingBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: -0.8 },
  clearButtonFloating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  clearButtonText: { fontSize: 13, fontWeight: '800' },
  listHeader: { marginBottom: 12, gap: 20 },
  section: {
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16, paddingHorizontal: 4 },
  offersContainer: { gap: 14, paddingHorizontal: 4 },
  offerCard: { width: 150, height: 190, borderRadius: 14, overflow: 'hidden' },
  offerImage: { width: '100%', height: '100%' },
  offerBadge: { position: 'absolute', bottom: 10, right: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  offerPrice: { color: '#fff', fontSize: 13, fontWeight: '900' },
  listContent: { paddingHorizontal: 16, paddingBottom: 140 },
  productRow: { justifyContent: 'space-between', marginBottom: 18 },
  emptyContainer: { paddingVertical: 50, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { fontSize: 16, fontWeight: '600' },
});