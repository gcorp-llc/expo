import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, mobileCartService } from '@/services/api';
import { useStore } from '@/hooks/use-store';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  FadeIn,
  FadeInDown,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 380;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, favorites, toggleFavorite } = useStore();
  const isRTL = language === 'fa';

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewOrderId, setReviewOrderId] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );

  const scrollY = useSharedValue(0);
  const isFavorite = favorites.includes(id as string);

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id as string),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['product-reviews', id],
    queryFn: () => productService.getProductReviews(id as string),
    enabled: !!id,
  });

  const { data: ratingSummary } = useQuery({
    queryKey: ['product-rating-summary', id],
    queryFn: () => productService.getProductRatingSummary(id as string),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => mobileCartService.addToCart(id as string, undefined, 1),
    onSuccess: () => {
      setStatusMsg({
        text: isRTL ? 'با موفقیت به سبد خرید اضافه شد!' : 'Added to cart successfully!',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    onError: (err: any) => {
      setStatusMsg({
        text: isRTL ? `خطا: ${err.message}` : `Error: ${err.message}`,
        type: 'error',
      });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: () =>
      productService.submitReview(id as string, reviewOrderId, rating, comment),
    onSuccess: () => {
      setStatusMsg({
        text: isRTL ? 'دیدگاه با موفقیت ثبت شد!' : 'Review submitted successfully!',
        type: 'success',
      });
      setComment('');
      setReviewOrderId('');
      queryClient.invalidateQueries({ queryKey: ['product-reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['product-rating-summary', id] });
    },
    onError: (err: any) => {
      setStatusMsg({
        text: isRTL ? `خطا: ${err.message}` : `Error: ${err.message}`,
        type: 'error',
      });
    },
  });

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerImageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-IMG_HEIGHT, 0, IMG_HEIGHT],
          [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.4],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [-IMG_HEIGHT, 0, IMG_HEIGHT],
          [1.6, 1, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(id as string);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [id, toggleFavorite]);

  const t = {
    reviews: isRTL ? 'دیدگاه' : 'Reviews',
    addToCart: isRTL ? 'افزودن به سبد خرید' : 'Add to Cart',
    description: isRTL ? 'توضیحات محصول' : 'Description',
    seller: isRTL ? 'فروشنده' : 'Seller',
    warranty: isRTL ? 'گارانتی اصالت و سلامت فیزیکی' : 'Authenticity & Condition Warranty',
    shipping: isRTL ? 'ارسال سریع کاردیانی' : 'Fast Cardiani Shipping',
    loading: isRTL ? 'در حال دریافت اطلاعات...' : 'Loading product details...',
    notFound: isRTL ? 'محصول یافت نشد.' : 'Product not found.',
    goBack: isRTL ? 'بازگشت' : 'Go Back',
    writeReview: isRTL ? 'ثبت دیدگاه' : 'Write a Review',
    orderIdPlaceholder: isRTL ? 'کد سفارش...' : 'Order ID...',
    commentPlaceholder: isRTL ? 'تجربه خود را بنویسید...' : 'Share your experience...',
    submit: isRTL ? 'ثبت دیدگاه' : 'Submit Review',
    submitting: isRTL ? 'در حال ثبت...' : 'Submitting...',
    noReviews: isRTL ? 'هنوز دیدگاهی ثبت نشده است.' : 'No reviews yet.',
    verifiedBuyer: isRTL ? 'خریدار تأیید‌شده' : 'Verified Buyer',
    ratingsTitle: isRTL ? 'امتیازات و دیدگاه‌ها' : 'Ratings & Reviews',
  };

  if (isProductLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.textSecondary, marginTop: 14, fontSize: 14 }}>
          {t.loading}
        </Text>
      </View>
    );
  }

  if (!product || productError) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.emptyIcon, { backgroundColor: colors.secondaryBackground }]}>
          <Iconify icon="solar:box-broken" size={40} color={colors.textSecondary} />
        </View>
        <Text style={{ color: colors.text, marginTop: 14, fontWeight: '700', fontSize: 16 }}>
          {t.notFound}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.tint, marginTop: 20 }]}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>{t.goBack}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const productAny = product as any;
  const imageUri =
    productAny.thumbnail ||
    productAny.image ||
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70';
  const price = Number(productAny.price) || 0;
  const oldPrice = productAny.oldPrice ? Number(productAny.oldPrice) : null;
  const discount = productAny.discountPercentage;
  const avgRating = ratingSummary?.rating_average?.toFixed(1) || productAny.rating?.toFixed?.(1) || '5.0';
  const reviewCount = ratingSummary?.rating_count || productAny.reviews || reviews.length || 0;
  const sellerName = productAny.seller || productAny.shop_name || 'Cardiani';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Floating header buttons */}
      <View
        style={[
          styles.headerButtons,
          { top: insets.top + 8, flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.circleButton}>
          <View style={styles.circleInner}>
            <Iconify
              icon={isRTL ? 'solar:alt-arrow-right-broken' : 'solar:alt-arrow-left-broken'}
              size={22}
              color="#fff"
            />
          </View>
        </Pressable>

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
          <Pressable onPress={handleToggleFavorite} style={styles.circleButton}>
            <View style={styles.circleInner}>
              <Iconify
                icon={isFavorite ? 'solar:heart-bold' : 'solar:heart-broken'}
                size={22}
                color={isFavorite ? '#ef4444' : '#fff'}
              />
            </View>
          </Pressable>
          <Pressable style={styles.circleButton}>
            <View style={styles.circleInner}>
              <Iconify icon="solar:share-broken" size={22} color="#fff" />
            </View>
          </Pressable>
        </View>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        {/* Hero image */}
        <Animated.View style={[styles.imageContainer, headerImageStyle]}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'transparent']}
            style={styles.imageTopGradient}
          />
          {discount ? (
            <View style={[styles.discountBadge, { left: isRTL ? undefined : 16, right: isRTL ? 16 : undefined }]}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          ) : null}
        </Animated.View>

        {/* Content sheet */}
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={[styles.indicator, { backgroundColor: colors.border }]} />

          {statusMsg ? (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={[
                styles.statusBanner,
                {
                  backgroundColor:
                    statusMsg.type === 'success'
                      ? colors.success + '18'
                      : colors.destructive + '18',
                  borderColor:
                    statusMsg.type === 'success'
                      ? colors.success + '40'
                      : colors.destructive + '40',
                },
              ]}
            >
              <Iconify
                icon={
                  statusMsg.type === 'success'
                    ? 'solar:check-circle-bold'
                    : 'solar:danger-circle-bold'
                }
                size={18}
                color={statusMsg.type === 'success' ? colors.success : colors.destructive}
              />
              <Text
                style={{
                  color: statusMsg.type === 'success' ? colors.success : colors.destructive,
                  fontSize: 13,
                  fontWeight: '700',
                  flex: 1,
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {statusMsg.text}
              </Text>
            </Animated.View>
          ) : null}

          {/* Title & Price */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.titleBlock}>
            <Text
              style={[
                styles.title,
                { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {productAny.name}
            </Text>

            <View
              style={[
                styles.priceRow,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <Text style={[styles.price, { color: colors.tint }]}>
                ${price.toLocaleString()}
              </Text>
              {oldPrice ? (
                <Text style={[styles.oldPrice, { color: colors.textSecondary }]}>
                  ${oldPrice.toLocaleString()}
                </Text>
              ) : null}
            </View>
          </Animated.View>

          {/* Meta: rating + category */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(180)}
            style={[styles.metaRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <View
              style={[
                styles.ratingBox,
                {
                  backgroundColor: colorScheme === 'light' ? '#FFF8E7' : colors.secondaryBackground,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                },
              ]}
            >
              <Iconify icon="solar:star-bold" size={15} color="#f59e0b" />
              <Text style={[styles.ratingText, { color: colors.text }]}>{avgRating}</Text>
              <Text style={[styles.reviewsText, { color: colors.textSecondary }]}>
                ({reviewCount} {t.reviews})
              </Text>
            </View>

            {(productAny.sku || productAny.category) && (
              <View style={[styles.tag, { backgroundColor: colors.tint + '14' }]}>
                <Text style={[styles.tagText, { color: colors.tint }]}>
                  {productAny.sku || productAny.category}
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Trust badges */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(240)}
            style={[styles.trustRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.trustItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.trustIcon, { backgroundColor: colors.success + '18' }]}>
                <Iconify icon="solar:shield-check-bold" size={18} color={colors.success} />
              </View>
              <Text
                style={[
                  styles.trustText,
                  { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
                ]}
                numberOfLines={2}
              >
                {t.warranty}
              </Text>
            </View>
            <View style={[styles.trustDivider, { backgroundColor: colors.border }]} />
            <View style={[styles.trustItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.trustIcon, { backgroundColor: colors.tint + '18' }]}>
                <Iconify icon="solar:delivery-bold" size={18} color={colors.tint} />
              </View>
              <Text
                style={[
                  styles.trustText,
                  { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
                ]}
                numberOfLines={2}
              >
                {t.shipping}
              </Text>
            </View>
          </Animated.View>

          {/* Seller card */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(300)}
            style={[
              styles.sellerCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={[styles.sellerAvatar, { backgroundColor: colors.tint + '20' }]}>
              <Iconify icon="solar:shop-2-bold" size={22} color={colors.tint} />
            </View>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                {t.seller}
              </Text>
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                {sellerName}
              </Text>
            </View>
            <Iconify
              icon={isRTL ? 'solar:alt-arrow-left-linear' : 'solar:alt-arrow-right-linear'}
              size={18}
              color={colors.textSecondary}
            />
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.duration(500).delay(360)} style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {t.description}
            </Text>
            <Text
              style={[
                styles.description,
                { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {productAny.description ||
                (isRTL ? 'توضیحاتی برای این محصول ثبت نشده است.' : 'No description available.')}
            </Text>
          </Animated.View>

          {/* Reviews */}
          <Animated.View entering={FadeInDown.duration(500).delay(420)} style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {t.ratingsTitle}
            </Text>

            <View
              style={[
                styles.writeReviewCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.writeTitle,
                  { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {t.writeReview}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    textAlign: isRTL ? 'right' : 'left',
                    height: 44,
                  },
                ]}
                placeholder={t.orderIdPlaceholder}
                placeholderTextColor={colors.textSecondary}
                value={reviewOrderId}
                onChangeText={setReviewOrderId}
              />

              <View
                style={[styles.starsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <TouchableOpacity key={s} onPress={() => setRating(s)} hitSlop={6}>
                    <Iconify
                      icon={s <= rating ? 'solar:star-bold' : 'solar:star-broken'}
                      size={28}
                      color="#f59e0b"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    textAlign: isRTL ? 'right' : 'left',
                    minHeight: 90,
                    textAlignVertical: 'top',
                  },
                ]}
                placeholder={t.commentPlaceholder}
                placeholderTextColor={colors.textSecondary}
                multiline
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity
                onPress={() => submitReviewMutation.mutate()}
                disabled={submitReviewMutation.isPending}
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor: colors.tint,
                    opacity: submitReviewMutation.isPending ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={styles.submitBtnText}>
                  {submitReviewMutation.isPending ? t.submitting : t.submit}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.commentsList}>
              {reviews.length === 0 ? (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 13,
                    textAlign: isRTL ? 'right' : 'left',
                    paddingVertical: 8,
                  }}
                >
                  {t.noReviews}
                </Text>
              ) : (
                reviews.map((rev: any) => (
                  <View
                    key={rev.id}
                    style={[
                      styles.commentItem,
                      { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.commentHeader,
                        { flexDirection: isRTL ? 'row-reverse' : 'row' },
                      ]}
                    >
                      <View
                        style={[
                          styles.reviewerAvatar,
                          { backgroundColor: colors.secondaryBackground },
                        ]}
                      >
                        <Iconify icon="solar:user-bold" size={16} color={colors.textSecondary} />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          [isRTL ? 'marginRight' : 'marginLeft']: 10,
                          alignItems: isRTL ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <Text style={[styles.reviewerName, { color: colors.text }]}>
                          {t.verifiedBuyer}
                        </Text>
                        <View
                          style={[
                            styles.starsSmall,
                            { flexDirection: isRTL ? 'row-reverse' : 'row' },
                          ]}
                        >
                          {Array.from({ length: rev.rating || 5 }).map((_, s) => (
                            <Iconify key={s} icon="solar:star-bold" size={11} color="#f59e0b" />
                          ))}
                        </View>
                      </View>
                    </View>
                    {rev.comment ? (
                      <Text
                        style={[
                          styles.commentText,
                          { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' },
                        ]}
                      >
                        {rev.comment}
                      </Text>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* Sticky footer CTA */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 12),
            backgroundColor: colorScheme === 'light' ? 'rgba(255,255,255,0.95)' : colors.surfaceStrong,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View
          style={[styles.footerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        >
          <TouchableOpacity
            onPress={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending}
            style={[styles.buyButton, { backgroundColor: colors.tint, opacity: addToCartMutation.isPending ? 0.75 : 1 }]}
            activeOpacity={0.85}
          >
            <Iconify icon="solar:cart-large-2-bold" size={20} color="#fff" />
            <Text style={styles.buyButtonText}>
              {addToCartMutation.isPending
                ? isRTL
                  ? 'در حال افزودن...'
                  : 'Adding...'
                : t.addToCart}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/cart')}
            style={[
              styles.cartIconBtn,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <Iconify icon="solar:bag-3-broken" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  headerButtons: {
    position: 'absolute',
    zIndex: 20,
    left: 16,
    right: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  circleInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 21,
  },
  imageContainer: {
    width,
    height: IMG_HEIGHT,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  imageTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  discountBadge: {
    position: 'absolute',
    bottom: 48,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  discountText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  content: {
    marginTop: -28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 8,
    minHeight: 400,
  },
  indicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  titleBlock: { marginBottom: 14 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 30,
    marginBottom: 8,
  },
  priceRow: {
    alignItems: 'center',
    gap: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  oldPrice: {
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  metaRow: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  ratingBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    gap: 5,
  },
  ratingText: { fontWeight: '700', fontSize: 13 },
  reviewsText: { fontSize: 12 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: { fontSize: 12, fontWeight: '700' },
  trustRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  trustIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 17,
  },
  trustDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 8,
  },
  sellerCard: {
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14.5,
    lineHeight: 24,
    fontWeight: '500',
  },
  writeReviewCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  writeTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 14,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  starsRow: {
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
  },
  submitBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  commentsList: { gap: 12 },
  commentItem: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  commentHeader: { alignItems: 'center' },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerName: { fontSize: 13, fontWeight: '700' },
  starsSmall: { gap: 2, marginTop: 3 },
  commentText: { fontSize: 13.5, lineHeight: 21, fontWeight: '500' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerContent: {
    alignItems: 'center',
    gap: 10,
  },
  buyButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  cartIconBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
