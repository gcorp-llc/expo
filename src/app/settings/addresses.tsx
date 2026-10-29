import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { useModalStore } from "@/hooks/use-modal-store";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useStore } from "@/hooks/use-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated";
import { Iconify } from "@/components/ui/Iconify";
import { FloatingIconButton } from "@/components/ui/FloatingIconButton";

// Import react-native-maps فقط برای موبایل با guard کامل
let MapView: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = null;

if (Platform.OS !== "web") {
  try {
    const maps = require("react-native-maps");
    MapView = maps.default || maps;
    Marker = maps.Marker;
    PROVIDER_DEFAULT = maps.PROVIDER_DEFAULT;
  } catch (e) {
    console.warn("Failed to load react-native-maps:", e);
  }
}

export interface AddressItem {
  id: string;
  title: string;
  iconName: string;
  fullAddress: string;
  recipientName: string;
  phoneNumber: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: "addr-1",
    title: "خانه",
    iconName: "solar:home-broken",
    fullAddress: "تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۴، واحد ۵",
    recipientName: "کاربر کوتیک",
    phoneNumber: "۰۹۱۲۳۴۵۶۷۸۹",
    latitude: 35.7575,
    longitude: 51.41,
    isDefault: true,
  },
  {
    id: "addr-2",
    title: "محل کار",
    iconName: "solar:case-broken",
    fullAddress: "تهران، خیابان آزادی، ناحیه نوآوری شریف، برج فناوری، طبقه ۳",
    recipientName: "کاربر کوتیک",
    phoneNumber: "۰۹۱۲۹۸۷۶۵۴۳",
    latitude: 35.7022,
    longitude: 51.352,
    isDefault: false,
  },
];

