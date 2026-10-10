import React, { useCallback } from 'react';
import { Text, Pressable, Platform, AccessibilityInfo } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Iconify } from '@/components/ui/Iconify';
import { styles } from './ProductCard.styles';

interface AddToCartButtonProps {
  onPress: () => void;
  tintColor: string;
  isRTL: boolean;
  isInCart?: boolean;
}

export const AddToCartButton = ({ onPress, tintColor, isRTL, isInCart = false }: AddToCartButtonProps) => {
  const handlePress = useCallback(() => {
    if (isInCart) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
    if (typeof AccessibilityInfo.announceForAccessibility === 'function') {
      AccessibilityInfo.announceForAccessibility('Added to cart');
    }
  }, [onPress, isInCart]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={isInCart}
      style={({ pressed }: { pressed: boolean }) => [
        styles.cartButton,
        {
          backgroundColor: isInCart ? '#10B981' : tintColor,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          opacity: isInCart ? 0.85 : (pressed && Platform.OS === 'ios' ? 0.85 : 1),
        },
      ]}
      android_ripple={isInCart ? null : { color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
      accessible={true}
      accessibilityLabel={
        isInCart
          ? (isRTL ? "در سبد خرید قرار دارد" : "In Cart")
          : (isRTL ? "افزودن به سبد خرید" : "Add to Cart")
      }
      accessibilityRole="button"
    >
      <Iconify
        icon={isInCart ? "solar:check-circle-bold" : "solar:cart-large-minimalistic-broken"}
        size={20}
        color="#FFFFFF"
      />
      <Text style={styles.cartButtonText}>
        {isInCart
          ? (isRTL ? "در سبد خرید" : "In Cart")
          : (isRTL ? "افزودن به سبد خرید" : "Add to Cart")}
      </Text>
    </Pressable>
  );
};
