import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';
import { PageBackground } from '@/components/ui/PageBackground';
import { PRODUCTS } from '@/constants/mock-data';
import { ProductCard } from '@/components/ui/ProductCard';

const { width } = Dimensions.get('window');

export default function PublicShopScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'پروفایل فروشگاه' : 'Shop Profile'}
          </Text>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.card }]}>
            <Iconify icon="solar:share-broken" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Shop Info Card */}
        <View style={[styles.shopCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
           <Image source={{ uri: 'https://picsum.photos/200/200?random=10' }} style={styles.shopLogo} />
           <View style={styles.shopInfo}>
              <Text style={[styles.shopName, { color: colors.text }]}>{isRTL ? 'فروشگاه کوتیک' : 'Kutik Shop'}</Text>
              <View style={[styles.statsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                 <View style={styles.stat}>
                    <Text style={[styles.statValue, { color: colors.text }]}>4.9</Text>
                    <Iconify icon="solar:star-bold" size={12} color="#F59E0B" />
                 </View>
                 <View style={[styles.divider, { backgroundColor: colors.border }]} />
                 <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{isRTL ? '۱۲ محصول' : '12 Products'}</Text>
                 <View style={[styles.divider, { backgroundColor: colors.border }]} />
                 <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{isRTL ? '۱.۲k دنبال‌کننده' : '1.2k Followers'}</Text>
              </View>
           </View>
           <TouchableOpacity style={[styles.followBtn, { backgroundColor: colors.tint }]}>
              <Text style={styles.followBtnText}>{isRTL ? 'دنبال کردن' : 'Follow'}</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.productsHeader}>
           <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
             {isRTL ? 'تمامی محصولات' : 'All Products'}
           </Text>
        </View>

        <View style={[styles.productsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {PRODUCTS.map((product) => (
            <View key={product.id} style={styles.productWrapper}>
              <ProductCard
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10, zIndex: 10 },
  headerContent: { height: 60, alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(128,128,128,0.1)' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  shopCard: { padding: 24, borderRadius: 28, borderWidth: 1, alignItems: 'center', gap: 16, marginBottom: 32 },
  shopLogo: { width: 80, height: 80, borderRadius: 24 },
  shopInfo: { alignItems: 'center', gap: 8 },
  shopName: { fontSize: 22, fontWeight: '900' },
  statsRow: { alignItems: 'center', gap: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 14, fontWeight: '800' },
  statLabel: { fontSize: 13, fontWeight: '600' },
  divider: { width: 4, height: 4, borderRadius: 2 },
  followBtn: { paddingHorizontal: 32, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  followBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  productsHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900' },
  productsGrid: { flexWrap: 'wrap', gap: 16 },
  productWrapper: { width: (width - 40 - 16) / 2 },
});
