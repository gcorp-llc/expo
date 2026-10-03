import React from 'react';
import { View, Text } from 'react-native';
import { Iconify } from '@/components/ui/Iconify';
import { styles } from './ProductCard.styles';

interface RatingBadgeProps {
  rating?: number;
  reviewCount?: number;
}

export const RatingBadge = ({ rating, reviewCount }: RatingBadgeProps) => {
  if (rating === undefined || rating === null) {
    return null;
  }

  return (
    <View style={styles.ratingRow}>
      <View style={styles.ratingBadge}>
        <Iconify icon="solar:star-bold" size={12} color="#FFC107" />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
      {reviewCount !== undefined && reviewCount !== null && (
        <Text style={styles.reviewCount}>({reviewCount})</Text>
      )}
    </View>
  );
};
