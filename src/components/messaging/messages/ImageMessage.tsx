import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Message } from '@/types/messaging';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ImageMessageProps {
  message: Message;
  isMe: boolean;
}

export const ImageMessage = ({ message, isMe }: ImageMessageProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { uri, width, height } = message.metadata || {};

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <ExpoImage
        source={{ uri }}
        style={[
          styles.image,
          {
            aspectRatio: (width && height) ? width / height : 1,
            backgroundColor: colors.surface
          }
        ]}
        contentFit="cover"
        transition={300}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 300,
  },
  image: {
    width: '100%',
  },
});
