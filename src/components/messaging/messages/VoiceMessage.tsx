import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Iconify } from '@/components/ui/Iconify';
import { Message } from '@/types/messaging';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface VoiceMessageProps {
  message: Message;
  isMe: boolean;
}

export const VoiceMessage = ({ message, isMe }: VoiceMessageProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const [isPlaying, setIsPlaying] = useState(false);
  const waveform = message.metadata?.waveform || Array.from({ length: 20 }, () => Math.random());

  return (
    <View style={[styles.container, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
      <TouchableOpacity
        onPress={() => setIsPlaying(!isPlaying)}
        style={[
          styles.playButton,
          {
            backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : `${colors.tint}15`
          }
        ]}
      >
        <Iconify icon={isPlaying ? 'solar:pause-bold' : 'solar:play-bold'} size={24} color={isMe ? '#FFF' : colors.tint} />
      </TouchableOpacity>

      <View style={styles.waveformContainer}>
        {waveform.map((val: number, i: number) => (
          <View
            key={i}
            style={[
              styles.waveBar,
              {
                height: 4 + val * 20,
                backgroundColor: isMe ? 'rgba(255,255,255,0.4)' : `${colors.textSecondary}40`
              }
            ]}
          />
        ))}
      </View>

      <Text style={[styles.duration, { color: isMe ? '#FFF' : colors.textSecondary }]}>
        {message.metadata?.duration || '0:00'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 200,
    paddingVertical: 4,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 30,
  },
  waveBar: {
    width: 2,
    borderRadius: 1,
  },
  duration: {
    fontSize: 12,
    fontWeight: '600',
  }
});
