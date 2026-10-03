import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/hooks/use-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Iconify } from '@/components/ui/Iconify';

export default function HelpScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language } = useStore();
  const isRTL = language === 'fa';

  const HelpItem = ({ icon, label }: any) => (
    <TouchableOpacity style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.surfaceStrong }]}>
      <View style={[styles.left, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Iconify icon={icon} size={22} color={colors.tint} />
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      <Iconify icon={isRTL ? "solar:alt-arrow-left-broken" : "solar:alt-arrow-right-broken"} size={18} color={colors.icon} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Iconify icon={isRTL ? "solar:alt-arrow-right-broken" : "solar:alt-arrow-left-broken"} size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isRTL ? 'راهنما' : 'Help Center'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HelpItem icon="solar:info-circle-broken" label={isRTL ? 'سوالات متداول' : 'FAQ'} />
        <HelpItem icon="solar:letter-broken" label={isRTL ? 'تماس با ما' : 'Contact Us'} />
        <HelpItem icon="solar:shield-check-broken" label={isRTL ? 'شرایط و قوانین' : 'Terms & Conditions'} />
        <HelpItem icon="solar:star-broken" label={isRTL ? 'امتیاز به اپلیکیشن' : 'Rate App'} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
  headerContent: { height: 60, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 16 },
  row: { paddingHorizontal: 16, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  left: { alignItems: 'center', gap: 12 },
  label: { fontSize: 16, fontWeight: '500' },
});
