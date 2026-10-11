import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native';
import { useModalStore } from '@/hooks/use-modal-store';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Iconify } from '@/components/ui/Iconify';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProfileStore } from '@/hooks/use-profile-store';

interface CoverSectionProps {
  image?: string;
  avatar: string;
  isVerified: boolean;
  isOpenToWork: boolean;
  coverStyle: any;
  isRTL: boolean;
  mode?: 'own' | 'readonly';
}

export const CoverSection = ({
  image,
  avatar,
  isVerified,
  isOpenToWork,
  coverStyle,
  isRTL,
  mode = 'own'
}: CoverSectionProps) => {
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [pickerType, setPickerType] = useState<'avatar' | 'cover'>('cover');
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const showModal = useModalStore((state) => state.showModal);

  const isOwn = mode === 'own';

  const handleImageOptions = (type: 'avatar' | 'cover') => {
    setPickerType(type);
    setPickerModalVisible(true);
  };

  const pickFromCamera = async () => {
    setPickerModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showModal({
        title: isRTL ? 'عدم دسترسی به دوربین' : 'Permission Denied',
        message: isRTL
          ? 'برای ثبت تصویر با دوربین، دسترسی مربوطه را در تنظیمات تایید نمایید.'
          : 'Please grant camera permission in settings.',
        icon: 'solar:danger-circle-bold',
        iconColor: colors.destructive,
        buttons: [{ text: isRTL ? 'متوجه شدم' : 'Got it', style: 'primary' }]
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: pickerType === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      if (pickerType === 'avatar') {
        updateProfile({ avatar: result.assets[0].uri });
      } else {
        updateProfile({ coverImage: result.assets[0].uri });
      }
    }
  };

  const pickFromGallery = async () => {
    setPickerModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      showModal({
        title: isRTL ? 'عدم دسترسی به گالری' : 'Permission Denied',
        message: isRTL
          ? 'برای تغییر تصویر، لطفاً دسترسی به گالری را در تنظیمات دستگاه تایید کنید.'
          : 'Please grant gallery permissions in settings to change your image.',
        icon: 'solar:danger-circle-bold',
        iconColor: colors.destructive,
        buttons: [{ text: isRTL ? 'متوجه شدم' : 'Got it', style: 'primary' }]
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: pickerType === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      if (pickerType === 'avatar') {
        updateProfile({ avatar: result.assets[0].uri });
      } else {
        updateProfile({ coverImage: result.assets[0].uri });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.coverContainer, coverStyle]}>
        {image ? (
          <Image source={{ uri: image }} style={styles.coverImage} contentFit="cover" />
        ) : (
          <LinearGradient
            colors={[colors.tint + '80', colors.success + '40']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.coverGradient}
          />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={StyleSheet.absoluteFill}
        />

        {isOwn && (
          <TouchableOpacity
            style={[
              styles.coverEditButton,
              {
                backgroundColor: colors.surface + 'EE',
                bottom: 12,
                [isRTL ? 'left' : 'right']: 16,
              },
            ]}
            onPress={() => handleImageOptions('cover')}
          >
            <Iconify icon="solar:camera-minimalistic-broken" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </Animated.View>

      <View style={[styles.avatarWrapper, { [isRTL ? 'right' : 'left']: Spacing.xl }]}>
        <View style={[styles.avatarContainer, { borderColor: colors.background, backgroundColor: colors.surface }]}>
          <Image source={{ uri: avatar }} style={styles.avatar} />

          {isOwn && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleImageOptions('avatar')}
              style={styles.avatarOverlay}
            >
              <Iconify icon="solar:camera-minimalistic-broken" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          {isVerified && (
            <View style={[styles.verifiedBadge, { backgroundColor: '#3B82F6', borderColor: colors.background }]}>
              <Iconify icon="solar:verified-check-bold" size={14} color="#fff" />
            </View>
          )}
          <View style={[styles.onlineStatus, { backgroundColor: colors.success, borderColor: colors.background }]} />
        </View>

        {isOwn && (
          <TouchableOpacity
            onPress={() => handleImageOptions('avatar')}
            activeOpacity={0.85}
            style={[
              styles.avatarCameraButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                [isRTL ? 'left' : 'right']: 2,
              },
            ]}
          >
            <Iconify icon="solar:camera-minimalistic-broken" size={16} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Requirement 12: Strictly 2 options modal without cancel button */}
      <Modal visible={pickerModalVisible} transparent animationType="slide" onRequestClose={() => setPickerModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPickerModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
              {pickerType === 'avatar'
                ? (isRTL ? 'تغییر تصویر اواتار' : 'Update Avatar')
                : (isRTL ? 'تغییر تصویر کاور' : 'Update Cover Image')}
            </Text>

            <View style={{ gap: 10, marginTop: 14 }}>
              <TouchableOpacity
                style={[styles.twoOptionBtn, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={pickFromCamera}
              >
                <Iconify icon="solar:camera-minimalistic-broken" size={24} color={colors.tint} />
                <Text style={[styles.twoOptionText, { color: colors.text }]}>
                  {isRTL ? 'تصویر از دوربین' : 'Camera Photo'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.twoOptionBtn, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={pickFromGallery}
              >
                <Iconify icon="solar:gallery-wide-line-duotone" size={24} color={colors.tint} />
                <Text style={[styles.twoOptionText, { color: colors.text }]}>
                  {isRTL ? 'تصویر از گالری' : 'Gallery Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    width: '100%',
    zIndex: 10,
  },
  coverContainer: {
    height: 180,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    width: '100%',
    height: '100%',
  },
  coverEditButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: 0,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  avatarCameraButton: {
    position: 'absolute',
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, borderWidth: 1 },
  modalTitle: { fontSize: 17, fontWeight: '900' },
  twoOptionBtn: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  twoOptionText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
