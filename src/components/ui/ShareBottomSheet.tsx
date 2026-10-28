import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,
  Image,
  Linking,
  Share,
  Modal,
} from "react-native";
import Toast from "react-native-toast-message";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Iconify } from "@/components/ui/Iconify";
import { BlurView } from "expo-blur";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export interface ShareBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface ShareBottomSheetProps {
  title?: string;
  isRTL?: boolean;
}

export const ShareBottomSheet = forwardRef<
  ShareBottomSheetRef,
  ShareBottomSheetProps
>(({ title = "Share", isRTL = false }, ref) => {
  const colorScheme = (useColorScheme() ?? "light") as "light" | "dark";
  const colors = Colors[colorScheme];
  const [visible, setVisible] = useState(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  const open = () => {
    setVisible(true);
    opacity.value = withTiming(1, { duration: 250 });
    translateY.value = withTiming(0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  };

  const close = () => {
    opacity.value = withTiming(0, { duration: 180 });
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: 220, easing: Easing.in(Easing.quad) },
      () => {
        runOnJS(setVisible)(false);
      },
    );
  };

  useImperativeHandle(ref, () => ({ open, close }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={close}
      animationType="none"
      statusBarTranslucent
    >
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "box-none" }]}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheetContainer,
            sheetStyle,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}
        >
          <BlurView
            intensity={Platform.OS === "ios" ? 20 : 0}
            style={StyleSheet.absoluteFill}
            tint={colorScheme}
          />

          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.contactsScroll,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.contactItem}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: `https://i.pravatar.cc/100?u=${i + 10}` }}
                  style={[styles.contactAvatar, { borderColor: colors.border }]}
                />
                <Text
                  style={[styles.contactName, { color: colors.textSecondary }]}
                >
                  {isRTL ? "کاربر " + i : "User " + i}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View
            style={[
              styles.actionsGrid,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            {[
              {
                id: "copy",
                label: isRTL ? "کپی لینک" : "Copy Link",
                icon: "solar:copy-broken",
                color: "#3B82F6",
                onPress: async () => {
                  Toast.show({
                    type: "success",
                    text1: isRTL ? "لینک کپی شد" : "Link Copied",
                    text2: isRTL
                      ? "لینک پروفایل به حافظه موقت کپی گردید"
                      : "Profile link copied to clipboard",
                  });
                  close();
                },
              },
              {
                id: "telegram",
                label: isRTL ? "تلگرام" : "Telegram",
                icon: "solar:plain-broken",
                color: "#229ED9",
                onPress: async () => {
                  const url = `https://t.me/share/url?url=${encodeURIComponent("https://kutik.app/user/profile")}&text=${encodeURIComponent(isRTL ? "مشاهده پروفایل در کوتیک" : "Check out my profile on Kutik")}`;
                  await Linking.openURL(url).catch(() => {});
                  close();
                },
              },
              {
                id: "whatsapp",
                label: isRTL ? "واتس‌اپ" : "WhatsApp",
                icon: "solar:phone-broken",
                color: "#25D366",
                onPress: async () => {
                  const msg = encodeURIComponent(
                    (isRTL
                      ? "مشاهده پروفایل در کوتیک: "
                      : "Check out my profile on Kutik: ") +
                      "https://kutik.app/user/profile",
                  );
                  await Linking.openURL(`whatsapp://send?text=${msg}`).catch(
                    () =>
                      Linking.openURL(
                        `https://api.whatsapp.com/send?text=${msg}`,
                      ),
                  );
                  close();
                },
              },
              {
                id: "instagram",
                label: isRTL ? "اینستاگرام" : "Instagram",
                icon: "solar:camera-broken",
                color: "#E1306C",
                onPress: async () => {
                  await Linking.openURL("instagram://app").catch(() =>
                    Linking.openURL("https://instagram.com"),
                  );
                  close();
                },
              },
              {
                id: "sms",
                label: isRTL ? "پیامک" : "SMS",
                icon: "solar:chat-line-broken",
                color: "#F59E0B",
                onPress: async () => {
                  const msg = encodeURIComponent(
                    (isRTL
                      ? "سلام، پروفایل من در اپلیکیشن کوتیک: "
                      : "Hi, view my Kutik profile: ") +
                      "https://kutik.app/user/profile",
                  );
                  await Linking.openURL(`sms:?body=${msg}`).catch(() => {});
                  close();
                },
              },
              {
                id: "more",
                label: isRTL ? "بیشتر" : "More",
                icon: "solar:menu-dots-broken",
                color: colors.textSecondary,
                onPress: async () => {
                  await Share.share({
                    message:
                      (isRTL ? "پروفایل کوتیک: " : "Kutik Profile: ") +
                      "https://kutik.app/user/profile",
                  }).catch(() => {});
                  close();
                },
              },
            ].map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.7}
                onPress={action.onPress}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: action.color + "15" },
                  ]}
                >
                  <Iconify icon={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.actionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

ShareBottomSheet.displayName = "ShareBottomSheet";

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    borderTopWidth: 1,
    minHeight: 380,
  },
  handleContainer: {
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  contactsScroll: {
    paddingHorizontal: 24,
    gap: 20,
    marginBottom: 32,
  },
  contactItem: {
    alignItems: "center",
    gap: 8,
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
  },
  contactName: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  actionBtn: {
    width: (SCREEN_WIDTH - 32 - 36) / 4,
    aspectRatio: 0.85,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 10,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
});
