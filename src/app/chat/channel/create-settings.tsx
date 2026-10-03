import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useStore } from '@/hooks/use-store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';
import { FloatingIconButton } from '@/components/ui/FloatingIconButton';

export default function CreateChannelSettingsScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const [isPublic, setIsPublic] = useState(true);
  const [link, setLink] = useState('');

  const isValidLink = useMemo(() => {
    if (!link) return null;
    return /^[a-zA-Z0-9_]{5,32}$/.test(link);
  }, [link]);

  const handleCreate = () => {
    if (isPublic && !isValidLink) return;
    router.push('/chat');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <View style={[styles.headerTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <FloatingIconButton icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} onPress={() => router.back()} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>{isRTL ? 'تنظیمات کانال' : 'Channel Settings'}</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'نوع کانال' : 'Channel Type'}</Text>
          <TouchableOpacity
            style={[styles.radioItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            onPress={() => setIsPublic(true)}
          >
            <View style={[styles.radio, { borderColor: isPublic ? colors.tint : colors.border }]}>
              {isPublic && <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />}
            </View>
            <View style={[styles.radioText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
               <Text style={[styles.radioTitle, { color: colors.text }]}>{isRTL ? 'کانال عمومی' : 'Public Channel'}</Text>
               <Text style={[styles.radioSub, { color: colors.textSecondary }]}>{isRTL ? 'کانال‌های عمومی در جستجو یافت می‌شوند.' : 'Public channels can be found in search.'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.radioItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            onPress={() => setIsPublic(false)}
          >
            <View style={[styles.radio, { borderColor: !isPublic ? colors.tint : colors.border }]}>
              {!isPublic && <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />}
            </View>
            <View style={[styles.radioText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
               <Text style={[styles.radioTitle, { color: colors.text }]}>{isRTL ? 'کانال خصوصی' : 'Private Channel'}</Text>
               <Text style={[styles.radioSub, { color: colors.textSecondary }]}>{isRTL ? 'کانال‌های خصوصی فقط با لینک دعوت قابل دسترسی هستند.' : 'Private channels can only be joined via invite link.'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {isPublic && (
          <View style={styles.section}>
             <Text style={[styles.sectionTitle, { color: colors.tint, textAlign: isRTL ? 'right' : 'left' }]}>{isRTL ? 'لینک دائمی' : 'Permanent Link'}</Text>
             <View style={[styles.linkContainer, { backgroundColor: colors.card, borderColor: isValidLink === false ? colors.destructive : colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.prefix, { color: colors.textSecondary }]}>t.me/</Text>
                <TextInput
                  placeholder={isRTL ? "لینک" : "link"}
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                  value={link}
                  onChangeText={setLink}
                  autoCapitalize="none"
                />
             </View>
             {link.length > 0 && (
               <Text style={[styles.feedback, { color: isValidLink ? colors.success : colors.destructive, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isValidLink
                    ? (isRTL ? `t.me/${link} در دسترس است.` : `t.me/${link} is available.`)
                    : (isRTL ? 'لینک نامعتبر است (۵ تا ۳۲ کاراکتر، حروف و اعداد).' : 'Invalid link (5-32 chars, alphanumeric).')
                  }
               </Text>
             )}
          </View>
        )}
      </ScrollView>

      <View style={[styles.fabContainer, { [isRTL ? 'left' : 'right']: 20, bottom: insets.bottom + 20 }]}>
         <TouchableOpacity
           style={[styles.fab, { backgroundColor: colors.tint, opacity: (!isPublic || isValidLink) ? 1 : 0.5 }]}
           onPress={handleCreate}
           disabled={isPublic && !isValidLink}
         >
            <Iconify icon="solar:check-read-bold" size={28} color="#fff" />
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
  content: { padding: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 14, fontWeight: '800', marginBottom: 16, textTransform: 'uppercase' },
  radioItem: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  radioText: { flex: 1, gap: 2 },
  radioTitle: { fontSize: 16, fontWeight: '700' },
  radioSub: { fontSize: 13, lineHeight: 18 },
  linkContainer: { width: '100%', height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, alignItems: 'center' },
  prefix: { fontSize: 16, fontWeight: '600' },
  input: { flex: 1, fontSize: 16, fontWeight: '600' },
  feedback: { marginTop: 8, fontSize: 13, fontWeight: '600' },
  fabContainer: { position: 'absolute', zIndex: 100 },
  fab: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } }
});
