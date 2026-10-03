import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MessageSelectionToolbarProps {
  count: number;
  isRTL: boolean;
  onClear: () => void;
  onDelete: () => void;
  onForward: () => void;
}

export const MessageSelectionToolbar = ({
  count,
  isRTL,
  onClear,
  onDelete,
  onForward
}: MessageSelectionToolbarProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={[styles.container, { backgroundColor: colors.surfaceStrong, bottom: insets.bottom + 20 }]}
    >
      <View style={[styles.inner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={onClear} style={[styles.closeBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
          <Text style={[styles.count, { color: colors.text }]}>{count}</Text>
        </TouchableOpacity>

        <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={onForward} style={styles.actionBtn}>
             <Iconify icon="solar:forward-broken" size={24} color={colors.tint} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
             <Iconify icon="solar:trash-bin-trash-broken" size={24} color={colors.destructive} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 20,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 1000,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeBtn: {
    alignItems: 'center',
    gap: 12,
  },
  count: {
    fontSize: 18,
    fontWeight: '900',
  },
  actions: {
    gap: 12,
  },
  actionBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
