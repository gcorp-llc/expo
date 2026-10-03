import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { useProfileStore } from '@/hooks/use-profile-store';

interface AboutCardProps {
  bio: string;
  isRTL: boolean;
  mode?: 'own' | 'readonly';
}

export const AboutCard = ({ bio, isRTL, mode = 'own' }: AboutCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState(bio);
  const [expanded, setExpanded] = useState(false);

  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { updateProfile } = useProfileStore();

  const isOwn = mode === 'own';

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleSave = () => {
    updateProfile({ bio: tempBio });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempBio(bio);
    setIsEditing(false);
  };

  return (
    <Animated.View
      layout={Layout.springify()}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isRTL ? 'درباره من' : 'About'}
        </Text>
        {isOwn && !isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={[styles.editBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Iconify icon="solar:pen-2-broken" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.editContainer}>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                textAlign: isRTL ? 'right' : 'left'
              }
            ]}
            value={tempBio}
            onChangeText={setTempBio}
            multiline
            maxLength={500}
            autoFocus
          />
          <View style={[styles.charCount, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 10 }}>{tempBio.length}/500</Text>
          </View>
          <View style={[styles.actionButtons, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity onPress={handleCancel} style={[styles.cancelBtn, { borderColor: colors.border }]}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>{isRTL ? 'انصراف' : 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.tint }]}>
              <Text style={styles.saveText}>{isRTL ? 'ذخیره' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <>
          <Text
            numberOfLines={expanded ? undefined : 3}
            style={[styles.bio, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}
          >
            {bio}
          </Text>

          {bio.length > 100 && (
            <TouchableOpacity onPress={toggleExpanded} style={styles.readMore}>
              <Text style={[styles.readMoreText, { color: colors.tint }]}>
                {expanded ? (isRTL ? 'نمایش کمتر' : 'Read Less') : (isRTL ? 'ادامه مطلب' : 'Read More')}
              </Text>
            </TouchableOpacity>
          )}
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
    overflow: 'hidden',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  bio: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  readMore: {
    marginTop: 10,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '800',
  },
  editContainer: {
    gap: 12,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    minHeight: 120,
    fontSize: 14,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  charCount: {
    marginTop: -8,
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  saveBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontWeight: '700',
    fontSize: 14,
  },
});
