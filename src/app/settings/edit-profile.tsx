import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';


export default function EditProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const [name, setName] = useState(isRTL ? 'کاربر کوتیک' : 'KuTik User');
  const [bio, setBio] = useState(isRTL ? 'علاقه‌مند به تکنولوژی و گجت‌های هوشمند' : 'Tech enthusiast and smart gadget lover');
  const [phone, setPhone] = useState('۰۹۱۲۳۴۵۶۷۸۹');

  const InputField = ({ label, value, onChangeText, icon, placeholder }: any) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
        {label}
      </Text>
      <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: 'rgba(128,128,128,0.2)', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Iconify icon={icon} size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {isRTL ? 'ویرایش پروفایل' : 'Edit Profile'}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.saveText, { color: colors.tint }]}>{isRTL ? 'ذخیره' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?u=kutik' }}
                style={styles.avatar}
                contentFit="cover"
              />
              <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: colors.tint }]}>
                <Iconify icon="solar:camera-broken" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.avatarHint, { color: colors.textSecondary }]}>
              {isRTL ? 'تغییر عکس پروفایل' : 'Change profile photo'}
            </Text>
          </View>

          <View style={styles.form}>
            <InputField
              label={isRTL ? 'نام و نام خانوادگی' : 'Full Name'}
              value={name}
              onChangeText={setName}
              icon="solar:user-broken"
            />
            <InputField
              label={isRTL ? 'بیوگرافی' : 'Bio'}
              value={bio}
              onChangeText={setBio}
              icon="solar:book-broken"
              placeholder={isRTL ? 'کمی درباره خودتان بنویسید...' : 'Write something about yourself...'}
            />
            <InputField
              label={isRTL ? 'شماره تماس' : 'Phone Number'}
              value={phone}
              onChangeText={setPhone}
              icon="solar:phone-broken"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(128,128,128,0.2)',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarHint: {
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  inputWrapper: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
