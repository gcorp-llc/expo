import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useStore } from '@/hooks/use-store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { Image } from 'expo-image';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';
import * as ImagePicker from 'expo-image-picker';

export default function CreateChannelDetailsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <View style={[styles.headerTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <FloatingIconButton icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} onPress={() => router.back()} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>{isRTL ? 'کانال جدید' : 'New Channel'}</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={[styles.avatarPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handlePickImage}>
           {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} /> : <Iconify icon="solar:camera-bold" size={40} color={colors.tint} />}
        </TouchableOpacity>

        <View style={styles.inputGroup}>
           <Text style={[styles.label, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'نام کانال' : 'Channel Name'}</Text>
           <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
             <TextInput
               placeholder={isRTL ? "نام کانال خود را وارد کنید" : "Enter channel name"}
               placeholderTextColor={colors.textSecondary}
               style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
               value={name}
               onChangeText={setName}
               autoFocus
             />
           </View>
        </View>

        <View style={styles.inputGroup}>
           <Text style={[styles.label, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'توضیحات' : 'Description'}</Text>
           <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border, height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
             <TextInput
               placeholder={isRTL ? "توضیحاتی برای کانال (اختیاری)" : "Description (optional)"}
               placeholderTextColor={colors.textSecondary}
               style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
               value={description}
               onChangeText={setDescription}
               multiline
             />
           </View>
           <Text style={[styles.hint, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
             {isRTL ? 'شما می‌توانید توضیحات مربوط به کانال خود را در اینجا بنویسید.' : 'You can provide an optional description for your channel.'}
           </Text>
        </View>
      </ScrollView>

      <View style={[styles.fabContainer, { [isRTL ? 'left' : 'right']: 20, bottom: insets.bottom + 20 }]}>
         <TouchableOpacity
           style={[styles.fab, { backgroundColor: colors.tint, opacity: name.trim() ? 1 : 0.5 }]}
           onPress={() => router.push({ pathname: '/chat/channel/create-settings', params: { name, description, avatar } })}
           disabled={!name.trim()}
         >
            <Iconify icon={isRTL ? "solar:alt-arrow-left-bold" : "solar:alt-arrow-right-bold"} size={28} color="#fff" />
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: { alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  content: { padding: 24, alignItems: 'center' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 32, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  inputGroup: { width: '100%', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase' },
  inputContainer: { width: '100%', height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, fontSize: 16, fontWeight: '600' },
  hint: { marginTop: 8, fontSize: 13, lineHeight: 18 },
  fabContainer: { position: 'absolute', zIndex: 100 },
  fab: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } }
});
