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
    <View style={[styles.outerContainer, { top: insets.top + 10 }]}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 100}
        tint={colorScheme}
        style={[
          styles.container,
          {
            backgroundColor: colorScheme === 'dark' ? 'rgba(44, 44, 46, 0.8)' : 'rgba(241, 242, 244, 0.8)',
            borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }
        ]}
      >
        {isSearchActive ? (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout.springify()}
            style={[styles.searchContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <FloatingIconButton
              icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
              onPress={handleToggleSearch}
              size={40}
            />
            <TextInput
              autoFocus
              placeholder={isRTL ? 'جستجو...' : 'Search...'}
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
                  size={42}
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
                size={42}
              />
              <FloatingIconButton
                icon="solar:menu-dots-broken"
                onPress={onMore}
                iconSize={20}
                size={42}
              />
            </View>
          </>
        )}
      </BlurView>
    </View>
  );
};

const createStyles = (colors: any, isRTL: boolean) => StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 100,
  },
  container: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  leftGroup: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  rightGroup: {
    alignItems: 'center',
    gap: 4,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: -2,
  },
  searchContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    height: '100%',
  },
});
