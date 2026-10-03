import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { styles } from './ProductCard.styles';

interface ProductImageProps {
  uri: string;
  children?: React.ReactNode;
}

export const ProductImage = ({ uri, children }: ProductImageProps) => {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        accessible={false}
      />
      {children}
    </View>
  );
};
