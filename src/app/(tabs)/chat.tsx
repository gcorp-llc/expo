import React, { useMemo, useState, useCallback } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import { Colors } from '@/constants/theme';
import { ChatItem } from '@/components/telegram/ChatItem';
import { CHATS } from '@/constants/mock-data';
import { useStore } from '@/hooks/use-store';
import { useProfileStore } from '@/hooks/use-profile-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { GuestRestrictionOverlay } from '@/components/ui/GuestRestrictionOverlay';
import { FlashList } from '@shopify/flash-list';
import { Iconify } from '@/components/ui/Iconify';
import { PageBackground } from '@/components/ui/PageBackground';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import { FilterDropdown } from '@/components/chat/FilterDropdown';
import { FAB } from '@/components/telegram/FAB';

type ChatType = 'all' | 'personal' | 'group' | 'channel';

export default function ChatScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, isGuest, hasEnteredDemoMode } = useStore();
  const { blockedUserIds } = useProfileStore();
  const isRTL = language === 'fa';

  const [activeTab, setActiveTab] = useState<ChatType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const filteredChats = useMemo(() => CHATS.filter((chat) => {
    // 1. Filter out blocked users
    const isBlocked = blockedUserIds.includes(chat.id);
    if (isBlocked) return false;

    // 2. Filter by tab category
    const matchesTab = activeTab === 'all' || chat.type === activeTab;

    // 3. Filter by search query
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  }), [activeTab, searchQuery, blockedUserIds]);

  const renderItem = useCallback(({ item }: any) => (
    <ChatItem
      chat={item}
      onPress={() => router.push(`/chat/${item.id}`)}
    />
  ), [router]);

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 50], [1, 0.95], Extrapolate.CLAMP),
      transform: [
        { translateY: interpolate(scrollY.value, [0, 100], [0, -2], Extrapolate.CLAMP) }
      ]
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />
      {isGuest && !hasEnteredDemoMode && (
        <GuestRestrictionOverlay
          icon={<Iconify icon="solar:chat-square-bold" width={42} height={42} color={colors.tint} />}
          title={isRTL ? 'پیام‌ها' : 'Messages'}
          description={isRTL ? 'برای گفتگو با فروشندگان و استفاده از امکانات چت، لطفاً ثبت‌نام کنید.' : 'To chat with sellers and use messaging features, please sign up.'}
        />
      )}

      {/* Floating Header */}
      <Animated.View style={[
        styles.floatingHeader,
        headerStyle,
        { top: insets.top + 10, flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}>
        <View style={styles.floatingBtnWrapper}>
          <FloatingIconButton
            icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
            onPress={() => router.back()}
            size={46}
          />
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Iconify icon="solar:magnifer-broken" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder={isRTL ? 'جستجو در گفتگوها...' : 'Search chats...'}
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.floatingBtnWrapper}>
          <FloatingIconButton
            icon="solar:settings-minimalistic-broken"
            onPress={() => setIsFilterModalVisible(true)}
            size={46}
          />
        </View>
      </Animated.View>

      <FlashList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        estimatedItemSize={86}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 80,
          paddingBottom: 120
        }}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Iconify icon="solar:chat-square-broken" size={64} color={colors.textSecondary} style={{ opacity: 0.2 }} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {isRTL ? 'گفتگویی یافت نشد' : 'No conversations found'}
            </Text>
          </View>
        }
      />

      <FAB />

      <FilterDropdown
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        selectedValue={activeTab}
        onSelect={(val) => setActiveTab(val as ChatType)}
        isRTL={isRTL}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
    height: 46,
    alignItems: 'center',
    gap: 10,
  },
  floatingBtnWrapper: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    paddingHorizontal: 15,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    padding: 0,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  }
});
