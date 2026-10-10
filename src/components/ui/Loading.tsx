import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PageLoaderProps {
  /** متن اختیاری زیر لودر */
  text?: string;
  /** حداقل ارتفاع کانتینر */
  minHeight?: number | string;
  /** لودر به صورت تمام صفحه قرار گیرد */
  fullScreen?: boolean;
}

export function PageLoader({
  text = 'در حال بارگذاری...',
  minHeight = 220,
  fullScreen = false,
}: PageLoaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const rotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Spinning animation for outer squircle border
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );

    // 2. Pulse animation for inner gradient core & text
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(0.92, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.65, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, [rotation, pulseScale, pulseOpacity]);

  const spinAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        typeof minHeight === 'number'
          ? { minHeight }
          : { minHeight: 220 },
      ]}
    >
      <View style={styles.loaderWrapper}>
        {/* Inner core with iOS gradient & pulse */}
        <Animated.View style={[styles.coreContainer, pulseAnimatedStyle]}>
          <LinearGradient
            colors={['#38bdf8', '#0284c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.coreGradient}
          />
        </Animated.View>

        {/* Outer squircle spinning ring */}
        <Animated.View style={[styles.spinnerRing, spinAnimatedStyle]} />
      </View>

      {text ? (
        <Animated.Text
          style={[
            styles.loaderText,
            { color: colors.textSecondary },
            pulseAnimatedStyle,
          ]}
        >
          {text}
        </Animated.Text>
      ) : null}
    </Animated.View>
  );
}

export const Loading = PageLoader;
export default PageLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  loaderWrapper: {
    position: 'relative',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  coreGradient: {
    width: '100%',
    height: '100%',
  },
  spinnerRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: 'rgba(2, 132, 199, 0.2)',
    borderTopColor: '#0284c7',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
});
