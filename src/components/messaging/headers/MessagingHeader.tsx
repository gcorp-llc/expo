import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Iconify } from '@/components/ui/Iconify';

interface MessagingHeaderProps {
  title: string;
  subtitle?: string;
  isRTL: boolean;
  onSearch?: (query: string) => void;
  onMore?: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const MessagingHeader = ({
  title,
  subtitle,
  isRTL,
  onSearch,
  onMore,
  onBack,
  showBack = false,
}: MessagingHeaderProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);

  const handleToggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
      onSearch?.('');
    }
  };

  return (
    <View style={[styles.outerContainer, { top: insets.top + 6 }]}>
      <View
        style={[
          styles.container,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }
        ]}
      >
        {isSearchActive ? (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout.springify()}
            style={[
              styles.searchBarFloating,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }
            ]}
          >
            <FloatingIconButton
              icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
              onPress={handleToggleSearch}
              size={40}
            />
            <TextInput
              autoFocus
              placeholder={isRTL ? 'جستجو در گفتگو...' : 'Search in chat...'}
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                onSearch?.(text);
              }}
            />
          </Animated.View>
        ) : (
          <>
            <View style={[styles.leftGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {showBack && (
                <FloatingIconButton
                  icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
                  onPress={onBack}
                  size={44}
                />
              )}
              <Animated.View
                entering={FadeIn}
                layout={Layout.springify()}
                style={[styles.titleContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}
              >
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                  {title}
                </Text>
                {subtitle && (
                  <Text style={[styles.subtitle, { color: colors.tint }]} numberOfLines={1}>
                    {subtitle}
                  </Text>
                )}
              </Animated.View>
            </View>

            <View style={[styles.rightGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <FloatingIconButton
                icon="solar:magnifer-broken"
                onPress={handleToggleSearch}
                iconSize={20}
                size={44}
              />
              <FloatingIconButton
                icon="solar:menu-dots-broken"
                onPress={onMore}
                iconSize={20}
                size={44}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: any, isRTL: boolean) => StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
  },
  container: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  rightGroup: {
    alignItems: 'center',
    gap: 6,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  searchBarFloating: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    height: '100%',
  },
});
