import React, { useEffect, useCallback } from 'react';
import { TouchableOpacity, AccessibilityInfo } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Iconify } from '@/components/ui/Iconify';
import { styles } from './ProductCard.styles';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  isRTL: boolean;
  tintColor: string;
}

export const FavoriteButton = ({ isFavorite, onPress, isRTL, tintColor }: FavoriteButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    // Spring scaling effect
    scale.value = 0.8;
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    onPress();

    // Accessibility announcement
    if (typeof AccessibilityInfo.announceForAccessibility === 'function') {
      AccessibilityInfo.announceForAccessibility(
        isFavorite ? 'Removed from favorites' : 'Added to favorites'
      );
    }
  }, [isFavorite, onPress, scale]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[
        styles.wishlistButton,
        isRTL ? { left: 12 } : { right: 12 },
      ]}
      accessible={true}
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.wishlistCircle, animatedStyle]}>
        <Iconify
          icon={isFavorite ? "solar:heart-angle-bold" : "solar:heart-angle-bold-duotone"}
          size={22}
          color={isFavorite ? "#FF4D4F" : tintColor} // Custom filled heart color or app primary color
        />
      </Animated.View>
    </TouchableOpacity>
  );
};
