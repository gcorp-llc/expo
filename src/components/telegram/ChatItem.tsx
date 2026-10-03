import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Chat } from '@/constants/mock-data';
import { Iconify } from '@/components/ui/Iconify';
import { useStore } from '@/hooks/use-store';

interface ChatItemProps {
  chat: Chat;
  onPress?: () => void;
}

const StatusIcon = ({ chat, colors }: { chat: Chat, colors: any }) => {
  if (chat.unreadCount > 0) return null;
  if (chat.status === 'read') return <Iconify icon="solar:check-read-broken" size={16} color={colors.tint} />;
  if (chat.status === 'sent') return <Iconify icon="solar:check-circle-broken" size={16} color={colors.textSecondary} />;
  if (chat.status === 'pending') return <Iconify icon="solar:clock-circle-broken" size={16} color={colors.textSecondary} />;
  return null;
};

export const ChatItem = ({ chat, onPress }: ChatItemProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { language } = useStore();
  const isRTL = language === 'fa';

  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);

  const avatarColor = useMemo(() => getAvatarColor(chat.name), [chat.name]);

  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.82}>
      <View style={[styles.container, { backgroundColor: colors.surfaceStrong, shadowColor: colors.shadow, borderColor: colors.border }]}> 
        <View style={styles.avatarContainer}>
          {chat.avatar ? (
            <Image source={{ uri: chat.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>{chat.name.charAt(0)}</Text>
            </View>
          )}
          {chat.online && <View style={[styles.onlineBadge, { borderColor: colors.surfaceStrong }]} />}

          {/* Type Badges */}
          {chat.type === 'group' && (
            <View style={[styles.typeBadge, { backgroundColor: colors.tint, borderColor: colors.surfaceStrong }]}>
              <Iconify icon="solar:users-group-rounded-bold" size={10} color="#fff" />
            </View>
          )}
          {chat.type === 'channel' && (
            <View style={[styles.typeBadge, { backgroundColor: '#F59E0B', borderColor: colors.surfaceStrong }]}>
              <Iconify icon="solar:speaker-bold" size={10} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.name, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
              {chat.name}
            </Text>
            <Text style={[styles.time, { color: colors.textSecondary }]}>{chat.time}</Text>
          </View>
          <View style={[styles.footer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.message, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
              {chat.lastMessage}
            </Text>
            <View style={[styles.footerRight, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <StatusIcon chat={chat} colors={colors} />
              {chat.unreadCount > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: colors.tint }]}>
                  <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getAvatarColor = (name: string) => {
  const colors = ['#FF9F0A', '#30D158', '#0A84FF', '#5E5CE6', '#FF375F', '#BF5AF2'];
  const index = name.length % colors.length;
  return colors[index];
};

const createStyles = (colors: any, isRTL: boolean) => StyleSheet.create({
  touchable: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  container: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    paddingHorizontal: 12,
    height: 78,
    borderRadius: 14,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    [isRTL ? 'left' : 'right']: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#32D74B',
    borderWidth: 2,
  },
  typeBadge: {
    position: 'absolute',
    top: -2,
    [isRTL ? 'right' : 'left']: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  content: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 2,
    [isRTL ? 'marginRight' : 'marginLeft']: 12,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    [isRTL ? 'marginLeft' : 'marginRight']: 8,
  },
  time: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    flex: 1,
    [isRTL ? 'marginLeft' : 'marginRight']: 8,
  },
  footerRight: {
    alignItems: 'center',
    gap: 4,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
