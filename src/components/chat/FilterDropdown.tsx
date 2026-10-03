import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform, Animated, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

interface FilterDropdownProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  selectedValue: string;
  isRTL: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const FilterDropdown = ({ visible, onClose, onSelect, selectedValue, isRTL }: FilterDropdownProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const options = [
    { value: 'all', label: isRTL ? 'همه' : 'All', icon: 'solar:chat-round-line-bold' },
    { value: 'personal', label: isRTL ? 'چت‌های شخصی' : 'Private Chats', icon: 'solar:user-bold' },
    { value: 'group', label: isRTL ? 'گروه‌ها' : 'Groups', icon: 'solar:users-group-rounded-bold' },
    { value: 'channel', label: isRTL ? 'کانال‌ها' : 'Channels', icon: 'solar:speaker-bold' },
  ];

  const handleSelect = (val: string) => {
    onSelect(val);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY }],
              backgroundColor: colors.card,
              borderColor: colors.border,
              paddingBottom: insets.bottom + 20,
            }
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <Text style={[styles.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'فیلتر گفتگوها' : 'Filter Chats'}
          </Text>

          <View style={styles.optionsContainer}>
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    {
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      backgroundColor: isSelected ? colors.tint + '10' : 'transparent',
                      borderColor: isSelected ? colors.tint + '30' : 'transparent',
                    }
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: isSelected ? colors.tint : colors.surface, borderColor: colors.border }]}>
                     <Iconify icon={option.icon} size={20} color={isSelected ? '#fff' : colors.textSecondary} />
                  </View>
                  <Text style={[
                    styles.label,
                    {
                      color: isSelected ? colors.tint : colors.text,
                      textAlign: isRTL ? 'right' : 'left'
                    }
                  ]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Iconify icon="solar:check-read-bold" size={20} color={colors.tint} />
                  )}
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
    opacity: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 8,
  },
  optionItem: {
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 16,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700'
  },
});
