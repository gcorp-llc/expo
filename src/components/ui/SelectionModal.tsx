import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface Option {
  label: string;
  value: string;
  icon?: string;
}

interface SelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  options: Option[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  title: string;
  isRTL?: boolean;
}

export const SelectionModal = ({
  isVisible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title,
  isRTL = false
}: SelectionModalProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(0, {
        duration: 320,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      opacity.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.quad),
      });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, {
        duration: 240,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 180,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [isVisible, translateY, opacity]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
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
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[
          styles.sheet,
          sheetStyle,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            maxHeight: SCREEN_HEIGHT * 0.55,
            paddingBottom: Math.max(insets.bottom, 16),
          }
        ]}>
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />

          <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Animated.ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    {
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      backgroundColor: isSelected ? colors.tint + '14' : colors.surface,
                      borderColor: isSelected ? colors.tint : colors.border,
                    }
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    {option.icon && (
                      <View style={[styles.iconChip, { backgroundColor: isSelected ? colors.tint + '22' : colors.card }]}>
                        <Iconify icon={option.icon} size={22} color={isSelected ? colors.tint : colors.textSecondary} />
                      </View>
                    )}
                    <Text style={[
                      styles.optionLabel,
                      { color: isSelected ? colors.tint : colors.text, fontWeight: isSelected ? '800' : '600' }
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                  {isSelected && <Iconify icon="solar:check-circle-bold" size={20} color={colors.tint} />}
                </TouchableOpacity>
              );
            })}
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
    opacity: 0.6,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  optionItem: {
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    alignItems: 'center',
    gap: 12,
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 15.5,
  },
});

