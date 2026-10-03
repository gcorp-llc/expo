import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { Achievement } from '@/types/profile';

interface AchievementsCardProps {
  achievements: Achievement[];
  isRTL: boolean;
}

export const AchievementsCard = ({ achievements, isRTL }: AchievementsCardProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
        {isRTL ? 'دستاوردها' : 'Achievements'}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.list, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      >
        {achievements.map((ach) => (
          <View key={ach.id} style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.tint + '15' }]}>
              <Iconify icon={ach.icon} size={24} color={colors.tint} />
            </View>
            <Text style={[styles.achTitle, { color: colors.text }]}>{ach.title}</Text>
            <Text style={[styles.achDesc, { color: colors.textSecondary }]}>{ach.description}</Text>
          </View>
        ))}
      </ScrollView>
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
  list: {
    gap: 12,
  },
  item: {
    width: 140,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  achTitle: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  achDesc: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
});
