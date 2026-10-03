import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Message } from '@/types/messaging';
import Animated, { FadeIn } from 'react-native-reanimated';

interface SystemMessageProps {
  message: Message;
}

export const SystemMessage = ({ message }: SystemMessageProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: colors.surface }]}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {message.content}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 40,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  }
});
