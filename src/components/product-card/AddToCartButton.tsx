import React, { useCallback } from 'react';
import { Text, Pressable, Platform, AccessibilityInfo } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Iconify } from '@/components/ui/Iconify';
import { styles } from './ProductCard.styles';

interface AddToCartButtonProps {
  onPress: () => void;
  tintColor: string;
  isRTL: boolean;
}

export const AddToCartButton = ({ onPress, tintColor, isRTL }: AddToCartButtonProps) => {
  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
    if (typeof AccessibilityInfo.announceForAccessibility === 'function') {
      AccessibilityInfo.announceForAccessibility('Added to cart');
    }
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }: { pressed: boolean }) => [
        styles.cartButton,
        {
          backgroundColor: tintColor,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          opacity: pressed && Platform.OS === 'ios' ? 0.85 : 1,
        },
      ]}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
      accessible={true}
      accessibilityLabel={isRTL ? "افزودن به سبد خرید" : "Add to Cart"}
      accessibilityRole="button"
    >
      <Iconify icon="solar:cart-large-minimalistic-broken" size={20} color="#FFFFFF" />
      <Text style={styles.cartButtonText}>
        {isRTL ? "افزودن به سبد خرید" : "Add to Cart"}
      </Text>
    </Pressable>
  );
};
