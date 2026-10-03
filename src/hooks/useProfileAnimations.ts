import { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolation, withTiming, withSpring } from 'react-native-reanimated';

export const useProfileAnimations = () => {
  const scrollY = useSharedValue(0);
  const fabVisible = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      if (event.contentOffset.y > 250) {
        fabVisible.value = withSpring(1);
      } else {
        fabVisible.value = withSpring(0);
      }
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 1], Extrapolation.CLAMP);
    const height = interpolate(scrollY.value, [0, 100], [100, 70], Extrapolation.CLAMP);
    return {
      opacity,
      height,
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [100, 200], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
    };
  });

  const fabStyle = useAnimatedStyle(() => {
    return {
      opacity: fabVisible.value,
      transform: [{ scale: fabVisible.value }],
    };
  });

  const coverStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [-100, 0, 100], [50, 0, -50], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, [-100, 0], [1.2, 1], Extrapolation.CLAMP);
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return {
    scrollY,
    scrollHandler,
    headerStyle,
    titleStyle,
    fabStyle,
    coverStyle,
  };
};
