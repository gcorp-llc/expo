import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useStore } from "@/hooks/use-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, mobileOrderService } from "@/services/api";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import {
  AltArrowLeftBrokenIcon,
  AltArrowRightBrokenIcon,
  CheckCircleBoldIcon,
  DeliveryBrokenIcon,
  MapPointBrokenIcon,
  ShieldCheckBoldIcon,
  WalletMoneyBrokenIcon,
  AddSquareBrokenIcon,
  Bag2BrokenIcon,
} from "@/components/icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface Address {
  id: string;
  title: string;
  fullAddress: string;
  recipientName: string;
  phoneNumber: string;
  isDefault?: boolean;
}

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    title: "خانه",
    fullAddress: "تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۴، واحد ۵",
    recipientName: "کاربر کوتیک",
    phoneNumber: "۰۹۱۲۳۴۵۶۷۸۹",
    isDefault: true,
  },
  {
    id: "addr-2",
    title: "محل کار",
    fullAddress: "تهران، خیابان آزادی، ناحیه نوآوری شریف، برج فناوری، طبقه ۳",
    recipientName: "کاربر کوتیک",
    phoneNumber: "۰۹۱۲۹۸۷۶۵۴۳",
  },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ discountPercent?: string; promoCode?: string }>();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, cartItems, clearCart } = useStore();
  const isRTL = language === "fa";

  const discountPercent = Number(params.discountPercent || 0);

  // Address & Payment Selection
  const [selectedAddressId, setSelectedAddressId] = useState<string>("addr-1");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("card");

  // Success Modal
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  // Fetch product info
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });

  const productsMap = new Map(allProducts.map((p: any) => [p.id, p]));

  const enrichedItems = cartItems.map((ci) => {
    const product = productsMap.get(ci.id);
    return {
      id: ci.id,
      quantity: ci.quantity,
      title: product?.name || (isRTL ? `محصول ${ci.id}` : `Product ${ci.id}`),
      image: product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      unitPrice: product?.price || 120,
    };
  });

  const subtotal = enrichedItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = shippingMethod === "express" ? 35 : subtotal > 300 ? 0 : 15;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Order Placement
  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      // Execute checkout order
      const res = await mobileOrderService.checkout(selectedAddressId, params.promoCode);
      return res;
    },
    onSuccess: () => {
      const orderData = {
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString(isRTL ? "fa-IR" : "en-US"),
        total: grandTotal,
        itemCount: enrichedItems.reduce((acc, i) => acc + i.quantity, 0),
        address: DEFAULT_ADDRESSES.find((a) => a.id === selectedAddressId)?.fullAddress,
        payment: paymentMethod === "card" ? (isRTL ? "درگاه آنلاین کارت بانکی" : "Online Card") : (isRTL ? "کیف پول کاردیانی" : "Cardiani Wallet"),
      };
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setOrderConfirmed(orderData);
    },
  });

  const selectedAddr = DEFAULT_ADDRESSES.find((a) => a.id === selectedAddressId) || DEFAULT_ADDRESSES[0];

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

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? "نهایی‌سازی و ثبت خرید" : "Checkout"}
          </Text>

          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 160 }]}
      >
        {/* Step 1: Delivery Address */}
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <MapPointBrokenIcon size={22} color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {isRTL ? "نشانی تحویل سفارش" : "Delivery Address"}
            </Text>
          </View>

          {DEFAULT_ADDRESSES.map((addr) => {
            const isSelected = addr.id === selectedAddressId;
            return (
              <TouchableOpacity
                key={addr.id}
                onPress={() => setSelectedAddressId(addr.id)}
                activeOpacity={0.8}
                style={[
                  styles.optionBox,
                  {
                    backgroundColor: isSelected ? colors.tint + "12" : colors.surface,
                    borderColor: isSelected ? colors.tint : colors.border,
                    flexDirection: isRTL ? "row-reverse" : "row",
                  },
                ]}
              >
                <View style={[styles.radioCircle, { borderColor: isSelected ? colors.tint : colors.textSecondary }]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />}
                </View>

                <View style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start", gap: 4 }}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>{addr.title}</Text>
                  <Text style={[styles.optionSub, { color: colors.textSecondary, textAlign: isRTL ? "right" : "left" }]}>
                    {addr.fullAddress}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.tint }}>
                    {addr.recipientName} • {addr.phoneNumber}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Step 2: Shipping Method */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <DeliveryBrokenIcon size={22} color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {isRTL ? "روش ارسال" : "Shipping Method"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShippingMethod("standard")}
            activeOpacity={0.8}
            style={[
              styles.optionBox,
              {
                backgroundColor: shippingMethod === "standard" ? colors.tint + "12" : colors.surface,
                borderColor: shippingMethod === "standard" ? colors.tint : colors.border,
                flexDirection: isRTL ? "row-reverse" : "row",
              },
            ]}
          >
            <View style={[styles.radioCircle, { borderColor: shippingMethod === "standard" ? colors.tint : colors.textSecondary }]}>
              {shippingMethod === "standard" && <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />}
            </View>

            <View style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {isRTL ? "ارسال معمولی (۲ تا ۴ روز کاری)" : "Standard Shipping (2-4 Days)"}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: shippingFee === 0 ? colors.success : colors.text, marginTop: 2 }}>
                {subtotal > 300 ? (isRTL ? "رایگان" : "Free") : "$15.00"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShippingMethod("express")}
            activeOpacity={0.8}
            style={[
              styles.optionBox,
              {
                backgroundColor: shippingMethod === "express" ? colors.tint + "12" : colors.surface,
                borderColor: shippingMethod === "express" ? colors.tint : colors.border,
                flexDirection: isRTL ? "row-reverse" : "row",
              },
            ]}
          >
            <View style={[styles.radioCircle, { borderColor: shippingMethod === "express" ? colors.tint : colors.textSecondary }]}>
              {shippingMethod === "express" && <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />}
            </View>

            <View style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {isRTL ? "ارسال اکسپرس پیشتاز (۲۴ ساعته)" : "Express Overnight Delivery"}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text, marginTop: 2 }}>
                $35.00
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Step 3: Payment Method */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <WalletMoneyBrokenIcon size={22} color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {isRTL ? "روش پرداخت" : "Payment Method"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setPaymentMethod("card")}
            activeOpacity={0.8}
            style={[
              styles.optionBox,
              {
                backgroundColor: paymentMethod === "card" ? colors.tint + "12" : colors.surface,
                borderColor: paymentMethod === "card" ? colors.tint : colors.border,
                flexDirection: isRTL ? "row-reverse" : "row",
              },
            ]}
          >
            <View style={[styles.radioCircle, { borderColor: paymentMethod === "card" ? colors.tint : colors.textSecondary }]}>
              {paymentMethod === "card" && <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />}
            </View>

            <View style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {isRTL ? "درگاه آنلاین کارت‌های شتاب" : "Online Payment (Debit/Credit)"}
              </Text>
              <Text style={[styles.optionSub, { color: colors.textSecondary }]}>
                {isRTL ? "پرداخت امن با کلیه کارت‌های عضو شتاب" : "Secure payment processing"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentMethod("wallet")}
            activeOpacity={0.8}
            style={[
              styles.optionBox,
              {
                backgroundColor: paymentMethod === "wallet" ? colors.tint + "12" : colors.surface,
                borderColor: paymentMethod === "wallet" ? colors.tint : colors.border,
                flexDirection: isRTL ? "row-reverse" : "row",
              },
            ]}
          >
            <View style={[styles.radioCircle, { borderColor: paymentMethod === "wallet" ? colors.tint : colors.textSecondary }]}>
              {paymentMethod === "wallet" && <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />}
            </View>

            <View style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {isRTL ? "اعتبار کیف پول کاردیانی" : "Cardiani Wallet Balance"}
              </Text>
              <Text style={[styles.optionSub, { color: colors.textSecondary }]}>
                {isRTL ? "موجودی فعلی: ۴۵۰,۰۰۰ تومان" : "Available Balance: $450.00"}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Step 4: Summary Breakdown */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? "right" : "left", marginBottom: 12 }]}>
            {isRTL ? "خلاصه سفارش" : "Order Summary"}
          </Text>

          <View style={styles.breakdownRow}>
            <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>{isRTL ? "مبلغ اقلام" : "Items Subtotal"}</Text>
            <Text style={{ color: colors.text, fontWeight: "700" }}>${subtotal.toFixed(2)}</Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.breakdownRow}>
              <Text style={{ color: colors.success, fontWeight: "600" }}>{isRTL ? `تخفیف (${discountPercent}٪)` : "Discount"}</Text>
              <Text style={{ color: colors.success, fontWeight: "700" }}>-${discountAmount.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.breakdownRow}>
            <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>{isRTL ? "هزینه ارسال" : "Shipping Cost"}</Text>
            <Text style={{ color: shippingFee === 0 ? colors.success : colors.text, fontWeight: "700" }}>
              {shippingFee === 0 ? (isRTL ? "رایگان" : "Free") : `$${shippingFee.toFixed(2)}`}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.breakdownRow}>
            <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{isRTL ? "مبلغ قابل پرداخت" : "Grand Total"}</Text>
            <Text style={{ color: colors.tint, fontWeight: "900", fontSize: 20 }}>${grandTotal.toFixed(2)}</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View
        style={[
          styles.bottomFooter,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={[styles.footerRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <View style={{ alignItems: isRTL ? "flex-end" : "flex-start" }}>
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "600" }}>
              {isRTL ? "مبلغ کل قابل پرداخت" : "Total to Pay"}
            </Text>
            <Text style={{ fontSize: 22, fontWeight: "900", color: colors.text }}>
              ${grandTotal.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => placeOrderMutation.mutate()}
            disabled={placeOrderMutation.isPending}
            style={[styles.payButton, { backgroundColor: colors.tint }]}
            activeOpacity={0.85}
          >
            {placeOrderMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                <Bag2BrokenIcon size={20} color="#fff" />
                <Text style={styles.payButtonText}>{isRTL ? "پرداخت و ثبت نهایی" : "Place Order"}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={!!orderConfirmed} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInUp.duration(400)} style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.successIconCircle, { backgroundColor: colors.success + "20" }]}>
              <CheckCircleBoldIcon size={64} color={colors.success} />
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isRTL ? "سفارش شما با موفقیت ثبت شد! 🎉" : "Order Placed Successfully! 🎉"}
            </Text>

            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              {isRTL
                ? "کد پیگیری سفارش و فاکتور خرید برای شما صادر شد."
                : "Your order details and tracking receipt have been issued."}
            </Text>

            {orderConfirmed && (
              <View style={[styles.receiptBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.receiptRow}>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600" }}>{isRTL ? "شماره سفارش:" : "Order ID:"}</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: "800" }}>{orderConfirmed.orderId}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600" }}>{isRTL ? "تاریخ ثبت:" : "Date:"}</Text>
                  <Text style={{ color: colors.text, fontSize: 13, fontWeight: "700" }}>{orderConfirmed.date}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600" }}>{isRTL ? "مبلغ پرداخت‌شده:" : "Amount Paid:"}</Text>
                  <Text style={{ color: colors.tint, fontSize: 15, fontWeight: "900" }}>${orderConfirmed.total.toFixed(2)}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setOrderConfirmed(null);
                router.replace("/(tabs)");
              }}
              style={[styles.doneBtn, { backgroundColor: colors.tint }]}
              activeOpacity={0.8}
            >
              <Text style={styles.doneBtnText}>{isRTL ? "بازگشت به صفحه اصلی" : "Back to Home"}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  scrollContent: { padding: Spacing.md, gap: Spacing.md },
  sectionCard: {
    padding: Spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeader: { alignItems: "center", gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  optionBox: {
    padding: Spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  optionTitle: { fontSize: 14, fontWeight: "700" },
  optionSub: { fontSize: 12, fontWeight: "500", marginTop: 2, lineHeight: 18 },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: { height: 1, marginVertical: 6 },
  bottomFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    elevation: 10,
  },
  footerRow: { justifyContent: "space-between", alignItems: "center" },
  payButton: {
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modalCard: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: "center",
  },
  successIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  modalTitle: { fontSize: 20, fontWeight: "900", textAlign: "center" },
  modalSub: { fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 20 },
  receiptBox: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.md,
    marginVertical: Spacing.lg,
    gap: 8,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  doneBtn: {
    width: "100%",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
