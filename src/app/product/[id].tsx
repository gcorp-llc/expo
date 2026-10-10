import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Iconify } from "@/components/ui/Iconify";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, mobileCartService } from "@/services/api";
import { useStore } from "@/hooks/use-store";
import { BentoProductSkeleton } from "@/components/ui/BentoSkeleton";
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

const { width } = Dimensions.get("window");
const GALLERY_HEIGHT = 360;

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
  const [comment, setComment] = useState("");
  const [reviewOrderId, setReviewOrderId] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const handleAddToCart = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setStatusMsg({
      text: isRTL ? 'با موفقیت به سبد خرید اضافه شد!' : 'Added to cart successfully!',
      type: 'success',
    });
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    mobileCartService.addToCart(id as string, undefined, 1);
  }, [id, isRTL, queryClient]);

  const submitReviewMutation = useMutation({
    mutationFn: () =>
      productService.submitReview(id as string, reviewOrderId, rating, comment),
    onSuccess: () => {
      setStatusMsg(isRTL ? "دیدگاه شما با موفقیت ثبت گردید!" : "Review submitted successfully!");
      setComment("");
      setReviewOrderId("");
      queryClient.invalidateQueries({ queryKey: ["product-reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["product-rating-summary", id] });
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

  const headerImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-GALLERY_HEIGHT, 0, GALLERY_HEIGHT],
            [-GALLERY_HEIGHT / 2, 0, GALLERY_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollY.value, [-GALLERY_HEIGHT, 0, GALLERY_HEIGHT], [1.8, 1, 1]),
        },
      ],
    };
  });

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `${product.name} - ${product.price} USD\n${product.description}`,
      });
    } catch (e) {
      // share ignored
    }
  };

  const handleStartChatWithSeller = () => {
    // Navigate to chat route with seller id/name parameter
    const sellerId = (product as any)?.seller_id || (product as any)?.user_id || "seller-1";
    const sellerName = (product as any)?.seller_name || (product as any)?.shop_name || (isRTL ? "فروشنده کاردیانی" : "Cardiani Seller");
    router.push({
      pathname: "/chat/[id]",
      params: { id: sellerId, name: sellerName },
    });
  };

  const imagesList = (product as any)?.images?.length
    ? (product as any).images
    : [
        (product as any)?.image || (product as any)?.thumbnail || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      ];

  const t = {
    reviews: isRTL ? "دیدگاه" : "Reviews",
    addToCart: isRTL ? "افزودن به سبد خرید" : "Add to Cart",
    description: isRTL ? "توضیحات و مشخصات" : "Description & Specifications",
    seller: isRTL ? "فروشگاه و غرفه‌دار" : "Store & Seller Info",
    chatWithSeller: isRTL ? "گفتگو با فروشنده" : "Chat with Seller",
    warranty: isRTL ? "گارانتی اصالت و سلامت" : "Guaranteed Authenticity",
    shipping: isRTL ? "ارسال سریع کاردیانی" : "Fast Shipping",
    notFound: isRTL ? "محصول یافت نشد." : "Product not found.",
    storeRating: isRTL ? "رضایت خریداران ۹۸٪" : "98% Positive Feedback",
  };

  if (isProductLoading) {
    return <BentoProductSkeleton />;
  }

  if (!product || productError) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Iconify icon="solar:box-broken" size={54} color={colors.textSecondary} />
        <Text style={{ color: colors.text, marginTop: 14, fontSize: 18, fontWeight: "bold" }}>
          {t.notFound}
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.tint, fontWeight: "bold", fontSize: 16 }}>
            {isRTL ? "بازگشت به فروشگاه" : "Go Back"}
          </Text>
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
  const sellerName = productAny.seller || productAny.shop_name || 'Kutik';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Action Floating Bar */}
      <View
        style={[
          styles.headerButtons,
          { top: insets.top + 8, flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.circleButton} activeOpacity={0.8}>
          <View style={styles.blurOverlay}>
            <Iconify
              icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
              size={22}
              color="#fff"
            />
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={handleShare} style={styles.circleButton} activeOpacity={0.8}>
            <View style={styles.blurOverlay}>
              <Iconify icon="solar:share-broken" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Gallery Carousel Bento Box Header */}
        <Animated.View style={[styles.imageContainer, headerImageStyle]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const idx = Math.round(x / width);
              setActiveImageIndex(idx);
            }}
            scrollEventThrottle={16}
          >
            {imagesList.map((imgUrl: string, idx: number) => (
              <Image
                key={idx}
                source={{ uri: imgUrl }}
                style={styles.image}
                contentFit="cover"
                transition={400}
              />
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          {imagesList.length > 1 && (
            <View style={styles.dotsContainer}>
              {imagesList.map((_: any, idx: number) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    activeImageIndex === idx ? { width: 20, backgroundColor: "#fff" } : { backgroundColor: "rgba(255,255,255,0.4)" },
                  ]}
                />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Bento Content Container */}
        <View style={[styles.bentoWrapper, { backgroundColor: colors.background }]}>
          {statusMsg ? (
            <Animated.View entering={FadeInDown} style={[styles.statusCard, { backgroundColor: colors.tint + "18", borderColor: colors.tint }]}>
              <Iconify icon="solar:shield-check-bold" size={20} color={colors.tint} />
              <Text style={[styles.statusMsgText, { color: colors.tint }]}>{statusMsg}</Text>
            </Animated.View>
          ) : null}

          {/* Bento Card 1: Product Title & Price */}
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={[
              styles.bentoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.titleRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <Text style={[styles.title, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
                {product.name}
              </Text>
            </View>

            <View style={[styles.priceTagRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <View style={styles.priceContainer}>
                <Text style={[styles.priceValue, { color: colors.tint }]}>
                  ${product.price.toLocaleString()}
                </Text>
                <Text style={[styles.priceSub, { color: colors.textSecondary }]}>
                  {isRTL ? "شامل تمامی مالیات‌ها" : "Taxes included"}
                </Text>
              </View>

              <View style={[styles.badge, { backgroundColor: colors.surfaceStrong }]}>
                <Iconify icon="solar:star-bold" size={16} color="#fbbf24" />
                <Text style={[styles.badgeText, { color: colors.text }]}>
                  {ratingSummary?.rating_average?.toFixed(1) || "5.0"}
                </Text>
                <Text style={[styles.badgeSub, { color: colors.textSecondary }]}>
                  ({ratingSummary?.rating_count || 0})
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Bento Grid Row 2: 2 Column Highlights (Warranty & Delivery) */}
          <View style={[styles.bentoRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Animated.View
              entering={FadeInDown.delay(100).duration(500)}
              style={[
                styles.bentoColCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: colors.tint + "18" }]}>
                <Iconify icon="solar:shield-check-broken" size={22} color={colors.tint} />
              </View>
              <Text style={[styles.colTitle, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
                {t.warranty}
              </Text>
              <Text style={[styles.colSub, { color: colors.textSecondary, textAlign: isRTL ? "right" : "left" }]}>
                {isRTL ? "تضمین اصالت کالا" : "100% Authentic"}
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(150).duration(500)}
              style={[
                styles.bentoColCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: colors.tint + "18" }]}>
                <Iconify icon="solar:delivery-broken" size={22} color={colors.tint} />
              </View>
              <Text style={[styles.colTitle, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
                {t.shipping}
              </Text>
              <Text style={[styles.colSub, { color: colors.textSecondary, textAlign: isRTL ? "right" : "left" }]}>
                {isRTL ? "تحویل ۱ الی ۳ روز کاری" : "1-3 Business Days"}
              </Text>
            </Animated.View>
          </View>

          {/* Bento Card 3: Seller Info & Quick Seller Chat */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={[
              styles.bentoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.sellerRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <View style={[styles.sellerAvatarCircle, { backgroundColor: colors.surfaceStrong }]}>
                <Iconify icon="solar:shop-2-broken" size={26} color={colors.tint} />
              </View>

              <View style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}>
                <Text style={[styles.sellerName, { color: colors.text }]}>
                  {(product as any)?.shop_name || (product as any)?.seller_name || (isRTL ? "فروشگاه رسمی کاردیانی" : "Cardiani Official Store")}
                </Text>
                <Text style={[styles.sellerStatus, { color: colors.success }]}>
                  {t.storeRating}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleStartChatWithSeller}
                style={[styles.chatBtn, { backgroundColor: colors.tint + "15", borderColor: colors.tint }]}
                activeOpacity={0.8}
              >
                <Iconify icon="solar:chat-line-broken" size={18} color={colors.tint} />
                <Text style={[styles.chatBtnText, { color: colors.tint }]}>
                  {t.chatWithSeller}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Bento Card 4: Description */}
          <Animated.View
            entering={FadeInDown.delay(250).duration(500)}
            style={[
              styles.bentoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardHeaderTitle, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
              {t.description}
            </Text>
            <Text style={[styles.descriptionText, { color: colors.textSecondary, textAlign: isRTL ? "right" : "left" }]}>
              {product.description}
            </Text>
          </Animated.View>

          {/* Bento Card 5: Ratings & Verified Customer Reviews + Seller Reply Support */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={[
              styles.bentoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardHeaderTitle, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
              {isRTL ? "نظرات و امتیازات خریداران" : "Ratings & Reviews"}
            </Text>

            {/* Write Review Form */}
            <View style={[styles.reviewInputBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.writeTitle, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
                {isRTL ? "ثبت نظر برای این محصول" : "Write a Review"}
              </Text>

              <TextInput
                style={[
                  styles.textInput,
                  { color: colors.text, borderColor: colors.border, textAlign: isRTL ? "right" : "left" },
                ]}
                placeholder={isRTL ? "کد سفارش (اختیاری)..." : "Order ID (optional)..."}
                placeholderTextColor={colors.textSecondary}
                value={reviewOrderId}
                onChangeText={setReviewOrderId}
              />

              <View
                style={[styles.starsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <TouchableOpacity key={s} onPress={() => setRating(s)} activeOpacity={0.7}>
                    <Iconify icon={s <= rating ? "solar:star-bold" : "solar:star-broken"} size={26} color="#fbbf24" />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[
                  styles.textInput,
                  { color: colors.text, borderColor: colors.border, textAlign: isRTL ? "right" : "left", height: 70 },
                ]}
                placeholder={isRTL ? "تجربه و نظر خود را بنویسید..." : "Write your review..."}
                placeholderTextColor={colors.textSecondary}
                multiline
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity
                onPress={() => submitReviewMutation.mutate()}
                disabled={submitReviewMutation.isPending || !comment.trim()}
                style={[
                  styles.submitBtn,
                  { backgroundColor: comment.trim() ? colors.tint : colors.border },
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>
                  {submitReviewMutation.isPending
                    ? isRTL
                      ? "در حال ارسال..."
                      : "Submitting..."
                    : isRTL
                      ? "ثبت و تایید نظر"
                      : "Submit Review"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Existing Customer Reviews List with Seller Reply */}
            <View style={{ marginTop: 18, gap: 14 }}>
              {reviews.length === 0 ? (
                <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: isRTL ? "right" : "left" }}>
                  {isRTL ? "هنوز دیدگاهی ثبت نشده است. اولین نفری باشید که نظر می‌دهید!" : "No reviews yet. Be the first to leave a review!"}
                </Text>
              ) : (
                reviews.map((rev: any) => (
                  <View key={rev.id} style={[styles.reviewItemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.reviewItemHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                      <View style={{ alignItems: isRTL ? "flex-end" : "flex-start" }}>
                        <Text style={[styles.reviewerName, { color: colors.text }]}>
                          {rev.user_name || (isRTL ? "خریدار تایید شده" : "Verified Customer")}
                        </Text>
                        <View style={[styles.starsSmallRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                          {Array.from({ length: rev.rating || 5 }).map((_, s) => (
                            <Iconify key={s} icon="solar:star-bold" size={12} color="#fbbf24" />
                          ))}
                        </View>
                      </View>
                    </View>

                    <Text style={[styles.reviewCommentText, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
                      {rev.comment}
                    </Text>

                    {/* Seller Reply Section if available */}
                    {rev.seller_reply ? (
                      <View style={[styles.sellerReplyBox, { backgroundColor: colors.card, borderColor: colors.tint + "40" }]}>
                        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <Iconify icon="solar:chat-round-line-bold" size={14} color={colors.tint} />
                          <Text style={[styles.sellerReplyTitle, { color: colors.tint }]}>
                            {isRTL ? "پاسخ فروشنده:" : "Seller Response:"}
                          </Text>
                        </View>
                        <Text style={[styles.sellerReplyText, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
                          {rev.seller_reply}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* Floating Bottom Action Bar Bento */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[
          styles.bottomFloatingBar,
          {
            paddingBottom: Math.max(insets.bottom, 12),
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={[styles.floatingBarContent, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          {/* Quick Chat Icon Button */}
          <TouchableOpacity
            onPress={handleStartChatWithSeller}
            style={[styles.floatingIconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Iconify icon="solar:chat-line-broken" size={22} color={colors.tint} />
          </TouchableOpacity>

          {/* Add to Cart Button */}
          <TouchableOpacity
            onPress={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending}
            style={[styles.addToCartBtn, { backgroundColor: colors.tint }]}
            activeOpacity={0.85}
          >
            <Iconify icon="solar:bag-2-broken" size={20} color="#fff" />
            <Text style={styles.addToCartText}>
              {addToCartMutation.isPending
                ? isRTL
                  ? "در حال افزوده شدن..."
                  : "Adding..."
                : t.addToCart}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerButtons: {
    position: "absolute",
    zIndex: 20,
    left: 16,
    right: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  circleButton: { width: 42, height: 42, borderRadius: 21, overflow: "hidden" },
  blurOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: { width: width, height: GALLERY_HEIGHT, position: "relative" },
  image: { width: width, height: GALLERY_HEIGHT },
  dotsContainer: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: { height: 6, width: 6, borderRadius: 3 },
  bentoWrapper: {
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 18,
    gap: 14,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusMsgText: { fontSize: 13, fontWeight: "700", flex: 1 },
  bentoCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
  },
  titleRow: { justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "800", flex: 1, lineHeight: 28 },
  priceTagRow: { justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  priceContainer: {},
  priceValue: { fontSize: 24, fontWeight: "900" },
  priceSub: { fontSize: 11, fontWeight: "600", marginTop: 2 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  badgeText: { fontWeight: "800", fontSize: 14 },
  badgeSub: { fontSize: 12 },
  bentoRow: { flexDirection: "row", gap: 12 },
  bentoColCard: {
    flex: 1,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  colTitle: { fontSize: 14, fontWeight: "800", marginBottom: 2 },
  colSub: { fontSize: 11, fontWeight: "600" },
  sellerRow: { alignItems: "center", gap: 12 },
  sellerAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerName: { fontSize: 15, fontWeight: "800" },
  sellerStatus: { fontSize: 12, fontWeight: "700", marginTop: 2 },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
  },
  chatBtnText: { fontSize: 12, fontWeight: "800" },
  cardHeaderTitle: { fontSize: 16, fontWeight: "800", marginBottom: 10 },
  descriptionText: { fontSize: 14, lineHeight: 22, fontWeight: "500" },
  reviewInputBox: { padding: 14, borderRadius: 18, borderWidth: 1, marginTop: 8 },
  writeTitle: { fontSize: 14, fontWeight: "800", marginBottom: 10 },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  starsRow: { justifyContent: "center", gap: 10, marginBottom: 10 },
  submitBtn: {
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  reviewItemCard: { padding: 12, borderRadius: 16, borderWidth: 1 },
  reviewItemHeader: { justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  reviewerName: { fontSize: 13, fontWeight: "800" },
  starsSmallRow: { gap: 2, marginTop: 2 },
  reviewCommentText: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
  sellerReplyBox: { padding: 10, borderRadius: 12, borderWidth: 1, marginTop: 8 },
  sellerReplyTitle: { fontSize: 12, fontWeight: "800" },
  sellerReplyText: { fontSize: 12, lineHeight: 17 },
  bottomFloatingBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  floatingBarContent: { alignItems: "center", gap: 12 },
  floatingIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addToCartText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
