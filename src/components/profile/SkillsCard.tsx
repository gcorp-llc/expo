import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { Skill } from '@/types/profile';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { useProfileStore } from '@/hooks/use-profile-store';

interface SkillsCardProps {
  skills: Skill[];
  isRTL: boolean;
  mode?: 'own' | 'readonly';
}

export const SkillsCard = ({ skills, isRTL, mode = 'own' }: SkillsCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { addSkill, removeSkill } = useProfileStore();

  const isOwn = mode === 'own';

  const handleAdd = () => {
    if (!newSkill.trim()) return;
    addSkill(newSkill.trim());
    setNewSkill('');
  };

  const suggestions = isRTL
    ? ['مدیریت فروش', 'بازاریابی دیجیتال', 'مذاکره', 'پشتیبانی مشتری', 'تحلیل بازار']
    : ['Sales Management', 'Digital Marketing', 'Negotiation', 'Customer Support', 'Market Analysis'];

  return (
    <Animated.View
      layout={Layout.springify()}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isRTL ? 'مهارت‌ها' : 'Skills'}
        </Text>
        {isOwn && (
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={[styles.editBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Iconify icon={isEditing ? "solar:check-read-broken" : "solar:pen-2-broken"} size={16} color={isEditing ? colors.success : colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing && isOwn && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.editSection}>
          <View style={[styles.inputContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={isRTL ? 'افزودن مهارت...' : 'Add a skill...'}
              placeholderTextColor={colors.textSecondary}
              value={newSkill}
              onChangeText={setNewSkill}
              onSubmitEditing={handleAdd}
            />
            <TouchableOpacity onPress={handleAdd} style={[styles.addBtn, { backgroundColor: colors.tint }]}>
              <Iconify icon="solar:add-circle-bold" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.suggestions}>
            <Text style={[styles.suggestionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'پیشنهادی:' : 'Suggested:'}
            </Text>
            <View style={[styles.chipsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {suggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => addSkill(s)}
                  style={[styles.suggestedChip, { borderColor: colors.border, backgroundColor: colors.surface }]}
                >
                  <Text style={[styles.chipText, { color: colors.textSecondary }]}>{s}</Text>
                  <Iconify icon="solar:add-circle-broken" size={14} color={colors.tint} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      )}

      {skills.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'هنوز مهارتی اضافه نشده است.' : 'No skills added yet.'}
          </Text>
        </View>
      ) : (
        <View style={[styles.chipsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {skills.map((skill) => (
            <Animated.View
              layout={Layout.springify()}
              key={skill.id}
              style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>{skill.name}</Text>
              {isEditing && isOwn && (
                <TouchableOpacity onPress={() => removeSkill(skill.id)} style={styles.removeIcon}>
                   <Iconify icon="solar:close-circle-bold" size={16} color={colors.error} />
                </TouchableOpacity>
              )}
            </Animated.View>
          ))}
        </View>
      )}
    </Animated.View>
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
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editSection: {
    marginBottom: 20,
    gap: 16,
  },
  inputContainer: {
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestions: {
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  suggestedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
    borderStyle: 'dashed',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  removeIcon: {
    marginLeft: 4,
  },
  emptyState: {
    paddingVertical: 10,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
