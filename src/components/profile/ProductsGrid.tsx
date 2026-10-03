import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProfileProduct } from '@/types/profile';
import { ProfileProductCard } from './ProfileProductCard';

interface ProductsGridProps {
  products: ProfileProduct[];
  isRTL: boolean;
}

export const ProductsGrid = ({ products, isRTL }: ProductsGridProps) => {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  const handleViewAll = () => {
    // Navigating to the public shop profile created in step 2
    router.push('/shop/me');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isRTL ? 'محصولات اخیر' : 'Recent Products'}
        </Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={[styles.viewAll, { color: colors.tint }]}>
            {isRTL ? 'مشاهده همه' : 'View All'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {products.slice(0, 4).map((product) => (
          <View key={product.id} style={styles.cardWrapper}>
            <ProfileProductCard product={product} isRTL={isRTL} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '800',
  },
  grid: {
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cardWrapper: {
    width: '48%',
  },
});
