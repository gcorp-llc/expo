import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useModalStore } from '@/hooks/use-modal-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';
import { PageBackground } from '@/components/ui/PageBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';

const SHOP_CATEGORIES = [
  { id: 'electronics', nameFa: 'دیجیتال و الکترونیک', nameEn: 'Electronics', icon: 'solar:smartphone-broken' },
  { id: 'fashion', nameFa: 'مد و پوشاک', nameEn: 'Fashion', icon: 'solar:bag-smile-outline' },
  { id: 'home', nameFa: 'خانه و آشپزخانه', nameEn: 'Home & Kitchen', icon: 'solar:home-broken' },
  { id: 'beauty', nameFa: 'زیبایی و سلامت', nameEn: 'Beauty & Health', icon: 'solar:magic-stick-broken' },
  { id: 'sports', nameFa: 'ورزش و سفر', nameEn: 'Sports & Travel', icon: 'solar:basketball-broken' },
  { id: 'vehicles', nameFa: 'خودرو و لوازم', nameEn: 'Automotive', icon: 'solar:wheel-broken' },
];

export default function CreateShopScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, updateShop } = useStore();
  const showModal = useModalStore((state) => state.showModal);
  const isRTL = language === 'fa';

  const [logoUri, setLogoUri] = useState<string>('https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&q=80');
  const [coverUri, setCoverUri] = useState<string>('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80');

  const [shopName, setShopName] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(SHOP_CATEGORIES[0].id);
  const [specialty, setSpecialty] = useState('');
  const [description, setDescription] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');

  const [city, setCity] = useState(isRTL ? 'تهران' : 'Tehran');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [workingHours, setWorkingHours] = useState(isRTL ? 'شنبه تا پنج‌شنبه: ۹ الی ۲۱' : 'Mon-Sat: 09:00 - 21:00');
  const [returnPolicy, setReturnPolicy] = useState(isRTL ? '۷ روز ضمانت بازگشت کالا' : '7 days return policy');
  const [iban, setIban] = useState('IR');

  const [enableCod, setEnableCod] = useState(true);
  const [enableExpressShipping, setEnableExpressShipping] = useState(true);

  const pickImage = async (type: 'logo' | 'cover') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      if (type === 'logo') setLogoUri(result.assets[0].uri);
      else setCoverUri(result.assets[0].uri);
    }
  };

  const handleRegister = () => {
    if (!shopName.trim()) {
      showModal({
        title: isRTL ? 'نام فروشگاه الزامی است' : 'Shop Name Required',
        message: isRTL ? 'لطفاً نام فروشگاه خود را وارد کنید.' : 'Please enter a name for your shop.',
        icon: 'solar:danger-circle-bold',
        iconColor: colors.destructive,
        buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
      });
      return;
    }

    updateShop({
      name: shopName.trim(),
      logo: logoUri,
      contact: phone.trim() || '۰۹۱۲۳۴۵۶۷۸۹',
      location: address.trim() || `${city}، خیابان اصلی`,
      website: website.trim(),
      instagram: instagram.trim(),
    });

    showModal({
      title: isRTL ? 'فروشگاه با موفقیت ایجاد شد 🎉' : 'Shop Registered Successfully 🎉',
      message: isRTL
        ? `فروشگاه «${shopName.trim()}» با امکانات کامل فعال گردید و آماده ارائه خدمات است.`
        : `Store "${shopName.trim()}" is now live and ready to operate.`,
      icon: 'solar:bag-smile-bold-duotone',
      iconColor: colors.tint,
      buttons: [
        {
          text: isRTL ? 'ورود به مدیریت فروشگاه' : 'Manage Store',
          style: 'primary',
          onPress: () => {
            router.replace('/(tabs)/shop');
          }
        }
      ]
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {/* Floating Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Iconify
            icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isRTL ? 'ثبت فروشگاه جدید' : 'Create New Shop'}
        </Text>

        <TouchableOpacity
          onPress={handleRegister}
          style={[styles.saveBtn, { backgroundColor: colors.tint }]}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>{isRTL ? 'ایجاد فروشگاه' : 'Register'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover & Logo Section */}
        <Animated.View entering={FadeInDown.duration(450)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity onPress={() => pickImage('cover')} activeOpacity={0.85} style={styles.coverWrapper}>
            <Image source={{ uri: coverUri }} style={styles.coverImage} contentFit="cover" />
            <View style={styles.coverOverlay}>
              <View style={[styles.cameraBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <Iconify icon="solar:camera-bold" size={18} color="#fff" />
                <Text style={styles.cameraBadgeText}>{isRTL ? 'تغییر کاور' : 'Change Cover'}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <TouchableOpacity onPress={() => pickImage('logo')} activeOpacity={0.85} style={[styles.logoWrapper, { borderColor: colors.tint }]}>
              <Image source={{ uri: logoUri }} style={styles.logoImage} contentFit="cover" />
              <View style={[styles.logoCameraBadge, { backgroundColor: colors.tint }]}>
                <Iconify icon="solar:camera-bold" size={14} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.logoTitle, { color: colors.text }]}>
                {shopName || (isRTL ? 'نام فروشگاه جدید' : 'New Shop Name')}
              </Text>
              <Text style={[styles.logoSubtitle, { color: colors.textSecondary }]}>
                {handle ? `@${handle.replace('@', '')}` : (isRTL ? '@آیدی_اختصاصی' : '@shop_handle')}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Basic Info Form */}
        <Animated.View entering={FadeInDown.duration(450).delay(100)} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'اطلاعات پایه و هویت فروشگاه' : 'Basic Identity'}
          </Text>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'نام رسمی فروشگاه' : 'Shop Name'} *
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:bag-smile-outline" size={20} color={colors.tint} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'مثال: گالری تخصصی کوتیک' : 'e.g. Kutik Gallery'}
                placeholderTextColor={colors.textSecondary + '80'}
                value={shopName}
                onChangeText={setShopName}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'شناسه یکتا (آیدی)' : 'Shop Handle / Username'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={{ color: colors.tint, fontWeight: '800' }}>@</Text>
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                placeholder="my_official_shop"
                placeholderTextColor={colors.textSecondary + '80'}
                value={handle}
                onChangeText={setHandle}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'دسته‌بندی اصلی فعالیت' : 'Category'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.categoryChips, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {SHOP_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.tint : colors.surface,
                        borderColor: isSelected ? colors.tint : colors.border,
                      },
                    ]}
                  >
                    <Iconify icon={cat.icon} size={18} color={isSelected ? '#fff' : colors.text} />
                    <Text style={[styles.chipText, { color: isSelected ? '#fff' : colors.text }]}>
                      {isRTL ? cat.nameFa : cat.nameEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'حوزه تخصصی و شعار' : 'Specialty / Tagline'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:star-bold" size={18} color={colors.warning} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'مثال: مرکز تخصصی پوشاک و اکسسوری چرم' : 'e.g. Premium Leather Accessories'}
                placeholderTextColor={colors.textSecondary + '80'}
                value={specialty}
                onChangeText={setSpecialty}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'درباره فروشگاه / بیو' : 'Shop Bio / Description'}
            </Text>
            <View style={[styles.textareaBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.textarea, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'توضیحات جامع درباره نحوه خدمات‌رسانی و سابقه کسب و کار...' : 'Describe your shop, values, and offerings...'}
                placeholderTextColor={colors.textSecondary + '80'}
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>
        </Animated.View>

        {/* Contact & Socials */}
        <Animated.View entering={FadeInDown.duration(450).delay(200)} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'راه‌های ارتباطی و شبکه‌های اجتماعی' : 'Contact & Social Links'}
          </Text>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'شماره تماس مستقیم پشتیبانی' : 'Phone Number'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:phone-calling-broken" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                placeholderTextColor={colors.textSecondary + '80'}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'ایمیل فروشگاه' : 'Email Address'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:letter-broken" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                placeholder="support@myshop.com"
                placeholderTextColor={colors.textSecondary + '80'}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'وب‌سایت رسمی' : 'Website'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:globus-broken" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                placeholder="https://myshop.ir"
                placeholderTextColor={colors.textSecondary + '80'}
                autoCapitalize="none"
                value={website}
                onChangeText={setWebsite}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'آیدی اینستاگرام' : 'Instagram'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:camera-broken" size={20} color="#E1306C" />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                placeholder="instagram_handle"
                placeholderTextColor={colors.textSecondary + '80'}
                autoCapitalize="none"
                value={instagram}
                onChangeText={setInstagram}
              />
            </View>
          </View>
        </Animated.View>

        {/* Location & Operating Details */}
        <Animated.View entering={FadeInDown.duration(450).delay(300)} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'موقعیت مکانی و ساعات فعالیت' : 'Location & Operation'}
          </Text>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'استان و شهر' : 'City / Province'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:map-point-broken" size={20} color={colors.tint} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'نشانی دقیق پستی' : 'Physical Address'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:city-broken" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'خیابان، پلاک، واحد' : 'Street address, building'}
                placeholderTextColor={colors.textSecondary + '80'}
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'ساعات کاری و پاسخگویی' : 'Working Hours'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:clock-circle-broken" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                value={workingHours}
                onChangeText={setWorkingHours}
              />
            </View>
          </View>
        </Animated.View>

        {/* Financial Details & Options */}
        <Animated.View entering={FadeInDown.duration(450).delay(400)} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'امور مالی و گزینه‌های تسویه‌حساب' : 'Financials & Options'}
          </Text>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'شماره شبا بانک (جهت واریز)' : 'IBAN Sheba Number'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:wallet-money-broken" size={20} color={colors.success} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                placeholder="IR123456789012345678901234"
                placeholderTextColor={colors.textSecondary + '80'}
                value={iban}
                onChangeText={setIban}
              />
            </View>
          </View>

          <View style={[styles.switchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>
                {isRTL ? 'امکان پرداخت در محل (COD)' : 'Cash on Delivery'}
              </Text>
              <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>
                {isRTL ? 'فعال بودن تسویه درب منزل برای خریداران' : 'Allow buyers to pay upon delivery'}
              </Text>
            </View>
            <Switch
              value={enableCod}
              onValueChange={setEnableCod}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.switchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>
                {isRTL ? 'ارسال سریع و پیشتاز' : 'Express Shipping'}
              </Text>
              <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>
                {isRTL ? 'امکان ارسال سفارشی و فوری همان روز' : 'Enable same-day express shipping'}
              </Text>
            </View>
            <Switch
              value={enableExpressShipping}
              onValueChange={setEnableExpressShipping}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#fff"
            />
          </View>
        </Animated.View>

        <TouchableOpacity
          style={[styles.submitBigBtn, { backgroundColor: colors.tint }]}
          onPress={handleRegister}
          activeOpacity={0.88}
        >
          <Iconify icon="solar:bag-smile-bold-duotone" size={22} color="#fff" />
          <Text style={styles.submitBigBtnText}>{isRTL ? 'ثبت و راه‌اندازی رسمی فروشگاه' : 'Complete Registration'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  saveBtn: {
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  scrollContent: { padding: 16, gap: 16 },
  card: { borderRadius: 28, borderWidth: 1, overflow: 'hidden', paddingBottom: 16 },
  coverWrapper: { height: 130, width: '100%', position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  coverOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'flex-end', padding: 12 },
  cameraBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  cameraBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  logoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: -32, gap: 16 },
  logoWrapper: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, position: 'relative' },
  logoImage: { width: '100%', height: '100%', borderRadius: 35 },
  logoCameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  logoTitle: { fontSize: 18, fontWeight: '900', marginTop: 24 },
  logoSubtitle: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  sectionCard: { borderRadius: 24, padding: 18, borderWidth: 1, gap: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  formField: { gap: 6 },
  label: { fontSize: 13, fontWeight: '700' },
  inputBox: { height: 52, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, alignItems: 'center', gap: 10 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', height: '100%' },
  textareaBox: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, minHeight: 90 },
  textarea: { fontSize: 14, fontWeight: '600', minHeight: 70, textAlignVertical: 'top' },
  categoryChips: { gap: 8, paddingVertical: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '700' },
  switchRow: { alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 6 },
  switchTitle: { fontSize: 14, fontWeight: '700' },
  switchDesc: { fontSize: 12, marginTop: 2 },
  submitBigBtn: { height: 56, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 },
  submitBigBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
