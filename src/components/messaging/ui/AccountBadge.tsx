import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { UserType } from '@/types/messaging';

interface AccountBadgeProps {
  type: UserType;
  isVerified?: boolean;
  size?: number;
}

export const AccountBadge = ({ type, isVerified, size = 16 }: AccountBadgeProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  if (isVerified) {
    return <Iconify icon="solar:verified-check-bold" size={size} color={colors.tint} />;
  }

  switch (type) {
    case 'bot':
      return (
        <View style={[styles.badge, { backgroundColor: `${colors.tint}20` }]}>
          <Text style={[styles.text, { color: colors.tint }]}>BOT</Text>
        </View>
      );
    case 'business':
      return <Iconify icon="solar:shop-bold" size={size} color={colors.warning} />;
    case 'premium':
      return <Iconify icon="solar:star-bold" size={size} color={colors.warning} />;
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  text: {
    fontSize: 9,
    fontWeight: '900',
  }
});
