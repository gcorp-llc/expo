import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Iconify } from '@/components/ui/Iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VoiceCallScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceStrong }]}>
      <View style={[styles.content, { paddingTop: insets.top + 100 }]}>
        <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
          <Iconify icon="solar:user-broken" size={80} color={colors.textSecondary} />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>User</Text>
        <Text style={[styles.status, { color: colors.tint }]}>Calling...</Text>
      </View>

      <View style={[styles.controls, { paddingBottom: insets.bottom + 40 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.endButton, { backgroundColor: colors.destructive }]}>
          <Iconify icon="solar:phone-broken" size={32} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center' },
  avatar: { width: 150, height: 150, borderRadius: 75, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  name: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
  status: { fontSize: 16, fontWeight: '700' },
  controls: { alignItems: 'center' },
  endButton: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' }
});
