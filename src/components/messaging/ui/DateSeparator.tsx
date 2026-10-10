import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { format, isToday, isYesterday } from 'date-fns';

interface DateSeparatorProps {
  date: string;
  isRTL: boolean;
}

export const DateSeparator = ({ date, isRTL }: DateSeparatorProps) => {
  const d = new Date(date);

  let label = format(d, 'd MMMM'); // e.g. 6 June / 6 ژوئن
  if (isToday(d)) label = isRTL ? 'امروز' : 'Today';
  else if (isYesterday(d)) label = isRTL ? 'دیروز' : 'Yesterday';

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 14,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(38, 34, 52, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#E0DCF0',
  },
});
