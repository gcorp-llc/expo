import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ChatLayout() {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="[id]" />
      <Stack.Screen name="group/[id]" />
      <Stack.Screen name="channel/[id]" />
      <Stack.Screen name="calls/voice" />
      <Stack.Screen name="calls/video" />
      <Stack.Screen name="contacts" />
      <Stack.Screen name="group/create-members" />
      <Stack.Screen name="group/create-details" />
      <Stack.Screen name="channel/create-details" />
      <Stack.Screen name="channel/create-settings" />
    </Stack>
  );
}
