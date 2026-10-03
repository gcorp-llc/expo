import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

interface ReplyPreviewProps {
  name: string;
  message: string;
  isRTL: boolean;
  onClose: () => void;
}

export const ReplyPreview = ({ name, message, isRTL, onClose }: ReplyPreviewProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={[
      styles.container,
      {
        borderLeftColor: colors.tint,
        borderLeftWidth: isRTL ? 0 : 3,
        borderRightWidth: isRTL ? 3 : 0,
        borderRightColor: colors.tint,
        backgroundColor: `${colors.tint}10`
      }
    ]}>
      <View style={[styles.inner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.iconWrapper}>
          <Iconify icon="solar:reply-bold" size={16} color={colors.tint} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>{name}</Text>
          <Text style={[styles.message, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>{message}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Iconify icon="solar:close-circle-broken" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  inner: {
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    padding: 4,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '800',
  },
  message: {
    fontSize: 13,
  },
  closeBtn: {
    padding: 4,
  }
});
