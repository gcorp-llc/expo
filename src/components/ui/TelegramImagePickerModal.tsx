import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Iconify } from '@/components/ui/Iconify';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TelegramImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onPickCamera: () => void;
  onPickGallery: () => void;
  title?: string;
  isRTL?: boolean;
}

export const TelegramImagePickerModal = ({
  visible,
  onClose,
  onPickCamera,
  onPickGallery,
  title,
  isRTL = true,
}: TelegramImagePickerModalProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.sheetContent,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.handle} />
          <Text
            style={[
              styles.sheetTitle,
              { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
            ]}
          >
            {title || (isRTL ? 'انتخاب تصویر' : 'Select Image')}
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                },
              ]}
              onPress={onPickCamera}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.tint + '18' },
                ]}
              >
                <Iconify
                  icon="solar:camera-minimalistic-broken"
                  size={22}
                  color={colors.tint}
                />
              </View>
              <Text style={[styles.optionText, { color: colors.text }]}>
                {isRTL ? 'تصویر از دوربین' : 'Camera Photo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                },
              ]}
              onPress={onPickGallery}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.tint + '18' },
                ]}
              >
                <Iconify
                  icon="solar:gallery-wide-line-duotone"
                  size={22}
                  color={colors.tint}
                />
              </View>
              <Text style={[styles.optionText, { color: colors.text }]}>
                {isRTL ? 'تصویر از گالری' : 'Gallery Photo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    paddingBottom: 32,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 38,
    height: 4,
    backgroundColor: 'rgba(128,128,128,0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
