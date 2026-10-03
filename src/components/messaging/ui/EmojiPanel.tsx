import React, { useState, useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

const { width } = Dimensions.get('window');

const RECENT_EMOJIS = ['😊', '😂', '🔥', '❤️', '👍', '🙏', '✨', '🚀', '🥺', '😎', '🙌', '🎉'];
const SECTIONS = [
  { id: 'emoji', icon: 'solar:smile-circle-broken' },
  { id: 'gif', icon: 'solar:videocamera-record-broken' },
  { id: 'sticker', icon: 'solar:ghost-broken' },
];

export const EmojiPanel = ({ onSelect, isRTL }: { onSelect: (emoji: string) => void, isRTL: boolean }) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const [activeSection, setActiveSection] = useState('emoji');

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceStrong }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {SECTIONS.map(section => (
          <TouchableOpacity
            key={section.id}
            onPress={() => setActiveSection(section.id)}
            style={[styles.sectionButton, activeSection === section.id && { borderBottomColor: colors.tint, borderBottomWidth: 2 }]}
          >
            <Iconify icon={section.icon} size={24} color={activeSection === section.id ? colors.tint : colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'اخیر' : 'Recent'}
        </Text>
        <View style={[styles.emojiGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {RECENT_EMOJIS.map((emoji, i) => (
            <TouchableOpacity key={i} onPress={() => onSelect(emoji)} style={styles.emojiItem}>
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    height: 300,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    height: 50,
    borderBottomWidth: 1,
  },
  sectionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  emojiGrid: {
    flexWrap: 'wrap',
    gap: 12,
  },
  emojiItem: {
    width: (width - 32 - 12 * 5) / 6,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 28,
  }
});
