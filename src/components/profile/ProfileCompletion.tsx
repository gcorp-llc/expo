import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Animated, { useAnimatedStyle, withTiming, withDelay, Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { Iconify } from '@/components/ui/Iconify';
import { useProfileStore } from '@/hooks/use-profile-store';
import { SelectionModal } from '@/components/ui/SelectionModal';

interface ProfileCompletionProps {
  percentage: number;
  isRTL: boolean;
}

export const ProfileCompletion = ({ percentage, isRTL }: ProfileCompletionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { website, bio, headline, updateProfile } = useProfileStore();

  const [showLocationModal, setShowLocationModal] = useState(false);

  const progressStyle = useAnimatedStyle(() => ({
    width: withDelay(300, withTiming(`${percentage}%`, { duration: 1000 })),
  }));

  const ActionButton = ({ label, icon, onPress }: { label: string; icon: string, onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Iconify icon={icon} size={18} color={colors.tint} />
      <Text style={[styles.actionText, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View
      layout={Layout.springify()}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isRTL ? 'تکمیل پروفایل' : 'Profile Completion'}
          </Text>
          <Text style={[styles.percentage, { color: colors.tint }]}>{percentage}%</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={[styles.editBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Iconify icon={isEditing ? "solar:check-read-broken" : "solar:pen-2-broken"} size={16} color={isEditing ? colors.success : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.progressBg, { backgroundColor: colors.surface }]}>
        <Animated.View style={[styles.progressFill, progressStyle, { backgroundColor: colors.tint }]} />
      </View>

      {isEditing ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.editForm}>
           <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'عنوان حرفه‌ای' : 'Professional Headline'}
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
              value={headline}
              onChangeText={(text) => updateProfile({ headline: text })}
              placeholder={isRTL ? 'مثلا: توسعه‌دهنده React Native' : 'e.g. React Native Developer'}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowLocationModal(true)}
            style={[styles.selector, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
             <Text style={[styles.selectorText, { color: colors.text }]}>{isRTL ? 'انتخاب دسته‌بندی کسب‌وکار' : 'Select Business Category'}</Text>
             <Iconify icon="solar:alt-arrow-down-broken" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <SelectionModal
            isVisible={showLocationModal}
            onClose={() => setShowLocationModal(false)}
            title={isRTL ? 'دسته‌بندی' : 'Category'}
            isRTL={isRTL}
            options={[
              { label: isRTL ? 'تکنولوژی' : 'Technology', value: 'tech' },
              { label: isRTL ? 'طراحی' : 'Design', value: 'design' },
              { label: isRTL ? 'فروشگاه' : 'Shop', value: 'shop' },
            ]}
            onSelect={(val) => console.log(val)}
          />
        </Animated.View>
      ) : (
        <>
          <Text style={[styles.suggestion, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'اطلاعات زیر را اضافه کنید تا پروفایل شما حرفه‌ای‌تر به نظر برسد.' : 'Add the information below to make your profile look more professional.'}
          </Text>

          <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <ActionButton
              label={isRTL ? 'افزودن وب‌سایت' : 'Add Website'}
              icon="solar:link-broken"
              onPress={() => setIsEditing(true)}
            />
            <ActionButton
              label={isRTL ? 'افزودن بیو' : 'Add Bio'}
              icon="solar:notes-broken"
              onPress={() => setIsEditing(true)}
            />
          </View>
        </>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '900',
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  suggestion: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 20,
  },
  actions: {
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  selector: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
