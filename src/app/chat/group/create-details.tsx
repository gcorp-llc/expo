import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useStore } from '@/hooks/use-store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import { TelegramImagePickerModal } from '@/components/ui/TelegramImagePickerModal';
import * as ImagePicker from 'expo-image-picker';

export default function CreateGroupDetailsScreen() {
  const router = useRouter();
  const { memberIds } = useLocalSearchParams<{ memberIds: string }>();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const [groupName, setGroupName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  const handlePickImage = () => {
    setPickerModalVisible(true);
  };

  const pickFromCamera = async () => {
    setPickerModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatar(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    setPickerModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleCreate = () => {
    if (!groupName.trim()) return;
    // In a real app, call API here
    router.push('/chat');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <View style={[styles.headerTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <FloatingIconButton
            icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"}
            onPress={() => router.back()}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'گروه جدید' : 'New Group'}
          </Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={[styles.avatarPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handlePickImage}>
           {avatar ? (
             <Image source={{ uri: avatar }} style={styles.avatar} />
           ) : (
             <View style={styles.cameraIconContainer}>
                <Iconify icon="solar:camera-bold" size={40} color={colors.tint} />
             </View>
           )}
        </TouchableOpacity>

        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
           <TextInput
             placeholder={isRTL ? "نام گروه" : "Group Name"}
             placeholderTextColor={colors.textSecondary}
             style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
             value={groupName}
             onChangeText={setGroupName}
             autoFocus
           />
           <TouchableOpacity style={styles.emojiButton}>
              <Iconify icon="solar:smile-circle-broken" size={24} color={colors.textSecondary} />
           </TouchableOpacity>
        </View>

        <Text style={[styles.hint, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {isRTL ? 'لطفاً نام گروه و در صورت تمایل یک تصویر برای آن انتخاب کنید.' : 'Please provide a group name and an optional group icon.'}
        </Text>
      </ScrollView>

      <View style={[styles.fabContainer, { [isRTL ? 'left' : 'right']: 20, bottom: insets.bottom + 20 }]}>
         <TouchableOpacity
           style={[styles.fab, { backgroundColor: colors.tint, opacity: groupName.trim() ? 1 : 0.5 }]}
           onPress={handleCreate}
           disabled={!groupName.trim()}
         >
            <Iconify icon="solar:check-read-bold" size={28} color="#fff" />
         </TouchableOpacity>
      </View>

      <TelegramImagePickerModal
        visible={pickerModalVisible}
        onClose={() => setPickerModalVisible(false)}
        onPickCamera={pickFromCamera}
        onPickGallery={pickFromGallery}
        title={isRTL ? 'تصویر گروه' : 'Group Image'}
        isRTL={isRTL}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: { alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  content: { padding: 30, alignItems: 'center' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 30, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  cameraIconContainer: { alignItems: 'center', justifyContent: 'center' },
  inputContainer: { width: '100%', height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: { flex: 1, fontSize: 16, fontWeight: '600' },
  emojiButton: { padding: 4 },
  hint: { marginTop: 12, fontSize: 14, lineHeight: 20, width: '100%' },
  fabContainer: { position: 'absolute', zIndex: 100 },
  fab: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } }
});
