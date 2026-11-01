import React from 'react';
import { Platform, StyleProp, ViewStyle, View } from 'react-native';
import { BlurView, BlurViewProps } from 'expo-blur';

let NativeGlassView: any = null;
if (Platform.OS === 'ios') {
  try {
    NativeGlassView = require('expo-glass-effect').GlassView;
  } catch {
    NativeGlassView = null;
  }
}

export interface SafeGlassViewProps {
  intensity?: number;
  tint?: BlurViewProps['tint'];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const SafeGlassView: React.FC<SafeGlassViewProps> = ({
  intensity = 50,
  tint = 'default',
  style,
  children,
}) => {
  if (Platform.OS === 'ios' && NativeGlassView) {
    return (
      <NativeGlassView style={style}>
        {children}
      </NativeGlassView>
    );
  }

  // Cross-platform fallback for Android & Web using expo-blur
  return (
    <BlurView intensity={intensity} tint={tint} style={style}>
      {children}
    </BlurView>
  );
};
