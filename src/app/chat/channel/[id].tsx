import React, { useMemo, useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useStore } from '@/hooks/use-store';
import { ChannelHeader } from '@/components/messaging/headers/ChannelHeader';
import { useMessagingStore } from '@/hooks/use-messaging-store';
import { ChatWallpaper } from '@/components/messaging/layout/ChatWallpaper';

export default function ChannelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { language } = useStore();
  const isRTL = language === 'fa';
  const [searchQuery, setSearchQuery] = useState('');

  const { conversations } = useMessagingStore();
  const conversation = conversations[id as string];

  if (!conversation) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ChatWallpaper type="pattern" />
      <ChannelHeader
        conversation={conversation}
        isRTL={isRTL}
        onBack={() => router.back()}
        onSearch={setSearchQuery}
      />
      <View style={styles.content}>
        <Text style={{ color: colors.textSecondary }}>
          {isRTL ? 'پیام‌های کانال در اینجا نمایش داده می‌شوند.' : 'Channel messages will appear here.'}
        </Text>
        {searchQuery ? (
          <Text style={{ color: colors.tint, marginTop: 10 }}>
            {isRTL ? `جستجو برای: ${searchQuery}` : `Searching for: ${searchQuery}`}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
