import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Message } from '@/types/messaging';
import { format } from 'date-fns';
import { Iconify } from '@/components/ui/Iconify';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

// Sub-components
import { ImageMessage } from './ImageMessage';
import { VoiceMessage } from './VoiceMessage';
import { PollMessage } from './PollMessage';
import { SystemMessage } from './SystemMessage';

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
  const colorScheme = ((useColorScheme() ?? 'dark') as 'light' | 'dark');
  const colors = Colors[colorScheme];

  if (message.type === 'system') {
    return <SystemMessage message={message} />;
  }

  const getTime = () => {
    try {
      return format(new Date(message.timestamp), 'h:mm a');
    } catch (e) {
      return '12:00 PM';
    }
  };

  const getStatusIcon = () => {
    if (!isMe) return null;
    switch (message.status) {
      case 'sending': return 'solar:clock-circle-broken';
      case 'sent': return 'solar:check-read-broken';
      case 'delivered': return 'solar:check-read-broken';
      case 'read': return 'solar:check-read-bold';
      default: return 'solar:check-read-broken';
    }
  };

  const isDark = colorScheme === 'dark';

  // Telegram / Reference UI Bubble Colors
  // Outgoing: Violet/Purple theme (#614D8F)
  // Incoming: Dark Slate (#2B2839)
  const outgoingBg = '#614D8F';
  const incomingBg = isDark ? '#2B2839' : '#332F45';
  const textColor = '#FFFFFF';

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
                color: textColor,
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
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderBottomLeftRadius: isMe ? 18 : (isRTL ? 18 : 4),
      borderBottomRightRadius: isMe ? (isRTL ? 4 : 18) : 18,
    }
  ];

  return (
    <Animated.View
      entering={isMe ? FadeInUp.duration(250) : FadeInDown.duration(250)}
      style={[styles.container, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
    >
      {!isMe && (
        <View style={styles.avatarSpace}>
          {showAvatar && <View style={[styles.avatarPlaceholder, { backgroundColor: '#3A364E' }]} />}
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.85}
        onLongPress={onLongPress}
        style={bubbleStyle as any}
      >
        {renderContent()}

        <View style={[styles.infoRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={styles.time}>
            {getTime()}
          </Text>
          {isMe && (
            <Iconify
              icon={getStatusIcon() || ''}
              size={14}
              color="#B3A6DC"
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
    marginVertical: 3,
    paddingHorizontal: 12,
    width: '100%',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    minWidth: 90,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  text: {
    fontSize: 15.5,
    lineHeight: 23,
    fontWeight: '400',
  },
  infoRow: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  avatarSpace: {
    width: 30,
    marginRight: 6,
    justifyContent: 'flex-end',
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
  }
});
