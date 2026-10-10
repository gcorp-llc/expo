import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';

interface MessagingHeaderProps {
  title: string;
  subtitle?: string;
  avatarUri?: string;
  isRTL: boolean;
  onSearch?: (query: string) => void;
  onMore?: () => void;
  onCall?: () => void;
  onBack?: () => void;
  onTitlePress?: () => void;
  showBack?: boolean;
}

export const MessagingHeader = ({
  title,
  subtitle,
  avatarUri,
  isRTL,
  onSearch,
  onMore,
  onCall,
  onBack,
  onTitlePress,
  showBack = false,
}: MessagingHeaderProps) => {
  const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
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
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
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
                backgroundColor: '#282535',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
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
              placeholderTextColor="#A09CBA"
              style={[styles.searchInput, { color: '#FFFFFF', textAlign: isRTL ? 'right' : 'left' }]}
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

              <TouchableOpacity
                style={[styles.profileButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={onTitlePress}
                activeOpacity={0.7}
              >
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Iconify icon="solar:user-bold" size={20} color="#FFFFFF" />
                  </View>
                )}

                <View style={[styles.titleContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={styles.title} numberOfLines={1}>
                    {title}
                  </Text>
                  {subtitle && (
                    <Text style={styles.subtitle} numberOfLines={1}>
                      {subtitle}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.rightGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <FloatingIconButton
                icon="solar:phone-calling-broken"
                onPress={onCall}
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

const createStyles = (colors: any, isRTL: boolean) =>
  StyleSheet.create({
    outerContainer: {
      position: 'absolute',
      left: 12,
      right: 12,
      zIndex: 100,
    },
    container: {
      height: 54,
      alignItems: 'center',
      justifyContent: 'space-between',
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
    profileButton: {
      flex: 1,
      alignItems: 'center',
      gap: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    avatarPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#38344A',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    subtitle: {
      fontSize: 11.5,
      fontWeight: '500',
      color: '#A09CBA',
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
      shadowOpacity: 0.2,
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
