import React, { useMemo, useCallback } from 'react';
import { PageBackground } from '@/components/ui/PageBackground';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRODUCTS } from '@/constants/mock-data';
import { ProductCard } from '@/components/ui/ProductCard';
import { useStore } from '@/hooks/use-store';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify'; // ایمپورت کامپوننت شما
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function FavoritesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, favorites: favoriteIds, clearFavorites } = useStore();
  const isRTL = language === 'fa';

  const favorites = useMemo(() => PRODUCTS.filter(p => favoriteIds.includes(p.id)), [favoriteIds]);
  const specialOffers = useMemo(() => PRODUCTS.slice(4, 9), []);

  const handleNavigate = useCallback((id: string) => router.push(`/product/${id}`), [router]);

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
      <View style={[styles.header, { paddingTop: insets.top + 20, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.title, { color: colors.text }]}>{isRTL ? 'علاقه‌مندی‌ها' : 'Favorites'}</Text>
        {favorites.length > 0 && (
          <TouchableOpacity style={[styles.clearButton, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]} onPress={clearFavorites} activeOpacity={0.8}>
            <View style={styles.clearButtonBlur}>
              <Iconify icon="solar:trash-bin-trash-bold" width={18} height={18} color={colors.destructive} />
              <Text style={[styles.clearButtonText, { color: colors.destructive }]}>
                {isRTL ? 'حذف همه' : 'Clear All'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={[styles.productRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 16, justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  clearButton: { borderRadius: 14, overflow: 'hidden' },
  clearButtonBlur: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  clearButtonText: { fontSize: 12, fontWeight: '700' },
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