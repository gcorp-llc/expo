import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useStore } from '@/hooks/use-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

interface SearchDropdownProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SearchDropdown = ({ isVisible, onClose }: SearchDropdownProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const {
    recentSearches,
    removeRecentSearch,
    clearRecentSearches,
    setSearchQuery,
    language,
    addRecentSearch
  } = useStore();

  const isRTL = language === 'fa';

  if (!isVisible || recentSearches.length === 0) return null;

  const handleSelect = (item: string) => {
    setSearchQuery(item);
    addRecentSearch(item);
    onClose();
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(200)}
      style={[styles.container, { top: 60 }]}
    >
      <View style={[styles.dropdown, { borderRadius: 24, overflow: 'hidden', borderColor: colors.border, borderWidth: 1, backgroundColor: colors.card }]}>
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.title, { color: colors.textSecondary }]}>
            {isRTL ? 'جستجوهای اخیر' : 'Recent Searches'}
          </Text>
          <TouchableOpacity onPress={clearRecentSearches}>
            <Text style={[styles.clearAll, { color: colors.destructive }]}>
              {isRTL ? 'پاک کردن همه' : 'Clear All'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
          {recentSearches.map((item, index) => (
            <TouchableOpacity
              key={`${item}-${index}`}
              style={[styles.item, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => handleSelect(item)}
            >
              <View style={[styles.itemContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Iconify icon="solar:history-broken" size={20} color={colors.textSecondary} />
                <Text style={[styles.itemText, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                  {item}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeRecentSearch(item)}
                hitSlop={10}
              >
                <Iconify icon="solar:close-circle-broken" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 0,
  },
  dropdown: {
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  clearAll: {
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 10,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
});
