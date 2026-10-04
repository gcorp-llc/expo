import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { width } = Dimensions.get("window");

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const BentoSkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 16,
  style,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const baseColor = isDark ? "#2a2d32" : "#e5e7eb";
  const highlightColor = isDark ? "#3f444c" : "#f3f4f6";

  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.9, { duration: 900, easing: easing.inOut(easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const BentoProductSkeleton: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Image Bento Box Skeleton */}
      <View style={styles.imageBox}>
        <BentoSkeletonBox width="100%" height={380} borderRadius={28} />
      </View>

      {/* Bento Grid layout */}
      <View style={styles.gridContainer}>
        {/* Title & Price Bento Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <BentoSkeletonBox width="70%" height={26} borderRadius={8} />
          <BentoSkeletonBox width="40%" height={22} borderRadius={8} style={{ marginTop: 12 }} />
          <View style={styles.row}>
            <BentoSkeletonBox width={90} height={28} borderRadius={12} />
            <BentoSkeletonBox width={100} height={28} borderRadius={12} />
          </View>
        </View>

        {/* 2-Column Bento Info Cards */}
        <View style={styles.twoColumnRow}>
          <View style={[styles.colCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <BentoSkeletonBox width={36} height={36} borderRadius={18} />
            <BentoSkeletonBox width="80%" height={14} borderRadius={6} style={{ marginTop: 12 }} />
            <BentoSkeletonBox width="60%" height={12} borderRadius={6} style={{ marginTop: 6 }} />
          </View>
          <View style={[styles.colCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <BentoSkeletonBox width={36} height={36} borderRadius={18} />
            <BentoSkeletonBox width="80%" height={14} borderRadius={6} style={{ marginTop: 12 }} />
            <BentoSkeletonBox width="60%" height={12} borderRadius={6} style={{ marginTop: 6 }} />
          </View>
        </View>

        {/* Seller Info Bento Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sellerHeader}>
            <BentoSkeletonBox width={48} height={48} borderRadius={24} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <BentoSkeletonBox width="60%" height={18} borderRadius={6} />
              <BentoSkeletonBox width="40%" height={12} borderRadius={6} style={{ marginTop: 6 }} />
            </View>
          </View>
        </View>

        {/* Description Bento Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <BentoSkeletonBox width="40%" height={20} borderRadius={6} />
          <BentoSkeletonBox width="100%" height={14} borderRadius={6} style={{ marginTop: 12 }} />
          <BentoSkeletonBox width="90%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
          <BentoSkeletonBox width="75%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
        </View>

        {/* Reviews Bento Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <BentoSkeletonBox width="50%" height={20} borderRadius={6} />
          <BentoSkeletonBox width="100%" height={80} borderRadius={16} style={{ marginTop: 14 }} />
        </View>
      </View>
    </View>
  );
};

export const BentoCartSkeleton: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: 16 }]}>
      {/* Shipping progress Bento Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 16 }]}>
        <BentoSkeletonBox width="80%" height={18} borderRadius={6} />
        <BentoSkeletonBox width="100%" height={8} borderRadius={4} style={{ marginTop: 12 }} />
      </View>

      {/* Cart Items Bento list */}
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[styles.cartItemCard, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 12 }]}
        >
          <BentoSkeletonBox width={84} height={84} borderRadius={16} />
          <View style={{ flex: 1, marginLeft: 14, justifyContent: "space-between" }}>
            <BentoSkeletonBox width="75%" height={16} borderRadius={6} />
            <BentoSkeletonBox width="40%" height={18} borderRadius={6} />
            <BentoSkeletonBox width="60%" height={28} borderRadius={10} />
          </View>
        </View>
      ))}

      {/* Summary Bento Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 8 }]}>
        <BentoSkeletonBox width="40%" height={18} borderRadius={6} />
        <BentoSkeletonBox width="100%" height={14} borderRadius={6} style={{ marginTop: 12 }} />
        <BentoSkeletonBox width="100%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
        <BentoSkeletonBox width="100%" height={20} borderRadius={6} style={{ marginTop: 16 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageBox: { width: "100%", paddingHorizontal: 16, paddingTop: 16 },
  gridContainer: { padding: 16, gap: 14 },
  card: { padding: 18, borderRadius: 24, borderWidth: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  twoColumnRow: { flexDirection: "row", gap: 12 },
  colCard: { flex: 1, padding: 16, borderRadius: 20, borderWidth: 1 },
  sellerHeader: { flexDirection: "row", alignItems: "center" },
  cartItemCard: { flexDirection: "row", padding: 12, borderRadius: 20, borderWidth: 1 },
});
