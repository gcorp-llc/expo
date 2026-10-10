import React, { useState, useRef, useMemo } from 'react';
import { Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { ReplyPreview } from '../messages/ReplyPreview';
import { EmojiPanel } from './EmojiPanel';

interface ChatInputProps {
  onSend: (text: string) => void;
  isRTL: boolean;
  placeholder?: string;
  onTyping?: () => void;
  replyTo?: { name: string, message: string } | null;
  onCancelReply?: () => void;
}

export const ChatInput = ({
  onSend,
  isRTL,
  placeholder,
  onTyping,
  replyTo,
  onCancelReply
}: ChatInputProps) => {
  const colorScheme = ((useColorScheme() ?? 'light') as 'light' | 'dark') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleChangeText = (val: string) => {
    setText(val);
    if (val.length > 0) {
      onTyping?.();
    }
  };

  const toggleEmoji = () => {
    if (showEmoji) {
      inputRef.current?.focus();
    } else {
      Keyboard.dismiss();
    }
    setShowEmoji(!showEmoji);
  };

  const handleEmojiSelect = (emoji: string) => {
    setText(prev => prev + emoji);
  };

  return (
    <View style={styles.container}>
      {replyTo && (
        <View style={styles.replyWrapper}>
          <ReplyPreview
            name={replyTo.name}
            message={replyTo.message}
            isRTL={isRTL}
            onClose={onCancelReply || (() => {})}
          />
        </View>
      )}

      <View style={[styles.inner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleEmoji}>
            <Iconify
              icon={showEmoji ? "solar:keyboard-broken" : "solar:smile-circle-broken"}
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={placeholder || (isRTL ? 'پیام...' : 'Message...')}
            placeholderTextColor={colors.textSecondary}
            multiline
            value={text}
            onChangeText={handleChangeText}
            onFocus={() => setShowEmoji(false)}
            maxLength={1000}
          />

          <TouchableOpacity style={styles.iconButton}>
            <Iconify icon="solar:paperclip-broken" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={text.trim().length > 0 ? handleSend : undefined}
          activeOpacity={0.8}
          style={[
            styles.sendButton,
            {
              backgroundColor: text.trim().length > 0 ? colors.tint : colors.card,
              borderColor: text.trim().length > 0 ? colors.tint : colors.border,
            },
          ]}
        >
          <Iconify
            icon={text.trim().length > 0 ? "solar:plain-bold" : "solar:microphone-broken"}
            size={22}
            color={text.trim().length > 0 ? "#FFFFFF" : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {showEmoji && (
        <EmojiPanel onSelect={handleEmojiSelect} isRTL={isRTL} />
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 12,
  },
  replyWrapper: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    marginBottom: -1,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  inner: {
    alignItems: 'flex-end',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 6,
    alignItems: 'flex-end',
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 8,
    maxHeight: 120, // Approx 5 lines
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  }
});
