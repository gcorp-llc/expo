import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Iconify } from '@/components/ui/Iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface GlassHeaderProps {
  title: string;
  showSearch?: boolean;
  onSearchChange?: (text: string) => void;
  onMenuPress?: () => void;
}

export const GlassHeader = ({ title, showSearch = true, onSearchChange, onMenuPress }: GlassHeaderProps) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 4, borderBottomColor: colors.border, backgroundColor: colors.headerBackground }]}>
      <View style={styles.content}>
        <View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>kutik</Text>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
            <Iconify icon="solar:magnifer-bold" width={20} height={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]} onPress={onMenuPress}>
            <Iconify icon="solar:menu-dots-bold" width={20} height={20} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}>
            <Iconify icon="solar:magnifer-bold" width={18} height={18} color={colors.icon} style={styles.searchIcon} />
            <TextInput placeholder="Search" placeholderTextColor={colors.textSecondary} style={[styles.searchInput, { color: colors.text }]} onChangeText={onSearchChange} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, borderBottomWidth: StyleSheet.hairlineWidth },
  content: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  subtitle: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  title: { fontSize: 30, lineHeight: 34, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  searchContainer: { paddingHorizontal: 12, paddingBottom: 10 },
  searchBar: { height: 38, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: StyleSheet.hairlineWidth },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, padding: 0 },
});