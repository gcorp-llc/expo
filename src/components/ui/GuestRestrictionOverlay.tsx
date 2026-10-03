import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface GuestRestrictionOverlayProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  onLogin?: () => void;
}

export const GuestRestrictionOverlay: React.FC<GuestRestrictionOverlayProps> = ({
  title,
  description,
  icon,
  onLogin,
}) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { language, enterDemoMode } = useStore();
  const isRTL = language === 'fa';

  const scale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.96); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      enterDemoMode();
    }
  };

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={[styles.blur, { backgroundColor: colors.background + 'CC' }]}>
          <Animated.View
            entering={FadeInUp.springify().damping(15)}
            style={[styles.content, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={[styles.iconContainer, { backgroundColor: colors.tint + '15' }]}
            >
              {icon}
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.delay(300)}
              style={[styles.title, { color: colors.text }]}
            >
              {title}
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(400)}
              style={[styles.description, { color: colors.textSecondary }]}
            >
              {description}
            </Animated.Text>

            <Animated.View style={[styles.buttonWrapper, animatedButtonStyle]} entering={FadeInDown.delay(500)}>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleLogin}
                style={styles.loginButton}
              >
                <LinearGradient
                  colors={[colors.tint, colors.tint + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.loginButtonText}>
                  {isRTL ? 'ثبت‌نام یا ورود' : 'Sign Up / Login'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 340,
    padding: 32,
    borderRadius: 38,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
