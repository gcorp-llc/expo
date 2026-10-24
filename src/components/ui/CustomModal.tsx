import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useModalStore } from '@/hooks/use-modal-store';
import { Iconify } from '@/components/ui/Iconify';

export const CustomModalProvider = () => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { language } = useStore();
  const isRTL = language === 'fa';

  const { isVisible, options, hideModal } = useModalStore();

  if (!isVisible || !options) return null;

  const {
    title,
    message,
    icon = 'solar:info-circle-bold',
    iconColor,
    buttons = [{ text: isRTL ? 'تایید' : 'OK', style: 'primary' }],
  } = options;

  const defaultIconColor = iconColor || colors.tint;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={hideModal}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hideModal} />

        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {icon && (
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: defaultIconColor + '18' },
              ]}
            >
              <Iconify icon={icon} size={36} color={defaultIconColor} />
            </View>
          )}

          <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>
            {title}
          </Text>

          {message && (
            <Text style={[styles.message, { color: colors.textSecondary, textAlign: 'center' }]}>
              {message}
            </Text>
          )}

          <View style={[styles.buttonsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {buttons.map((btn, index) => {
              const isDestructive = btn.style === 'destructive';
              const isPrimary = btn.style === 'primary' || (!btn.style && buttons.length === 1);

              let btnBg = colors.surface;
              let btnText = colors.text;
              let btnBorder = colors.border;

              if (isDestructive) {
                btnBg = colors.destructive + '15';
                btnText = colors.destructive;
                btnBorder = colors.destructive + '30';
              } else if (isPrimary) {
                btnBg = colors.tint;
                btnText = '#FFFFFF';
                btnBorder = colors.tint;
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    {
                      backgroundColor: btnBg,
                      borderColor: btnBorder,
                    },
                  ]}
                  onPress={() => {
                    hideModal();
                    if (btn.onPress) {
                      btn.onPress();
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.buttonText, { color: btnText }]}>
                    {btn.text}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20,
  },
  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonsContainer: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
