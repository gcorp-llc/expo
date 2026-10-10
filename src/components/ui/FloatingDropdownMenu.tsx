import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Iconify } from '@/components/ui/Iconify';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface DropdownOption {
  value: string;
  label: string;
  icon: string;
  isDestructive?: boolean;
}

interface FloatingDropdownMenuProps {
  isVisible: boolean;
  onClose: () => void;
  headerTitle?: string;
  headerIcon?: string;
  onHeaderPress?: () => void;
  options: DropdownOption[];
  onSelectOption: (value: string) => void;
  isRTL?: boolean;
  topOffset?: number;
}

export const FloatingDropdownMenu = ({
  isVisible,
  onClose,
  headerTitle,
  headerIcon,
  onHeaderPress,
  options,
  onSelectOption,
  isRTL = true,
  topOffset,
}: FloatingDropdownMenuProps) => {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const calculatedTop = topOffset ?? insets.top + 50;

  useEffect(() => {
    if (isVisible) {
      scale.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: 180,
        easing: Easing.out(Easing.quad),
      });
    } else {
      scale.value = withTiming(0.9, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [isVisible, scale, opacity]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[
            styles.menuCard,
            cardAnimatedStyle,
            {
              top: calculatedTop,
              [isRTL ? 'right' : 'left']: 16,
            },
          ]}
        >
          {headerTitle && (
            <>
              <TouchableOpacity
                style={[
                  styles.headerRow,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
                onPress={() => {
                  onHeaderPress?.();
                  onClose();
                }}
                activeOpacity={0.7}
              >
                {/* Right side in RTL (Header Icon + Title) */}
                <View
                  style={[
                    styles.headerRightGroup,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  {headerIcon && (
                    <Iconify icon={headerIcon} size={22} color="#FFFFFF" />
                  )}
                  <Text style={styles.headerTitle}>{headerTitle}</Text>
                </View>

                {/* Left side in RTL (Back arrow) */}
                <Iconify
                  icon={
                    isRTL
                      ? 'solar:alt-arrow-left-broken'
                      : 'solar:alt-arrow-right-broken'
                  }
                  size={18}
                  color="#A3A0B5"
                />
              </TouchableOpacity>
              <View style={styles.divider} />
            </>
          )}

          <View style={styles.optionsList}>
            {options.map((item) => {
              const textColor = item.isDestructive ? '#FF5252' : '#FFFFFF';
              const iconColor = item.isDestructive ? '#FF5252' : '#C3C1D0';

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionRow,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                  onPress={() => {
                    onSelectOption(item.value);
                    onClose();
                  }}
                  activeOpacity={0.65}
                >
                  {/* Icon sits on the right side in RTL */}
                  <Iconify icon={item.icon} size={22} color={iconColor} />

                  <Text
                    style={[
                      styles.optionLabel,
                      { color: textColor, textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  menuCard: {
    position: 'absolute',
    width: Math.min(SCREEN_WIDTH * 0.72, 280),
    backgroundColor: '#282535',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 16,
    zIndex: 9999,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRightGroup: {
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 4,
  },
  optionsList: {
    paddingVertical: 2,
  },
  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});
