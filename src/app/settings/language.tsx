import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, Language } from '@/hooks/use-store';
import { Iconify } from '@/components/ui/Iconify';
import { useRouter } from 'expo-router';
import { PageBackground } from '@/components/ui/PageBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useStore();
  const isRTL = language === 'fa';

  const languages: { id: Language; name: string; nativeName: string; flag: string }[] = [
    { id: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
    { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  ];

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      <View style={[styles.header, { paddingTop: insets.top + 16, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Iconify
            icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isRTL ? 'تنظیمات زبان' : 'Language Settings'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'زبان برنامه' : 'App Language'}
          </Text>

          {languages.map((lang) => {
            const isSelected = language === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[styles.langItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => handleSelectLanguage(lang.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.itemLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.flagText}>{lang.flag}</Text>
                  <View style={[styles.textWrap, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.nativeText, { color: colors.text }]}>{lang.nativeName}</Text>
                    <Text style={[styles.nameText, { color: colors.textSecondary }]}>{lang.name}</Text>
                  </View>
                </View>

                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: colors.tint }]}>
                    <Iconify icon="solar:check-read-bold" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <Text style={[styles.infoText, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL
            ? 'تغییر زبان به‌صورت آنی تمام متون و جهت چیدمان برنامه (راست‌چین/چپ‌چین) را به‌روزرسانی می‌کند.'
            : 'Changing language instantly updates all app text and layout directions (RTL/LTR).'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  langItem: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  itemLeft: {
    alignItems: 'center',
    gap: 14,
  },
  flagText: {
    fontSize: 26,
  },
  textWrap: {
    gap: 2,
  },
  nativeText: {
    fontSize: 16,
    fontWeight: '800',
  },
  nameText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    paddingHorizontal: 4,
  },
});
