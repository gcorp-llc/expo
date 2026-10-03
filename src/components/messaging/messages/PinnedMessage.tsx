import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

interface PinnedMessageProps {
  message: string;
  isRTL: boolean;
  onPress?: () => void;
  onClose?: () => void;
}

export const PinnedMessage = ({ message, isRTL, onPress, onClose }: PinnedMessageProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      style={[
        styles.container,
        {
          borderLeftColor: colors.tint,
          borderLeftWidth: isRTL ? 0 : 3,
          borderRightWidth: isRTL ? 3 : 0,
          borderRightColor: colors.tint,
          backgroundColor: colors.surfaceStrong,
          borderColor: colors.border,
          borderWidth: 1,
        }
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.content} activeOpacity={0.7}>
        <View style={[styles.inner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'پیام سنجاق شده' : 'Pinned Message'}
            </Text>
            <Text style={[styles.message, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
              {message}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Iconify icon="solar:close-circle-broken" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 54,
    marginHorizontal: 12,
    marginTop: 4,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
  },
  message: {
    fontSize: 13,
  },
  closeBtn: {
    padding: 4,
  }
});
