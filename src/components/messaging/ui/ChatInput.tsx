import React, { useState, useRef, useMemo } from 'react';
import { Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Iconify } from '@/components/ui/Iconify';
import { ReplyPreview } from '../messages/ReplyPreview';
import { EmojiPanel } from './EmojiPanel';

interface ChatInputProps {
  onSend: (text: string) => void;
  isRTL: boolean;
  placeholder?: string;
  onTyping?: () => void;
  replyTo?: { name: string; message: string } | null;
  onCancelReply?: () => void;
}

export const ChatInput = ({
  onSend,
  isRTL,
  placeholder,
  onTyping,
  replyTo,
  onCancelReply,
}: ChatInputProps) => {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<TextInput>(null);

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
    setText((prev) => prev + emoji);
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
        <View
          style={[
            styles.inputContainer,
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <TouchableOpacity style={styles.iconButton} onPress={toggleEmoji} activeOpacity={0.7}>
            <Iconify
              icon={showEmoji ? 'solar:keyboard-broken' : 'solar:smile-circle-broken'}
              size={24}
              color="#A09CBA"
            />
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={placeholder || (isRTL ? 'پیام' : 'Message')}
            placeholderTextColor="#8C88A6"
            multiline
            value={text}
            onChangeText={handleChangeText}
            onFocus={() => setShowEmoji(false)}
            maxLength={1000}
          />

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Iconify icon="solar:paperclip-broken" size={24} color="#A09CBA" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={text.trim().length > 0 ? handleSend : undefined}
          activeOpacity={0.8}
          style={styles.actionButton}
        >
          <Iconify
            icon={text.trim().length > 0 ? 'solar:plain-bold' : 'solar:camera-broken'}
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {showEmoji && <EmojiPanel onSelect={handleEmojiSelect} isRTL={isRTL} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    paddingTop: 6,
  },
  replyWrapper: {
    backgroundColor: '#282535',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: -1,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  inner: {
    alignItems: 'center',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    minHeight: 50,
    borderRadius: 25,
    backgroundColor: '#282535',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 15.5,
    color: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 8,
    maxHeight: 120,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#614D8F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
