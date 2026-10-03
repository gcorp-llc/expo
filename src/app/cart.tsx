import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useStore } from "@/hooks/use-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Iconify } from "@/components/ui/Iconify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mobileCartService, mobileOrderService } from "@/services/api";

export default function CartScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === "fa";

  const [statusMsg, setStatusMsg] = useState("");

  // 1. Query Persistent Cart Items
  const { data: cartItems = [], isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: mobileCartService.getCart,
  });

  // 2. Quantity updates mutation
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

  // 3. Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: () => mobileOrderService.checkout(undefined, undefined),
    onSuccess: () => {
      setStatusMsg(isRTL ? "پیش‌سفارش ثبت شد و موجودی رزرو گردید!" : "Pre-order created & inventory reserved!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setTimeout(() => {
        router.push("/(tabs)/favorites"); // Let's route to orders tab (favorites tab acts as placeholder or we can navigate settings/profile)
      }, 1000);
    },
    onError: (err: any) => {
      setStatusMsg(err.message);
    },
  });

  if (isCartLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Iconify
              icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? "سبد خرید" : "Shopping Cart"}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {statusMsg ? (
        <View style={{ backgroundColor: colors.surfaceStrong, padding: 12, margin: 16, borderRadius: 12 }}>
          <Text style={{ color: colors.tint, fontSize: 13, fontWeight: "bold", textAlign: "center" }}>
            {statusMsg}
          </Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cartItems.length === 0 ? (
          <View style={{ py: 60, alignItems: "center" }}>
            <Iconify icon="solar:cart-large-minimalistic-broken" size={64} color={colors.textSecondary} />
            <Text style={{ color: colors.text, marginTop: 12, fontWeight: "bold" }}>
              {isRTL ? "سبد خرید شما خالی است." : "Your shopping cart is empty."}
            </Text>
          </View>
        ) : (
          cartItems.map((item: any) => (
            <View
              key={item.item_id}
              style={[
                styles.cartItem,
                {
                  flexDirection: isRTL ? "row-reverse" : "row",
                  backgroundColor: colors.surfaceStrong,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={[styles.itemInfo, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                  {isRTL ? "شناسه محصول:" : "Product ID:"} {item.product_id.substring(0, 8)}...
                </Text>
                <Text style={[styles.itemPrice, { color: colors.tint }]}>
                  {isRTL ? "تعداد:" : "Qty:"} {item.quantity}
                </Text>
                <View style={[styles.quantityRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <TouchableOpacity
                    onPress={() => updateQtyMutation.mutate({ itemId: item.item_id, qty: item.quantity - 1 })}
                    style={[
                      styles.qtyBtn,
                      { borderWidth: 1.2, borderColor: colors.border, backgroundColor: colors.surface },
                    ]}
                  >
                    <Iconify icon="solar:minus-square-broken" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQtyMutation.mutate({ itemId: item.item_id, qty: item.quantity + 1 })}
                    style={[
                      styles.qtyBtn,
                      { borderWidth: 1.2, borderColor: colors.border, backgroundColor: colors.surface },
                    ]}
                  >
                    <Iconify icon="solar:add-square-broken" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => updateQtyMutation.mutate({ itemId: item.item_id, qty: 0 })}
                style={styles.removeBtn}
              >
                <Iconify icon="solar:trash-bin-trash-broken" size={20} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: colors.background }]}>
          <View style={[styles.totalRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
              {isRTL ? "کل اقلام سبد" : "Total items"}
            </Text>
            <Text style={[styles.totalPrice, { color: colors.text }]}>
              {cartItems.reduce((acc: number, curr: any) => acc + curr.quantity, 0)} {isRTL ? "عدد" : "pcs"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => checkoutMutation.mutate()}
            style={[
              styles.checkoutBtn,
              { borderColor: colors.border, borderWidth: 1.2, backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.checkoutBlur}>
              <Text style={[styles.checkoutText, { color: colors.text }]}>
                {checkoutMutation.isPending
                  ? isRTL
                    ? "در حال ثبت سفارش..."
                    : "Processing..."
                  : isRTL
                    ? "ادامه فرآیند خرید و رزرو انبار"
                    : "Reserve Stock & Checkout"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { borderBottomWidth: 1 },
  headerContent: { height: 60, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8 },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scrollContent: { padding: 16, gap: 12 },
  cartItem: { padding: 12, borderRadius: 14, alignItems: "center", gap: 12, borderWidth: 1 },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 15, fontWeight: "700" },
  itemPrice: { fontSize: 16, fontWeight: "800" },
  quantityRow: { alignItems: "center", gap: 12, marginTop: 4 },
  qtyBtn: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 14, overflow: "hidden" },
  qtyText: { fontSize: 15, fontWeight: "700", minWidth: 20, textAlign: "center" },
  removeBtn: { padding: 8 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: "rgba(128,128,128,0.1)", gap: 16 },
  totalRow: { justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 16, fontWeight: "600" },
  totalPrice: { fontSize: 20, fontWeight: "800" },
  checkoutBtn: { height: 58, borderRadius: 24, overflow: "hidden" },
  checkoutBlur: { flex: 1, alignItems: "center", justifyContent: "center" },
  checkoutText: { fontSize: 17, fontWeight: "900" },
});
