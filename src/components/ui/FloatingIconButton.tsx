import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

interface FloatingIconButtonProps {
  icon: string;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
}

export const FloatingIconButton = ({
  icon,
  onPress,
  size = 42,
  iconSize = 22,
  color,
  backgroundColor,
  style,
  activeOpacity = 0.8,
}: FloatingIconButtonProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor || colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
        style,
      ]}
    >
      <Iconify
        icon={icon}
        size={iconSize}
        color={color || colors.text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
