import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Message } from '@/types/messaging';
import { format } from 'date-fns';
import { Iconify } from '@/components/ui/Iconify';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

// Sub-components
import { ImageMessage } from './ImageMessage';
import { VoiceMessage } from './VoiceMessage';
import { PollMessage } from './PollMessage';
import { SystemMessage } from './SystemMessage';

function shadeColor(hex: string, percent: number) {
  if (!hex || hex[0] !== '#') return hex;
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  isRTL: boolean;
  showAvatar?: boolean;
  onLongPress?: () => void;
  onReply?: () => void;
  onPressMedia?: (uri: string, type: 'image' | 'video') => void;
}

const MessageBubbleComponent = ({
  message,
  isMe,
  isRTL,
  showAvatar,
  onLongPress,
  onPressMedia
}: MessageBubbleProps) => {
  const colorScheme = ((useColorScheme() ?? 'light') as 'light' | 'dark') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  if (message.type === 'system') {
    return <SystemMessage message={message} />;
  }

  const getTime = () => {
    try {
      return format(new Date(message.timestamp), 'HH:mm');
    } catch (e) {
      return '00:00';
    }
  };

  const getStatusIcon = () => {
    if (!isMe) return null;
    switch (message.status) {
      case 'sending': return 'solar:clock-circle-broken';
      case 'sent': return 'solar:check-circle-bold';
      case 'delivered': return 'solar:check-read-broken';
      case 'read': return 'solar:check-read-bold';
      default: return 'solar:check-read-bold';
    }
  };

  const getStatusColor = () => {
    if (colorScheme === 'dark') {
      return '#61B752';
    }
    return '#4FA800';
  };

  const isDark = colorScheme === 'dark';

  // Telegram signature colors:
  // Outgoing: #EFFDDE (light mode) / #2B5278 (dark mode)
  // Incoming: #FFFFFF (light mode) / #182533 (dark mode)
  const outgoingBg = isDark ? '#2B5278' : '#EFFDDE';
  const incomingBg = isDark ? '#182533' : '#FFFFFF';
  const outgoingTextColor = isDark ? '#FFFFFF' : '#000000';
  const incomingTextColor = isDark ? '#F5F5F5' : '#000000';

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <TouchableOpacity onPress={() => onPressMedia?.(message.metadata?.uri, 'image')} activeOpacity={0.9}>
            <ImageMessage message={message} isMe={isMe} />
          </TouchableOpacity>
        );
      case 'voice':
        return <VoiceMessage message={message} isMe={isMe} />;
      case 'poll':
        return <PollMessage message={message} isMe={isMe} />;
      default:
        return (
          <Text
            style={[
              styles.text,
              {
                color: isMe ? outgoingTextColor : incomingTextColor,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          >
            {message.content}
          </Text>
        );
    }
  };

  const bubbleStyle = [
    styles.bubble,
    {
      backgroundColor: isMe ? outgoingBg : incomingBg,
      alignSelf: isMe ? (isRTL ? 'flex-start' : 'flex-end') : (isRTL ? 'flex-end' : 'flex-start'),
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: isMe ? 16 : (isRTL ? 16 : 4),
      borderBottomRightRadius: isMe ? (isRTL ? 4 : 16) : 16,
      borderWidth: isDark ? 0 : 0.5,
      borderColor: isDark ? 'transparent' : 'rgba(0,0,0,0.08)',
    }
  ];

  return (
    <Animated.View
      entering={isMe ? FadeInUp.duration(300) : FadeInDown.duration(300)}
      style={[styles.container, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
    >
      {!isMe && (
        <View style={styles.avatarSpace}>
          {showAvatar && <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surface }]} />}
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={onLongPress}
        style={bubbleStyle as any}
      >
        {isMe && (
          <LinearGradient
            colors={[colors.tint, shadeColor(colors.tint, -18)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {renderContent()}

        <View style={[styles.infoRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text
            style={[
              styles.time,
              { color: isMe ? (isDark ? 'rgba(255,255,255,0.7)' : '#538250') : colors.textSecondary },
            ]}
          >
            {getTime()}
          </Text>
          {isMe && (
            <Iconify
              icon={getStatusIcon() || ''}
              size={15}
              color={getStatusColor()}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const MessageBubble = React.memo(MessageBubbleComponent);
MessageBubble.displayName = 'MessageBubble';

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 12,
    width: '100%',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 85,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  infoRow: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 6,
  },
  time: {
    fontSize: 11,
    fontWeight: '700',
  },
  avatarSpace: {
    width: 32,
    marginRight: 8,
    justifyContent: 'flex-end',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
  }
});
