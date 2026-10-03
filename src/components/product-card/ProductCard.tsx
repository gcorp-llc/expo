import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, AccessibilityInfo } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Product } from '@/constants/mock-data';
import { useStore } from '@/hooks/use-store';

import { ProductImage } from './ProductImage';
import { DiscountBadge } from './DiscountBadge';
import { FavoriteButton } from './FavoriteButton';
import { SaleCountdown } from './SaleCountdown';
import { RatingBadge } from './RatingBadge';
import { PriceSection } from './PriceSection';
import { AddToCartButton } from './AddToCartButton';
import { styles } from './ProductCard.styles';

export interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  flat?: boolean;
  testID?: string;
  style?: any; // To support inline style overrides such as CARD_WIDTH
}

export const ProductCard = ({ product, onPress, flat = false, testID, style: styleOverride }: ProductCardProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { language, favorites, toggleFavorite, addToCart } = useStore();
  const isRTL = language === 'fa';
  const isFavorite = favorites.includes(product.id);

  // Dynamic state to support countdown expiry seamlessly in the UI
  const [saleExpired, setSaleExpired] = useState(false);

  // Animation values for scale-press and shadow adjustment on card tap
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handleExpired = useCallback(() => {
    setSaleExpired(true);
  }, []);

  const hasCountdown = product.hasActiveSale && product.saleEndDate && !saleExpired;
  const hasDiscount = product.discountPercentage && !saleExpired;

  // Accessibility label
  const accessibilityLabel = useMemo(() => {
    const discountText = hasDiscount ? `, ${product.discountPercentage}% off` : '';
    const ratingText = product.rating ? `, Rating ${product.rating} out of 5` : '';
    return `${product.name} by ${product.seller}, $${product.price}${discountText}${ratingText}`;
  }, [product, hasDiscount]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(product.id);
  }, [product.id, toggleFavorite]);

  const handleAddToCart = useCallback(() => {
    addToCart(product.id);
  }, [product.id, addToCart]);

  return (
    <Animated.View style={[styles.containerWrapper, styleOverride, animatedStyle]} testID={testID}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityHint={isRTL ? "دوبار ضربه بزنید برای مشاهده جزئیات محصول" : "Double tap to view product details"}
        style={[
          styles.container,
          {
            backgroundColor: colorScheme === 'light' ? '#FFFFFF' : colors.card,
            borderColor: colors.border,
            borderWidth: flat ? 1 : 0,
            shadowOpacity: flat ? 0 : 0.05,
            elevation: flat ? 0 : 3,
          }
        ]}
      >
        {/* Product Image Section */}
        <ProductImage uri={product.image}>
          {/* Floating Discount Badge */}
          {hasDiscount && (
            <DiscountBadge percentage={product.discountPercentage!} isRTL={isRTL} />
          )}

          {/* Floating Favorite Button */}
          <FavoriteButton
            isFavorite={isFavorite}
            onPress={handleToggleFavorite}
            isRTL={isRTL}
            tintColor={colors.tint}
          />

          {/* Floating Active Countdown Timer */}
          {hasCountdown && (
            <SaleCountdown
              saleEndDate={product.saleEndDate!}
              onExpired={handleExpired}
            />
          )}
        </ProductImage>

        {/* Product Content Details Area */}
        <View style={[styles.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          {/* Product Title */}
          <Text
            style={[styles.title, { color: colorScheme === 'light' ? '#1F2937' : colors.text, textAlign: isRTL ? 'right' : 'left' }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {/* Short Description */}
          {product.description && (
            <Text
              style={[styles.description, { color: colorScheme === 'light' ? '#6B7280' : colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}
              numberOfLines={2}
            >
              {product.description}
            </Text>
          )}

          {/* Rating Badge */}
          <RatingBadge rating={product.rating} reviewCount={product.reviews} />

          {/* Price Section */}
          <PriceSection
            price={product.price}
            oldPrice={hasDiscount ? product.oldPrice : undefined}
            tintColor={colors.tint}
          />

          {/* Add To Cart Button */}
          <AddToCartButton
            onPress={handleAddToCart}
            tintColor={colors.tint}
            isRTL={isRTL}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
