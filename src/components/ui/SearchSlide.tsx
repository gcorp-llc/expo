import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { Iconify } from '@/components/ui/Iconify';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RecentItemProps {
  text: string;
  isRTL: boolean;
  colors: any;
  setSearchQuery: (query: string) => void;
}

const RecentItem = ({ text, isRTL, colors, setSearchQuery }: RecentItemProps) => (
  <TouchableOpacity style={[styles.recentItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]} onPress={() => setSearchQuery(text)}>
    <View style={[styles.recentItemLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <Iconify icon="solar:history-broken" size={18} color={colors.icon} />
      <Text style={[styles.recentItemText, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{text}</Text>
    </View>
    <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={18} color={colors.icon} />
  </TouchableOpacity>
);

export const SearchSlide = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { isSearchVisible, setSearchVisible, searchQuery, setSearchQuery, language } = useStore();
  const inputRef = useRef<TextInput>(null);

  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    translateY.value = withTiming(isSearchVisible ? 0 : SCREEN_HEIGHT, {
      duration: isSearchVisible ? 350 : 300,
      easing: isSearchVisible ? Easing.out(Easing.quad) : Easing.in(Easing.quad),
    });
    if (isSearchVisible) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      inputRef.current?.blur();
    }
  }, [isSearchVisible, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!isSearchVisible) return null;

  const isRTL = language === 'fa';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[
        styles.container,
        { backgroundColor: colors.background },
        animatedStyle
      ]}>
        <View style={[styles.header, { borderBottomColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.surfaceStrong, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Iconify icon="solar:magnifer-broken" size={20} color={colors.icon} />
            <TextInput
              ref={inputRef}
              style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={isRTL ? "جستجو در کوتیک..." : "Search in KuTik..."}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Iconify icon="solar:close-circle-broken" size={20} color={colors.icon} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => setSearchVisible(false)}>
            <Text style={[styles.cancelButton, { color: colors.tint }]}>
              {isRTL ? "لغو" : "Cancel"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {isRTL ? "جستجوهای اخیر" : "Recent Searches"}
            </Text>
            <RecentItem text={isRTL ? "گوشی هوشمند" : "Smartphone"} isRTL={isRTL} colors={colors} setSearchQuery={setSearchQuery} />
            <RecentItem text={isRTL ? "محصولات زیبایی" : "Beauty Products"} isRTL={isRTL} colors={colors} setSearchQuery={setSearchQuery} />
            <RecentItem text={isRTL ? "نوبت‌دهی آنلاین" : "Online Appointment"} isRTL={isRTL} colors={colors} setSearchQuery={setSearchQuery} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {isRTL ? "پیشنهادات داغ" : "Trending"}
            </Text>
            <View style={[styles.tagsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {[isRTL ? "پزشکی" : "Medical", isRTL ? "سلامت" : "Health", isRTL ? "مشاوره" : "Consultation", isRTL ? "تغذیه" : "Nutrition"].map((tag) => (
                <TouchableOpacity key={tag} style={[styles.tag, { backgroundColor: colors.surfaceStrong, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Iconify icon="solar:fire-broken" size={14} color={colors.tint} />
                  <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentItemText: {
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
