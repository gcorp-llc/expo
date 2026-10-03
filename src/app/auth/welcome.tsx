import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/hooks/use-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { setAuth, language } = useStore();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isRTL = language === 'fa';

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(40);
  const logoScale = useSharedValue(0.8);
  const bgRotation = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1200 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 90 });
    logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    bgRotation.value = withTiming(360, { duration: 20000 });
  }, []);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const handleGuestLogin = () => {
    setAuth({ isGuest: true, isAuthenticated: false });
    router.replace('/(tabs)');
  };

  const handleStartMessaging = () => {
    router.push('/auth/phone');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Dynamic Background Art */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[colors.tint + '30', 'transparent']}
          style={[styles.bgCircle, { top: -50, left: -50, width: 300, height: 300 }]}
        />
        <LinearGradient
          colors={[colors.success + '20', 'transparent']}
          style={[styles.bgCircle, { bottom: 50, right: -100, width: 350, height: 350 }]}
        />
        <View style={[styles.bgLine, { top: height * 0.3, left: -20, backgroundColor: colors.tint + '10', transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.bgLine, { bottom: height * 0.2, right: -20, backgroundColor: colors.success + '10', transform: [{ rotate: '45deg' }] }]} />
      </View>

      <Animated.View style={[styles.content, animatedContentStyle]}>
        <View
          style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >

          <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
            <View style={[styles.logoWrapper, { shadowColor: colors.tint }]}>
               <Iconify icon="solar:chat-line-broken" size={84} color={colors.tint} />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              {isRTL ? 'کـوتـیـک' : 'KuTik'}
            </Text>
            <View style={[styles.titleUnderline, { backgroundColor: colors.tint }]} />

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {isRTL
                ? 'اکوسیستم هوشمند خرید و فروش تعاملی'
                : 'Smart Ecosystem for Interactive Shopping'}
            </Text>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.tint }]}
              onPress={handleStartMessaging}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isRTL ? 'ورود به حساب' : 'Sign In'}
              </Text>
              <Iconify
                icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"}
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestLogin}
            >
              <Text style={[styles.guestButtonText, { color: colors.textSecondary }]}>
                {isRTL ? 'ادامه به عنوان مهمان' : 'Continue as Guest'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary + '80' }]}>
          KuTik Engine v1.0 • 2026
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 200,
  },
  bgLine: {
    position: 'absolute',
    width: width * 1.5,
    height: 1,
  },
  content: {
    width: '90%',
    maxWidth: 400,
  },
  glassCard: {
    borderRadius: 38,
    padding: 32,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 35,
    backgroundColor: 'rgba(128,128,128,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
  },
  titleUnderline: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    height: 60,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  guestButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
