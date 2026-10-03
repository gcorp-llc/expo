import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ProductCard.styles';

interface PriceSectionProps {
  price: number;
  oldPrice?: number;
  tintColor: string;
}

export const PriceSection = ({ price, oldPrice, tintColor }: PriceSectionProps) => {
  return (
    <View style={styles.priceContainer}>
      {oldPrice !== undefined && oldPrice !== null && (
        <Text style={styles.oldPrice}>
          ${oldPrice}
        </Text>
      )}
      <Text style={[styles.currentPrice, { color: tintColor }]}>
        ${price}
      </Text>
    </View>
  );
};
