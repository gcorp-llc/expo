import React from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import { Iconify } from '@/components/ui/Iconify';

let NativeSymbolView: any = null;
if (Platform.OS === 'ios') {
  try {
    NativeSymbolView = require('expo-symbols').SymbolView;
  } catch {
    NativeSymbolView = null;
  }
}

const SF_TO_SOLAR_MAP: Record<string, string> = {
  'house.fill': 'solar:home-bold',
  'house': 'solar:home-broken',
  'paperplane.fill': 'solar:plain-bold',
  'paperplane': 'solar:plain-broken',
  'chevron.left.forwardslash.chevron.right': 'solar:code-bold',
  'chevron.right': 'solar:alt-arrow-right-bold',
  'chevron.left': 'solar:alt-arrow-left-bold',
  'heart.fill': 'solar:heart-bold',
  'heart': 'solar:heart-broken',
  'star.fill': 'solar:star-bold',
  'star': 'solar:star-broken',
  'plus': 'solar:add-square-bold',
  'gear': 'solar:settings-minimalistic-broken',
  'bell.fill': 'solar:bell-bold',
  'bell': 'solar:bell-broken',
  'magnifyingglass': 'solar:magnifer-broken',
  'person.fill': 'solar:user-bold',
  'person': 'solar:user-broken',
};

export interface SafeSymbolProps {
  name: string;
  size?: number;
  tintColor?: string;
  fallbackSolarIcon?: string;
  style?: StyleProp<ViewStyle>;
  weight?: string;
  scale?: string;
}

export const SafeSymbolView: React.FC<SafeSymbolProps> = ({
  name,
  size = 24,
  tintColor = '#000000',
  fallbackSolarIcon,
  style,
  ...rest
}) => {
  if (Platform.OS === 'ios' && NativeSymbolView) {
    return (
      <NativeSymbolView
        name={name}
        size={size}
        tintColor={tintColor}
        style={style}
        {...rest}
      />
    );
  }

  const solarIcon = fallbackSolarIcon || SF_TO_SOLAR_MAP[name] || 'solar:question-circle-bold';
  return <Iconify icon={solarIcon} size={size} color={tintColor} style={style} />;
};
