import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Iconify } from '@/components/ui/Iconify';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface CulturalPreset {
  id: string;
  titleFa: string;
  titleEn: string;
  uri: string;
  category: 'architecture' | 'carpet' | 'miniature' | 'nature';
}

export const IRANIAN_COVER_PRESETS: CulturalPreset[] = [
  {
    id: 'cov-1',
    titleFa: 'معماری و کاشی‌کاری ایرانی',
    titleEn: 'Persian Architecture & Tilework',
    uri: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1000&q=80',
    category: 'architecture',
  },
  {
    id: 'cov-2',
    titleFa: 'نقوش اسلیمی و فرش ایرانی',
    titleEn: 'Persian Carpet & Eslimi Motifs',
    uri: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1000&q=80',
    category: 'carpet',
  },
  {
    id: 'cov-3',
    titleFa: 'آثار تاریخی تخت جمشید',
    titleEn: 'Persepolis & Ancient Persia',
    uri: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1000&q=80',
    category: 'architecture',
  },
  {
    id: 'cov-4',
    titleFa: 'طبیعت شاخص ایران (دماوند)',
    titleEn: 'Mount Damavand & Nature',
    uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80',
    category: 'nature',
  },
];

export const IRANIAN_AVATAR_PRESETS: CulturalPreset[] = [
  {
    id: 'av-1',
    titleFa: 'نگارگری سنتی',
    titleEn: 'Traditional Miniature Art',
    uri: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80',
    category: 'miniature',
  },
  {
    id: 'av-2',
    titleFa: 'گل و مرغ ایرانی',
    titleEn: 'Gol-o-Morgh Pattern',
    uri: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80',
    category: 'miniature',
  },
  {
    id: 'av-3',
    titleFa: 'کاشی‌کاری سنتی',
    titleEn: 'Persian Tilework',
    uri: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=500&q=80',
    category: 'architecture',
  },
  {
    id: 'av-4',
    titleFa: 'طرح هنری اسلیمی',
    titleEn: 'Eslimi Art Design',
    uri: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=500&q=80',
    category: 'carpet',
  },
];

interface CulturalImagePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  type: 'avatar' | 'cover';
  onSelectImage: (uri: string) => void;
  isRTL?: boolean;
}

export const CulturalImagePickerModal = ({
  isVisible,
  onClose,
  type,
  onSelectImage,
  isRTL = true,
}: CulturalImagePickerModalProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const presets = type === 'cover' ? IRANIAN_COVER_PRESETS : IRANIAN_AVATAR_PRESETS;
  const title = type === 'cover'
    ? (isRTL ? 'انتخاب تصویر کاور از فرهنگ ایرانی' : 'Select Persian Cultural Cover')
    : (isRTL ? 'انتخاب آواتار از هنر ایرانی' : 'Select Persian Cultural Avatar');

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {isRTL
                  ? 'مجموعه‌ای از نقوش اسلیمی، کاشی‌کاری، نگارگری و طبیعت اصیل ایران'
                  : 'Curated collection of Persian patterns, tilework & art'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Iconify icon="solar:close-circle-broken" size={26} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
            {presets.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                onPress={() => {
                  onSelectImage(preset.uri);
                  onClose();
                }}
                activeOpacity={0.8}
                style={[
                  type === 'cover' ? styles.coverCard : styles.avatarCard,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <Image
                  source={{ uri: preset.uri }}
                  style={type === 'cover' ? styles.coverImg : styles.avatarImg}
                  contentFit="cover"
                  transition={300}
                />
                <View style={[styles.presetLabel, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                  <Text style={styles.presetText}>
                    {isRTL ? preset.titleFa : preset.titleEn}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: '80%',
    padding: 20,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  gridContainer: {
    gap: 14,
    paddingBottom: 20,
  },
  coverCard: {
    width: '100%',
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  coverImg: { width: '100%', height: '100%' },
  avatarCard: {
    width: '100%',
    height: 110,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  avatarImg: { width: '100%', height: '100%' },
  presetLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  presetText: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'center' },
});
