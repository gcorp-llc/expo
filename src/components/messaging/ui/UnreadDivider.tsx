import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface UnreadDividerProps {
  isRTL: boolean;
}

export const UnreadDivider = ({ isRTL }: UnreadDividerProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: `${colors.tint}40` }]} />
      <View style={[styles.badge, { backgroundColor: `${colors.tint}15` }]}>
        <Text style={[styles.text, { color: colors.tint }]}>
          {isRTL ? 'پیام‌های نخوانده' : 'Unread Messages'}
        </Text>
      </View>
      <View style={[styles.line, { backgroundColor: `${colors.tint}40` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  text: {
    fontSize: 12,
    fontWeight: '900',
  }
});
