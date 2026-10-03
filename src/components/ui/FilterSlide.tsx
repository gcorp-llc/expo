import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, Pressable, TextInput, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { Iconify } from '@/components/ui/Iconify';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name_fa: 'الکترونیک', name_en: 'Electronics' },
  { id: '2', name_fa: 'مد و پوشاک', name_en: 'Fashion' },
  { id: '3', name_fa: 'خانه و آشپزخانه', name_en: 'Home' },
  { id: '4', name_fa: 'کتاب و هنر', name_en: 'Books' },
  { id: '5', name_fa: 'زیبایی و سلامت', name_en: 'Beauty' },
];

const LOCATIONS = [
  { id: '1', name_fa: 'تهران', name_en: 'Tehran' },
  { id: '2', name_fa: 'مشهد', name_en: 'Mashhad' },
  { id: '3', name_fa: 'اصفهان', name_en: 'Isfahan' },
  { id: '4', name_fa: 'شیراز', name_en: 'Shiraz' },
  { id: '5', name_fa: 'تبریز', name_en: 'Tabriz' },
];

export const FilterSlide = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { isFilterVisible, setFilterVisible, language } = useStore();
  const [catSearch, setCatSearch] = useState('');
  const [locSearch, setLocSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [showCatOptions, setShowCatOptions] = useState(false);
  const [showLocOptions, setShowLocOptions] = useState(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    translateY.value = withTiming(isFilterVisible ? 0 : SCREEN_HEIGHT, {
      duration: isFilterVisible ? 350 : 300,
      easing: isFilterVisible ? Easing.out(Easing.quad) : Easing.in(Easing.quad),
    });
  }, [isFilterVisible, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT, 0],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity,
    };
  });

  if (!isFilterVisible) return null;

  const isRTL = language === 'fa';

  const FilterSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
      <View style={[styles.sectionContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {children}
      </View>
    </View>
  );

  const FilterChip = ({ label, selected }: { label: string, selected?: boolean }) => (
    <TouchableOpacity style={[
      styles.chip,
      {
        backgroundColor: selected ? colors.tint : 'transparent',
        borderColor: selected ? colors.tint : 'rgba(128, 128, 128, 0.3)',
        borderWidth: 1.2,
        overflow: 'hidden'
      }
    ]}>
      {!selected && <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.surface }]} />}
      <Text style={[styles.chipText, { color: selected ? '#fff' : colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setFilterVisible(false)} />
      </Animated.View>

      <Animated.View style={[
        styles.container,
        animatedStyle,
        { backgroundColor: colors.card, borderTopColor: colors.border, borderTopWidth: 1 }
      ]}>
        <View style={styles.indicator} />
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isRTL ? 'فیلترها' : 'Filters'}
          </Text>
          <TouchableOpacity onPress={() => setFilterVisible(false)}>
            <Iconify icon="solar:close-circle-broken" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Grouped Featured Filters */}
          <View style={[styles.featuredFilters, { borderColor: colors.tint + '40', backgroundColor: colors.tint + '05' }]}>
            <View style={styles.featuredSection}>
              <Text style={[styles.featuredTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'دسته‌بندی' : 'Category'}
              </Text>
              <View style={[styles.searchBox, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Iconify icon="solar:magnifer-broken" size={18} color={colors.textSecondary} />
                <TextInput
                  placeholder={isRTL ? 'جستجوی دسته...' : 'Search category...'}
                  style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholderTextColor={colors.textSecondary}
                  value={catSearch}
                  onChangeText={(t) => {
                    setCatSearch(t);
                    setShowCatOptions(true);
                  }}
                  onFocus={() => setShowCatOptions(true)}
                />
                {catSearch.length > 0 && (
                  <TouchableOpacity onPress={() => { setCatSearch(''); setSelectedCat(null); setShowCatOptions(false); }}>
                    <Iconify icon="solar:close-circle-broken" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
              {showCatOptions && (
                <View style={[styles.optionsList, { backgroundColor: colors.surfaceStrong }]}>
                  {CATEGORIES.filter(c => (isRTL ? c.name_fa : c.name_en).toLowerCase().includes(catSearch.toLowerCase())).map(c => (
                    <TouchableOpacity
                      key={c.id}
                      style={styles.optionItem}
                      onPress={() => {
                        setCatSearch(isRTL ? c.name_fa : c.name_en);
                        setSelectedCat(c.id);
                        setShowCatOptions(false);
                      }}
                    >
                      <Text style={{ color: colors.text, textAlign: isRTL ? 'right' : 'left' }}>{isRTL ? c.name_fa : c.name_en}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.featuredSection, { marginTop: 16 }]}>
              <Text style={[styles.featuredTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'لوکیشن و شهر' : 'Location & City'}
              </Text>
              <View style={[styles.searchBox, { backgroundColor: colors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Iconify icon="solar:map-point-broken" size={18} color={colors.textSecondary} />
                <TextInput
                  placeholder={isRTL ? 'جستجوی شهر...' : 'Search city...'}
                  style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                  placeholderTextColor={colors.textSecondary}
                  value={locSearch}
                  onChangeText={(t) => {
                    setLocSearch(t);
                    setShowLocOptions(true);
                  }}
                  onFocus={() => setShowLocOptions(true)}
                />
                {locSearch.length > 0 && (
                  <TouchableOpacity onPress={() => { setLocSearch(''); setSelectedLoc(null); setShowLocOptions(false); }}>
                    <Iconify icon="solar:close-circle-broken" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
              {showLocOptions && (
                <View style={[styles.optionsList, { backgroundColor: colors.surfaceStrong }]}>
                  {LOCATIONS.filter(l => (isRTL ? l.name_fa : l.name_en).toLowerCase().includes(locSearch.toLowerCase())).map(l => (
                    <TouchableOpacity
                      key={l.id}
                      style={styles.optionItem}
                      onPress={() => {
                        setLocSearch(isRTL ? l.name_fa : l.name_en);
                        setSelectedLoc(l.id);
                        setShowLocOptions(false);
                      }}
                    >
                      <Text style={{ color: colors.text, textAlign: isRTL ? 'right' : 'left' }}>{isRTL ? l.name_fa : l.name_en}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={{ height: 24 }} />

            <FilterSection title={isRTL ? 'محدوده قیمت' : 'Price Range'}>
              <FilterChip label={isRTL ? 'ارزان‌ترین' : 'Cheapest'} selected />
              <FilterChip label={isRTL ? 'متوسط' : 'Medium'} />
              <FilterChip label={isRTL ? 'گران‌ترین' : 'Expensive'} />
            </FilterSection>

            <FilterSection title={isRTL ? 'نوع محصول' : 'Product Type'}>
              <FilterChip label={isRTL ? 'نو' : 'New'} />
              <FilterChip label={isRTL ? 'دست دوم' : 'Used'} selected />
              <FilterChip label={isRTL ? 'در حد نو' : 'Like New'} />
            </FilterSection>
          </View>

          <TouchableOpacity style={styles.applyButtonWrapper} onPress={() => setFilterVisible(false)}>
            <View style={[styles.applyButton, { backgroundColor: colors.tint, borderWidth: 1.2, borderColor: colors.tint }]}>
              <Text style={[styles.applyButtonText, { color: '#fff' }]}>{isRTL ? 'اعمال فیلتر' : 'Apply Filters'}</Text>
            </View>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    minHeight: 400,
    zIndex: 2000,
    overflow: 'hidden',
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(128,128,128,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  featuredFilters: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  featuredSection: {
    gap: 8,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  searchBox: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionContent: {
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  applyButtonWrapper: {
    height: 54,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
  },
  applyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    marginTop: 4,
    borderRadius: 14,
    padding: 8,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.1)',
    zIndex: 10,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
