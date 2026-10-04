import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './ProductCard.styles';

interface ProductImageProps {
  uri: string;
  children?: React.ReactNode;
  cardBgColor?: string;
}

export const ProductImage = ({ uri, children, cardBgColor }: ProductImageProps) => {
  const gradientColor = cardBgColor || '#FFFFFF';

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        accessible={false}
      />
      {/* Soft blurred transition connecting image to card body */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.05)', gradientColor]}
        locations={[0.5, 0.8, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </View>
  );
};
