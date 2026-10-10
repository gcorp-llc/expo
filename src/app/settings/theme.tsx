import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, ThemeMode } from '@/hooks/use-store';
import { Iconify } from '@/components/ui/Iconify';
import { useRouter } from 'expo-router';
import { PageBackground } from '@/components/ui/PageBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ThemeSettingsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, themeMode, setThemeMode } = useStore();
  const isRTL = language === 'fa';

  const themes: { id: ThemeMode; labelFa: string; labelEn: string; icon: string; descFa: string; descEn: string }[] = [
    {
      id: 'light',
      labelFa: 'روشن (Light)',
      labelEn: 'Light',
      icon: 'solar:sun-broken',
      descFa: 'رابط کاربری روشن با کنتراست بالا و شفافیت روز',
      descEn: 'Bright interface with high contrast for daytime',
    },
    {
      id: 'dark',
      labelFa: 'تاریک (Dark)',
      labelEn: 'Dark',
      icon: 'solar:moon-broken',
      descFa: 'طراحی تیره و مدرن مناسب محیط‌های کم‌نور و کاهش خستگی چشم',
      descEn: 'Sleek dark design reducing eye strain in low light',
    },
    {
      id: 'system',
      labelFa: 'پیروی از سیستم (System)',
      labelEn: 'System Default',
      icon: 'solar:settings-minimalistic-broken',
      descFa: 'هماهنگی خودکار با حالت تاریک/روشن تنظیمات دستگاه شما',
      descEn: 'Automatically syncs with your OS theme preference',
    },
  ];

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
          {isRTL ? 'تنظیمات پوسته و ظاهر' : 'Theme Settings'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'انتخاب حالت نمایش' : 'Display Mode'}
          </Text>

          {themes.map((theme) => {
            const isSelected = themeMode === theme.id;
            return (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: isSelected ? colors.tint + '10' : colors.surface,
                    borderColor: isSelected ? colors.tint : colors.border,
                  },
                ]}
                onPress={() => setThemeMode(theme.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.optionContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.iconBox, { backgroundColor: isSelected ? colors.tint : colors.card }]}>
                    <Iconify icon={theme.icon} size={22} color={isSelected ? '#FFFFFF' : colors.text} />
                  </View>
                  <View style={[styles.textWrap, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.themeLabel, { color: colors.text }]}>
                      {isRTL ? theme.labelFa : theme.labelEn}
                    </Text>
                    <Text style={[styles.themeDesc, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                      {isRTL ? theme.descFa : theme.descEn}
                    </Text>
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
    gap: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  themeOption: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionContent: {
    flex: 1,
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  themeDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
