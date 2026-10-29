import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Colors, IRANIAN_TRADITIONAL_COLORS, APP_FONT_OPTIONS, IranianColor, FontOption } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, ThemeMode, AppFontFamily } from '@/hooks/use-store';
import { Iconify } from '@/components/ui/Iconify';
import { useRouter } from 'expo-router';
import { PageBackground } from '@/components/ui/PageBackground';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Persian digit conversion helper
const toPersianDigits = (n: number | string): string => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

export default function ThemeSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const {
    language,
    themeMode,
    setThemeMode,
    selectedColorTheme,
    setSelectedColorTheme,
    fontFamily,
    setFontFamily,
    fontSizeLevel,
    setFontSizeLevel,
  } = useStore();

  const isRTL = language === 'fa';

  // Telegram-style theme transition animation
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const rippleX = useSharedValue(screenWidth / 2);
  const rippleY = useSharedValue(300);
  const rippleColor = useSharedValue(colors.tint);

  const triggerThemeTransition = (
    targetColor: string,
    event?: any,
    callback?: () => void
  ) => {
    let px = screenWidth / 2;
    let py = 300;
    if (event?.nativeEvent) {
      px = event.nativeEvent.pageX || px;
      py = event.nativeEvent.pageY || py;
    }

    rippleX.value = px;
    rippleY.value = py;
    rippleColor.value = targetColor;

    rippleScale.value = 0;
    rippleOpacity.value = 0.75;

    if (callback) {
      callback();
    }

    rippleScale.value = withTiming(5, {
      duration: 450,
      easing: Easing.out(Easing.quad),
    });
    rippleOpacity.value = withTiming(0, {
      duration: 450,
      easing: Easing.out(Easing.quad),
    });
  };

  const animatedRippleStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: rippleX.value - 120,
      top: rippleY.value - 120,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: rippleColor.value,
      transform: [{ scale: rippleScale.value }],
      opacity: rippleOpacity.value,
      zIndex: 9999,
    };
  });

  // Responsive column calculation
  let numColumns = 2;
  if (screenWidth >= 800) {
    numColumns = 4;
  } else if (screenWidth >= 550) {
    numColumns = 3;
  }

  // Calculate item width inside card padding
  const outerPadding = 20;
  const cardPadding = 16;
  const gap = 10;
  const cardContentWidth = screenWidth - (outerPadding * 2) - (cardPadding * 2);
  const colorItemWidth = Math.max(130, Math.floor((cardContentWidth - gap * (numColumns - 1)) / numColumns));

  const displayModes: { id: ThemeMode; labelFa: string; labelEn: string; icon: string }[] = [
    { id: 'light', labelFa: 'روشن', labelEn: 'Light', icon: 'solar:sun-broken' },
    { id: 'dark', labelFa: 'تاریک', labelEn: 'Dark', icon: 'solar:moon-broken' },
    { id: 'system', labelFa: 'سیستم', labelEn: 'System', icon: 'solar:settings-minimalistic-broken' },
  ];

  const fontSizePresets = [
    { level: 7, labelFa: 'کوچک', labelEn: 'Small' },
    { level: 9, labelFa: 'استاندارد', labelEn: 'Standard' },
    { level: 11, labelFa: 'بزرگ', labelEn: 'Large' },
    { level: 13, labelFa: 'خیلی بزرگ', labelEn: 'Extra Large' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {/* Telegram-style smooth theme ripple overlay */}
      <Animated.View style={animatedRippleStyle} pointerEvents="none" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <FloatingIconButton
          icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
          onPress={() => router.back()}
        />
        <View style={styles.headerTextWrap}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'شخصی‌سازی' : 'Customization'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {isRTL ? 'شخصی‌سازی، پوسته و اعلانات' : 'Customization & Themes'}
          </Text>
        </View>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Display Mode Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: colors.tint + '18' }]}>
              <Iconify icon="solar:magic-stick-broken" size={20} color={colors.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'رنگ‌بندی' : 'Display Mode'}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'حالت نمایش' : 'Display Mode'}
              </Text>
            </View>
          </View>

          {/* Mode Switcher Pills */}
          <View style={[styles.modeContainer, { backgroundColor: colors.secondaryBackground, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {displayModes.map((mode) => {
              const isSelected = themeMode === mode.id;
              return (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.modeButton,
                    isSelected && [
                      styles.modeButtonActive,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.tint,
                      },
                    ],
                  ]}
                  onPress={(e) => {
                    const previewColor = mode.id === 'light' ? '#6366F1' : mode.id === 'dark' ? '#3B82F6' : colors.tint;
                    triggerThemeTransition(previewColor, e, () => setThemeMode(mode.id));
                  }}
                  activeOpacity={0.8}
                >
                  <Iconify
                    icon={mode.icon}
                    size={18}
                    color={isSelected ? colors.tint : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.modeText,
                      { color: isSelected ? colors.tint : colors.textSecondary },
                    ]}
                  >
                    {isRTL ? mode.labelFa : mode.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Traditional Iranian Colors Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: colors.tint + '18' }]}>
              <Iconify icon="solar:palette-broken" size={20} color={colors.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'رنگ‌های اصیل ایرانی' : 'Traditional Iranian Colors'}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL
                  ? 'با انتخاب هر یک از رنگ‌ها، کل پالت رنگی و تم برنامه بر مبنای آن رنگ اصیل کهن ایرانی هماهنگ می‌گردد.'
                  : 'Select an authentic Iranian color palette to synchronize the entire application appearance.'}
              </Text>
            </View>
          </View>

          {/* Responsive Colors Grid */}
          <View style={[styles.colorsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {IRANIAN_TRADITIONAL_COLORS.map((item: IranianColor) => {
              const isSelected = selectedColorTheme.toUpperCase() === item.hex.toUpperCase();
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.colorCard,
                    {
                      width: numColumns === 2 ? '48%' : colorItemWidth,
                      backgroundColor: isSelected ? colors.tint + '12' : colors.surface,
                      borderColor: isSelected ? colors.tint : colors.border,
                    },
                  ]}
                  onPress={(e) => {
                    triggerThemeTransition(item.hex, e, () => setSelectedColorTheme(item.hex));
                  }}
                  activeOpacity={0.75}
                >
                  <View style={[styles.colorCardInner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={styles.colorSwatchWrap}>
                      <View style={[styles.colorSwatch, { backgroundColor: item.hex }]}>
                        {isSelected && (
                          <Iconify icon="solar:check-read-bold" size={14} color="#FFFFFF" />
                        )}
                      </View>
                    </View>

                    <View style={[styles.colorTextWrap, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                      <Text style={[styles.colorName, { color: colors.text }]} numberOfLines={1}>
                        {isRTL ? item.nameFa : item.nameEn}
                      </Text>
                      <Text style={[styles.colorHex, { color: colors.textSecondary }]}>
                        {item.hex.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View
                      style={[
                        styles.selectedBadgePill,
                        {
                          backgroundColor: colors.tint + '22',
                          borderColor: colors.tint + '44',
                          alignSelf: isRTL ? 'flex-start' : 'flex-end',
                        },
                      ]}
                    >
                      <Text style={[styles.selectedBadgeText, { color: colors.tint }]}>
                        {isRTL ? 'انتخاب شده' : 'Selected'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Font Selection Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: colors.tint + '18' }]}>
              <Iconify icon="solar:document-text-broken" size={20} color={colors.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'انتخاب قلم' : 'Font Selection'}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL
                  ? 'فونت دلخواه خود را برای نمایش متون، عنوان روزها، تقویم و رویدادها انتخاب نمایید.'
                  : 'Select your preferred font typeface for application headings and contents.'}
              </Text>
            </View>
          </View>

          {/* Font List */}
          <View style={styles.fontList}>
            {APP_FONT_OPTIONS.map((font: FontOption) => {
              const isSelected = fontFamily === font.id;
              return (
                <TouchableOpacity
                  key={font.id}
                  style={[
                    styles.fontCard,
                    {
                      backgroundColor: isSelected ? colors.tint + '0E' : colors.surface,
                      borderColor: isSelected ? colors.tint : colors.border,
                    },
                  ]}
                  onPress={() => setFontFamily(font.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.fontHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={[styles.fontInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                      <Text style={[styles.fontName, { color: colors.text, fontFamily: font.fontFamilyStyle }]}>
                        {isRTL ? font.nameFa : font.nameEn}
                      </Text>
                      <Text style={[styles.fontDesc, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                        {isRTL ? font.descFa : font.descEn}
                      </Text>
                    </View>

                    {isSelected && (
                      <View style={[styles.activeFontBadge, { backgroundColor: colors.tint + '1A', borderColor: colors.tint }]}>
                        <Iconify icon="solar:check-read-bold" size={14} color={colors.tint} />
                        <Text style={[styles.activeFontBadgeText, { color: colors.tint }]}>
                          {isRTL ? 'قلم فعال' : 'Active Font'}
                        </Text>
                      </View>
                    )}

                    <View style={[styles.levelCircleBadge, { backgroundColor: isSelected ? colors.tint + '25' : colors.secondaryBackground }]}>
                      <Text style={[styles.levelCircleText, { color: isSelected ? colors.tint : colors.textSecondary }]}>
                        {isRTL ? toPersianDigits(fontSizeLevel) : fontSizeLevel}
                      </Text>
                    </View>
                  </View>

                  {/* Sample Preview Text Box */}
                  <View
                    style={[
                      styles.fontPreviewBox,
                      {
                        backgroundColor: colors.card,
                        borderColor: isSelected ? colors.tint + '50' : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.fontPreviewText,
                        {
                          color: colors.text,
                          fontFamily: font.fontFamilyStyle,
                          fontSize: 14 * (fontSizeLevel / 9),
                          textAlign: isRTL ? 'center' : 'left',
                        },
                      ]}
                    >
                      {font.sampleFa}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Font Size Scaling Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: colors.tint + '18' }]}>
              <Iconify icon="solar:text-square-broken" size={20} color={colors.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'اندازه قلم' : 'Font Size'}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL
                  ? 'اندازه متون برنامه را به دلخواه خود بزرگتر یا کوچکتر کنید.'
                  : 'Adjust font size scale across application views.'}
              </Text>
            </View>
          </View>

          {/* Stepper Control */}
          <View style={[styles.stepperContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.stepperBtn,
                { backgroundColor: colors.card, opacity: fontSizeLevel <= 7 ? 0.4 : 1 },
              ]}
              disabled={fontSizeLevel <= 7}
              onPress={() => setFontSizeLevel(Math.max(7, fontSizeLevel - 1))}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperBtnText, { color: colors.text }]}>−</Text>
            </TouchableOpacity>

            <View style={styles.stepperDisplay}>
              <View style={[styles.stepperLevelCircle, { backgroundColor: colors.tint }]}>
                <Text style={styles.stepperLevelText}>
                  {isRTL ? toPersianDigits(fontSizeLevel) : fontSizeLevel}
                </Text>
              </View>
              <Text style={[styles.stepperLabel, { color: colors.textSecondary }]}>
                {isRTL ? 'سطح اندازه قلم' : 'Font Size Level'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.stepperBtn,
                { backgroundColor: colors.card, opacity: fontSizeLevel >= 13 ? 0.4 : 1 },
              ]}
              disabled={fontSizeLevel >= 13}
              onPress={() => setFontSizeLevel(Math.min(13, fontSizeLevel + 1))}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperBtnText, { color: colors.text }]}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Size Presets */}
          <View style={[styles.presetsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {fontSizePresets.map((preset) => {
              const isActive = fontSizeLevel === preset.level;
              return (
                <TouchableOpacity
                  key={preset.level}
                  style={[
                    styles.presetPill,
                    {
                      backgroundColor: isActive ? colors.tint : colors.surface,
                      borderColor: isActive ? colors.tint : colors.border,
                    },
                  ]}
                  onPress={() => setFontSizeLevel(preset.level)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.presetText,
                      { color: isActive ? '#FFFFFF' : colors.textSecondary },
                    ]}
                  >
                    {isRTL ? preset.labelFa : preset.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
  headerTextWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    gap: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    gap: 12,
  },
  sectionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 2,
  },
  modeContainer: {
    borderRadius: 16,
    padding: 4,
    gap: 6,
  },
  modeButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modeButtonActive: {
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  colorsGrid: {
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  colorCard: {
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    gap: 6,
  },
  colorCardInner: {
    alignItems: 'center',
    gap: 8,
  },
  colorSwatchWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorTextWrap: {
    flex: 1,
  },
  colorName: {
    fontSize: 12,
    fontWeight: '800',
  },
  colorHex: {
    fontSize: 9,
    fontWeight: '600',
    fontFamily: 'monospace',
    marginTop: 1,
  },
  selectedBadgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  selectedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  fontList: {
    gap: 12,
  },
  fontCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    gap: 10,
  },
  fontHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  fontInfo: {
    flex: 1,
  },
  fontName: {
    fontSize: 17,
    fontWeight: '800',
  },
  fontDesc: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  activeFontBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  activeFontBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  levelCircleBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCircleText: {
    fontSize: 12,
    fontWeight: '800',
  },
  fontPreviewBox: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  fontPreviewText: {
    lineHeight: 22,
    fontWeight: '600',
  },
  stepperContainer: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  stepperBtnText: {
    fontSize: 22,
    fontWeight: '800',
  },
  stepperDisplay: {
    alignItems: 'center',
    gap: 4,
  },
  stepperLevelCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperLevelText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  stepperLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  presetsRow: {
    gap: 8,
  },
  presetPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
