import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { Image } from 'expo-image';
import { Iconify } from '@/components/ui/Iconify';
import { SearchDropdown } from './SearchDropdown';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useSharedValue,
  withSpring,
  SharedValue,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface ModernHeaderProps {
  scrollY: SharedValue<number>;
}

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 320,
  mass: 0.8,
};

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  badge?: string;
  colors: any;
  pressedScale: SharedValue<number>;
  handlePressIn: () => void;
  handlePressOut: () => void;
}

const IconButton = React.memo(({ icon, onPress, badge, colors, pressedScale, handlePressIn, handlePressOut }: IconButtonProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressedScale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={10}
    >
      <Animated.View style={[styles.iconButtonFlat, animatedStyle]}>
        <Iconify icon={icon} size={26} color={colors.text} />
        {badge && (
          <View style={[styles.badge, { backgroundColor: colors.destructive }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
});
IconButton.displayName = 'IconButton';

export const ModernHeader = ({ scrollY }: ModernHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const {
    setFilterVisible,
    searchQuery,
    setSearchQuery,
    language,
    cart,
    addRecentSearch
  } = useStore();
  
  const isRTL = language === 'fa';
  const [isDropdownVisible, setDropdownVisible] = React.useState(false);

  const pressedScale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    // eslint-disable-next-line react-hooks/immutability
    pressedScale.value = withSpring(0.9, SPRING_CONFIG);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }
  }, [pressedScale]);

  const handlePressOut = useCallback(() => {
    // eslint-disable-next-line react-hooks/immutability
    pressedScale.value = withSpring(1, SPRING_CONFIG);
  }, [pressedScale]);

  const topLayerAnimatedStyle = useAnimatedStyle(() => {
    const scrollProgress = interpolate(scrollY.value, [0, 85], [1, 0], Extrapolate.CLAMP);
    return {
      opacity: scrollProgress,
      transform: [{
        translateY: interpolate(scrollY.value, [0, 85], [0, -38], Extrapolate.CLAMP)
      }],
      height: interpolate(scrollY.value, [0, 85], [70, 0], Extrapolate.CLAMP),
    };
  });

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ 
      translateY: interpolate(scrollY.value, [0, 55], [0, -4], Extrapolate.CLAMP) 
    }],
  }));

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <Animated.View style={[styles.topBar, topLayerAnimatedStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Pressable 
          style={[styles.profileSection, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          onPress={() => router.push('/profile')}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=kutik' }}
              style={[styles.avatar, { borderColor: colors.tint }]}
              contentFit="cover"
            />
            <View style={[styles.statusDot, { borderColor: colors.background }]} />
          </View>

          <View style={[styles.userInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {isRTL ? 'خوش آمدید' : 'Welcome back'}
            </Text>
            <Text style={[styles.username, { color: colors.text }]}>
              {isRTL ? 'کاربر کوتیک' : 'KuTik User'}
            </Text>
          </View>
        </Pressable>

        <View style={[styles.actionButtons, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <IconButton icon="solar:bell-broken" badge="3" onPress={() => router.push('/notifications')} colors={colors} pressedScale={pressedScale} handlePressIn={handlePressIn} handlePressOut={handlePressOut} />
          <IconButton
            icon="solar:cart-large-broken"
            badge={cart.length > 0 ? cart.length.toString() : undefined}
            onPress={() => router.push('/cart')}
            colors={colors}
            pressedScale={pressedScale}
            handlePressIn={handlePressIn}
            handlePressOut={handlePressOut}
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.searchContainer, searchAnimatedStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flex: 1, zIndex: 1000 }}>
          <View style={[styles.searchBlurContainer, { borderRadius: 24, overflow: 'hidden', borderColor: colors.border, backgroundColor: colors.surface }]}>
            <View style={[styles.searchBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:magnifer-broken" size={22} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'جستجو در کوتیک...' : 'Search in KuTik...'}
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setDropdownVisible(true)}
                onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
                onSubmitEditing={() => {
                  if (searchQuery.trim()) {
                    addRecentSearch(searchQuery.trim());
                  }
                  setDropdownVisible(false);
                }}
              />
            </View>
          </View>

          <SearchDropdown
            isVisible={isDropdownVisible}
            onClose={() => setDropdownVisible(false)}
          />
        </View>

        <View style={[styles.filterBlurContainer, { borderRadius: 24, overflow: 'hidden', borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Pressable 
            style={({ pressed }) => [
              styles.filterButton,
              pressed && { opacity: 0.8 }
            ]}
            onPress={() => setFilterVisible(true)}
          >
            <Iconify icon="solar:filter-broken" size={24} color={colors.text} />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.02)',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  avatarContainer: {
    position: 'relative',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },

  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
  },

  userInfo: {
    justifyContent: 'center',
  },

  greeting: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },

  username: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  iconButtonFlat: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
  },

  searchBlurContainer: {
    flex: 1,
    borderWidth: 1,
  },

  searchBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 0,
  },

  filterBlurContainer: {
    borderWidth: 1,
  },

  filterButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
