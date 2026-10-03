import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProfileProduct } from '@/types/profile';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ProfileProductCardProps {
  product: ProfileProduct;
  isRTL?: boolean;
}

export const ProfileProductCard = ({ product, isRTL }: ProfileProductCardProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
          <TouchableOpacity style={[styles.favoriteBtn, { backgroundColor: 'rgba(255,255,255,0.8)' }]}>
            <Iconify
              icon={product.isFavorite ? "solar:heart-bold" : "solar:heart-broken"}
              size={18}
              color={product.isFavorite ? colors.destructive : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {product.title}
          </Text>

          <View style={[styles.footer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.price, { color: colors.tint }]}>{product.price}</Text>
            <View style={[styles.rating, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:star-bold" size={12} color="#FBBF24" />
              <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{product.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 12,
    fontWeight: '900',
  },
  rating: {
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
