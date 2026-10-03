import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ProductCard.styles';

interface DiscountBadgeProps {
  percentage: number;
  isRTL: boolean;
}

export const DiscountBadge = ({ percentage, isRTL }: DiscountBadgeProps) => {
  return (
    <View
      style={[
        styles.discountBadge,
        isRTL ? { right: 12 } : { left: 12 },
      ]}
    >
      <Text style={styles.discountText}>
        {percentage}%
      </Text>
    </View>
  );
};
