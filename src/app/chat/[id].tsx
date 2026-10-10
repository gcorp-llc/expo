import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useStore } from '@/hooks/use-store';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { isSameDay } from 'date-fns';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

// UI Components
import { MessagingHeader } from '@/components/messaging/headers/MessagingHeader';
import { ChatInput } from '@/components/messaging/ui/ChatInput';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import { MessageBubble } from '@/components/messaging/messages/MessageBubble';
import { DateSeparator } from '@/components/messaging/ui/DateSeparator';
import { PinnedMessage } from '@/components/messaging/messages/PinnedMessage';
import { ChatWallpaper } from '@/components/messaging/layout/ChatWallpaper';
import { MediaViewer } from '@/components/messaging/overlays/MediaViewer';
import { FloatingDropdownMenu, DropdownOption } from '@/components/ui/FloatingDropdownMenu';
import { SelectionModal, Option } from '@/components/ui/SelectionModal';

// Logic
import { useMessagingStore } from '@/hooks/use-messaging-store';
import MessagingService from '@/services/MessagingService';

export default function ChatDetailScreen() {
  const searchParams = useLocalSearchParams<{
    id: string;
    productId?: string;
    productTitle?: string;
    productPrice?: string;
    productImage?: string;
    sellerName?: string;
  }>();
  const chatId = searchParams.id;
  const { productId, productTitle, productPrice, productImage } = searchParams;
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { language } = useStore();
  const isRTL = language === 'fa';

  const insets = useSafeAreaInsets();
  const messagingService = MessagingService.getInstance();
  const { conversations, messages: allMessages } = useMessagingStore();
  const conversation = conversations[chatId as string];
  const messages = useMemo(() => allMessages[chatId as string] || [], [allMessages, chatId]);

  const flashListRef = useRef<any>(null);
  const [replyTo, setReplyTo] = useState<{ name: string; message: string } | null>(null);
  const [showPinned, setShowPinned] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMuteModalVisible, setIsMuteModalVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [wallpaperType, setWallpaperType] = useState<'solid' | 'pattern'>('pattern');
  const [searchQuery, setSearchQuery] = useState('');

  const scrollY = useSharedValue(0);
  const showJumpToBottom = useSharedValue(0);

  const title = useMemo(() => {
    return conversation?.metadata?.name || (isRTL ? 'دکتر ویدا شکیبا' : 'Dr. Vida Shakiba');
  }, [conversation, isRTL]);

  const avatarUri = useMemo(() => {
    return conversation?.metadata?.avatar || `https://i.pravatar.cc/300?u=${chatId}`;
  }, [conversation, chatId]);

  const subtitle = useMemo(() => {
    return (conversation?.metadata as any)?.status || (isRTL ? 'آخرین بازدید 06 اکتبر در 11:28 AM' : 'Last seen Oct 06 at 11:28 AM');
  }, [conversation, isRTL]);

  const pinnedMsg = useMemo(() => {
    return messages.find(m => m.isPinned)?.content || (isRTL ? 'این پیام سنجاق شده است.' : 'This is a pinned message.');
  }, [messages, isRTL]);

  const handleSend = (text: string) => {
    messagingService.sendMessage(chatId as string, text);
    setReplyTo(null);
    setTimeout(() => {
      flashListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleTyping = () => {
    messagingService.simulateTyping(chatId as string, 'me');
  };

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    const threshold = 500;
    const contentHeight = event.contentSize.height;
    const layoutHeight = event.layoutMeasurement.height;
    const scrollFromBottom = contentHeight - layoutHeight - event.contentOffset.y;

    if (scrollFromBottom > threshold) {
      showJumpToBottom.value = withSpring(1);
    } else {
      showJumpToBottom.value = withSpring(0);
    }
  });

  const jumpToBottomStyle = useAnimatedStyle(() => ({
    transform: [{ scale: showJumpToBottom.value }],
    opacity: showJumpToBottom.value,
  }));

  const handleJumpToBottom = () => {
    flashListRef.current?.scrollToEnd({ animated: true });
  };

  const handleMediaPress = useCallback((uri: string, type: 'image' | 'video') => {
    setSelectedMedia({ uri, type });
  }, []);

  // Dropdown options matching Image 2
  const chatDropdownOptions: DropdownOption[] = useMemo(() => [
    { value: 'search', label: isRTL ? 'جستجو' : 'Search', icon: 'solar:magnifer-broken' },
    { value: 'wallpaper', label: isRTL ? 'تغییر پس‌زمینه' : 'Change Background', icon: 'solar:widget-2-broken' },
    { value: 'clear', label: isRTL ? 'پاک کردن تاریخچه' : 'Clear History', icon: 'solar:broom-broken' },
    { value: 'delete', label: isRTL ? 'حذف گفتگو' : 'Delete Chat', icon: 'solar:trash-bin-trash-broken' },
  ], [isRTL]);

  const muteOptions: Option[] = useMemo(() => [
    { value: '1h', label: isRTL ? '۱ ساعت' : 'Mute for 1 hour' },
    { value: '8h', label: isRTL ? '۸ ساعت' : 'Mute for 8 hours' },
    { value: '2d', label: isRTL ? '۲ روز' : 'Mute for 2 days' },
    { value: 'forever', label: isRTL ? 'غیرفعال کردن صدا' : 'Disable Sound' },
  ], [isRTL]);

  const handleMenuSelect = (val: string) => {
    if (val === 'search') {
      // Handled via state or header toggle
    } else if (val === 'wallpaper') {
      setWallpaperType(prev => (prev === 'pattern' ? 'solid' : 'pattern'));
      Alert.alert(
        isRTL ? 'تغییر پس‌زمینه' : 'Change Background',
        isRTL ? 'پس‌زمینه چت تغییر یافت.' : 'Chat wallpaper has been updated.'
      );
    } else if (val === 'clear') {
      Alert.alert(
        isRTL ? 'پاک کردن تاریخچه' : 'Clear History',
        isRTL ? 'آیا از پاک کردن تمام پیام‌های این گفتگو اطمینان دارید؟' : 'Are you sure you want to clear all messages in this chat?',
        [
          { text: isRTL ? 'لغو' : 'Cancel', style: 'cancel' },
          {
            text: isRTL ? 'پاک کن' : 'Clear',
            style: 'destructive',
            onPress: () => {
              Alert.alert(isRTL ? 'تاریخچه پاک شد' : 'History cleared');
            }
          }
        ]
      );
    } else if (val === 'delete') {
      Alert.alert(
        isRTL ? 'حذف گفتگو' : 'Delete Chat',
        isRTL ? 'آیا از حذف کامل این گفتگو اطمینان دارید؟' : 'Are you sure you want to delete this chat?',
        [
          { text: isRTL ? 'لغو' : 'Cancel', style: 'cancel' },
          {
            text: isRTL ? 'حذف' : 'Delete',
            style: 'destructive',
            onPress: () => {
              router.back();
            }
          }
        ]
      );
    }
  };

  const handleMuteHeaderPress = () => {
    setIsMuteModalVisible(true);
  };

  const handleCall = () => {
    Alert.alert(
      isRTL ? 'تماس صوتی' : 'Voice Call',
      isRTL ? `در حال برقراری تماس با ${title}...` : `Calling ${title}...`,
      [{ text: isRTL ? 'بستن' : 'Close', style: 'cancel' }]
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const prevMsg = messages[index - 1];
    const nextMsg = messages[index + 1];

    const showDateSeparator = !prevMsg || !isSameDay(new Date(item.timestamp), new Date(prevMsg.timestamp));
    const isLastInGroup = !nextMsg || nextMsg.senderId !== item.senderId || !isSameDay(new Date(item.timestamp), new Date(nextMsg.timestamp));

    if (searchQuery && !item.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return null;
    }

    return (
      <View>
        {showDateSeparator && <DateSeparator date={item.timestamp} isRTL={isRTL} />}
        <MessageBubble
          message={item}
          isMe={item.senderId === 'me' || item.senderId === useMessagingStore.getState().currentUser?.id}
          isRTL={isRTL}
          showAvatar={item.senderId !== 'me' && isLastInGroup}
          onLongPress={() => {
            setReplyTo({ name: title, message: item.content });
          }}
          onPressMedia={handleMediaPress}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#1A1825' }]}>
      <ChatWallpaper type={wallpaperType} />

      <MessagingHeader
        title={title}
        subtitle={subtitle}
        avatarUri={avatarUri}
        isRTL={isRTL}
        showBack
        onBack={() => router.back()}
        onMore={() => setIsMenuVisible(true)}
        onCall={handleCall}
        onTitlePress={() => router.push(`/user/${chatId}`)}
        onSearch={setSearchQuery}
      />

      {showPinned && !searchQuery && (
        <View style={[styles.pinnedContainer, { top: insets.top + 70 }]}>
          {productTitle ? (
            <View style={[styles.productContextCard, { backgroundColor: '#282535', borderColor: 'rgba(255,255,255,0.1)' }]}>
              {productImage ? (
                <Image source={{ uri: productImage }} style={styles.productContextImage} contentFit="cover" />
              ) : null}
              <View style={[styles.productContextInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.productContextLabel, { color: colors.tint }]}>
                  {isRTL ? 'گفتگو درباره محصول:' : 'Inquiry about product:'}
                </Text>
                <Text style={[styles.productContextTitle, { color: '#FFFFFF' }]} numberOfLines={1}>
                  {productTitle}
                </Text>
                {productPrice ? (
                  <Text style={[styles.productContextPrice, { color: '#A09CBA' }]}>
                    ${Number(productPrice).toLocaleString()}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => setShowPinned(false)} style={{ padding: 4 }}>
                <Iconify icon="solar:close-circle-broken" size={20} color="#A09CBA" />
              </TouchableOpacity>
            </View>
          ) : (
            <PinnedMessage
              message={pinnedMsg}
              isRTL={isRTL}
              onClose={() => setShowPinned(false)}
            />
          )}
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.flex}>
          <AnimatedFlashList
            ref={flashListRef}
            data={messages}
            keyExtractor={(item: any) => item.id}
            renderItem={renderItem}
            {...({ estimatedItemSize: 100 } as any)}
            contentContainerStyle={[styles.listContent, { paddingTop: searchQuery ? insets.top + 80 : insets.top + 130 }]}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          />

          <Animated.View style={[styles.jumpButtonContainer, jumpToBottomStyle, { [isRTL ? 'left' : 'right']: 20 }]}>
            <FloatingIconButton
              icon="solar:alt-arrow-down-broken"
              onPress={handleJumpToBottom}
              size={48}
              iconSize={24}
              color={colors.tint}
            />
          </Animated.View>
        </View>

        <ChatInput
          onSend={handleSend}
          isRTL={isRTL}
          onTyping={handleTyping}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </KeyboardAvoidingView>

      <MediaViewer
        isVisible={!!selectedMedia}
        uri={selectedMedia?.uri}
        type={selectedMedia?.type}
        onClose={() => setSelectedMedia(null)}
      />

      <FloatingDropdownMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        headerTitle={isRTL ? (isMuted ? 'صدا وصل شد' : 'بی‌صدا') : 'Mute'}
        headerIcon="solar:speaker-bold-duotone"
        onHeaderPress={handleMuteHeaderPress}
        options={chatDropdownOptions}
        onSelectOption={handleMenuSelect}
        isRTL={isRTL}
        topOffset={insets.top + 54}
      />

      <SelectionModal
        isVisible={isMuteModalVisible}
        onClose={() => setIsMuteModalVisible(false)}
        title={isRTL ? 'بی‌صدا کردن notifications' : 'Mute Notifications'}
        options={muteOptions}
        onSelect={(val) => {
          setIsMuted(true);
          setIsMuteModalVisible(false);
          Alert.alert(isRTL ? 'اعلانات بی‌صدا شد' : 'Notifications muted');
        }}
        isRTL={isRTL}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pinnedContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 90,
  },
  productContextCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  productContextImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  productContextInfo: {
    flex: 1,
  },
  productContextLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  productContextTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  productContextPrice: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  jumpButtonContainer: {
    position: 'absolute',
    bottom: 20,
    zIndex: 10,
  },
});
