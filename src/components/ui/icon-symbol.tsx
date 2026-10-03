import { Iconify } from '@/components/ui/Iconify';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// This file is a compatibility layer for the old IconSymbol system.
// It now uses Iconify with Solar icons.

const MAPPING = {
  'house.fill': 'solar:home-bold',
  'paperplane.fill': 'solar:plain-bold',
  'chevron.left.forwardslash.chevron.right': 'solar:code-bold',
  'chevron.right': 'solar:alt-arrow-right-bold',
  'heart.fill': 'solar:heart-bold',
  'star.fill': 'solar:star-bold',
  'plus': 'solar:add-square-bold',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: any; // Kept for compatibility
}) {
  return (
    <Iconify
      icon={MAPPING[name]}
      size={size}
      color={color}
      style={style}
    />
  );
}
