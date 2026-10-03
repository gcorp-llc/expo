import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { format, isToday, isYesterday } from 'date-fns';

interface DateSeparatorProps {
  date: string;
  isRTL: boolean;
}

export const DateSeparator = ({ date, isRTL }: DateSeparatorProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const d = new Date(date);

  let label = format(d, 'MMMM d');
  if (isToday(d)) label = isRTL ? 'امروز' : 'Today';
  else if (isYesterday(d)) label = isRTL ? 'دیروز' : 'Yesterday';

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: colors.surface }]}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});
