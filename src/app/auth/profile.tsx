import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '@/hooks/use-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const { width } = Dimensions.get('window');

const profileSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { language, setAuth } = useStore();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isRTL = language === 'fa';

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    mode: 'onChange',
  });

  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const onSubmit = (data: ProfileFormValues) => {
    setAuth({
      isAuthenticated: true,
      isGuest: false,
      user: {
        firstName: data.firstName,
        lastName: data.lastName || '',
        phoneNumber: phone || '',
      }
    });
    router.replace('/(tabs)');
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
          <View style={styles.avatarSection}>
            <TouchableOpacity style={[styles.avatarCircle, { backgroundColor: colors.surfaceStrong, borderColor: colors.tint }]}>
              <Iconify icon="solar:camera-broken" size={40} color={colors.tint} />
              <View style={[styles.addBtn, { backgroundColor: colors.tint }]}>
                <Iconify icon="solar:add-square-broken" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {isRTL ? 'پروفایل شما' : 'Your Profile'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isRTL
              ? 'نام خود را وارد کنید تا دوستانتان شما را بشناسند'
              : 'Enter your name so your friends can recognize you'}
          </Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={[styles.inputGroup, { backgroundColor: colors.surfaceStrong, borderColor: errors.firstName ? colors.error : 'transparent', borderWidth: errors.firstName ? 1 : 0 }]}>
                    <View style={styles.inputIcon}>
                      <Iconify icon="solar:user-broken" size={22} color={errors.firstName ? colors.error : colors.tint} />
                    </View>
                    <TextInput
                      style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                      placeholder={isRTL ? 'نام (اجباری)' : 'First Name (Required)'}
                      placeholderTextColor={colors.textSecondary + '60'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoFocus
                    />
                  </View>
                  {errors.firstName && <Text style={[styles.errorText, { color: colors.error, textAlign: isRTL ? 'right' : 'left' }]}>{errors.firstName.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputGroup, { backgroundColor: colors.surfaceStrong }]}>
                  <View style={styles.inputIcon}>
                    <Iconify icon="solar:user-broken" size={22} color={colors.textSecondary} />
                  </View>
                  <TextInput
                    style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                    placeholder={isRTL ? 'نام خانوادگی (اختیاری)' : 'Last Name (Optional)'}
                    placeholderTextColor={colors.textSecondary + '60'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: colors.tint, opacity: isValid ? 1 : 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            <Text style={styles.mainBtnText}>{isRTL ? 'تکمیل ثبت‌نام' : 'Finish Registration'}</Text>
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
  content: { marginTop: 20, alignItems: 'center' },
  avatarSection: { marginBottom: 30 },
  avatarCircle: { width: 110, height: 110, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' },
  addBtn: { position: 'absolute', bottom: -5, right: -5, width: 32, height: 32, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'transparent' },
  title: { fontSize: 26, fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 40, paddingHorizontal: 30, lineHeight: 22 },
  form: { width: '100%', gap: 16 },
  inputGroup: { height: 65, borderRadius: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  inputIcon: { width: 40, alignItems: 'center' },
  input: { flex: 1, fontSize: 16, fontWeight: '600', height: '100%' },
  errorText: { fontSize: 12, marginTop: 4, marginLeft: 16 },
  footer: { flex: 1, justifyContent: 'flex-end', marginBottom: 40, marginTop: 40 },
  mainBtn: { height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  mainBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
});
