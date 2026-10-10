import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { useStore } from '@/hooks/use-store';
import { GuestRestrictionOverlay } from '@/components/ui/GuestRestrictionOverlay';
import { PageBackground } from '@/components/ui/PageBackground';
import { SelectionModal, Option } from '@/components/ui/SelectionModal';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';

const FOOTER_NAV_HEIGHT = 77;

export default function SellScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, isGuest, hasEnteredDemoMode } = useStore();
  const isRTL = language === 'fa';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [focused, setFocused] = useState<string | null>(null);

  const categoryOptions: Option[] = [
    { label: isRTL ? 'الکترونیک' : 'Electronics', value: 'Electronics', icon: 'solar:smartphone-broken' },
    { label: isRTL ? 'مد و پوشاک' : 'Fashion', value: 'Fashion', icon: 'solar:bag-heart-broken' },
    { label: isRTL ? 'خانه و آشپزخانه' : 'Home', value: 'Home', icon: 'solar:home-broken' },
    { label: isRTL ? 'کتاب و هنر' : 'Books', value: 'Books', icon: 'solar:book-broken' },
    { label: isRTL ? 'زیبایی و سلامت' : 'Beauty', value: 'Beauty', icon: 'solar:magic-stick-broken' },
    { label: isRTL ? 'خودرو' : 'Vehicles', value: 'Vehicles', icon: 'solar:wheel-broken' },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        isRTL ? 'خطای دسترسی' : 'Permission Required',
        isRTL ? 'لطفاً دسترسی به گالری را تایید کنید.' : 'Gallery access is required.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...selectedUris].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!title || !price || !category) {
      Alert.alert(
        isRTL ? 'اطلاعات ناقص' : 'Incomplete Form',
        isRTL ? 'لطفاً عنوان، قیمت و دسته‌بندی را وارد کنید.' : 'Please enter title, price, and category.'
      );
      return;
    }
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <PageBackground />
        <Animated.View entering={FadeInDown.duration(600)} style={styles.successContainer}>
          <View style={[styles.successIconCircle, { backgroundColor: colors.success + '20' }]}>
            <Iconify icon="solar:check-circle-bold" size={72} color={colors.success} />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>
            {isRTL ? 'آگهی با موفقیت منتشر شد!' : 'Listing Published Successfully!'}
          </Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
            {isRTL
              ? 'آگهی شما پس از تایید کوتاه در لیست فروشگاه قرار خواهد گرفت.'
              : 'Your item is now live and visible to buyers.'}
          </Text>
          <TouchableOpacity
            style={[styles.publishButton, { backgroundColor: colors.tint, width: '100%', marginTop: 28 }]}
            onPress={() => {
              setIsSuccess(false);
              setStep(1);
              setImages([]);
              setTitle('');
              setPrice('');
              setCategory('');
              setDescription('');
            }}
          >
            <Text style={styles.publishButtonText}>{isRTL ? 'ثبت آگهی جدید' : 'Create Another Listing'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />
      {isGuest && !hasEnteredDemoMode && (
        <GuestRestrictionOverlay
          icon={<Iconify icon="solar:add-square-bold" width={42} height={42} color={colors.tint} />}
          title={isRTL ? 'ثبت آگهی' : 'Create Listing'}
          description={
            isRTL
              ? 'برای ثبت آگهی و فروش محصولات خود، لطفاً ابتدا ثبت‌نام کنید.'
              : 'To publish listings and sell your products, please sign up first.'
          }
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 20, paddingBottom: FOOTER_NAV_HEIGHT + insets.bottom + 32 },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'ثبت آگهی هوشمند' : 'Smart Listing Wizard'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'مراحل ثبت را دنبال کنید' : 'Step-by-step product publishing'}
            </Text>
          </View>

          {/* Stepper Wizard Bar */}
          <View style={[styles.stepperContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {[
              { num: 1, title: isRTL ? 'عکس‌ها' : 'Photos' },
              { num: 2, title: isRTL ? 'اطلاعات' : 'Details' },
              { num: 3, title: isRTL ? 'پیش‌نمایش' : 'Preview' },
            ].map((s) => (
              <TouchableOpacity
                key={s.num}
                style={[
                  styles.stepBadge,
                  {
                    backgroundColor: step === s.num ? colors.tint : step > s.num ? colors.tint + '30' : colors.surface,
                    borderColor: step === s.num ? colors.tint : colors.border,
                  },
                ]}
                onPress={() => setStep(s.num as any)}
              >
                <Text style={{ color: step === s.num ? '#fff' : colors.text, fontWeight: '800', fontSize: 13 }}>
                  {s.num}. {s.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Step 1: Photos */}
          {step === 1 && (
            <Animated.View entering={FadeInRight.duration(400)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'تصاویر محصول (حداکثر ۵ عکس)' : 'Product Images (Max 5)'}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {images.map((img, idx) => (
                  <View key={idx} style={styles.uploadedImgWrap}>
                    <Image source={{ uri: img }} style={styles.uploadedImg} contentFit="cover" />
                    <TouchableOpacity style={styles.removeImgBtn} onPress={() => removeImage(idx)}>
                      <Iconify icon="solar:close-circle-bold" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}

                {images.length < 5 && (
                  <TouchableOpacity
                    style={[styles.photoBox, { borderColor: colors.tint, backgroundColor: colors.surface }]}
                    onPress={pickImage}
                    activeOpacity={0.8}
                  >
                    <Iconify icon="solar:camera-bold" width={28} height={28} color={colors.tint} />
                    <Text style={[styles.photoText, { color: colors.tint }]}>
                      {isRTL ? 'افزودن عکس' : 'Add Photo'}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: colors.tint }]}
                onPress={() => setStep(2)}
              >
                <Text style={styles.publishButtonText}>{isRTL ? 'مرحله بعد: اطلاعات' : 'Next: Details'}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Step 2: Product Details */}
          {step === 2 && (
            <Animated.View entering={FadeInRight.duration(400)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'مشخصات و قیمت' : 'Details & Pricing'}
              </Text>

              <TextInput
                placeholder={isRTL ? 'عنوان آگهی...' : 'Item title...'}
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
                style={[
                  styles.input,
                  {
                    borderColor: focused === 'title' ? colors.tint : colors.border,
                    backgroundColor: colors.surface,
                    color: colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
                onFocus={() => setFocused('title')}
                onBlur={() => setFocused(null)}
              />

              <TextInput
                placeholder={isRTL ? 'قیمت ($)' : 'Price ($)'}
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                style={[
                  styles.input,
                  {
                    borderColor: focused === 'price' ? colors.tint : colors.border,
                    backgroundColor: colors.surface,
                    color: colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
                onFocus={() => setFocused('price')}
                onBlur={() => setFocused(null)}
              />

              <TouchableOpacity
                style={[styles.selector, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setCategoryModalVisible(true)}
              >
                <View style={[styles.selectorLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Iconify icon="solar:tag-bold" width={18} height={18} color={colors.tint} />
                  <Text style={[styles.selectorText, { color: category ? colors.text : colors.textSecondary }]}>
                    {category || (isRTL ? 'انتخاب دسته‌بندی' : 'Select category')}
                  </Text>
                </View>
                <Iconify
                  icon={isRTL ? 'solar:alt-arrow-left-linear' : 'solar:alt-arrow-right-linear'}
                  width={18}
                  height={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              <TextInput
                placeholder={isRTL ? 'موقعیت مکانی (شهر/منطقه)' : 'Location (City/Region)'}
                placeholderTextColor={colors.textSecondary}
                value={location}
                onChangeText={setLocation}
                style={[
                  styles.input,
                  {
                    borderColor: focused === 'loc' ? colors.tint : colors.border,
                    backgroundColor: colors.surface,
                    color: colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
                onFocus={() => setFocused('loc')}
                onBlur={() => setFocused(null)}
              />

              <TextInput
                placeholder={isRTL ? 'توضیحات کامل آگهی...' : 'Detailed description...'}
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                style={[
                  styles.textArea,
                  {
                    borderColor: focused === 'desc' ? colors.tint : colors.border,
                    backgroundColor: colors.surface,
                    color: colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
                onFocus={() => setFocused('desc')}
                onBlur={() => setFocused(null)}
              />

              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, marginTop: 8 }}>
                <TouchableOpacity
                  style={[styles.nextButton, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flex: 1 }]}
                  onPress={() => setStep(1)}
                >
                  <Text style={[styles.publishButtonText, { color: colors.text }]}>{isRTL ? 'قبلی' : 'Back'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.nextButton, { backgroundColor: colors.tint, flex: 2 }]}
                  onPress={() => setStep(3)}
                >
                  <Text style={styles.publishButtonText}>{isRTL ? 'پیش‌نمایش' : 'Preview'}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Step 3: Live Preview & Submit */}
          {step === 3 && (
            <Animated.View entering={FadeInRight.duration(400)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'پیش‌نمایش آگهی شما' : 'Listing Live Preview'}
              </Text>

              <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {images.length > 0 ? (
                  <Image source={{ uri: images[0] }} style={styles.previewImg} contentFit="cover" />
                ) : (
                  <View style={[styles.previewImgPlaceholder, { backgroundColor: colors.secondaryBackground }]}>
                    <Iconify icon="solar:box-broken" size={40} color={colors.textSecondary} />
                  </View>
                )}

                <View style={{ padding: 14, gap: 6 }}>
                  <Text style={[styles.previewTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                    {title || (isRTL ? 'عنوان نمونه' : 'Sample Title')}
                  </Text>
                  <Text style={[styles.previewPrice, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
                    ${price || '0'}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                    {category || 'Category'} • {location || 'Location'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.publishButton, { backgroundColor: colors.tint }]}
                onPress={handlePublish}
              >
                <Text style={styles.publishButtonText}>{isRTL ? 'تایید و انتشار آگهی' : 'Publish Listing Now'}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <SelectionModal
        isVisible={isCategoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        options={categoryOptions}
        selectedValue={category}
        onSelect={(val) => {
          setCategory(val);
          setCategoryModalVisible(false);
        }}
        title={isRTL ? 'انتخاب دسته‌بندی' : 'Select Category'}
        isRTL={isRTL}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 18 },
  header: { marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  stepperContainer: { gap: 8, marginBottom: 8 },
  stepBadge: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { borderRadius: 22, padding: 18, gap: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  photoBox: {
    width: 100,
    height: 100,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoText: { fontSize: 12, fontWeight: '700' },
  uploadedImgWrap: { width: 100, height: 100, borderRadius: 18, overflow: 'hidden', position: 'relative' },
  uploadedImg: { width: '100%', height: '100%' },
  removeImgBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: '#fff', borderRadius: 10 },
  input: { height: 50, borderRadius: 14, paddingHorizontal: 14, fontSize: 15, borderWidth: 1.2 },
  textArea: {
    minHeight: 90,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    fontSize: 15,
    borderWidth: 1.2,
    textAlignVertical: 'top',
  },
  selector: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorLeft: { alignItems: 'center', gap: 10 },
  selectorText: { fontSize: 14, fontWeight: '600' },
  nextButton: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  publishButton: {
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  previewCard: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  previewImg: { width: '100%', height: 160 },
  previewImgPlaceholder: { width: '100%', height: 140, alignItems: 'center', justifyContent: 'center' },
  previewTitle: { fontSize: 16, fontWeight: '800' },
  previewPrice: { fontSize: 18, fontWeight: '900', marginTop: 2 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  successIconCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  successSubtitle: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8, lineHeight: 22 },
});
