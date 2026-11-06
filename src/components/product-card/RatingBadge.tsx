import React from 'react';
import { View, Text } from 'react-native';
import { Iconify } from '@/components/ui/Iconify';
import { styles } from './ProductCard.styles';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface RatingBadgeProps {
  rating?: number;
  reviewCount?: number;
}

export const RatingBadge = ({ rating, reviewCount }: RatingBadgeProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  if (rating === undefined || rating === null) {
    return null;
  }

  return (
    <View style={styles.ratingRow}>
      <View style={styles.ratingBadge}>
        <Iconify icon="solar:star-bold" size={12} color={colors.warning} />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
      {reviewCount !== undefined && reviewCount !== null && (
        <Text style={styles.reviewCount}>({reviewCount})</Text>
      )}
    </View>
  );
};
