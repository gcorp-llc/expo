import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '@/hooks/use-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function VerifyScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { language } = useStore();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isRTL = language === 'fa';

  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);

  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  useEffect(() => {
    if (code.length === 5) {
      setTimeout(handleVerify, 500);
    }
  }, [code]);

  const handleVerify = () => {
    router.push({
      pathname: '/auth/profile',
      params: { phone }
    });
  };

  const renderCodeSlot = (index: number) => {
    const isFocused = code.length === index;
    const digit = code[index] || '';

    return (
      <View
        key={index}
        style={[
          styles.codeSlot,
          {
            backgroundColor: colors.surfaceStrong,
            borderColor: isFocused ? colors.tint : colors.border,
            borderWidth: isFocused ? 2 : 1
          }
        ]}
      >
        <Text style={[styles.codeDigit, { color: colors.text }]}>{digit}</Text>
        {isFocused && <View style={[styles.cursor, { backgroundColor: colors.tint }]} />}
      </View>
    );
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
            <Iconify icon="solar:shield-check-broken" size={48} color={colors.tint} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {isRTL ? 'تایید شماره' : 'Verification'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isRTL
              ? `کد ۵ رقمی به شماره ${phone} ارسال شد`
              : `A 5-digit code was sent to ${phone}`}
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            style={styles.otpContainer}
          >
            {[0, 1, 2, 3, 4].map(renderCodeSlot)}
            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              keyboardType="number-pad"
              maxLength={5}
              value={code}
              onChangeText={setCode}
              autoFocus
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendBtn}>
            <Text style={[styles.resendText, { color: colors.tint }]}>
              {isRTL ? 'ارسال مجدد کد' : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: colors.tint, opacity: code.length === 5 ? 1 : 0.6 }]}
            onPress={handleVerify}
            disabled={code.length < 5}
          >
            <Text style={styles.mainBtnText}>{isRTL ? 'تایید' : 'Verify'}</Text>
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
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 50, paddingHorizontal: 30, lineHeight: 22 },
  otpContainer: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  codeSlot: { width: 55, height: 65, borderRadius: 16, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  codeDigit: { fontSize: 28, fontWeight: '800' },
  cursor: { position: 'absolute', bottom: 12, width: 20, height: 2, borderRadius: 1 },
  hiddenInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  resendBtn: { padding: 10 },
  resendText: { fontSize: 15, fontWeight: '700' },
  footer: { flex: 1, justifyContent: 'flex-end', marginBottom: 40 },
  mainBtn: { height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  mainBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
});
