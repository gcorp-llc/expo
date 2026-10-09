import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
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
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const isOwn = mode === 'own';

  const handleImageOptions = (type: 'avatar' | 'cover') => {
    const title = type === 'avatar'
      ? (isRTL ? 'تصویر آواتار' : 'Avatar Image')
      : (isRTL ? 'تصویر کاور' : 'Cover Image');

    const hasCurrent = type === 'avatar' ? !!avatar : !!image;

    Alert.alert(
      title,
      isRTL ? 'گزینه مورد نظر را انتخاب کنید' : 'Select an option',
      [
        {
          text: isRTL ? 'انتخاب از گالری' : 'Choose from Gallery',
          onPress: () => pickImage(type),
        },
        ...(hasCurrent ? [{
          text: isRTL ? 'حذف تصویر' : 'Remove Image',
          style: 'destructive' as const,
          onPress: () => {
            if (type === 'avatar') {
              updateProfile({ avatar: 'https://i.pravatar.cc/300?u=user' });
            } else {
              updateProfile({ coverImage: undefined });
            }
          }
        }] : []),
        {
          text: isRTL ? 'انصراف' : 'Cancel',
          style: 'cancel' as const,
        }
      ]
    );
  };

  const pickImage = async (type: 'avatar' | 'cover') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        isRTL ? 'عدم دسترسی' : 'Permission Denied',
        isRTL
          ? 'برای تغییر تصویر، لطفاً دسترسی به گالری را در تنظیمات تایید کنید.'
          : 'Please grant gallery permissions in settings to change your image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'avatar') {
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
                [isRTL ? 'left' : 'right']: 16,
              },
            ]}
            onPress={() => handleImageOptions('cover')}
          >
            <Iconify icon="solar:camera-bold" size={20} color={colors.text} />
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
              <Iconify icon="solar:camera-broken" size={24} color="#fff" />
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
            <Iconify icon="solar:camera-bold" size={16} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
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
    bottom: 12,
    right: 12,
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
});
