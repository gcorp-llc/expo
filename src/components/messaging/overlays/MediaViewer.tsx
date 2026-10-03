import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface MediaViewerProps {
  isVisible: boolean;
  onClose: () => void;
  uri?: string;
  type?: 'image' | 'video';
}

export const MediaViewer = ({ isVisible, onClose, uri, type = 'image' }: MediaViewerProps) => {
  const insets = useSafeAreaInsets();

  if (!uri) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.95)' }]} />

        <View style={[styles.header, { top: insets.top }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Iconify icon="solar:close-circle-broken" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.mediaContainer}>
          <ExpoImage
            source={{ uri }}
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>

        <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Iconify icon="solar:download-broken" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Iconify icon="solar:share-broken" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Iconify icon="solar:forward-broken" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.8,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
