import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useStore } from "@/hooks/use-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mobileCartService, mobileOrderService, productService } from "@/services/api";
import { PageLoader } from "@/components/ui/Loading";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  AltArrowLeftBrokenIcon,
  AltArrowRightBrokenIcon,
  CartLargeMinimalisticBrokenIcon,
  MinusSquareBrokenIcon,
  AddSquareBrokenIcon,
  TrashBinTrashBrokenIcon,
  TagBoldIcon,
  Bag2BrokenIcon,
  DeliveryBrokenIcon,
  ShieldCheckBoldIcon,
  Shop2BrokenIcon,
} from "@/components/icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CartScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === "fa";

  const [statusMsg, setStatusMsg] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // e.g. 10% or fixed amount
  const [discountError, setDiscountError] = useState("");

  // 1. Fetch Cart
  const { data: cartItems = [], isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: mobileCartService.getCart,
  });

  // 2. Fetch Products to display rich product info (title, image, price)
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });

  // Map product details onto cart items
  const productsMap = new Map(allProducts.map((p: any) => [p.id, p]));

  const enrichedCartItems = cartItems.map((item: any) => {
    const product = productsMap.get(item.product_id);
    return {
      ...item,
      title: product?.name || (isRTL ? `محصول ${item.product_id.substring(0, 6)}` : `Product ${item.product_id.substring(0, 6)}`),
      image: product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      unitPrice: product?.price || 120, // fallback sample price
    };
  });

  // Calculations
  const subtotal = enrichedCartItems.reduce(
    (acc: number, item: any) => acc + item.unitPrice * item.quantity,
    0
  );
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shippingFee = subtotal > 300 || subtotal === 0 ? 0 : 15;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const freeShippingThreshold = 300;
  const freeShippingProgress = Math.min(1, subtotal / freeShippingThreshold);

  // Mutations
  const updateQtyMutation = useMutation({
    mutationFn: ({ itemId, qty }: { itemId: string; qty: number }) => {
      if (qty <= 0) {
        return mobileCartService.removeCartItem(itemId);
      }
      return mobileCartService.updateCartItem(itemId, qty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: any) => {
      setStatusMsg(err.message);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      for (const item of cartItems) {
        await mobileCartService.removeCartItem(item.item_id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleProceedToCheckout = () => {
    router.push({
      pathname: "/checkout",
      params: {
        discountPercent: appliedDiscount.toString(),
        promoCode: promoCode,
      },
    });
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === "KUTIK20" || promoCode.trim().toUpperCase() === "CARDIANI") {
      setAppliedDiscount(20);
      setDiscountError("");
    } else {
      setDiscountError(isRTL ? "کد تخفیف نامعتبر است" : "Invalid coupon code");
    }
  };

  if (isCartLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <PageLoader text={isRTL ? "در حال بارگذاری سبد خرید..." : "Loading cart..."} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 12),
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={[styles.headerContent, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            {isRTL ? (
              <AltArrowRightBrokenIcon size={22} color={colors.text} />
            ) : (
              <AltArrowLeftBrokenIcon size={22} color={colors.text} />
            )}
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {isRTL ? "سبد خرید" : "Shopping Cart"}
            </Text>
            {cartItems.length > 0 && (
              <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "600" }}>
                {cartItems.reduce((acc: number, curr: any) => acc + curr.quantity, 0)}{" "}
                {isRTL ? "کالا در سبد شما" : "items in your cart"}
              </Text>
            )}
          </View>

          {cartItems.length > 0 ? (
            <TouchableOpacity
              onPress={() => clearCartMutation.mutate()}
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.7}
            >
              <TrashBinTrashBrokenIcon size={20} color={colors.destructive} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 42 }} />
          )}
        </View>
      </View>

      {/* Notification status banner */}
      {statusMsg ? (
        <Animated.View
          entering={FadeInDown}
          style={[styles.statusBanner, { backgroundColor: colors.tint + "20", borderColor: colors.tint }]}
        >
          <ShieldCheckBoldIcon size={20} color={colors.tint} />
          <Text style={[styles.statusText, { color: colors.tint }]}>{statusMsg}</Text>
        </Animated.View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: enrichedCartItems.length > 0 ? 180 : 40 },
        ]}
      >
        {enrichedCartItems.length === 0 ? (
          <Animated.View entering={FadeInUp.duration(600)} style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <CartLargeMinimalisticBrokenIcon size={80} color={colors.tint} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {isRTL ? "سبد خرید شما خالی است" : "Your cart is empty"}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {isRTL
                ? "محصولات مورد علاقه خود را پیدا کنید و به سبد اضافه کنید."
                : "Explore our collection and add your favorite products."}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)")}
              style={[styles.shopNowBtn, { backgroundColor: colors.tint }]}
              activeOpacity={0.8}
            >
              <Shop2BrokenIcon size={22} color="#fff" />
              <Text style={styles.shopNowText}>{isRTL ? "مشاهده محصولات" : "Browse Products"}</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            {/* Free Shipping Bar */}
            <View
              style={[
                styles.shippingCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.shippingHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <DeliveryBrokenIcon size={22} color={colors.tint} />
                <Text style={[styles.shippingTitle, { color: colors.text }]}>
                  {subtotal >= freeShippingThreshold
                    ? isRTL
                      ? "ارسال رایگان به شما تعلق گرفت! 🎉"
                      : "You unlocked Free Shipping! 🎉"
                    : isRTL
                      ? `فقط $${(freeShippingThreshold - subtotal).toFixed(0)} دیگر تا ارسال رایگان`
                      : `$${(freeShippingThreshold - subtotal).toFixed(0)} away from Free Shipping`}
                </Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${freeShippingProgress * 100}%`,
                      backgroundColor: colors.tint,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Cart Items List */}
            <View style={styles.itemsSection}>
              {enrichedCartItems.map((item: any, index: number) => (
                <Animated.View
                  key={item.item_id}
                  entering={FadeInDown.delay(index * 80).duration(400)}
                  exiting={FadeOut}
                  layout={Layout.springify()}
                  style={[
                    styles.cartCard,
                    {
                      flexDirection: isRTL ? "row-reverse" : "row",
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" transition={300} />

                  <View style={[styles.itemDetails, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                    <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                      {item.title}
                    </Text>

                    <Text style={[styles.unitPrice, { color: colors.tint }]}>
                      ${item.unitPrice}
                    </Text>

                    <View style={[styles.itemFooter, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                      {/* Quantity Controller */}
                      <View
                        style={[
                          styles.qtyContainer,
                          {
                            flexDirection: isRTL ? "row-reverse" : "row",
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            updateQtyMutation.mutate({ itemId: item.item_id, qty: item.quantity - 1 })
                          }
                          style={styles.qtyActionBtn}
                          activeOpacity={0.6}
                        >
                          <MinusSquareBrokenIcon size={18} color={colors.text} />
                        </TouchableOpacity>

                        <Text style={[styles.qtyNumber, { color: colors.text }]}>{item.quantity}</Text>

                        <TouchableOpacity
                          onPress={() =>
                            updateQtyMutation.mutate({ itemId: item.item_id, qty: item.quantity + 1 })
                          }
                          style={styles.qtyActionBtn}
                          activeOpacity={0.6}
                        >
                          <AddSquareBrokenIcon size={18} color={colors.text} />
                        </TouchableOpacity>
                      </View>

                      {/* Total for item */}
                      <Text style={[styles.itemTotalPrice, { color: colors.text }]}>
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => updateQtyMutation.mutate({ itemId: item.item_id, qty: 0 })}
                    style={styles.deleteBtn}
                    activeOpacity={0.6}
                  >
                    <TrashBinTrashBrokenIcon size={18} color={colors.destructive} />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Promo Code Input */}
            <View
              style={[
                styles.promoCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.promoRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <View style={[styles.inputWrapper, { flexDirection: isRTL ? "row-reverse" : "row", borderColor: colors.border, backgroundColor: colors.surface }]}>
                  <TagBoldIcon size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[
                      styles.promoInput,
                      { color: colors.text, textAlign: isRTL ? "right" : "left" },
                    ]}
                    placeholder={isRTL ? "کد تخفیف (مثال: KUTIK20)" : "Promo code (e.g. KUTIK20)"}
                    placeholderTextColor={colors.textSecondary}
                    value={promoCode}
                    onChangeText={(val) => {
                      setPromoCode(val);
                      setDiscountError("");
                    }}
                    autoCapitalize="characters"
                  />
                </View>
                <TouchableOpacity
                  onPress={handleApplyPromo}
                  style={[styles.applyBtn, { backgroundColor: colors.tint }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyBtnText}>{isRTL ? "اعمال" : "Apply"}</Text>
                </TouchableOpacity>
              </View>

              {appliedDiscount > 0 ? (
                <Text style={{ marginTop: 8, color: colors.success, fontSize: 13, fontWeight: "700", textAlign: isRTL ? "right" : "left" }}>
                  {isRTL ? `کد تخفیف ${appliedDiscount}٪ اعمال شد!` : `${appliedDiscount}% coupon applied!`}
                </Text>
              ) : null}

              {discountError ? (
                <Text style={{ marginTop: 8, color: colors.destructive, fontSize: 13, fontWeight: "600", textAlign: isRTL ? "right" : "left" }}>
                  {discountError}
                </Text>
              ) : null}
            </View>

            {/* Order Summary */}
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.summaryTitle, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
                {isRTL ? "خلاصه فاکتور" : "Order Summary"}
              </Text>

              <View style={[styles.summaryRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  {isRTL ? "جمع کل خرید" : "Subtotal"}
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>${subtotal.toFixed(2)}</Text>
              </View>

              {appliedDiscount > 0 && (
                <View style={[styles.summaryRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <Text style={[styles.summaryLabel, { color: colors.success }]}>
                    {isRTL ? `تخفیف (${appliedDiscount}٪)` : `Discount (${appliedDiscount}%)`}
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.success }]}>
                    -${discountAmount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={[styles.summaryRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  {isRTL ? "هزینه ارسال" : "Shipping Fee"}
                </Text>
                <Text style={[styles.summaryValue, { color: shippingFee === 0 ? colors.success : colors.text }]}>
                  {shippingFee === 0 ? (isRTL ? "رایگان" : "Free") : `$${shippingFee.toFixed(2)}`}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={[styles.summaryRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <Text style={[styles.grandTotalLabel, { color: colors.text }]}>
                  {isRTL ? "مبلغ قابل پرداخت" : "Total Amount"}
                </Text>
                <Text style={[styles.grandTotalValue, { color: colors.tint }]}>
                  ${grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Floating Bottom Checkout Bar */}
      {enrichedCartItems.length > 0 && (
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={[
            styles.checkoutFooter,
            {
              paddingBottom: Math.max(insets.bottom, 16),
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
          ]}
        >
          <View style={[styles.checkoutContent, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={{ alignItems: isRTL ? "flex-end" : "flex-start" }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: "600" }}>
                {isRTL ? "جمع نهایی" : "Total Payment"}
              </Text>
              <Text style={{ fontSize: 22, fontWeight: "900", color: colors.text }}>
                ${grandTotal.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleProceedToCheckout}
              style={[
                styles.checkoutButton,
                { backgroundColor: colors.tint },
              ]}
              activeOpacity={0.85}
            >
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                <Bag2BrokenIcon size={20} color="#fff" />
                <Text style={styles.checkoutButtonText}>
                  {isRTL ? "ادامه و تکمیل ثبت خرید" : "Proceed to Checkout"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { borderBottomWidth: 1 },
  headerContent: {
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", letterSpacing: -0.4 },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusText: { fontSize: 13, fontWeight: "700", flex: 1 },
  scrollContent: { padding: Spacing.md, gap: Spacing.md },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyIconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  emptyTitle: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  shopNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: Spacing.xl,
    paddingHorizontal: 24,
    height: 52,
    borderRadius: 26,
  },
  shopNowText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  shippingCard: {
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  shippingHeader: { alignItems: "center", gap: 8 },
  shippingTitle: { fontSize: 13, fontWeight: "700", flex: 1 },
  progressTrack: { height: 6, borderRadius: 3, width: "100%", overflow: "hidden" },
  progressBar: { height: "100%", borderRadius: 3 },
  itemsSection: { gap: Spacing.md },
  cartCard: {
    padding: Spacing.sm,
    borderRadius: 18,
    borderWidth: 1,
    gap: Spacing.md,
    position: "relative",
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  itemDetails: { flex: 1, justifyContent: "space-between", paddingVertical: 2 },
  itemTitle: { fontSize: 15, fontWeight: "700", lineHeight: 20 },
  unitPrice: { fontSize: 15, fontWeight: "800", marginTop: 2 },
  itemFooter: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  qtyContainer: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 4,
  },
  qtyActionBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyNumber: {
    fontSize: 14,
    fontWeight: "800",
    paddingHorizontal: 8,
    minWidth: 24,
    textAlign: "center",
  },
  itemTotalPrice: { fontSize: 16, fontWeight: "900" },
  deleteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
  },
  promoCard: {
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
  },
  promoRow: { gap: Spacing.sm, alignItems: "center" },
  inputWrapper: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  promoInput: { flex: 1, fontSize: 14, fontWeight: "600" },
  applyBtn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  summaryTitle: { fontSize: 16, fontWeight: "800", marginBottom: Spacing.xs },
  summaryRow: { justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 14, fontWeight: "600" },
  summaryValue: { fontSize: 15, fontWeight: "700" },
  divider: { height: 1, marginVertical: Spacing.xs },
  grandTotalLabel: { fontSize: 16, fontWeight: "800" },
  grandTotalValue: { fontSize: 20, fontWeight: "900" },
  checkoutFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  checkoutContent: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkoutButton: {
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
