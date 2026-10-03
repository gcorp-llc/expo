import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

interface ReviewsCardProps {
  rating: number;
  count: number;
  isRTL: boolean;
}

export const ReviewsCard = ({ rating, count, isRTL }: ReviewsCardProps) => {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  const handleViewAll = () => {
    router.push('/shop/reviews');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isRTL ? 'نظرات مشتریان' : 'Customer Reviews'}
        </Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={[styles.viewAll, { color: colors.tint }]}>
            {isRTL ? 'مشاهده همه' : 'View All'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.ratingBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.ratingInfo}>
          <Text style={[styles.ratingValue, { color: colors.text }]}>{rating}</Text>
          <View style={[styles.stars, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Iconify key={s} icon="solar:star-bold" size={16} color={s <= Math.floor(rating) ? '#FBBF24' : colors.border} />
            ))}
          </View>
          <Text style={[styles.count, { color: colors.textSecondary }]}>
            {count} {isRTL ? 'نظر ثبت شده' : 'Reviews'}
          </Text>
        </View>

        <View style={styles.bars}>
          {[5, 4, 3, 2, 1].map((n) => (
            <View key={n} style={[styles.barRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.barNum, { color: colors.textSecondary }]}>{n}</Text>
              <View style={[styles.barBg, { backgroundColor: colors.border }]}>
                <View style={[styles.barFill, { backgroundColor: '#FBBF24', width: `${n * 15}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    borderRadius: 28,
    padding: Spacing.xl,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '800',
  },
  ratingBox: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 20,
  },
  ratingInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: '900',
  },
  stars: {
    gap: 2,
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
  },
  bars: {
    flex: 1,
    gap: 4,
  },
  barRow: {
    alignItems: 'center',
    gap: 8,
  },
  barNum: {
    fontSize: 10,
    fontWeight: '700',
    width: 10,
  },
  barBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
