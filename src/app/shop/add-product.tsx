import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore, CustomProduct } from '@/hooks/use-store';
import { useModalStore } from '@/hooks/use-modal-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';
import { PageBackground } from '@/components/ui/PageBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';

const PRODUCT_CATEGORIES = [
  { id: 'Electronics', nameFa: 'دیجیتال و گجت', nameEn: 'Electronics', icon: 'solar:smartphone-broken' },
  { id: 'Fashion', nameFa: 'مد و پوشاک', nameEn: 'Fashion', icon: 'solar:bag-smile-outline' },
  { id: 'Home', nameFa: 'خانه و لوازم', nameEn: 'Home', icon: 'solar:home-broken' },
  { id: 'Beauty', nameFa: 'زیبایی و آرایشی', nameEn: 'Beauty', icon: 'solar:magic-stick-broken' },
  { id: 'Sports', nameFa: 'ورزشی و سفر', nameEn: 'Sports', icon: 'solar:basketball-broken' },
];

export default function AddProductScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, addCustomProduct, shop } = useStore();
  const showModal = useModalStore((state) => state.showModal);
  const isRTL = language === 'fa';

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0].id);
  const [sku, setSku] = useState(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
  const [imageUri, setImageUri] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80');
  const [description, setDescription] = useState('');

  // Financials & Stock
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [lowStockAlert, setLowStockAlert] = useState('5');

  // Sales & Discounts
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState('15');

  // Coupon & Auction
  const [enableCoupon, setEnableCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('KUTIKOFF');
  const [couponValue, setCouponValue] = useState('10');

  const [isAuction, setIsAuction] = useState(false);
  const [startingBid, setStartingBid] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('24');

  // Store Distinct Options
  const [enableExpress, setEnableExpress] = useState(true);
  const [enableCod, setEnableCod] = useState(true);
  const [warrantyDays, setWarrantyDays] = useState(isRTL ? '۷ روز مهلت تست و بازگشت کالا' : '7 days warranty');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePublish = () => {
    if (!title.trim() || !sellingPrice.trim()) {
      showModal({
        title: isRTL ? 'اطلاعات ناقص' : 'Incomplete Fields',
        message: isRTL ? 'لطفاً عنوان محصول و قیمت فروش را وارد نمایید.' : 'Please enter title and selling price.',
        icon: 'solar:danger-circle-bold',
        iconColor: colors.destructive,
        buttons: [{ text: isRTL ? 'باشه' : 'OK', style: 'primary' }]
      });
      return;
    }

    const priceNum = parseFloat(sellingPrice);
    const costNum = costPrice ? parseFloat(costPrice) : priceNum * 0.7;
    const stockNum = stockQuantity ? parseInt(stockQuantity, 10) : 10;
    const discountNum = hasDiscount ? parseFloat(discountPercent) : 0;

    const newProd: CustomProduct = {
      id: `custom-${Date.now()}`,
      name: title.trim(),
      price: priceNum,
      costPrice: costNum,
      stockQuantity: stockNum,
      salesCount: 0,
      description: description.trim() || (isRTL ? 'محصول جدید فروشگاهی با امکانات ویژه' : 'Store special product'),
      image: imageUri,
      category,
      seller: shop.name || (isRTL ? 'فروشگاه تخصصی کوتیک' : 'Kutik Official Store'),
      oldPrice: discountNum > 0 ? priceNum + (priceNum * (discountNum / 100)) : undefined,
      discountPercentage: discountNum > 0 ? discountNum : undefined,
      hasActiveSale: discountNum > 0 || isAuction,
      rating: 5.0,
      reviews: 1,
    };

    addCustomProduct(newProd);

    showModal({
      title: isRTL ? 'محصول با موفقیت منتشر شد 🎉' : 'Product Published 🎉',
      message: isRTL
        ? `محصول «${newProd.name}» با موفقیت در ویترین فروشگاه و انبار ثبت گردید.`
        : `Product "${newProd.name}" is now live in your store inventory.`,
      icon: 'solar:bag-smile-bold-duotone',
      iconColor: colors.tint,
      buttons: [
        {
          text: isRTL ? 'بازگشت به فروشگاه' : 'Back to Shop',
          style: 'primary',
          onPress: () => {
            router.back();
          }
        }
      ]
    });
  };

  const calculatedProfit = sellingPrice && costPrice ? parseFloat(sellingPrice) - parseFloat(costPrice) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageBackground />

      {/* Modern Header */}
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
          {isRTL ? 'افزودن محصول جدید فروشگاه' : 'Add Store Product'}
        </Text>

        <TouchableOpacity
          onPress={handlePublish}
          style={[styles.publishBtn, { backgroundColor: colors.tint }]}
          activeOpacity={0.85}
        >
          <Text style={styles.publishBtnText}>{isRTL ? 'انتشار' : 'Publish'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Product Image Picker */}
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'تصویر و رسانه محصول' : 'Product Media'}
          </Text>

          <TouchableOpacity onPress={pickImage} activeOpacity={0.85} style={styles.imagePickerBox}>
            <Image source={{ uri: imageUri }} style={styles.pickedImage} contentFit="cover" />
            <View style={styles.imageOverlay}>
              <View style={[styles.cameraBadge, { backgroundColor: colors.tint }]}>
                <Iconify icon="solar:camera-bold" size={18} color="#fff" />
                <Text style={styles.cameraBadgeText}>{isRTL ? 'تغییر تصویر اصلی' : 'Change Image'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Basic Information */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'اطلاعات عمومی محصول' : 'Basic Information'}
          </Text>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'عنوان و نام محصول' : 'Product Title'} *
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:box-broken" size={20} color={colors.tint} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'مثال: هندزفری بلوتوثی پرو مدل ۲۰۲۵' : 'e.g. Wireless Headphones Pro'}
                placeholderTextColor={colors.textSecondary + '80'}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'دسته‌بندی محصول' : 'Category'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.categoryChips, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {PRODUCT_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
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
              {isRTL ? 'کد اختصاصی انبار (SKU)' : 'Inventory SKU Code'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:code-bold" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                value={sku}
                onChangeText={setSku}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'توضیحات و مشخصات فنی' : 'Description & Features'}
            </Text>
            <View style={[styles.textareaBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.textarea, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={isRTL ? 'توضیحات کامل درباره ویژگی‌ها، گارانتی و مشخصات فنی...' : 'Full product description...'}
                placeholderTextColor={colors.textSecondary + '80'}
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>
        </Animated.View>

        {/* Pricing & Profit Margin */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'قیمت‌گذاری و محاسبه سود' : 'Pricing & Profit Margin'}
          </Text>

          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
            <View style={[styles.formField, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'قیمت فروش ($)' : 'Selling Price ($)'} *
              </Text>
              <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                  placeholder="299"
                  placeholderTextColor={colors.textSecondary + '80'}
                  keyboardType="numeric"
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                />
              </View>
            </View>

            <View style={[styles.formField, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'قیمت تمام شده ($)' : 'Cost Price ($)'}
              </Text>
              <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                  placeholder="180"
                  placeholderTextColor={colors.textSecondary + '80'}
                  keyboardType="numeric"
                  value={costPrice}
                  onChangeText={setCostPrice}
                />
              </View>
            </View>
          </View>

          {Boolean(sellingPrice) && Boolean(costPrice) && (
            <View style={[styles.profitPreview, { backgroundColor: colors.tint + '12', borderColor: colors.tint + '30', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Iconify icon="solar:wallet-money-broken" size={20} color={colors.tint} />
              <Text style={[styles.profitText, { color: colors.tint }]}>
                {isRTL ? `سود پیش‌بینی‌شده برای هر واحد: $${calculatedProfit.toFixed(2)}` : `Estimated profit per unit: $${calculatedProfit.toFixed(2)}`}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Inventory Stock Management */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'مدیریت موجودی انبار' : 'Inventory Stock Control'}
          </Text>

          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
            <View style={[styles.formField, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'تعداد موجودی انبار' : 'Stock Quantity'}
              </Text>
              <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                  placeholder="20"
                  placeholderTextColor={colors.textSecondary + '80'}
                  keyboardType="numeric"
                  value={stockQuantity}
                  onChangeText={setStockQuantity}
                />
              </View>
            </View>

            <View style={[styles.formField, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'آستانه هشدار کمبود' : 'Low Stock Alert'}
              </Text>
              <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                  placeholder="5"
                  placeholderTextColor={colors.textSecondary + '80'}
                  keyboardType="numeric"
                  value={lowStockAlert}
                  onChangeText={setLowStockAlert}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Discounts, Coupons & Auctions */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'تخفیف، کد جایزه و حراجی' : 'Promotions & Deals'}
          </Text>

          {/* Discount Switch */}
          <View style={[styles.switchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>
                {isRTL ? 'اعمال تخفیف مستقیم' : 'Active Direct Discount'}
              </Text>
              <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>
                {isRTL ? 'نمایش برچسب حراج و قیمت قبلی خط خورده' : 'Display sale tag & slashed old price'}
              </Text>
            </View>
            <Switch value={hasDiscount} onValueChange={setHasDiscount} trackColor={{ false: colors.border, true: colors.tint }} thumbColor="#fff" />
          </View>

          {hasDiscount && (
            <View style={styles.formField}>
              <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'درصد تخفیف (%)' : 'Discount Percent (%)'}
              </Text>
              <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, textAlign: 'left' }]}
                  placeholder="15"
                  keyboardType="numeric"
                  value={discountPercent}
                  onChangeText={setDiscountPercent}
                />
              </View>
            </View>
          )}

          {/* Coupon Switch */}
          <View style={[styles.switchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>
                {isRTL ? 'ایجاد کد تخفیف اختصاصی' : 'Create Exclusive Coupon'}
              </Text>
            </View>
            <Switch value={enableCoupon} onValueChange={setEnableCoupon} trackColor={{ false: colors.border, true: colors.tint }} thumbColor="#fff" />
          </View>

          {enableCoupon && (
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'کد تخفیف' : 'Coupon Code'}
                </Text>
                <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <TextInput style={[styles.input, { color: colors.text, textAlign: 'left' }]} value={couponCode} onChangeText={setCouponCode} />
                </View>
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'مبلغ تخفیف ($)' : 'Discount ($)'}
                </Text>
                <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <TextInput style={[styles.input, { color: colors.text, textAlign: 'left' }]} keyboardType="numeric" value={couponValue} onChangeText={setCouponValue} />
                </View>
              </View>
            </View>
          )}

          {/* Auction Switch */}
          <View style={[styles.switchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>
                {isRTL ? 'علامت‌گذاری به‌عنوان حراجی زمانبندی' : 'Scheduled Auction Deal'}
              </Text>
            </View>
            <Switch value={isAuction} onValueChange={setIsAuction} trackColor={{ false: colors.border, true: colors.tint }} thumbColor="#fff" />
          </View>
        </Animated.View>

        {/* Store Distinction Options */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'مزایای ویژه فروشگاهی' : 'Store Specific Logistics'}
          </Text>

          <View style={[styles.switchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.switchTitle, { color: colors.text }]}>{isRTL ? 'ارسال سریع و اکسپرس' : 'Express Shipping'}</Text>
            <Switch value={enableExpress} onValueChange={setEnableExpress} trackColor={{ false: colors.border, true: colors.tint }} thumbColor="#fff" />
          </View>

          <View style={[styles.switchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.switchTitle, { color: colors.text }]}>{isRTL ? 'پرداخت در محل (COD)' : 'Cash on Delivery'}</Text>
            <Switch value={enableCod} onValueChange={setEnableCod} trackColor={{ false: colors.border, true: colors.tint }} thumbColor="#fff" />
          </View>

          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'شرایط گارانتی و ضمانت' : 'Warranty & Return Policy'}
            </Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TextInput style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]} value={warrantyDays} onChangeText={setWarrantyDays} />
            </View>
          </View>
        </Animated.View>

        <TouchableOpacity
          style={[styles.bigPublishBtn, { backgroundColor: colors.tint }]}
          onPress={handlePublish}
          activeOpacity={0.88}
        >
          <Iconify icon="solar:bag-smile-bold-duotone" size={22} color="#fff" />
          <Text style={styles.bigPublishBtnText}>{isRTL ? 'انتشار رسمی محصول در فروشگاه' : 'Publish Product'}</Text>
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
  publishBtn: {
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 120 },
  card: { borderRadius: 24, padding: 18, borderWidth: 1, gap: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  imagePickerBox: { height: 180, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  pickedImage: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  cameraBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  cameraBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  formField: { gap: 6 },
  label: { fontSize: 13, fontWeight: '700' },
  inputBox: { height: 50, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, alignItems: 'center', gap: 10 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', height: '100%' },
  textareaBox: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, minHeight: 85 },
  textarea: { fontSize: 14, fontWeight: '600', minHeight: 65, textAlignVertical: 'top' },
  categoryChips: { gap: 8, paddingVertical: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '700' },
  switchRow: { alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 4 },
  switchTitle: { fontSize: 14, fontWeight: '700' },
  switchDesc: { fontSize: 12, marginTop: 2 },
  profitPreview: { padding: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center', gap: 8 },
  profitText: { fontSize: 13, fontWeight: '800' },
  bigPublishBtn: { height: 56, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 },
  bigPublishBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