export default function AddressesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const showModal = useModalStore((state) => state.showModal);
  const { language } = useStore();
  const isRTL = language === "fa";
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [iconName, setIconName] = useState("solar:home-broken");
  const [fullAddress, setFullAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 35.6892,
    longitude: 51.389,
  });

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setIconName("solar:home-broken");
    setFullAddress("");
    setRecipientName("کاربر کوتیک");
    setPhoneNumber("۰۹۱۲۳۴۵۶۷۸۹");
    setCoords({ latitude: 35.6892, longitude: 51.389 });
    setModalVisible(true);
  };

  const openEditModal = (addr: AddressItem) => {
    setEditingId(addr.id);
    setTitle(addr.title);
    setIconName(addr.iconName || "solar:home-broken");
    setFullAddress(addr.fullAddress);
    setRecipientName(addr.recipientName);
    setPhoneNumber(addr.phoneNumber);
    setCoords({
      latitude: addr.latitude || 35.6892,
      longitude: addr.longitude || 51.389,
    });
    setModalVisible(true);
  };

  const handleSaveAddress = () => {
    if (!title.trim() || !fullAddress.trim()) {
      showModal({
        title: isRTL ? "خطای ورودی" : "Error",
        message: isRTL ? "لطفاً عنوان و نشانی متنی کامل را وارد کنید." : "Please fill required fields.",
        icon: "solar:danger-circle-bold",
        iconColor: colors.destructive,
        buttons: [{ text: isRTL ? "متوجه شدم" : "OK", style: "primary" }],
      });
      return;
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title,
                iconName,
                fullAddress,
                recipientName,
                phoneNumber,
                latitude: coords.latitude,
                longitude: coords.longitude,
              }
            : item
        )
      );
    } else {
      const newAddr: AddressItem = {
        id: `addr-${Date.now()}`,
        title,
        iconName,
        fullAddress,
        recipientName,
        phoneNumber,
        latitude: coords.latitude,
        longitude: coords.longitude,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }
    setModalVisible(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }))
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Coordinated Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <FloatingIconButton
            icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
            onPress={() => router.back()}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? "نشانی‌های ارسال" : "Addresses"}
          </Text>
          <FloatingIconButton
            icon="solar:map-point-wave-broken"
            onPress={openAddModal}
            color={colors.tint}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {addresses.map((addr, index) => (
          <Animated.View
            key={addr.id}
            entering={FadeInDown.delay(index * 100).duration(400)}
            style={[styles.addressCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.cardHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <View style={[styles.iconChip, { backgroundColor: colors.tint + "18" }]}>
                <Iconify icon="solar:map-point-broken" size={20} color={colors.tint} />
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
                  <Text style={[styles.addrTitle, { color: colors.text }]}>{addr.title}</Text>
                  {addr.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: colors.success + "18" }]}>
                      <Text style={[styles.defaultText, { color: colors.success }]}>
                        {isRTL ? "پیش‌فرض" : "Default"}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.addrText, { color: colors.textSecondary, textAlign: isRTL ? "right" : "left" }]}>
                  {addr.fullAddress}
                </Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={[styles.cardFooter, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <TouchableOpacity
                onPress={() => handleSetDefault(addr.id)}
                style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 6 }}
              >
                <Iconify
                  icon={addr.isDefault ? "solar:check-circle-bold" : "solar:check-circle-broken"}
                  size={18}
                  color={addr.isDefault ? colors.success : colors.textSecondary}
                />
                <Text style={{ fontSize: 13, fontWeight: "700", color: addr.isDefault ? colors.success : colors.textSecondary }}>
                  {isRTL ? "انتخاب به عنوان پیش‌فرض" : "Set as default"}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 12 }}>
                <TouchableOpacity onPress={() => openEditModal(addr)} hitSlop={8}>
                  <Iconify icon="solar:pen-2-broken" size={18} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAddress(addr.id)} hitSlop={8}>
                  <Iconify icon="solar:trash-bin-trash-broken" size={18} color={colors.destructive} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Smooth Reanimated Edit/Add Address Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeIn.duration(280)}
            exiting={FadeOut.duration(200)}
            style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}>
              {editingId
                ? isRTL ? "ویرایش نشانی" : "Edit Address"
                : isRTL ? "افزودن نشانی جدید" : "Add New Address"}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {/* Map View Picker - فقط برای موبایل */}
              <View style={[styles.mapContainer, { borderColor: colors.border }]}>
                {Platform.OS !== "web" && MapView && Marker ? (
                  <>
                    <MapView
                      provider={PROVIDER_DEFAULT}
                      style={styles.map}
                      initialRegion={{
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      onPress={(e: any) => setCoords(e.nativeEvent.coordinate)}
                    >
                      <Marker coordinate={coords} title={title || "موقعیت انتخاب شده"} />
                    </MapView>
                    <View style={styles.mapHint}>
                      <Text style={styles.mapHintText}>
                        {isRTL ? "نقشه تعاملی: برای تغییر موقعیت روی نقشه لمس کنید" : "Tap map to set pin"}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.webMapPlaceholder}>
                    <Iconify icon="solar:map-point-broken" size={40} color={colors.textSecondary} />
                    <Text style={[styles.webMapText, { color: colors.textSecondary }]}>
                      {isRTL ? "نقشه در وب پشتیبانی نمی‌شود" : "Map not available on web"}
                    </Text>
                    <Text style={[styles.webMapSubtext, { color: colors.textSecondary }]}>
                      {isRTL ? "لطفاً از اپلیکیشن موبایل استفاده کنید" : "Please use mobile app"}
                    </Text>
                  </View>
                )}
              </View>

              {/* Title Field */}
              <View style={[styles.inputGroup, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}
                  placeholder={isRTL ? "عنوان نشانی (مانند خانه، شرکت)" : "Address Title (e.g. Home, Office)"}
                  placeholderTextColor={colors.textSecondary}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Full Address Text */}
              <View style={[styles.inputGroup, { borderColor: colors.border, backgroundColor: colors.surface, height: 80 }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, textAlign: isRTL ? "right" : "left", height: "100%", textAlignVertical: "top" }]}
                  placeholder={isRTL ? "نشانی متنی دقیق (شهر، خیابان، پلاک، واحد)" : "Full street address details"}
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  value={fullAddress}
                  onChangeText={setFullAddress}
                />
              </View>

              {/* Recipient Name */}
              <View style={[styles.inputGroup, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}
                  placeholder={isRTL ? "نام گیرنده" : "Recipient Name"}
                  placeholderTextColor={colors.textSecondary}
                  value={recipientName}
                  onChangeText={setRecipientName}
                />
              </View>

              {/* Phone Number */}
              <View style={[styles.inputGroup, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, textAlign: isRTL ? "right" : "left" }]}
                  placeholder={isRTL ? "شماره تماس گیرنده" : "Phone Number"}
                  placeholderTextColor={colors.textSecondary}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
            </ScrollView>

            <View style={[styles.modalActions, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.cancelBtn, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontWeight: "700" }}>{isRTL ? "انصراف" : "Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveAddress}
                style={[styles.saveBtn, { backgroundColor: colors.tint }]}
              >
                <Text style={{ color: "#fff", fontWeight: "800" }}>{isRTL ? "ذخیره نشانی" : "Save Address"}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: "transparent", paddingHorizontal: 16 },
  headerContent: {
    height: 52,
    alignItems: "center",
    justifyContent: "space-between",
  },
  floatingHeaderBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  scrollContent: { padding: 16, gap: 16 },
  addressCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: { alignItems: "flex-start", gap: 12 },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addrTitle: { fontSize: 16, fontWeight: "800" },
  defaultBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  defaultText: { fontSize: 11, fontWeight: "800" },
  addrText: { fontSize: 13, fontWeight: "500", marginTop: 4, lineHeight: 20 },
  divider: { height: 1 },
  cardFooter: { justifyContent: "space-between", alignItems: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxHeight: "85%",
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: "800" },
  mapContainer: {
    height: 160,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
  },
  map: { width: "100%", height: "100%" },
  mapHint: {
    position: "absolute",
    bottom: 6,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mapHintText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  webMapText: { fontSize: 14, fontWeight: "600" },
  webMapSubtext: { fontSize: 12, fontWeight: "500" },
  inputGroup: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  input: { fontSize: 14, fontWeight: "600" },
  modalActions: { gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});