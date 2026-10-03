import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';

import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export default function ShopManagementScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, shop, updateShop } = useStore();
  const isRTL = language === 'fa';

  const [form, setForm] = useState({
    name: shop.name,
    contact: shop.contact,
    location: shop.location,
    website: shop.website || '',
    instagram: shop.instagram || '',
  });

  const handleSave = () => {
    updateShop(form);
    router.back();
  };

  const InputField = ({ label, value, onChangeText, icon, placeholder }: any) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
      <View style={[styles.inputWrapper, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.surfaceStrong }]}>
        <Iconify icon={icon} size={20} color={colors.icon} />
        <TextInput
          style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary + '80'}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'تنظیمات فروشگاه' : 'Shop Settings'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.tint }]}>
            <Text style={styles.saveBtnText}>{isRTL ? 'ذخیره' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Branding Section */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.logoSection}>
            <TouchableOpacity style={[styles.logoWrapper, { borderColor: colors.tint }]}>
              <Image source={{ uri: 'https://i.pravatar.cc/300?u=kutik-shop' }} style={styles.logoImage} />
              <View style={[styles.cameraIcon, { backgroundColor: colors.tint }]}>
                <Iconify icon="solar:camera-broken" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1, gap: 4, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.shopNameText, { color: colors.text }]}>{form.name}</Text>
              <Text style={[styles.shopIdText, { color: colors.textSecondary }]}>ID: @kutik_official</Text>
            </View>
          </View>
        </View>

        {/* Staff Section - New */}
        <TouchableOpacity
          style={[styles.staffCard, { backgroundColor: colors.tint + '10', borderColor: colors.tint + '30' }]}
          onPress={() => router.push('/settings/shop-staff')}
        >
          <View style={[styles.staffInfo, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.staffIcon, { backgroundColor: colors.tint }]}>
              <Iconify icon="solar:user-broken" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.staffTitle, { color: colors.text }]}>{isRTL ? 'مدیریت کارکنان' : 'Staff Management'}</Text>
              <Text style={[styles.staffSub, { color: colors.textSecondary }]}>
                {isRTL ? `${shop.staff.length} نفر دسترسی دارند` : `${shop.staff.length} members have access`}
              </Text>
            </View>
            <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={[styles.boxedSection, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.sectionLabel, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'اطلاعات پایه' : 'Basic Info'}
          </Text>
          <InputField
            label={isRTL ? 'نام فروشگاه' : 'Shop Name'}
            icon="solar:shop-2-broken"
            value={form.name}
            onChangeText={(text: string) => setForm({ ...form, name: text })}
            placeholder={isRTL ? 'نام فروشگاه' : 'Shop name'}
          />
          <InputField
            label={isRTL ? 'شماره تماس' : 'Contact Number'}
            icon="solar:phone-calling-broken"
            value={form.contact}
            onChangeText={(text: string) => setForm({ ...form, contact: text })}
            placeholder={isRTL ? '۰۹۱۲۳۴۵۶۷۸۹' : '09123456789'}
          />
        </View>

        {/* Social & Links Section */}
        <View style={[styles.boxedSection, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.sectionLabel, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'لینک‌ها و شبکه‌های اجتماعی' : 'Links & Social Media'}
          </Text>
          <InputField
            label={isRTL ? 'وب‌سایت' : 'Website'}
            icon="solar:globus-broken"
            value={form.website}
            onChangeText={(text: string) => setForm({ ...form, website: text })}
            placeholder="https://example.com"
          />
          <InputField
            label={isRTL ? 'اینستاگرام' : 'Instagram'}
            icon="solar:camera-broken"
            value={form.instagram}
            onChangeText={(text: string) => setForm({ ...form, instagram: text })}
            placeholder="username"
          />
        </View>

        {/* Location Section */}
        <View style={[styles.boxedSection, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.sectionLabel, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'موقعیت مکانی' : 'Location'}
          </Text>
          <InputField
            label={isRTL ? 'آدرس متنی' : 'Text Address'}
            icon="solar:map-point-broken"
            value={form.location}
            onChangeText={(text: string) => setForm({ ...form, location: text })}
            placeholder={isRTL ? 'آدرس دقیق' : 'Exact address'}
          />

          <View style={styles.mapPlaceholder}>
             <Image
                source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/51.3890,35.6892,12,0/600x300?access_token=mock' }}
                style={styles.mapImage}
             />
             <View style={styles.mapOverlay}>
                <TouchableOpacity style={[styles.mapBtn, { backgroundColor: colors.tint }]}>
                    <Iconify icon="solar:map-point-broken" size={20} color="#fff" />
                    <Text style={styles.mapBtnText}>{isRTL ? 'انتخاب روی نقشه زنده' : 'Select on Live Map'}</Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: colors.destructive + '10' }]}
          activeOpacity={0.7}
        >
          <Iconify icon="solar:trash-bin-trash-broken" size={20} color={colors.destructive} />
          <Text style={[styles.deleteBtnText, { color: colors.destructive }]}>{isRTL ? 'غیرفعال‌سازی فروشگاه' : 'Deactivate Shop'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerContent: { height: 70, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  saveBtn: { paddingHorizontal: 20, height: 40, borderRadius: 20, justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  scrollContent: { padding: 16, gap: 16 },
  card: { borderRadius: 24, padding: 16 },
  logoSection: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  logoWrapper: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, padding: 3 },
  logoImage: { width: '100%', height: '100%', borderRadius: 37 },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#121212' },
  shopNameText: { fontSize: 18, fontWeight: '800' },
  shopIdText: { fontSize: 13, fontWeight: '600' },
  staffCard: { padding: 16, borderRadius: 24, borderWidth: 1, borderStyle: 'dashed' },
  staffInfo: { alignItems: 'center', gap: 16 },
  staffIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  staffTitle: { fontSize: 16, fontWeight: '700' },
  staffSub: { fontSize: 13, fontWeight: '500' },
  boxedSection: { padding: 16, borderRadius: 24, borderWidth: 1, gap: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
  inputContainer: { gap: 8 },
  inputLabel: { fontSize: 13, fontWeight: '700', marginHorizontal: 4 },
  inputWrapper: { height: 54, borderRadius: 16, paddingHorizontal: 16, alignItems: 'center', gap: 12 },
  input: { flex: 1, fontSize: 14, fontWeight: '600' },
  mapPlaceholder: { height: 180, borderRadius: 20, overflow: 'hidden', marginTop: 8 },
  mapImage: { width: '100%', height: '100%' },
  mapOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  mapBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 44, borderRadius: 22, gap: 8 },
  mapBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  deleteBtn: { height: 56, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 },
  deleteBtnText: { fontSize: 15, fontWeight: '700' },
});
