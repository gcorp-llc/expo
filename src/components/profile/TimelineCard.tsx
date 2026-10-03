import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { TimelineEvent } from '@/types/profile';

interface TimelineCardProps {
  events: TimelineEvent[];
  isRTL: boolean;
}

export const TimelineCard = ({ events, isRTL }: TimelineCardProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
        {isRTL ? 'گاه‌شمار فعالیت' : 'Activity Timeline'}
      </Text>

      <View style={styles.timeline}>
        {events.map((event, i) => (
          <View key={event.id} style={[styles.eventRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.indicatorCol}>
              <View style={[styles.dot, { backgroundColor: colors.tint }]} />
              {i !== events.length - 1 && <View style={[styles.line, { backgroundColor: colors.border }]} />}
            </View>

            <View style={[styles.contentCol, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <View style={[styles.eventHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Iconify icon={event.icon} size={16} color={colors.textSecondary} />
                <Text style={[styles.eventTitle, { color: colors.text, marginHorizontal: 8 }]}>{event.title}</Text>
              </View>
              <Text style={[styles.eventDate, { color: colors.textSecondary }]}>{event.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    borderRadius: 28,
    padding: Spacing.xl,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
  },
  timeline: {
    gap: 0,
  },
  eventRow: {
    gap: 16,
  },
  indicatorCol: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -2,
    marginBottom: -6,
  },
  contentCol: {
    flex: 1,
    paddingBottom: 24,
  },
  eventHeader: {
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  eventDate: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
});
