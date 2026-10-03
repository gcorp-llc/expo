import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { useStore } from '@/hooks/use-store';
import { GuestRestrictionOverlay } from '@/components/ui/GuestRestrictionOverlay';
import { PageBackground } from '@/components/ui/PageBackground';

const FOOTER_NAV_HEIGHT = 77;

export default function SellScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, isGuest, hasEnteredDemoMode } = useStore();
  const isRTL = language === 'fa';
  const [focused, setFocused] = useState<string | null>(null);
  const isFocused = (name: string) => focused === name;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />
      {isGuest && !hasEnteredDemoMode && (
        <GuestRestrictionOverlay
          icon={<Iconify icon="solar:add-square-bold" width={42} height={42} color={colors.tint} />}
          title={isRTL ? 'ثبت آگهی' : 'Create Listing'}
          description={isRTL ? 'برای ثبت آگهی و فروش محصولات خود، لطفاً ابتدا ثبت‌نام کنید.' : 'To publish listings and sell your products, please sign up first.'}
        />
      )}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: FOOTER_NAV_HEIGHT + insets.bottom + 32 }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{isRTL ? 'ثبت آگهی' : 'Create Listing'}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{isRTL ? 'جزئیات زیر را پر کنید' : 'Fill the details below'}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surfaceStrong }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{isRTL ? 'تصاویر' : 'Photos'}</Text>
            <TouchableOpacity style={[styles.photoBox, { borderColor: colors.border, backgroundColor: colors.background }]} activeOpacity={0.85}>
              <Iconify icon="solar:camera-bold" width={28} height={28} color={colors.tint} />
              <Text style={[styles.photoText, { color: colors.textSecondary }]}>{isRTL ? 'برای آپلود تصاویر ضربه بزنید' : 'Tap to upload images'}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surfaceStrong }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{isRTL ? 'جزئیات' : 'Details'}</Text>
            <TextInput placeholder={isRTL ? "عنوان آیتم" : "Item title"} placeholderTextColor={colors.textSecondary} style={[styles.input, { borderColor: isFocused('title') ? colors.tint : colors.border, backgroundColor: colors.background, color: colors.text }]} onFocus={() => setFocused('title')} onBlur={() => setFocused(null)} />
            <TextInput placeholder="$ 0.00" placeholderTextColor={colors.textSecondary} keyboardType="numeric" style={[styles.input, { borderColor: isFocused('price') ? colors.tint : colors.border, backgroundColor: colors.background, color: colors.text }]} onFocus={() => setFocused('price')} onBlur={() => setFocused(null)} />
            
            <TouchableOpacity style={[styles.selector, { backgroundColor: colors.background }]} activeOpacity={0.85}>
              <View style={styles.selectorLeft}>
                <Iconify icon="solar:tag-bold" width={18} height={18} color={colors.icon} />
                <Text style={[styles.selectorText, { color: colors.text }]}>{isRTL ? 'انتخاب دسته‌بندی' : 'Select category'}</Text>
              </View>
              <Iconify icon={isRTL ? "solar:alt-arrow-left-bold" : "solar:alt-arrow-right-bold"} width={18} height={18} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.selector, { backgroundColor: colors.background }]} activeOpacity={0.85}>
              <View style={styles.selectorLeft}>
                <Iconify icon="solar:map-point-bold" width={18} height={18} color={colors.icon} />
                <Text style={[styles.selectorText, { color: colors.text }]}>{isRTL ? 'انتخاب موقعیت مکانی' : 'Select location'}</Text>
              </View>
              <Iconify icon={isRTL ? "solar:alt-arrow-left-bold" : "solar:alt-arrow-right-bold"} width={18} height={18} color={colors.icon} />
            </TouchableOpacity>

            <TextInput placeholder={isRTL ? "آیتم خود را توصیف کنید..." : "Describe your item..."} placeholderTextColor={colors.textSecondary} multiline numberOfLines={5} style={[styles.textArea, { borderColor: isFocused('desc') ? colors.tint : colors.border, backgroundColor: colors.background, color: colors.text }]} onFocus={() => setFocused('desc')} onBlur={() => setFocused(null)} />
          </View>

          <TouchableOpacity activeOpacity={0.9} style={[styles.publishButton, { backgroundColor: colors.tint }]}>
            <Text style={styles.publishButtonText}>{isRTL ? 'انتشار آگهی' : 'Publish Listing'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 22 },
  header: { marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '800' },
  subtitle: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  card: { borderRadius: 24, padding: 18, gap: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  photoBox: { height: 140, borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoText: { fontSize: 14, fontWeight: '500' },
  input: { height: 54, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1.2 },
  textArea: { minHeight: 110, borderRadius: 16, paddingHorizontal: 16, paddingTop: 16, fontSize: 16, borderWidth: 1.2, textAlignVertical: 'top' },
  selector: { height: 54, borderRadius: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  selectorText: { fontSize: 15, fontWeight: '500' },
  publishButton: { marginTop: 12, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 6 },
  publishButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});