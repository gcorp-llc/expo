import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Alert, TextInput } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { Conversation } from '@/types/messaging';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { SelectionModal, Option } from '@/components/ui/SelectionModal';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface ChannelHeaderProps {
  conversation: Conversation;
  isRTL: boolean;
  onBack: () => void;
  onSearch?: (query: string) => void;
}

export const ChannelHeader = ({ conversation, isRTL, onBack, onSearch }: ChannelHeaderProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMuteModalVisible, setIsMuteModalVisible] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);

  const menuOptions: Option[] = useMemo(() => [
    { value: 'info', label: isRTL ? 'اطلاعات کانال' : 'Channel Info', icon: 'solar:info-circle-broken' },
    { value: 'mute', label: isRTL ? 'بی‌صدا کردن' : 'Mute Notifications', icon: 'solar:bell-broken' },
    { value: 'leave', label: isRTL ? 'ترک کانال' : 'Leave Channel', icon: 'solar:exit-outline' },
  ], [isRTL]);

  const muteOptions: Option[] = useMemo(() => [
    { value: '1h', label: isRTL ? '۱ ساعت' : 'Mute for 1 hour' },
    { value: '8h', label: isRTL ? '۸ ساعت' : 'Mute for 8 hours' },
    { value: '2d', label: isRTL ? '۲ روز' : 'Mute for 2 days' },
    { value: 'forever', label: isRTL ? 'غیرفعال کردن صدا' : 'Disable Sound' },
  ], [isRTL]);

  const handleMenuSelect = (val: string) => {
    if (val === 'mute') {
      setIsMuteModalVisible(true);
    } else if (val === 'leave') {
      Alert.alert(
        isRTL ? 'ترک کانال' : 'Leave Channel',
        isRTL ? 'آیا از ترک این کانال اطمینان دارید؟' : 'Are you sure you want to leave this channel?',
        [{ text: isRTL ? 'لغو' : 'Cancel', style: 'cancel' }, { text: isRTL ? 'ترک کانال' : 'Leave', style: 'destructive' }]
      );
    }
  };

  const handleToggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
      onSearch?.('');
    }
  };

  return (
    <View style={[styles.outerContainer, { top: insets.top + 10 }]}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 100}
        tint={colorScheme}
        style={[
          styles.container,
          {
            backgroundColor: colorScheme === 'dark' ? 'rgba(44, 44, 46, 0.8)' : 'rgba(241, 242, 244, 0.8)',
            borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }
        ]}
      >
        {isSearchActive ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.searchContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
             <TouchableOpacity onPress={handleToggleSearch} style={styles.iconButton}>
               <Iconify icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'} size={24} color={colors.text} />
             </TouchableOpacity>
             <TextInput
               autoFocus
               placeholder={isRTL ? 'جستجو...' : 'Search...'}
               placeholderTextColor={colors.textSecondary}
               style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
               value={searchQuery}
               onChangeText={(text) => {
                 setSearchQuery(text);
                 onSearch?.(text);
               }}
             />
          </Animated.View>
        ) : (
          <>
            <TouchableOpacity onPress={onBack} style={styles.iconButton}>
              <Iconify icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'} size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={[styles.infoArea, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.avatarWrapper, { backgroundColor: colors.surface }]}>
                {conversation.metadata?.avatar ? (
                  <Image source={{ uri: conversation.metadata.avatar }} style={styles.avatar} />
                ) : (
                  <Iconify icon="solar:transmission-broken" size={24} color={colors.textSecondary} />
                )}
              </View>
              <View style={[styles.textContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{conversation.metadata?.name}</Text>
                <Text style={[styles.subText, { color: colors.tint }]}>{conversation.metadata?.memberCount?.toLocaleString()} {isRTL ? 'دنبال‌کننده' : 'subscribers'}</Text>
              </View>
            </View>

            <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
               <TouchableOpacity onPress={handleToggleSearch} style={styles.iconButton}>
                <Iconify icon="solar:magnifer-broken" size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.iconButton}>
                <Iconify icon="solar:menu-dots-broken" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </BlurView>

      <SelectionModal
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        title={conversation.metadata?.name || ''}
        options={menuOptions}
        onSelect={handleMenuSelect}
        isRTL={isRTL}
      />

      <SelectionModal
        isVisible={isMuteModalVisible}
        onClose={() => setIsMuteModalVisible(false)}
        title={isRTL ? 'بی‌صدا کردن' : 'Mute Notifications'}
        options={muteOptions}
        onSelect={(val) => setIsMuteModalVisible(false)}
        isRTL={isRTL}
      />
    </View>
  );
};

const createStyles = (colors: any, isRTL: boolean) => StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 100,
  },
  container: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoArea: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  subText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: -2,
  },
  actions: {
    gap: 2,
  },
  searchContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    height: '100%',
  },
});
