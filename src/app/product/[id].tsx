import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Iconify } from "@/components/ui/Iconify";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, mobileCartService } from "@/services/api";
import { useStore } from "@/hooks/use-store";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 400;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === "fa";

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewOrderId, setReviewOrderId] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const scrollY = useSharedValue(0);

  // 1. Fetch Real Product Detail from API
  const { data: product, isLoading: isProductLoading, error: productError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id as string),
  });

  // 2. Fetch Real Product Reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["product-reviews", id],
    queryFn: () => productService.getProductReviews(id as string),
    enabled: !!id,
  });

  // 3. Fetch Real Product Rating Summary
  const { data: ratingSummary } = useQuery({
    queryKey: ["product-rating-summary", id],
    queryFn: () => productService.getProductRatingSummary(id as string),
    enabled: !!id,
  });

  // 4. Cart Add Mutation
  const addToCartMutation = useMutation({
    mutationFn: () => mobileCartService.addToCart(id as string, undefined, 1),
    onSuccess: () => {
      setStatusMsg(isRTL ? "با موفقیت به سبد خرید اضافه شد!" : "Added to cart successfully!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: any) => {
      setStatusMsg(isRTL ? `خطا: ${err.message}` : `Error: ${err.message}`);
    },
  });

  // 5. Review Submit Mutation
  const submitReviewMutation = useMutation({
    mutationFn: () => productService.submitReview(id as string, reviewOrderId, rating, comment),
    onSuccess: () => {
      setStatusMsg(isRTL ? "دیدگاه با موفقیت تایید و ثبت شد!" : "Review submitted successfully!");
      setComment("");
      setReviewOrderId("");
      queryClient.invalidateQueries({ queryKey: ["product-reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["product-rating-summary", id] });
    },
    onError: (err: any) => {
      setStatusMsg(isRTL ? `خطا: ${err.message}` : `Error: ${err.message}`);
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
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollY.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const t = {
    reviews: isRTL ? "دیدگاه" : "Reviews",
    addToCart: isRTL ? "افزودن به سبد خرید" : "Add to Cart",
    description: isRTL ? "توضیحات محصول" : "Description",
    seller: isRTL ? "فروشگاه" : "Seller",
    warranty: isRTL ? "گارانتی اصالت و سلامت فیزیکی" : "Authenticity & Health Warranty",
    shipping: isRTL ? "ارسال سریع کاردیانی" : "Fast Cardiani Shipping",
    loading: isRTL ? "در حال دریافت اطلاعات..." : "Loading product details...",
    notFound: isRTL ? "محصول یافت نشد." : "Product not found.",
  };

  if (isProductLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.textSecondary, marginTop: 12 }}>{t.loading}</Text>
      </View>
    );
  }

  if (!product || productError) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Iconify icon="solar:box-broken" size={48} color={colors.textSecondary} />
        <Text style={{ color: colors.text, marginTop: 12, fontWeight: "bold" }}>{t.notFound}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.tint, fontWeight: "bold" }}>{isRTL ? "بازگشت" : "Go Back"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header Buttons */}
      <View style={[styles.headerButtons, { top: insets.top + 10, flexDirection: isRTL ? "row-reverse" : "row" }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.circleButton}>
          <View style={[styles.blur, { backgroundColor: "rgba(0,0,0,0.3)" }]}>
            <Iconify
              icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
              size={24}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton}>
          <View style={[styles.blur, { backgroundColor: "rgba(0,0,0,0.3)" }]}>
            <Iconify icon="solar:share-broken" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <Animated.View style={[styles.imageContainer, headerImageStyle]}>
          <Animated.Image
            entering={FadeIn.duration(800)}
            source={{ uri: product.thumbnail || "https://images.unsplash.com/photo-1503376780353-7e6692767b70" }}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>

        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={styles.indicator} />

          {statusMsg ? (
            <View style={{ backgroundColor: colors.surfaceStrong, padding: 12, borderRadius: 12, marginBottom: 16 }}>
              <Text style={{ color: colors.tint, fontSize: 13, fontWeight: "bold", textAlign: "center" }}>
                {statusMsg}
              </Text>
            </View>
          ) : null}

          <Animated.View
            entering={FadeInDown.duration(600).delay(200)}
            style={[styles.titleRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}
          >
            <Text style={[styles.title, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
              {product.name}
            </Text>
            <Text style={[styles.price, { color: colors.tint }]}>
              {product.price.toLocaleString()} <Text style={{ fontSize: 12 }}>USD</Text>
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(600).delay(300)}
            style={[styles.metaRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}
          >
            <View
              style={[
                styles.ratingBox,
                { backgroundColor: colors.surfaceStrong, flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Iconify icon="solar:star-bold" size={16} color="#fbbf24" />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {ratingSummary?.rating_average?.toFixed(1) || "5.0"}
              </Text>
              <Text style={[styles.reviewsText, { color: colors.textSecondary }]}>
                ({ratingSummary?.rating_count || 0} {t.reviews})
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.tint + "15" }]}>
              <Text style={[styles.tagText, { color: colors.tint }]}>{product.sku}</Text>
            </View>
          </Animated.View>

          <View style={styles.divider} />

          <Animated.View entering={FadeInDown.duration(600).delay(400)} style={[styles.infoSection, { gap: 12 }]}>
            <View style={[styles.infoItem, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <Iconify icon="solar:shield-check-broken" size={20} color={colors.textSecondary} />
              <Text
                style={[
                  styles.infoItemText,
                  { color: colors.text, textAlign: isRTL ? "right" : "left", [isRTL ? "marginRight" : "marginLeft"]: 12 },
                ]}
              >
                {t.warranty}
              </Text>
            </View>
            <View style={[styles.infoItem, { flexDirection: isRTL ? "row-reverse" : "row", marginTop: 4 }]}>
              <Iconify icon="solar:delivery-broken" size={20} color={colors.textSecondary} />
              <Text
                style={[
                  styles.infoItemText,
                  { color: colors.text, textAlign: isRTL ? "right" : "left", [isRTL ? "marginRight" : "marginLeft"]: 12 },
                ]}
              >
                {t.shipping}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.divider} />

          <Animated.Text
            entering={FadeInDown.duration(600).delay(500)}
            style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}
          >
            {t.description}
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(600).delay(550)}
            style={[styles.description, { color: colors.textSecondary, textAlign: isRTL ? "right" : "left" }]}
          >
            {product.description}
          </Animated.Text>

          <View style={styles.divider} />

          {/* Ratings & Reviews aggregate distributions */}
          <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.reviewsSection}>
            <View style={[styles.sectionHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
                {isRTL ? "امتیازات خریداران" : "Ratings & Reviews"}
              </Text>
            </View>

            <View style={[styles.writeReviewCard, { backgroundColor: colors.surfaceStrong }]}>
              <Text style={[styles.writeTitle, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
                {isRTL ? "ثبت نظر خریداران" : "Write a Verified Review"}
              </Text>

              <TextInput
                style={[
                  styles.commentInput,
                  { color: colors.text, borderColor: colors.border, textAlign: isRTL ? "right" : "left", height: 40 },
                ]}
                placeholder={isRTL ? "کد سفارش خرید شده را وارد نمایید..." : "Enter your order ID..."}
                placeholderTextColor={colors.textSecondary}
                value={reviewOrderId}
                onChangeText={setReviewOrderId}
              />

              <View style={[styles.starsRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <TouchableOpacity key={s} onPress={() => setRating(s)}>
                    <Iconify icon={s <= rating ? "solar:star-bold" : "solar:star-broken"} size={28} color="#fbbf24" />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[
                  styles.commentInput,
                  { color: colors.text, borderColor: colors.border, textAlign: isRTL ? "right" : "left" },
                ]}
                placeholder={isRTL ? "دیدگاه خود را بنویسید..." : "Share your experience..."}
                placeholderTextColor={colors.textSecondary}
                multiline
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity
                onPress={() => submitReviewMutation.mutate()}
                style={[styles.submitBtn, { backgroundColor: colors.tint }]}
              >
                <Text style={styles.submitBtnText}>
                  {submitReviewMutation.isPending
                    ? isRTL
                      ? "در حال ثبت..."
                      : "Submitting..."
                    : isRTL
                      ? "ثبت دیدگاه"
                      : "Submit Review"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Render reviews */}
            <View style={styles.commentsList}>
              {reviews.length === 0 ? (
                <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: isRTL ? "right" : "left" }}>
                  {isRTL ? "هیچ دیدگاهی هنوز ثبت نشده است." : "No reviews registered yet."}
                </Text>
              ) : (
                reviews.map((rev: any) => (
                  <View key={rev.id} style={styles.commentItem}>
                    <View style={[styles.commentHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                      <View
                        style={{ flex: 1, [isRTL ? "marginRight" : "marginLeft"]: 12, alignItems: isRTL ? "flex-end" : "flex-start" }}
                      >
                        <Text style={[styles.reviewerName, { color: colors.text }]}>
                          {isRTL ? "خریدار محصول" : "Verified Buyer"}
                        </Text>
                        <View style={[styles.starsSmall, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                          {Array.from({ length: rev.rating }).map((_, s) => (
                            <Iconify key={s} icon="solar:star-bold" size={10} color="#fbbf24" />
                          ))}
                        </View>
                      </View>
                    </View>
                    <Text style={[styles.commentText, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
                      {rev.comment}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* Footer buy button */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + 10, backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <View style={[styles.footerContent, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <TouchableOpacity onPress={() => addToCartMutation.mutate()} style={styles.buyButtonWrapper}>
            <View style={[styles.buyButton, { backgroundColor: colors.tint }]}>
              <Text style={[styles.buyButtonText, { color: "#fff" }]}>
                {addToCartMutation.isPending ? (isRTL ? "در حال افزودن..." : "Adding...") : t.addToCart}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            style={[
              styles.cartIconBtn,
              { borderWidth: 1.2, borderColor: colors.border, backgroundColor: colors.card, overflow: "hidden" },
            ]}
          >
            <View style={styles.blur}>
              <Iconify icon="solar:cart-large-broken" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerButtons: { position: "absolute", zIndex: 10, left: 20, right: 20, justifyContent: "space-between", alignItems: "center" },
  circleButton: { width: 44, height: 44, borderRadius: 22, overflow: "hidden" },
  blur: { flex: 1, alignItems: "center", justifyContent: "center" },
  imageContainer: { width: width, height: IMG_HEIGHT },
  image: { width: "100%", height: "100%" },
  content: { marginTop: -30, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 20, paddingTop: 10, minHeight: 500 },
  indicator: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 20 },
  titleRow: { justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "800", flex: 1 },
  price: { fontSize: 24, fontWeight: "800", marginLeft: 12 },
  metaRow: { alignItems: "center", gap: 12, marginBottom: 20 },
  ratingBox: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignItems: "center", gap: 6 },
  ratingText: { fontWeight: "700", fontSize: 14 },
  reviewsText: { fontSize: 12 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { fontSize: 12, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginVertical: 20 },
  infoSection: { marginBottom: 10 },
  infoItem: { alignItems: "center" },
  infoItemText: { fontSize: 14, fontWeight: "500" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 24 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)" },
  footerContent: { alignItems: "center", gap: 12 },
  buyButtonWrapper: { flex: 1, height: 54, borderRadius: 18, overflow: "hidden" },
  buyButton: { flex: 1, height: 54, alignItems: "center", justifyContent: "center" },
  buyButtonText: { fontSize: 16, fontWeight: "800" },
  reviewsSection: { paddingBottom: 20 },
  sectionHeader: { justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  starsRow: { justifyContent: "center", gap: 12, marginBottom: 20 },
  commentInput: { height: 100, borderRadius: 16, borderWidth: 1, padding: 12, fontSize: 14, fontWeight: "500", marginBottom: 16 },
  submitBtn: { height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  submitBtnText: { color: "#fff", fontWeight: "700" },
  commentsList: { gap: 24 },
  commentItem: { gap: 12 },
  commentHeader: { alignItems: "center" },
  reviewerName: { fontSize: 15, fontWeight: "700" },
  starsSmall: { gap: 2 },
  commentText: { fontSize: 14, lineHeight: 22, fontWeight: "500" },
  cartIconBtn: { width: 54, height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  writeReviewCard: { padding: 20, borderRadius: 24, marginBottom: 32 },
  writeTitle: { fontSize: 16, fontWeight: "800", marginBottom: 16 },
});
