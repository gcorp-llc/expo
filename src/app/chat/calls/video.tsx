import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Iconify } from '@/components/ui/Iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VideoCallScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <View style={[styles.content, { paddingTop: insets.top + 100 }]}>
        <Text style={[styles.name, { color: '#FFF' }]}>User</Text>
        <Text style={[styles.status, { color: 'rgba(255,255,255,0.7)' }]}>Video Calling...</Text>
      </View>

      <View style={[styles.controls, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.buttonsRow}>
           <TouchableOpacity style={styles.controlButton}><Iconify icon="solar:videocamera-record-broken" size={28} color="#FFF" /></TouchableOpacity>
           <TouchableOpacity onPress={() => router.back()} style={[styles.endButton, { backgroundColor: colors.destructive }]}>
             <Iconify icon="solar:phone-broken" size={32} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
           </TouchableOpacity>
           <TouchableOpacity style={styles.controlButton}><Iconify icon="solar:microphone-broken" size={28} color="#FFF" /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center' },
  name: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
  status: { fontSize: 16, fontWeight: '700' },
  controls: { alignItems: 'center' },
  buttonsRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  controlButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  endButton: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' }
});
