import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/hooks/use-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PhoneScreen() {
  const router = useRouter();
  const { language } = useStore();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isRTL = language === 'fa';

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+98');

  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const handleNext = () => {
    if (phoneNumber.length >= 10) {
      router.push({
        pathname: '/auth/verify',
        params: { phone: `${countryCode}${phoneNumber}` }
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.surfaceStrong }]}
          >
            <Iconify
              icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, animatedStyle]}>
          <View style={[styles.iconBox, { backgroundColor: colors.tint + '15' }]}>
            <Iconify icon="solar:smartphone-broken" size={48} color={colors.tint} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {isRTL ? 'شماره همراه' : 'Phone Number'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isRTL
              ? 'کد کشور را تایید کرده و شماره خود را وارد کنید'
              : 'Confirm your country code and enter your number'}
          </Text>

          <View style={styles.inputSection}>
            <View style={[styles.glassInput, { borderColor: colors.border, backgroundColor: colors.surface }]}>
               <View style={[styles.countryWrapper, { borderRightWidth: isRTL ? 0 : 1, borderLeftWidth: isRTL ? 1 : 0, borderColor: colors.border }]}>
                 <Text style={[styles.countryLabel, { color: colors.textSecondary }]}>{isRTL ? 'کد' : 'Code'}</Text>
                 <TextInput
                  style={[styles.countryInput, { color: colors.text }]}
                  value={countryCode}
                  onChangeText={setCountryCode}
                  keyboardType="phone-pad"
                 />
               </View>
               <TextInput
                style={[styles.phoneInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder="0912 345 6789"
                placeholderTextColor={colors.textSecondary + '60'}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                autoFocus
              />
            </View>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: colors.tint, opacity: phoneNumber.length >= 10 ? 1 : 0.6 }]}
            onPress={handleNext}
            disabled={phoneNumber.length < 10}
            activeOpacity={0.8}
          >
            <Text style={styles.mainBtnText}>{isRTL ? 'ادامه' : 'Continue'}</Text>
            <Iconify
              icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60 },
  header: { height: 60, justifyContent: 'center' },
  backBtn: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  content: { marginTop: 40, alignItems: 'center' },
  iconBox: { width: 90, height: 90, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  inputSection: { width: '100%' },
  glassInput: { height: 70, borderRadius: 22, flexDirection: 'row', alignItems: 'center', borderWidth: 1, overflow: 'hidden' },
  countryWrapper: { paddingHorizontal: 16, height: '60%', justifyContent: 'center', alignItems: 'center' },
  countryLabel: { fontSize: 10, fontWeight: '700', marginBottom: 2 },
  countryInput: { fontSize: 16, fontWeight: '800', width: 45, textAlign: 'center', padding: 0 },
  phoneInput: { flex: 1, fontSize: 20, fontWeight: '700', paddingHorizontal: 20 },
  footer: { flex: 1, justifyContent: 'flex-end', marginBottom: 40 },
  mainBtn: { height: 65, borderRadius: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  mainBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
});
